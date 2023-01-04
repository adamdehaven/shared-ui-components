export interface WindowComposable {
  getLocationHostname: () => string,
  getLocationHref: () => string,
  getLocationOrigin: () => string,
  getLocationPathname: () => string,
  getLocationSearch: () => string,
  getUrlSearchParams: () => URLSearchParams,
  setLocationHref: (url: string) => void,
  setLocationAssign: (url: string) => void,
  setLocationReplace: (url: string) => void,
}
