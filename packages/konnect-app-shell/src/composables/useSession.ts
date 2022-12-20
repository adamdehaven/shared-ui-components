import { ref } from 'vue'
import axios from 'axios'

const session = ref()
const loading = ref<boolean>(false)
const error = ref<boolean>(false)

export default function useSession(kauthUrl: string) {

  // TODO: Add return type
  const fetch = async (): Promise<any> => {
    try {
      // Reset the state
      loading.value = true
      error.value = false

      // Fetch organization entitlements (demo)
      // TODO: replace with call via SDK
      const { data } = await axios.get(`${kauthUrl}/api/v1/organizations/me/entitlements`)

      // Store the config data
      session.value = data

      // Reset loading state
      loading.value = false

      return {
        session,
        error,
        loading,
      }
    } catch (err) {
      error.value = true
      loading.value = false

      console.error(err)

      return {
        session,
        error,
        loading,
      }
    }
  }

  return {
    fetch,
  }
}
