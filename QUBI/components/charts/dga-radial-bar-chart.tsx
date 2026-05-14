"use client";

import {
  RadialBarChart,
  RadialBar,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";
import { ChartWrapper } from "./chart-wrapper";
import { DGA_CHART_COLORS } from "@/lib/chart-colors";

interface DGARadialBarChartProps {
  title: string;
  description?: string;
  data: Record<string, unknown>[];
  nameKey: string;
  valueKey: string;
  className?: string;
}

export function DGARadialBarChart({
  title,
  description,
  data,
  nameKey,
  valueKey,
  className,
}: DGARadialBarChartProps) {
  // Add fill color to each entry and sort ascending (innermost = smallest)
  const sorted = [...data]
    .sort((a, b) => (Number(a[valueKey]) || 0) - (Number(b[valueKey]) || 0))
    .map((d, i) => ({
      ...d,
      fill: DGA_CHART_COLORS[i % DGA_CHART_COLORS.length],
    }));

  return (
    <ChartWrapper title={title} description={description} className={className}>
      <ResponsiveContainer width="100%" height="100%">
        <RadialBarChart
          cx="50%"
          cy="50%"
          innerRadius="20%"
          outerRadius="90%"
          barSize={14}
          data={sorted}
          startAngle={180}
          endAngle={-180}
        >
          <RadialBar
            background={{ fill: "#f0fdf4" }}
            dataKey={valueKey}
            label={{
              position: "insideStart",
              fill: "#fff",
              fontSize: 10,
              fontWeight: 600,
            }}
          />
          <Tooltip
            contentStyle={{
              borderRadius: 8,
              border: "1px solid #E5E7EB",
              boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
              fontSize: 13,
              direction: "rtl",
            }}
            formatter={(value: unknown, _name: unknown, props: { payload?: Record<string, unknown> }) => [
              Number(value).toLocaleString(),
              String(props?.payload?.[nameKey] ?? ""),
            ]}
          />
          <Legend
            iconSize={10}
            layout="vertical"
            verticalAlign="middle"
            align="left"
            wrapperStyle={{ fontSize: 11, lineHeight: "20px" }}
            content={() => (
              <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                {sorted.map((d, i) => (
                  <li key={i} style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
                    <span style={{
                      width: 10, height: 10, borderRadius: "50%",
                      backgroundColor: DGA_CHART_COLORS[i % DGA_CHART_COLORS.length],
                      display: "inline-block", flexShrink: 0,
                    }} />
                    <span style={{ fontSize: 11, color: "#384250" }}>{String((d as Record<string, unknown>)[nameKey])}</span>
                  </li>
                ))}
              </ul>
            )}
          />
        </RadialBarChart>
      </ResponsiveContainer>
    </ChartWrapper>
  );
}
