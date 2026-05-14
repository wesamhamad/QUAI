"use client";

import * as React from "react";
import { SlidersHorizontal } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import type { FilterConfig } from "@/lib/types";

interface FilterBarProps {
  filters: FilterConfig[];
  values: Record<string, string>;
  onChange: (filterId: string, value: string) => void;
  onReset: () => void;
  className?: string;
}

export function FilterBar({
  filters,
  values,
  onChange,
  onReset,
  className,
}: FilterBarProps) {
  if (filters.length === 0) return null;

  return (
    <section
      aria-label="فلاتر لوحة البيانات"
      className={className}
    >
      <div className="flex flex-wrap items-center gap-3 rounded-xl border border-dga-gray-200 bg-white px-4 py-3">
        <div className="flex items-center gap-2 text-sm font-medium text-dga-gray-700">
          <SlidersHorizontal className="h-4 w-4" />
          <span>التصفية</span>
        </div>

        <div className="h-5 w-px bg-dga-gray-200" role="separator" />

        {filters.map((filter) => (
          <div key={filter.id} className="flex items-center gap-2">
            <label
              htmlFor={`filter-${filter.id}`}
              className="text-sm text-dga-gray-500"
            >
              {filter.label}
            </label>
            {filter.type === "date-range" ? (
              <Input
                id={`filter-${filter.id}`}
                type="date"
                value={values[filter.id] ?? ""}
                onChange={(e) => onChange(filter.id, e.target.value)}
                className="w-36"
              />
            ) : (
              <Select
                value={values[filter.id] ?? ""}
                onValueChange={(v) => onChange(filter.id, v as string)}
              >
                <SelectTrigger id={`filter-${filter.id}`}>
                  <SelectValue placeholder={`الكل ${filter.label}`} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">الكل</SelectItem>
                  {filter.options?.map((opt) => (
                    <SelectItem key={opt} value={opt}>
                      {opt}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>
        ))}

        <Button variant="ghost" size="sm" onClick={onReset}>
          إعادة تعيين
        </Button>
      </div>
    </section>
  );
}
