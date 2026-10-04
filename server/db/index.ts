import { readFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { PGlite } from '@electric-sql/pglite';
import { drizzle as drizzlePglite } from 'drizzle-orm/pglite';
import { drizzle as drizzlePostgres, type PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

// Two drivers, ONE pg-core schema + queries. When AIWA has provisioned a real Neon database for this
// app, DATABASE_URL is present (injected via .env) → use postgres-js so data PERSISTS across preview
// restarts and deploys. Otherwise (frontend-only apps, or the instant pre-provision state) fall back to
// ephemeral in-VM PGlite (Postgres compiled to WASM). The generated routes import `db` and never know
// which driver backs it. NOTE: the DIRECT (non-pooled) Neon URL is used deliberately — postgres-js keeps
// prepared statements, which the -pooler (PgBouncer transaction mode) would break.
const DATABASE_URL = process.env.DATABASE_URL;

// A driver-agnostic exec (run a multi-statement SQL string, discard the result) + a row counter, so
// initDb below has a single code path for both drivers.
let rawExec: (sql: string) => Promise<void>;
let rawCount: (sql: string) => Promise<number>;
let rawRows: (sql: string) => Promise<Record<string, unknown>[]>;
let database: PostgresJsDatabase<typeof schema>;

if (DATABASE_URL) {
  // ssl: 'verify-full' validates Neon's certificate chain + hostname (Neon chains to a public CA in
  // Node's bundled trust store), so the link to the persistent DB is authenticated, not just encrypted.
  // max: 5 keeps a small pool for one Node process. connect_timeout: 10 (seconds) bounds a connect against
  // a cold/unreachable Neon: without it a route module that runs a top-level `await db.query()` at import
  // would hang mountRoutes forever, so the server never reaches serve() and port 3001 never opens. With it
  // the connect rejects after 10s, the query throws, and boot proceeds (initDb catches; routes stay guarded).
  const sql = postgres(DATABASE_URL, { max: 5, ssl: 'verify-full', connect_timeout: 10, onnotice: () => {} });
  database = drizzlePostgres(sql, { schema });
  // .simple() forces the SIMPLE query protocol: schema.sql / seed.sql are multi-statement strings, which
  // postgres-js's default (extended) protocol rejects ("cannot insert multiple commands into a prepared
  // statement"). Simple protocol also runs the whole string as one implicit transaction, so a partial
  // seed failure rolls back cleanly (the _aiwa_meta marker is then not set → clean retry next boot).
  rawExec = async (s) => {
    await sql.unsafe(s).simple();
  };
  rawCount = async (s) => {
    const rows = await sql.unsafe(s);
    return rows.length;
  };
  rawRows = async (s) => (await sql.unsafe(s)) as unknown as Record<string, unknown>[];
} else {
  const client = new PGlite();
  // PGlite's drizzle type differs but the runtime query API is identical; cast to the canonical
  // (postgres-js) type so generated routes see one concrete `db` type either way.
  database = drizzlePglite(client, { schema }) as unknown as PostgresJsDatabase<typeof schema>;
  rawExec = async (s) => {
    await client.exec(s);
  };
  rawCount = async (s) => {
    const r = await client.query(s);
    return (r.rows as unknown[]).length;
  };
  rawRows = async (s) => (await client.query(s)).rows as Record<string, unknown>[];
}

export const db = database;

/**
 * The owner every seed row in a user-owned table is written with. The pipeline cannot know who will
 * sign in, so the seed belongs to nobody until `adoptDemoRows` hands it to the first account.
 */
export const DEMO_OWNER_ID = '00000000-0000-0000-0000-000000000000';
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
let adoption: Promise<void> | null = null;

/**
 * Hand the boot seed's demo rows to the FIRST account that signs in, exactly once per database.
 *
 * Every generated route scopes its queries by the signed-in user id, so seed rows written under the
 * demo owner were invisible to everyone: a signed-in dashboard opened empty on first paint even when
 * the prompt asked for months of data. `requireUser` calls this after verifying the token and before
 * the handler runs, so the account's first query already finds the rows. Later accounts start empty:
 * demo data never leaks into a real customer's account. On PGlite the data and the marker reset with
 * every boot, so the next sign-in adopts again, which is right.
 *
 * Memoised per process (one promise for every concurrent request of the first page load); never
 * throws (a failure is logged and the memo cleared so a later request retries). The decision is
 * atomic: the marker insert and the updates run in ONE DO block, so a concurrent second process
 * that loses the marker race changes nothing.
 */
export function adoptDemoRows(userId: string): Promise<void> {
  // Validated BEFORE the memo: a malformed id must not claim the one adoption slot of this process.
  if (!UUID_RE.test(userId)) {
    console.warn('[db] demo adoption skipped: the user id is not a uuid');
    return Promise.resolve();
  }
  if (!adoption) {
    adoption = runAdoption(userId).catch((e) => {
      console.error('[db] demo adoption failed:', (e as Error).message);
      adoption = null;
    });
  }
  return adoption;
}

async function runAdoption(userId: string): Promise<void> {
  await rawExec('CREATE TABLE IF NOT EXISTS _aiwa_meta (key text PRIMARY KEY)');
  if ((await rawCount("SELECT 1 FROM _aiwa_meta WHERE key = 'demo_adopted'")) > 0) return;
  const tables = (
    await rawRows(
      "SELECT table_name FROM information_schema.columns WHERE table_schema = 'public' AND column_name = 'user_id' AND data_type = 'uuid'"
    )
  )
    .map((r) => String(r.table_name ?? ''))
    .filter((t) => /^[a-z_][a-z0-9_]*$/i.test(t) && t !== '_aiwa_meta');
  if (tables.length === 0) {
    await rawExec("INSERT INTO _aiwa_meta (key) VALUES ('demo_adopted') ON CONFLICT DO NOTHING");
    console.log('[db] demo adoption: no user-owned tables');
    return;
  }
  const counts: Record<string, number> = {};
  for (const t of tables) counts[t] = await rawCount(`SELECT 1 FROM "${t}" WHERE "user_id" = '${DEMO_OWNER_ID}'`);
  const updates = tables.map((t) => `  UPDATE "${t}" SET "user_id" = '${userId}' WHERE "user_id" = '${DEMO_OWNER_ID}';`).join('\n');
  await rawExec(`DO $$
DECLARE won integer;
BEGIN
  INSERT INTO _aiwa_meta (key) VALUES ('demo_adopted') ON CONFLICT DO NOTHING;
  GET DIAGNOSTICS won = ROW_COUNT;
  IF won = 0 THEN RETURN; END IF;
${updates}
END $$;`);
  for (const t of tables) if (counts[t] > 0) console.log(`[db] adopted demo rows for ${t}: ${counts[t]}`);
}

/**
 * Apply the pipeline-generated DDL + seed at boot. `schema.sql` (CREATE TABLE IF NOT EXISTS) and
 * `seed.sql` (INSERTs) are written by the AIWA generation pipeline (deterministic from the inferred
 * schema); a frontend-only app has neither → no-op. Failures are logged, never thrown.
 *
 * Seeding is idempotent via a `_aiwa_meta` marker so it runs EXACTLY ONCE per database. On a persistent
 * Neon DB the marker survives restarts, so the seed never duplicates and never overwrites real user data.
 * On ephemeral PGlite the marker table is recreated empty each boot, so it re-seeds (correct — the DB
 * itself reset). One code path, correct for both drivers. A second marker key, `demo_adopted`, records
 * that the seed's user-owned rows were handed to the first account (see adoptDemoRows above).
 */
export async function initDb(): Promise<void> {
  const here = dirname(fileURLToPath(import.meta.url));
  const read = async (file: string): Promise<string> => {
    try {
      const sql = await readFile(join(here, file), 'utf-8');
      return sql.trim() ? sql : '';
    } catch {
      return ''; // not present (e.g. a frontend-only app)
    }
  };

  const schemaSql = await read('schema.sql');
  if (schemaSql) {
    try {
      await rawExec(schemaSql);
      console.log('[db] applied schema.sql');
    } catch (e) {
      console.error('[db] failed to apply schema.sql:', (e as Error).message);
    }
  }

  const seedSql = await read('seed.sql');
  if (seedSql) {
    try {
      await rawExec('CREATE TABLE IF NOT EXISTS _aiwa_meta (key text PRIMARY KEY)');
      const seeded = await rawCount("SELECT 1 FROM _aiwa_meta WHERE key = 'seeded'");
      if (seeded === 0) {
        // Seed + marker in ONE exec (one implicit transaction under .simple() / a single PGlite exec), so
        // a crash between them can't leave a seeded-but-unmarked DB that re-seeds (and duplicates) next boot.
        await rawExec(`${seedSql}\nINSERT INTO _aiwa_meta (key) VALUES ('seeded') ON CONFLICT DO NOTHING;`);
        console.log('[db] applied seed.sql');
      } else {
        console.log('[db] seed skipped (already seeded)');
      }
    } catch (e) {
      console.error('[db] failed to apply seed.sql:', (e as Error).message);
    }
  }
}
