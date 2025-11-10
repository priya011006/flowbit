"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, FileText, Upload, TrendingUp } from "lucide-react";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:4000";

interface Stats {
  totalSpendYTD: number;
  totalInvoices: number;
  documentsUploaded: number;
  averageInvoiceValue: number;
}

export function OverviewCards() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_BASE}/stats`)
      .then((res) => res.json())
      .then((data) => {
        setStats(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching stats:", err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Loading...</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">-</div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "EUR",
      minimumFractionDigits: 2,
    }).format(value);
  };

  const cards = [
    {
      title: "Total Spend (YTD)",
      value: stats?.totalSpendYTD ? formatCurrency(stats.totalSpendYTD) : "€0.00",
      icon: DollarSign,
      description: "Year to date",
    },
    {
      title: "Total Invoices Processed",
      value: stats?.totalInvoices?.toLocaleString() || "0",
      icon: FileText,
      description: "All time",
    },
    {
      title: "Documents Uploaded",
      value: stats?.documentsUploaded?.toLocaleString() || "0",
      icon: Upload,
      description: "Total documents",
    },
    {
      title: "Average Invoice Value",
      value: stats?.averageInvoiceValue ? formatCurrency(stats.averageInvoiceValue) : "€0.00",
      icon: TrendingUp,
      description: "Per invoice",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-4">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <Card key={card.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
              <Icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{card.value}</div>
              <p className="text-xs text-muted-foreground">{card.description}</p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}





