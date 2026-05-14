"""
QUAI Python Executor - Sandboxed Python code execution service.
Runs user-submitted Python code in an isolated environment with strict security limits.
"""

import os
import subprocess
import tempfile
import time
from typing import Optional

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field

app = FastAPI(title="QUAI Python Executor", version="1.0.0")

# Maximum allowed output sizes
MAX_STDOUT = 50000  # 50KB
MAX_STDERR = 10000  # 10KB


class ExecuteRequest(BaseModel):
    code: str = Field(..., min_length=1, max_length=100000)
    timeout: int = Field(default=10, ge=1, le=30)
    max_memory_mb: int = Field(default=128, ge=32, le=256)


class ExecuteResponse(BaseModel):
    stdout: str
    stderr: str
    exit_code: int
    timed_out: bool
    execution_time_ms: float


# Modules that are blocked for security reasons
BLOCKED_IMPORTS = [
    "os",
    "subprocess",
    "socket",
    "shutil",
    "sys",
    "ctypes",
    "signal",
    "multiprocessing",
    "threading",
    "http",
    "urllib",
    "requests",
    "ftplib",
    "smtplib",
    "pickle",
    "shelve",
    "importlib",
    "code",
    "codeop",
    "webbrowser",
    "pathlib",
]

# Dangerous built-in functions
BLOCKED_PATTERNS = [
    "exec(",
    "eval(",
    "__import__(",
    "compile(",
    "globals(",
    "setattr(",
    "delattr(",
    "getattr(",
]


def validate_code(code: str) -> None:
    """Validate that the code doesn't contain dangerous imports or functions."""
    for module in BLOCKED_IMPORTS:
        if f"import {module}" in code or f"from {module}" in code:
            raise HTTPException(
                status_code=422,
                detail=f"Import of '{module}' is blocked for security reasons.",
            )

    for pattern in BLOCKED_PATTERNS:
        if pattern in code:
            func_name = pattern.rstrip("(")
            raise HTTPException(
                status_code=422,
                detail=f"'{func_name}' is not allowed for security reasons.",
            )


@app.post("/execute", response_model=ExecuteResponse)
async def execute(req: ExecuteRequest):
    """Execute Python code in a sandboxed environment."""
    validate_code(req.code)

    # Write code to a temporary file
    with tempfile.NamedTemporaryFile(
        mode="w", suffix=".py", delete=False, dir="/tmp"
    ) as f:
        f.write(req.code)
        tmp_path = f.name

    start_time = time.monotonic()

    try:
        result = subprocess.run(
            ["python3", tmp_path],
            capture_output=True,
            text=True,
            timeout=req.timeout,
            cwd="/tmp",
            env={"PATH": "/usr/bin:/usr/local/bin", "HOME": "/tmp", "LANG": "C.UTF-8"},
        )

        execution_time_ms = (time.monotonic() - start_time) * 1000

        return ExecuteResponse(
            stdout=result.stdout[:MAX_STDOUT],
            stderr=result.stderr[:MAX_STDERR],
            exit_code=result.returncode,
            timed_out=False,
            execution_time_ms=round(execution_time_ms, 2),
        )

    except subprocess.TimeoutExpired:
        execution_time_ms = (time.monotonic() - start_time) * 1000
        return ExecuteResponse(
            stdout="",
            stderr=f"Execution timed out after {req.timeout} seconds.",
            exit_code=-1,
            timed_out=True,
            execution_time_ms=round(execution_time_ms, 2),
        )

    except Exception as e:
        execution_time_ms = (time.monotonic() - start_time) * 1000
        return ExecuteResponse(
            stdout="",
            stderr=f"Execution error: {str(e)}",
            exit_code=-1,
            timed_out=False,
            execution_time_ms=round(execution_time_ms, 2),
        )

    finally:
        # Clean up temporary file
        try:
            os.unlink(tmp_path)
        except OSError:
            pass


@app.get("/health")
async def health():
    """Health check endpoint."""
    return {"status": "healthy", "version": "1.0.0", "service": "python-executor"}
