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

/** A list of actions that, when checked should evaluate to `true` to allow access for a user with `#root-readonly` permissions. */
export const ROOT_READONLY_ALLOWED_ACTIONS = [
  '#list',
  '#retrieve',
]

/** The localStorage key for Datadog trace ids */
export const DATADOG_TRACE_ID_LOCALSTORAGE_KEY = 'dd_error_trace_id'

/** KAuth `/users/me` impersonation header */
export const HEADER_KONNECT_ACTING_AS = 'konnect-acting-as'
/** KAuth `/users/me` feature_set header */
export const HEADER_KONNECT_FEATURE_SET = 'konnect-feature-set'
