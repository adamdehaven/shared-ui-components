import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import dns from 'dns'
import { viteExternalsPlugin } from 'vite-plugin-externals'

// You can set dns.setDefaultResultOrder('verbatim') to disable the reordering behavior. Vite will then print the address as localhost
// https://vitejs.dev/config/server-options.html#server-host
dns.setDefaultResultOrder('verbatim')

// https://vitejs.dev/config/
export default defineConfig({
  // Define global constant replacements, likely only needed in the host application
  define: {
    'process.env.development': JSON.stringify('development'),
    'process.env.production': JSON.stringify('production'),
  },
  plugins: [
    vue(),
    viteExternalsPlugin({
      vue: 'Vue',
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  build: {
    outDir: './dist',
    minify: true,
    rollupOptions: {
      // make sure to externalize deps that shouldn't be bundled into your library
      external: ['vue'],
      output: {
        // Provide global variables to use in the UMD build for externalized deps
        globals: {
          vue: 'Vue',
        },
        exports: 'named',
        sourcemap: true,
      },
    },
  },
})
