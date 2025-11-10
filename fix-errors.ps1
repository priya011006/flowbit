# PowerShell script to fix common errors
Write-Host "🔧 Flowbit Error Fixer" -ForegroundColor Cyan
Write-Host ""

# Check if we're in the right directory
if (-not (Test-Path "package.json")) {
    Write-Host "❌ Error: package.json not found. Are you in the Flowbit directory?" -ForegroundColor Red
    exit 1
}

Write-Host "1. Checking Node.js installation..." -ForegroundColor Yellow
$nodeVersion = node --version
if ($LASTEXITCODE -eq 0) {
    Write-Host "   ✅ Node.js: $nodeVersion" -ForegroundColor Green
} else {
    Write-Host "   ❌ Node.js not found. Please install Node.js 18+" -ForegroundColor Red
    exit 1
}

Write-Host "2. Installing/updating dependencies..." -ForegroundColor Yellow
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "   ❌ Failed to install dependencies" -ForegroundColor Red
    exit 1
}
Write-Host "   ✅ Dependencies installed" -ForegroundColor Green

Write-Host "3. Generating Prisma client..." -ForegroundColor Yellow
npm run db:generate
if ($LASTEXITCODE -ne 0) {
    Write-Host "   ⚠️  Prisma client generation had issues. Check DATABASE_URL in .env" -ForegroundColor Yellow
} else {
    Write-Host "   ✅ Prisma client generated" -ForegroundColor Green
}

Write-Host "4. Checking .env file..." -ForegroundColor Yellow
if (Test-Path ".env") {
    Write-Host "   ✅ .env file exists" -ForegroundColor Green
    
    $envContent = Get-Content ".env" -Raw
    if ($envContent -notmatch "DATABASE_URL") {
        Write-Host "   ⚠️  DATABASE_URL not found in .env" -ForegroundColor Yellow
        Write-Host "   💡 Add: DATABASE_URL=postgresql://postgres:postgres@localhost:5432/analytics" -ForegroundColor Cyan
    }
    if ($envContent -notmatch "GROQ_API_KEY") {
        Write-Host "   ⚠️  GROQ_API_KEY not found in .env" -ForegroundColor Yellow
        Write-Host "   💡 Add: GROQ_API_KEY=your_groq_api_key_here" -ForegroundColor Cyan
    }
} else {
    Write-Host "   ⚠️  .env file not found. Creating template..." -ForegroundColor Yellow
    @"
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/analytics
NEXT_PUBLIC_API_BASE=http://localhost:4000
VANNA_API_BASE_URL=http://localhost:8000
GROQ_API_KEY=your_groq_api_key_here
"@ | Out-File -FilePath ".env" -Encoding utf8
    Write-Host "   ✅ Created .env file. Please update GROQ_API_KEY!" -ForegroundColor Green
}

Write-Host "5. Checking Docker..." -ForegroundColor Yellow
$dockerRunning = docker ps 2>&1
if ($LASTEXITCODE -eq 0) {
    Write-Host "   ✅ Docker is running" -ForegroundColor Green
    
    $dbContainer = docker ps --filter "name=db" --format "{{.Names}}"
    if ($dbContainer -match "db") {
        Write-Host "   ✅ Database container is running" -ForegroundColor Green
    } else {
        Write-Host "   ⚠️  Database container not running. Starting..." -ForegroundColor Yellow
        docker-compose up -d
    }
} else {
    Write-Host "   ⚠️  Docker not running or not installed" -ForegroundColor Yellow
    Write-Host "   💡 Install Docker Desktop and start it" -ForegroundColor Cyan
}

Write-Host ""
Write-Host "✅ Fix complete! Next steps:" -ForegroundColor Green
Write-Host "   1. Make sure .env file has correct values" -ForegroundColor Cyan
Write-Host "   2. Start database: docker-compose up -d" -ForegroundColor Cyan
Write-Host "   3. Push schema: npm run db:push" -ForegroundColor Cyan
Write-Host "   4. Ingest data: npm run ingest" -ForegroundColor Cyan
Write-Host "   5. Start services:" -ForegroundColor Cyan
Write-Host "      - Backend: cd apps/api && npm run dev" -ForegroundColor Cyan
Write-Host "      - Vanna AI: cd services/vanna && uvicorn main:app --reload" -ForegroundColor Cyan
Write-Host "      - Frontend: cd apps/web && npm run dev" -ForegroundColor Cyan





