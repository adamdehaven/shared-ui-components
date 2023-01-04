import { ref } from 'vue'
import axios from 'axios'
import type { KongUiConfig } from '../types'

// Initialize the config ref outside the function for persistence
const config = ref<KongUiConfig>()

export default function useAppShellConfig() {
  const error = ref<Error>()

  const fetchAppShellConfig = async (): Promise<void> => {
    try {
      // Fetch the config
      const { data }: { data: KongUiConfig } = await axios.get('/kong-ui/config')

      // If expected data is missing, throw an error
      if (!data?.env || !data?.api?.v1?.kauth) {
        throw new Error('Could not fetch `/kong-ui/config`')
      }

      // Store the config data
      config.value = data
    } catch (err: any) {
      error.value = err
    }
  }

  return {
    config,
    error,
    fetchAppShellConfig,
  }
}
