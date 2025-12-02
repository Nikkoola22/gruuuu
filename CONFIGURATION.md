# 🔧 Configuration de l'Application

## Variables d'environnement

### 1. Clé API Perplexity (Chatbot IA)

Pour activer le chatbot avec IA Perplexity:

1. Inscris-toi sur [Perplexity](https://www.perplexity.ai/)
2. Va dans les paramètres → API
3. Crée une clé API
4. Crée un fichier `.env.local` à la racine du projet:

```bash
VITE_APP_PERPLEXITY_KEY=ta_clé_api_perplexity_ici
```

⚠️ **IMPORTANT**: Ne commite JAMAIS `.env.local` avec des clés réelles!

### 2. Flux RSS

L'application utilise **api.allorigins.win** comme proxy CORS pour charger le flux RSS de France Info.

- Si le flux n'est pas disponible, l'application affiche un message d'erreur gracieux
- Les données de secours sont affichées à la place

## Développement Local

```bash
# Installation
npm install

# Démarrage dev (port 5173 ou 5174)
npm run dev

# Build production
npm run build

# Préview build
npm run preview
```

## Déploiement sur Vercel

1. Crée un projet Vercel connecté à ce repo
2. Va dans **Settings → Environment Variables**
3. Ajoute:
   ```
   VITE_APP_PERPLEXITY_KEY = ta_clé_api
   ```
4. Déploie normalement

## Erreurs Courantes

### ❌ "Erreur API (401)"
**Solution**: Ta clé API Perplexity n'est pas valide. Vérifie dans `.env.local`

### ❌ "Erreur API (403)" sur le flux RSS
**Solution**: Le proxy CORS peut être temporairement indisponible. Réessaye plus tard.

### ❌ "Service IA non disponible"
**Solution**: Assure-toi que:
- `VITE_APP_PERPLEXITY_KEY` est défini dans `.env.local`
- La clé n'est pas `undefined` ou un placeholder

## Support

Pour toute question sur la configuration, contacte l'administrateur.
