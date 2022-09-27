import sharedViteConfig from '../../vite.config.shared'
import { resolve } from 'path'
import { defineConfig, mergeConfig } from 'vite'

// Package name should always match the kebab-case name of your `/packages/{package-name}` directory
const packageName = 'demo-component'

// Merge the shared Vite config with the local one defined below
export default mergeConfig(sharedViteConfig, defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, './src/index.ts'),
      name: packageName,
      fileName: (format) => `${packageName}.${format}.js`,
    },
  },
}))
