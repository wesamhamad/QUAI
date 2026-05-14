export interface KPIConfig {
  label: string;
  value: string | number;
  icon?: string;
  trend?: {
    value: number;
    direction: "up" | "down";
  };
}

export interface ChartConfig {
  id: string;
  chart_type: "bar" | "line" | "area" | "pie" | "scatter" | "heatmap" | "stacked_bar" | "treemap" | "radar" | "frequency_matrix" | "donut" | "horizontal_bar" | "funnel" | "radial_bar" | "gauge" | "grouped_bar" | "composed";
  title: string;
  description?: string;
  x_column?: string;
  y_column?: string;
  columns?: string[];
  aggregation?: string;
  data: Record<string, unknown>[];
}

export interface FilterConfig {
  id: string;
  label: string;
  type: "date-range" | "select" | "multi-select";
  options?: string[];
  value?: string | string[] | [string, string];
}

export interface InsightItem {
  icon: string;
  title: string;
  description: string;
  importance: string;
}

export interface DashboardConfig {
  dataset_id: string;
  title: string;
  kpis: KPIConfig[];
  charts: ChartConfig[];
  insights?: InsightItem[];
  filters: FilterConfig[];
  table_data?: Record<string, unknown>[];
  table_columns?: string[];
}

export interface SavedDashboard {
  id: string;
  dataset_id: string;
  title: string;
  created_at: string;
  record_count: number;
  chart_count: number;
  table_names: string[];
}
