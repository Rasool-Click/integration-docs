import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { visualizer } from 'rollup-plugin-visualizer'
import generateSitemap from 'vite-ssg-sitemap'

export default defineConfig({
  base: process.env.VERCEL === '1' ? '/' : '/docs/',
  plugins: [
    vue(),
    visualizer({
      filename: 'stats.html',
      template: 'treemap', // or sunburst
      gzipSize: true,
      brotliSize: true,
    }),
  ],
  ssgOptions: {
    script: 'async',
    formatting: 'minify',
    includedRoutes(paths, routes) {
      // return all static paths and custom routes defined in memory/requirements
      return paths.concat(['/linked', '/official'])
    },
    onFinished() { generateSitemap({ hostname: 'https://wessaal.com/docs/' }) }
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'vue-core': ['vue', 'vue-router', 'pinia'],
          'shiki': ['shiki'],
          'unhead': ['@unhead/vue'],
        },
      },
    },
    chunkSizeWarningLimit: 1000,
  },
})
