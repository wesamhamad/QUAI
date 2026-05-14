"use client";

import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { ChartWrapper } from "./chart-wrapper";
import { DGA_CHART_COLORS } from "@/lib/chart-colors";

interface DGAComposedChartProps {
  title: string;
  description?: string;
  data: Record<string, unknown>[];
  xKey: string;
  yKeys: string[];
  className?: string;
}

export function DGAComposedChart({
  title,
  description,
  data,
  xKey,
  yKeys,
  className,
}: DGAComposedChartProps) {
  // First key = bar, second key = line
  const keys =
    yKeys.length > 0
      ? yKeys
      : data.length > 0
        ? Object.keys(data[0]).filter((k) => k !== xKey && typeof data[0][k] === "number")
        : [];

  const barKey = keys[0];
  const lineKey = keys[1];

  return (
    <ChartWrapper title={title} description={description} className={className}>
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart
          data={data}
          margin={{ top: 8, right: 12, left: 40, bottom: 32 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" vertical={false} />
          <XAxis
            dataKey={xKey}
            tick={{ fontSize: 11, fill: "#384250" }}
            tickLine={false}
            axisLine={{ stroke: "#E5E7EB" }}
            angle={-30}
            textAnchor="end"
            height={48}
          />
          <YAxis
            tick={{ fontSize: 11, fill: "#6C737F" }}
            tickLine={false}
            axisLine={false}
            width={50}
          />
          <Tooltip
            contentStyle={{
              borderRadius: 8,
              border: "1px solid #E5E7EB",
              boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
              fontSize: 13,
              direction: "rtl",
            }}
            formatter={(value: unknown, name?: string | number) => [
              Number(value).toLocaleString(),
              String(name ?? ""),
            ]}
          />
          <Legend wrapperStyle={{ fontSize: 11, paddingTop: 8 }} />
          {barKey && (
            <Bar
              dataKey={barKey}
              fill={DGA_CHART_COLORS[0]}
              radius={[4, 4, 0, 0]}
              barSize={24}
              opacity={0.85}
            />
          )}
          {lineKey && (
            <Line
              type="monotone"
              dataKey={lineKey}
              stroke={DGA_CHART_COLORS[3]}
              strokeWidth={2.5}
              dot={{ fill: DGA_CHART_COLORS[3], r: 3 }}
              activeDot={{ r: 5 }}
            />
          )}
        </ComposedChart>
      </ResponsiveContainer>
    </ChartWrapper>
  );
}
