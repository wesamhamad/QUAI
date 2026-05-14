from fastapi import APIRouter, HTTPException
from models.schemas import CleaningPreview, CleanActionRequest, CleanApplyResponse
from services import duckdb_service, cleaner_service

router = APIRouter(prefix="/api/clean", tags=["clean"])


@router.post("/{dataset_id}", response_model=CleaningPreview)
async def detect_cleaning_issues(dataset_id: str):
    if not duckdb_service.dataset_exists(dataset_id):
        raise HTTPException(status_code=404, detail=f"Dataset '{dataset_id}' not found")

    try:
        result = cleaner_service.detect_issues(dataset_id)
        return CleaningPreview(**result)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Issue detection failed: {str(e)}")


@router.post("/{dataset_id}/apply", response_model=CleanApplyResponse)
async def apply_cleaning(dataset_id: str, request: CleanActionRequest):
    if not duckdb_service.dataset_exists(dataset_id):
        raise HTTPException(status_code=404, detail=f"Dataset '{dataset_id}' not found")

    try:
        result = cleaner_service.apply_cleaning(dataset_id, request.actions)
        return CleanApplyResponse(**result)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Cleaning failed: {str(e)}")
