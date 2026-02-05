@echo off
REM Prompt Wizard Extension - Quick Setup & Test Script
REM Run this after making changes to quickly reload and test

echo.
echo ========================================
echo   Prompt Wizard Extension Setup
echo ========================================
echo.

REM Check if we're in the right directory
if not exist "manifest.json" (
    echo [ERROR] manifest.json not found!
    echo Please run this script from the extension folder
    pause
    exit /b 1
)

echo [1/4] Checking extension files...
set "missing="
if not exist "content.js" set "missing=content.js"
if not exist "content.css" set "missing=%missing% content.css"
if not exist "popup.html" set "missing=%missing% popup.html"
if not exist "popup.js" set "missing=%missing% popup.js"
if not exist "background.js" set "missing=%missing% background.js"

if defined missing (
    echo [ERROR] Missing files: %missing%
    pause
    exit /b 1
)
echo [OK] All core files present

echo.
echo [2/4] Checking icon files...
if not exist "icons\icon16.png" (
    echo [ERROR] icons\icon16.png not found
    pause
    exit /b 1
)
if not exist "icons\icon128.png" (
    echo [ERROR] icons\icon128.png not found
    pause
    exit /b 1
)
echo [OK] Icon files present

echo.
echo [3/4] Validating manifest.json...
findstr /C:"\"manifest_version\": 3" manifest.json >nul
if errorlevel 1 (
    echo [ERROR] Invalid manifest.json - must be version 3
    pause
    exit /b 1
)
echo [OK] Manifest valid

echo.
echo [4/4] Setup Instructions
echo ========================================
echo.
echo Chrome Setup:
echo   1. Open: chrome://extensions/
echo   2. Enable "Developer mode" (top-right toggle)
echo   3. Click "Load unpacked"
echo   4. Select this folder: %CD%
echo   5. Click "Reload" if already loaded
echo.
echo Edge Setup:
echo   1. Open: edge://extensions/
echo   2. Enable "Developer mode" (left sidebar)
echo   3. Click "Load unpacked"  
echo   4. Select this folder: %CD%
echo   5. Click "Reload" if already loaded
echo.
echo Brave Setup:
echo   1. Open: brave://extensions/
echo   2. Enable "Developer mode" (top-right toggle)
echo   3. Click "Load unpacked"
echo   4. Select this folder: %CD%
echo   5. Click "Reload" if already loaded
echo.
echo ========================================
echo   Ready to Test!
echo ========================================
echo.
echo Test on these platforms:
echo   1. Claude.ai - https://claude.ai
echo   2. ChatGPT - https://chat.openai.com
echo   3. Any website with text inputs
echo.
echo Expected behavior:
echo   - Type 10+ characters in text field
echo   - "Enhance" button appears (bottom-right)
echo   - Click to enhance and see preview modal
echo   - Test Copy and Apply buttons
echo.
echo Troubleshooting:
echo   - Open browser console (F12) for errors
echo   - Check for: "🪄 Prompt Wizard extension loaded"
echo   - See TESTING.md for detailed guide
echo.
echo ========================================

REM Try to open Chrome extensions page
echo.
choice /C YN /M "Open Chrome extensions page now"
if errorlevel 2 goto :skip_chrome
start chrome://extensions/
:skip_chrome

echo.
echo Setup complete! Follow the instructions above.
echo.
pause
