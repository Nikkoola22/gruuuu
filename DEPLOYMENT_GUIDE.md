# Guide de Déploiement - ATLAS CFDT

## 🌐 Déploiement sur Vercel

### 1. Configuration des Variables d'Environnement

#### Étape 1 : Ouvrir la console Vercel
1. Allez sur https://vercel.com
2. Connectez-vous avec votre compte GitHub
3. Sélectionnez le projet `new-unifed`

#### Étape 2 : Ajouter la variable d'environnement
1. Cliquez sur **Settings** (Paramètres)
2. Dans le menu de gauche, cliquez sur **Environment Variables**
3. Ajoutez la variable suivante :

```
Name:  PERPLEXITY_API_KEY
Value: [Votre clé API Perplexity]
Environment: Production, Preview, Development
```

#### Étape 3 : Redéployer
1. Allez dans **Deployments**
2. Trouvez le dernier déploiement
3. Cliquez sur les **3 points** (...)
4. Sélectionnez **Redeploy**
5. Confirmez le redéploiement

### 2. Obtenir la clé API Perplexity

Si vous n'avez pas encore de clé API :

1. Allez sur https://www.perplexity.ai/settings/api
2. Créez un compte ou connectez-vous
3. Générez une nouvelle clé API
4. Copiez la clé (elle ressemble à : `pplx-xxxxxxxxxxxx`)
5. Ajoutez-la dans Vercel comme indiqué ci-dessus

## 📍 URLs de Déploiement

- **Vercel (Production)** : https://new-unifed.vercel.app
- **GitHub Pages** : https://nikkoola22.github.io/gruuuu/
- **Local** : http://localhost:5173 ou http://localhost:5174

## 🚀 Commandes de Déploiement

### Déploiement automatique Vercel
Vercel déploie automatiquement chaque push sur `main` !

```bash
# 1. Faire vos modifications
npm run dev

# 2. Commit et push
git add .
git commit -m "Description des changements"
git push origin main

# 3. Vercel redéploie automatiquement !
```

### Mise à jour manuelle GitHub Pages

```bash
# 1. Construire pour production
npm run build:pages

# 2. Déployer sur gh-pages
git checkout gh-pages
cp -r dist/* .
git add .
git commit -m "Update GitHub Pages"
git push origin gh-pages

# 3. Revenir sur main
git checkout main
```

## 🔧 Configuration

### Variables d'Environnement Requises

**Pour Vercel** :
- `PERPLEXITY_API_KEY` : Clé API Perplexity (pour le chatbot)

**Pour le développement local** :
Créer un fichier `.env` à la racine :
```
PERPLEXITY_API_KEY=pplx-votre-clé-api
```

## 📝 Notes

- Le chatbot ne fonctionne **que** sur Vercel (nécessite l'API backend)
- GitHub Pages sert seulement la version statique
- Les images et RSS fonctionnent sur les deux plateformes
- Rate limiting : 150 requêtes/minute
- Timeout API : 30 secondes

## 🐛 Dépannage

### Le chatbot ne répond pas
1. Vérifiez que `PERPLEXITY_API_KEY` est définie dans Vercel
2. Vérifiez les logs de déploiement dans Vercel
3. Redéployez après avoir ajouté la clé API

### Les images ne s'affichent pas
1. Vérifiez que le build utilise `npm run build:pages` pour GitHub Pages
2. Vérifiez les console errors dans le navigateur

### L'API RSS ne fonctionne pas
1. GitHub Pages utilise les données par défaut (pas d'API)
2. Sur Vercel, l'API doit être fonctionnelle

