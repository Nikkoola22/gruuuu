import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],

  // Important pour Vercel : chemins relatifs
  base: './',

  // Alias pour simplifier les imports
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },

  // Optimisation des dépendances
  optimizeDeps: {
    exclude: ['lucide-react'],
  },

  // Configuration du serveur local pour le développement
  server: {
    proxy: {
      '/proxy': {
        target: 'https://www.franceinfo.fr',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/proxy/, ''),
      },
    },
  },
});
