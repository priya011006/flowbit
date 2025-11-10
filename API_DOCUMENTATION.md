# API Documentation

## Backend API Endpoints

Base URL: `http://localhost:4000`

### 1. Health Check

**GET** `/health`

Returns the health status of the API.

**Response:**
```json
{
  "status": "ok"
}
```

### 2. Get Statistics

**GET** `/stats`

Returns overview statistics for the dashboard cards.

**Response:**
```json
{
  "totalSpendYTD": 1234567.89,
  "totalInvoices": 1500,
  "documentsUploaded": 1500,
  "averageInvoiceValue": 822.38
}
```

### 3. Get Invoice Trends

**GET** `/invoice-trends`

Returns monthly invoice count and total value.

**Response:**
```json
[
  {
    "month": "2024-01",
    "invoiceCount": 125,
    "totalValue": 102750.50
  },
  {
    "month": "2024-02",
    "invoiceCount": 138,
    "totalValue": 113421.75
  }
]
```

### 4. Get Top Vendors

**GET** `/vendors/top10`

Returns top 10 vendors by total spend.

**Response:**
```json
[
  {
    "vendorName": "Acme Corp",
    "totalSpend": 250000.00
  },
  {
    "vendorName": "Tech Solutions Inc",
    "totalSpend": 180000.00
  }
]
```

### 5. Get Category Spend

**GET** `/category-spend`

Returns spend grouped by category.

**Response:**
```json
[
  {
    "category": "Office Supplies",
    "totalSpend": 45000.00
  },
  {
    "category": "Software",
    "totalSpend": 120000.00
  }
]
```

### 6. Get Cash Outflow Forecast

**GET** `/cash-outflow`

Returns expected cash outflow by date range (next 30 days).

**Response:**
```json
[
  {
    "date": "2024-12-15",
    "expectedOutflow": 50000.00
  },
  {
    "date": "2024-12-20",
    "expectedOutflow": 75000.00
  }
]
```

### 7. Get Invoices

**GET** `/invoices`

Returns a list of invoices with optional filtering and search.

**Query Parameters:**
- `search` (optional): Search by invoice number or vendor name
- `status` (optional): Filter by invoice status
- `limit` (optional): Maximum number of results (default: 100)
- `offset` (optional): Number of results to skip (default: 0)

**Example:**
```
GET /invoices?search=INV-001&status=processed&limit=50
```

**Response:**
```json
[
  {
    "id": "uuid",
    "invoice_number": "INV-001",
    "invoice_ref": "ref-123",
    "vendor": {
      "name": "Acme Corp"
    },
    "customer": {
      "name": "Customer Name"
    },
    "issue_date": "2024-01-15T00:00:00.000Z",
    "due_date": "2024-02-15T00:00:00.000Z",
    "currency": "EUR",
    "subtotal": 1000.00,
    "tax": 200.00,
    "total": 1200.00,
    "status": "processed",
    "notes": null,
    "created_at": "2024-01-15T00:00:00.000Z",
    "updated_at": "2024-01-15T00:00:00.000Z"
  }
]
```

### 8. Chat with Data

**POST** `/chat-with-data`

Forwards natural language queries to Vanna AI and returns SQL and results.

**Request Body:**
```json
{
  "query": "What's the total spend in the last 90 days?"
}
```

**Response:**
```json
{
  "response": "The total spend in the last 90 days is €125,000.00",
  "sql": "SELECT SUM(total) as total_spend FROM invoices WHERE issue_date >= CURRENT_DATE - INTERVAL '90 days'",
  "data": [
    {
      "total_spend": "125000.00"
    }
  ]
}
```

## Vanna AI Service Endpoints

Base URL: `http://localhost:8000`

### 1. Health Check

**GET** `/health`

Returns the health status of the Vanna AI service.

**Response:**
```json
{
  "status": "ok"
}
```

### 2. Chat with Data

**POST** `/api/v1/chat`

Processes natural language queries and returns SQL and results.

**Request Body:**
```json
{
  "message": "What's the total spend in the last 90 days?"
}
```

**Response:**
```json
{
  "response": "The total spend in the last 90 days is €125,000.00",
  "sql": "SELECT SUM(total) as total_spend FROM invoices WHERE issue_date >= CURRENT_DATE - INTERVAL '90 days'",
  "data": [
    {
      "total_spend": "125000.00"
    }
  ]
}
```

### 3. Get Schema

**GET** `/api/v1/schema`

Returns the database schema information.

**Response:**
```json
{
  "schema": {
    "invoices": [
      {
        "column": "id",
        "type": "uuid",
        "nullable": "NO"
      },
      {
        "column": "invoice_number",
        "type": "character varying",
        "nullable": "YES"
      }
    ]
  }
}
```

## Error Responses

All endpoints may return error responses in the following format:

```json
{
  "error": "Error message",
  "message": "Detailed error message"
}
```

**HTTP Status Codes:**
- `200` - Success
- `400` - Bad Request
- `500` - Internal Server Error





