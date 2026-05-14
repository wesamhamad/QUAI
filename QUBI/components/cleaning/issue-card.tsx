"use client";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import {
  AlertTriangle,
  Copy,
  Columns3,
  TrendingDown,
  Check,
  X,
} from "lucide-react";

interface CleaningIssue {
  column: string;
  issue_type: string;
  description: string;
  affected_rows: number;
  suggestion: string;
}

interface IssueCardProps {
  issue: CleaningIssue;
  status: "pending" | "accepted" | "rejected";
  onAccept: () => void;
  onReject: () => void;
  className?: string;
}

const issueConfig: Record<
  string,
  { icon: React.ElementType; variant: "warning" | "error" | "info" | "default"; label: string }
> = {
  missing_values: {
    icon: AlertTriangle,
    variant: "warning",
    label: "Missing Values",
  },
  duplicates: {
    icon: Copy,
    variant: "error",
    label: "Duplicates",
  },
  type_mismatch: {
    icon: Columns3,
    variant: "info",
    label: "Type Mismatch",
  },
  outliers: {
    icon: TrendingDown,
    variant: "default",
    label: "Outliers",
  },
};

const suggestionLabels: Record<string, string> = {
  fill_mean: "Fill with mean",
  fill_median: "Fill with median",
  fill_mode: "Fill with mode",
  drop_nulls: "Drop null rows",
  drop_duplicates: "Drop duplicates",
  fix_types: "Convert to numeric",
  remove_outliers: "Remove outliers (IQR)",
};

export function IssueCard({
  issue,
  status,
  onAccept,
  onReject,
  className,
}: IssueCardProps) {
  const config = issueConfig[issue.issue_type] ?? {
    icon: AlertTriangle,
    variant: "default" as const,
    label: issue.issue_type,
  };
  const Icon = config.icon;

  return (
    <Card
      className={cn(
        "transition-shadow",
        status === "accepted" && "ring-2 ring-dga-success-300 bg-dga-success-25",
        status === "rejected" && "opacity-50",
        className
      )}
    >
      <CardHeader className="border-b">
        <div className="flex items-center gap-2">
          <div
            className={cn(
              "flex size-8 items-center justify-center rounded-lg",
              config.variant === "warning" && "bg-dga-warning-100",
              config.variant === "error" && "bg-dga-error-100",
              config.variant === "info" && "bg-dga-info-100",
              config.variant === "default" && "bg-dga-gray-100"
            )}
          >
            <Icon
              className={cn(
                "size-4",
                config.variant === "warning" && "text-dga-warning-600",
                config.variant === "error" && "text-dga-error-600",
                config.variant === "info" && "text-dga-info-600",
                config.variant === "default" && "text-dga-gray-600"
              )}
              aria-hidden="true"
            />
          </div>
          <div className="min-w-0 flex-1">
            <CardTitle>
              {issue.column === "__all__" ? "All Columns" : issue.column}
            </CardTitle>
          </div>
          <Badge variant={config.variant}>{config.label}</Badge>
          {status === "accepted" && (
            <Badge variant="success">Accepted</Badge>
          )}
          {status === "rejected" && (
            <Badge variant="error">Rejected</Badge>
          )}
        </div>
      </CardHeader>

      <CardContent>
        <p className="text-sm text-dga-gray-700">{issue.description}</p>

        <div className="mt-3 flex items-center gap-4 text-sm">
          <div>
            <span className="text-dga-gray-500">Affected rows: </span>
            <span className="font-semibold text-dga-gray-900">
              {issue.affected_rows.toLocaleString()}
            </span>
          </div>
          <div>
            <span className="text-dga-gray-500">Suggested fix: </span>
            <span className="font-semibold text-dga-primary-700">
              {suggestionLabels[issue.suggestion] ?? issue.suggestion}
            </span>
          </div>
        </div>
      </CardContent>

      {status === "pending" && (
        <CardFooter>
          <div className="flex w-full items-center justify-end gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onReject}
              aria-label={`Reject cleaning for ${issue.column}`}
            >
              <X className="size-3.5" data-icon="inline-start" aria-hidden="true" />
              Reject
            </Button>
            <Button
              size="sm"
              onClick={onAccept}
              aria-label={`Accept cleaning for ${issue.column}`}
            >
              <Check className="size-3.5" data-icon="inline-start" aria-hidden="true" />
              Accept
            </Button>
          </div>
        </CardFooter>
      )}
    </Card>
  );
}
