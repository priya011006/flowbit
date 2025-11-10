import { Router } from "express";
import { prisma } from "../lib/prisma";

const router = Router();

router.get("/", async (req, res) => {
  try {
    // Get invoices with due dates in the future
    const invoices = await prisma.invoice.findMany({
      where: {
        due_date: {
          not: null,
          gte: new Date(),
        },
        total: {
          not: null,
        },
      },
      select: {
        due_date: true,
        total: true,
      },
      orderBy: {
        due_date: "asc",
      },
    });

    // Group by date (next 30 days)
    const today = new Date();
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(today.getDate() + 30);

    const dailyOutflow: Record<string, number> = {};

    invoices.forEach((invoice) => {
      if (invoice.due_date && invoice.due_date <= thirtyDaysFromNow) {
        const dateKey = invoice.due_date.toISOString().split("T")[0];
        dailyOutflow[dateKey] = (dailyOutflow[dateKey] || 0) + Number(invoice.total || 0);
      }
    });

    const result = Object.entries(dailyOutflow)
      .map(([date, expectedOutflow]) => ({
        date,
        expectedOutflow,
      }))
      .sort((a, b) => a.date.localeCompare(b.date))
      .slice(0, 30); // Limit to 30 days

    res.json(result);
  } catch (error) {
    console.error("Error fetching cash outflow:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export { router as cashOutflowRouter };

