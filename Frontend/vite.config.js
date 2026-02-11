import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    tailwindcss(),
  ],
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
    include: ['three', 'three-stdlib', '@zoom/meetingsdk']
  }
})