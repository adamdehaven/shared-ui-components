import { RouteRecordRaw } from 'vue-router'
import { KonnectPrimaryRouteKey } from '../types'

/**
 * Generate the vue-router:routes object with the required KonnectAppShell root and geo routes.
 * @param {KonnectPrimaryRouteKey} konnectPrimaryRouteKey The Konnect global primary route key that corresponds to the top-level navigation item. e.g. `runtime-manager` or `servicehub`
 * @param {RouteRecordRaw[]} routes Initial list of host app routes that should be added to the router. No routes should start with a leading slash.
 * @param {string} homeRouteName The route name to redirect to when the user tries to go to the root of the host app.
 * @return {RouteRecordRaw[]} Array of vue-router route objects
 */
export default function generateRoutes(konnectPrimaryRouteKey: KonnectPrimaryRouteKey, routes: RouteRecordRaw[], homeRouteName?: string): RouteRecordRaw[] {
  const rootRedirectRouteName: string = homeRouteName || String(routes[0]?.name || 'home')

  return [
    {
      path: '/',
      name: 'konnect-app-shell-root',
      children: [
        {
          path: ':geo([a-z]{2})', // Must have a required geo param
          name: 'geo',
          redirect: { name: rootRedirectRouteName }, // Redirect to app home/landing page
          children: [
            {
              path: konnectPrimaryRouteKey, // Must be a child of geo route and match the top-level root app path, e.g. 'mesh-manager'
              name: konnectPrimaryRouteKey,
              redirect: { name: rootRedirectRouteName },
              children: routes,
            },
          ],
        },
      ],
    },
  ]
}
