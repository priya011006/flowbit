-- sql/schema.sql
-- Basic normalized schema for invoices dataset

CREATE TABLE IF NOT EXISTS vendors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vendor_ref TEXT UNIQUE,        -- external vendor id if present
  name TEXT NOT NULL,
  tax_number TEXT,
  email TEXT,
  phone TEXT,
  website TEXT,
  address JSONB,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS customers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_ref TEXT UNIQUE,      -- external customer id if present
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  address JSONB,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS categories (
  id SERIAL PRIMARY KEY,
  name TEXT UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_number TEXT,
  invoice_ref TEXT UNIQUE,
  vendor_id UUID REFERENCES vendors(id) ON DELETE SET NULL,
  customer_id UUID REFERENCES customers(id) ON DELETE SET NULL,
  issue_date DATE,
  due_date DATE,
  currency TEXT,
  subtotal NUMERIC(14,2),
  tax NUMERIC(14,2),
  total NUMERIC(14,2),
  status TEXT,          -- e.g., paid, unpaid, overdue
  notes TEXT,
  raw JSONB,            -- store original raw object for debugging / Vanna
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS invoice_line_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_id UUID REFERENCES invoices(id) ON DELETE CASCADE,
  line_index INTEGER,
  description TEXT,
  sku TEXT,
  quantity NUMERIC(14,4) DEFAULT 1,
  unit_price NUMERIC(14,2),
  tax_amount NUMERIC(14,2),
  amount NUMERIC(14,2),
  category_id INTEGER REFERENCES categories(id),
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_id UUID REFERENCES invoices(id) ON DELETE CASCADE,
  amount NUMERIC(14,2) NOT NULL,
  paid_at TIMESTAMPTZ,
  method TEXT,
  reference TEXT,
  raw JSONB,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Useful indexes
CREATE INDEX IF NOT EXISTS idx_invoices_issue_date ON invoices(issue_date);
CREATE INDEX IF NOT EXISTS idx_invoices_due_date ON invoices(due_date);
CREATE INDEX IF NOT EXISTS idx_invoices_vendor ON invoices(vendor_id);
CREATE INDEX IF NOT EXISTS idx_line_items_invoice ON invoice_line_items(invoice_id);
CREATE INDEX IF NOT EXISTS idx_payments_invoice ON payments(invoice_id);
