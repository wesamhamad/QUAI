import { cn } from "@/lib/utils";
import { ArrowUp, ArrowDown, type LucideIcon } from "lucide-react";

interface StatCardProps {
  label: string;
  value: string | number;
  icon?: LucideIcon;
  trend?: { value: number; direction: "up" | "down" };
  className?: string;
}

export function StatCard({ label, value, icon: Icon, trend, className }: StatCardProps) {
  return (
    <div
      className={cn(
        "rounded-lg border border-dga-gray-200 bg-white p-5 shadow-sm",
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-dga-gray-500">{label}</p>
          <p className="mt-1 text-2xl font-semibold text-dga-gray-900">{value}</p>
        </div>
        {Icon && (
          <div className="rounded-lg bg-dga-primary-50 p-2">
            <Icon className="h-5 w-5 text-dga-primary-600" />
          </div>
        )}
      </div>

      {trend && (
        <div className="mt-3 flex items-center gap-1 text-sm">
          {trend.direction === "up" ? (
            <ArrowUp className="h-4 w-4 text-dga-success-500" />
          ) : (
            <ArrowDown className="h-4 w-4 text-dga-error-500" />
          )}
          <span
            className={cn(
              "font-medium",
              trend.direction === "up" ? "text-dga-success-600" : "text-dga-error-600"
            )}
          >
            {trend.value}%
          </span>
        </div>
      )}
    </div>
  );
}
