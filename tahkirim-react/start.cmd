@echo off
rem Starts the BLACKBOX dev server. Double-click this file.
cd /d "%~dp0"
set "NODEDIR=C:\Program Files (x86)\nodejs"
if not exist "%NODEDIR%\npm.cmd" set "NODEDIR=C:\Program Files\nodejs"
set "PATH=%NODEDIR%;%PATH%"
if not exist node_modules call npm install
call npm run dev -- --open
pause
