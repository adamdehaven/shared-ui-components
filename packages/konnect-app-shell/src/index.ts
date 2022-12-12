import type { App } from 'vue'
import KonnectAppShell from './components/KonnectAppShell.vue'
import { symbolInjectionKeys } from '@kong-ui/app-layout'

// Export Vue plugin as the default
export default {
  // Customize Vue plugin options as desired
  // Providing a `name` property allows for customizing the registered
  // name of your component (useful if exporting a single component).
  install: (app: App, options: { name?: string, [key: string]: any } = {}): void => {
    app.component(options.name || 'KonnectAppShell', KonnectAppShell)
  },
}

export {
  // Export the symbolInjectionKeys from `@kong-ui/app-layout` so a consuming application can import them
  symbolInjectionKeys,
}

export * from './types'
// Export types from '@kong-ui/app-layout'
export {
  SidebarPrimaryItem,
  SidebarSecondaryItem,
  SidebarProfileItem,
} from '@kong-ui/app-layout/dist/types'
