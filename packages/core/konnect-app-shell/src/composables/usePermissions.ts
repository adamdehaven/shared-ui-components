import { ref, computed } from 'vue'
import { RouteLocationNormalized, RouteRecordNormalized } from 'vue-router'
import composables from './index'
import { ROOT_READONLY_ALLOWED_ACTIONS } from '../constants'
import type { KrnFromApi, ParsedKrn, RequestedPermissionKrn, AddKrnAction, LaunchDarklyFeatureFlag } from '../types'

// Initialize these ref(s) outside the function for persistence
// Array of stored krns
const krns = ref<KrnFromApi[]>([])
// Does the user have root access
const userHasRootAccess = ref<boolean>(false)
// Does the user have root access
const userHasRootReadonlyAccess = ref<boolean>(false)
// Does the user have permissions for at least one entity (e.g. one KRN with a valid action)?
const userHasSomePermissions = computed((): boolean => krns.value.some(krn => !!krn.actions?.length && krn.actions.some(action => !!action)))

/**
 * Determine if the resource path from a KRN from the API matches a requested resource path guard.
 * Substitutes UUID for `*` matches.
 * @param {ParsedKrn} parsedKrn A parsed krn (from the API)
 * @param {string} requestedResourcePath The resource path being accessed
 * @returns {boolean}
 */
const resourcePathMatches = (parsedKrn: ParsedKrn, requestedResourcePath: string | null): boolean => {
  if (!parsedKrn) {
    return false
  }

  const parsedKrnResourcePathArray = parsedKrn.resourcePath?.split('/') || []
  const requestedResourcePathArray = requestedResourcePath?.split('/') || []

  // If the krns do not have the same path, exit early
  if (parsedKrnResourcePathArray?.length !== requestedResourcePathArray?.length) {
    return false
  }

  const pathsMatch: boolean[] = []

  requestedResourcePathArray?.forEach((requestedPathValue: string, index: number) => {
    // Set the pathMatches to false by default
    let pathMatches = false

    // If odd index, requestedPathValue is UUID or wildcard '*'
    if (index % 2) {
      pathMatches = (requestedPathValue === parsedKrnResourcePathArray[index] || parsedKrnResourcePathArray[index] === '*') && requestedPathValue !== ''
    } else {
      // If index is even number, requestedPathValue is the static entity, e.g. 'services', 'runtimegroups'
      pathMatches = requestedPathValue === parsedKrnResourcePathArray[index]
    }

    // Push boolean (true/false) depending on if either globMatches and entityMatches === true
    pathsMatch.push(pathMatches)
  })

  return pathsMatch?.every(matchFromPath => matchFromPath === true) || false
}

