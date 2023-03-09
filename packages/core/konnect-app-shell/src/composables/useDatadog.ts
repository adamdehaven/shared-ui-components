import { datadogRum } from '@datadog/browser-rum'
import composables from './'
import type { RumInitConfiguration } from '@datadog/browser-rum'

export default function useDatadog() {

  const init = (): void => {
    const { config } = composables.useAppConfig()

    // If not set, exit early
    if (!config.value?.env || !config.value?.datadog?.rum) {
      return
    }

    try {
      const getMetaValue = (metaName: string): string => {
        const metaEl = document?.querySelector(`meta[name='${metaName}']`)

        return metaEl ? metaEl.getAttribute('content') || '' : ''
      }

      const service = getMetaValue('service')
      const version = getMetaValue('client')

      config.value?.datadog?.rum && datadogRum.init(<RumInitConfiguration>{
        ...config.value.datadog.rum,
        env: config.value.env,
        ...(service ? { service } : null),
        ...(version ? { version } : null),
        allowedTracingOrigins: [
          window.location.origin,
          /https:\/\/.*\.api\.konghq\.(com|tech)/,
        ],
      })
      datadogRum.startSessionReplayRecording()
    } catch (err) {
      console.error('useDatadog', err)
    }
  }

  return {
    init,
  }
}
