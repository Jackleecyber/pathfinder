# Cascade Development Launcher
Write-Host "Starting Cascade Development Servers..." -ForegroundColor Green

# Start Backend
Write-Host "Starting Backend API..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD\backend'; npm run dev"

# Wait a moment
Start-Sleep -Seconds 2

# Start Excel Add-in
Write-Host "Starting Excel Add-in..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD\excel-addin'; npm run dev"

Write-Host "Both servers are starting in separate windows..." -ForegroundColor Green
Write-Host "Backend API: http://localhost:3000" -ForegroundColor Cyan
Write-Host "Excel Add-in: https://localhost:3001" -ForegroundColor Cyan
Write-Host ""
Write-Host "Press any key to continue..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")

