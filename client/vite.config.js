import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/text': 'http://localhost:9090',
      '/canada': 'http://localhost:9090',
      '/intl': 'http://localhost:9090',
      '/providers': 'http://localhost:9090',
    },
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
})
