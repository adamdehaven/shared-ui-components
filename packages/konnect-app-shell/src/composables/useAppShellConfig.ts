import { ref } from 'vue'
import type { Ref } from 'vue'
import axios from 'axios'
import { KongUiConfig } from '../types'

// Initialize the config ref outside the function for persistence
const config = ref<KongUiConfig>()

export default function useAppShellConfig() {
  const error = ref<boolean>(false)

  const fetchAppShellConfig = async (): Promise<{
    config: Ref<KongUiConfig | undefined>
    error: Ref<boolean>
  }> => {
    try {
      // Fetch the config
      const { data } = await axios.get('/kong-ui/config')

      if (!data?.env || !data?.api) {
        throw new Error('Error fetching `/kong-ui/config`')
      }

      // Store the config data
      config.value = data

      return {
        config,
        error,
      }
    } catch (err) {
      error.value = true

      console.error(err)

      return {
        config,
        error,
      }
    }
  }

  return {
    fetchAppShellConfig,
  }
}
