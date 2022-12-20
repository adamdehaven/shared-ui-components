import { ref } from 'vue'
import axios from 'axios'
import { AppConfig } from '../types'

const config = ref()
const loading = ref<boolean>(false)
const error = ref<boolean>(false)

export default function useAppConfig() {

  // TODO: Add return type
  const fetch = async (): Promise<AppConfig> => {
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
