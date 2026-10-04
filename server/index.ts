// MUST be first: loads .env (DATABASE_URL + secrets, injected into the preview VM by AIWA) into
// process.env BEFORE ./db is imported below — ./db chooses its driver from process.env.DATABASE_URL at
// module load, so a later import would leave it undefined and silently fall back to PGlite.
import 'dotenv/config';
import { existsSync } from 'node:fs';
import { readdir } from 'node:fs/promises';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { serve } from '@hono/node-server';
import { serveStatic } from '@hono/node-server/serve-static';
import { Hono } from 'hono';
import type { Context } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import { initDb } from './db';

const app = new Hono();

/**
 * This app's own public origin, from the request.
 *
 * Read per-request rather than baked at build time because that is the only thing that stays right:
 * an app is reachable on its free subdomain AND on any custom domain its owner later attaches, and a
 * URL frozen at deploy would advertise the wrong one until the next redeploy.
 *
 * The Host header is attacker-controlled and lands in a robots.txt `Sitemap:` line and a sitemap
 * `<loc>`. Neither is a script context, but an unvalidated value would let anyone fetch a response
 * advertising someone else's domain, and a `<` would break the XML outright — so only a real
 * hostname[:port] is accepted, and anything else means those two routes fall back to relative-only
 * output rather than emitting a lie. Returns null in that case.
 */
function publicOrigin(c: Context): string | null {
  const host = (c.req.header('host') ?? '').trim();
  if (!/^[a-z0-9.-]+(:\d{1,5})?$/i.test(host)) return null;
  const forwarded = c.req.header('x-forwarded-proto')?.split(',')[0]?.trim().toLowerCase();
  // The hosting platform terminates TLS in front of this process, so the socket is plain http and only
  // the forwarded header knows the truth. Default https for a real host, http for a local run.
  const proto = forwarded === 'http' || forwarded === 'https' ? forwarded : /^(localhost|127\.)/i.test(host) ? 'http' : 'https';
  return `${proto}://${host}`;
}

app.use('/*', cors());
app.use('/*', logger()); // every /api hit prints to stdout → the host log pipe (boot-failure visibility)

/**
 * Route files that failed to mount (see mountRoutes below). Reported ONLY to AIWA's own probe (the
 * X-AIWA-Probe header the API smoke check sends) so the harness names the real error before the user
 * ever sees a 404; the public liveness answer stays { status: 'ok' }. Message only, never a stack.
 */
const mountErrors: Array<{ file: string; error: string }> = [];

app.get('/api/health', (c) =>
  c.req.header('x-aiwa-probe') ? c.json({ status: 'ok', mountErrors }) : c.json({ status: 'ok' })
);

/**
 * Mount every generated route file in server/routes/. Each file must `export default new Hono()`
 * and own its full `/api/...` paths. Discovery is dynamic (filenames are AI-generated) and each
 * import is isolated — one malformed route logs-and-skips instead of taking down the whole server.
 * This file is template-owned: generated code never edits it.
 */
async function mountRoutes(): Promise<void> {
  const here = dirname(fileURLToPath(import.meta.url));
  const routesDir = join(here, 'routes');
  let entries: string[];
  try {
    entries = await readdir(routesDir);
  } catch {
    return; // no routes dir → frontend-only app
  }
  for (const file of entries) {
    if (file.startsWith('.') || !/\.(ts|js|mjs)$/.test(file)) continue;
    try {
      const mod = await import(pathToFileURL(join(routesDir, file)).href);
      const router = mod.default;
      if (router && typeof router.fetch === 'function') {
        app.route('/', router);
        console.log(`[server] mounted route: ${file}`);
      } else {
        console.warn(`[server] route ${file} has no default Hono export — skipped`);
        mountErrors.push({ file, error: 'no default Hono export' });
      }
    } catch (e) {
      console.error(`[server] failed to mount route ${file}:`, (e as Error).message);
      mountErrors.push({ file, error: String((e as Error).message ?? e).slice(0, 400) });
    }
  }
}

