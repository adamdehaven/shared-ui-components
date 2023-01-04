export interface SessionUser {
  id: string
  email: string
  full_name: string
  preferred_name: string,
  is_owner: boolean,
  feature_set: string,
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
}

export interface SessionData {
  user?: SessionUser | null
  organization?: SessionOrganization | null
  to?: string | { path: string, name?: string, [key: string]: any }
}
