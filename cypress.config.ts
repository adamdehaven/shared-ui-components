import { defineConfig } from 'cypress'
import registerCodeCoverageTasks from '@cypress/code-coverage/task'
import istanbul from 'vite-plugin-istanbul'
import sharedViteConfig from './vite.config.shared'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  component: {
    devServer: {
      framework: 'vue',
      bundler: 'vite',
      viteConfig: {
        ...sharedViteConfig,
        plugins: [
          vue(),
          istanbul({
            extension: ['.vue'],
            requireEnv: true,
            exclude: ['packages/core/cli/**'],
          }),
        ],
      },
    },
    supportFile: 'cypress/support/index.ts',
    specPattern: '**/src/**/*.cy.ts',
    excludeSpecPattern: '**/__template__/**/*.cy.ts',
    setupNodeEvents(on: Cypress.PluginEvents, config: Cypress.PluginConfigOptions) {
      if (process.env.VITE_COVERAGE === 'true') {
        registerCodeCoverageTasks(on, config)
      }

      return config
    },
  },
  includeShadowDom: true,
  fixturesFolder: 'cypress/fixtures',
  screenshotsFolder: 'cypress/screenshots',
  videosFolder: 'cypress/videos',
  videoUploadOnPasses: false,
  retries: {
    runMode: 1,
  },
  trashAssetsBeforeRuns: false,
})
