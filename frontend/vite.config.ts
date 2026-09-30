import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const apiTarget = env.VITE_API_PROXY_TARGET || 'http://localhost:3000'

  return {
    // REACT_APP_ is still accepted so existing .env files keep working
    envPrefix: ['VITE_', 'REACT_APP_'],
    plugins: [react()],
    server: {
      // The backend is reached through the dev server, so the app works without CORS setup
      proxy: {
        '/api': apiTarget,
        '/uploads': apiTarget,
      },
    },
  }
})
