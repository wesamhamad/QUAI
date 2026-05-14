from typing import List, Dict
import pandas as pd
import numpy as np
from services.duckdb_service import get_dataframe, save_dataframe


def detect_issues(dataset_id: str) -> dict:
    df = get_dataframe(dataset_id)
    issues = []

    # Missing values
    for col in df.columns:
        missing = int(df[col].isna().sum())
        if missing > 0:
            issues.append({
                "column": col,
                "issue_type": "missing_values",
                "description": f"{missing} missing values ({round(missing/len(df)*100, 1)}%)",
                "affected_rows": missing,
                "suggestion": _suggest_fill_strategy(df[col]),
            })

    # Duplicates
    dup_count = int(df.duplicated().sum())
    if dup_count > 0:
        issues.append({
            "column": "__all__",
            "issue_type": "duplicates",
            "description": f"{dup_count} duplicate rows found",
            "affected_rows": dup_count,
            "suggestion": "drop_duplicates",
        })

    # Type issues
    for col in df.columns:
        if df[col].dtype == object:
            numeric_convertible = pd.to_numeric(df[col], errors="coerce")
            non_null_original = df[col].dropna()
            non_null_converted = numeric_convertible.dropna()
            if len(non_null_original) > 0 and len(non_null_converted) / len(non_null_original) > 0.8:
                failed = len(non_null_original) - len(non_null_converted)
                issues.append({
                    "column": col,
                    "issue_type": "type_mismatch",
                    "description": f"Column appears numeric but stored as text ({failed} non-numeric values)",
                    "affected_rows": failed,
                    "suggestion": "fix_types",
                })

    # Outliers (numeric columns)
    for col in df.select_dtypes(include=[np.number]).columns:
        q1 = df[col].quantile(0.25)
        q3 = df[col].quantile(0.75)
        iqr = q3 - q1
        if iqr > 0:
            lower = q1 - 1.5 * iqr
            upper = q3 + 1.5 * iqr
            outliers = int(((df[col] < lower) | (df[col] > upper)).sum())
            if outliers > 0 and outliers / len(df) < 0.3:
                issues.append({
                    "column": col,
                    "issue_type": "outliers",
                    "description": f"{outliers} potential outliers detected (IQR method)",
                    "affected_rows": outliers,
                    "suggestion": "remove_outliers",
                })

    return {
        "dataset_id": dataset_id,
        "issues": issues,
        "total_issues": len(issues),
    }


def apply_cleaning(dataset_id: str, actions: List[dict]) -> dict:
    df = get_dataframe(dataset_id)
    rows_before = len(df)
    columns_affected = set()
    actions_applied = []

    for action_spec in actions:
        action = action_spec.get("action")
        column = action_spec.get("column")
        value = action_spec.get("value")

        if action == "drop_nulls" and column:
            df = df.dropna(subset=[column])
            columns_affected.add(column)
            actions_applied.append(f"Dropped rows with null values in '{column}'")

        elif action == "fill_mean" and column:
            if pd.api.types.is_numeric_dtype(df[column]):
                df[column] = df[column].fillna(df[column].mean())
                columns_affected.add(column)
                actions_applied.append(f"Filled nulls with mean in '{column}'")

        elif action == "fill_median" and column:
            if pd.api.types.is_numeric_dtype(df[column]):
                df[column] = df[column].fillna(df[column].median())
                columns_affected.add(column)
                actions_applied.append(f"Filled nulls with median in '{column}'")

        elif action == "fill_mode" and column:
            mode_val = df[column].mode()
            if len(mode_val) > 0:
                df[column] = df[column].fillna(mode_val.iloc[0])
                columns_affected.add(column)
                actions_applied.append(f"Filled nulls with mode in '{column}'")

        elif action == "fill_value" and column and value is not None:
            df[column] = df[column].fillna(value)
            columns_affected.add(column)
            actions_applied.append(f"Filled nulls with '{value}' in '{column}'")

        elif action == "drop_duplicates":
            df = df.drop_duplicates()
            columns_affected.add("__all__")
            actions_applied.append("Dropped duplicate rows")

        elif action == "fix_types" and column:
            df[column] = pd.to_numeric(df[column], errors="coerce")
            columns_affected.add(column)
            actions_applied.append(f"Converted '{column}' to numeric type")

        elif action == "remove_outliers" and column:
            if pd.api.types.is_numeric_dtype(df[column]):
                q1 = df[column].quantile(0.25)
                q3 = df[column].quantile(0.75)
                iqr = q3 - q1
                lower = q1 - 1.5 * iqr
                upper = q3 + 1.5 * iqr
                df = df[(df[column] >= lower) & (df[column] <= upper)]
                columns_affected.add(column)
                actions_applied.append(f"Removed outliers from '{column}'")

    save_dataframe(dataset_id, df)

    return {
        "dataset_id": dataset_id,
        "rows_before": rows_before,
        "rows_after": len(df),
        "columns_affected": list(columns_affected),
        "actions_applied": actions_applied,
        "message": f"Applied {len(actions_applied)} cleaning actions",
    }


def _suggest_fill_strategy(series: pd.Series) -> str:
    if pd.api.types.is_numeric_dtype(series):
        if series.skew() > 1 or series.skew() < -1:
            return "fill_median"
        return "fill_mean"
    return "fill_mode"
