import type { App } from 'vue'
import SidebarNav from './components/SidebarNav.vue'
import SidebarToggle from './components/SidebarToggle.vue'

// Export Vue plugin as the default
export default {
  install: (app: App, options: { name?: string, [key: string]: any } = {}): void => {
    app.component(options.name || 'SidebarNav', SidebarNav)
    app.component('SidebarToggle', SidebarToggle)
  },
}

export { SidebarNav, SidebarToggle }

export * from './types'
