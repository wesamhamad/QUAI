"use client";

import { cn } from "@/lib/utils";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";

interface TrendChartProps {
  title: string;
  description?: string;
  data: { name: string; value: number }[];
  annotation?: { value: number; label: string };
  color?: string;
  className?: string;
}

export function TrendChart({
  title,
  description,
  data,
  annotation,
  color = "#25935F",
  className,
}: TrendChartProps) {
  return (
    <div
      className={cn(
        "rounded-lg border border-dga-gray-200 bg-white p-5 shadow-sm",
        className
      )}
    >
      <h3 className="text-sm font-semibold text-dga-gray-900">{title}</h3>
      {description && (
        <p className="mt-1 text-xs text-dga-gray-500">{description}</p>
      )}
      <div className="mt-4 h-56">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis
              dataKey="name"
              tick={{ fontSize: 11, fill: "#6C737F" }}
              axisLine={{ stroke: "#E5E7EB" }}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 11, fill: "#6C737F" }}
              axisLine={{ stroke: "#E5E7EB" }}
              tickLine={false}
            />
            <Tooltip
              contentStyle={{
                borderRadius: 8,
                border: "1px solid #E5E7EB",
                fontSize: 12,
              }}
            />
            <Line
              type="monotone"
              dataKey="value"
              stroke={color}
              strokeWidth={2}
              dot={{ r: 3, fill: color }}
              activeDot={{ r: 5, fill: color }}
            />
            {annotation && (
              <ReferenceLine
                y={annotation.value}
                stroke="#F79009"
                strokeDasharray="4 4"
                label={{
                  value: annotation.label,
                  position: "right",
                  fill: "#F79009",
                  fontSize: 11,
                }}
              />
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
