import sharedViteConfig from '../../vite.config.shared'
import { fileURLToPath, URL } from 'node:url'
import { resolve } from 'path'
import { defineConfig, mergeConfig } from 'vite'

// Merge the shared Vite config with the local one defined below
export default mergeConfig(sharedViteConfig, defineConfig({
  resolve: {
    alias: {
      // Alias for package src directory
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  build: {
    lib: {
      entry: resolve(__dirname, './src/index.ts'),
      name: 'demo-component',
    },
  },
}))
