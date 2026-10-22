@echo off
chcp 65001 >nul
cd /d "%~dp0"
where node >nul 2>nul
if errorlevel 1 (
  echo Node.js bulunamadı.
  echo https://nodejs.org adresinden güncel LTS sürümünü kurun.
  echo Ardından bu dosyayı tekrar açın.
  pause
  exit /b 1
)
if not exist "node_modules\electron\dist\electron.exe" (
  echo Gerekli masaüstü bileşenleri kuruluyor...
  call npm ci
  if errorlevel 1 (
    pause
    exit /b 1
  )
)
set ELECTRON_RUN_AS_NODE=
node node_modules\electron\cli.js .
if errorlevel 1 pause
