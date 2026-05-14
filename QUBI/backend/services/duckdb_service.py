from typing import Dict, List
import duckdb
import pandas as pd
import json
import uuid
import os
from pathlib import Path

DATA_DIR = Path(__file__).parent.parent / "data"
DATA_DIR.mkdir(exist_ok=True)

_datasets: Dict[str, dict] = {}


def _get_db_path(dataset_id: str) -> str:
    return str(DATA_DIR / f"{dataset_id}.duckdb")


def _get_connection(dataset_id: str) -> duckdb.DuckDBPyConnection:
    return duckdb.connect(_get_db_path(dataset_id))


def create_dataset_from_file(file_path: str, filename: str) -> dict:
    dataset_id = str(uuid.uuid4())
    ext = Path(filename).suffix.lower()
    conn = _get_connection(dataset_id)
    try:
        if ext == ".csv":
            conn.execute(f"CREATE TABLE main_data AS SELECT * FROM read_csv_auto('{file_path}')")
        elif ext in (".xlsx", ".xls"):
            df = pd.read_excel(file_path, engine="openpyxl")
            conn.execute("CREATE TABLE main_data AS SELECT * FROM df")
        elif ext == ".json":
            df = pd.read_json(file_path)
            conn.execute("CREATE TABLE main_data AS SELECT * FROM df")
        elif ext == ".parquet":
            conn.execute(f"CREATE TABLE main_data AS SELECT * FROM read_parquet('{file_path}')")
        else:
            raise ValueError(f"Unsupported format: {ext}")

        row_count = conn.execute("SELECT COUNT(*) FROM main_data").fetchone()[0]
        columns = [c[0] for c in conn.execute(
            "SELECT column_name FROM information_schema.columns WHERE table_name = 'main_data'"
        ).fetchall()]

        _datasets[dataset_id] = {"table_name": "main_data", "tables": ["main_data"], "db_path": _get_db_path(dataset_id)}
        return {"dataset_id": dataset_id, "filename": filename, "rows": row_count, "columns": len(columns), "column_names": columns}
    finally:
        conn.close()


def create_dataset_from_db(connection_string: str, table_name: str) -> dict:
    from sqlalchemy import create_engine
    dataset_id = str(uuid.uuid4())
    conn = _get_connection(dataset_id)
    try:
        engine = create_engine(connection_string)
        df = pd.read_sql_table(table_name, engine)
        engine.dispose()
        conn.execute("CREATE TABLE main_data AS SELECT * FROM df")
        row_count = conn.execute("SELECT COUNT(*) FROM main_data").fetchone()[0]
        columns = [c[0] for c in conn.execute(
            "SELECT column_name FROM information_schema.columns WHERE table_name = 'main_data'"
        ).fetchall()]
        _datasets[dataset_id] = {"table_name": "main_data", "tables": [table_name], "db_path": _get_db_path(dataset_id)}
        return {"dataset_id": dataset_id, "rows": row_count, "columns": len(columns), "column_names": columns}
    finally:
        conn.close()


def create_dataset_from_multi_tables(connection_string: str, table_names: List[str]) -> dict:
    """Import multiple tables — store each as its own DuckDB table, pick the best as main_data."""
    from sqlalchemy import create_engine
    dataset_id = str(uuid.uuid4())
    conn = _get_connection(dataset_id)
    engine = create_engine(connection_string)

    imported = []
    table_stats = []  # (name, rows, cols) to pick best main_data

    try:
        for tbl in table_names:
            try:
                df = pd.read_sql_table(tbl, engine)
                if len(df) == 0:
                    continue
                safe = tbl.replace("-", "_").replace(" ", "_")
                conn.execute(f'CREATE TABLE "tbl_{safe}" AS SELECT * FROM df')
                imported.append(tbl)
                table_stats.append((tbl, safe, len(df), len(df.columns)))
            except Exception:
                continue

        engine.dispose()

        if not imported:
            raise ValueError("No tables could be imported")

        # Pick the most meaningful table as main_data:
        # Score = rows × log(columns) — favors tables with both data and structure
        import math
        best = max(table_stats, key=lambda t: t[2] * math.log(max(t[3], 2)))
        conn.execute(f'CREATE TABLE main_data AS SELECT * FROM "tbl_{best[1]}"')

        total_rows = sum(t[2] for t in table_stats)
        total_cols = sum(t[3] for t in table_stats)

        _datasets[dataset_id] = {
            "table_name": "main_data",
            "tables": imported,
            "table_map": {t[0]: f"tbl_{t[1]}" for t in table_stats},
            "db_path": _get_db_path(dataset_id),
        }

        return {
            "dataset_id": dataset_id,
            "tables_imported": imported,
            "total_rows": total_rows,
            "total_columns": total_cols,
        }
    finally:
        conn.close()


