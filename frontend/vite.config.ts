import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import { defineConfig } from 'vite';

// Server configuration
const SERVER_PORT = 3030;

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  
  server: {
    port: SERVER_PORT,
    host: true, // Listen on all addresses
  },
  
  preview: {
    port: SERVER_PORT,
    host: true,
  },
  
  build: {
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          mui: ['@mui/material', '@mui/icons-material'],
        },
      },
    },
  },
  
  // Add resolve configuration for path aliases
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '@components': resolve(__dirname, 'src/components'),
      '@theme': resolve(__dirname, 'src/theme'),
      '@types': resolve(__dirname, 'src/types'),
      '@utils': resolve(__dirname, 'src/utils'),
      '@contexts': resolve(__dirname, 'src/contexts'),
      '@hooks': resolve(__dirname, 'src/hooks'),
      '@pages': resolve(__dirname, 'src/pages'),
      '@providers': resolve(__dirname, 'src/providers'),
      '@services': resolve(__dirname, 'src/services'),
    },
  },
});