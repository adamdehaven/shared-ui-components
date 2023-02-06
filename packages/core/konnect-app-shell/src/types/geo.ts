export interface Geo {
  code: string // geo code, e.g. 'us'
  name: string // Display name of the geo from en.json
  userCanSelect: boolean // default to true
  isActive: boolean // default to false
  isActiveOverride: boolean // default to false
}

export interface GeoSelectOptionItem {
  label: string
  value: string
  selected?: boolean
}
