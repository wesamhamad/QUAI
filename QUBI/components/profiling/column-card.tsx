"use client";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  Hash,
  Type,
  Calendar,
  ToggleLeft,
  HelpCircle,
} from "lucide-react";

interface ColumnStats {
  mean?: number | null;
  std?: number | null;
  min?: number | null;
  max?: number | null;
  median?: number | null;
  q25?: number | null;
  q75?: number | null;
}

interface Distribution {
  histogram?: {
    counts: number[];
    bin_edges: number[];
  };
}

interface ColumnProfile {
  name: string;
  dtype: string;
  missing_count: number;
  missing_percent: number;
  unique_count: number;
  sample_values: (string | number | boolean | null)[];
  statistics?: ColumnStats;
  distribution?: Distribution;
  top_values?: Record<string, number>;
}

interface ColumnCardProps {
  column: ColumnProfile;
  totalRows: number;
  className?: string;
}

const dtypeIcon: Record<string, React.ElementType> = {
  int: Hash,
  float: Hash,
  object: Type,
  string: Type,
  datetime: Calendar,
  bool: ToggleLeft,
};

function getDtypeIcon(dtype: string) {
  const key = Object.keys(dtypeIcon).find((k) => dtype.toLowerCase().includes(k));
  return key ? dtypeIcon[key] : HelpCircle;
}

function getDtypeBadgeVariant(dtype: string) {
  if (dtype.includes("int") || dtype.includes("float")) return "info" as const;
  if (dtype.includes("object") || dtype.includes("string")) return "default" as const;
  if (dtype.includes("datetime")) return "primary" as const;
  if (dtype.includes("bool")) return "warning" as const;
  return "default" as const;
}

function formatNumber(n: number | null | undefined): string {
  if (n == null) return "-";
  if (Number.isInteger(n)) return n.toLocaleString();
  return n.toLocaleString(undefined, { maximumFractionDigits: 2 });
}

export function ColumnCard({ column, totalRows, className }: ColumnCardProps) {
  const Icon = getDtypeIcon(column.dtype);
  const isNumeric = column.statistics != null;

  const histogramData =
    column.distribution?.histogram
      ? column.distribution.histogram.counts.map((count, i) => ({
          range: `${formatNumber(column.distribution!.histogram!.bin_edges[i])}`,
          count,
        }))
      : null;

  const topValuesData = column.top_values
    ? Object.entries(column.top_values)
        .slice(0, 8)
        .map(([value, count]) => ({
          value: value.length > 12 ? value.slice(0, 12) + "..." : value,
          count,
        }))
    : null;

  return (
    <Card className={cn("transition-shadow hover:shadow-md", className)}>
      <CardHeader className="border-b">
        <div className="flex items-center gap-2">
          <div className="flex size-8 items-center justify-center rounded-lg bg-dga-gray-100">
            <Icon className="size-4 text-dga-gray-600" aria-hidden="true" />
          </div>
          <div className="min-w-0 flex-1">
            <CardTitle className="truncate" title={column.name}>
              {column.name}
            </CardTitle>
          </div>
          <Badge variant={getDtypeBadgeVariant(column.dtype)}>
            {column.dtype}
          </Badge>
        </div>
      </CardHeader>

      <CardContent>
        {/* Stats grid */}
        <div className="grid grid-cols-3 gap-3">
          <div>
            <p className="text-xs font-medium text-dga-gray-500">Missing</p>
            <p className="text-sm font-semibold text-dga-gray-900">
              {column.missing_count > 0 ? (
                <span className="text-dga-warning-600">
                  {column.missing_percent}%
                </span>
              ) : (
                <span className="text-dga-success-600">0%</span>
              )}
            </p>
          </div>
          <div>
            <p className="text-xs font-medium text-dga-gray-500">Unique</p>
            <p className="text-sm font-semibold text-dga-gray-900">
              {column.unique_count.toLocaleString()}
            </p>
          </div>
          <div>
            <p className="text-xs font-medium text-dga-gray-500">Non-null</p>
            <p className="text-sm font-semibold text-dga-gray-900">
              {(totalRows - column.missing_count).toLocaleString()}
            </p>
          </div>
        </div>

        {/* Numeric statistics */}
        {isNumeric && column.statistics && (
          <div className="mt-4 rounded-lg bg-dga-gray-50 p-3">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-dga-gray-500">
              Statistics
            </p>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-sm">
              <div className="flex justify-between">
                <span className="text-dga-gray-500">Mean</span>
                <span className="font-medium text-dga-gray-800">
                  {formatNumber(column.statistics.mean)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-dga-gray-500">Std</span>
                <span className="font-medium text-dga-gray-800">
                  {formatNumber(column.statistics.std)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-dga-gray-500">Min</span>
                <span className="font-medium text-dga-gray-800">
                  {formatNumber(column.statistics.min)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-dga-gray-500">Max</span>
                <span className="font-medium text-dga-gray-800">
                  {formatNumber(column.statistics.max)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-dga-gray-500">Median</span>
                <span className="font-medium text-dga-gray-800">
                  {formatNumber(column.statistics.median)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-dga-gray-500">IQR</span>
                <span className="font-medium text-dga-gray-800">
                  {column.statistics.q25 != null && column.statistics.q75 != null
                    ? formatNumber(column.statistics.q75 - column.statistics.q25)
                    : "-"}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Distribution histogram */}
        {histogramData && histogramData.length > 0 && (
          <div className="mt-4">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-dga-gray-500">
              Distribution
            </p>
            <div className="h-32">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={histogramData}>
                  <XAxis
                    dataKey="range"
                    tick={{ fontSize: 10 }}
                    tickLine={false}
                    axisLine={false}
                    interval="preserveStartEnd"
                  />
                  <YAxis hide />
                  <Tooltip
                    contentStyle={{
                      fontSize: 12,
                      borderRadius: 8,
                      border: "1px solid #E5E7EB",
                    }}
                  />
                  <Bar
                    dataKey="count"
                    fill="#25935F"
                    radius={[2, 2, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Top values for categorical */}
        {topValuesData && topValuesData.length > 0 && (
          <div className="mt-4">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-dga-gray-500">
              Top Values
            </p>
            <div className="h-32">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={topValuesData} layout="vertical">
                  <XAxis type="number" hide />
                  <YAxis
                    dataKey="value"
                    type="category"
                    tick={{ fontSize: 10 }}
                    tickLine={false}
                    axisLine={false}
                    width={80}
                  />
                  <Tooltip
                    contentStyle={{
                      fontSize: 12,
                      borderRadius: 8,
                      border: "1px solid #E5E7EB",
                    }}
                  />
                  <Bar
                    dataKey="count"
                    fill="#80519F"
                    radius={[0, 2, 2, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Sample values */}
        {column.sample_values.length > 0 && (
          <div className="mt-4">
            <p className="mb-1.5 text-xs font-semibold uppercase tracking-wider text-dga-gray-500">
              Sample Values
            </p>
            <div className="flex flex-wrap gap-1.5">
              {column.sample_values.map((val, i) => (
                <span
                  key={i}
                  className="inline-block max-w-[140px] truncate rounded bg-dga-gray-100 px-2 py-0.5 text-xs text-dga-gray-700"
                  title={String(val)}
                >
                  {String(val)}
                </span>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
