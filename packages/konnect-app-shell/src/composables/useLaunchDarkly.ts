import { ref } from 'vue'
import * as ld from 'launchdarkly-js-client-sdk'
import type { LDClient, LDUser, LDFlagValue } from 'launchdarkly-js-client-sdk'
import { useSession, useAppConfig } from './index'
import type { FeatureFlags } from '../types'

const ldClient = ref<LDClient>()

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
  const { session, exists: sessionExists } = useSession()
  const { config } = useAppConfig()

  /**
   * Returns an LDUser object for either the active user, or an anonymous user if no session exists
   * @returns {LDUser}
   */
  const getUser = (): LDUser => {
    let ldUser
    if (sessionExists.value) {
      // Check if the user is a CI test user
      // Source: client/tests/e2e/smoke/utilities/constants.ts
      // and /client/tests/cypress/support/index.ts
      const cypressLDUser = localStorage.getItem('CYPRESS_LAUNCH_DARKLY_USER') || ''

      ldUser = {
        // Pass the Actual user, or if running in Cypress, the default Cypress user
        key: cypressLDUser || session.value?.user?.id,
        anonymous: false,
        custom: {
          orgId: session.value?.organization?.id,
          orgName: session.value?.organization?.name,
          isOwner: !!session.value?.user?.is_owner,
          featureSet: session.value?.user?.feature_set,
          tier: session.value?.organization?.entitlements?.tier?.name,
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
    }
  }

  return {
    initialize,
    ldClient,
    evaluateFeatureFlag,
  }
}
