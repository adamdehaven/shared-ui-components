import type { App } from 'vue'
import KonnectAppShell from './components/KonnectAppShell.vue'
import type { SidebarPrimaryItem, SidebarSecondaryItem, SidebarProfileItem } from '@kong-ui/app-layout'

// Export Vue plugin as the default
export default {
  // Customize Vue plugin options as desired
  // Providing a `name` property allows for customizing the registered
  // name of your component (useful if exporting a single component).
  install: (app: App, options: { name?: string, [key: string]: any } = {}): void => {
    app.component(options.name || 'KonnectAppShell', KonnectAppShell)
  },
}

export * from './utilities'
export * from './types'
// Export types from '@kong-ui/app-layout'
export type {
  SidebarPrimaryItem,
  SidebarSecondaryItem,
  SidebarProfileItem,
}
