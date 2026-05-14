"use client";

import * as React from "react";
import { PageWrapper } from "@/components/layout/page-wrapper";
import { KPIRow } from "@/components/dashboard/kpi-row";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  LayoutDashboard,
  CheckCircle2,
  XCircle,
  Search,
  Eye,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import type { KPIConfig } from "@/lib/types";

/* ------------------------------------------------------------------ */
/*  Mock data                                                         */
/* ------------------------------------------------------------------ */

interface DashboardEntry {
  id: string;
  name: string;
  createdDate: string;
  dataSource: string;
  status: "Pending" | "Approved" | "Rejected";
  rows: number;
  columns: number;
}

const DASHBOARDS: DashboardEntry[] = [
  { id: "D-001", name: "Sales Performance Q1", createdDate: "2026-04-18", dataSource: "sales_2026.csv", status: "Approved", rows: 1240, columns: 12 },
  { id: "D-002", name: "Customer Satisfaction Survey", createdDate: "2026-04-17", dataSource: "csat_survey.xlsx", status: "Pending", rows: 890, columns: 8 },
  { id: "D-003", name: "Employee Attendance Report", createdDate: "2026-04-16", dataSource: "hr_attendance.csv", status: "Approved", rows: 3200, columns: 15 },
  { id: "D-004", name: "Budget Allocation FY2026", createdDate: "2026-04-15", dataSource: "finance_budget.xlsx", status: "Rejected", rows: 450, columns: 10 },
  { id: "D-005", name: "IT Infrastructure Metrics", createdDate: "2026-04-14", dataSource: "infra_metrics.csv", status: "Pending", rows: 2100, columns: 20 },
  { id: "D-006", name: "Public Services Usage", createdDate: "2026-04-13", dataSource: "services_api.json", status: "Approved", rows: 5600, columns: 9 },
  { id: "D-007", name: "Training Completion Rates", createdDate: "2026-04-12", dataSource: "training.csv", status: "Pending", rows: 780, columns: 6 },
  { id: "D-008", name: "Procurement Pipeline", createdDate: "2026-04-11", dataSource: "procurement.xlsx", status: "Approved", rows: 1500, columns: 14 },
  { id: "D-009", name: "Energy Consumption Analysis", createdDate: "2026-04-10", dataSource: "energy_data.csv", status: "Rejected", rows: 4200, columns: 11 },
  { id: "D-010", name: "Citizen Feedback Summary", createdDate: "2026-04-09", dataSource: "feedback.csv", status: "Pending", rows: 3100, columns: 7 },
  { id: "D-011", name: "Vendor Performance Review", createdDate: "2026-04-08", dataSource: "vendors.xlsx", status: "Approved", rows: 680, columns: 13 },
  { id: "D-012", name: "Digital Transformation KPIs", createdDate: "2026-04-07", dataSource: "dt_metrics.csv", status: "Pending", rows: 920, columns: 18 },
];

const STATUS_BADGE_MAP: Record<DashboardEntry["status"], "warning" | "success" | "error"> = {
  Pending: "warning",
  Approved: "success",
  Rejected: "error",
};

/* ------------------------------------------------------------------ */
/*  Page                                                              */
/* ------------------------------------------------------------------ */

