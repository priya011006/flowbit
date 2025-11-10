# How to Diagnose and Fix Terminal Errors

## 🔍 Step 1: Identify the Error

**Please copy the FULL error message from your terminal** and check which category it falls into:

### Category A: Module/Import Errors
```
Error: Cannot find module '@prisma/client'
Error: Cannot find module 'express'
Error: Module not found
```

### Category B: Database Errors
```
Error: Can't reach database server
Error: DATABASE_URL is not set
Error: P1001: Can't reach database server
```

### Category C: Port/Connection Errors
```
Error: Port 4000 is already in use
Error: EADDRINUSE
Error: Connection refused
```

### Category D: TypeScript/Compilation Errors
```
Error: Type error
Error: Cannot find name
Error: ts-node not found
```

### Category E: Prisma Errors
```
Error: Prisma Client is not generated
Error: Schema validation error
Error: Migration failed
```

## 🔧 Quick Fixes by Category

### Category A: Module/Import Errors

**Solution:**
```powershell
# Reinstall all dependencies
Remove-Item -Recurse -Force node_modules -ErrorAction SilentlyContinue
npm install

# Install in each app
cd apps\web
npm install
cd ..\api
npm install
cd ..\..
```

### Category B: Database Errors

**Solution:**
```powershell
# 1. Check if Docker is running
docker ps

# 2. Start database
docker-compose up -d

# 3. Check .env file has DATABASE_URL
Get-Content .env | Select-String "DATABASE_URL"

# 4. Test connection
npm run db:push
```

### Category C: Port/Connection Errors

**Solution:**
```powershell
# Find what's using the port
netstat -ano | findstr :4000

# Kill the process (replace PID)
taskkill /PID <PID> /F

# Or kill all Node processes
taskkill /IM node.exe /F
```

### Category D: TypeScript/Compilation Errors

**Solution:**
```powershell
# Install TypeScript and ts-node
npm install -D typescript ts-node @types/node

# Check tsconfig.json exists
Test-Path apps\api\tsconfig.json
Test-Path apps\web\tsconfig.json
Test-Path scripts\tsconfig.json
```

### Category E: Prisma Errors

**Solution:**
```powershell
# Generate Prisma client
npm run db:generate

# If that fails, check DATABASE_URL
# Then reset and push
npm run db:push -- --force-reset
```

## 🚀 Complete Reset (If Nothing Works)

```powershell
# 1. Stop all services
taskkill /IM node.exe /F -ErrorAction SilentlyContinue

# 2. Clean everything
Remove-Item -Recurse -Force node_modules -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force apps\*\node_modules -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force apps\web\.next -ErrorAction SilentlyContinue

# 3. Clean Docker
docker-compose down -v

# 4. Reinstall
npm install

# 5. Start database
docker-compose up -d

# 6. Wait 10 seconds for database to start
Start-Sleep -Seconds 10

# 7. Generate Prisma client
npm run db:generate

# 8. Push schema
npm run db:push

# 9. Ingest data
npm run ingest
```

## 📝 Common Error Messages and Solutions

### "Cannot find module '@prisma/client'"
```powershell
npm run db:generate
npm install
```

### "DATABASE_URL environment variable is not set"
```powershell
# Create .env file
@"
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/analytics
NEXT_PUBLIC_API_BASE=http://localhost:4000
VANNA_API_BASE_URL=http://localhost:8000
GROQ_API_KEY=your_key_here
"@ | Out-File -FilePath ".env" -Encoding utf8
```

### "Port 4000 is already in use"
```powershell
# Find and kill
netstat -ano | findstr :4000
# Note the PID, then:
taskkill /PID <PID> /F
```

### "Error: P1001: Can't reach database server"
```powershell
# Check Docker
docker-compose ps
# Start if not running
docker-compose up -d
# Check logs
docker-compose logs db
```

### "ts-node: command not found"
```powershell
npm install -D ts-node
# Or use npx
npx ts-node scripts/ingest.ts
```

### "TypeError: Cannot read property"
```powershell
# Usually a missing dependency
npm install
cd apps\api
npm install
cd ..\web
npm install
```

## 🎯 Testing After Fix

After applying fixes, test each component:

```powershell
# 1. Test database
docker-compose ps
npm run db:push

# 2. Test backend
cd apps\api
npm run dev
# Should see: "Server running on port 4000"

# 3. Test frontend
cd apps\web
npm run dev
# Should see: "Ready on http://localhost:3000"

# 4. Test Vanna AI
cd services\vanna
venv\Scripts\activate
uvicorn main:app --reload
# Should see: "Uvicorn running on http://0.0.0.0:8000"
```

## 📞 Need More Help?

**Please provide:**
1. The **exact error message** (copy entire output)
2. **Which command** you ran (e.g., `npm run ingest`)
3. **What you were trying to do** (e.g., start the backend)
4. **Your Node.js version**: `node --version`
5. **Your OS**: Windows/Mac/Linux

## 🔍 Debugging Checklist

- [ ] Node.js installed (v18+)
- [ ] npm installed
- [ ] Docker installed and running
- [ ] .env file exists with DATABASE_URL
- [ ] node_modules installed (`npm install`)
- [ ] Prisma client generated (`npm run db:generate`)
- [ ] Database running (`docker-compose ps`)
- [ ] Schema pushed (`npm run db:push`)
- [ ] No port conflicts (check :3000, :4000, :8000)
- [ ] All dependencies installed in apps/web and apps/api

## 💡 Pro Tips

1. **Always check the full error message** - The solution is usually in the error itself
2. **Check the logs** - Terminal output shows what went wrong
3. **Start services in order** - Database → Backend → Frontend
4. **Use separate terminals** - One for each service
5. **Check environment variables** - Make sure .env file is correct
6. **Restart Docker** - If database issues: `docker-compose restart`
7. **Clear caches** - Remove .next and node_modules if needed





