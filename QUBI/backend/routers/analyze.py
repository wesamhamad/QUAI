import json
import os
from datetime import datetime
from pathlib import Path
from fastapi import APIRouter, HTTPException
from models.schemas import (
    AnalyzeRequest,
    AnalyzeResponse,
    QueryRequest,
    QueryResponse,
    DashboardConfigResponse,
    SavedDashboard,
)
from services import duckdb_service, ai_service

router = APIRouter(prefix="/api", tags=["analyze"])

DASHBOARDS_DIR = Path(__file__).parent.parent / "data" / "dashboards"
DASHBOARDS_DIR.mkdir(parents=True, exist_ok=True)


def _save_dashboard(dataset_id: str, config: dict):
    """Persist dashboard config to disk."""
    meta = {
        "id": dataset_id,
        "dataset_id": dataset_id,
        "title": config.get("title", ""),
        "created_at": datetime.now().isoformat(),
        "record_count": len(config.get("table_data", [])),
        "chart_count": len(config.get("charts", [])),
        "kpi_count": len(config.get("kpis", [])),
        "table_names": config.get("_table_names", []),
    }
    # Save full config
    config_path = DASHBOARDS_DIR / f"{dataset_id}.json"
    with open(config_path, "w", encoding="utf-8") as f:
        json.dump(config, f, ensure_ascii=False, default=str)
    # Save metadata index
    meta_path = DASHBOARDS_DIR / f"{dataset_id}.meta.json"
    with open(meta_path, "w", encoding="utf-8") as f:
        json.dump(meta, f, ensure_ascii=False, default=str)


@router.post("/analyze/{dataset_id}", response_model=AnalyzeResponse)
async def analyze_dataset(dataset_id: str, request: AnalyzeRequest = None):
    if not duckdb_service.dataset_exists(dataset_id):
        raise HTTPException(status_code=404, detail=f"Dataset '{dataset_id}' not found")
    try:
        result = ai_service.auto_analyze(dataset_id)
        return AnalyzeResponse(**result)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Analysis failed: {str(e)}")


@router.post("/analyze/{dataset_id}/query", response_model=QueryResponse)
async def query_dataset(dataset_id: str, request: QueryRequest):
    if not duckdb_service.dataset_exists(dataset_id):
        raise HTTPException(status_code=404, detail=f"Dataset '{dataset_id}' not found")
    try:
        result = ai_service.natural_language_query(dataset_id, request.query)
        return QueryResponse(**result)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Query failed: {str(e)}")


@router.get("/dashboard/{dataset_id}/config", response_model=DashboardConfigResponse)
async def get_dashboard_config(dataset_id: str):
    # Try loading saved config first
    config_path = DASHBOARDS_DIR / f"{dataset_id}.json"
    if config_path.exists():
        try:
            with open(config_path, "r", encoding="utf-8") as f:
                saved = json.load(f)
            return DashboardConfigResponse(**saved)
        except Exception:
            pass

    if not duckdb_service.dataset_exists(dataset_id):
        raise HTTPException(status_code=404, detail=f"Dataset '{dataset_id}' not found")

    try:
        result = ai_service.get_dashboard_config(dataset_id)
        # Auto-save on first generation
        _save_dashboard(dataset_id, result)
        return DashboardConfigResponse(**result)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Dashboard config generation failed: {str(e)}")


@router.get("/dashboards", response_model=list[SavedDashboard])
async def list_dashboards():
    """List all saved dashboards."""
    dashboards = []
    for meta_file in DASHBOARDS_DIR.glob("*.meta.json"):
        try:
            with open(meta_file, "r", encoding="utf-8") as f:
                meta = json.load(f)
            dashboards.append(SavedDashboard(**meta))
        except Exception:
            continue
    dashboards.sort(key=lambda d: d.created_at, reverse=True)
    return dashboards


@router.delete("/dashboard/{dataset_id}")
async def delete_dashboard(dataset_id: str):
    """Delete a saved dashboard."""
    config_path = DASHBOARDS_DIR / f"{dataset_id}.json"
    meta_path = DASHBOARDS_DIR / f"{dataset_id}.meta.json"
    deleted = False
    if config_path.exists():
        os.remove(config_path)
        deleted = True
    if meta_path.exists():
        os.remove(meta_path)
        deleted = True
    if not deleted:
        raise HTTPException(status_code=404, detail="Dashboard not found")
    return {"message": "تم حذف لوحة البيانات"}
