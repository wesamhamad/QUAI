from fastapi import APIRouter, HTTPException
from models.schemas import ProfileResponse
from services import duckdb_service, profiler_service

router = APIRouter(prefix="/api/profile", tags=["profile"])


@router.get("/{dataset_id}", response_model=ProfileResponse)
async def profile_dataset(dataset_id: str):
    if not duckdb_service.dataset_exists(dataset_id):
        raise HTTPException(status_code=404, detail=f"Dataset '{dataset_id}' not found")

    try:
        result = profiler_service.profile_dataset(dataset_id)
        return ProfileResponse(**result)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Profiling failed: {str(e)}")
