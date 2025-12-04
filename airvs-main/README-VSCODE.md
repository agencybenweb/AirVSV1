# Guide d'utilisation avec VSCode

## ⚠️ IMPORTANT : Ne pas utiliser Live Server !

Ce projet utilise **Vite**, qui nécessite son propre serveur de développement. Live Server ne fonctionnera **PAS** et affichera une page blanche.

## ✅ Comment lancer le projet correctement

### Méthode 1 : Via le terminal VSCode

1. Ouvrez le terminal intégré dans VSCode (`Ctrl + ù` ou `Terminal > New Terminal`)
2. Exécutez la commande :
   ```bash
   npm run dev
   ```
3. Le serveur démarre sur `http://localhost:8080` (ou un autre port si 8080 est occupé)
4. Ouvrez votre navigateur à l'adresse affichée

### Méthode 2 : Via les tâches VSCode

1. Appuyez sur `Ctrl + Shift + P` (ou `Cmd + Shift + P` sur Mac)
2. Tapez "Tasks: Run Task"
3. Sélectionnez "npm: dev"
4. Le serveur démarre automatiquement

### Méthode 3 : Via le débogage

1. Appuyez sur `F5` ou allez dans "Run and Debug"
2. Sélectionnez "Launch Dev Server"
3. Le serveur démarre et le navigateur s'ouvre automatiquement

## 🔧 Commandes disponibles

- `npm run dev` - Lance le serveur de développement Vite
- `npm run build` - Construit le projet pour la production
- `npm run preview` - Prévisualise la version buildée
- `npm run lint` - Vérifie le code avec ESLint

## 📝 Pourquoi Live Server ne fonctionne pas ?

- Vite transpile le TypeScript/JSX en temps réel
- Vite résout les alias de chemins (`@/` → `./src`)
- Vite gère les modules ES6 et le hot-reload
- Live Server ne peut pas faire tout cela, d'où la page blanche

## 🚀 Pour le déploiement

Si vous voulez servir le projet statiquement (pour FTP par exemple) :

1. Construisez le projet : `npm run build`
2. Le dossier `dist/` contient les fichiers à déployer
3. Servez le contenu de `dist/` avec n'importe quel serveur web

