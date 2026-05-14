"use client";

import * as React from "react";
import { ChartWrapper } from "./chart-wrapper";
interface HeatmapProps {
  title: string;
  description?: string;
  data: Record<string, unknown>[];
  xKey: string;
  yKey: string;
  valueKey: string;
  className?: string;
}

// Color scale from light to dark DGA green
function getHeatColor(value: number, min: number, max: number): string {
  if (max === min) return "#88D8AD";
  const ratio = (value - min) / (max - min);
  const colors = [
    { r: 223, g: 246, b: 231 }, // SA 100 #DFF6E7
    { r: 136, g: 216, b: 173 }, // SA 300 #88D8AD
    { r: 37, g: 147, b: 95 },   // SA 500 #25935F
    { r: 16, g: 70, b: 49 },    // SA 900 #104631
  ];
  const idx = Math.min(ratio * (colors.length - 1), colors.length - 1.001);
  const low = Math.floor(idx);
  const high = Math.ceil(idx);
  const t = idx - low;
  const r = Math.round(colors[low].r + t * (colors[high].r - colors[low].r));
  const g = Math.round(colors[low].g + t * (colors[high].g - colors[low].g));
  const b = Math.round(colors[low].b + t * (colors[high].b - colors[low].b));
  return `rgb(${r},${g},${b})`;
}

export function DGAHeatmap({
  title,
  description,
  data,
  xKey,
  yKey,
  valueKey,
  className,
}: HeatmapProps) {
  // Build matrix
  const xLabels = Array.from(new Set(data.map((d) => String(d[xKey] || ""))));
  const yLabels = Array.from(new Set(data.map((d) => String(d[yKey] || ""))));
  const values = data.map((d) => Number(d[valueKey]) || 0);
  const min = Math.min(...values);
  const max = Math.max(...values);

  // Create lookup
  const lookup: Record<string, number> = {};
  data.forEach((d) => {
    const key = `${d[xKey]}|${d[yKey]}`;
    lookup[key] = Number(d[valueKey]) || 0;
  });

  const cellSize = Math.min(48, Math.max(28, 400 / Math.max(xLabels.length, yLabels.length)));

  return (
    <ChartWrapper title={title} description={description} className={className}>
      <div className="flex h-full w-full items-center justify-center overflow-auto p-2" dir="ltr">
        <div className="inline-block">
          {/* Column headers */}
          <div className="flex" style={{ paddingRight: yLabels.length > 0 ? 80 : 0 }}>
            <div style={{ width: 80, flexShrink: 0 }} />
            {xLabels.map((x) => (
              <div
                key={x}
                style={{ width: cellSize, height: 24, flexShrink: 0 }}
                className="flex items-end justify-center overflow-hidden"
              >
                <span className="truncate text-[10px] text-dga-gray-500 transform -rotate-45 origin-bottom-left whitespace-nowrap">
                  {x}
                </span>
              </div>
            ))}
          </div>

          {/* Rows */}
          {yLabels.map((y) => (
            <div key={y} className="flex items-center">
              <div
                style={{ width: 80, flexShrink: 0 }}
                className="flex items-center justify-end pl-1 pr-2"
              >
                <span className="truncate text-[11px] font-medium text-dga-gray-600 text-left" dir="rtl">
                  {y}
                </span>
              </div>
              {xLabels.map((x) => {
                const val = lookup[`${x}|${y}`] ?? 0;
                return (
                  <div
                    key={`${x}-${y}`}
                    style={{
                      width: cellSize,
                      height: cellSize,
                      backgroundColor: val > 0 ? getHeatColor(val, min, max) : "#F9FAFB",
                      flexShrink: 0,
                    }}
                    className="border border-white/50 flex items-center justify-center group relative cursor-default rounded-sm"
                    title={`${y} × ${x}: ${val}`}
                  >
                    <span className="text-[9px] font-medium" style={{ color: val > (max - min) / 2 + min ? "#fff" : "#374151" }}>
                      {val > 0 ? val : ""}
                    </span>
                  </div>
                );
              })}
            </div>
          ))}

          {/* Legend */}
          <div className="flex items-center gap-2 mt-3 justify-center">
            <span className="text-[10px] text-dga-gray-400">{min}</span>
            <div className="flex h-3 w-32 rounded-full overflow-hidden">
              {[0, 0.25, 0.5, 0.75, 1].map((r) => (
                <div key={r} className="flex-1" style={{ backgroundColor: getHeatColor(min + r * (max - min), min, max) }} />
              ))}
            </div>
            <span className="text-[10px] text-dga-gray-400">{max}</span>
          </div>
        </div>
      </div>
    </ChartWrapper>
  );
}
