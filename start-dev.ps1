# PowerShell Development Launcher for AI Career Coach
# Launches Backend (Port 5000) and Frontend (Port 5173) in separate parallel processes

Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "🚀 STARTING AI CAREER COACH DEVELOPMENT SERVICES" -ForegroundColor Cyan
Write-Host "==========================================================" -ForegroundColor Cyan

$WorkspaceRoot = $PSScriptRoot

# 1. Verify Database
Write-Host "`n[1/3] Verifying database schema & initial seed data..." -ForegroundColor Yellow
Set-Location "$WorkspaceRoot\backend"
npx prisma db push --skip-generate
npx tsx src/db/seed.ts

# 2. Start Backend API Server
Write-Host "`n[2/3] Launching Backend API Server on http://localhost:5000..." -ForegroundColor Yellow
$BackendJob = Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$WorkspaceRoot\backend'; npm run dev" -PassThru

# 3. Start Frontend Client
Write-Host "`n[3/3] Launching Frontend Development Server on http://localhost:5173..." -ForegroundColor Yellow
$FrontendJob = Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$WorkspaceRoot\frontend'; npm run dev" -PassThru

Write-Host "`n==========================================================" -ForegroundColor Green
Write-Host "✅ SERVICES RUNNING" -ForegroundColor Green
Write-Host "📡 Backend:  http://localhost:5000 (Health: /api/health)" -ForegroundColor White
Write-Host "💻 Frontend: http://localhost:5173" -ForegroundColor White
Write-Host "⚡ Live SSE: http://localhost:5000/api/events" -ForegroundColor White
Write-Host "==========================================================" -ForegroundColor Green
Write-Host "To test all five compulsory workflow features, run:" -ForegroundColor Cyan
Write-Host "  cd backend; npm run test:five-steps" -ForegroundColor White
