import { ref } from 'vue'
import type { Ref } from 'vue'
import { KAuthApi } from '../services'
import type { KAuthApi as KAuthApiType } from '../services'
import { useAppShellConfig } from './index'

// Initialize the kAuthApi ref outside the function for persistence
const kAuthApi = ref<KAuthApiType>()

export default function useKAuthApi() {
  const error = ref<boolean>(false)
  const { config, error: appShellConfigError, fetchAppShellConfig } = useAppShellConfig()

  // This init function should only be called once; preferrably in the KonnectAppShell `onBeforeMount` hook.
  const init = async (): Promise<void> => {
    try {
      if (typeof kAuthApi.value === 'undefined') {

        if (!config.value?.api?.v1?.kauth) {
          // Fetch the kong-ui/config to set the KAuth base URL
          await fetchAppShellConfig()
        }

        // If there is an error fetching the config, relay it here
        if (appShellConfigError.value) {
          throw appShellConfigError.value
        }

        kAuthApi.value = new KAuthApi(config.value?.api?.v1?.kauth)
      }
    } catch (err) {
      error.value = true

      console.error(err)
    }
  }

  return {
    init,
    kAuthApi: kAuthApi as Ref<KAuthApiType>, // Force a non-undefined type
    error,
  }
}
