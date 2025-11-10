# Flowbit Analytics Dashboard

A production-grade full-stack web application with an Interactive Analytics Dashboard and "Chat with Data" interface powered by Vanna AI and Groq.

## 🏗️ Architecture

This is a monorepo built with:

- **Frontend**: Next.js 15 (App Router) + TypeScript + TailwindCSS + shadcn/ui + Recharts
- **Backend API**: Express.js + TypeScript + Prisma ORM
- **Database**: PostgreSQL
- **AI Service**: Vanna AI (Python FastAPI) + Groq LLM
- **Monorepo**: npm workspaces + Turborepo

## 📁 Project Structure

```
flowbit/
├── apps/
│   ├── web/              # Next.js frontend
│   └── api/              # Express.js backend API
├── services/
│   └── vanna/            # Vanna AI Python service
├── prisma/
│   └── schema.prisma     # Database schema
├── scripts/
│   └── ingest.ts         # Data ingestion script
├── data/
│   └── Analytics_Test_Data.json
└── docker-compose.yml    # PostgreSQL setup
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm
- Python 3.11+
- Docker and Docker Compose (for PostgreSQL)
- Groq API key ([Get one here](https://console.groq.com/))

### 1. Clone and Install Dependencies

```bash
# Install root dependencies
npm install

# Install frontend dependencies
cd apps/web && npm install && cd ../..

# Install backend dependencies
cd apps/api && npm install && cd ../..
```

### 2. Set Up Database

```bash
# Start PostgreSQL with Docker Compose
docker-compose up -d

# Generate Prisma client
npm run db:generate

# Push schema to database
npm run db:push
```

### 3. Configure Environment Variables

Copy `.env.example` to `.env` and fill in your values:

```bash
cp .env.example .env
```

Update the following in `.env`:
- `DATABASE_URL`: PostgreSQL connection string
- `GROQ_API_KEY`: Your Groq API key
- `VANNA_API_BASE_URL`: Vanna AI service URL (default: http://localhost:8000)

### 4. Ingest Data

```bash
# Run the ingestion script to load data from Analytics_Test_Data.json
npm run ingest
```

### 5. Set Up Vanna AI Service

```bash
cd services/vanna

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Copy environment file
cp .env.example .env
# Edit .env with your DATABASE_URL and GROQ_API_KEY

# Run the service
uvicorn main:app --reload --port 8000
```

### 6. Start Backend API

```bash
# From root directory
cd apps/api
npm run dev
```

The API will run on http://localhost:4000

### 7. Start Frontend

```bash
# From root directory
cd apps/web
npm run dev
```

The frontend will run on http://localhost:3000

## 📊 Features

### Analytics Dashboard

- **Overview Cards**: Total Spend (YTD), Total Invoices, Documents Uploaded, Average Invoice Value
- **Charts**:
  - Invoice Volume & Value Trend (Line Chart)
  - Spend by Vendor (Top 10, Horizontal Bar Chart)
  - Spend by Category (Pie Chart)
  - Cash Outflow Forecast (Bar Chart)
- **Invoices Table**: Searchable, sortable, scrollable table with vendor, date, invoice number, amount, and status

### Chat with Data

- Natural language queries about your invoice data
- SQL generation using Vanna AI + Groq
- Query results displayed in tables
- Generated SQL shown for transparency

## 🔌 API Endpoints

### Backend API (http://localhost:4000)

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/stats` | GET | Returns totals for overview cards |
| `/invoice-trends` | GET | Returns monthly invoice count and spend |
| `/vendors/top10` | GET | Returns top 10 vendors by spend |
| `/category-spend` | GET | Returns spend grouped by category |
| `/cash-outflow` | GET | Returns expected cash outflow by date range |
| `/invoices` | GET | Returns list of invoices with filters/search |
| `/chat-with-data` | POST | Forwards NL queries to Vanna AI and returns SQL + data |

### Example API Calls

