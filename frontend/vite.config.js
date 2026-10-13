import { svelte } from '@sveltejs/vite-plugin-svelte'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [svelte()],
  server: {
    // In dev, forward API calls to the Go server (`go run .` in ../server).
    proxy: {
      '/api': 'http://localhost:8080',
    },
  },
})
