"use client";

import * as React from "react";
import { ArrowUpDown, ChevronLeft, ChevronRight, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface DataTableProps {
  data: Record<string, unknown>[];
  columns: string[];
  pageSize?: number;
  className?: string;
}

export function DataTable({
  data,
  columns,
  pageSize = 10,
  className,
}: DataTableProps) {
  const [sortColumn, setSortColumn] = React.useState<string | null>(null);
  const [sortDirection, setSortDirection] = React.useState<"asc" | "desc">(
    "asc"
  );
  const [filterQuery, setFilterQuery] = React.useState("");
  const [currentPage, setCurrentPage] = React.useState(1);

  const filteredData = React.useMemo(() => {
    if (!filterQuery) return data;
    const q = filterQuery.toLowerCase();
    return data.filter((row) =>
      columns.some((col) => String(row[col] ?? "").toLowerCase().includes(q))
    );
  }, [data, columns, filterQuery]);

  const sortedData = React.useMemo(() => {
    if (!sortColumn) return filteredData;
    return [...filteredData].sort((a, b) => {
      const aVal = a[sortColumn];
      const bVal = b[sortColumn];
      if (aVal == null && bVal == null) return 0;
      if (aVal == null) return 1;
      if (bVal == null) return -1;
      const cmp =
        typeof aVal === "number" && typeof bVal === "number"
          ? aVal - bVal
          : String(aVal).localeCompare(String(bVal));
      return sortDirection === "asc" ? cmp : -cmp;
    });
  }, [filteredData, sortColumn, sortDirection]);

  const totalPages = Math.max(1, Math.ceil(sortedData.length / pageSize));
  const clampedPage = Math.min(currentPage, totalPages);
  const paginatedData = sortedData.slice(
    (clampedPage - 1) * pageSize,
    clampedPage * pageSize
  );

  function handleSort(col: string) {
    if (sortColumn === col) {
      setSortDirection((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortColumn(col);
      setSortDirection("asc");
    }
    setCurrentPage(1);
  }

  return (
    <section
      aria-label="Data table"
      className={cn(
        "rounded-xl border border-dga-gray-200 bg-white",
        className
      )}
    >
      <div className="flex items-center gap-2 border-b border-dga-gray-200 px-4 py-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-dga-gray-400" />
          <Input
            placeholder="تصفية الصفوف..."
            value={filterQuery}
            onChange={(e) => {
              setFilterQuery(e.target.value);
              setCurrentPage(1);
            }}
            className="pl-8"
            aria-label="تصفية صفوف الجدول"
          />
        </div>
        <span className="text-sm text-dga-gray-500">
          {sortedData.length} صف
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-dga-gray-200 bg-dga-gray-50">
              {columns.map((col) => (
                <th key={col} className="px-4 py-2.5 text-left font-medium text-dga-gray-700">
                  <button
                    type="button"
                    className="inline-flex items-center gap-1 rounded px-1 py-0.5 hover:bg-dga-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dga-primary-500"
                    onClick={() => handleSort(col)}
                    aria-label={`Sort by ${col}`}
                  >
                    {col}
                    <ArrowUpDown
                      className={cn(
                        "h-3.5 w-3.5",
                        sortColumn === col
                          ? "text-dga-primary-600"
                          : "text-dga-gray-400"
                      )}
                    />
                  </button>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginatedData.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-4 py-8 text-center text-dga-gray-400"
                >
                  لا توجد بيانات
                </td>
              </tr>
            ) : (
              paginatedData.map((row, i) => (
                <tr
                  key={i}
                  className="border-b border-dga-gray-100 last:border-0 hover:bg-dga-gray-25"
                >
                  {columns.map((col) => (
                    <td key={col} className="px-4 py-2.5 text-dga-gray-800">
                      {row[col] != null ? String(row[col]) : "—"}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-dga-gray-200 px-4 py-3">
          <span className="text-sm text-dga-gray-500">
            صفحة {clampedPage} من {totalPages}
          </span>
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="icon-sm"
              disabled={clampedPage <= 1}
              onClick={() => setCurrentPage((p) => p - 1)}
              aria-label="الصفحة السابقة"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon-sm"
              disabled={clampedPage >= totalPages}
              onClick={() => setCurrentPage((p) => p + 1)}
              aria-label="الصفحة التالية"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </section>
  );
}
