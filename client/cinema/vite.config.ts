import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite';
import istanbul from "vite-plugin-istanbul";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(), 
    tailwindcss(),
    istanbul({
    include: 'src/*',
    extension: ['.ts', '.tsx'],
    requireEnv: false
  })
  ],
  server: {
    watch: {
      usePolling: true,
    },
    host: true,
    hmr: {
      host: 'localhost',
    }
  }
})
