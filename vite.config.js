import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    tailwindcss(),
    react(),
  ],
  server: {
    proxy: {
      '/api/properties':           { target: 'https://api.doorloop.com', changeOrigin: true, rewrite: p => p.replace(/^\/api/, '') },
      '/api/tenants':              { target: 'https://api.doorloop.com', changeOrigin: true, rewrite: p => p.replace(/^\/api/, '') },
      '/api/leases':               { target: 'https://api.doorloop.com', changeOrigin: true, rewrite: p => p.replace(/^\/api/, '') },
      '/api/units':                { target: 'https://api.doorloop.com', changeOrigin: true, rewrite: p => p.replace(/^\/api/, '') },
      '/api/bills':                { target: 'https://api.doorloop.com', changeOrigin: true, rewrite: p => p.replace(/^\/api/, '') },
      '/api/accounts':             { target: 'https://api.doorloop.com', changeOrigin: true, rewrite: p => p.replace(/^\/api/, '') },
    }
  }
})
