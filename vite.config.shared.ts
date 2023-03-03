/// <reference types="vitest" />

/**
 * Shared Vite config settings for all components
 */
import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import dns from 'dns'
import path, { join } from 'path'
import { visualizer } from 'rollup-plugin-visualizer'

// You can set dns.setDefaultResultOrder('verbatim') to disable the reordering behavior. Vite will then print the address as localhost
// https://vitejs.dev/config/server-options.html#server-host
dns.setDefaultResultOrder('verbatim')

// Include the rollup-plugin-visualizer if the BUILD_VISUALIZER env var is set to "true"
const buildVisualizerPlugin = process.env.BUILD_VISUALIZER
  ? visualizer({
    filename: path.resolve(__dirname, `packages/${process.env.BUILD_VISUALIZER}/bundle-analyzer/stats-treemap.html`),
    template: 'treemap', // sunburst|treemap|network
    sourcemap: true,
    gzipSize: true,
  })
  : undefined

export default defineConfig({
  plugins: [
    vue(),
    vueJsx(),
  ],
  resolve: {
    // Use this option to force Vite to always resolve listed dependencies to the same copy (from project root)
    dedupe: ['vue', 'vue-router', '@kong/kongponents'],
  },
  build: {
    outDir: './dist',
    cssCodeSplit: false,
    minify: true,
    sourcemap: true,
    rollupOptions: {
      // Make sure to externalize deps that shouldn't be bundled into your library
      // If config.build.rollupOptions.external is also set at the package level, the arrays will be merged
      external: ['vue', 'vue-router', '@kong/kongponents'],
      output: {
        // Provide global variables to use in the UMD build for externalized deps
        globals: {
          vue: 'Vue',
          '@kong/kongponents': 'Kongponents',
        },
        exports: 'named',
      },
      plugins: [
        // visualizer must remain last in the list of plugins
        buildVisualizerPlugin,
      ],
    },
  },
  optimizeDeps: {
    include: [
      'vue',
      'vue-router',
    ],
  },
  server: {
    fs: {
      /**
       * Allow serving files from one level up from the package root - IMPORTANT - since this is a monorepo
       */
      allow: [join(__dirname, '..')],
    },
  },
  // Change the root when utilizing the sandbox via USE_SANDBOX=true to use the `/sandbox/*` files
  // During the build process, the `/sandbox/*` files are not used and we should default to the package root.
  root: process.env.USE_SANDBOX ? './sandbox' : process.cwd(),
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: [],
    coverage: {
      provider: 'istanbul',
      reporter: ['text', 'lcovonly'],
      exclude: [
        'cypress/**',
        '**/__template__/**/*.spec.ts',
      ],
    },
    deps: {
      registerNodeLoader: true, // Ensure modules are imported properly
    },
    include: ['**/src/**/*.spec.ts'],
    exclude: [
      '**/dist/**',
      '**/__template__/**',
      '**/node_modules/**',
      'packages/core/cli/**',
    ],
  },
})

/**
 * Define the server.proxy rules for various shared APIs
 * These utilize the `VITE_KONNECT_PAT` Konnect PAT token located in `/.env.development.local`
 * @param pathToRoot The path to the repository root, from the package directory, where your .env.development.local file is located. Defaults to `../../../.' which works for most packages.
 * @returns Object of API proxies to pass to the vite `config.server.proxy`
 */
export const getApiProxies = (pathToRoot: string = '../../../.') => {
  // Import env variables from the root
  // Hard-coded to 'DEVELOPMENT' since we are only using the env variables in the local dev server
  const env = loadEnv('DEVELOPMENT', pathToRoot, '')

  const konnectAuthHeader = env.VITE_KONNECT_PAT
    ? {
      authorization: `Bearer ${env.VITE_KONNECT_PAT}`,
    }
    : undefined

  const kongManagerAuthHeader = env.VITE_KONG_MANAGER_TOKEN
    ? {
      'kong-admin-token': env.VITE_KONG_MANAGER_TOKEN,
    }
    : undefined

  return {
    /**
     * /kong-ui/config JSON
     */
    '^/kong-ui/config': {
      target: 'https://cloud.konghq.tech',
      changeOrigin: true,
    },
    /**
     * KONNECT PROXIES
     * TODO: when KHCP-5497 consume these proxies from the helper function?
     */
    '^/us/kong-api/konnect-api': {
      target: 'https://{geo}.api.konghq.tech'.replace(/\{geo\}/, 'us'),
      rewrite: (path) => path.replace('/us/kong-api', ''),
      changeOrigin: true,
      headers: {
        ...konnectAuthHeader,
      },
    },

    '^/eu/kong-api/konnect-api': {
      target: 'https://{geo}.api.konghq.tech'.replace(/\{geo\}/, 'eu'),
      rewrite: (path) => path.replace('/eu/kong-api', ''),
      changeOrigin: true,
      headers: {
        ...konnectAuthHeader,
      },
    },

    // KAuth v1 APIs
    '^/kauth': {
      target: 'https://global.api.konghq.tech',
      changeOrigin: true,
      headers: {
        ...konnectAuthHeader,
      },
    },

    // Global v2 APIs
    '^/kong-api/v2': {
      target: 'https://global.api.konghq.tech',
      rewrite: (path) => path.replace('/kong-api', ''),
      changeOrigin: true,
      headers: {
        ...konnectAuthHeader,
      },
    },

    /**
     * KONG MANAGER PROXIES
     */
    '^/kong-manager': {
      target: 'https://kong-admin-nightly.connectia.one',
      rewrite: (path) => path.replace('/kong-manager', ''),
      changeOrigin: true,
      headers: {
        ...kongManagerAuthHeader,
      },
    },
  }
}
