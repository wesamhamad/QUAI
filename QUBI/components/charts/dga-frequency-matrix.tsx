"use client";

import * as React from "react";
import { ChartWrapper } from "./chart-wrapper";

interface FrequencyMatrixProps {
  title: string;
  description?: string;
  data: Record<string, unknown>[];
  xKey: string;
  yKey: string;
  valueKey: string;
  className?: string;
}

function getMatrixColor(value: number, max: number): string {
  if (value === 0 || max === 0) return "#F9FAFB";
  const ratio = value / max;
  if (ratio > 0.75) return "#104631"; // SA 900
  if (ratio > 0.5) return "#25935F";  // SA 500
  if (ratio > 0.25) return "#54C08A"; // SA 400
  if (ratio > 0.1) return "#88D8AD";  // SA 300
  return "#DFF6E7"; // SA 100
}

export function DGAFrequencyMatrix({
  title,
  description,
  data,
  xKey,
  yKey,
  valueKey,
  className,
}: FrequencyMatrixProps) {
  const xLabels = Array.from(new Set(data.map((d) => String(d[xKey] || ""))));
  const yLabels = Array.from(new Set(data.map((d) => String(d[yKey] || ""))));
  const max = Math.max(...data.map((d) => Number(d[valueKey]) || 0), 1);

  const lookup: Record<string, number> = {};
  data.forEach((d) => {
    lookup[`${d[xKey]}|${d[yKey]}`] = Number(d[valueKey]) || 0;
  });

  // Row totals & column totals
  const rowTotals: Record<string, number> = {};
  const colTotals: Record<string, number> = {};
  yLabels.forEach((y) => { rowTotals[y] = 0; });
  xLabels.forEach((x) => { colTotals[x] = 0; });
  data.forEach((d) => {
    const v = Number(d[valueKey]) || 0;
    rowTotals[String(d[yKey])] = (rowTotals[String(d[yKey])] || 0) + v;
    colTotals[String(d[xKey])] = (colTotals[String(d[xKey])] || 0) + v;
  });
  const grandTotal = Object.values(rowTotals).reduce((a, b) => a + b, 0);

  return (
    <ChartWrapper title={title} description={description} className={className}>
      <div className="flex h-full w-full overflow-auto p-1" dir="ltr">
        <table className="w-full border-collapse text-center">
          <thead>
            <tr>
              <th className="sticky right-0 z-10 bg-white p-1 text-[10px] font-bold text-dga-gray-600 border-b-2 border-dga-primary-200 min-w-[70px]" dir="rtl">
                المحور
              </th>
              {xLabels.map((x) => (
                <th key={x} className="p-1 text-[10px] font-semibold text-dga-gray-600 border-b-2 border-dga-primary-200 min-w-[40px]">
                  {x}
                </th>
              ))}
              <th className="p-1 text-[10px] font-bold text-dga-gold-600 border-b-2 border-dga-gold-300 min-w-[50px]">
                المجموع
              </th>
            </tr>
          </thead>
          <tbody>
            {yLabels.map((y) => (
              <tr key={y} className="hover:bg-dga-primary-50/30 transition-colors">
                <td className="sticky right-0 z-10 bg-white p-1.5 text-[11px] font-medium text-dga-gray-700 border-b text-right whitespace-nowrap" dir="rtl">
                  {y}
                </td>
                {xLabels.map((x) => {
                  const val = lookup[`${x}|${y}`] ?? 0;
                  return (
                    <td
                      key={`${x}-${y}`}
                      className="p-1 border-b text-[11px] font-medium transition-all"
                      style={{
                        backgroundColor: getMatrixColor(val, max),
                        color: val > max * 0.5 ? "#fff" : "#374151",
                      }}
                    >
                      {val > 0 ? val.toLocaleString() : "—"}
                    </td>
                  );
                })}
                <td className="p-1 border-b text-[11px] font-bold text-dga-gold-700 bg-dga-gold-50">
                  {rowTotals[y]?.toLocaleString() || 0}
                </td>
              </tr>
            ))}
            {/* Totals row */}
            <tr className="bg-dga-primary-50">
              <td className="sticky right-0 z-10 bg-dga-primary-50 p-1.5 text-[11px] font-bold text-dga-primary-700 border-t-2 text-right" dir="rtl">
                المجموع
              </td>
              {xLabels.map((x) => (
                <td key={x} className="p-1 text-[11px] font-bold text-dga-primary-700 border-t-2">
                  {colTotals[x]?.toLocaleString() || 0}
                </td>
              ))}
              <td className="p-1 text-[11px] font-bold text-dga-primary-800 border-t-2 bg-dga-gold-100">
                {grandTotal.toLocaleString()}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </ChartWrapper>
  );
}
