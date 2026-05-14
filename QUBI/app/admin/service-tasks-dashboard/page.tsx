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
  { label: "Total Tasks", value: "2,156", icon: "bar-chart", trend: { value: 18, direction: "up" } },
  { label: "In Progress", value: "428", icon: "activity", trend: { value: 3, direction: "up" } },
  { label: "Completed", value: "1,584", icon: "trending-up", trend: { value: 12, direction: "up" } },
  { label: "Overdue", value: "144", icon: "hash", trend: { value: 7, direction: "down" } },
];

const CHARTS: ChartConfig[] = [
  {
    id: "tasks-by-department",
    chart_type: "bar",
    title: "Tasks by Department",
    description: "Distribution of tasks across departments",
    x_column: "department",
    y_column: "tasks",
    columns: ["tasks"],
    data: [
      { department: "IT Services", tasks: 420 },
      { department: "Public Affairs", tasks: 350 },
      { department: "Finance", tasks: 310 },
      { department: "HR", tasks: 280 },
      { department: "Operations", tasks: 390 },
      { department: "Legal", tasks: 180 },
    ],
  },
  {
    id: "task-completion-trend",
    chart_type: "line",
    title: "Task Completion Trend",
    description: "Weekly task completions",
    x_column: "week",
    y_column: "completed",
    columns: ["completed"],
    data: [
      { week: "W1", completed: 85 },
      { week: "W2", completed: 92 },
      { week: "W3", completed: 78 },
      { week: "W4", completed: 110 },
      { week: "W5", completed: 95 },
      { week: "W6", completed: 120 },
      { week: "W7", completed: 105 },
      { week: "W8", completed: 130 },
    ],
  },
  {
    id: "tasks-by-priority",
    chart_type: "pie",
    title: "Tasks by Priority",
    description: "Priority level distribution",
    x_column: "priority",
    y_column: "count",
    data: [
      { priority: "Critical", count: 86 },
      { priority: "High", count: 342 },
      { priority: "Medium", count: 1120 },
      { priority: "Low", count: 608 },
    ],
  },
  {
    id: "duration-vs-complexity",
    chart_type: "scatter",
    title: "Duration vs Complexity",
    description: "Task duration (days) vs complexity score",
    x_column: "complexity",
    y_column: "duration",
    data: [
      { complexity: 2, duration: 1 },
      { complexity: 3, duration: 2 },
      { complexity: 5, duration: 4 },
      { complexity: 4, duration: 3 },
      { complexity: 7, duration: 8 },
      { complexity: 8, duration: 10 },
      { complexity: 6, duration: 5 },
      { complexity: 9, duration: 12 },
      { complexity: 1, duration: 1 },
      { complexity: 10, duration: 15 },
      { complexity: 3, duration: 4 },
      { complexity: 6, duration: 7 },
      { complexity: 7, duration: 6 },
      { complexity: 4, duration: 5 },
      { complexity: 8, duration: 9 },
    ],
  },
];

const TASKS_TABLE = [
  { ID: "T-2001", Title: "System Migration Phase 2", Department: "IT Services", Priority: "Critical", Status: "In Progress", "Due Date": "2026-04-25", "Progress %": "72" },
  { ID: "T-2002", Title: "Annual Report Preparation", Department: "Public Affairs", Priority: "High", Status: "In Progress", "Due Date": "2026-04-30", "Progress %": "45" },
  { ID: "T-2003", Title: "Budget Reconciliation", Department: "Finance", Priority: "High", Status: "Completed", "Due Date": "2026-04-20", "Progress %": "100" },
  { ID: "T-2004", Title: "Staff Onboarding Program", Department: "HR", Priority: "Medium", Status: "In Progress", "Due Date": "2026-04-22", "Progress %": "60" },
  { ID: "T-2005", Title: "Facility Maintenance Audit", Department: "Operations", Priority: "Medium", Status: "Overdue", "Due Date": "2026-04-15", "Progress %": "30" },
  { ID: "T-2006", Title: "Compliance Policy Update", Department: "Legal", Priority: "High", Status: "In Progress", "Due Date": "2026-04-28", "Progress %": "55" },
  { ID: "T-2007", Title: "Network Security Patch", Department: "IT Services", Priority: "Critical", Status: "Completed", "Due Date": "2026-04-18", "Progress %": "100" },
  { ID: "T-2008", Title: "Public Portal Redesign", Department: "Public Affairs", Priority: "Medium", Status: "In Progress", "Due Date": "2026-05-05", "Progress %": "25" },
  { ID: "T-2009", Title: "Vendor Contract Renewal", Department: "Finance", Priority: "Low", Status: "Not Started", "Due Date": "2026-05-10", "Progress %": "0" },
  { ID: "T-2010", Title: "Performance Reviews Q1", Department: "HR", Priority: "High", Status: "Overdue", "Due Date": "2026-04-12", "Progress %": "80" },
];

const FILTERS: FilterConfig[] = [
  { id: "department", label: "Department", type: "select", options: ["IT Services", "Public Affairs", "Finance", "HR", "Operations", "Legal"] },
  { id: "priority", label: "Priority", type: "select", options: ["Critical", "High", "Medium", "Low"] },
  { id: "status", label: "Status", type: "select", options: ["Not Started", "In Progress", "Completed", "Overdue"] },
];

/* ------------------------------------------------------------------ */
/*  Page                                                              */
/* ------------------------------------------------------------------ */

export default function ServiceTasksDashboardPage() {
  const [filterValues, setFilterValues] = React.useState<Record<string, string>>({});

  const filteredTable = React.useMemo(() => {
    let data = TASKS_TABLE;
    if (filterValues.department) data = data.filter((r) => r.Department === filterValues.department);
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
            Service Tasks Dashboard
          </h1>
          <p className="mt-1 text-sm text-dga-gray-500">
            Monitor and track government service tasks
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

        {/* Active Tasks Table */}
        <div>
          <h2 className="mb-3 text-lg font-semibold text-dga-gray-900">
            Active Tasks
          </h2>
          <DataTable
            data={filteredTable as unknown as Record<string, unknown>[]}
            columns={["ID", "Title", "Department", "Priority", "Status", "Due Date", "Progress %"]}
          />
        </div>
      </div>
    </PageWrapper>
  );
}
