import {defineConfig} from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  define: {
    global: {},
    'process.env': {}, // Fix for STOMP.js using process.env
  },
  server: {
    host: '0.0.0.0', // Allows access from other devices
    port: 5173, // Default Vite port
    strictPort: true, // Ensures it doesn't switch ports
  },
  plugins: [react()],
  resolve: {
    conditions: ['mui-modern', 'module', 'browser', 'development|production']
  }
})
