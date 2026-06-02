import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import Sitemap from 'vite-plugin-sitemap'
import { visualizer } from 'rollup-plugin-visualizer'

export default defineConfig({
  base: '/docs/',
  plugins: [
    vue(),
    Sitemap({
      hostname: 'https://wessaal.com/docs/',
      dynamicRoutes: [
        '/',
        // Can add more dynamic routes here if there are any specific nested views in the future
      ],
      outDir: 'dist',
    }),
    visualizer({ open: false })
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('vue') || id.includes('pinia') || id.includes('vue-router')) {
              return 'vendor-core'
            }
            if (id.includes('@lucide')) {
              return 'vendor-ui'
            }
            return 'vendor-others'
          }
        }
      }
    }
  }
})
