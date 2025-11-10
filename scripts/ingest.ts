import { PrismaClient, Prisma } from "@prisma/client";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

const prisma = new PrismaClient();

type AnyObj = Record<string, any>;

// Helper: safely get nested value by path string
function getByPath(obj: any, path: string): any {
  try {
    return path.split('.').reduce((s: any, p: string) => (s && p in s ? s[p] : undefined), obj);
  } catch {
    return undefined;
  }
}

// Helper: parse date from various formats
function parseDateMaybe(input: any): Date | null {
  if (!input) return null;
  if (input instanceof Date) return input;
  if (typeof input === 'string') {
    // Handle ISO strings and date objects with $date
    if (input.includes('$date')) {
      try {
        const parsed = JSON.parse(input);
        return new Date(parsed.$date);
      } catch {
        // fall through
      }
    }
    const date = new Date(input);
    if (!isNaN(date.getTime())) return date;
  }
  if (typeof input === 'object' && input.$date) {
    return new Date(input.$date);
  }
  if (typeof input === 'number') {
    return new Date(input);
  }
  return null;
}

// Helper: convert to Decimal/Prisma.Decimal
function toDecimalMaybe(input: any): Prisma.Decimal | null {
  if (input === null || input === undefined || input === '') return null;
  if (typeof input === 'number') {
    if (isNaN(input) || !isFinite(input)) return null;
    return new Prisma.Decimal(input);
  }
  if (typeof input === 'string') {
    const num = parseFloat(input);
    if (isNaN(num) || !isFinite(num)) return null;
    return new Prisma.Decimal(num);
  }
  if (typeof input === 'object' && input.$numberLong) {
    return new Prisma.Decimal(input.$numberLong);
  }
  if (input instanceof Prisma.Decimal) return input;
  return null;
}

// Ensure vendor exists, create if not
async function ensureVendor(data: {
  vendor_ref?: string;
  name: string;
  address?: any;
  email?: string;
  phone?: string;
  tax_number?: string;
}) {
  if (!data.name) return null;

  const where = data.vendor_ref
    ? { vendor_ref: data.vendor_ref }
    : { name: data.name };

  const vendor = await prisma.vendor.findFirst({ where });

  if (vendor) {
    return await prisma.vendor.update({
      where: { id: vendor.id },
      data: {
        name: data.name,
        tax_number: data.tax_number ?? vendor.tax_number,
        email: data.email ?? vendor.email,
        phone: data.phone ?? vendor.phone,
        address: data.address ? (typeof data.address === 'string' ? { address: data.address } : data.address) : vendor.address,
      },
    });
  }

  return await prisma.vendor.create({
    data: {
      vendor_ref: data.vendor_ref ?? undefined,
      name: data.name,
      tax_number: data.tax_number ?? undefined,
      email: data.email ?? undefined,
      phone: data.phone ?? undefined,
      address: data.address ? (typeof data.address === 'string' ? { address: data.address } : data.address) : undefined,
    },
  });
}

// Ensure customer exists, create if not
async function ensureCustomer(data: {
  customer_ref?: string;
  name: string;
  address?: any;
  email?: string;
  phone?: string;
}) {
  if (!data.name) return null;

  const where = data.customer_ref
    ? { customer_ref: data.customer_ref }
    : { name: data.name };

  const customer = await prisma.customer.findFirst({ where });

  if (customer) {
    return await prisma.customer.update({
      where: { id: customer.id },
      data: {
        name: data.name,
        email: data.email ?? customer.email,
        phone: data.phone ?? customer.phone,
        address: data.address ? (typeof data.address === 'string' ? { address: data.address } : data.address) : customer.address,
      },
    });
  }

  return await prisma.customer.create({
    data: {
      customer_ref: data.customer_ref ?? undefined,
      name: data.name,
      email: data.email ?? undefined,
      phone: data.phone ?? undefined,
      address: data.address ? (typeof data.address === 'string' ? { address: data.address } : data.address) : undefined,
    },
  });
}

