import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react( )],
  base: './',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  server: {
    proxy: {
      '/proxy': {
        target: 'https://www.franceinfo.fr',
        changeOrigin: true,
        rewrite: (path ) => path.replace(/^\/proxy/, ''),
      },
    },
    // AJOUTEZ CETTE SECTION
    watch: {
      usePolling: true,
    },
    hmr: {
      // Assurez-vous que Vite écoute sur localhost
      host: 'localhost',
    },
  },
});
