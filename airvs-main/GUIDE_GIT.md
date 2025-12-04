# Guide de vérification et configuration de Git 🔍

Ce guide vous explique comment vérifier si Git est installé sur votre système et comment le configurer.

## Vérification rapide

### Méthode 1 : Script PowerShell (Recommandé)

Exécutez le script de vérification que j'ai créé pour vous :

```powershell
cd C:\AirVS\airvs-main\airvs-main
.\verifier-git.ps1
```

Ce script vérifiera :
- ✅ Si Git est installé
- ✅ La version de Git
- ✅ La configuration Git (nom et email)
- ✅ Si votre projet est un dépôt Git

### Méthode 2 : Commande simple

Ouvrez PowerShell ou l'invite de commandes et tapez :

```powershell
git --version
```

**Si Git est installé**, vous verrez quelque chose comme :
```
git version 2.42.0.windows.2
```

**Si Git n'est pas installé**, vous verrez une erreur comme :
```
'git' n'est pas reconnu en tant que commande interne ou externe...
```

## Installation de Git

### Option 1 : Téléchargement direct (Recommandé)

1. Allez sur [https://git-scm.com/download/win](https://git-scm.com/download/win)
2. Téléchargez l'installeur pour Windows
3. Exécutez l'installeur et suivez les instructions
4. Redémarrez votre terminal après l'installation

### Option 2 : Avec Winget (Windows 10/11)

```powershell
winget install Git.Git
```

### Option 3 : Avec Chocolatey

```powershell
choco install git
```

## Configuration initiale de Git

Une fois Git installé, configurez votre nom et email :

```powershell
git config --global user.name "Votre Nom"
git config --global user.email "votre.email@example.com"
```

Vérifiez la configuration :

```powershell
git config --list
```

## Vérifier si votre projet est un dépôt Git

### Méthode 1 : Vérifier le dossier .git

```powershell
Test-Path .git
```

Si cela retourne `True`, votre projet est un dépôt Git.

### Méthode 2 : Commande Git status

```powershell
cd C:\AirVS\airvs-main\airvs-main
git status
```

**Si c'est un dépôt Git**, vous verrez l'état de vos fichiers.
**Si ce n'est pas un dépôt Git**, vous verrez une erreur comme :
```
fatal: not a git repository (or any of the parent directories): .git
```

## Initialiser un dépôt Git dans votre projet

Si votre projet n'est pas encore un dépôt Git, vous pouvez l'initialiser :

```powershell
cd C:\AirVS\airvs-main\airvs-main

# Initialiser Git
git init

# Ajouter tous les fichiers
git add .

# Créer le premier commit
git commit -m "Initial commit"
```

## Vérifications utiles

### Voir la version de Git
```powershell
git --version
```

### Voir la configuration Git
```powershell
git config --list
```

### Voir la branche actuelle
```powershell
git branch
```

### Voir l'état du dépôt
```powershell
git status
```

### Voir l'historique des commits
```powershell
git log --oneline
```

## Résolution de problèmes

### Problème : "git n'est pas reconnu"

**Solution :**
1. Vérifiez que Git est bien installé
2. Redémarrez votre terminal
3. Vérifiez que Git est dans votre PATH :
   ```powershell
   $env:PATH -split ';' | Select-String git
   ```
4. Si Git n'est pas dans le PATH, ajoutez-le manuellement ou réinstallez Git

### Problème : Git demande des identifiants à chaque fois

**Solution :**
Configurez un gestionnaire d'identifiants (Credential Manager) :

```powershell
git config --global credential.helper manager-core
```

### Problème : Problèmes d'encodage avec les accents

**Solution :**
Configurez Git pour utiliser UTF-8 :

```powershell
git config --global core.quotepath false
git config --global i18n.commitencoding utf-8
git config --global i18n.logoutputencoding utf-8
```

## Commandes Git essentielles

| Commande | Description |
|----------|-------------|
| `git init` | Initialiser un nouveau dépôt |
| `git status` | Voir l'état des fichiers |
| `git add .` | Ajouter tous les fichiers modifiés |
| `git commit -m "message"` | Créer un commit |
| `git log` | Voir l'historique |
| `git branch` | Voir les branches |
| `git clone <url>` | Cloner un dépôt distant |
| `git push` | Envoyer les commits vers le dépôt distant |
| `git pull` | Récupérer les changements du dépôt distant |

## Besoin d'aide ?

- Documentation officielle : [https://git-scm.com/doc](https://git-scm.com/doc)
- Guide interactif : [https://learngitbranching.js.org/](https://learngitbranching.js.org/)
- Consultez le fichier `GUIDE_EXPORT.md` pour exporter votre code avec Git

