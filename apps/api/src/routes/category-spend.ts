import { Router } from "express";
import { prisma } from "../lib/prisma";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const categories = await prisma.category.findMany({
      include: {
        items: {
          where: {
            amount: {
              not: null,
            },
          },
          select: {
            amount: true,
          },
        },
      },
    });

    const categorySpend = categories
      .map((category) => {
        const totalSpend = category.items.reduce(
          (sum, item) => sum + Number(item.amount || 0),
          0
        );
        return {
          category: category.name,
          totalSpend,
        };
      })
      .filter((c) => c.totalSpend > 0);

    res.json(categorySpend);
  } catch (error) {
    console.error("Error fetching category spend:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export { router as categorySpendRouter };

