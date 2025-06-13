import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(),tailwindcss()],
   server: {
    proxy: {
      '/auth': 'http://localhost:3000',
      '/api': 'http://localhost:3000',
      '/product': 'http://localhost:3000',
      '/cart': 'http://localhost:3000',
      '/order': 'http://localhost:3000',
      '/address': 'http://localhost:3000',
    }
  }
})
