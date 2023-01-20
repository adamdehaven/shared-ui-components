/** The localStorage key for session data. */
export const SESSION_NAME = 'khcp_session'
/** The Cypress auth helper cookie name. */
export const CYPRESS_USER_SESSION_EXISTS = 'CYPRESS_USER_SESSION_EXISTS'

/** The global geo route (with slashes). */
export const GLOBAL_GEO_PATH = '/global/'
/** The global geo route (without slashes). */
export const GLOBAL_GEO_NAME = 'global'
/** The localStorage key prefix for the user-selected region/geo. */
export const KHCP_GEO_LOCAL_STORAGE_KEY = 'khcp-region'
/** The application routes that do **not** require authentication. */
export const AUTH_ROUTES = [
  'accept-invitation',
  'forgot-password',
  'login',
  'logout',
  'registration',
  'reset-password',
]

/** Should match the interface of `KonnectPrimaryRouteKey` in `packages/konnect-app-shell/src/types/routes.ts` */
export const KONNECT_PRIMARY_ROUTE_KEYS = [
  'overview',
  'runtime-manager',
  'mesh-manager',
  'servicehub',
  'portal',
  'analytics',
  'organization',
  'settings',
]
