import type { Geo } from './geo'

export interface KonnectAppShellState {
  loading: boolean
  error: {
    show: boolean
    header: string
    text: string
  }
  hideSidebarItems: boolean
  activeGeo: Geo | undefined
}
