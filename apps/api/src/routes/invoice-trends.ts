import { Router } from "express";
import { prisma } from "../lib/prisma";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const invoices = await prisma.invoice.findMany({
      where: {
        issue_date: {
          not: null,
        },
      },
      select: {
        issue_date: true,
        total: true,
      },
      orderBy: {
        issue_date: "asc",
      },
    });

    // Group by month
    const monthlyData: Record<string, { count: number; total: number }> = {};

    invoices.forEach((invoice) => {
      if (invoice.issue_date) {
        const date = new Date(invoice.issue_date);
        const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
        
        if (!monthlyData[monthKey]) {
          monthlyData[monthKey] = { count: 0, total: 0 };
        }
        
        monthlyData[monthKey].count++;
        monthlyData[monthKey].total += Number(invoice.total || 0);
      }
    });

    const result = Object.entries(monthlyData)
      .map(([month, data]) => ({
        month,
        invoiceCount: data.count,
        totalValue: data.total,
      }))
      .sort((a, b) => a.month.localeCompare(b.month));

    res.json(result);
  } catch (error) {
    console.error("Error fetching invoice trends:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export { router as invoiceTrendsRouter };

