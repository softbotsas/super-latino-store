# Super Latino Store - Script de Inicio Completo
Write-Host ""
Write-Host "============================================" -ForegroundColor Cyan
Write-Host "  SUPER LATINO STORE - INICIO COMPLETO" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""

# Verificar MongoDB
Write-Host "[1/4] Verificando MongoDB..." -ForegroundColor Yellow
try {
    $mongoVersion = mongosh --version 2>$null
    Write-Host "✅ MongoDB disponible" -ForegroundColor Green
} catch {
    Write-Host "❌ MongoDB no está instalado o no está corriendo" -ForegroundColor Red
    Write-Host ""
    Write-Host "Por favor asegúrate de que MongoDB esté corriendo." -ForegroundColor Yellow
    Write-Host "O usa MongoDB Atlas: https://www.mongodb.com/cloud/atlas" -ForegroundColor Yellow
    Write-Host ""
    pause
    exit 1
}
Write-Host ""

# Iniciar Backend
Write-Host "[2/4] Iniciando Backend API..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\backend'; npm run dev"
Start-Sleep -Seconds 3

# Iniciar Frontend
Write-Host "[3/4] Iniciando Frontend Vue..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\frontend'; npm run dev"
Start-Sleep -Seconds 3

# Iniciar Admin Panel Server
Write-Host "[4/5] Iniciando Servidor Admin Panel..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot'; node admin-server.js"
Start-Sleep -Seconds 2

Write-Host ""
Write-Host "============================================" -ForegroundColor Green
Write-Host "   ✅ TODO INICIADO CORRECTAMENTE" -ForegroundColor Green
Write-Host "============================================" -ForegroundColor Green
Write-Host ""
Write-Host "📊 Backend API:    http://localhost:5000" -ForegroundColor Cyan
Write-Host "🎨 Frontend Vue:   http://localhost:5173" -ForegroundColor Cyan
Write-Host "👨‍💼 Admin Panel:    http://localhost:3000" -ForegroundColor Cyan
Write-Host ""
Write-Host "🔐 ACCESO AL PANEL ADMIN:" -ForegroundColor Yellow
Write-Host "   URL: http://localhost:3000" -ForegroundColor White
Write-Host "   Email: admin@superlatino.com" -ForegroundColor White
Write-Host "   Password: admin123" -ForegroundColor White
Write-Host "   ⚠️  IMPORTANTE: Cambia la contraseña después del primer login!" -ForegroundColor Red
Write-Host ""
Write-Host "Presiona Ctrl+C en cada ventana para detener" -ForegroundColor Yellow
Write-Host ""
Read-Host "Presiona Enter para cerrar esta ventana"




