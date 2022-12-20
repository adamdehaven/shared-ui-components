import type { Geo } from './geo'

export interface KonnectAppShellState {
  loading: boolean
  error: boolean
  errorMessage: {
    header: string
    text: string
  }
  activeGeo: Geo | undefined
  hideNavbar: boolean
  hideSidebar: boolean
}
