import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    chunkSizeWarningLimit: 800,
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react': ['react', 'react-dom'],
          'vendor-animation': ['gsap', '@gsap/react', 'framer-motion', 'lenis'],
          'vendor-icons': ['lucide-react'],
          'vendor-three': ['three'],
        },
      },
    },
  },
  server: {
    port: 3000,
    open: false,
  },
});