async function main(): Promise<void> {
  // Start the DB init (schema + seed) WITHOUT blocking the port bind, so a cold/slow Neon connect can't
  // delay the port coming up (which surfaces as a preview 502). The readiness gate below then makes each
  // /api request wait for this to finish, so the FIRST write can't race a not-yet-created table.
  const dbReady = initDb()
    .then(() => console.log('[server] db ready'))
    .catch((e) => console.error('[server] db init failed:', (e as Error).message));

  // Readiness gate, registered BEFORE the generated routes so it wraps every one: hold each /api request
  // until the schema + seed have landed. The frontend still paints first (static), and its useEffect fetch
  // simply waits a beat instead of 500ing on a not-yet-created table. /api/health is registered earlier and
  // returns immediately (it never calls next), so the host/preview readiness probe stays instant.
  app.use('/api/*', async (_c, next) => {
    await dbReady;
    return next();
  });

  // Production single-origin serving: when a built frontend exists (a host that ran `npm run build`
  // → dist/), this one Node process serves the SPA + assets alongside /api, so the app is reachable
  // on $PORT and `/` returns 200 (the deploy healthcheck). In the development preview there is
  // NO dist/ (vite serves the frontend + proxies /api), so `isProd` is false and this is inert — the
  // preview's behaviour (including the serve() call) is byte-for-byte unchanged.
  //
  // Registered BEFORE the generated routes ON PURPOSE: generated code has repeatedly shipped wildcard
  // middleware (`app.use('*', requireUser)`, which once made a live site answer 401 at `/`) and could
  // equally ship a custom '*' middleware or a non-/api route that shadows the SPA. With static first,
  // NO generated code can affect a non-/api GET. /api/* still reaches the routes: serveStatic calls
  // next() on a miss (dist/ has no api/ files) and the SPA fallback explicitly next()s /api/* paths,
  // so API routes behave as if mounted first, and unknown /api paths still 404 instead of returning
  // index.html.
  const distDir = join(dirname(fileURLToPath(import.meta.url)), '..', 'dist');
  const isProd = existsSync(distDir);
  if (isProd) {
    const root = relative(process.cwd(), distDir) || '.';
    app.use('/*', serveStatic({ root })); // index.html + assets/*

    // Crawler files. Without these the SPA fallback below answers them like any other unmatched path,
    // so /robots.txt and /sitemap.xml returned index.html with a 200 — HTML where a crawler expects a
    // robots file, and HTML where a sitemap submission expects XML.
    //
    // Registered AFTER serveStatic on purpose: an app that ships its own public/robots.txt is served
    // that file and never reaches these, so this is only the default for apps that bring nothing.
    //
    // PROD ONLY, inside the isProd branch, so the development preview stays byte-for-byte unchanged:
    // there vite serves the frontend on its own port and these paths never reach this process anyway.
    app.get('/robots.txt', (c) => {
      const origin = publicOrigin(c);
      const body =
        'User-agent: *\nAllow: /\n' +
        // The API answers JSON; there is nothing there for an index, and crawling it only burns the
        // app's own request budget.
        'Disallow: /api/\n' +
        (origin ? `\nSitemap: ${origin}/sitemap.xml\n` : '\n');
      return c.body(body, 200, { 'Content-Type': 'text/plain; charset=utf-8' });
    });

    // One entry, because the root is the only URL this server can honestly claim exists: every other
    // route lives in the client bundle's router, which this process cannot enumerate. A one-URL
    // sitemap adds no discovery a crawler lacks, but it is valid XML where there used to be a page of
    // HTML, and it makes the Sitemap line above resolve to something real instead of 404ing.
    app.get('/sitemap.xml', (c) => {
      const origin = publicOrigin(c);
      if (!origin) return c.notFound();
      const body =
        '<?xml version="1.0" encoding="UTF-8"?>\n' +
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
        `  <url>\n    <loc>${origin}/</loc>\n    <changefreq>weekly</changefreq>\n  </url>\n` +
        '</urlset>\n';
      return c.body(body, 200, { 'Content-Type': 'application/xml; charset=utf-8' });
    });

    const indexHtml = serveStatic({ path: join(root, 'index.html') });
    app.get('*', (c, next) => (c.req.path.startsWith('/api/') ? next() : indexHtml(c, next)));
    console.log(`[server] serving built frontend from ${distDir}`);
  }

  await mountRoutes();

  const port = Number(process.env.PORT) || 3001;
  // In prod, bind 0.0.0.0 (not loopback) so a container host can route $PORT to the
  // process; in the preview, omit hostname to keep the original in-VM networking behaviour.
  serve({ fetch: app.fetch, port, ...(isProd ? { hostname: '0.0.0.0' } : {}) }, (info) => {
    console.log(`[server] listening on http://localhost:${info.port}`);
  });
}

void main();
