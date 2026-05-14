const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8006";

async function request<T>(
  path: string,
  options?: RequestInit
): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { "Content-Type": "application/json", ...options?.headers },
    ...options,
  });
  if (!res.ok) {
    const detail = await res.text();
    throw new Error(`API error ${res.status}: ${detail}`);
  }
  return res.json();
}

// --- Types matching backend schemas ---

export interface UploadResult {
  dataset_id: string;
  filename: string;
  rows: number;
  columns: number;
  column_names: string[];
  message: string;
}

export interface DBConnectionConfig {
  db_type: string;
  host: string;
  port: number;
  database: string;
  username: string;
  password: string;
  table_name?: string;
}

export interface DBConnectionResult {
  dataset_id: string;
  tables: string[];
  message: string;
}

export interface ProfileResult {
  dataset_id: string;
  row_count: number;
  column_count: number;
  columns: Record<string, unknown>[];
  missing_values: Record<string, number>;
  duplicates: number;
  correlations: Record<string, Record<string, number>> | null;
  statistics: Record<string, unknown>;
}

export interface CleaningIssue {
  column: string;
  issue_type: string;
  description: string;
  affected_rows: number;
  suggestion: string;
}

export interface CleaningPreview {
  dataset_id: string;
  issues: CleaningIssue[];
  total_issues: number;
}

export interface CleanAction {
  action: string;
  column: string;
  value?: string;
}

export interface CleanApplyResult {
  dataset_id: string;
  rows_before: number;
  rows_after: number;
  columns_affected: string[];
  actions_applied: string[];
  message: string;
}

export interface Insight {
  type: string;
  title: string;
  description: string;
  importance: "high" | "medium" | "low";
  column?: string;
  columns?: string[];
}

export interface ChartConfig {
  chart_type: string;
  title: string;
  x_column: string | null;
  y_column: string | null;
  columns: string[] | null;
  aggregation: string | null;
  description: string;
}

export interface AnalysisResult {
  dataset_id: string;
  insights: Insight[];
  suggested_charts: ChartConfig[];
}

export interface QueryResult {
  dataset_id: string;
  query: string;
  answer: string;
  data: Record<string, unknown>[] | null;
}

export interface DashboardConfig {
  dataset_id: string;
  charts: ChartConfig[];
}

// --- API Functions ---

export async function uploadFile(file: File): Promise<UploadResult> {
  const formData = new FormData();
  formData.append("file", file);
  const res = await fetch(`${API_BASE}/api/ingest/upload`, {
    method: "POST",
    body: formData,
  });
  if (!res.ok) {
    const detail = await res.text();
    throw new Error(`Upload failed: ${detail}`);
  }
  return res.json();
}

export async function connectDatabase(
  config: DBConnectionConfig
): Promise<DBConnectionResult> {
  return request<DBConnectionResult>("/api/ingest/connect", {
    method: "POST",
    body: JSON.stringify(config),
  });
}

export async function getProfile(datasetId: string): Promise<ProfileResult> {
  return request<ProfileResult>(`/api/profile/${datasetId}`);
}

export async function runCleaning(
  datasetId: string
): Promise<CleaningPreview> {
  return request<CleaningPreview>(`/api/clean/${datasetId}`, {
    method: "POST",
  });
}

export async function applyCleaning(
  datasetId: string,
  actions: CleanAction[]
): Promise<CleanApplyResult> {
  return request<CleanApplyResult>(`/api/clean/${datasetId}/apply`, {
    method: "POST",
    body: JSON.stringify({ actions }),
  });
}

export async function getAnalysis(
  datasetId: string
): Promise<AnalysisResult> {
  return request<AnalysisResult>(`/api/analyze/${datasetId}`, {
    method: "POST",
    body: JSON.stringify({ analysis_type: "auto" }),
  });
}

export async function queryData(
  datasetId: string,
  question: string
): Promise<QueryResult> {
  return request<QueryResult>(`/api/analyze/${datasetId}/query`, {
    method: "POST",
    body: JSON.stringify({ query: question }),
  });
}

export async function getDashboardConfig(
  datasetId: string
): Promise<DashboardConfig> {
  return request<DashboardConfig>(`/api/dashboard/${datasetId}/config`);
}
