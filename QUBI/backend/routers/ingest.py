import os
import tempfile
import shutil
from fastapi import APIRouter, UploadFile, File, HTTPException
from pydantic import BaseModel
from typing import Optional, List
from models.schemas import (
    DBConnectionRequest,
    DBConnectionResponse,
    UploadResponse,
)
from services import duckdb_service

router = APIRouter(prefix="/api/ingest", tags=["ingest"])

UPLOAD_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "uploads")
os.makedirs(UPLOAD_DIR, exist_ok=True)

ALLOWED_EXTENSIONS = {".csv", ".xlsx", ".xls", ".json", ".parquet"}


def _build_conn_str(request: DBConnectionRequest) -> str:
    if request.db_type == "postgresql":
        return f"postgresql://{request.username}:{request.password}@{request.host}:{request.port}/{request.database}"
    elif request.db_type == "mysql":
        return f"mysql+pymysql://{request.username}:{request.password}@{request.host}:{request.port}/{request.database}"
    elif request.db_type == "sqlite":
        return f"sqlite:///{request.database}"
    elif request.db_type == "sqlserver":
        return f"mssql+pymssql://{request.username}:{request.password}@{request.host}:{request.port}/{request.database}"
    elif request.db_type == "oracle":
        return f"oracle+cx_oracle://{request.username}:{request.password}@{request.host}:{request.port}/{request.database}"
    else:
        raise HTTPException(status_code=400, detail=f"Unsupported database type: {request.db_type}")


