// These symbols are imported by both `packages/app-layout` and `packages/konnect-app-shell`
export default {
  // AppNavbar
  appNavbarHidden: Symbol('AppNavbar is hidden'),
  // AppSidebar
  appSidebarTopItems: Symbol('AppSidebar topItems'),
  appSidebarBottomItems: Symbol('AppSidebar bottomItems'),
  appSidebarProfileItems: Symbol('AppSidebar profileItems'),
  appSidebarProfileName: Symbol('AppSidebar profileName'),
  appSidebarOpen: Symbol('AppSidebar is the mobile menu open?'),
  appSidebarHidden: Symbol('AppSidebar is hidden'),
  // KonnectAppShell
  appLayoutHideDefaultSlot: Symbol('Should the AppLayout default slot be hidden?'),
}
