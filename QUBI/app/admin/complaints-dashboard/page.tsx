"use client";

import * as React from "react";
import { PageWrapper } from "@/components/layout/page-wrapper";
import { KPIRow } from "@/components/dashboard/kpi-row";
import { ChartsGrid } from "@/components/dashboard/charts-grid";
import { DataTable } from "@/components/dashboard/data-table";
import { FilterBar } from "@/components/dashboard/filter-bar";
import type { KPIConfig, ChartConfig, FilterConfig } from "@/lib/types";

/* ------------------------------------------------------------------ */
/*  Mock data                                                         */
/* ------------------------------------------------------------------ */

const KPIS: KPIConfig[] = [
  { label: "Total Complaints", value: "1,247", icon: "bar-chart", trend: { value: 12, direction: "up" } },
  { label: "Open", value: "342", icon: "activity", trend: { value: 5, direction: "up" } },
  { label: "Resolved", value: "819", icon: "trending-up", trend: { value: 8, direction: "up" } },
  { label: "Avg Resolution Time", value: "3.2 days", icon: "hash", trend: { value: 15, direction: "down" } },
];

const CHARTS: ChartConfig[] = [
  {
    id: "complaints-by-category",
    chart_type: "bar",
    title: "Complaints by Category",
    description: "Distribution across complaint categories",
    x_column: "category",
    y_column: "count",
    columns: ["count"],
    data: [
      { category: "Service Quality", count: 320 },
      { category: "Technical Issue", count: 275 },
      { category: "Billing", count: 210 },
      { category: "Access", count: 185 },
      { category: "Response Time", count: 257 },
    ],
  },
  {
    id: "complaints-over-time",
    chart_type: "line",
    title: "Complaints Over Time",
    description: "Monthly complaint trend",
    x_column: "month",
    y_column: "complaints",
    columns: ["complaints"],
    data: [
      { month: "Oct", complaints: 95 },
      { month: "Nov", complaints: 120 },
      { month: "Dec", complaints: 88 },
      { month: "Jan", complaints: 142 },
      { month: "Feb", complaints: 110 },
      { month: "Mar", complaints: 135 },
      { month: "Apr", complaints: 98 },
    ],
  },
  {
    id: "complaints-by-status",
    chart_type: "pie",
    title: "Complaints by Status",
    description: "Current status distribution",
    x_column: "status",
    y_column: "value",
    data: [
      { status: "Open", value: 342 },
      { status: "In Progress", value: 86 },
      { status: "Resolved", value: 819 },
    ],
  },
  {
    id: "resolution-time-trend",
    chart_type: "area",
    title: "Resolution Time Trend",
    description: "Average resolution time in days",
    x_column: "month",
    y_column: "days",
    columns: ["days"],
    data: [
      { month: "Oct", days: 4.5 },
      { month: "Nov", days: 4.1 },
      { month: "Dec", days: 3.8 },
      { month: "Jan", days: 3.5 },
      { month: "Feb", days: 3.4 },
      { month: "Mar", days: 3.2 },
      { month: "Apr", days: 3.0 },
    ],
  },
];

const COMPLAINTS_TABLE = [
  { ID: "C-1001", Date: "2026-04-18", Category: "Service Quality", Priority: "High", Status: "Open", "Assigned To": "Ahmed Al-Rashid" },
  { ID: "C-1002", Date: "2026-04-17", Category: "Technical Issue", Priority: "Critical", Status: "In Progress", "Assigned To": "Sara Al-Mutairi" },
  { ID: "C-1003", Date: "2026-04-16", Category: "Billing", Priority: "Medium", Status: "Resolved", "Assigned To": "Khalid Nasser" },
  { ID: "C-1004", Date: "2026-04-15", Category: "Access", Priority: "Low", Status: "Open", "Assigned To": "Fatima Al-Harbi" },
  { ID: "C-1005", Date: "2026-04-14", Category: "Response Time", Priority: "High", Status: "Resolved", "Assigned To": "Omar Saleh" },
  { ID: "C-1006", Date: "2026-04-13", Category: "Service Quality", Priority: "Medium", Status: "In Progress", "Assigned To": "Noura Al-Dosari" },
  { ID: "C-1007", Date: "2026-04-12", Category: "Technical Issue", Priority: "Critical", Status: "Open", "Assigned To": "Ahmed Al-Rashid" },
  { ID: "C-1008", Date: "2026-04-11", Category: "Billing", Priority: "Low", Status: "Resolved", "Assigned To": "Sara Al-Mutairi" },
  { ID: "C-1009", Date: "2026-04-10", Category: "Access", Priority: "High", Status: "Open", "Assigned To": "Khalid Nasser" },
  { ID: "C-1010", Date: "2026-04-09", Category: "Response Time", Priority: "Medium", Status: "Resolved", "Assigned To": "Fatima Al-Harbi" },
];

const FILTERS: FilterConfig[] = [
  { id: "category", label: "Category", type: "select", options: ["Service Quality", "Technical Issue", "Billing", "Access", "Response Time"] },
  { id: "priority", label: "Priority", type: "select", options: ["Critical", "High", "Medium", "Low"] },
  { id: "status", label: "Status", type: "select", options: ["Open", "In Progress", "Resolved"] },
];

/* ------------------------------------------------------------------ */
/*  Page                                                              */
/* ------------------------------------------------------------------ */

export default function ComplaintsDashboardPage() {
  const [filterValues, setFilterValues] = React.useState<Record<string, string>>({});

  const filteredTable = React.useMemo(() => {
    let data = COMPLAINTS_TABLE;
    if (filterValues.category) data = data.filter((r) => r.Category === filterValues.category);
    if (filterValues.priority) data = data.filter((r) => r.Priority === filterValues.priority);
    if (filterValues.status) data = data.filter((r) => r.Status === filterValues.status);
    return data;
  }, [filterValues]);

  return (
    <PageWrapper>
      <div className="space-y-6">
        {/* Page heading */}
        <div>
          <h1 className="text-2xl font-semibold text-dga-gray-900">
            Complaints Dashboard
          </h1>
          <p className="mt-1 text-sm text-dga-gray-500">
            Monitor and analyze citizen complaints
          </p>
        </div>

        {/* KPIs */}
        <KPIRow kpis={KPIS} />

        {/* Filters */}
        <FilterBar
          filters={FILTERS}
          values={filterValues}
          onChange={(id, value) =>
            setFilterValues((prev) => ({ ...prev, [id]: value }))
          }
          onReset={() => setFilterValues({})}
        />

        {/* Charts */}
        <ChartsGrid charts={CHARTS} />

        {/* Recent Complaints Table */}
        <div>
          <h2 className="mb-3 text-lg font-semibold text-dga-gray-900">
            Recent Complaints
          </h2>
          <DataTable
            data={filteredTable as unknown as Record<string, unknown>[]}
            columns={["ID", "Date", "Category", "Priority", "Status", "Assigned To"]}
          />
        </div>
      </div>
    </PageWrapper>
  );
}
