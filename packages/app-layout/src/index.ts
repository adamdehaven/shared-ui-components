import type { App } from 'vue'
import AppLayout from './components/AppLayout.vue'
import AppNavbar from './components/navbar/AppNavbar.vue'
import NavbarDropdownMenu from './components/navbar/NavbarDropdownMenu.vue'

import AppSidebar from './components/sidebar/AppSidebar.vue'
import SidebarToggle from './components/sidebar/SidebarToggle.vue'
import AppError from './components/errors/AppError.vue'
import GruceLogo from './components/icons/GruceLogo.vue'
import KonnectLogo from './components/icons/KonnectLogo.vue'
import KonnectEnterpriseLogo from './components/icons/KonnectEnterpriseLogo.vue'
import ExternalLink from './components/ExternalLink.vue'

// Export Vue plugin as the default
export default {
  // Customize Vue plugin options as desired
  // Providing a `name` property allows for customizing the registered
  // name of your component (useful if exporting a single component).
  install: (app: App, options: { name?: string, [key: string]: any } = {}): void => {
    app.component(options.name || 'AppLayout', AppLayout)
  },
}

export {
  // Components
  AppLayout,
  AppNavbar,
  AppSidebar,
  SidebarToggle,
  AppError,
  GruceLogo,
  KonnectLogo,
  KonnectEnterpriseLogo,
  ExternalLink,
  NavbarDropdownMenu,
}

export * from './types'
