import { RouteLocationNormalized } from 'vue-router'

export interface SessionUser {
  /** The user's unique id */
  id: string
  /** The user's email address */
  email: string
  /** The user's full name */
  full_name: string
  /** The user's preferred name */
  preferred_name: string
  /** Is the user the organization owner */
  is_owner: boolean
  /** Is the user active */
  active: boolean
  /** The region codes the user has permissions in */
  allowed_regions: string[]
  /** The Konnect (Launch Darkly) feature set */
  feature_set: string
  created_at: string
  updated_at: string
}

export type Tier = 'free' | 'plus' | 'enterprise' | '' | null

export interface OrganizationTier {
  /** The name of the organization's current tier */
  name: Tier
  /** The organization's trial period expiration */
  trial_expires_at: string | null
}

export interface OrganizationEntitlements {
  /** The organization's runtime group limit */
  runtime_group_limit: number
  /** The organization's entitled region codes */
  regions: string[]
  /** The organization's current tier information */
  tier: OrganizationTier
}

export interface SessionOrganization {
  /** The organization's unique id */
  id: string
  /** The organization name */
  name: string
  /** The organization's billing email address */
  billing_email: string
  /** The organization's owner's user id */
  owner_id: string
  /** The organization's entitlements */
  entitlements: OrganizationEntitlements
  /** The organization's IdP login_path */
  login_path: string
  created_at: string
  updated_at: string
  /** Is the organization on the Enterprise tier */
  isEnterprise: boolean
  /** Is the organization on the Plus tier */
  isPlus: boolean
  /** Is the organization on the Free tier */
  isFree: boolean
  /** Is the organization on a trial Plus tier */
  isInTrial: boolean
}

export interface SessionData {
  /** The active session user */
  user?: SessionUser | null
  /** Is KAdmin impersonation active */
  konnectActAs?: boolean
  /** The active session organization */
  organization?: SessionOrganization | null
  /** The stored route to redirect the user to after logging in */
  to?: string | {
    path: string
    name?: string
    [key: string]: any
  }
}

export interface Session {
  /** The user and organization session data */
  data: SessionData
  /**
   * Is there an existing user session?
   * @return {boolean}
   */
  exists: boolean
  /**
   * Attempt to refresh the active user session and auth cookie
   * @return {Promise<boolean>} Returns true if refresh was successful
   */
  refresh: () => Promise<boolean>
  /**
   * Destroy the user's session and log them out via KAuth
   * @param {string} loginRedirect The path to redirect the user to upon logging back in
   * @return {Promise<void>}
   */
  destroy: (loginRedirect?: RouteLocationNormalized | string) => Promise<void>
}
