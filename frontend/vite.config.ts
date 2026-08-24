import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        // target: 'http://localhost:5001',
        target: 'https://w50h1tjh-5001.inc1.devtunnels.ms/',
        changeOrigin: true,
      },
    },
  },
})
