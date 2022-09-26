import sharedViteConfig from '../../vite.config.shared'
import { resolve } from 'path'
import { defineConfig, mergeConfig } from 'vite'

// Merge the shared Vite config with the local one defined below
export default mergeConfig(sharedViteConfig, defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, './src/index.ts'),
      name: 'demo-component',
      fileName: (format) => `kong-ui.demo-component.${format}.js`,
    },
  },
}))
