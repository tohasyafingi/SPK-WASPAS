@echo off
echo.
echo ========================================
echo   Starting SPK WASPAS Backend Server
echo ========================================
echo.

cd /d "%~dp0"

echo Backend directory: %CD%
echo.
echo Starting server...
echo.

npm start
