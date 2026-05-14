"use client";

import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { ChartWrapper } from "./chart-wrapper";

interface DGAGaugeChartProps {
  title: string;
  description?: string;
  data: Record<string, unknown>[];
  nameKey: string;
  valueKey: string;
  className?: string;
}

// Color based on percentage value
function gaugeColor(pct: number): string {
  if (pct >= 80) return "#166A45"; // SA 700 — excellent
  if (pct >= 60) return "#25935F"; // SA 500 — good
  if (pct >= 40) return "#54C08A"; // SA 400 — moderate
  if (pct >= 20) return "#88D8AD"; // SA 300 — low
  return "#B8EACB"; // SA 200 — very low
}

export function DGAGaugeChart({
  title,
  description,
  data,
  nameKey,
  valueKey,
  className,
}: DGAGaugeChartProps) {
  // Use first item as the gauge value, or compute from data
  const firstItem = data[0] || {};
  const pct = Number(firstItem[valueKey]) || 0;
  const label = String(firstItem[nameKey] || title);
  const remaining = Math.max(0, 100 - pct);

  const gaugeData = [
    { name: label, value: pct },
    { name: "باقي", value: remaining },
  ];

  const color = gaugeColor(pct);

  return (
    <ChartWrapper title={title} description={description} className={className}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={gaugeData}
            startAngle={220}
            endAngle={-40}
            cx="50%"
            cy="55%"
            innerRadius="60%"
            outerRadius="85%"
            paddingAngle={0}
            dataKey="value"
            strokeWidth={0}
          >
            <Cell fill={color} />
            <Cell fill="#f3f4f6" />
          </Pie>
          {/* Center percentage */}
          <text
            x="50%"
            y="48%"
            textAnchor="middle"
            dominantBaseline="middle"
            style={{ fontSize: 28, fontWeight: 800 }}
            fill={color}
          >
            {pct.toFixed(1)}%
          </text>
          <text
            x="50%"
            y="60%"
            textAnchor="middle"
            dominantBaseline="middle"
            className="fill-dga-gray-500"
            style={{ fontSize: 11 }}
          >
            {label}
          </text>
        </PieChart>
      </ResponsiveContainer>
    </ChartWrapper>
  );
}
