"use client";

import {
  FunnelChart,
  Funnel,
  Tooltip,
  ResponsiveContainer,
  Cell,
  LabelList,
} from "recharts";
import { ChartWrapper } from "./chart-wrapper";
import { DGA_CHART_COLORS } from "@/lib/chart-colors";

interface DGAFunnelChartProps {
  title: string;
  description?: string;
  data: Record<string, unknown>[];
  nameKey: string;
  valueKey: string;
  className?: string;
}

export function DGAFunnelChart({
  title,
  description,
  data,
  nameKey,
  valueKey,
  className,
}: DGAFunnelChartProps) {
  // Sort descending for proper funnel shape
  const sorted = [...data].sort(
    (a, b) => (Number(b[valueKey]) || 0) - (Number(a[valueKey]) || 0)
  );

  return (
    <ChartWrapper title={title} description={description} className={className}>
      <ResponsiveContainer width="100%" height="100%">
        <FunnelChart margin={{ top: 10, right: 10, left: 10, bottom: 10 }}>
          <Tooltip
            contentStyle={{
              borderRadius: 8,
              border: "1px solid #E5E7EB",
              boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
              fontSize: 13,
              direction: "rtl",
            }}
            formatter={(value: unknown) => [
              Number(value).toLocaleString(),
              "العدد",
            ]}
          />
          <Funnel
            dataKey={valueKey}
            nameKey={nameKey}
            data={sorted}
            isAnimationActive
          >
            <LabelList
              dataKey={nameKey}
              position="right"
              fill="#384250"
              style={{ fontSize: 11, fontWeight: 500 }}
            />
            <LabelList
              dataKey={valueKey}
              position="center"
              fill="#fff"
              style={{ fontSize: 12, fontWeight: 700 }}
              formatter={(v: unknown) => Number(v ?? 0).toLocaleString()}
            />
            {sorted.map((_, i) => (
              <Cell
                key={i}
                fill={DGA_CHART_COLORS[i % DGA_CHART_COLORS.length]}
              />
            ))}
          </Funnel>
        </FunnelChart>
      </ResponsiveContainer>
    </ChartWrapper>
  );
}
