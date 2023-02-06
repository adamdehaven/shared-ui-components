import { DATADOG_TRACE_ID_LOCALSTORAGE_KEY } from '../constants'
import { AxiosError } from 'axios'

export default function useApiError() {
  /**
   * Store the trace id into localStorage
   * @param {AxiosError} error
   * @returns {void}
   */
  const setTraceIdFromError = (error: AxiosError<unknown, any>): void => {
    if (!error) {
      return
    }

    /**
     * Grab the trace id from the response.headers if present.
     * otherwise, as long as Datadog RUM is present, fallback to the request.headers
     * */
    const ddTraceId: string = (error?.response?.headers && error.response.headers['x-datadog-trace-id']) || (error?.request?.headers && error.request.headers['x-datadog-trace-id']) || ''

    if (ddTraceId) {
      localStorage.setItem(DATADOG_TRACE_ID_LOCALSTORAGE_KEY, ddTraceId)
    }
  }

  return {
    setTraceIdFromError,
  }
}
