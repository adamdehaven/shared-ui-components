import type { Geo } from './geo'

export interface KonnectAppShellState {
  loading: boolean
  activeGeo: Geo | undefined
  hideNavbar: boolean
  hideSidebar: boolean
}
