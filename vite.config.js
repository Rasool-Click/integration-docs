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
      // Documentation sections are hash-based; only / is a real HTML route.
      // /linked redirects to / and the catch-all must never be prerendered.
      return paths.filter(path => path === '/')
    },
    onFinished() { generateSitemap({ hostname: 'https://docs.wessaal.com/' }) }
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