// Ensure category exists, create if not
async function ensureCategory(name: string) {
  if (!name) return null;

  const category = await prisma.category.findUnique({ where: { name } });

  if (category) return category;

  return await prisma.category.create({ data: { name } });
}

// Create or update invoice
async function createOrUpdateInvoice(data: {
  invoice_number?: string;
  invoice_ref?: string;
  vendorId?: string;
  customerId?: string;
  issue_date?: Date | null;
  due_date?: Date | null;
  currency?: string;
  subtotal?: Prisma.Decimal | null;
  tax?: Prisma.Decimal | null;
  total?: Prisma.Decimal | null;
  status?: string;
  notes?: string;
  raw?: any;
}) {
  const where = data.invoice_ref
    ? { invoice_ref: data.invoice_ref }
    : data.invoice_number
    ? { invoice_number: data.invoice_number }
    : null;

  if (where) {
    const existing = await prisma.invoice.findUnique({ where: where as any });
    if (existing) {
      return await prisma.invoice.update({
        where: { id: existing.id },
        data: {
          invoice_number: data.invoice_number ?? existing.invoice_number,
          vendorId: data.vendorId ?? existing.vendorId,
          customerId: data.customerId ?? existing.customerId,
          issue_date: data.issue_date ?? existing.issue_date,
          due_date: data.due_date ?? existing.due_date,
          currency: data.currency ?? existing.currency,
          subtotal: data.subtotal ?? existing.subtotal,
          tax: data.tax ?? existing.tax,
          total: data.total ?? existing.total,
          status: data.status ?? existing.status,
          notes: data.notes ?? existing.notes,
          raw: data.raw ?? existing.raw,
        },
      });
    }
  }

  return await prisma.invoice.create({
    data: {
      invoice_number: data.invoice_number ?? undefined,
      invoice_ref: data.invoice_ref ?? undefined,
      vendorId: data.vendorId ?? undefined,
      customerId: data.customerId ?? undefined,
      issue_date: data.issue_date ?? undefined,
      due_date: data.due_date ?? undefined,
      currency: data.currency ?? undefined,
      subtotal: data.subtotal ?? undefined,
      tax: data.tax ?? undefined,
      total: data.total ?? undefined,
      status: data.status ?? undefined,
      notes: data.notes ?? undefined,
      raw: data.raw ?? undefined,
    },
  });
}

// Extract nested value from object (handles .value wrappers)
function extractValue(obj: any): any {
  if (obj === null || obj === undefined) return undefined;
  if (typeof obj === 'object' && 'value' in obj) {
    return extractValue(obj.value);
  }
  return obj;
}

// Extract line items from various structures
function extractLineItems(raw: AnyObj): any[] {
  // Try many possible paths where line items may be present
  // First try direct properties
  if (raw.line_items && Array.isArray(raw.line_items)) return raw.line_items;
  if (raw.items && Array.isArray(raw.items)) return raw.items;
  if (raw.lines && Array.isArray(raw.lines)) return raw.lines;
  if (raw.lineItems && Array.isArray(raw.lineItems)) return raw.lineItems;

  // Then try nested paths using getByPath
  const paths = [
    'extractedData.llmData.lineItems.value.items',
    'extractedData.llmData.lineItems.items',
    'extractedData.llmData.line_items.value.items',
    'extractedData.llmData.line_items',
    'extractedData.llmData.items',
    'extractedData.llmData.invoice.value.lineItems',
    'extractedData.llmData.invoice.value.items',
    'extractedData.invoice.line_items',
    'extractedData.items',
    'extractedData.lineItems.value.items',
    'extractedData.lineItems.items',
  ];

  for (const p of paths) {
    const items = getByPath(raw, p);
    if (Array.isArray(items) && items.length > 0) {
      return items;
    }
    // Also check if items is nested in a .value wrapper
    if (items && typeof items === 'object' && 'value' in items) {
      const nestedItems = items.value;
      if (Array.isArray(nestedItems) && nestedItems.length > 0) {
        return nestedItems;
      }
    }
  }

  return [];
}

