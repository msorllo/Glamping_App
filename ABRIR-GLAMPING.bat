@echo off
title Glamping Maestrat - Planificador
cd /d "%~dp0"
where node >nul 2>nul
if errorlevel 1 (
  echo Hace falta Node.js para abrir la app: https://nodejs.org
  pause
  exit /b
)
start "" http://localhost:5180
node app\servidor.mjs
pause
