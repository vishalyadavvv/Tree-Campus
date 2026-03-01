import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    // Custom plugin to strip missing source map references in Zoom SDK
    {
      name: 'strip-zoom-sourcemaps',
      enforce: 'post',
      transform(code, id) {
        if (id.includes('@zoom/meetingsdk') && id.endsWith('.css')) {
          return {
            code: code.replace(/\/\*# sourceMappingURL=.* \*\//g, ''),
            map: null
          }
        }
      }
    }
  ],
  resolve: {
    dedupe: ['react', 'react-dom']
  },
  css: {
    devSourcemap: false
  },
  build: {
    chunkSizeWarningLimit: 2500,
    
    rollupOptions: {
      output: {
        // Rolldown expects a function, not an object
        manualChunks: (id) => {
          // Split three.js into separate chunk
          if (id.includes('node_modules/three/')) {
            return 'three';
          }
          // Split three-stdlib into separate chunk
          if (id.includes('node_modules/three-stdlib/')) {
            return 'three-stdlib';
          }
          // All other node_modules go into vendor chunk
          if (id.includes('node_modules')) {
            return 'vendor';
          }
        }
      }
    },
    
    minify: 'esbuild',
  },
  
  optimizeDeps: {
    include: ['react', 'react-dom', 'three', 'three-stdlib', '@zoom/meetingsdk']
  }
})