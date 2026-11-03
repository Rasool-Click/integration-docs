import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import generateSitemap from 'vite-ssg-sitemap'

export default defineConfig({
  base: '/',
  plugins: [
    vue(),
  ],
  ssgOptions: {
    script: 'async',
    formatting: 'minify',
    includedRoutes(paths, routes) {
      // return all static paths and custom routes defined in memory/requirements
      return paths
    },
    onFinished() { generateSitemap({ hostname: 'https://docs.wessaal.com/' }) }
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'vue-core': ['vue', 'vue-router'],
          'unhead': ['@unhead/vue'],
        },
      },
    },
    chunkSizeWarningLimit: 1000,
  },
})
