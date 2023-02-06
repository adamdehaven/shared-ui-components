import sharedViteConfig from '../../../vite.config.shared'
import { resolve } from 'path'
import { defineConfig, mergeConfig } from 'vite'

// Package name MUST always match the kebab-case package name inside the component's package.json file and the name of your `/packages/{package-name}` directory
const packageName = 'konnect-global-search'

const mutateCookieAttributes = (proxy: any) => {
  proxy.on('proxyRes', (proxyRes: any) => {
    if (proxyRes.headers['set-cookie']) {
      proxyRes.headers['set-cookie'] = (proxyRes.headers['set-cookie']).map(h => {
        return h.replace(/Domain=.*;/, 'Domain=localhost;').replace(/Secure; /, '')
      })
    }
  })
}

// Merge the shared Vite config with the local one defined below
const config = mergeConfig(sharedViteConfig, defineConfig({
  build: {
    lib: {
      // The kebab-case name of the exposed global variable. MUST be in the format `kong-ui-{package-name}`
      // Example: name: 'kong-ui-demo-component'
      name: `kong-ui-${packageName}`,
      entry: resolve(__dirname, './src/index.ts'),
      fileName: (format) => `${packageName}.${format}.js`,
    },
  },
  server: {
    proxy: {
      // TODO: when KHCP-5497 consume this from the helper function
      '^/kauth/api': {
        target: 'https://global.api.konghq.tech/kauth',
        rewrite: (path) => path.replace(/^\/kauth\/api/, '/api'),
        changeOrigin: true,
        configure: (proxy) => {
          mutateCookieAttributes(proxy)
        },
      },

      '^/us/kong-api/konnect/api': {
        target: 'https://{geo}.api.konghq.tech/konnect-api'.replace(/\{geo\}/, 'us'),
        rewrite: (path) => path.replace('/us/kong-api/konnect/', ''),
        changeOrigin: true,
      },

      '^/eu/kong-api/konnect/api': {
        target: 'https://{geo}.api.konghq.tech/konnect-api'.replace(/\{geo\}/, 'eu'),
        rewrite: (path) => path.replace('/us/kong-api/konnect/', ''),
        changeOrigin: true,
      },

      '^/(?!(index.html|index.ts|App.vue|router.ts|pages|sandbox|mesh-manager|src|node_modules|@vite|@id|@fs|$))': {
        target: 'https://cloud.konghq.tech',
        changeOrigin: true,
        cookieDomainRewrite: 'localhost',
        /*
        configure: (proxy, _options) => {
          proxy.on('error', (err, _req, _res) => {
            console.log('proxy error', err)
          })
          proxy.on('proxyReq', (proxyReq, req, _res) => {
            console.log('Sending Request to the Target:', req.method, req.url)
          })
          proxy.on('proxyRes', (proxyRes, req, _res) => {
            console.log('Received Response from the Target:', proxyRes.statusCode, req.url)
          })
        },
        */
      },
    },
  },

}))

// If we are trying to preview a build of the local `package/konnect-global-search/sandbox` directory,
// unset the external and lib properties
if (process.env.PREVIEW_SANDBOX) {
  config.build.rollupOptions.external = undefined
  config.build.lib = undefined
}

export default config
