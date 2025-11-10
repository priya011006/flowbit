# TODO / Handover notes

## High priority (must finish before deploy)
- Fix Vanna .env / GROQ model & key issues.
- Ensure Vanna can connect to DB (DATABASE_URL format).
- Make chat endpoint stable: /chat-with-data -> Vanna -> SQL -> DB -> response.
- Update prisma/schema.prisma (if required) and run prisma generate / db push.
- Verify Prisma migrations and that Payments.invoiceId column exists (or update ingest script).

## Medium priority
- Finalize frontend routing for Chat tab; show SQL + results.
- Add proper error-handling & graceful fallbacks.
- Add unit tests / integration checks (critical endpoints).

## Low priority
- Polish styles to match Figma, add accessible attributes, create demo recording.

## How to run locally (quick)
1. docker-compose up -d
2. 
pm install (root + apps)
3. cd apps/api && npm run dev
4. cd apps/web && npm run dev
5. cd services/vanna && python -m venv venv; venv\\Scripts\\activate; pip install -r requirements.txt; uvicorn main:app --reload --port 8000

## Secrets / env
- Do NOT commit .env. Use .env.example.
- Use GitHub Secrets for deployment.

