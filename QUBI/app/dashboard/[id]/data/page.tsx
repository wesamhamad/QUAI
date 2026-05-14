"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import { PageWrapper } from "@/components/layout/page-wrapper";
import { StatCard } from "@/components/ui/stat-card";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { ColumnCard } from "@/components/profiling/column-card";
import { CorrelationMatrix } from "@/components/profiling/correlation-matrix";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import {
  Rows3,
  Columns3,
  AlertTriangle,
  Copy,
  Loader2,
  RefreshCw,
  ServerCrash,
  DatabaseZap,
} from "lucide-react";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8006";

interface ProfileData {
  dataset_id: string;
  row_count: number;
  column_count: number;
  columns: ColumnProfile[];
  missing_values: Record<string, number>;
  duplicates: number;
  correlations: { columns: string[]; matrix: (number | null)[][] } | null;
  statistics: {
    total_cells: number;
    total_missing: number;
    missing_percent: number;
    memory_usage_mb: number;
  };
}

interface ColumnProfile {
  name: string;
  dtype: string;
  missing_count: number;
  missing_percent: number;
  unique_count: number;
  sample_values: (string | number | boolean | null)[];
  statistics?: Record<string, number | null>;
  distribution?: { histogram?: { counts: number[]; bin_edges: number[] } };
  top_values?: Record<string, number>;
}

const TYPE_COLORS = [
  "#25935F", // dga-primary-500
  "#80519F", // dga-lavender-500
  "#F5BD02", // dga-gold-500
  "#2E90FA", // dga-info-500
  "#F04438", // dga-error-500
  "#6C737F", // dga-gray-500
];

