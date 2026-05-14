from typing import Optional, List, Dict
import pandas as pd
import numpy as np
from services.duckdb_service import get_dataframe, get_table_info


def profile_dataset(dataset_id: str) -> dict:
    df = get_dataframe(dataset_id)
    table_info = get_table_info(dataset_id)

    columns_profile = []
    for col in df.columns:
        col_data = df[col]
        profile = {
            "name": col,
            "dtype": str(col_data.dtype),
            "missing_count": int(col_data.isna().sum()),
            "missing_percent": round(float(col_data.isna().mean() * 100), 2),
            "unique_count": int(col_data.nunique()),
            "sample_values": [
                _serialize_value(v)
                for v in col_data.dropna().head(5).tolist()
            ],
        }

        if pd.api.types.is_numeric_dtype(col_data):
            desc = col_data.describe()
            profile["statistics"] = {
                "mean": _safe_float(desc.get("mean")),
                "std": _safe_float(desc.get("std")),
                "min": _safe_float(desc.get("min")),
                "max": _safe_float(desc.get("max")),
                "median": _safe_float(col_data.median()),
                "q25": _safe_float(desc.get("25%")),
                "q75": _safe_float(desc.get("75%")),
            }
            profile["distribution"] = _get_numeric_distribution(col_data)
        elif pd.api.types.is_string_dtype(col_data) or pd.api.types.is_categorical_dtype(col_data):
            value_counts = col_data.value_counts().head(10)
            profile["top_values"] = {
                str(k): int(v) for k, v in value_counts.items()
            }

        columns_profile.append(profile)

    missing_values = {
        col: int(df[col].isna().sum())
        for col in df.columns
        if df[col].isna().sum() > 0
    }

    duplicate_count = int(df.duplicated().sum())

    correlations = _compute_correlations(df)

    statistics = {
        "total_cells": int(df.size),
        "total_missing": int(df.isna().sum().sum()),
        "missing_percent": round(float(df.isna().sum().sum() / df.size * 100), 2),
        "memory_usage_mb": round(float(df.memory_usage(deep=True).sum() / 1024 / 1024), 2),
    }

    return {
        "dataset_id": dataset_id,
        "row_count": table_info["row_count"],
        "column_count": len(df.columns),
        "columns": columns_profile,
        "missing_values": missing_values,
        "duplicates": duplicate_count,
        "correlations": correlations,
        "statistics": statistics,
    }


def _safe_float(value) -> Optional[float]:
    if value is None or (isinstance(value, float) and np.isnan(value)):
        return None
    return round(float(value), 4)


def _serialize_value(value):
    if isinstance(value, (np.integer,)):
        return int(value)
    if isinstance(value, (np.floating,)):
        return float(value)
    if isinstance(value, (np.bool_,)):
        return bool(value)
    if pd.isna(value):
        return None
    return str(value)


def _get_numeric_distribution(series: pd.Series) -> dict:
    clean = series.dropna()
    if len(clean) == 0:
        return {}
    try:
        hist, bin_edges = np.histogram(clean, bins=min(20, len(clean.unique())))
        return {
            "histogram": {
                "counts": [int(c) for c in hist],
                "bin_edges": [round(float(b), 4) for b in bin_edges],
            }
        }
    except Exception:
        return {}


def _compute_correlations(df: pd.DataFrame) -> Optional[dict]:
    numeric_cols = df.select_dtypes(include=[np.number]).columns.tolist()
    if len(numeric_cols) < 2:
        return None

    corr = df[numeric_cols].corr()
    return {
        "columns": numeric_cols,
        "matrix": [
            [_safe_float(corr.iloc[i, j]) for j in range(len(numeric_cols))]
            for i in range(len(numeric_cols))
        ],
    }
