import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost',
        changeOrigin: true,
      },
      '/frames': {
        target: 'http://localhost',
        changeOrigin: true,
      },
      '/videos': {
        target: 'http://localhost',
        changeOrigin: true,
      }
    }
  }
})