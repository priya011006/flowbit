import { Router } from "express";
import { prisma } from "../lib/prisma";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const currentYear = new Date().getFullYear();
    const yearStart = new Date(currentYear, 0, 1);

    // Total Spend YTD
    const totalSpendYTD = await prisma.invoice.aggregate({
      where: {
        issue_date: {
          gte: yearStart,
        },
        total: {
          not: null,
        },
      },
      _sum: {
        total: true,
      },
    });

    // Total Invoices Processed
    const totalInvoices = await prisma.invoice.count();

    // Documents Uploaded (same as invoices for now)
    const documentsUploaded = totalInvoices;

    // Average Invoice Value
    const avgInvoice = await prisma.invoice.aggregate({
      where: {
        total: {
          not: null,
        },
      },
      _avg: {
        total: true,
      },
    });

    res.json({
      totalSpendYTD: Number(totalSpendYTD._sum.total || 0),
      totalInvoices,
      documentsUploaded,
      averageInvoiceValue: Number(avgInvoice._avg.total || 0),
    });
  } catch (error) {
    console.error("Error fetching stats:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export { router as statsRouter };

