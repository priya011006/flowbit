# Quick Fix Guide - Common Terminal Errors

## 🚀 Quick Fix Script

Run this PowerShell script to fix common issues:

```powershell
.\fix-errors.ps1
```

## 🔧 Manual Fixes

### Error: "Cannot find module"

**Fix:**
```powershell
# Remove node_modules and reinstall
Remove-Item -Recurse -Force node_modules
Remove-Item -Recurse -Force apps\web\node_modules
Remove-Item -Recurse -Force apps\api\node_modules
npm install
```

### Error: "DATABASE_URL is not set"

**Fix:**
1. Create `.env` file in root directory
2. Add this content:
```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/analytics
NEXT_PUBLIC_API_BASE=http://localhost:4000
VANNA_API_BASE_URL=http://localhost:8000
GROQ_API_KEY=your_groq_api_key_here
```

### Error: "Cannot connect to database"

**Fix:**
```powershell
# Start Docker containers
docker-compose up -d

# Check if database is running
docker-compose ps

# Check database logs
docker-compose logs db
```

### Error: "Prisma client not generated"

**Fix:**
```powershell
# Generate Prisma client
npm run db:generate

# If that fails, check DATABASE_URL first
# Then push schema
npm run db:push
```

### Error: "Port already in use"

**Fix (Windows PowerShell):**
```powershell
# Find process on port 4000
netstat -ano | findstr :4000

# Kill process (replace PID with actual process ID)
taskkill /PID <PID> /F

# Or kill all Node processes
taskkill /IM node.exe /F
```

### Error: "ts-node not found"

**Fix:**
```powershell
npm install -D ts-node
npm install -D @types/node
```

### Error: "Module resolution failed"

**Fix:**
```powershell
# Clear all caches
Remove-Item -Recurse -Force node_modules
Remove-Item -Recurse -Force apps\*\node_modules
Remove-Item -Recurse -Force apps\web\.next

# Reinstall
npm install
cd apps\web
npm install
cd ..\api
npm install
cd ..\..
```

### Error: "Python/Vanna AI errors"

**Fix:**
```powershell
# Check Python version (need 3.11+)
python --version

# Install dependencies
cd services\vanna
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt

# Check .env file has GROQ_API_KEY
```

## 📋 Step-by-Step Fresh Start

If nothing works, try this complete reset:

```powershell
# 1. Clean everything
Remove-Item -Recurse -Force node_modules -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force apps\*\node_modules -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force apps\web\.next -ErrorAction SilentlyContinue

# 2. Reinstall
npm install

# 3. Start database
docker-compose up -d

# 4. Create .env file (if not exists)
if (-not (Test-Path ".env")) {
    @"
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/analytics
NEXT_PUBLIC_API_BASE=http://localhost:4000
VANNA_API_BASE_URL=http://localhost:8000
GROQ_API_KEY=your_groq_api_key_here
"@ | Out-File -FilePath ".env" -Encoding utf8
}

# 5. Generate Prisma client
npm run db:generate

# 6. Push schema
npm run db:push

# 7. Ingest data
npm run ingest
```

## 🐛 Still Having Issues?

**Please share:**
1. The exact error message (copy from terminal)
2. Which command you ran
3. Your operating system (Windows/Mac/Linux)
4. Node.js version (`node --version`)
5. npm version (`npm --version`)

## ✅ Verify Installation

Run these to check everything is set up:

```powershell
# Check Node.js
node --version  # Should be 18+

# Check npm
npm --version

# Check Docker
docker --version
docker-compose ps

# Check Prisma
npx prisma --version

# Check if ports are free
netstat -ano | findstr ":3000 :4000 :8000"
```

## 🎯 Common Commands

```powershell
# Start database
docker-compose up -d

# Generate Prisma client
npm run db:generate

# Push schema to database
npm run db:push

# Ingest data
npm run ingest

# Start backend (new terminal)
cd apps\api
npm run dev

# Start Vanna AI (new terminal)
cd services\vanna
venv\Scripts\activate
uvicorn main:app --reload

# Start frontend (new terminal)
cd apps\web
npm run dev
```





