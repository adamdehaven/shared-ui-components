/**
This is to proxy all requests that do not go '/' or '/mesh-manager' to the
destination of cloud.konghq.tech

TODO: on netlify site set the following env variables:

  for both development and production sites:
    APP_BASE_PATH = <application path> eg `mesh-manager` for kuma-mesh

  for development site
    KONNECT_BASE_URL = https://cloud.konghq.tech
  for production site
    KONNECT_BASE_URL = https://cloud.konghq.сom

 */
const konnectEdgeProxy = (konnectBaseUrl: string, appBasePath: string) => {
  return async (request: Request, context: any) => {
    const parsedRequestURL = new URL(request.url)

    const destUrl = parsedRequestURL.href.replace(parsedRequestURL.origin, konnectBaseUrl)

    if (parsedRequestURL.pathname === '/' || parsedRequestURL.pathname.match(new RegExp(`^/(?!(us/|eu/)?(${appBasePath}|src|node_modules|@vite|@id|@fs))`)) === null) {
      return context.next()
    }

    const fetchHeaders: Record<string, string> = {}

    // grabbing all the headers from the request
    request.headers.forEach((headerValue: string, headerName: string) => {
      if (!['host'].includes(headerName)) {
        fetchHeaders[headerName] = headerValue
      }
    })

    // reading request body from ReadableStream if request has body
    let bodyValueStr = ''
    if (request.body) {
      const reader = request.body.getReader()

      while (true) {
        const { value, done } = await reader.read()
        if (done) {
          break
        }
        // @ts-ignore
        bodyValueStr += String.fromCharCode.apply(null, value)
      }
    }

    // proxyng request with headers and body
    const fetchResponse = await fetch(destUrl, {
      headers: fetchHeaders,
      method: request.method,
      redirect: 'follow',
      ...(request.body ? { body: bodyValueStr } : null),
    })

    const headersArray: [string, string][] = []

    // reading proxied response headers
    fetchResponse.headers.forEach((headerValue, headerName) => {
      if (headerName !== 'set-cookie') {
        headersArray.push([headerName, headerValue])
      } else {
        // making sure Domain and Secure for cookies returning in proxied response are set correctly
        const [cookieName, ...cookieValue] = (headerValue.split('; ').map(ci => ci.indexOf('Domain=') === 0 ? `Domain=${parsedRequestURL.hostname}` : ci).join('; ')).split('=')
        let fixedCookieValue = cookieValue.join('=')

        if (parsedRequestURL.protocol === 'http:') {
          fixedCookieValue = fixedCookieValue.replace(' Secure;', '')
        }
        headersArray.push([headerName, `${cookieName}=${fixedCookieValue}`])
      }
    })
    // returning proxied response back to browser
    return new Response(fetchResponse.body, { headers: new Headers(headersArray) })
  }
}

// eslint-disable-next-line no-undef
export default konnectEdgeProxy(Deno.env.get('KONNECT_BASE_URL'), Deno.env.get('APP_BASE_PATH'))