export default function ReviewPage() {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState("");
  const [currentPage, setCurrentPage] = React.useState(1);
  const pageSize = 8;

  const filtered = React.useMemo(() => {
    let result = DASHBOARDS;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (d) =>
          d.name.toLowerCase().includes(q) ||
          d.dataSource.toLowerCase().includes(q)
      );
    }
    if (statusFilter) {
      result = result.filter((d) => d.status === statusFilter);
    }
    return result;
  }, [searchQuery, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const page = Math.min(currentPage, totalPages);
  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);

  const counts = React.useMemo(() => {
    const c = { total: DASHBOARDS.length, pending: 0, approved: 0, rejected: 0 };
    for (const d of DASHBOARDS) {
      if (d.status === "Pending") c.pending++;
      else if (d.status === "Approved") c.approved++;
      else c.rejected++;
    }
    return c;
  }, []);

  const kpis: KPIConfig[] = [
    { label: "Total Dashboards", value: counts.total, icon: "bar-chart" },
    { label: "Pending Review", value: counts.pending, icon: "activity" },
    { label: "Approved", value: counts.approved, icon: "trending-up" },
    { label: "Rejected", value: counts.rejected, icon: "hash" },
  ];

  return (
    <PageWrapper>
      <div className="space-y-6">
        {/* Page heading */}
        <div>
          <h1 className="text-2xl font-semibold text-dga-gray-900">
            Dashboard Review
          </h1>
          <p className="mt-1 text-sm text-dga-gray-500">
            Review and manage all generated dashboards
          </p>
        </div>

        {/* KPIs */}
        <KPIRow kpis={kpis} />

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3 rounded-xl border border-dga-gray-200 bg-white px-4 py-3">
          <div className="relative flex-1 min-w-[200px] max-w-sm">
            <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-dga-gray-400" />
            <Input
              placeholder="Search dashboards..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="pl-8"
              aria-label="Search dashboards"
            />
          </div>

          <Select
            value={statusFilter}
            onValueChange={(v) => {
              setStatusFilter((v as string) ?? "");
              setCurrentPage(1);
            }}
          >
            <SelectTrigger className="w-40" aria-label="Filter by status">
              <SelectValue placeholder="All Statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Statuses</SelectItem>
              <SelectItem value="Pending">Pending</SelectItem>
              <SelectItem value="Approved">Approved</SelectItem>
              <SelectItem value="Rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setSearchQuery("");
              setStatusFilter("");
              setCurrentPage(1);
            }}
          >
            Reset
          </Button>
        </div>

        {/* Table */}
        <section
          aria-label="Dashboards table"
          className="rounded-xl border border-dga-gray-200 bg-white"
        >
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-dga-gray-200 bg-dga-gray-50">
                  <th className="px-4 py-2.5 text-left font-medium text-dga-gray-700">
                    Name
                  </th>
                  <th className="px-4 py-2.5 text-left font-medium text-dga-gray-700">
                    Created
                  </th>
                  <th className="px-4 py-2.5 text-left font-medium text-dga-gray-700">
                    Data Source
                  </th>
                  <th className="px-4 py-2.5 text-left font-medium text-dga-gray-700">
                    Status
                  </th>
                  <th className="px-4 py-2.5 text-right font-medium text-dga-gray-700">
                    Rows
                  </th>
                  <th className="px-4 py-2.5 text-right font-medium text-dga-gray-700">
                    Columns
                  </th>
                  <th className="px-4 py-2.5 text-right font-medium text-dga-gray-700">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {paginated.length === 0 ? (
                  <tr>
                    <td
                      colSpan={7}
                      className="px-4 py-8 text-center text-dga-gray-400"
                    >
                      No dashboards found
                    </td>
                  </tr>
                ) : (
                  paginated.map((d) => (
                    <tr
                      key={d.id}
                      className="border-b border-dga-gray-100 last:border-0 hover:bg-dga-gray-25"
                    >
                      <td className="px-4 py-2.5 font-medium text-dga-gray-900">
                        <div className="flex items-center gap-2">
                          <LayoutDashboard className="h-4 w-4 text-dga-primary-500 shrink-0" />
                          {d.name}
                        </div>
                      </td>
                      <td className="px-4 py-2.5 text-dga-gray-600">
                        {d.createdDate}
                      </td>
                      <td className="px-4 py-2.5 text-dga-gray-600 font-mono text-xs">
                        {d.dataSource}
                      </td>
                      <td className="px-4 py-2.5">
                        <Badge variant={STATUS_BADGE_MAP[d.status]}>
                          {d.status}
                        </Badge>
                      </td>
                      <td className="px-4 py-2.5 text-right text-dga-gray-600">
                        {d.rows.toLocaleString()}
                      </td>
                      <td className="px-4 py-2.5 text-right text-dga-gray-600">
                        {d.columns}
                      </td>
                      <td className="px-4 py-2.5">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            aria-label={`View ${d.name}`}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-dga-success-600 hover:text-dga-success-700 hover:bg-dga-success-50"
                            aria-label={`Approve ${d.name}`}
                          >
                            <CheckCircle2 className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-dga-error-600 hover:text-dga-error-700 hover:bg-dga-error-50"
                            aria-label={`Reject ${d.name}`}
                          >
                            <XCircle className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-between border-t border-dga-gray-200 px-4 py-3">
              <span className="text-sm text-dga-gray-500">
                Page {page} of {totalPages} &middot; {filtered.length} dashboard
                {filtered.length !== 1 && "s"}
              </span>
              <div className="flex items-center gap-1">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page <= 1}
                  onClick={() => setCurrentPage((p) => p - 1)}
                  aria-label="Previous page"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page >= totalPages}
                  onClick={() => setCurrentPage((p) => p + 1)}
                  aria-label="Next page"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </section>
      </div>
    </PageWrapper>
  );
}
