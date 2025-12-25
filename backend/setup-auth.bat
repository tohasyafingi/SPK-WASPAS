@echo off
echo ========================================
echo AUTH LOGIN - DATABASE SETUP
echo ========================================
echo.

cd /d "%~dp0"

echo [1/3] Starting server to initialize database...
start /B npm start
timeout /t 7 /nobreak > nul

echo.
echo [2/3] Creating initial users...
node seed.js

echo.
echo [3/3] Setup complete!
echo.
echo ========================================
echo NEXT STEPS:
echo ========================================
echo 1. Server is running on http://localhost:5000
echo 2. Start frontend: cd ..\frontend ^&^& npm install ^&^& npm start
echo 3. Login with:
echo    - Username: admin
echo    - Password: admin123
echo.
pause
