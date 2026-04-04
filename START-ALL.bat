@echo off
echo.
echo ============================================
echo   SUPER LATINO STORE - INICIO COMPLETO
echo ============================================
echo.

REM Verificar si MongoDB está corriendo
echo [1/4] Verificando MongoDB...
mongosh --version >nul 2>&1
if errorlevel 1 (
    echo ❌ MongoDB no está instalado o no está en el PATH
    echo.
    echo Por favor asegúrate de que MongoDB esté corriendo.
    echo O usa MongoDB Atlas: https://www.mongodb.com/cloud/atlas
    echo.
    pause
    exit /b 1
)

echo ✅ MongoDB disponible
echo.

REM Iniciar Backend
echo [2/4] Iniciando Backend API...
start "Super Latino - Backend" cmd /k "cd backend && npm run dev"
timeout /t 3 >nul

REM Iniciar Frontend
echo [3/4] Iniciando Frontend Vue...
start "Super Latino - Frontend" cmd /k "cd frontend && npm run dev"
timeout /t 3 >nul

REM Iniciar Admin Panel Server
echo [4/5] Iniciando Servidor Admin Panel...
start "Super Latino - Admin Server" cmd /k "cd %~dp0 && node admin-server.js"
timeout /t 2 >nul

echo.
echo ============================================
echo   ✅ TODO INICIADO CORRECTAMENTE
echo ============================================
echo.
echo 📊 Backend API:    http://localhost:5000
echo 🎨 Frontend Vue:   http://localhost:5173
echo 👨‍💼 Admin Panel:    http://localhost:3000
echo.
echo 🔐 ACCESO AL PANEL ADMIN:
echo    URL: http://localhost:3000
echo    Email: admin@superlatino.com
echo    Password: admin123
echo    ⚠️  IMPORTANTE: Cambia la contraseña después del primer login!
echo.
pause




