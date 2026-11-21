import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import generateSitemap from 'vite-ssg-sitemap'

export default defineConfig(({ isSsrBuild }) => ({
  base: '/',
  plugins: [
    vue(),
  ],
  ssgOptions: {
    script: 'async',
    dirStyle: 'nested',
    formatting: 'minify',
    includedRoutes(paths, routes) {
      // Only canonical public docs; never pre-render redirects or catch-alls.
      return paths.filter(path => ['/', '/quickstart', '/authentication', '/endpoints', '/webhooks'].includes(path))
    },
    onFinished() { generateSitemap({ hostname: 'https://docs.wessaal.com/', exclude: ['/404'], generateRobotsTxt: false }) }
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: isSsrBuild ? undefined : {
          'vue-core': ['vue', 'vue-router'],
          'unhead': ['@unhead/vue'],
        },
      },
    },
    chunkSizeWarningLimit: 1000,
  },
}))
