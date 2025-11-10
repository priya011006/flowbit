# Vanna AI Database Connection Fix

## ✅ Issue Fixed

**Problem:** Invalid DSN error: `missing '=' after 'postgresql+psycopg://...'`

**Root Cause:** The DATABASE_URL had `postgresql+psycopg://` which is SQLAlchemy syntax, but psycopg2 expects just `postgresql://`

## 🔧 Fixes Applied

### 1. Updated `services/vanna/.env`
Changed from:
```
DATABASE_URL=postgresql+psycopg://postgres:postgres@localhost:5432/analytics
```

To:
```
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/analytics
```

Also added:
```
GROQ_API_KEY=sk_CmUCPj5zKqBCaQDHzCTzWGdyb3FY5z7ZDDIMJrrEmG7AGt6AJjic
PORT=8000
```

### 2. Enhanced `get_db_connection()` function
Updated to handle both SQLAlchemy-style prefixes:
```python
db_url = DATABASE_URL.replace("postgresql+psycopg2://", "postgresql://")
db_url = db_url.replace("postgresql+psycopg://", "postgresql://")
```

### 3. Verified `.env` loading
The `load_dotenv()` is already present at the top of `main.py` ✅

## 🚀 Next Steps

**IMPORTANT:** The Vanna service needs to be restarted for the .env changes to take effect.

### Restart Vanna Service:

1. **Stop current Vanna service** (if running):
   - Go to the terminal where Vanna is running
   - Press `Ctrl+C` to stop it

2. **Restart Vanna:**
   ```powershell
   cd services\vanna
   venv\Scripts\activate
   uvicorn main:app --reload --port 8000
   ```

3. **Verify it's running:**
   ```powershell
   Invoke-RestMethod -Uri "http://127.0.0.1:8000/health" -Method GET
   ```
   Should return: `{"status":"ok"}`

## ✅ Test Chat Endpoint

After restarting, test the chat endpoint:

```powershell
$body = @{ message = "Total spend in last 90 days?" } | ConvertTo-Json
Invoke-RestMethod -Uri "http://127.0.0.1:8000/api/v1/chat" -Method POST -Body $body -ContentType "application/json" | ConvertTo-Json -Depth 5
```

**Expected output:**
```json
{
  "response": "The total spend in the last 90 days is €X,XXX.XX.",
  "sql": "SELECT SUM(total) FROM invoices WHERE issue_date >= NOW() - INTERVAL '90 days';",
  "data": [
    { "sum": 4120.50 }
  ]
}
```

## 🔍 Verification Checklist

- [x] DATABASE_URL format fixed (removed `+psycopg`)
- [x] GROQ_API_KEY added to .env
- [x] `get_db_connection()` updated to handle both URL formats
- [x] `load_dotenv()` is present in main.py
- [ ] Vanna service restarted (user needs to do this)
- [ ] Chat endpoint tested (after restart)

## 📝 Current .env Contents

```
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/analytics
GROQ_API_KEY=sk_CmUCPj5zKqBCaQDHzCTzWGdyb3FY5z7ZDDIMJrrEmG7AGt6AJjic
PORT=8000
```

## ⚠️ Note

The service is currently running with the old .env values. **You must restart the Vanna service** for the changes to take effect. The `--reload` flag will automatically reload on code changes, but .env file changes require a full restart.



