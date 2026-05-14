"use client";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import {
  TrendingUp,
  BarChart3,
  AlertTriangle,
  Lightbulb,
  Database,
  GitCompare,
  type LucideIcon,
} from "lucide-react";

const typeIconMap: Record<string, LucideIcon> = {
  overview: Database,
  distribution: BarChart3,
  categorical: BarChart3,
  correlation: GitCompare,
  high_cardinality: AlertTriangle,
  data_quality: AlertTriangle,
  trend: TrendingUp,
};

const importanceBadgeVariant: Record<string, "error" | "warning" | "info"> = {
  high: "error",
  medium: "warning",
  low: "info",
};

interface InsightCardProps {
  type: string;
  title: string;
  description: string;
  importance: "high" | "medium" | "low";
  className?: string;
}

export function InsightCard({
  type,
  title,
  description,
  importance,
  className,
}: InsightCardProps) {
  const Icon = typeIconMap[type] || Lightbulb;
  const badgeVariant = importanceBadgeVariant[importance] || "info";

  return (
    <div
      className={cn(
        "rounded-lg border border-dga-gray-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md",
        className
      )}
    >
      <div className="flex items-start gap-3">
        <div
          className={cn(
            "rounded-lg p-2",
            importance === "high"
              ? "bg-dga-error-50"
              : importance === "medium"
              ? "bg-dga-warning-50"
              : "bg-dga-primary-50"
          )}
        >
          <Icon
            className={cn(
              "h-5 w-5",
              importance === "high"
                ? "text-dga-error-600"
                : importance === "medium"
                ? "text-dga-warning-600"
                : "text-dga-primary-600"
            )}
          />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-sm font-semibold text-dga-gray-900 truncate">
              {title}
            </h3>
            <Badge variant={badgeVariant} className="shrink-0">
              {importance}
            </Badge>
          </div>
          <p className="text-sm text-dga-gray-600 leading-relaxed">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
}
