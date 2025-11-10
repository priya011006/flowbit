# Troubleshooting Guide - Common Terminal Errors

## Common Errors and Solutions

### 1. Error: Cannot find module '@prisma/client'

**Solution:**
```bash
# Generate Prisma client
npm run db:generate

# Or reinstall dependencies
npm install
```

### 2. Error: DATABASE_URL is not set

**Solution:**
1. Create `.env` file in root directory
2. Add:
```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/analytics
```

### 3. Error: Cannot connect to database

**Solution:**
```bash
# Check if Docker is running
docker-compose ps

# Start database
docker-compose up -d

# Check database connection
docker-compose logs db
```

### 4. Error: Module not found (import errors)

**Solution:**
```bash
# Reinstall all dependencies
npm install

# For frontend
cd apps/web && npm install && cd ../..

# For backend
cd apps/api && npm install && cd ../..
```

### 5. Error: ts-node not found

**Solution:**
```bash
npm install -D ts-node
```

### 6. Error: Port already in use

**Solution:**
```bash
# Windows: Find and kill process on port
netstat -ano | findstr :4000
taskkill /PID <PID> /F

# Mac/Linux: Find and kill process
lsof -ti:4000 | xargs kill -9
```

### 7. Error: Prisma schema not found

**Solution:**
```bash
# Make sure you're in the root directory
cd /path/to/Flowbit

# Generate Prisma client
npm run db:generate
```

### 8. Error: ESM/CommonJS module issues

**Solution:**
The ingest script has been updated to use CommonJS. If you still get errors:

```bash
# Try running with node directly after building
npm run db:generate
npx ts-node scripts/ingest.ts
```

### 9. Error: Python/Vanna AI service errors

**Solution:**
```bash
# Make sure Python 3.11+ is installed
python --version

# Install dependencies
cd services/vanna
pip install -r requirements.txt

# Check if Groq API key is set
# In .env file: GROQ_API_KEY=your_key_here
```

### 10. Error: Next.js build errors

**Solution:**
```bash
# Clear Next.js cache
cd apps/web
rm -rf .next
npm run dev
```

### 11. Error: TypeScript errors

**Solution:**
```bash
# Check TypeScript version
npx tsc --version

# Reinstall TypeScript
npm install -D typescript@latest

# Check tsconfig.json files exist:
# - apps/web/tsconfig.json
# - apps/api/tsconfig.json
# - scripts/tsconfig.json
```

### 12. Error: CORS errors in browser

**Solution:**
- Make sure backend API is running on port 4000
- Check CORS is enabled in `apps/api/src/index.ts`
- Verify `NEXT_PUBLIC_API_BASE` in frontend `.env.local`

### 13. Error: Database migration errors

**Solution:**
```bash
# Reset database (WARNING: deletes all data)
npm run db:push -- --force-reset

# Or manually drop and recreate
# Connect to database and run:
# DROP SCHEMA public CASCADE;
# CREATE SCHEMA public;
```

### 14. Error: Data ingestion fails

**Solution:**
```bash
# Check if data file exists
ls -la data/Analytics_Test_Data.json

# Check file is valid JSON
node -e "console.log(JSON.parse(require('fs').readFileSync('data/Analytics_Test_Data.json', 'utf8')).length)"

# Check error logs
cat data/ingest_errors.log
```

### 15. Error: Module resolution issues

**Solution:**
```bash
# Clear node_modules and reinstall
rm -rf node_modules
rm -rf apps/*/node_modules
npm install
```

## Step-by-Step Debugging

### If nothing works:

1. **Check all services are installed:**
```bash
node --version  # Should be 18+
npm --version
docker --version
python --version  # Should be 3.11+
```

2. **Clean install:**
```bash
# Remove all node_modules
rm -rf node_modules
rm -rf apps/*/node_modules
rm -rf apps/*/.next

# Reinstall
npm install
cd apps/web && npm install && cd ../..
cd apps/api && npm install && cd ../..
```

3. **Check environment variables:**
```bash
# Create .env file
cat > .env << EOF
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/analytics
NEXT_PUBLIC_API_BASE=http://localhost:4000
VANNA_API_BASE_URL=http://localhost:8000
GROQ_API_KEY=your_key_here
EOF
```

4. **Start services in order:**
```bash
# 1. Database
docker-compose up -d

# 2. Generate Prisma client
npm run db:generate

# 3. Push schema
npm run db:push

# 4. Ingest data
npm run ingest

# 5. Start backend (new terminal)
cd apps/api && npm run dev

# 6. Start Vanna AI (new terminal)
cd services/vanna && uvicorn main:app --reload

# 7. Start frontend (new terminal)
cd apps/web && npm run dev
```

## Getting Help

If you're still getting errors:

1. **Share the full error message** - Copy the entire error from terminal
2. **Check which command failed** - What were you running?
3. **Check the logs** - Look at terminal output
4. **Verify environment** - Are all services running?

## Quick Health Check

Run these commands to verify everything is set up:

```bash
# Check Node.js
node --version

# Check npm
npm --version

# Check Docker
docker --version
docker-compose ps

# Check Prisma
npx prisma --version

# Check database connection
npx prisma db push --skip-generate

# Check if ports are available
# Windows:
netstat -ano | findstr ":3000 :4000 :8000"
# Mac/Linux:
lsof -i :3000 -i :4000 -i :8000
```

## Common File Locations

- **Environment variables**: `.env` (root directory)
- **Database schema**: `prisma/schema.prisma`
- **Ingestion script**: `scripts/ingest.ts`
- **Backend API**: `apps/api/src/`
- **Frontend**: `apps/web/src/`
- **Vanna AI**: `services/vanna/`

## Still Stuck?

1. Check the error message carefully
2. Google the exact error message
3. Check if all dependencies are installed
4. Verify all environment variables are set
5. Make sure all services are running
6. Check the browser console for frontend errors
7. Check terminal logs for backend errors





