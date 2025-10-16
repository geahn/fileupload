import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Proxy API requests to the Vercel serverless function endpoint
      '/api': {
        target: 'http://localhost:3000', // Assuming the Vercel dev server runs here
        changeOrigin: true,
      },
    },
  },
})
