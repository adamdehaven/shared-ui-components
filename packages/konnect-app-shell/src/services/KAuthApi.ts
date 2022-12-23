// import type { Ref } from 'vue'
// import axios, { AxiosInstance, AxiosError } from 'axios'
// // KAuth v1 APIs
// import {
//   AuthenticationApi,
//   Configuration,
//   EntitlementAPIApi,
//   MeAPIApi,
//   OrganizationAPIApi,
//   UserAPIApi,
// } from '@kong/kauth-client-typescript-axios'
// import { kauthApiBaseUrl, globalV2ApiUrl } from '@KHCP/services'
// import { useI18n, useSession } from '../composables'
// import type { SessionData, Geo } from '../types'

// export default class KongAuthApi {
//   session: Ref<SessionData | undefined>

//   authErrorCallback: (error: AxiosError) => void

//   failedQueue: Array<any>

//   /**
//    * KAuth v1 APIs
//    * ===================================
//    */
//   authentication: AuthenticationApi
//   client: AxiosInstance
//   entitlement: EntitlementAPIApi
//   me: MeAPIApi
//   organization: OrganizationAPIApi
//   users: UserAPIApi

//   constructor() {
//     const { i18n: { t } } = useI18n()
//     const { session, isRefreshing } = useSession()

//     this.session = session
//     this.authErrorCallback = () => false
//     this.failedQueue = []
//     this.client = axios.create({ withCredentials: true, timeout: parseInt(import.meta.env.VITE_AXIOS_DEFAULT_TIMEOUT) || 30000 })

//     this.client.interceptors.response.use((res) => res, (error: AxiosError) => {
//       if (error.response) {
//         const originalRequest = error.config

//         // If response code is 403 or 404, store datadog trace id in localStorage for display on error page(s) if not already set
//         if ([403, 404].includes(error.response.status) && !localStorage.getItem('dd_error_trace_id')) {
//           const ddTraceId = error.response.headers['x-datadog-trace-id']
//           if (ddTraceId) {
//             localStorage.setItem('dd_error_trace_id', ddTraceId)
//           }
//         }

//         if (error.code === 'ERR_NETWORK') {
//           error.name = ''
//           error.message = t('errors.network')
//         }

//         // Try to refresh the token once and then retry requests if successful
//         // @ts-ignore
//         if (error.response.status === 401 && !originalRequest._retry) {
//           // If the original request is to refresh the auth token, and the request has failed, do not retry requests

//           if (/\/kauth\/api\/v[0-9]+\/refresh$/.test(decodeURIComponent(originalRequest.url))) {
//             // Refresh token was invalid, so don't retry requests
//             isRefreshing.value = false
//             // Clear the queue
//             this.processQueue(false)
//             // Call error handler
//             this.authErrorCallback(error)

//             return Promise.reject(error)
//           }

//           // If there is already a refresh in progress, add pending requests to queue
//           if (isRefreshing.value) {
//             return new Promise((resolve, reject) => {
//               this.failedQueue.push({ resolve, reject })
//             }).then(
//               // Refresh success, so retry requests
//               () => this.client(originalRequest),
//             ).catch(() => {
//               // Refresh failed, do not retry requests
//               return Promise.reject(error)
//             })
//           }

//           // @ts-ignore
//           originalRequest._retry = true
//           isRefreshing.value = true

//           return new Promise((resolve, reject) => {
//             // If session does not exist, do not try refreshing
//             if (!this.session.exists()) {
//               if (this.authErrorCallback) {
//                 this.authErrorCallback(error)
//               }

//               isRefreshing.value = false

//               return reject(error)
//             }

//             // Try refreshing
//             this.session.refreshToken().then((sessionIsExpired) => {
//               if (sessionIsExpired) {
//                 // Session is expired, so don't retry requests
//                 this.processQueue(false)

//                 this.authErrorCallback(error)
//                 reject(error)
//               } else {
//                 // Session was refreshed, so do retry requests
//                 this.processQueue(true)
//                 resolve(this.client(originalRequest))
//               }
//             }).finally(() => {
//               isRefreshing.value = false
//             })
//           })
//           // @ts-ignore
//         } else if (error.response.status === 401 && originalRequest._retry) {
//           // Refreshing failed after the retry, so fire the callback
//           this.authErrorCallback(error)
//         } else if ([403, 404].includes(error.response.status)) {
//           this.authErrorCallback(error)
//         }
//       }

//       return Promise.reject(error)
//     })

//     // KAuth v1 API baseConfig
//     const baseConfig = new Configuration({
//       basePath: kauthApiBaseUrl,
//     })

//     // KAuth v1 APIs
//     this.authentication = new AuthenticationApi(baseConfig, baseConfig.basePath, this.client)
//     this.entitlement = new EntitlementAPIApi(baseConfig, baseConfig.basePath, this.client)
//     this.me = new MeAPIApi(baseConfig, baseConfig.basePath, this.client)
//     this.organization = new OrganizationAPIApi(baseConfig, baseConfig.basePath, this.client)
//     this.users = new UserAPIApi(baseConfig, baseConfig.basePath, this.client)
//   }

//   public setAuthErrorCallback(authErrorCallback?: (error: AxiosError) => void) {
//     this.authErrorCallback = authErrorCallback
//   }

//   private processQueue(shouldProceed = true) {
//     this.failedQueue.forEach(promise => {
//       if (shouldProceed) {
//         promise.resolve()
//       } else {
//         promise.reject()
//       }
//     })

//     this.failedQueue = []
//   }

//   // Allow passing in the session inside /client/src/main.ts once created
//   public setSession(session: UserSession) {
//     this.session = session
//   }
// }
