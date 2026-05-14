"use client";

import {
  Treemap,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { ChartWrapper } from "./chart-wrapper";
import { DGA_CHART_COLORS } from "@/lib/chart-colors";

interface DGATreemapProps {
  title: string;
  description?: string;
  data: Record<string, unknown>[];
  nameKey: string;
  valueKey: string;
  className?: string;
}

// Custom content renderer for treemap cells
function CustomTreemapContent(props: Record<string, unknown>) {
  const { x, y, width, height, name, index } = props as {
    x: number; y: number; width: number; height: number; name: string; index: number;
  };
  if (width < 30 || height < 20) return null;

  const color = DGA_CHART_COLORS[(index || 0) % DGA_CHART_COLORS.length];
  return (
    <g>
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        fill={color}
        stroke="#fff"
        strokeWidth={2}
        rx={4}
        opacity={0.9}
      />
      {width > 50 && height > 30 && (
        <text
          x={x + width / 2}
          y={y + height / 2}
          textAnchor="middle"
          dominantBaseline="middle"
          fill="#fff"
          fontSize={Math.min(12, width / 8)}
          fontWeight="600"
        >
          {String(name).length > 15 ? String(name).substring(0, 14) + "…" : name}
        </text>
      )}
    </g>
  );
}

export function DGATreemap({
  title,
  description,
  data,
  nameKey,
  valueKey,
  className,
}: DGATreemapProps) {
  // Transform data for Recharts Treemap
  const treeData = data.map((d) => ({
    name: String(d[nameKey] || ""),
    size: Number(d[valueKey]) || 0,
  }));

  return (
    <ChartWrapper title={title} description={description} className={className}>
      <ResponsiveContainer width="100%" height="100%">
        <Treemap
          data={treeData}
          dataKey="size"
          nameKey="name"
          stroke="#fff"
          content={<CustomTreemapContent />}
        >
          <Tooltip
            contentStyle={{
              borderRadius: 8,
              border: "1px solid #E5E7EB",
              boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
              fontSize: 13,
            }}
            formatter={(value: unknown) => [Number(value).toLocaleString(), "العدد"]}
          />
        </Treemap>
      </ResponsiveContainer>
    </ChartWrapper>
  );
}