def get_dataframe(dataset_id: str, table_name: str = "main_data") -> pd.DataFrame:
    conn = _get_connection(dataset_id)
    try:
        return conn.execute(f'SELECT * FROM "{table_name}"').fetchdf()
    finally:
        conn.close()


def list_dataset_tables(dataset_id: str) -> List[str]:
    """List all user tables in this dataset's DuckDB file."""
    conn = _get_connection(dataset_id)
    try:
        tables = conn.execute(
            "SELECT table_name FROM information_schema.tables WHERE table_schema = 'main'"
        ).fetchall()
        return [t[0] for t in tables]
    finally:
        conn.close()


def execute_query(dataset_id: str, query: str) -> List[dict]:
    conn = _get_connection(dataset_id)
    try:
        return conn.execute(query).fetchdf().to_dict(orient="records")
    finally:
        conn.close()


def save_dataframe(dataset_id: str, df: pd.DataFrame) -> None:
    conn = _get_connection(dataset_id)
    try:
        conn.execute("DROP TABLE IF EXISTS main_data")
        conn.execute("CREATE TABLE main_data AS SELECT * FROM df")
    finally:
        conn.close()


def get_table_info(dataset_id: str) -> dict:
    conn = _get_connection(dataset_id)
    try:
        columns = conn.execute(
            "SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'main_data'"
        ).fetchall()
        row_count = conn.execute("SELECT COUNT(*) FROM main_data").fetchone()[0]
        return {"row_count": row_count, "columns": [{"name": c[0], "type": c[1]} for c in columns]}
    finally:
        conn.close()


def list_tables_from_connection(connection_string: str) -> List[str]:
    from sqlalchemy import create_engine, inspect
    engine = create_engine(connection_string)
    inspector = inspect(engine)
    tables = inspector.get_table_names()
    engine.dispose()
    return tables


def discover_schema(connection_string: str) -> List[dict]:
    from sqlalchemy import create_engine, inspect, text
    engine = create_engine(connection_string)
    inspector = inspect(engine)
    tables = inspector.get_table_names()
    result = []
    for tbl in tables:
        try:
            cols = [c["name"] for c in inspector.get_columns(tbl)]
            try:
                with engine.connect() as c:
                    row_count = c.execute(text(f"SELECT COUNT(*) FROM `{tbl}`")).scalar()
            except Exception:
                try:
                    with engine.connect() as c:
                        row_count = c.execute(text(f'SELECT COUNT(*) FROM "{tbl}"')).scalar()
                except Exception:
                    row_count = 0

            fks, related = [], []
            try:
                for fk in inspector.get_foreign_keys(tbl):
                    ref = fk.get("referred_table", "")
                    if ref and ref in tables:
                        fks.append(fk)
                        if ref not in related:
                            related.append(ref)
            except Exception:
                pass

            result.append({"name": tbl, "row_count": row_count or 0, "column_count": len(cols),
                           "columns": cols, "foreign_keys": fks, "related_tables": related})
        except Exception:
            continue
    engine.dispose()
    return result


def dataset_exists(dataset_id: str) -> bool:
    return os.path.exists(_get_db_path(dataset_id))
