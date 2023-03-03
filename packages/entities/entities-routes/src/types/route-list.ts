import type { KonnectConfig, KongManagerConfig, FilterSchema } from '@kong-ui/entities-shared'

/** Konnect route list config */
export interface KonnectRouteListConfig extends KonnectConfig {
  controlPlaneId: string
}

/** Kong Manager route list config */
export interface KongManagerRouteListConfig extends KongManagerConfig {
  isExactMatch?: boolean
  /** FilterSchema for fuzzy match */
  filterSchema?: FilterSchema
}
