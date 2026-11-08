@echo off
setlocal
title Arun Vijayan portfolio - local dev server
cd /d "%~dp0"

rem ---- 1. Find Node.js (works even if this window's PATH is old) -------------------------
set "PATH=%PATH%;%ProgramFiles%\nodejs;%LOCALAPPDATA%\Programs\nodejs;%APPDATA%\npm"
where node >nul 2>nul
if errorlevel 1 (
  echo.
  echo  Node.js was not found. Install the LTS version from https://nodejs.org
  echo  then double-click this file again.
  echo.
  pause
  exit /b 1
)

rem ---- 2. Get the latest version from GitHub -----------------------------------------------
where git >nul 2>nul
if not errorlevel 1 (
  echo Getting the latest version from GitHub...
  git checkout -- src/content/images.generated.ts >nul 2>nul
  git fetch origin v2-redesign >nul 2>nul
  git checkout v2-redesign >nul 2>nul
  git pull --ff-only origin v2-redesign
  if errorlevel 1 echo   Could not update automatically - starting the version you already have.
)

rem ---- 3. Install packages (fast when nothing changed) --------------------------------------
echo Checking packages...
call npm install --no-audit --no-fund --loglevel=error
if errorlevel 1 (
  echo npm install failed - see the message above.
  pause
  exit /b 1
)

rem ---- 4. Free port 3005 if an old server is still running ----------------------------------
for /f "tokens=5" %%p in ('netstat -ano ^| findstr ":3005" ^| findstr "LISTENING"') do taskkill /F /PID %%p >nul 2>nul

rem ---- 5. Start the site and open the browser -----------------------------------------------
echo.
echo  Starting the site at http://localhost:3005  (keep this window open; close it to stop)
echo.
start "" /min cmd /c "timeout /t 15 /nobreak >nul & start http://localhost:3005"
call npm run dev -- -p 3005
pause
