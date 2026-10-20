import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/',
  server: {
    host: '0.0.0.0',
    port: 3000,
    strictPort: true,
  },
  preview: {
    host: '0.0.0.0',
    port: 3000,
    strictPort: true,
  },
  build: {
    target: 'es2022',
    sourcemap: false,
    chunkSizeWarningLimit: 650,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('/node_modules/three/') || id.includes('/node_modules/@react-three/')) {
            return 'three-scenes';
          }
          if (id.includes('/node_modules/gsap/')) return 'gsap';
          if (id.includes('/node_modules/framer-motion/')) return 'motion';
          if (id.includes('/node_modules/@react-spring/')) return 'spring';
          return undefined;
        },
      },
    },
  },
});
