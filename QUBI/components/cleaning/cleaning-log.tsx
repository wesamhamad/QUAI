"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { CheckCircle2, Clock } from "lucide-react";

interface CleaningLogProps {
  actions: string[];
  rowsBefore?: number;
  rowsAfter?: number;
  className?: string;
}

export function CleaningLog({
  actions,
  rowsBefore,
  rowsAfter,
  className,
}: CleaningLogProps) {
  if (actions.length === 0) {
    return (
      <Card className={className}>
        <CardHeader className="border-b">
          <CardTitle>Cleaning Log</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <Clock
              className="mb-2 size-8 text-dga-gray-300"
              aria-hidden="true"
            />
            <p className="text-sm text-dga-gray-500">
              No cleaning actions applied yet.
            </p>
            <p className="mt-1 text-xs text-dga-gray-400">
              Accept issues above and click Apply to see results here.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader className="border-b">
        <div className="flex items-center justify-between">
          <CardTitle>Cleaning Log</CardTitle>
          {rowsBefore != null && rowsAfter != null && (
            <span className="text-sm text-dga-gray-500">
              Rows: {rowsBefore.toLocaleString()} &rarr;{" "}
              <span className="font-semibold text-dga-primary-600">
                {rowsAfter.toLocaleString()}
              </span>
            </span>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <ol
          className="space-y-2"
          aria-label="Applied cleaning actions"
        >
          {actions.map((action, i) => (
            <li key={i} className="flex items-start gap-2 text-sm">
              <CheckCircle2
                className="mt-0.5 size-4 shrink-0 text-dga-success-500"
                aria-hidden="true"
              />
              <span className="text-dga-gray-700">{action}</span>
            </li>
          ))}
        </ol>
      </CardContent>
    </Card>
  );
}