async function ingestInvoice(raw: AnyObj) {
  // Try many common places where vendor info can appear in this dataset
  function extractVendorFromRaw(r: AnyObj) {
    if (!r) return null;

    // 1) Common friendly names
    const direct = r.vendor ?? r.supplier ?? r.supplier_info ?? r.vendor_info ?? r.vendorDetails ?? null;
    if (direct && (direct.name || direct.vendorName || direct.company)) {
      return {
        vendor_ref: direct.vendor_ref ?? direct.id ?? direct.vendor_id ?? undefined,
        name: direct.name ?? direct.vendorName ?? direct.company ?? undefined,
        address: direct.address ?? undefined,
        email: direct.email ?? undefined,
        phone: direct.phone ?? undefined,
        tax_number: direct.tax_number ?? direct.tax_id ?? undefined,
      };
    }

    // 2) Check extractedData -> llmData path used in your sample
    const v = getByPath(r, "extractedData.llmData.vendor.value");
    if (v) {
      const vendorName = extractValue(v.vendorName ?? v.vendor_name);
      const vendorTaxId = extractValue(v.vendorTaxId ?? v.tax_id);
      const vendorAddress = extractValue(v.vendorAddress ?? v.address);
      const vendorId = v.id ?? getByPath(r, "extractedData.llmData.vendor.id");

      if (vendorName) {
        return {
          vendor_ref: vendorId ?? undefined,
          name: vendorName,
          address: vendorAddress ?? undefined,
          email: extractValue(v.email) ?? undefined,
          phone: extractValue(v.phone) ?? undefined,
          tax_number: vendorTaxId ?? undefined,
        };
      }
    }

    // 3) Another possible path
    const likely = getByPath(r, "extractedData.vendor") ?? getByPath(r, "extracted.vendor") ?? null;
    if (likely && (likely.name || likely.vendorName)) {
      return {
        vendor_ref: likely.id ?? likely.vendor_id ?? undefined,
        name: likely.name ?? likely.vendorName ?? undefined,
        address: likely.address ?? undefined,
        email: likely.email ?? undefined,
        phone: likely.phone ?? undefined,
      };
    }

    // 4) fallback
    const possibleName = getByPath(r, "metadata.seller") ?? getByPath(r, "metadata.bill_from") ?? undefined;
    if (possibleName) {
      return { name: possibleName, vendor_ref: undefined };
    }

    return null;
  }

  function extractCustomerFromRaw(r: AnyObj) {
    if (!r) return null;

    const direct = r.customer ?? r.client ?? r.bill_to ?? r.customerDetails ?? null;
    if (direct && (direct.name || direct.customer_name)) {
      return {
        customer_ref: direct.customer_ref ?? direct.id ?? undefined,
        name: direct.name ?? direct.customer_name ?? undefined,
        address: direct.address ?? undefined,
        email: direct.email ?? undefined,
        phone: direct.phone ?? undefined,
      };
    }

    const c = getByPath(r, "extractedData.llmData.customer.value") ?? getByPath(r, "extractedData.llmData.client.value") ?? null;
    if (c) {
      const customerName = extractValue(c.customerName ?? c.name ?? c.clientName);
      const customerId = c.id ?? undefined;
      const customerAddress = extractValue(c.customerAddress ?? c.address);

      if (customerName) {
        return {
          customer_ref: customerId ?? undefined,
          name: customerName,
          address: customerAddress ?? undefined,
          email: extractValue(c.email) ?? undefined,
          phone: extractValue(c.phone) ?? undefined,
        };
      }
    }

    return null;
  }

  // --- extraction & upsert flow ---
  const vendorObj = extractVendorFromRaw(raw);
  const customerObj = extractCustomerFromRaw(raw);

  const vendor = vendorObj ? await ensureVendor(vendorObj) : null;
  const customer = customerObj ? await ensureCustomer(customerObj) : null;

  // Extract invoice data
  const invoiceData = getByPath(raw, "extractedData.llmData.invoice.value") ?? {};
  const summaryData = getByPath(raw, "extractedData.llmData.summary.value") ?? {};

  const invoice_number = extractValue(invoiceData.invoiceId) ?? raw.invoice_number ?? raw.number ?? raw.inv_no ?? raw.documentNumber ?? raw.name ?? null;
  const invoice_ref = raw.invoice_ref ?? raw._id ?? raw.id ?? raw.ref ?? null;
  
  const invoiceDate = extractValue(invoiceData.invoiceDate) ?? extractValue(invoiceData.issueDate);
  const issue_date = parseDateMaybe(invoiceDate ?? raw.issue_date ?? raw.date ?? raw.invoice_date ?? raw.issuedAt);
  
  const dueDate = extractValue(getByPath(raw, "extractedData.llmData.payment.value.dueDate"));
  const due_date = parseDateMaybe(dueDate ?? raw.due_date ?? raw.due ?? raw.payment_due ?? raw.dueAt);

  const subtotal = toDecimalMaybe(extractValue(summaryData.subTotal) ?? extractValue(invoiceData.subtotal) ?? raw.subtotal ?? raw.amount_before_tax ?? raw.sub_total ?? raw.netAmount ?? raw.subTotal);
  const tax = toDecimalMaybe(extractValue(summaryData.totalTax) ?? extractValue(invoiceData.tax) ?? raw.tax ?? raw.total_tax ?? raw.taxAmount);
  const total = toDecimalMaybe(extractValue(summaryData.invoiceTotal) ?? extractValue(invoiceData.total) ?? raw.total ?? raw.grand_total ?? raw.amount ?? raw.totalAmount);

  const invoicePayload: AnyObj = {
    invoice_number: invoice_number ?? undefined,
    invoice_ref: invoice_ref ?? undefined,
    vendorId: vendor ? vendor.id : undefined,
    customerId: customer ? customer.id : undefined,
    issue_date: issue_date ?? undefined,
    due_date: due_date ?? undefined,
    currency: extractValue(summaryData.currencySymbol) ?? raw.currency ?? raw.total_currency ?? raw.currencyCode ?? 'EUR',
    subtotal: subtotal ?? undefined,
    tax: tax ?? undefined,
    total: total ?? undefined,
    status: raw.status ?? 'processed',
    notes: raw.notes ?? undefined,
    raw: raw ?? undefined,
  };

  const invoice = await createOrUpdateInvoice(invoicePayload);

  // Process line items
  const items = extractLineItems(raw);
  if (items.length > 0) {
    await prisma.invoiceLineItem.deleteMany({ where: { invoiceId: invoice.id } });

    for (let i = 0; i < items.length; i++) {
      const it = items[i] ?? {};
      
      // Extract values - handle both direct values and nested .value wrappers
      const desc = extractValue(it.description) ?? extractValue(it.name) ?? extractValue(it.title);
      const qty = toDecimalMaybe(extractValue(it.quantity) ?? extractValue(it.qty) ?? 1);
      const unitPrice = toDecimalMaybe(extractValue(it.unitPrice) ?? extractValue(it.price) ?? extractValue(it.rate) ?? extractValue(it.unit_price));
      const totalPrice = toDecimalMaybe(extractValue(it.totalPrice) ?? extractValue(it.amount) ?? extractValue(it.total));
      const amount = totalPrice ?? (unitPrice && qty ? new Prisma.Decimal(Number(unitPrice) * Number(qty)) : null);
      
      // Extract tax/VAT - check both tax and vatAmount fields
      const taxAmount = toDecimalMaybe(extractValue(it.tax) ?? extractValue(it.tax_amount) ?? extractValue(it.vatAmount) ?? extractValue(it.vat_amount));
      
      let categoryId: number | undefined;
      // Check Sachkonto (German account number) which is used as category
      const category = extractValue(it.category) ?? extractValue(it.Sachkonto) ?? extractValue(it.sachkonto);
      if (category) {
        const cat = await ensureCategory(String(category));
        categoryId = cat ? cat.id : undefined;
      }

      // Only create if we have at least description or amount
      if (desc || amount) {
        await prisma.invoiceLineItem.create({
          data: {
            invoiceId: invoice.id,
            line_index: extractValue(it.srNo) ?? extractValue(it.sr_no) ?? i,
            description: desc ?? undefined,
            sku: extractValue(it.sku) ?? extractValue(it.item_code) ?? extractValue(it.itemCode) ?? undefined,
            quantity: qty ?? undefined,
            unit_price: unitPrice ?? undefined,
            tax_amount: taxAmount ?? undefined,
            amount: amount ?? undefined,
            categoryId: categoryId ?? undefined,
            metadata: it ?? undefined,
          },
        });
      }
    }
  }

  // Process payments
  const paymentData = getByPath(raw, "extractedData.llmData.payment.value");
  const payments = raw.payments ?? raw.payment ?? raw.transactions ?? (paymentData ? [paymentData] : []);
  
  if (payments) {
    await prisma.payment.deleteMany({ where: { invoiceId: invoice.id } });
    const payArr = Array.isArray(payments) ? payments : [payments];
    
    for (const p of payArr) {
      const amt = toDecimalMaybe(extractValue(p.amount) ?? extractValue(p.paid_amount) ?? extractValue(p.amountPaid) ?? extractValue(p.discountedTotal));
      if (amt) {
        await prisma.payment.create({
          data: {
            invoiceId: invoice.id,
            amount: amt,
            paid_at: parseDateMaybe(extractValue(p.paid_at) ?? extractValue(p.date) ?? extractValue(p.paidAt)),
            method: extractValue(p.method) ?? extractValue(p.payment_method) ?? extractValue(p.type) ?? undefined,
            reference: extractValue(p.reference) ?? extractValue(p.txn_id) ?? extractValue(p.referenceId) ?? extractValue(p.bankAccountNumber) ?? undefined,
            raw: p ?? undefined,
          },
        });
      }
    }
  }

  return invoice;
}

