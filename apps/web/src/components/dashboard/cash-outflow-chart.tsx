"use client";

import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:4000";

interface CashOutflowData {
  date: string;
  expectedOutflow: number;
}

export function CashOutflowChart() {
  const [data, setData] = useState<CashOutflowData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_BASE}/cash-outflow`)
      .then((res) => res.json())
      .then((data) => {
        setData(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching cash outflow:", err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div className="h-[300px] flex items-center justify-center">Loading...</div>;
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip formatter={(value: number) => `€${value.toLocaleString()}`} />
        <Legend />
        <Bar dataKey="expectedOutflow" fill="#ff8042" name="Expected Outflow (€)" />
      </BarChart>
    </ResponsiveContainer>
  );
}





