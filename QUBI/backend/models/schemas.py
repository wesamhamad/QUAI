from __future__ import annotations
from pydantic import BaseModel, Field
from typing import Optional, List, Dict
from enum import Enum


class DatabaseType(str, Enum):
    POSTGRESQL = "postgresql"
    MYSQL = "mysql"
    SQLITE = "sqlite"
    SQLSERVER = "sqlserver"
    ORACLE = "oracle"


class DBConnectionRequest(BaseModel):
    db_type: DatabaseType
    host: str
    port: int
    database: str
    username: str
    password: str
    table_name: Optional[str] = None


class DBConnectionResponse(BaseModel):
    dataset_id: str
    tables: list[str]
    message: str


class UploadResponse(BaseModel):
    dataset_id: str
    filename: str
    rows: int
    columns: int
    column_names: list[str]
    message: str


class ProfileResponse(BaseModel):
    dataset_id: str
    row_count: int
    column_count: int
    columns: list[dict]
    missing_values: dict
    duplicates: int
    correlations: Optional[dict] = None
    statistics: dict


class CleaningIssue(BaseModel):
    column: str
    issue_type: str
    description: str
    affected_rows: int
    suggestion: str


class CleaningPreview(BaseModel):
    dataset_id: str
    issues: list[CleaningIssue]
    total_issues: int


class CleanAction(str, Enum):
    DROP_NULLS = "drop_nulls"
    FILL_MEAN = "fill_mean"
    FILL_MEDIAN = "fill_median"
    FILL_MODE = "fill_mode"
    FILL_VALUE = "fill_value"
    DROP_DUPLICATES = "drop_duplicates"
    FIX_TYPES = "fix_types"
    REMOVE_OUTLIERS = "remove_outliers"


class CleanActionRequest(BaseModel):
    actions: list[dict] = Field(
        ...,
        description="List of cleaning actions, each with 'action' (CleanAction), 'column' (str), and optional 'value'",
    )


class CleanApplyResponse(BaseModel):
    dataset_id: str
    rows_before: int
    rows_after: int
    columns_affected: list[str]
    actions_applied: list[str]
    message: str


class AnalyzeRequest(BaseModel):
    analysis_type: Optional[str] = "auto"


class AnalyzeResponse(BaseModel):
    dataset_id: str
    insights: list[dict]
    suggested_charts: list[dict]


class QueryRequest(BaseModel):
    query: str


class QueryResponse(BaseModel):
    dataset_id: str
    query: str
    answer: str
    data: Optional[list[dict]] = None


class DashboardChartConfig(BaseModel):
    id: Optional[str] = None
    chart_type: str
    title: str
    x_column: Optional[str] = None
    y_column: Optional[str] = None
    columns: Optional[list[str]] = None
    aggregation: Optional[str] = None
    description: str
    data: Optional[list[dict]] = None


class KPIConfigResponse(BaseModel):
    label: str
    value: str
    icon: Optional[str] = None
    trend: Optional[dict] = None


class InsightItem(BaseModel):
    icon: str = "💡"
    title: str
    description: str
    importance: str = "medium"


class DashboardConfigResponse(BaseModel):
    dataset_id: str
    title: Optional[str] = None
    kpis: Optional[list[KPIConfigResponse]] = None
    charts: list[DashboardChartConfig]
    insights: Optional[list[InsightItem]] = None
    filters: Optional[list[dict]] = None
    table_columns: Optional[list[str]] = None
    table_data: Optional[list[dict]] = None


class SavedDashboard(BaseModel):
    id: str
    dataset_id: str
    title: str
    created_at: str
    record_count: int
    chart_count: int
    table_names: list[str] = []
