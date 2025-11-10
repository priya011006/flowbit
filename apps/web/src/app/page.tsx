"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { OverviewCards } from "@/components/dashboard/overview-cards";
import { InvoiceTrendChart } from "@/components/dashboard/invoice-trend-chart";
import { VendorSpendChart } from "@/components/dashboard/vendor-spend-chart";
import { CategorySpendChart } from "@/components/dashboard/category-spend-chart";
import { CashOutflowChart } from "@/components/dashboard/cash-outflow-chart";
import { InvoicesTable } from "@/components/dashboard/invoices-table";

export default function DashboardPage() {
  return (
    <div className="flex-1 space-y-4 p-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <p className="text-muted-foreground">
          Overview of your invoice analytics
        </p>
      </div>

      <OverviewCards />

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Invoice Volume & Value Trend</CardTitle>
            <CardDescription>Monthly invoice count and spend</CardDescription>
          </CardHeader>
          <CardContent>
            <InvoiceTrendChart />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Spend by Vendor (Top 10)</CardTitle>
            <CardDescription>Top vendors by total spend</CardDescription>
          </CardHeader>
          <CardContent>
            <VendorSpendChart />
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Spend by Category</CardTitle>
            <CardDescription>Distribution of spend across categories</CardDescription>
          </CardHeader>
          <CardContent>
            <CategorySpendChart />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Cash Outflow Forecast</CardTitle>
            <CardDescription>Expected cash outflow by date range</CardDescription>
          </CardHeader>
          <CardContent>
            <CashOutflowChart />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Invoices</CardTitle>
          <CardDescription>Searchable and sortable invoice table</CardDescription>
        </CardHeader>
        <CardContent>
          <InvoicesTable />
        </CardContent>
      </Card>
    </div>
  );
}

