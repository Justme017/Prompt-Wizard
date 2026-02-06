# Package Extension for GitHub Release

Write-Host "📦 Packaging Prompt Wizard Extension..." -ForegroundColor Cyan

# Get version from manifest
$manifest = Get-Content "extension\manifest.json" | ConvertFrom-Json
$version = $manifest.version

Write-Host "Version: $version" -ForegroundColor Green

# Create release directory if it doesn't exist
$releaseDir = "release"
if (!(Test-Path $releaseDir)) {
    New-Item -ItemType Directory -Path $releaseDir | Out-Null
}

# Define the ZIP filename
$zipName = "prompt-wizard-extension-v$version.zip"
$zipPath = Join-Path $releaseDir $zipName

# Remove existing ZIP if it exists
if (Test-Path $zipPath) {
    Remove-Item $zipPath -Force
    Write-Host "Removed existing ZIP file" -ForegroundColor Yellow
}

# Files to include in the extension package
$files = @(
    "extension\manifest.json",
    "extension\background.js",
    "extension\content.js",
    "extension\content.css",
    "extension\popup.html",
    "extension\popup.js",
    "extension\icons\"
)

# Create a temporary directory for the extension
$tempDir = "temp_extension"
if (Test-Path $tempDir) {
    Remove-Item $tempDir -Recurse -Force
}
New-Item -ItemType Directory -Path $tempDir | Out-Null

# Copy extension files to temp directory
Write-Host "📂 Copying extension files..." -ForegroundColor Cyan

foreach ($file in $files) {
    if (Test-Path $file) {
        $destination = Join-Path $tempDir (Split-Path $file -Leaf)
        Copy-Item $file $destination -Recurse -Force
        Write-Host "  ✓ $file" -ForegroundColor Green
    }
}

# Create ZIP archive
Write-Host "🗜️  Creating ZIP archive..." -ForegroundColor Cyan
Compress-Archive -Path "$tempDir\*" -DestinationPath $zipPath -CompressionLevel Optimal

# Clean up temp directory
Remove-Item $tempDir -Recurse -Force

# Get file size
$fileSize = (Get-Item $zipPath).Length
$fileSizeKB = [math]::Round($fileSize / 1KB, 2)

Write-Host ""
Write-Host "✅ Extension packaged successfully!" -ForegroundColor Green
Write-Host ""
Write-Host "📦 Package Details:" -ForegroundColor Cyan
Write-Host "  File: $zipName" -ForegroundColor White
Write-Host "  Size: $fileSizeKB KB" -ForegroundColor White
Write-Host "  Location: $zipPath" -ForegroundColor White
Write-Host ""
Write-Host "🚀 Next Steps:" -ForegroundColor Cyan
Write-Host "  1. Go to: https://github.com/Justme017/Prompt-Wizard/releases/new" -ForegroundColor Yellow
Write-Host "  2. Tag: v$version" -ForegroundColor Yellow
Write-Host "  3. Title: Prompt Wizard Extension v$version" -ForegroundColor Yellow
Write-Host "  4. Copy contents from RELEASE_NOTES.md" -ForegroundColor Yellow
Write-Host "  5. Upload: $zipPath" -ForegroundColor Yellow
Write-Host "  6. Click 'Publish release'" -ForegroundColor Yellow
Write-Host ""