export default function usePermissions() {
  const { useGeo, useSession, useLaunchDarkly, useKAuthApi, useApiError } = composables
  const { setTraceIdFromError } = useApiError()

  const parseKrn = (krnResource: string): ParsedKrn => {
    const parsedKrn: ParsedKrn = {
      service: null,
      region: null,
      organization: null,
      resourcePath: null,
    }

    const KRN_STRUCT = {
      prefix: 'krn',
      regionBlockPrefix: 'reg/',
      orgBlockPrefix: 'org/',
      blockDelimeter: ':',
      pathDelimeter: '/',
    }

    // If not a valid krn, exit early
    if (!krnResource || !krnResource.startsWith(`${KRN_STRUCT.prefix}${KRN_STRUCT.blockDelimeter}`)) {
      console.error('parseKrn: Invalid KRN prefix')

      return parsedKrn
    }

    const krnBlocks = krnResource.split(KRN_STRUCT.blockDelimeter)

    const [serviceBlock, regionBlock, orgBlock, resourceBlock] = krnBlocks.slice(1)

    // length of 4 gives: krn block, service block, geo block, and org block
    if (krnBlocks.length < 4) {
      console.error('parseKrn: Invalid number of KRN blocks')

      return parsedKrn
    }

    parsedKrn.service = serviceBlock
    parsedKrn.region = regionBlock.replace(KRN_STRUCT.regionBlockPrefix, '')
    parsedKrn.organization = orgBlock.replace(KRN_STRUCT.orgBlockPrefix, '')

    if (resourceBlock !== undefined) {
      parsedKrn.resourcePath = resourceBlock
    }

    return parsedKrn
  }

  /**
   * Figure out if a user should or should not be able to get to the attempted route.
   * This is an allow list, if any of the flags match the user is allowed, or if enterpriseOnly
   * @param to - route the user is trying to access
   */
  const userCanAccessRouteWithMeta = (to: RouteLocationNormalized) => {
    if (to?.matched?.length > 0) {
      const matchedEvery = to.matched.every(match => {
        // Array of all route.meta.{properties} that can deny access to a route
        const metaAccessProperties = [
          'featureFlagsLD',
          'enterpriseOnly',
          'preventReadonlyUser',
        ]

        let hasMetaAccessProperties = false

        // Loop through all of the metaAccessProperties
        for (const prop of metaAccessProperties) {
          // If the route has at least one of the metaAccessProperties, set hasMetaAccessProperties to true
          if (Object.prototype.hasOwnProperty.call(match.meta, prop)) {
            hasMetaAccessProperties = true
          }
        }

        // If the route has no metaAccessProperties, we don't need the checks below and can return true
        if (hasMetaAccessProperties === false) {
          return true
        }

        // Checking meta properties

        const { session } = useSession()

        // if meta.enterpriseOnly is true, and the organization tier is not enterprise, reject access
        if (!!Object.prototype.hasOwnProperty.call(match.meta, 'enterpriseOnly') && match.meta.enterpriseOnly === true && !session.data?.organization?.isEnterprise) {
          return false
        }

        // if meta.preventReadonlyUser is true, and the user ONLY has `#root-readonly` permissions, reject access
        if (!!Object.prototype.hasOwnProperty.call(match.meta, 'preventReadonlyUser') && match.meta.preventReadonlyUser === true && !userHasRootAccess.value && userHasRootReadonlyAccess.value && krns.value.length === 1) {
          return false
        }

        // If LD feature flags are defined, route should evaluate each of those as true, otherwise we can return true
        return !match.meta.featureFlagsLD || (match.meta.featureFlagsLD).every((
          fFlag: LaunchDarklyFeatureFlag,
        ) => {
          const { key, value, defaultValue = false } = fFlag
          const { evaluateFeatureFlag } = useLaunchDarkly()

          return evaluateFeatureFlag(key, defaultValue) === value
        })
      })

      return matchedEvery
    }

    // Originally this function returned 'true' by default. Since this condition only returns if there are no to.matched routes, this should be able to safely return true by default since the route would not exist.
    return true
  }

  /**
   * Checks to see if a user should have access to a given route based on the
   * permissions KAuth krn(s) assigned to the route and user. If a user has `#root-readonly` permission or
   * is assigned any of the allowed roles on a route or parent route (if roles are inherited), the
   * user shoud be allowed to access the route.
   *
   * Allowed permissions for a route can be specified on the individual route, or
   * inherited from a parent route.
   *
   * @param to - route the user is trying to access
   * @param isRecursiveCall - only set to true when the function is called recursively
   * @returns {Promise<boolean>} true if the user can access the route
   */
  const userIsAuthorizedForRoute = async (to: RouteLocationNormalized): Promise<boolean> => {
    // Store the original route so that you can still access it in the recursive function
    const originalToRoute = to

    /**
     * Define an inner function that will be called recursively to check inherited permissions
     *
     * @param to - route the user is trying to access
     * @param isRecursiveCall - only set to true when the function is called recursively
     * @returns {Promise<boolean>} true if the user can access the route
     */
    const verifyUserAuthorization = async (to: RouteLocationNormalized | RouteRecordNormalized, isRecursiveCall = false): Promise<boolean> => {
      let allowAccess: boolean = false

      // Set to true if the meta.isAuthorized is not set on the route
      // or if meta.isAuthorized evaluates to true (via boolean or calling the function)
      try {
        allowAccess = to.meta?.isAuthorized === undefined ||
        // @ts-ignore
        to.meta?.isAuthorized === true ||
        (typeof to.meta?.isAuthorized === 'function' && await to.meta?.isAuthorized(originalToRoute) === true)
      } catch (err) {
        // no action needed
      }

      // If the user has `#root-readonly` access, skip all other checks and return true
      if (userHasRootReadonlyAccess.value) {
        return true
      }

      // If the user is authorized so far, and to.meta?.isAuthorized contains an explicit rule, allow the user to proceed.
      // (This logic skips checking inherited parent route permissions when a rule is set on the route itself)
      // Example: If a user can create a service at '/servicehub/create' but cannot list services at '/servicehub'
      if (allowAccess && to.meta?.isAuthorized !== undefined) {
        return true
      }

      // @ts-ignore
      if (!isRecursiveCall && to.matched && to.matched.length > 0) {
        // @ts-ignore
        const matchingRoutes = to.matched.filter(route => route.meta?.isAuthorized !== undefined)

        for (const matchedRoute of matchingRoutes) {
          const userCanProceed = await verifyUserAuthorization(matchedRoute, true)

          if (userCanProceed) {
            allowAccess = true
          } else if (!userCanProceed) {
            allowAccess = false
          }
        }
      }

      return allowAccess
    }

    return userCanAccessRouteWithMeta(to) && await verifyUserAuthorization(originalToRoute)
  }

  /**
   * Delete all stored krns, replace with empty array
   */
  const deleteAllKrns = (): void => {
    userHasRootAccess.value = false
    userHasRootReadonlyAccess.value = false
    krns.value = []
  }

  const addKrns = async (payload: AddKrnAction): Promise<void> => {
    // If replaceAll is true, first clear all stored krns
    if (payload.replaceAll === true) {
      deleteAllKrns()
    }

    // Store new krns by adding new krns to existing in state and ensure all are unique
    krns.value = [...new Set([...krns.value, ...payload.krns].map(krn => JSON.stringify(krn)))].map(krn => JSON.parse(krn))

    // Loop through all krns and check if the user should be upgraded to have root access for each top-level service
    for (const krn of krns.value) {
      const parsedKrn: ParsedKrn = parseKrn(krn.resource || '')

      /**
       * Validate the KRN for `#root` access
       * NOTE: We do not need to check for geo (or region) for root access because the updated KRN format will not include a geo for global resources
       */
      if (parsedKrn.service === 'accounts' &&
        // and the parsed resourcePath is null
        parsedKrn.resourcePath === null &&
        // and the actions list includes '#root'
        krn.actions?.includes('#root')
      ) {
        // Enable root access for user
        userHasRootAccess.value = true

        // no need to continue loop here since if a user has '#root' they inherently can read/edit/create everything
        return
      }

      /**
       * Validate the KRN for `#root-readonly` access
       * NOTE: We do not need to check for geo (or region) for root-readonly access because the updated KRN format will not include a geo for global resources
       */
      if (parsedKrn.service === 'accounts' &&
        // and the parsed resourcePath is null
        parsedKrn.resourcePath === null &&
        // and the actions list includes '#root-readonly'
        krn.actions?.includes('#root-readonly')
      ) {
        // Enable root-readonly access for user
        userHasRootReadonlyAccess.value = true
        // Do NOT return here, as we want permissions to continue to be evaluated
      }
    }

    // No `#root` access was found; ensure it is set to false
    userHasRootAccess.value = false
  }

  /**
   * Returns a boolean indicating if the provided RequestedPermissionKrn arguments grant the user access.
   * @param {RequestedPermissionKrn} requestedPermission The krn service, action, and resourcePath
   * @param {boolean} fetchMissingPermissions Should the function attempt to fetch missing permissions. Defaults to true. This should always be set to true unless being called from the `useSession.ts` to fetch top-level permissions.
   * @returns {Promise<boolean>}
   */
  const canUserAccess = async (requestedPermission: RequestedPermissionKrn, fetchMissingPermissions: boolean = true): Promise<boolean> => {
    const { service: requestedService, action, resourcePath: requestedResourcePath } = requestedPermission

    // If set, ensure the requestedResourcePath does not include invalid characters in the path
    if (requestedResourcePath && (requestedResourcePath.includes('{') || requestedResourcePath.includes('}'))) {
      console.error(`Invalid krn resource path: '${requestedResourcePath}'. Resource path cannot include '{' or '}'`)

      return false
    }

    // If set, ensure the requestedResourcePath does not include an `undefined` string
    // An `undefined` string is expected when evaluating the route guards in some scenarios as
    // provided route params will not be set at initial evaluation (e.g. when the Sidebar evaluates
    // permissions on app hydration); however, the params _will_ be present and valid in the beforeEach hook.
    if (requestedResourcePath && requestedResourcePath.includes('/undefined')) {
      // Return false since this is an invalid resourcePath
      return false
    }

    // Ensure action starts with a hash '#'
    const requestedAction = action && action.startsWith('#') ? action : `#${action}`

    // If the user has `#root` access, skip all other checks and return true
    if (userHasRootAccess.value) {
      return true
    }

    // If the requested action is included in ROOT_READONLY_ALLOWED_ACTIONS and the user has `#root-readonly` access, skip all other checks and return true
    if (userHasRootReadonlyAccess.value && ROOT_READONLY_ALLOWED_ACTIONS.includes(requestedAction)) {
      return true
    }

    // Check if any krns exist in the store that match the requestedService and requestedResourcePath
    let matchingResources = krns.value.filter((krn: KrnFromApi) => {
      const parsedKrn: ParsedKrn = parseKrn(krn.resource || '')

      // If the requested service does not equal the krn service, exit early
      if (!requestedService || requestedService !== parsedKrn.service) {
        return false
      }

      return resourcePathMatches(parsedKrn, requestedResourcePath)
    })

    // If the requestedService is defined and the user has no matching resource paths
    if (!!requestedService && matchingResources.length === 0) {
      // Request filtered krn from API to see if user has access that does not currently exist in the store
      try {
        const { getActiveGeo } = useGeo()
        const activeGeo = getActiveGeo({ allowOverride: false })?.code
        const { kAuthApi } = useKAuthApi()

        let resourceAndActionMatch

        // Fetch any missing krns
        if (fetchMissingPermissions) {
          // If params are null, send an empty string instead, and fetch permissions for the active geo
          const { data: { data: fetchedKrnPermissions } } = await kAuthApi.value.me.meAPIRetrievePermissions(requestedService || '', requestedResourcePath || '', false, [], activeGeo).catch(() => ({ data: { data: [] } }))

          if (fetchedKrnPermissions && fetchedKrnPermissions.length > 0) {
            addKrns({
              krns: (fetchedKrnPermissions as KrnFromApi[]),
            })
          }

          resourceAndActionMatch = fetchedKrnPermissions && fetchedKrnPermissions.filter((krn: KrnFromApi) => {
            const parsedKrnFromFetch: ParsedKrn = parseKrn(krn.resource || '')

            // If krn service does not match, return false
            if (requestedService !== parsedKrnFromFetch.service) {
              return false
            }

            return resourcePathMatches(parsedKrnFromFetch, requestedResourcePath) && krn.actions?.some(action => requestedAction === action)
          }).length > 0
        }

        if (resourceAndActionMatch || userHasRootAccess.value) {
          // We want to return based on the condition if our requested action matches the action returned, or if they have `#root` (not including `#root-readonly`) permission
          return true
        } else if ((requestedResourcePath && !requestedResourcePath.includes('/undefined')) || requestedResourcePath === null) {
          // Don't store if contains `/undefined`
          // No matching permissions were retrieved, so store the krn resource with an empty actions array so the session can cache the response
          const regionId = '*' // in this context, the region doesn't matter, we just need a valid krn format
          const { session } = useSession()
          const organizationId = session.data?.organization?.id || '*'
          const krnUserNoPermissions = `krn:${requestedService}:reg/${regionId}:org/${organizationId}` + (requestedResourcePath ? `:${requestedResourcePath}` : '')
          const deniedKrn: KrnFromApi = {
            resource: krnUserNoPermissions,
            actions: [],
          }

          // Add the denied krn to the store so we do not have to check again for this resource path during the session
          addKrns({
            krns: [deniedKrn],
          })
        }

        // Return unauthorized
        return false
      } catch (err) {
        // Return unauthorized on error
        return false
      }
    }

    // Filter the resources with matching resourcePath by the requested action(s)
    matchingResources = matchingResources.filter((krn: KrnFromApi) => krn.actions?.some(action => !!requestedAction && requestedAction === action))

    // Return true if the matchingResources contains an allowed action
    return matchingResources.length > 0
  }

  /**
   * Fetch the initial permissions for the user's session
   * @param topLevelOnly Should we only request the top-level permissions from the API? Defaults to false
   */
  const fetchInitialPermissions = async (topLevelOnly = false): Promise<void> => {
    const { getActiveGeo } = useGeo()
    const activeGeo = getActiveGeo({ allowOverride: false })?.code
    const { kAuthApi } = useKAuthApi()

    // Fetch top-level user permissions for the active geo; catch any errors so the app doesn't crash
    const { data: { data: userPermissions } } = await kAuthApi.value.me.meAPIRetrievePermissions('', '', topLevelOnly, [], activeGeo).catch((error) => {
      setTraceIdFromError(error)

      console.error('usePermissions(fetchInitialPermissions): could not fetch top-level permissions', error)

      // Return an empty array
      return { data: { data: [] } }
    })

    await addKrns({
      krns: userPermissions as KrnFromApi[] || [],
    })
  }

  // Computed helpers
  const isOrgAdmin = computed((): boolean => userHasRootAccess.value)
  const isOrgAdminReadonly = computed((): boolean => userHasRootReadonlyAccess.value)

  return {
    userIsAuthorizedForRoute,
    addKrns,
    canUserAccess,
    fetchInitialPermissions,
    // Export computed helpers
    userHasSomePermissions,
    isOrgAdmin,
    isOrgAdminReadonly,
  }
}
