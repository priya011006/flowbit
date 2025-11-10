import { Router } from "express";
import { prisma } from "../lib/prisma";

const router = Router();

router.get("/top10", async (req, res) => {
  try {
    const vendors = await prisma.vendor.findMany({
      include: {
        invoices: {
          where: {
            total: {
              not: null,
            },
          },
          select: {
            total: true,
          },
        },
      },
    });

    const vendorSpend = vendors
      .map((vendor) => {
        const totalSpend = vendor.invoices.reduce(
          (sum, inv) => sum + Number(inv.total || 0),
          0
        );
        return {
          vendorName: vendor.name,
          totalSpend,
        };
      })
      .filter((v) => v.totalSpend > 0)
      .sort((a, b) => b.totalSpend - a.totalSpend)
      .slice(0, 10);

    res.json(vendorSpend);
  } catch (error) {
    console.error("Error fetching top vendors:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export { router as vendorsRouter };

