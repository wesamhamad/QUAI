"use client";

import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { ChartWrapper } from "./chart-wrapper";
import { DGA_CHART_COLORS } from "@/lib/chart-colors";

interface DGARadarChartProps {
  title: string;
  description?: string;
  data: Record<string, unknown>[];
  nameKey: string;
  valueKey: string;
  className?: string;
}

export function DGARadarChart({
  title,
  description,
  data,
  nameKey,
  valueKey,
  className,
}: DGARadarChartProps) {
  return (
    <ChartWrapper title={title} description={description} className={className}>
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart data={data} cx="50%" cy="50%" outerRadius="70%">
          <PolarGrid stroke="#E5E7EB" />
          <PolarAngleAxis
            dataKey={nameKey}
            tick={{ fontSize: 11, fill: "#6C737F" }}
          />
          <PolarRadiusAxis
            tick={{ fontSize: 10, fill: "#9CA3AF" }}
            axisLine={false}
          />
          <Radar
            dataKey={valueKey}
            stroke={DGA_CHART_COLORS[0]}
            fill={DGA_CHART_COLORS[0]}
            fillOpacity={0.3}
            strokeWidth={2}
          />
          <Tooltip
            contentStyle={{
              borderRadius: 8,
              border: "1px solid #E5E7EB",
              boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
              fontSize: 13,
            }}
          />
        </RadarChart>
      </ResponsiveContainer>
    </ChartWrapper>
  );
}
