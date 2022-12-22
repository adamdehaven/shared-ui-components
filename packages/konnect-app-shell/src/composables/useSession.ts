import { ref } from 'vue'
import axios from 'axios'
import { SessionData, Tier } from '../types'
import { useWindow } from '@kong-ui/core'

const session = ref<SessionData>()
const loading = ref<boolean>(false)
const error = ref<boolean>(false)

export default function useSession(kauthUrl: string = '') {
  const win = useWindow()

  // TODO: Add return type
  const fetchSessionData = async (): Promise<any> => {
    try {
      // Reset the state
      loading.value = true
      error.value = false

      // TODO: Replace these calls with SDK
      const [userMe, organizationMe, organizationEntitlements] = await Promise.all([
        await axios.get(`${kauthUrl}/api/v1/users/me`),
        await axios.get(`${kauthUrl}/api/v1/organizations/me`),
        await axios.get(`${kauthUrl}/api/v1/organizations/me/entitlements`),
      ])

      // Store the config data
      session.value = {
        user: {
          id: userMe?.data?.id,
          email: userMe?.data?.email,
          full_name: userMe?.data?.full_name || '',
          preferred_name: userMe?.data?.preferred_name || '',
          is_owner: !!userMe?.data?.id && (userMe?.data?.id === organizationMe?.data?.owner_id),
          feature_set: userMe?.data?.feature_set,
        },
        organization: {
          id: organizationMe?.data?.id || '',
          name: organizationMe?.data?.name || '',
          billing_email: organizationMe?.data?.billing_email || '',
          owner_id: organizationMe?.data?.owner_id || '',
          entitlements: {
            runtime_group_limit: organizationEntitlements?.data?.runtime_group_limit || 0,
            regions: organizationEntitlements?.data?.regions || [],
            tier: {
              name: (organizationEntitlements.data.tier.name) as Tier,
              trial_expires_at: organizationEntitlements?.data?.tier?.trial_expires_at || null,
            },
          },
          created_at: organizationMe?.data?.created_at,
          updated_at: organizationMe?.data?.updated_at,
        },
      }

      return {
        session,
        error,
        loading,
      }
    } catch (err: any) {
      // TODO: write to localStorage to capture the path the user was trying to visit

      // TODO: This redirect should actually be done with an interceptor
      // If 401, redirect to /login
      if (err.response.status === 401) {
        win.setLocationHref('/login?logout=true')
      } else {
        error.value = true
        console.error(err)
      }

      return {
        session,
        error,
        loading,
      }
    } finally {
      loading.value = false
    }
  }

  return {
    session,
    fetchSessionData,
  }
}
