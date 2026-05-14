"use client";

import { cn } from "@/lib/utils";
import { AlertTriangle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface AnomalyAlertProps {
  title: string;
  description: string;
  severity?: "high" | "medium" | "low";
  affectedRows?: number;
  className?: string;
}

export function AnomalyAlert({
  title,
  description,
  severity = "medium",
  affectedRows,
  className,
}: AnomalyAlertProps) {
  return (
    <div
      className={cn(
        "rounded-lg border-l-4 p-4",
        severity === "high"
          ? "border-dga-error-500 bg-dga-error-50"
          : severity === "medium"
          ? "border-dga-warning-500 bg-dga-warning-50"
          : "border-dga-info-500 bg-dga-info-50",
        className
      )}
    >
      <div className="flex items-start gap-3">
        <AlertTriangle
          className={cn(
            "h-5 w-5 shrink-0 mt-0.5",
            severity === "high"
              ? "text-dga-error-600"
              : severity === "medium"
              ? "text-dga-warning-600"
              : "text-dga-info-600"
          )}
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h4
              className={cn(
                "text-sm font-semibold",
                severity === "high"
                  ? "text-dga-error-800"
                  : severity === "medium"
                  ? "text-dga-warning-800"
                  : "text-dga-info-800"
              )}
            >
              {title}
            </h4>
            {affectedRows !== undefined && (
              <Badge variant={severity === "high" ? "error" : "warning"}>
                {affectedRows} rows
              </Badge>
            )}
          </div>
          <p
            className={cn(
              "mt-1 text-sm",
              severity === "high"
                ? "text-dga-error-700"
                : severity === "medium"
                ? "text-dga-warning-700"
                : "text-dga-info-700"
            )}
          >
            {description}
          </p>
        </div>
      </div>
    </div>
  );
}
