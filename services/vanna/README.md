# Flowbit – Full Stack Developer Intern Assignment

**Candidate:** Priya Patel  
**Repo:** [https://github.com/priya011006/flowbit](https://github.com/priya011006/flowbit)

---

## 🧱 Project Structure

```
flowbit/
├── apps/
│   ├── web/              # Frontend (Next.js + TypeScript + Tailwind + shadcn/ui)
│   └── api/              # Backend API (Node.js + TypeScript)
├── services/
│   └── vanna/            # AI Service (Python + FastAPI + Groq)
├── data/
│   ├── Analytics_Test_Data.json    # Original dataset
│   └── analytics_dump.sql          # PostgreSQL dump (generated from local DB)
├── .env.sample           # Example environment variables for reviewer
└── README.md             # This documentation
```

---

## 🚀 Quick Start

### Prerequisites

- Docker + Docker Compose for PostgreSQL
- Node.js (v16+) + npm/Yarn
- Python 3.10+ in `/services/vanna/venv`

### Setup

#### 1. Clone the repository

```bash
git clone https://github.com/priya011006/flowbit.git
cd flowbit
```

#### 2. Configure environment variables

Copy `.env.sample` to the appropriate places:

```bash
# Frontend (if needed)
cp .env.sample apps/web/.env.local

# Backend
cp .env.sample apps/api/.env

# AI service
cp .env.sample services/vanna/.env
```

Update each `.env` with your credentials (DB host, user, password, GROQ API key, etc.)

#### 3. Start PostgreSQL

```bash
docker-compose up -d
# Wait until the DB container is healthy
```

#### 4. Load dataset

```bash
docker exec -i flowbit-db-1 psql -U postgres -d analytics < data/analytics_dump.sql
```

#### 5. Run backend API (in one terminal)

```bash
cd apps/api
npm install
npm run dev
```

#### 6. Run AI Service (in another terminal)

```bash
cd services/vanna
source venv/bin/activate      # or venv\Scripts\activate on Windows
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

#### 7. Run frontend (in another terminal)

```bash
cd apps/web
npm install
npm run dev
```

#### 8. Access the application

- **Frontend UI:** http://localhost:3000
- **Backend API docs:** http://localhost:4000
- **AI Service health check:** http://127.0.0.1:8000/health

---

## 📈 API Endpoints (Backend)

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/stats` | GET | Totals for overview cards (spend, invoices) |
| `/vendors/top10` | GET | Returns top 10 vendors by spend |
| `/category-spend` | GET | Returns spend grouped by category |
| `/cash-outflow` | GET | Returns cash outflow forecast by date |
| `/invoices` | GET | List of invoices, supports filters/search |
| `/chat-with-data` | POST | NL query → AI service → SQL → DB → result |

---

## 🤖 Chat with Data Workflow

1. **Frontend** sends NL question (e.g., "What's the total spend in the last 90 days?") to backend `/chat-with-data`.

2. **Backend** proxies the request to the AI Service (`services/vanna`) at `/api/v1/chat`.

3. **AI Service** uses the `DATABASE_URL` and schema introspection to generate SQL via Groq LLM — currently using the `llama-3.1-8b-instant` model with the `GROQ_API_KEY`.

4. **SQL** is executed on the PostgreSQL database, results are returned.

5. **Frontend** displays the generated SQL, results table (and optional chart).

---

## ✅ What Works

- ✅ Full ingestion of provided dataset into normalized tables (invoices, vendors, payments, line_items)
- ✅ Frontend dashboard: overview cards, charts, invoice table view
- ✅ Backend API endpoints returning real data
- ✅ AI service running and reachable
- ✅ Chat UI present in frontend

---

## ⚠️ Known Issues

### Chat with Data: Groq Model Access Limitations

Currently configured with `llama-3.1-8b-instant`, but if your Groq account lacks access you may receive a `model_not_found` or `model_decommissioned` error.

**To fix:**
1. Log into [Groq Console](https://console.groq.com/) → Models
2. Select a model you have access to
3. Update `services/vanna/main.py` with the model name
4. Restart service

### Database URL Warning

If `DATABASE_URL` is missing from `services/vanna/.env`, the AI service will show the message "DATABASE_URL is not set…" in logs.

**To fix:**
1. Ensure `.env` file exists in `services/vanna/`
2. Add `DATABASE_URL=postgresql://user:pass@host:5432/dbname`
3. Restart service

### Deployment Status

This submission is running locally (Docker + localhost). Production-level hosting (Vercel for frontend, Render/Railway for AI service, etc.) is intended but not live at this time.

---

## 🎯 Next Steps for Production

- [ ] Deploy frontend (`apps/web`) to Vercel or Netlify
- [ ] Deploy backend API (`apps/api`) to Vercel/Node server
- [ ] Deploy AI Service (`services/vanna`) to Render, Railway or Fly.io with environment variables
- [ ] Enable CORS for frontend domain
- [ ] Add chat session history, export to CSV, role-based views as bonus items

---

## 🗂 Deliverables

- ✅ GitHub repo with full code and data
- ✅ `/data/analytics_dump.sql` (DB dump)
- ✅ Screenshots & demo video (`/screenshots`, `demo.mp4`)
- ✅ `README.md` (this file)
- ✅ `.env.sample` files for easy setup

---

## 🙋‍♀️ Contact

**Priya Patel**  
**GitHub:** [https://github.com/priya011006](https://github.com/priya011006)  
**Email:** your-email@example.com

---

Thank you for reviewing my submission. I look forward to the next steps.
