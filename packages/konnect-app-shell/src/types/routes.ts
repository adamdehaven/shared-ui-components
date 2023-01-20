import { RouteRecordRaw } from 'vue-router'

/**
 * The Konnect top-level navigation item keys
 * Should match the interface of `KONNECT_PRIMARY_ROUTE_KEYS` in `packages/konnect-app-shell/src/constants.ts`
 */
export type KonnectPrimaryRouteKey =
  'overview' |
  'runtime-manager' |
  'mesh-manager' |
  'servicehub' |
  'portal' |
  'analytics' |
  'organization' |
  'settings'

export interface GenerateRoutesParams {
  /** The Konnect global primary route key that corresponds to the top-level navigation item. e.g. `runtime-manager` or `servicehub` */
  konnectPrimaryRouteKey: KonnectPrimaryRouteKey
  /** The type of routes the host app is adding, one of `geo` or `global`. Defaults to `geo`. */
  type?: 'geo' | 'global' // defaults to 'geo'
  /** Initial list of host app routes that should be added to the router. No route paths should start with a leading slash. */
  routes: RouteRecordRaw[]
  /** The route name to redirect to when the user tries to go to the root of the host app. */
  defaultHomeRouteName?: string
}
