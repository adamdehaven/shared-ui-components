export interface Geo {
  /** The region code. Example: 'us' */
  code: string
  /** The display name of the region */
  name: string
  /** Is the region selectable by the user. Currently, this property is unused and is always set to `true`. */
  userCanSelect: boolean
  /** Is this the active region */
  isActive: boolean
  /** Is this region an active override of the normally active region */
  isActiveOverride: boolean
}

export interface GeoSelectOptionItem {
  label: string
  value: string
  selected?: boolean
}
