"use client";

import { Pin } from "lucide-react";
import { DataTable } from "@/components/dashboard/data-table";
import { StatCard } from "@/components/ui/stat-card";
import { DGABarChart } from "@/components/charts/dga-bar-chart";
import { DGALineChart } from "@/components/charts/dga-line-chart";
import { DGAPieChart } from "@/components/charts/dga-pie-chart";
import type { QueryResult } from "@/lib/api";

interface QueryResultProps {
  result: QueryResult;
}

type ResultType = "kpi" | "table" | "chart" | "text";

function detectResultType(result: QueryResult): ResultType {
  const { data } = result;

  if (!data || data.length === 0) return "text";

  // Single row with one numeric value → KPI
  if (data.length === 1) {
    const keys = Object.keys(data[0]);
    const values = Object.values(data[0]);
    if (keys.length <= 2 && values.some((v) => typeof v === "number")) {
      return "kpi";
    }
  }

  // Small dataset with a string + numeric column → chart
  if (data.length >= 2 && data.length <= 50) {
    const keys = Object.keys(data[0]);
    const hasString = keys.some((k) => typeof data[0][k] === "string");
    const hasNumber = keys.some((k) => typeof data[0][k] === "number");
    if (hasString && hasNumber && keys.length <= 5) {
      return "chart";
    }
  }

  // Default: table for larger datasets
  if (data.length > 0) return "table";

  return "text";
}

function detectChartType(data: Record<string, unknown>[]): "bar" | "line" | "pie" {
  if (data.length <= 6) return "pie";
  if (data.length > 20) return "line";
  return "bar";
}

function KPIResult({ result }: { result: QueryResult }) {
  const row = result.data![0];
  const keys = Object.keys(row);
  const numericKey = keys.find((k) => typeof row[k] === "number") ?? keys[0];
  const labelKey = keys.find((k) => typeof row[k] === "string");
  const label = labelKey ? String(row[labelKey]) : result.query;
  const value = row[numericKey];

  return (
    <StatCard
      label={label}
      value={typeof value === "number" ? value.toLocaleString() : String(value ?? "—")}
      className="max-w-xs"
    />
  );
}

function ChartResult({ result }: { result: QueryResult }) {
  const data = result.data!;
  const keys = Object.keys(data[0]);
  const xKey = keys.find((k) => typeof data[0][k] === "string") ?? keys[0];
  const yKeys = keys.filter((k) => typeof data[0][k] === "number");
  const chartType = detectChartType(data);

  if (chartType === "pie" && yKeys.length === 1) {
    return (
      <DGAPieChart
        title={result.query}
        data={data}
        nameKey={xKey}
        valueKey={yKeys[0]}
      />
    );
  }

  if (chartType === "line") {
    return (
      <DGALineChart
        title={result.query}
        data={data}
        xKey={xKey}
        yKeys={yKeys}
      />
    );
  }

  return (
    <DGABarChart
      title={result.query}
      data={data}
      xKey={xKey}
      yKeys={yKeys}
    />
  );
}

function TableResult({ result }: { result: QueryResult }) {
  const data = result.data!;
  const columns = Object.keys(data[0]);
  return <DataTable data={data} columns={columns} pageSize={5} />;
}

export function QueryResultRenderer({ result }: QueryResultProps) {
  const resultType = detectResultType(result);

  return (
    <div className="space-y-2">
      {/* Text answer always shown */}
      {result.answer && (
        <p className="text-sm text-dga-gray-700 leading-relaxed whitespace-pre-wrap">
          {result.answer}
        </p>
      )}

      {/* Rich result */}
      {resultType === "kpi" && <KPIResult result={result} />}
      {resultType === "chart" && <ChartResult result={result} />}
      {resultType === "table" && <TableResult result={result} />}

      {/* Pin button */}
      {result.data && result.data.length > 0 && (
        <button
          type="button"
          className="mt-2 inline-flex items-center gap-1.5 rounded-md border border-dga-gray-200 bg-white px-2.5 py-1.5 text-xs font-medium text-dga-gray-600 hover:bg-dga-gray-50 hover:text-dga-gray-800 transition-colors"
        >
          <Pin className="h-3 w-3" />
          Pin to Dashboard
        </button>
      )}
    </div>
  );
}
