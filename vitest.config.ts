/// <reference types="vitest" />

import path from 'path'
import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'lib')
    }
  },
  test: {
    globals: true,
    environment: 'jsdom',
    coverage: {
      include: ['lib']
    }
  }
})
