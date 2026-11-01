@echo off
if not "%CWB_HOST%"=="1" (
  set CWB_HOST=1
  start "" conhost.exe cmd /c "%~f0"
  exit /b
)
chcp 65001 >nul
set NODE_OPTIONS=--no-warnings
cd /d "%~dp0"
title Claude WhatsApp - START
powershell -NoProfile -ExecutionPolicy Bypass -File "app\setfont.ps1"
mode con cols=64 lines=24
where node >nul 2>&1
if errorlevel 1 (
  echo Node.js not found / nao encontrado. Opening https://nodejs.org - install the LTS version and run this file again.
  start https://nodejs.org
  pause
  exit /b 1
)
if not exist "app\node_modules" (
  echo Installing components / instalando componentes...
  pushd app
  call npm install --silent
  popd
)
node app\start.mjs
