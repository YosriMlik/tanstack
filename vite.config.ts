import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { tanstackRouter } from '@tanstack/router-plugin/vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    tanstackRouter({
      target: "react",
      autoCodeSplitting: true 
    }), 
    react()
  ],
  resolve: {
    alias: import.meta.env.PROD
      ? { 'react-dom/server': 'react-dom/server.edge' }
      : {}, // Empty object for dev mode
  },

  // build: {
  //   target: 'cloudflare-pages',
  // }
})
