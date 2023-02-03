// KRN from the KAuth API
export interface KrnFromApi {
  actions?: string[]
  resource?: string
}

// Break down the resource path into separate entities (for 'userCanAccess' function)
export interface ParsedKrn {
  service?: string | null // e.g. 'konnect', 'accounts'
  region?: string | null // e.g. 'us'
  organization?: string | null // e.g. string<UUID>
  resourcePath?: string | null // e.g. null, 'runtimegroups', 'runtimegroups/{id}', 'teams/{id}/roles/{roleID}'
}

// Permission Krn
export interface RequestedPermissionKrn {
  /** The service the krn is a member of, defined in the kauth YAML file. Examples: 'konnect', 'accounts' */
  service: string
  /** The action required to access the route, including the leading hash `#`. Examples: '#retrieve', '#create' */
  action: string
  /** The krn resource the user needs to access. This is everything after the organization id in the krn resource. Examples: `services/{UUID}`, `null` */
  resourcePath: string | null
}

export interface RequestedPermissionDictionary {
  [key: string]: RequestedPermissionKrn
}

export interface AddKrnAction {
  krns: KrnFromApi[]
  replaceAll?: boolean
}
