import sharedViteConfig from '../../vite.config.shared'
import { resolve } from 'path'
import { defineConfig, mergeConfig } from 'vite'

// Package name MUST always match the kebab-case package name inside the component's package.json file and the name of your `/packages/{package-name}` directory
const packageName = 'konnect-app-shell'

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
  base: '/',
  server: {
    proxy: {
      // TODO when KHCP-5497 consume this from the helper function
      '^/(?!([a-z]{2}/)?(index.ts|App.vue|router.ts|pages|sandbox|mesh-manager|src|node_modules|@vite|@id|@fs))': {
        // TODO when PR-3589 merged to main in khcp-ui this needs to be replaced to https://cloud.konghq.tech/
        target: 'https://pr-deploy-preview-3589--konnect-client-dev.netlify.app/',
        changeOrigin: true,
        cookieDomainRewrite: 'localhost',
        // TODO: remove commented debugging
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
      },
    },
  },
}))

// If we are trying to preview a build of the local `package/konnect-app-shell/sandbox` directory,
// unset the external and lib properties
if (process.env.PREVIEW_SANDBOX) {
  config.build.rollupOptions.external = undefined
  config.build.lib = undefined
}

export default config
