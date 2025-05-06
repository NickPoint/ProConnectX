import {defineConfig} from 'vite'
import react from '@vitejs/plugin-react-swc'
import svgr from "vite-plugin-svgr";

// https://vite.dev/config/
export default defineConfig({
  define: {
  },
  server: {
    host: '0.0.0.0',
    port: 5173,
    strictPort: true,
  },
  plugins: [react(), svgr()],
  resolve: {
    conditions: ['mui-modern', 'module', 'browser', 'development|production']
  }
})