export default function DataProfilingPage() {
  const params = useParams<{ id: string }>();
  const datasetId = params.id;

  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/api/profile/${datasetId}`);
      if (!res.ok) {
        throw new Error(
          res.status === 404
            ? "Dataset not found"
            : `Failed to load profile (${res.status})`
        );
      }
      const data: ProfileData = await res.json();
      setProfile(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  }, [datasetId]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  // Loading state
  if (loading) {
    return (
      <PageWrapper>
        <div className="flex flex-col items-center justify-center py-24">
          <Loader2
            className="size-8 animate-spin text-dga-primary-500"
            aria-hidden="true"
          />
          <p className="mt-3 text-sm text-dga-gray-500">
            Profiling your dataset...
          </p>
        </div>
      </PageWrapper>
    );
  }

  // Error state
  if (error) {
    return (
      <PageWrapper>
        <div className="flex flex-col items-center justify-center py-24">
          <ServerCrash
            className="size-10 text-dga-error-400"
            aria-hidden="true"
          />
          <p className="mt-3 text-sm font-medium text-dga-gray-900">
            Failed to load profile
          </p>
          <p className="mt-1 text-sm text-dga-gray-500">{error}</p>
          <Button
            variant="outline"
            size="sm"
            className="mt-4"
            onClick={fetchProfile}
          >
            <RefreshCw className="size-3.5" data-icon="inline-start" aria-hidden="true" />
            Try Again
          </Button>
        </div>
      </PageWrapper>
    );
  }

  if (!profile) return null;

  // Compute column type breakdown
  const typeCounts: Record<string, number> = {};
  for (const col of profile.columns) {
    const baseType = col.dtype.includes("int")
      ? "Integer"
      : col.dtype.includes("float")
        ? "Float"
        : col.dtype.includes("object") || col.dtype.includes("string")
          ? "String"
          : col.dtype.includes("datetime")
            ? "DateTime"
            : col.dtype.includes("bool")
              ? "Boolean"
              : "Other";
    typeCounts[baseType] = (typeCounts[baseType] ?? 0) + 1;
  }
  const typeData = Object.entries(typeCounts).map(([name, value]) => ({
    name,
    value,
  }));

  // Missing values per column (only those with missing)
  const missingData = Object.entries(profile.missing_values)
    .sort(([, a], [, b]) => b - a)
    .map(([column, count]) => ({
      column: column.length > 15 ? column.slice(0, 15) + "..." : column,
      fullName: column,
      count,
      percent: Math.round((count / profile.row_count) * 100),
    }));

  return (
    <PageWrapper>
      {/* Page header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-dga-gray-900">
            Data Profile
          </h1>
          <p className="mt-1 text-sm text-dga-gray-500">
            Dataset: {profile.dataset_id}
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={fetchProfile}>
          <RefreshCw className="size-3.5" data-icon="inline-start" aria-hidden="true" />
          Refresh
        </Button>
      </div>

      {/* Stat cards row */}
      <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          label="Total Rows"
          value={profile.row_count.toLocaleString()}
          icon={Rows3}
        />
        <StatCard
          label="Columns"
          value={profile.column_count}
          icon={Columns3}
        />
        <StatCard
          label="Missing Values"
          value={`${profile.statistics.missing_percent}%`}
          icon={AlertTriangle}
        />
        <StatCard
          label="Duplicates"
          value={profile.duplicates.toLocaleString()}
          icon={Copy}
        />
      </div>

      {/* Charts row: Column Types + Missing Values */}
      <div className="mb-6 grid gap-6 lg:grid-cols-2">
        {/* Column Types Pie Chart */}
        <Card>
          <CardHeader className="border-b">
            <CardTitle>Column Types</CardTitle>
          </CardHeader>
          <CardContent>
            {typeData.length > 0 ? (
              <div className="flex items-center justify-center">
                <div className="h-56 w-full max-w-xs">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={typeData}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={80}
                        paddingAngle={2}
                        dataKey="value"
                        label={({ name, value }) => `${name} (${value})`}
                      >
                        {typeData.map((_, i) => (
                          <Cell
                            key={i}
                            fill={TYPE_COLORS[i % TYPE_COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Legend />
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            ) : (
              <p className="py-8 text-center text-sm text-dga-gray-400">
                No column data available
              </p>
            )}
          </CardContent>
        </Card>

        {/* Missing Values Bar Chart */}
        <Card>
          <CardHeader className="border-b">
            <CardTitle>Missing Values by Column</CardTitle>
          </CardHeader>
          <CardContent>
            {missingData.length > 0 ? (
              <div className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={missingData}>
                    <XAxis
                      dataKey="column"
                      tick={{ fontSize: 11 }}
                      tickLine={false}
                      axisLine={false}
                      interval={0}
                      angle={-30}
                      textAnchor="end"
                      height={50}
                    />
                    <YAxis
                      tickFormatter={(v) => `${v}%`}
                      tick={{ fontSize: 11 }}
                      tickLine={false}
                      axisLine={false}
                    />
                    <Tooltip
                      formatter={(value, _name, props) => {
                        const p = (props as unknown as { payload: { fullName: string; count: number } }).payload;
                        return [`${p.count.toLocaleString()} (${value}%)`, p.fullName];
                      }}
                      contentStyle={{
                        fontSize: 12,
                        borderRadius: 8,
                        border: "1px solid #E5E7EB",
                      }}
                    />
                    <Bar
                      dataKey="percent"
                      fill="#F79009"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-8">
                <DatabaseZap
                  className="mb-2 size-8 text-dga-success-300"
                  aria-hidden="true"
                />
                <p className="text-sm text-dga-gray-500">
                  No missing values found
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Correlation Matrix */}
      {profile.correlations && (
        <div className="mb-6">
          <CorrelationMatrix data={profile.correlations} />
        </div>
      )}

      {/* Per-column detail cards */}
      <div className="mb-2">
        <h2 className="text-lg font-semibold text-dga-gray-900">
          Column Details
        </h2>
        <p className="text-sm text-dga-gray-500">
          {profile.column_count} columns &middot; Click to explore
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {profile.columns.map((col) => (
          <ColumnCard
            key={col.name}
            column={col}
            totalRows={profile.row_count}
          />
        ))}
      </div>
    </PageWrapper>
  );
}
