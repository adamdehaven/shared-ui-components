import { ref } from 'vue'
import axios from 'axios'
import { AppShellConfig, KongUiConfig } from '../types'

const config = ref<KongUiConfig>()
const loading = ref<boolean>(false)
const error = ref<boolean>(false)

export default function useAppShellConfig() {

  // TODO: Add return type
  const fetch = async (): Promise<AppShellConfig> => {
    try {
      // Reset the state
      loading.value = true
      error.value = false

      // Fetch the config
      const { data } = await axios.get('/kong-ui/config')

      if (!data?.env || !data?.api) {
        throw new Error('Error fetching `/kong-ui/config`')
      }

      // Store the config data
      config.value = data

      // Reset loading state
      loading.value = false

      return {
        config,
        error,
        loading,
      }
    } catch (err) {
      error.value = true
      loading.value = false

      console.error(err)

      return {
        config,
        error,
        loading,
      }
    }
  }

  return {
    fetch,
  }
}
