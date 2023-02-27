/* eslint-disable no-var */
export {}

declare global {
  namespace globalThis {
    var DD_RUM: Record<any, any>
    var kongUiConfig: Record<any, any>
  }
}