async function main() {
  console.log('Reading file (this may take a while for large files)...');

  const dataPath = path.join(process.cwd(), 'data', 'Analytics_Test_Data.json');
  
  if (!fs.existsSync(dataPath)) {
    console.error(`Error: File not found at ${dataPath}`);
    process.exit(1);
  }

  const rawData = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));

  if (!Array.isArray(rawData)) {
    console.error('Expected JSON array');
    process.exit(1);
  }

  const totalRecords = rawData.length;
  console.log(`Records to ingest: ${totalRecords}`);

  let success = 0;
  let errors = 0;

  // Process in batches for better progress display
  const batchSize = 50;
  const totalBatches = Math.ceil(totalRecords / batchSize);

  for (let batch = 0; batch < totalBatches; batch++) {
    const start = batch * batchSize;
    const end = Math.min(start + batchSize, totalRecords);
    
    console.log(`Processing batch ${start}..${end - 1}`);

    for (let i = start; i < end; i++) {
      try {
        await ingestInvoice(rawData[i]);
        success++;
      } catch (error) {
        errors++;
        console.error(`Error processing record ${i + 1}:`, error);
        // Log to error file
        fs.appendFileSync(
          path.join(process.cwd(), 'data', 'ingest_errors.log'),
          `Record ${i + 1}: ${error instanceof Error ? error.message : String(error)}\n`
        );
      }
    }
  }

  console.log('Ingestion complete.');

  if (errors > 0) {
    console.log(`\nSummary: ${success} successful, ${errors} errors`);
    console.log(`Check data/ingest_errors.log for error details`);
  } else {
    console.log(`\nSummary: ${success} records ingested successfully`);
  }

  await prisma.$disconnect();
}

main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
