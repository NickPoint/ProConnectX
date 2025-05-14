import {defineConfig} from 'vite'
import react from '@vitejs/plugin-react-swc'
import { ViteImageOptimizer } from 'vite-plugin-image-optimizer';
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
  plugins: [react(), svgr(), ViteImageOptimizer({
    test: /\.(jpe?g|png|gif|tiff|webp|svg|avif)$/i,
    exclude: undefined,
    include: undefined,
    includePublic: true,
    logStats: true,
    ansiColors: true,
    svg: {
      multipass: true,
      plugins: [
        {
          name: 'preset-default',
          params: {
            overrides: {
              cleanupNumericValues: false,
              removeViewBox: false, // https://github.com/svg/svgo/issues/1128
            },
            cleanupIDs: {
              minify: false,
              remove: false,
            },
            convertPathData: false,
          },
        },
        'sortAttrs',
        {
          name: 'addAttributesToSVGElement',
          params: {
            attributes: [{ xmlns: 'http://www.w3.org/2000/svg' }],
          },
        },
      ],
    },
    png: {
      quality: 100,
    },
    jpeg: {
      quality: 100,
    },
    jpg: {
      quality: 100,
    },
    tiff: {
      quality: 100,
    },
    gif: {},
    webp: {
      lossless: true,
    },
    avif: {
      lossless: true,
    },
    cache: false,
    cacheLocation: undefined,
  })],
  resolve: {
    conditions: ['mui-modern', 'module', 'browser', 'development|production']
  }
})
