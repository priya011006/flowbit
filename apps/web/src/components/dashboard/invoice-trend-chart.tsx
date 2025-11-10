"use client";

import { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:4000";

interface TrendData {
  month: string;
  invoiceCount: number;
  totalValue: number;
}

export function InvoiceTrendChart() {
  const [data, setData] = useState<TrendData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_BASE}/invoice-trends`)
      .then((res) => res.json())
      .then((data) => {
        setData(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching trends:", err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div className="h-[300px] flex items-center justify-center">Loading...</div>;
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" />
        <YAxis yAxisId="left" />
        <YAxis yAxisId="right" orientation="right" />
        <Tooltip />
        <Legend />
        <Line
          yAxisId="left"
          type="monotone"
          dataKey="invoiceCount"
          stroke="#8884d8"
          name="Invoice Count"
        />
        <Line
          yAxisId="right"
          type="monotone"
          dataKey="totalValue"
          stroke="#82ca9d"
          name="Total Value (€)"
        />
      </LineChart>
    </ResponsiveContainer>
  );
}





