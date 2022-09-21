export interface WindowComposable {
  getLocationSearch: () => string,
  getLocationHostname: () => string,
  getLocationHref: () => string,
  getLocationPathname: () => string,
  getLocationOrigin: () => string,
  getUrlSearchParams: () => URLSearchParams,
  setLocationHref: (url: string) => void
}

// Using a function to retrieve window.location properties so it can be stubbed in Cypress
export default function useWindow(): WindowComposable {
  const getLocationSearch = (): string => window?.location?.search || ''

  const getLocationHostname = (): string => window?.location?.hostname || ''

  const getLocationHref = (): string => window?.location?.href || ''

  const getLocationPathname = (): string => window?.location?.pathname || ''

  const getLocationOrigin = (): string => window?.location?.origin || ''

  const getUrlSearchParams = (): URLSearchParams => new URLSearchParams(getLocationSearch())

  const setLocationHref = (url: string): void => {
    window.location.href = url
  }

  return {
    getLocationSearch,
    getLocationHostname,
    getLocationHref,
    getLocationPathname,
    getLocationOrigin,
    getUrlSearchParams,
    setLocationHref,
  }
}
