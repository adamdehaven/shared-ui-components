import { ref, readonly } from 'vue'
import * as ld from 'launchdarkly-js-client-sdk'
import type { LDClient, LDUser, LDFlagValue } from 'launchdarkly-js-client-sdk'
import composables from './'
import type { FeatureFlags } from '../types'

// Initialize these ref(s) outside the function for persistence
const ldClient = ref<LDClient>()
const isInitialized = ref(false)

/**
 * Evaluate the provided Launch Darkly feature flag
 * @param {FeatureFlags | string} key The key of the Launch Darkly flag.
 * @param {any} defaultValue The default value to return for the flag.
 * @returns {LDFlagValue} The value of the evaluated Launch Darkly feature flag.
 */
export const evaluateFeatureFlag = (key: FeatureFlags | string, defaultValue: LDFlagValue): LDFlagValue => {
  if (!ldClient.value) {
    return defaultValue
  }
  return ldClient.value?.variation(key, defaultValue)
}

export default function useLaunchDarkly() {
  const { session } = composables.useSession()
  const { config } = composables.useAppConfig()

  /**
   * Returns an LDUser object for either the active user, or an anonymous user if no session exists
   * @returns {LDUser}
   */
  const getUser = (): LDUser => {
    let ldUser
    if (session.exists) {
      // Check if the user is a CI test user
      // Source: client/tests/e2e/smoke/utilities/constants.ts
      // and /client/tests/cypress/support/index.ts
      const cypressLDUser = localStorage.getItem('CYPRESS_LAUNCH_DARKLY_USER') || ''

      ldUser = {
        // Pass the Actual user, or if running in Cypress, the default Cypress user
        key: cypressLDUser || session.data?.user?.id,
        anonymous: false,
        custom: {
          orgId: session.data?.organization?.id,
          orgName: session.data?.organization?.name,
          isOwner: !!session.data?.user?.is_owner,
          featureSet: session.data?.user?.feature_set,
          tier: session.data?.organization?.entitlements?.tier?.name,
          platformId: config.value?.launchDarkly?.platform_id || '',
        },
      }
    } else {
      // Anonymous user
      ldUser = {
        // Use a shared key so this does not count against our MAUs
        // https://docs.launchdarkly.com/home/users/anonymous-users/?q=anonymous#tracking-anonymous-users-with-a-shared-key
        key: 'ANONYMOUS_USER',
        anonymous: true,
        custom: {
          platformId: config.value?.launchDarkly?.platform_id || '',
        },
      }

      // Remove DataDog user
      globalThis.DD_RUM && globalThis.DD_RUM.onReady(() => {
        globalThis.DD_RUM.removeUser()
      })
    }

    return ldUser as LDUser
  }

  /**
   * Initialize the Launch Darkly client
   */
  const initialize = async () => {
    if (config.value?.launchDarkly?.key) {
      ldClient.value = ld.initialize(
        config.value.launchDarkly.key,
        getUser(),
        { bootstrap: 'localStorage' },
      )

      await ldClient.value.waitUntilReady()

      isInitialized.value = true
    }
  }

  return {
    initialize,
    isInitialized: readonly(isInitialized),
    ldClient: readonly(ldClient),
    evaluateFeatureFlag,
  }
}
