"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import { PageWrapper } from "@/components/layout/page-wrapper";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress, ProgressLabel, ProgressValue } from "@/components/ui/progress";
import { IssueCard } from "@/components/cleaning/issue-card";
import { CleaningLog } from "@/components/cleaning/cleaning-log";
import {
  Loader2,
  RefreshCw,
  ServerCrash,
  Sparkles,
  CheckCircle2,
  Play,
  CheckCheck,
} from "lucide-react";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8006";

interface CleaningIssue {
  column: string;
  issue_type: string;
  description: string;
  affected_rows: number;
  suggestion: string;
}

interface CleaningPreview {
  dataset_id: string;
  issues: CleaningIssue[];
  total_issues: number;
}

interface CleanApplyResponse {
  dataset_id: string;
  rows_before: number;
  rows_after: number;
  columns_affected: string[];
  actions_applied: string[];
  message: string;
}

type IssueStatus = "pending" | "accepted" | "rejected";

export default function DataCleaningPage() {
  const params = useParams<{ id: string }>();
  const datasetId = params.id;

  const [preview, setPreview] = useState<CleaningPreview | null>(null);
  const [issueStatuses, setIssueStatuses] = useState<IssueStatus[]>([]);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<CleanApplyResponse | null>(null);

  const fetchIssues = useCallback(async () => {
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await fetch(`${API_BASE}/api/clean/${datasetId}`, {
        method: "POST",
      });
      if (!res.ok) {
        throw new Error(
          res.status === 404
            ? "Dataset not found"
            : `Failed to detect issues (${res.status})`
        );
      }
      const data: CleaningPreview = await res.json();
      setPreview(data);
      setIssueStatuses(data.issues.map(() => "pending"));
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  }, [datasetId]);

  useEffect(() => {
    fetchIssues();
  }, [fetchIssues]);

  const setStatus = (index: number, status: IssueStatus) => {
    setIssueStatuses((prev) => {
      const next = [...prev];
      next[index] = status;
      return next;
    });
  };

  const acceptAll = () => {
    setIssueStatuses((prev) => prev.map(() => "accepted"));
  };

  const acceptedIssues = preview?.issues.filter(
    (_, i) => issueStatuses[i] === "accepted"
  );
  const acceptedCount = acceptedIssues?.length ?? 0;
  const totalIssues = preview?.total_issues ?? 0;

  const applyCleaning = async () => {
    if (!preview || acceptedCount === 0) return;

    setApplying(true);
    setError(null);

    const actions = acceptedIssues!.map((issue) => ({
      action: issue.suggestion,
      column: issue.column === "__all__" ? undefined : issue.column,
    }));

    try {
      const res = await fetch(`${API_BASE}/api/clean/${datasetId}/apply`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ actions }),
      });

      if (!res.ok) {
        throw new Error(`Cleaning failed (${res.status})`);
      }

      const data: CleanApplyResponse = await res.json();
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Cleaning failed");
    } finally {
      setApplying(false);
    }
  };

  // Loading state
  if (loading) {
    return (
      <PageWrapper>
        <div className="flex flex-col items-center justify-center py-24">
          <Loader2
            className="size-8 animate-spin text-dga-primary-500"
            aria-hidden="true"
          />
          <p className="mt-3 text-sm text-dga-gray-500">
            Scanning for data quality issues...
          </p>
        </div>
      </PageWrapper>
    );
  }

  // Error state
  if (error && !preview) {
    return (
      <PageWrapper>
        <div className="flex flex-col items-center justify-center py-24">
          <ServerCrash
            className="size-10 text-dga-error-400"
            aria-hidden="true"
          />
          <p className="mt-3 text-sm font-medium text-dga-gray-900">
            Failed to detect issues
          </p>
          <p className="mt-1 text-sm text-dga-gray-500">{error}</p>
          <Button
            variant="outline"
            size="sm"
            className="mt-4"
            onClick={fetchIssues}
          >
            <RefreshCw className="size-3.5" data-icon="inline-start" aria-hidden="true" />
            Try Again
          </Button>
        </div>
      </PageWrapper>
    );
  }

  if (!preview) return null;

  // Empty state — no issues found
  if (preview.issues.length === 0) {
    return (
      <PageWrapper>
        <div className="mb-6">
          <h1 className="text-xl font-semibold text-dga-gray-900">
            Data Cleaning
          </h1>
          <p className="mt-1 text-sm text-dga-gray-500">
            Dataset: {preview.dataset_id}
          </p>
        </div>
        <div className="flex flex-col items-center justify-center py-24">
          <CheckCircle2
            className="size-12 text-dga-success-400"
            aria-hidden="true"
          />
          <p className="mt-4 text-lg font-medium text-dga-gray-900">
            Your data looks clean
          </p>
          <p className="mt-1 text-sm text-dga-gray-500">
            No data quality issues were detected in this dataset.
          </p>
        </div>
      </PageWrapper>
    );
  }

  const progressValue = totalIssues > 0
    ? Math.round(
        ((issueStatuses.filter((s) => s !== "pending").length) / totalIssues) * 100
      )
    : 0;

  return (
    <PageWrapper>
      {/* Page header */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold text-dga-gray-900">
            Data Cleaning
          </h1>
          <p className="mt-1 text-sm text-dga-gray-500">
            Dataset: {preview.dataset_id} &middot;{" "}
            <span className="font-medium text-dga-warning-600">
              {totalIssues} issue{totalIssues !== 1 ? "s" : ""} found
            </span>
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={fetchIssues}>
            <RefreshCw className="size-3.5" data-icon="inline-start" aria-hidden="true" />
            Re-scan
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={acceptAll}
            disabled={issueStatuses.every((s) => s === "accepted")}
          >
            <CheckCheck className="size-3.5" data-icon="inline-start" aria-hidden="true" />
            Accept All
          </Button>
          <Button
            size="sm"
            onClick={applyCleaning}
            disabled={acceptedCount === 0 || applying}
          >
            {applying ? (
              <Loader2 className="size-3.5 animate-spin" data-icon="inline-start" aria-hidden="true" />
            ) : (
              <Play className="size-3.5" data-icon="inline-start" aria-hidden="true" />
            )}
            Apply Selected ({acceptedCount})
          </Button>
        </div>
      </div>

      {/* Review progress */}
      <div className="mb-6 rounded-lg border border-dga-gray-200 bg-white p-4">
        <Progress value={progressValue}>
          <ProgressLabel>Review Progress</ProgressLabel>
          <ProgressValue />
        </Progress>
        <div className="mt-3 flex gap-4 text-xs text-dga-gray-500">
          <span>
            <Badge variant="default" className="mr-1">
              {issueStatuses.filter((s) => s === "pending").length}
            </Badge>
            Pending
          </span>
          <span>
            <Badge variant="success" className="mr-1">
              {acceptedCount}
            </Badge>
            Accepted
          </span>
          <span>
            <Badge variant="error" className="mr-1">
              {issueStatuses.filter((s) => s === "rejected").length}
            </Badge>
            Rejected
          </span>
        </div>
      </div>

      {/* Applying progress indicator */}
      {applying && (
        <div className="mb-6 flex items-center gap-3 rounded-lg border border-dga-primary-200 bg-dga-primary-25 p-4">
          <Loader2
            className="size-5 animate-spin text-dga-primary-500"
            aria-hidden="true"
          />
          <div>
            <p className="text-sm font-medium text-dga-primary-800">
              Applying cleaning actions...
            </p>
            <p className="text-xs text-dga-primary-600">
              Processing {acceptedCount} action{acceptedCount !== 1 ? "s" : ""}
            </p>
          </div>
        </div>
      )}

      {/* Apply error */}
      {error && preview && (
        <div className="mb-6 rounded-lg border border-dga-error-200 bg-dga-error-50 p-4">
          <p className="text-sm font-medium text-dga-error-800">{error}</p>
        </div>
      )}

      {/* Result banner */}
      {result && (
        <div className="mb-6 flex items-start gap-3 rounded-lg border border-dga-success-200 bg-dga-success-50 p-4">
          <Sparkles
            className="mt-0.5 size-5 text-dga-success-500"
            aria-hidden="true"
          />
          <div>
            <p className="text-sm font-medium text-dga-success-800">
              {result.message}
            </p>
            <p className="mt-1 text-xs text-dga-success-600">
              Rows: {result.rows_before.toLocaleString()} &rarr;{" "}
              {result.rows_after.toLocaleString()} &middot;{" "}
              {result.actions_applied.length} action
              {result.actions_applied.length !== 1 ? "s" : ""} applied
            </p>
          </div>
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
        {/* Issue cards list */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-dga-gray-900">
            Detected Issues
          </h2>
          {preview.issues.map((issue, i) => (
            <IssueCard
              key={`${issue.column}-${issue.issue_type}`}
              issue={issue}
              status={issueStatuses[i]}
              onAccept={() => setStatus(i, "accepted")}
              onReject={() => setStatus(i, "rejected")}
            />
          ))}
        </div>

        {/* Cleaning log sidebar */}
        <div className="lg:sticky lg:top-6 lg:self-start">
          <CleaningLog
            actions={result?.actions_applied ?? []}
            rowsBefore={result?.rows_before}
            rowsAfter={result?.rows_after}
          />
        </div>
      </div>
    </PageWrapper>
  );
}
