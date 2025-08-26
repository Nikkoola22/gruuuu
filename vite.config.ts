import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  // Vos plugins existants
  plugins: [react( )],

  // Votre configuration de base pour GitHub Pages
  base: '/gruuuu/',

  // Votre configuration d'optimisation des dépendances
  optimizeDeps: {
    exclude: ['lucide-react'],
  },

  // ↓↓↓ AJOUT DE LA CONFIGURATION DU PROXY CI-DESSOUS ↓↓↓
  server: {
    proxy: {
      // Toute requête de votre code qui commence par '/proxy' sera interceptée
      '/proxy': {
        // et redirigée vers le serveur de franceinfo
        target: 'https://www.franceinfo.fr',
        
        // Indispensable pour que la redirection fonctionne correctement
        changeOrigin: true,
        
        // Réécrit l'URL pour retirer '/proxy' avant de l'envoyer à franceinfo
        // Exemple : '/proxy/politique.rss' devient 'https://www.franceinfo.fr/politique.rss'
        rewrite: (path ) => path.replace(/^\/proxy/, ''),
      },
    },
  },
});
