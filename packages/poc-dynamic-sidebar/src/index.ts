import type { App } from 'vue'
import DynamicSidebar from './components/DynamicSidebar.vue'

// Export Vue plugin as the default
export default {
  install: (app: App): void => {
    app.component('DynamicSidebar', DynamicSidebar)
  },
}

export { DynamicSidebar }

export * from './types.d'
