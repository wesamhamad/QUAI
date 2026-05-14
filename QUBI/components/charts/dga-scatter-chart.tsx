"use client";

import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  ZAxis,
} from "recharts";
import { ChartWrapper } from "./chart-wrapper";
import { DGA_CHART_COLORS } from "@/lib/chart-colors";

interface DGAScatterChartProps {
  title: string;
  description?: string;
  data: Record<string, unknown>[];
  xKey: string;
  yKey: string;
  zKey?: string;
  className?: string;
}

export function DGAScatterChart({
  title,
  description,
  data,
  xKey,
  yKey,
  zKey,
  className,
}: DGAScatterChartProps) {
  return (
    <ChartWrapper title={title} description={description} className={className}>
      <ResponsiveContainer width="100%" height="100%">
        <ScatterChart margin={{ top: 8, right: 8, left: 8, bottom: 40 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
          <XAxis
            dataKey={xKey}
            name={xKey}
            tick={{ fontSize: 11, fill: "#6C737F" }}
            tickLine={false}
            axisLine={{ stroke: "#E5E7EB" }}
            interval={0}
            angle={-35}
            textAnchor="end"
            height={60}
          />
          <YAxis
            dataKey={yKey}
            name={yKey}
            tick={{ fontSize: 12, fill: "#6C737F" }}
            tickLine={false}
            axisLine={false}
          />
          {zKey && <ZAxis dataKey={zKey} name={zKey} range={[40, 400]} />}
          <Tooltip
            contentStyle={{
              borderRadius: 8,
              border: "1px solid #E5E7EB",
              boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
              fontSize: 13,
            }}
            cursor={{ strokeDasharray: "3 3" }}
          />
          <Legend />
          <Scatter
            name={`${xKey} vs ${yKey}`}
            data={data}
            fill={DGA_CHART_COLORS[0]}
          />
        </ScatterChart>
      </ResponsiveContainer>
    </ChartWrapper>
  );
}
