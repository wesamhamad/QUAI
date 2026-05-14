"use client";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { ChartWrapper } from "./chart-wrapper";
import { DGA_CHART_COLORS } from "@/lib/chart-colors";

interface DGADonutChartProps {
  title: string;
  description?: string;
  data: Record<string, unknown>[];
  nameKey: string;
  valueKey: string;
  className?: string;
}

export function DGADonutChart({
  title,
  description,
  data,
  nameKey,
  valueKey,
  className,
}: DGADonutChartProps) {
  const total = data.reduce((sum, d) => sum + (Number(d[valueKey]) || 0), 0);

  return (
    <ChartWrapper title={title} description={description} className={className}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey={valueKey}
            nameKey={nameKey}
            cx="50%"
            cy="50%"
            outerRadius="80%"
            innerRadius="55%"
            paddingAngle={3}
            strokeWidth={0}
            label={({ name, percent }) =>
              `${name} ${((percent ?? 0) * 100).toFixed(0)}%`
            }
            labelLine={{ stroke: "#6C737F", strokeWidth: 1 }}
          >
            {data.map((_, i) => (
              <Cell
                key={i}
                fill={DGA_CHART_COLORS[i % DGA_CHART_COLORS.length]}
              />
            ))}
          </Pie>
          {/* Center label showing total */}
          <text
            x="50%"
            y="48%"
            textAnchor="middle"
            dominantBaseline="middle"
            className="fill-dga-gray-800"
            style={{ fontSize: 22, fontWeight: 700 }}
          >
            {total.toLocaleString()}
          </text>
          <text
            x="50%"
            y="56%"
            textAnchor="middle"
            dominantBaseline="middle"
            className="fill-dga-gray-400"
            style={{ fontSize: 11 }}
          >
            الإجمالي
          </text>
          <Tooltip
            contentStyle={{
              borderRadius: 8,
              border: "1px solid #E5E7EB",
              boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
              fontSize: 13,
            }}
            formatter={(value: unknown) => [Number(value).toLocaleString(), "العدد"]}
          />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </ChartWrapper>
  );
}
