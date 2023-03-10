import { ref, readonly } from 'vue'
import type { Ref } from 'vue'
import { KAuthApi } from '../services'
import type { KAuthApi as KAuthApiType } from '../services'
import composables from './'

// Initialize the kAuthApi ref outside the function for persistence
const kAuthApi = ref<KAuthApiType>()

export default function useKAuthApi() {
  const error = ref<boolean>(false)
  const { config, error: appShellConfigError, fetchAppShellConfig } = composables.useAppConfig()

  // This init function should only be called once; preferrably in the KonnectAppShell `onBeforeMount` hook.
  const init = async (): Promise<void> => {
    try {
      if (typeof kAuthApi.value === 'undefined') {

        if (!config.value || !config.value?.api?.v1?.kauth || !config.value?.api?.v2?.global) {
          // Fetch the kong-ui/config to set the KAuth base URL
          await fetchAppShellConfig()
        }

        // If there is an error fetching the config, relay it here
        if (appShellConfigError.value) {
          throw appShellConfigError.value
        }

        kAuthApi.value = new KAuthApi(config.value?.api?.v1?.kauth, config.value?.api?.v2?.global)
      }
    } catch (err) {
      error.value = true

      console.error(err)
    }
  }

  return {
    init,
    kAuthApi: readonly(kAuthApi) as Ref<KAuthApiType>, // Force a non-undefined type
    error,
  }
}
