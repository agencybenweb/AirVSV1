# Script de verification de Git
# Ce script verifie si Git est installe et configure

Write-Host "=== Verification de Git ===" -ForegroundColor Cyan
Write-Host ""

# Verifier si Git est installe
Write-Host "1. Verification de l'installation de Git..." -ForegroundColor Yellow
try {
    $gitVersion = git --version 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "   [OK] Git est installe" -ForegroundColor Green
        Write-Host "   Version: $gitVersion" -ForegroundColor Cyan
    } else {
        Write-Host "   [ERREUR] Git n'est pas installe ou non accessible" -ForegroundColor Red
        exit 1
    }
} catch {
    Write-Host "   [ERREUR] Git n'est pas installe" -ForegroundColor Red
    Write-Host ""
    Write-Host "Pour installer Git:" -ForegroundColor Yellow
    Write-Host "   1. Telechargez Git depuis: https://git-scm.com/download/win" -ForegroundColor Cyan
    Write-Host "   2. Ou utilisez winget: winget install Git.Git" -ForegroundColor Cyan
    exit 1
}

Write-Host ""

# Verifier la configuration de Git
Write-Host "2. Verification de la configuration Git..." -ForegroundColor Yellow
$gitUser = git config --global user.name 2>&1
$gitEmail = git config --global user.email 2>&1

if ($gitUser -and $gitUser -notmatch "error") {
    Write-Host "   [OK] Nom d'utilisateur: $gitUser" -ForegroundColor Green
} else {
    Write-Host "   [ATTENTION] Nom d'utilisateur non configure" -ForegroundColor Yellow
}

if ($gitEmail -and $gitEmail -notmatch "error") {
    Write-Host "   [OK] Email: $gitEmail" -ForegroundColor Green
} else {
    Write-Host "   [ATTENTION] Email non configure" -ForegroundColor Yellow
}

Write-Host ""

# Verifier si le projet actuel est un depot Git
Write-Host "3. Verification du depot Git du projet..." -ForegroundColor Yellow
if (Test-Path ".git") {
    Write-Host "   [OK] Ce projet est un depot Git" -ForegroundColor Green
    
    $gitStatus = git status --porcelain 2>&1
    $gitBranch = git branch --show-current 2>&1
    
    Write-Host "   Branche actuelle: $gitBranch" -ForegroundColor Cyan
    
    if ($gitStatus) {
        Write-Host "   [ATTENTION] Il y a des fichiers modifies ou non suivis" -ForegroundColor Yellow
    } else {
        Write-Host "   [OK] Aucun changement en attente" -ForegroundColor Green
    }
} else {
    Write-Host "   [INFO] Ce projet n'est pas encore un depot Git" -ForegroundColor Yellow
    Write-Host "   Pour initialiser un depot Git, utilisez: git init" -ForegroundColor Cyan
}

Write-Host ""
Write-Host "=== Verification terminee ===" -ForegroundColor Cyan

Write-Host ""
Write-Host "Commandes utiles:" -ForegroundColor Yellow
Write-Host "  git --version          - Afficher la version de Git" -ForegroundColor Cyan
Write-Host "  git status             - Voir l'etat du depot" -ForegroundColor Cyan
Write-Host "  git config --list      - Voir la configuration Git" -ForegroundColor Cyan
Write-Host "  git init               - Initialiser un nouveau depot Git" -ForegroundColor Cyan

