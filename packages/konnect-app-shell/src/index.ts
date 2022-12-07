import type { App } from 'vue'
import KonnectAppShell from './components/KonnectAppShell/KonnectAppShell.vue'
import GeoSwitcher from './components/GeoSwitcher/GeoSwitcher.vue'
import AuthValidate from './components/AuthValidate'

// Export Vue plugin as the default
export default {
  // Customize Vue plugin options as desired
  // Providing a `name` property allows for customizing the registered
  // name of your component (useful if exporting a single component).
  install: (app: App, options: { name?: string, [key: string]: any } = {}): void => {
    app.component(options.name || 'KonnectAppShell', KonnectAppShell)
  },
}

// Do not export components located in `/packages/konnect-app-shell/src/components/internal/`
export {
  AuthValidate,
  GeoSwitcher,
}
