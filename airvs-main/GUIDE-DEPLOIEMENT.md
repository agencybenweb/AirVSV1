# 🚀 Guide de Déploiement - AIRVS Radio

## 📋 Étapes de déploiement pour le grand public

### Étape 1 : Préparer le build de production

Avant de déployer, vous devez construire votre application pour la production :

```bash
npm run build
```

Cette commande va :
- Compiler et optimiser tout votre code TypeScript/React
- Minifier les fichiers CSS et JavaScript
- Créer le dossier `dist/` avec tous les fichiers prêts pour la production

### Étape 2 : Vérifier le build localement

Avant de déployer, testez le build localement :

```bash
npm run preview
```

Cela lance un serveur local qui simule la production. Vérifiez que tout fonctionne correctement.

---

## 🌐 Options de déploiement

### Option 1 : Déploiement FTP (Hébergement classique)

#### 1. Construire le projet
```bash
npm run build
```

#### 2. Préparer les fichiers
Le dossier `dist/` contient tous les fichiers à déployer :
```
dist/
  ├── index.html          ← Point d'entrée
  ├── assets/
  │   ├── index-[hash].js
  │   ├── index-[hash].css
  │   └── hero-bg-[hash].jpg
  └── ...
```

#### 3. Téléverser via FTP
- Connectez-vous à votre serveur FTP
- Téléversez **tout le contenu** du dossier `dist/` dans :
  - `/public_html/` (cPanel)
  - `/www/` (certains hébergeurs)
  - `/htdocs/` (autre configuration)
  - Ou le dossier web de votre serveur

#### 4. Configuration du serveur
Créez un fichier `.htaccess` à la racine (pour Apache) :

```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>
```

Cela permet au routage React de fonctionner correctement.

#### 5. Variables d'environnement
Si vous utilisez des variables d'environnement (AzuraCast API, etc.), vous devez les configurer sur votre serveur ou les inclure dans le build.

---

### Option 2 : Déploiement sur Vercel (Recommandé - Gratuit)

Vercel est spécialement conçu pour les applications React/Vite.

#### 1. Installer Vercel CLI
```bash
npm i -g vercel
```

#### 2. Déployer
```bash
vercel
```

Ou connectez votre dépôt GitHub directement sur [vercel.com](https://vercel.com)

#### 3. Configuration automatique
Vercel détecte automatiquement Vite et configure tout pour vous.

#### 4. Variables d'environnement
Ajoutez vos variables dans Vercel :
- `VITE_AZURACAST_BASE_URL`
- `VITE_AZURACAST_STATION_ID`
- `VITE_AZURACAST_API_KEY`

---

### Option 3 : Déploiement sur Netlify (Gratuit)

#### 1. Installer Netlify CLI
```bash
npm i -g netlify-cli
```

#### 2. Build settings
Créez un fichier `netlify.toml` à la racine :

```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

#### 3. Déployer
```bash
netlify deploy --prod
```

Ou connectez votre dépôt GitHub sur [netlify.com](https://netlify.com)

---

### Option 4 : Déploiement sur GitHub Pages

#### 1. Installer gh-pages
```bash
npm install --save-dev gh-pages
```

#### 2. Ajouter le script dans package.json
```json
"scripts": {
  "deploy": "npm run build && gh-pages -d dist"
}
```

#### 3. Déployer
```bash
npm run deploy
```

---

## ⚙️ Configuration des variables d'environnement

### Pour la production, créez un fichier `.env.production` :

```env
VITE_AZURACAST_BASE_URL=https://votre-serveur-azura.com
VITE_AZURACAST_STATION_ID=votre-station-id
VITE_AZURACAST_API_KEY=votre-cle-api
```

Les variables doivent commencer par `VITE_` pour être accessibles dans le code.

---

## ✅ Checklist avant le déploiement

- [ ] Tester le build localement avec `npm run preview`
- [ ] Vérifier que toutes les fonctionnalités marchent
- [ ] Vérifier les variables d'environnement
- [ ] Tester sur mobile
- [ ] Vérifier les performances (lighthouse)
- [ ] Vérifier le SEO (meta tags)
- [ ] Configurer le domaine personnalisé (si nécessaire)
- [ ] Configurer HTTPS/SSL
- [ ] Tester le lecteur audio en production
- [ ] Vérifier les API AzuraCast

---

## 🔧 Configuration serveur (Apache/Nginx)

### Apache (.htaccess)
Déjà fourni ci-dessus dans Option 1.

### Nginx
Ajoutez dans votre configuration :

```nginx
location / {
  try_files $uri $uri/ /index.html;
}
```

---

## 📊 Monitoring et Analytics

Après le déploiement, considérez :
- Google Analytics
- Vercel Analytics (si sur Vercel)
- Monitoring des erreurs (Sentry)

---

## 🚨 Problèmes courants

### Page blanche après déploiement
- Vérifiez la console du navigateur pour les erreurs
- Vérifiez que tous les fichiers sont bien téléversés
- Vérifiez les chemins (doivent être relatifs)

### Routes ne fonctionnent pas
- Vérifiez la configuration `.htaccess` ou Nginx
- Toutes les routes doivent rediriger vers `index.html`

### API ne fonctionne pas
- Vérifiez les variables d'environnement
- Vérifiez CORS sur votre serveur AzuraCast
- Vérifiez que les URLs sont correctes

---

## 🎯 Recommandation

Pour un déploiement rapide et gratuit, **Vercel** est la meilleure option :
- Déploiement automatique depuis GitHub
- HTTPS gratuit
- CDN global
- Configuration minimale requise