```bash
# Get stats
curl http://localhost:4000/stats

# Get invoice trends
curl http://localhost:4000/invoice-trends

# Get top vendors
curl http://localhost:4000/vendors/top10

# Chat with data
curl -X POST http://localhost:4000/chat-with-data \
  -H "Content-Type: application/json" \
  -d '{"query": "What is the total spend in the last 90 days?"}'
```

## 🗄️ Database Schema

The database uses the following main tables:

- `vendors` - Vendor information
- `customers` - Customer information
- `invoices` - Invoice records
- `invoice_line_items` - Line items for each invoice
- `payments` - Payment records
- `categories` - Category classifications

See `prisma/schema.prisma` for the complete schema definition.

## 🤖 Vanna AI Setup

The Vanna AI service connects to your PostgreSQL database and uses Groq for SQL generation. 

### Training Vanna (Optional)

After setting up the service, you can train Vanna on your schema:

```bash
curl http://localhost:8000/api/v1/train
```

This will help Vanna understand your database structure better.

## 🚢 Deployment

### Frontend (Vercel)

1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy

### Backend API

The backend can be deployed to:
- Vercel (using serverless functions)
- Railway
- Render
- Digital Ocean

### Vanna AI Service

Deploy to:
- Render
- Railway
- Fly.io
- Digital Ocean
- Docker container

Make sure to:
- Set all environment variables
- Enable CORS for your frontend domain
- Keep the database connection secure

## 📝 Environment Variables

### Frontend (.env.local)

```env
NEXT_PUBLIC_API_BASE=http://localhost:4000
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Backend (.env)

```env
DATABASE_URL=postgresql://user:pass@host:5432/dbname
PORT=4000
VANNA_API_BASE_URL=http://localhost:8000
```

### Vanna AI (services/vanna/.env)

```env
DATABASE_URL=postgresql+psycopg2://user:pass@host:5432/dbname
GROQ_API_KEY=your_groq_api_key
VANNA_API_KEY=your_vanna_api_key
PORT=8000
```

## 🔧 Development Scripts

```bash
# Root level
npm run dev          # Run all services in dev mode
npm run build        # Build all services
npm run ingest       # Ingest data from JSON file
npm run db:push      # Push Prisma schema to database
npm run db:generate  # Generate Prisma client
npm run db:studio    # Open Prisma Studio

# Frontend (apps/web)
npm run dev          # Start Next.js dev server
npm run build        # Build for production
npm run start        # Start production server

# Backend (apps/api)
npm run dev          # Start Express dev server
npm run build        # Build TypeScript
npm run start        # Start production server
```

## 📚 Tech Stack Details

- **Next.js 15**: React framework with App Router
- **TypeScript**: Type-safe development
- **TailwindCSS**: Utility-first CSS framework
- **shadcn/ui**: High-quality UI components
- **Recharts**: Composable charting library
- **Express.js**: Fast, minimal web framework
- **Prisma**: Next-generation ORM
- **PostgreSQL**: Relational database
- **Vanna AI**: Text-to-SQL generation
- **Groq**: Fast LLM inference
- **FastAPI**: Modern Python web framework

## 🐛 Troubleshooting

### Database Connection Issues

- Ensure PostgreSQL is running: `docker-compose ps`
- Check DATABASE_URL format
- Verify credentials in docker-compose.yml

### Vanna AI Issues

- Ensure Groq API key is set correctly
- Check database connection from Vanna service
- Review Vanna service logs

### Frontend Not Loading Data

- Verify API_BASE_URL is correct
- Check CORS settings in backend
- Ensure backend API is running

## 📄 License

ISC

## 👤 Author

Priya Patel

---

## 🎯 Assignment Completion Checklist

- ✅ PostgreSQL database setup
- ✅ Data ingestion from JSON
- ✅ Backend API with all required endpoints
- ✅ Analytics Dashboard with overview cards
- ✅ Charts (Line, Bar, Pie)
- ✅ Invoices table (searchable, sortable)
- ✅ Chat with Data interface
- ✅ Vanna AI integration
- ✅ Groq LLM integration
- ✅ Monorepo structure
- ✅ TypeScript throughout
- ✅ Production-ready code structure
- ✅ Documentation