@router.post("/upload", response_model=UploadResponse)
async def upload_file(file: UploadFile = File(...)):
    ext = os.path.splitext(file.filename)[1].lower()
    if ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported file type: {ext}. Allowed: {', '.join(ALLOWED_EXTENSIONS)}",
        )

    tmp_path = os.path.join(UPLOAD_DIR, file.filename)
    try:
        with open(tmp_path, "wb") as f:
            shutil.copyfileobj(file.file, f)

        result = duckdb_service.create_dataset_from_file(tmp_path, file.filename)

        return UploadResponse(
            dataset_id=result["dataset_id"],
            filename=result["filename"],
            rows=result["rows"],
            columns=result["columns"],
            column_names=result["column_names"],
            message=f"Successfully uploaded {file.filename} ({result['rows']} rows, {result['columns']} columns)",
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        if os.path.exists(tmp_path):
            os.remove(tmp_path)


@router.post("/connect", response_model=DBConnectionResponse)
async def connect_database(request: DBConnectionRequest):
    try:
        conn_str = _build_conn_str(request)
        tables = duckdb_service.list_tables_from_connection(conn_str)

        dataset_id = None
        if request.table_name:
            if request.table_name not in tables:
                raise HTTPException(
                    status_code=404,
                    detail=f"Table '{request.table_name}' not found.",
                )
            result = duckdb_service.create_dataset_from_db(conn_str, request.table_name)
            dataset_id = result["dataset_id"]

        return DBConnectionResponse(
            dataset_id=dataset_id or "",
            tables=tables,
            message=f"Connected successfully. Found {len(tables)} tables.",
        )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Connection failed: {str(e)}")


class SchemaDiscoveryRequest(BaseModel):
    db_type: str
    host: str = ""
    port: int = 0
    database: str = ""
    username: str = ""
    password: str = ""


class TableInfo(BaseModel):
    name: str
    row_count: int
    column_count: int
    columns: List[str]
    has_relationships: bool = False
    related_tables: List[str] = []
    ai_recommended: bool = False
    recommendation_reason: str = ""


class SchemaDiscoveryResponse(BaseModel):
    tables: List[TableInfo]
    recommended_tables: List[str]
    total_tables: int
    message: str


@router.post("/discover", response_model=SchemaDiscoveryResponse)
async def discover_schema(request: SchemaDiscoveryRequest):
    """Discover database schema: tables, row counts, relationships, and AI recommendations."""
    try:
        conn_req = DBConnectionRequest(
            db_type=request.db_type,
            host=request.host,
            port=request.port,
            database=request.database,
            username=request.username,
            password=request.password,
        )
        conn_str = _build_conn_str(conn_req)
        table_infos = duckdb_service.discover_schema(conn_str)

        # AI logic: recommend tables with most data and relationships
        recommended = _recommend_tables(table_infos)

        result_tables = []
        recommended_names = [r["name"] for r in recommended]

        for t in table_infos:
            is_recommended = t["name"] in recommended_names
            reason = ""
            if is_recommended:
                match = next((r for r in recommended if r["name"] == t["name"]), None)
                reason = match.get("reason", "") if match else ""

            result_tables.append(TableInfo(
                name=t["name"],
                row_count=t["row_count"],
                column_count=t["column_count"],
                columns=t["columns"],
                has_relationships=len(t.get("foreign_keys", [])) > 0,
                related_tables=t.get("related_tables", []),
                ai_recommended=is_recommended,
                recommendation_reason=reason,
            ))

        # Sort: recommended first, then by row count
        result_tables.sort(key=lambda x: (not x.ai_recommended, -x.row_count))

        return SchemaDiscoveryResponse(
            tables=result_tables,
            recommended_tables=recommended_names,
            total_tables=len(result_tables),
            message=f"Discovered {len(result_tables)} tables. {len(recommended_names)} recommended for analysis.",
        )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Schema discovery failed: {str(e)}")


def _recommend_tables(table_infos: list) -> list:
    """AI-based table recommendation logic."""
    recommended = []

    # Skip system/framework tables
    skip_patterns = [
        "migration", "session", "cache", "job", "failed_job",
        "password_reset", "personal_access", "oauth", "telescope",
        "admin_menu", "admin_operation_log", "admin_permissions",
        "admin_role_menu", "admin_role_permissions",
    ]

    for t in table_infos:
        name = t["name"].lower()

        # Skip empty tables
        if t["row_count"] == 0:
            continue

        # Skip system tables
        if any(pat in name for pat in skip_patterns):
            continue

        # Skip tables with very few columns (likely pivot tables)
        if t["column_count"] <= 2 and t["row_count"] < 10:
            continue

        score = 0
        reasons = []

        # High row count = valuable data
        if t["row_count"] >= 100:
            score += 3
            reasons.append(f"{t['row_count']:,} records")
        elif t["row_count"] >= 10:
            score += 1

        # Many columns = rich data
        if t["column_count"] >= 8:
            score += 2
            reasons.append(f"{t['column_count']} columns of data")
        elif t["column_count"] >= 5:
            score += 1

        # Tables with relationships are central entities
        if len(t.get("foreign_keys", [])) > 0:
            score += 2
            reasons.append("has relationships")

        # Domain-relevant table names get bonus
        important_names = [
            "user", "student", "faculty", "employee", "staff",
            "research", "publication", "course", "department",
            "complaint", "task", "order", "product", "customer",
            "transaction", "payment", "review", "rating",
            "qualification", "certificate", "event", "project",
        ]
        for imp in important_names:
            if imp in name:
                score += 3
                reasons.append(f"key entity ({imp})")
                break

        if score >= 3:
            recommended.append({
                "name": t["name"],
                "score": score,
                "reason": "; ".join(reasons),
            })

    # Sort by score and take top 8
    recommended.sort(key=lambda x: -x["score"])
    return recommended[:8]


class MultiTableImportRequest(BaseModel):
    db_type: str
    host: str = ""
    port: int = 0
    database: str = ""
    username: str = ""
    password: str = ""
    tables: List[str]


class MultiTableImportResponse(BaseModel):
    dataset_id: str
    tables_imported: List[str]
    total_rows: int
    total_columns: int
    message: str


@router.post("/import-tables", response_model=MultiTableImportResponse)
async def import_multiple_tables(request: MultiTableImportRequest):
    """Import multiple tables into a single dataset, joining where possible."""
    if not request.tables:
        raise HTTPException(status_code=400, detail="No tables specified")

    try:
        conn_req = DBConnectionRequest(
            db_type=request.db_type,
            host=request.host,
            port=request.port,
            database=request.database,
            username=request.username,
            password=request.password,
        )
        conn_str = _build_conn_str(conn_req)

        result = duckdb_service.create_dataset_from_multi_tables(conn_str, request.tables)

        return MultiTableImportResponse(
            dataset_id=result["dataset_id"],
            tables_imported=result["tables_imported"],
            total_rows=result["total_rows"],
            total_columns=result["total_columns"],
            message=f"Imported {len(result['tables_imported'])} tables ({result['total_rows']:,} total rows, {result['total_columns']} columns).",
        )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Import failed: {str(e)}")
