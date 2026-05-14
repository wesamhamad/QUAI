"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { ChartWrapper } from "./chart-wrapper";
import { DGA_CHART_COLORS } from "@/lib/chart-colors";

interface DGABarChartProps {
  title: string;
  description?: string;
  data: Record<string, unknown>[];
  xKey: string;
  yKeys: string[];
  className?: string;
}

export function DGABarChart({
  title,
  description,
  data,
  xKey,
  yKeys,
  className,
}: DGABarChartProps) {
  return (
    <ChartWrapper title={title} description={description} className={className}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 8, right: 8, left: 8, bottom: 40 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
          <XAxis
            dataKey={xKey}
            tick={{ fontSize: 11, fill: "#6C737F" }}
            tickLine={false}
            axisLine={{ stroke: "#E5E7EB" }}
            interval={0}
            angle={-35}
            textAnchor="end"
            height={60}
          />
          <YAxis
            tick={{ fontSize: 12, fill: "#6C737F" }}
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
          />
          {yKeys.length > 1 && <Legend />}
          {yKeys.map((key, i) => (
            <Bar
              key={key}
              dataKey={key}
              fill={DGA_CHART_COLORS[i % DGA_CHART_COLORS.length]}
              radius={[4, 4, 0, 0]}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </ChartWrapper>
  );
}
