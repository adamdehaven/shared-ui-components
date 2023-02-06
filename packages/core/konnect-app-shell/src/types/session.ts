import { RouteLocationNormalized } from 'vue-router'

export interface SessionUser {
  id: string
  email: string
  full_name: string
  preferred_name: string
  is_owner: boolean
  active: boolean
  feature_set: string
  created_at: string
  updated_at: string
}

export type Tier = 'free' | 'plus' | 'enterprise' | '' | null

export interface OrganizationTier {
  name: Tier
  trial_expires_at: string | null
}

export interface OrganizationEntitlements {
  runtime_group_limit: number
  regions: string[]
  tier: OrganizationTier
}

export interface SessionOrganization {
  id: string
  name: string
  billing_email: string
  owner_id: string
  entitlements: OrganizationEntitlements
  created_at: string
  updated_at: string
  isEnterprise: boolean
  isPlus: boolean
  isFree: boolean
  isInTrial: boolean
}

export interface SessionData {
  user?: SessionUser | null
  organization?: SessionOrganization | null
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
