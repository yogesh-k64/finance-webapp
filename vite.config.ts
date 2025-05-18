import { defineConfig } from 'vite'
import path from 'path'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/finance-webapp',
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `
          @import "@/styles/_colors.scss";
          @import "@/styles/_home.scss";
        `
      }
    }
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  }
})
