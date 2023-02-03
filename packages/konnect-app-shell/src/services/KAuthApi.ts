import axios, { AxiosInstance, AxiosError, AxiosRequestConfig } from 'axios'
// KAuth v1 APIs
import {
  AuthenticationApi,
  Configuration,
  EntitlementAPIApi,
  MeAPIApi,
  OrganizationAPIApi,
  UserAPIApi,
} from '@kong/kauth-client-typescript-axios'
import composables from '../composables'
import { AUTH_ROUTES } from '../constants'
import { useWindow } from '@kong-ui/core'

export default class KongAuthApi {
  private baseUrl: string
  private failedQueue: Array<any>
  private authErrorCallback: (error: AxiosError<unknown, any>) => void
  // Set the client to public in order to utilize axios with the bound interceptors
  public client: AxiosInstance

  /**
   * KAuth v1 APIs
   * ===================================
   */
  authentication: AuthenticationApi
  entitlement: EntitlementAPIApi
  me: MeAPIApi
  organization: OrganizationAPIApi
  users: UserAPIApi

  constructor(baseUrl: string = '/kauth') {
    const { i18n: { t } } = composables.useI18n()
    const { exists, refresh, isRefreshing, destroy } = composables.useSession()
    const { setTraceIdFromError } = composables.useApiError()
    const win = useWindow()

    this.baseUrl = baseUrl || ''
    this.failedQueue = []
    this.client = axios.create({ withCredentials: true, timeout: 30000 })
    this.authErrorCallback = async (err: AxiosError<unknown, any>) => {
      // Redirect to unauthorized page if 403 response
      if (err?.response?.status === 403) {
        // TODO: Handle unauthorized error
        console.log('authErrorCallback: 403', err)
        // router.push({ name: 'unauthorized' })

        return
      }

      if (err.message.includes('code 403')) {
        return
      }

      // If 404 error from API, redirect to the 404 page and return
      if (err?.response?.status === 404) {
        // TODO: Handle not found error
        console.log('authErrorCallback: 404', err)

        return
      }

      const currentPath = win.getLocationPathname()
      const pathArray = currentPath?.split('/')
      if (err && pathArray && pathArray.length > 1 && !AUTH_ROUTES.includes(pathArray[1])) {
        // Destroy the session
        await destroy(currentPath)
        // Redirect the user to the login page to reauthenticate
        win.setLocationAssign('/login?logout=true')
      }
    }

    this.client.interceptors.response.use((res) => res, (error: AxiosError) => {
      if (error.response) {
        const originalRequest = error.config

        // If response code is 403 or 404, store datadog trace id in localStorage for display on error page(s) if not already set
        if ([403, 404].includes(error.response.status) && !localStorage.getItem('dd_error_trace_id')) {
          setTraceIdFromError(error)
        }

        if (error.code === 'ERR_NETWORK') {
          error.name = ''
          error.message = t('errors.network')
        }

        // Try to refresh the token once and then retry requests if successful
        // @ts-ignore
        if (error.response.status === 401 && !originalRequest?._retry) {
          // If the original request is to refresh the auth token, and the request has failed, do not retry requests

          if (/\/kauth\/api\/v[0-9]+\/refresh$/.test(decodeURIComponent(String(originalRequest?.url || '')))) {
            // Refresh token was invalid, so don't retry requests
            isRefreshing.value = false
            // Clear the queue
            this.processQueue(false)
            // Call error handler
            this.authErrorCallback(error)

            return Promise.reject(error)
          }

          // If there is already a refresh in progress, add pending requests to queue
          if (isRefreshing.value) {
            return new Promise((resolve, reject) => {
              this.failedQueue.push({ resolve, reject })
            }).then(
              // Refresh success, so retry requests
              () => this.client(originalRequest as AxiosRequestConfig),
            ).catch(() => {
              // Refresh failed, do not retry requests
              return Promise.reject(error)
            })
          }

          // @ts-ignore
          originalRequest._retry = true
          isRefreshing.value = true

          return new Promise((resolve, reject) => {
            // If session does not exist, do not try refreshing
            if (!exists.value) {
              if (this.authErrorCallback) {
                this.authErrorCallback(error)
              }

              isRefreshing.value = false

              return reject(error)
            }

            // Try refreshing
            refresh().then((sessionIsExpired) => {
              if (sessionIsExpired) {
                // Session is expired, so don't retry requests
                this.processQueue(false)

                this.authErrorCallback(error)
                reject(error)
              } else {
                // Session was refreshed, so do retry requests
                this.processQueue(true)
                resolve(this.client(originalRequest as AxiosRequestConfig))
              }
            }).finally(() => {
              isRefreshing.value = false
            })
          })
          // @ts-ignore
        } else if (error.response.status === 401 && originalRequest._retry) {
          // Refreshing failed after the retry, so fire the callback
          this.authErrorCallback(error)
        } else if ([403, 404].includes(error.response.status)) {
          this.authErrorCallback(error)
        }
      }

      return Promise.reject(error)
    })

    // KAuth v1 API baseConfig
    const baseConfig = new Configuration({
      basePath: this.baseUrl,
    })

    // KAuth v1 APIs
    this.authentication = new AuthenticationApi(baseConfig, baseConfig.basePath, this.client)
    this.entitlement = new EntitlementAPIApi(baseConfig, baseConfig.basePath, this.client)
    this.me = new MeAPIApi(baseConfig, baseConfig.basePath, this.client)
    this.organization = new OrganizationAPIApi(baseConfig, baseConfig.basePath, this.client)
    this.users = new UserAPIApi(baseConfig, baseConfig.basePath, this.client)
  }

  private processQueue(shouldProceed = true) {
    this.failedQueue.forEach(promise => {
      if (shouldProceed) {
        promise.resolve()
      } else {
        promise.reject()
      }
    })

    this.failedQueue = []
  }
}
