# Guide d'export du code 🚀

Ce guide explique les différentes méthodes pour exporter votre code du projet AirVS.

## Table des matières

1. [Export pour la production (Build)](#1-export-pour-la-production-build)
2. [Export du code source](#2-export-du-code-source)
3. [Export de composants/fonctions dans le code](#3-export-de-composantsfonctions-dans-le-code)
4. [Export vers Git](#4-export-vers-git)

---

## 1. Export pour la production (Build)

### Construire la version de production

Cette méthode crée une version optimisée et minifiée de votre application dans le dossier `dist/`.

```bash
# Depuis le répertoire du projet
cd airvs-main

# Installer les dépendances (si ce n'est pas déjà fait)
npm install

# Construire la version de production
npm run build
```

**Résultat :** Un dossier `dist/` sera créé contenant tous les fichiers optimisés prêts à être déployés.

### Options de build disponibles

D'après votre `package.json`, vous avez les commandes suivantes :

- `npm run build` - Build de production standard
- `npm run build:dev` - Build en mode développement
- `npm run preview` - Prévisualiser le build de production localement

### Structure après le build

```
airvs-main/
  └── dist/
      ├── index.html
      ├── assets/
      │   ├── index-[hash].js
      │   ├── index-[hash].css
      │   └── ...
      └── ...
```

### Déployer le dossier dist

Le dossier `dist/` peut être déployé sur :
- **Netlify** : Glissez-déposez le dossier `dist/`
- **Vercel** : Configurez le dossier de sortie comme `dist/`
- **GitHub Pages** : Déployez le contenu du dossier `dist/`
- **Serveur web classique** : Copiez le contenu dans votre répertoire web

---

## 2. Export du code source

### Méthode 1 : Archive ZIP/TAR

#### Sur Windows (PowerShell) :

```powershell
# Naviguer vers le répertoire parent
cd C:\AirVS\airvs-main

# Créer une archive ZIP (excluant node_modules)
Compress-Archive -Path airvs-main -DestinationPath "airvs-main-backup-$(Get-Date -Format 'yyyy-MM-dd').zip" -Exclude "node_modules","dist",".git"

# Ou avec 7-Zip si installé
7z a -tzip airvs-main-backup.zip airvs-main -xr!node_modules -xr!dist -xr!.git
```

#### Sur Linux/Mac :

```bash
# Créer une archive tar.gz (excluant node_modules et dist)
tar -czf airvs-main-backup-$(date +%Y-%m-%d).tar.gz \
  --exclude='node_modules' \
  --exclude='dist' \
  --exclude='.git' \
  airvs-main/
```

### Méthode 2 : Copie sélective avec script

Créez un script PowerShell `export-code.ps1` :

```powershell
# export-code.ps1
$exportDir = "export-$(Get-Date -Format 'yyyy-MM-dd-HHmmss')"
New-Item -ItemType Directory -Path $exportDir

# Copier les fichiers source uniquement
Copy-Item -Path "src" -Destination "$exportDir\src" -Recurse
Copy-Item -Path "public" -Destination "$exportDir\public" -Recurse
Copy-Item -Path "*.json" -Destination $exportDir
Copy-Item -Path "*.ts" -Destination $exportDir
Copy-Item -Path "*.js" -Destination $exportDir
Copy-Item -Path "*.config.*" -Destination $exportDir
Copy-Item -Path "index.html" -Destination $exportDir
Copy-Item -Path "README.md" -Destination $exportDir

Write-Host "Code exporté dans : $exportDir"
```

### Méthode 3 : Utiliser Git Archive

Si votre projet est sous contrôle de version Git :

```bash
# Créer une archive du code source (sans .git)
git archive -o airvs-main-source.zip HEAD

# Ou en tar.gz
git archive --format=tar.gz -o airvs-main-source.tar.gz HEAD
```

---

## 3. Export de composants/fonctions dans le code

### Export par défaut (Default Export)

```typescript
// Dans un fichier component.tsx
const MonComposant = () => {
  return <div>Contenu</div>;
};

export default MonComposant;

// Import ailleurs
import MonComposant from './component';
```

### Export nommé (Named Export)

```typescript
// Dans un fichier utils.ts
export const fonction1 = () => {
  // ...
};

export const fonction2 = () => {
  // ...
};

// Import ailleurs
import { fonction1, fonction2 } from './utils';
// Ou import un seul
import { fonction1 } from './utils';
```

### Export multiple

```typescript
// Dans un fichier
export { ComposantA } from './ComposantA';
export { ComposantB } from './ComposantB';
export { utils1, utils2 } from './utils';

// Créer un fichier index.ts pour centraliser les exports
// index.ts
export * from './components';
export * from './utils';
export * from './hooks';
```

### Exemple dans votre projet

Regardons comment vos composants sont exportés :

**Composant AudioPlayer** : Probablement exporté par défaut
```typescript
// Import
import AudioPlayer from '@/components/AudioPlayer';
```

**Composants UI** : Probablement des exports nommés
```typescript
// Import
import { Button, Card, Dialog } from '@/components/ui/button';
```

---

## 4. Export vers Git

### Initialiser Git (si pas déjà fait)

```bash
cd airvs-main
git init
git add .
git commit -m "Initial commit"
```

### Ajouter un remote et pousser

```bash
# Ajouter le repository distant
git remote add origin <URL_DE_VOTRE_REPO>

# Pousser le code
git push -u origin main
```

### Créer un tag de version

```bash
# Créer un tag pour marquer une version
git tag -a v1.0.0 -m "Version 1.0.0"

# Pousser les tags
git push origin v1.0.0
```

---

## Résumé rapide

| Méthode | Commande | Usage |
|---------|----------|-------|
| **Build production** | `npm run build` | Créer une version déployable |
| **Preview build** | `npm run preview` | Tester le build localement |
| **Archive source** | `git archive` ou ZIP | Sauvegarder le code source |
| **Export Git** | `git push` | Synchroniser avec un dépôt distant |

---

## Questions fréquentes

### Q: Où se trouve le code exporté après `npm run build` ?
**R:** Dans le dossier `dist/` à la racine du projet.

### Q: Dois-je inclure `node_modules` dans l'export du code source ?
**R:** Non, `node_modules` peut être régénéré avec `npm install`. Excluez-le de vos archives.

### Q: Comment exporter seulement certains fichiers ?
**R:** Créez un script personnalisé ou utilisez Git avec des chemins spécifiques :
```bash
git archive -o export.zip HEAD src/ public/
```

### Q: Le build fonctionne-t-il sans erreurs ?
**R:** Vérifiez avec `npm run build` et corrigez les erreurs éventuelles avant de déployer.

---

## Besoin d'aide ?

- Consultez la [documentation Vite](https://vitejs.dev/guide/build.html)
- Consultez la [documentation React](https://react.dev/)
- Vérifiez les erreurs dans la console après `npm run build`

