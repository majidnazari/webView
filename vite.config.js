import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    allowedHosts: [
      '2143-2a09-bac5-2a94-2464-00-3a0-28.ngrok-free.app',
      '.ngrok-free.app'  // Optional: allow future dynamic ngrok domains automatically
    ]
  }
})
