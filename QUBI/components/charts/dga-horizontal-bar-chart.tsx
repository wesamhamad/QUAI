"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { ChartWrapper } from "./chart-wrapper";
import { DGA_CHART_COLORS } from "@/lib/chart-colors";

interface DGAHorizontalBarChartProps {
  title: string;
  description?: string;
  data: Record<string, unknown>[];
  nameKey: string;
  valueKey: string;
  className?: string;
}

export function DGAHorizontalBarChart({
  title,
  description,
  data,
  nameKey,
  valueKey,
  className,
}: DGAHorizontalBarChartProps) {
  // Sort by value descending for better visual
  const sorted = [...data].sort(
    (a, b) => (Number(b[valueKey]) || 0) - (Number(a[valueKey]) || 0)
  );

  return (
    <ChartWrapper title={title} description={description} className={className}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={sorted}
          layout="vertical"
          margin={{ top: 4, right: 20, left: 8, bottom: 4 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" horizontal={false} />
          <XAxis
            type="number"
            tick={{ fontSize: 11, fill: "#6C737F" }}
            tickLine={false}
            axisLine={{ stroke: "#E5E7EB" }}
          />
          <YAxis
            type="category"
            dataKey={nameKey}
            width={120}
            tick={{ fontSize: 11, fill: "#384250", textAnchor: "end" }}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip
            contentStyle={{
              borderRadius: 8,
              border: "1px solid #E5E7EB",
              boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
              fontSize: 13,
            }}
            formatter={(value: unknown) => [
              Number(value).toLocaleString(),
              "العدد",
            ]}
          />
          <Bar dataKey={valueKey} radius={[0, 4, 4, 0]} barSize={18}>
            {sorted.map((_, i) => (
              <Cell
                key={i}
                fill={DGA_CHART_COLORS[i % DGA_CHART_COLORS.length]}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </ChartWrapper>
  );
}
