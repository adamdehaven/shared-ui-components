import type { Geo } from './geo'

export interface ErrorProp {
  /** Show or hide the global error state */
  show: boolean
  /** The error header text */
  header: string
  /** The error text content */
  text: string
  /** DataDog trace id for error */
  traceId: string
}

export interface KonnectAppShellState {
  activeGeo: Geo | undefined
  loading: boolean
  error: ErrorProp
}
