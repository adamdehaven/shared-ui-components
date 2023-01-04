import type { Geo } from './geo'

export interface ErrorProp {
  show: boolean
  header: string
  text: string
}

export interface KonnectAppShellState {
  activeGeo: Geo | undefined
  loading: boolean
  error: ErrorProp
}
