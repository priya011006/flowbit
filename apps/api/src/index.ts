import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { statsRouter } from "./routes/stats";
import { invoiceTrendsRouter } from "./routes/invoice-trends";
import { vendorsRouter } from "./routes/vendors";
import { categorySpendRouter } from "./routes/category-spend";
import { cashOutflowRouter } from "./routes/cash-outflow";
import { invoicesRouter } from "./routes/invoices";
import { chatRouter } from "./routes/chat";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.use("/stats", statsRouter);
app.use("/invoice-trends", invoiceTrendsRouter);
app.use("/vendors", vendorsRouter);
app.use("/category-spend", categorySpendRouter);
app.use("/cash-outflow", cashOutflowRouter);
app.use("/invoices", invoicesRouter);
app.use("/chat-with-data", chatRouter);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});





