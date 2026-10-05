import { createRootRoute, createRoute, createRouter, RouterProvider, Outlet } from '@tanstack/react-router'
import { ErrorScreen, NotFoundScreen } from '@/components/chrome'
import { LoadCover } from '@/components/load-cover'
import { Home } from '@/routes/home'
import { PrivacyPolicy, TermsOfService } from '@/routes/legal'

function RootLayout() {
  return (
    <>
      {/* Extrafazant neutrals (off-white, black, white, gunmetal, ash, eerie
          black). Brand red stays the accent. Inter is Helvetica Now; Instrument
          Sans is Serrif. html:root beats the template :root.dark block. */}
      <style>{`
        html:root{
          --font-display:'Instrument Sans Variable',var(--font-system-sans);
          --font-serif:'Instrument Sans Variable',var(--font-system-sans);
          --font-sans:'Inter Variable',var(--font-system-sans);
          --color-primary:#ED1C24;
          --color-primary-foreground:#FFFFFF;
          --color-background:#fbfbfb;
          --color-heading:#101010;
          --color-body:#31383b;
          --color-foreground:#101010;
          --color-card:#ffffff;
          --color-card-foreground:#101010;
          --color-secondary:#eef0f2;
          --color-secondary-foreground:#101010;
          --color-muted:#eef0f2;
          --color-muted-foreground:#7a8489;
          --color-border:color-mix(in srgb, #101010 18%, #fbfbfb);
          --color-input:color-mix(in srgb, #101010 18%, #fbfbfb);
          --color-accent:#ED1C24;
          --color-accent-foreground:#FFFFFF;
          --color-ring:#ED1C24;
          --radius:0px;
        }
        html:root.dark{
          --font-display:'Instrument Sans Variable',var(--font-system-sans);
          --font-serif:'Instrument Sans Variable',var(--font-system-sans);
          --font-sans:'Inter Variable',var(--font-system-sans);
          --color-primary:#ED1C24;
          --color-primary-foreground:#FFFFFF;
          --color-background:#101010;
          --color-heading:#f4f4f4;
          --color-body:#c8cfd3;
          --color-foreground:#f4f4f4;
          --color-card:#171c1c;
          --color-card-foreground:#f4f4f4;
          --color-secondary:#171c1c;
          --color-secondary-foreground:#f4f4f4;
          --color-muted:#171c1c;
          --color-muted-foreground:#8b969c;
          --color-border:color-mix(in srgb, #f4f4f4 22%, #101010);
          --color-input:color-mix(in srgb, #f4f4f4 22%, #101010);
          --color-accent:#ED1C24;
          --color-accent-foreground:#FFFFFF;
          --color-ring:#ED1C24;
          --radius:0px;
        }
        html{scroll-behavior:smooth}
        @media (prefers-reduced-motion: reduce){
          html{scroll-behavior:auto}
        }
        section[id]{scroll-margin-top:5rem}
      `}</style>
      <LoadCover />
      <Outlet />
    </>
  )
}

const rootRoute = createRootRoute({ component: RootLayout })

const homeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: Home,
})

const privacyRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/privacy',
  component: PrivacyPolicy,
})

const termsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/terms',
  component: TermsOfService,
})

const routeTree = rootRoute.addChildren([homeRoute, privacyRoute, termsRoute])

const router = createRouter({
  routeTree,
  defaultErrorComponent: ErrorScreen,
  defaultNotFoundComponent: NotFoundScreen,
})

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

export function App() {
  return <RouterProvider router={router} />
}