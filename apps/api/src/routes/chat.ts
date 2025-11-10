import { Router } from "express";

const router = Router();

const VANNA_API_BASE = process.env.VANNA_API_BASE_URL || "http://localhost:8000";

router.post("/", async (req, res) => {
  try {
    const { query } = req.body;

    if (!query) {
      return res.status(400).json({ error: "Query is required" });
    }

    // Forward request to Vanna AI service
    const vannaResponse = await fetch(`${VANNA_API_BASE}/api/v1/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: query,
      }),
    });

    if (!vannaResponse.ok) {
      throw new Error(`Vanna AI service error: ${vannaResponse.statusText}`);
    }

    const vannaData = await vannaResponse.json();

    // Return response in expected format
    res.json({
      response: vannaData.response || vannaData.message || "Query processed successfully",
      sql: vannaData.sql,
      data: vannaData.data || vannaData.results,
    });
  } catch (error) {
    console.error("Error in chat endpoint:", error);
    res.status(500).json({
      error: "Internal server error",
      message: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

export { router as chatRouter };





