import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// User page served at root, so base '/'
export default defineConfig({
  base: '/',
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './vitest.setup.js',
  },
})
