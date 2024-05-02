import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  define: {
    'process.env': {
      REACT_APP_AUTH0_DOMAIN:"dev-25vz0fnjmni3ejjp.us.auth0.com",
    REACT_APP_AUTH0_CLIENT_ID:"XmJ69rQmUTsn7dagLO2YfhY9hMnvl7rh"
    }
  },
  plugins: [react()],
})

