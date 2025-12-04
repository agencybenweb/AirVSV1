# Script d'export du code source AirVS
# Ce script cree une archive du code source sans node_modules ni dist

Write-Host "=== Export du code source AirVS ===" -ForegroundColor Cyan

# Obtenir la date actuelle pour le nom du fichier
$dateStamp = Get-Date -Format 'yyyy-MM-dd-HHmmss'
$exportFileName = "airvs-main-source-$dateStamp.zip"
$currentDir = Get-Location

# Verifier qu'on est dans le bon repertoire
if (-not (Test-Path "package.json")) {
    Write-Host "ERREUR: package.json introuvable. Assurez-vous d'etre dans le repertoire du projet." -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "Repertoire actuel: $currentDir" -ForegroundColor Yellow

# Demander confirmation
$confirmation = Read-Host "`nVoulez-vous creer une archive du code source ? (O/N)"
if ($confirmation -ne 'O' -and $confirmation -ne 'o') {
    Write-Host "Export annule." -ForegroundColor Yellow
    exit 0
}

# Creer un dossier temporaire pour l'export
$tempDir = "$env:TEMP\airvs-export-$dateStamp"
Write-Host ""
Write-Host "Creation du dossier temporaire..." -ForegroundColor Yellow
New-Item -ItemType Directory -Path $tempDir -Force | Out-Null

try {
    Write-Host "Copie des fichiers source..." -ForegroundColor Yellow
    
    # Copier les dossiers importants
    $foldersToCopy = @("src", "public")
    foreach ($folder in $foldersToCopy) {
        if (Test-Path $folder) {
            Copy-Item -Path $folder -Destination "$tempDir\$folder" -Recurse -Force
            Write-Host "  [OK] $folder copie" -ForegroundColor Green
        }
    }
    
    # Copier les fichiers de configuration
    $filesToCopy = @(
        "package.json",
        "package-lock.json",
        "tsconfig.json",
        "tsconfig.app.json",
        "tsconfig.node.json",
        "vite.config.ts",
        "tailwind.config.ts",
        "postcss.config.js",
        "eslint.config.js",
        "components.json",
        "index.html",
        "README.md",
        "GUIDE_EXPORT.md"
    )
    
    foreach ($file in $filesToCopy) {
        if (Test-Path $file) {
            Copy-Item -Path $file -Destination "$tempDir\$file" -Force
            Write-Host "  [OK] $file copie" -ForegroundColor Green
        }
    }
    
    # Creer l'archive ZIP
    Write-Host ""
    Write-Host "Creation de l'archive ZIP..." -ForegroundColor Yellow
    $exportPath = Join-Path $currentDir $exportFileName
    
    Compress-Archive -Path "$tempDir\*" -DestinationPath $exportPath -Force
    
    if (Test-Path $exportPath) {
        $fileSize = (Get-Item $exportPath).Length / 1MB
        Write-Host ""
        Write-Host "[SUCCES] Export reussi !" -ForegroundColor Green
        Write-Host "  Fichier: $exportFileName" -ForegroundColor Cyan
        Write-Host "  Taille: $([math]::Round($fileSize, 2)) MB" -ForegroundColor Cyan
        Write-Host "  Emplacement: $exportPath" -ForegroundColor Cyan
    } else {
        Write-Host ""
        Write-Host "[ERREUR] Erreur lors de la creation de l'archive." -ForegroundColor Red
        exit 1
    }
    
} catch {
    Write-Host ""
    Write-Host "[ERREUR] Erreur: $_" -ForegroundColor Red
    exit 1
} finally {
    # Nettoyer le dossier temporaire
    Write-Host ""
    Write-Host "Nettoyage du dossier temporaire..." -ForegroundColor Yellow
    Remove-Item -Path $tempDir -Recurse -Force -ErrorAction SilentlyContinue
}

Write-Host ""
Write-Host "=== Export termine ===" -ForegroundColor Cyan
