"use client";

import { cn } from "@/lib/utils";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface CorrelationData {
  columns: string[];
  matrix: (number | null)[][];
}

interface CorrelationMatrixProps {
  data: CorrelationData;
  className?: string;
}

function getCorrelationColor(value: number | null): string {
  if (value == null) return "bg-dga-gray-100";
  const abs = Math.abs(value);
  if (value > 0) {
    if (abs > 0.8) return "bg-dga-primary-600 text-white";
    if (abs > 0.6) return "bg-dga-primary-400 text-white";
    if (abs > 0.4) return "bg-dga-primary-200 text-dga-primary-900";
    if (abs > 0.2) return "bg-dga-primary-100 text-dga-primary-800";
    return "bg-dga-primary-50 text-dga-primary-700";
  } else {
    if (abs > 0.8) return "bg-dga-error-600 text-white";
    if (abs > 0.6) return "bg-dga-error-400 text-white";
    if (abs > 0.4) return "bg-dga-error-200 text-dga-error-900";
    if (abs > 0.2) return "bg-dga-error-100 text-dga-error-800";
    return "bg-dga-error-50 text-dga-error-700";
  }
}

export function CorrelationMatrix({ data, className }: CorrelationMatrixProps) {
  const { columns, matrix } = data;

  if (columns.length === 0) return null;

  return (
    <Card className={className}>
      <CardHeader className="border-b">
        <CardTitle>Correlation Matrix</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table
            className="w-full border-collapse text-xs"
            role="grid"
            aria-label="Correlation matrix between numeric columns"
          >
            <thead>
              <tr>
                <th className="p-1.5 text-left font-medium text-dga-gray-500" scope="col">
                  <span className="sr-only">Column</span>
                </th>
                {columns.map((col) => (
                  <th
                    key={col}
                    scope="col"
                    className="max-w-[80px] truncate p-1.5 text-center font-medium text-dga-gray-600"
                    title={col}
                  >
                    {col.length > 8 ? col.slice(0, 8) + "..." : col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {matrix.map((row, i) => (
                <tr key={columns[i]}>
                  <th
                    scope="row"
                    className="max-w-[100px] truncate p-1.5 text-left font-medium text-dga-gray-600"
                    title={columns[i]}
                  >
                    {columns[i].length > 10
                      ? columns[i].slice(0, 10) + "..."
                      : columns[i]}
                  </th>
                  {row.map((value, j) => (
                    <td
                      key={j}
                      className={cn(
                        "p-1.5 text-center font-mono tabular-nums transition-colors",
                        "min-w-[48px] rounded",
                        getCorrelationColor(value)
                      )}
                      title={`${columns[i]} vs ${columns[j]}: ${value?.toFixed(2) ?? "N/A"}`}
                    >
                      {value != null ? value.toFixed(2) : "-"}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Legend */}
        <div className="mt-4 flex items-center justify-center gap-2">
          <span className="text-xs text-dga-gray-500">-1</span>
          <div className="flex gap-0.5">
            <div className="size-4 rounded-sm bg-dga-error-600" />
            <div className="size-4 rounded-sm bg-dga-error-400" />
            <div className="size-4 rounded-sm bg-dga-error-200" />
            <div className="size-4 rounded-sm bg-dga-error-50" />
            <div className="size-4 rounded-sm bg-dga-gray-100" />
            <div className="size-4 rounded-sm bg-dga-primary-50" />
            <div className="size-4 rounded-sm bg-dga-primary-200" />
            <div className="size-4 rounded-sm bg-dga-primary-400" />
            <div className="size-4 rounded-sm bg-dga-primary-600" />
          </div>
          <span className="text-xs text-dga-gray-500">+1</span>
        </div>
      </CardContent>
    </Card>
  );
}
