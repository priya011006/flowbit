"use client";

import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:4000";

interface VendorData {
  vendorName: string;
  totalSpend: number;
}

export function VendorSpendChart() {
  const [data, setData] = useState<VendorData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_BASE}/vendors/top10`)
      .then((res) => res.json())
      .then((data) => {
        setData(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching vendors:", err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div className="h-[300px] flex items-center justify-center">Loading...</div>;
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data} layout="vertical">
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis type="number" />
        <YAxis dataKey="vendorName" type="category" width={150} />
        <Tooltip formatter={(value: number) => `€${value.toLocaleString()}`} />
        <Legend />
        <Bar dataKey="totalSpend" fill="#8884d8" name="Total Spend (€)" />
      </BarChart>
    </ResponsiveContainer>
  );
}





