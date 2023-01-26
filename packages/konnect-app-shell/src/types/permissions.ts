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
  service: string // The service the krn is a member of, defined in the kauth YAML file. Examples: 'konnect', 'accounts'
  action: string // The action required to access the route. Examples: '#retrieve', '#create'
  resourcePath: string | null // The krn resource the user needs to access. This is everything after the organization id in the krn resource. Example: services/{UUID}
}

export interface AddKrnAction {
  krns: KrnFromApi[]
  replaceAll?: boolean
}
