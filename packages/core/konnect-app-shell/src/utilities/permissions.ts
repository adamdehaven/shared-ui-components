import composables from '../composables'
import type { RequestedPermissionKrn } from '../types'

const { canUserAccess: canUserAccessOriginal } = composables.usePermissions()

/**
 * Returns a boolean indicating if the provided RequestedPermissionKrn arguments grant the user access.
 * @param {RequestedPermissionKrn} requestedPermission The krn service, action, and resourcePath
 * @returns {Promise<boolean>}
 */
const canUserAccess = async (requestedPermission: RequestedPermissionKrn): Promise<boolean> => {
  // Force the `fetchMissingPermissions` param to true for the original function
  return canUserAccessOriginal(requestedPermission, true)
}

export {
  canUserAccess,
}