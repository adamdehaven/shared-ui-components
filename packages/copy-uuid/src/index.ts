import type { App } from 'vue'
import CopyUuid from './components/CopyUuid.vue'
import { COPY_UUID_NOTIFY_KEY } from './const'
import { CopyUuidInstallOptions } from './types'

// Export Vue plugin as the default
export default {
  install: (app: App, options?: CopyUuidInstallOptions): void => {
    if (typeof options?.notify === 'function') {
      app.provide(COPY_UUID_NOTIFY_KEY, options.notify)
    }
    app.component('CopyUuid', CopyUuid)
  },
}

export { CopyUuid }

export * from './const'
export * from './types'
