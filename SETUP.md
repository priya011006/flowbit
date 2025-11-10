# Setup Guide

## Quick Start

### 1. Install Dependencies

```bash
# Install root dependencies
npm install

# Install frontend dependencies
cd apps/web && npm install && cd ../..

# Install backend dependencies
cd apps/api && npm install && cd ../..
```

### 2. Start PostgreSQL

```bash
docker-compose up -d
```

### 3. Set Up Database

```bash
# Generate Prisma client
npm run db:generate

# Push schema to database
npm run db:push

# Ingest data
npm run ingest
```

### 4. Configure Environment

Create `.env` file in root:

```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/analytics
NEXT_PUBLIC_API_BASE=http://localhost:4000
VANNA_API_BASE_URL=http://localhost:8000
GROQ_API_KEY=your_groq_api_key_here
```

### 5. Start Services

**Terminal 1 - Backend API:**
```bash
cd apps/api
npm run dev
```

**Terminal 2 - Vanna AI Service:**
```bash
cd services/vanna
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

**Terminal 3 - Frontend:**
```bash
cd apps/web
npm run dev
```

### 6. Access Application

- Frontend: http://localhost:3000
- Backend API: http://localhost:4000
- Vanna AI: http://localhost:8000

## Troubleshooting

### Database Connection Issues

1. Check if PostgreSQL is running: `docker-compose ps`
2. Verify DATABASE_URL in `.env`
3. Check database credentials in `docker-compose.yml`

### Prisma Issues

1. Regenerate Prisma client: `npm run db:generate`
2. Reset database: `npm run db:push -- --force-reset`
3. Check Prisma schema: `prisma/schema.prisma`

### Vanna AI Issues

1. Verify GROQ_API_KEY is set
2. Check DATABASE_URL format (should be postgresql:// or postgresql+psycopg2://)
3. Test database connection from Python
4. Check Vanna service logs

### Frontend Not Loading

1. Verify NEXT_PUBLIC_API_BASE is correct
2. Check if backend API is running
3. Check browser console for errors
4. Verify CORS settings in backend

## Getting Groq API Key

1. Go to https://console.groq.com/
2. Sign up or log in
3. Create an API key
4. Add it to your `.env` file





