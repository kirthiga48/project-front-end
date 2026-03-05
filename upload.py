"""
routes/upload.py - /upload-logs endpoint
"""

from fastapi import APIRouter, UploadFile, File, Depends, HTTPException
from sqlalchemy.orm import Session

from database.db import get_db
from services.log_service import save_uploaded_file, process_log_file
from schemas.log_schemas import UploadResponse

router = APIRouter(prefix="/api", tags=["Upload"])


@router.post("/upload-logs", response_model=UploadResponse, summary="Upload a CSV network traffic log file")
async def upload_logs(
    file: UploadFile = File(..., description="CSV network traffic log file"),
    db: Session = Depends(get_db),
):
    """
    Accept a CSV file, run ML anomaly detection, persist results, and
    return a summary of detected threats.
    """
    file_path, batch_id = await save_uploaded_file(file)

    try:
        result = process_log_file(file_path, batch_id, db)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Processing failed: {str(e)}")

    return UploadResponse(
        message="Log file processed successfully.",
        batch_id=result["batch_id"],
        total_records=result["total_records"],
        threats_detected=result["threats_detected"],
        normal_count=result["normal_count"],
        suspicious_count=result["suspicious_count"],
        ddos_count=result["ddos_count"],
        phishing_count=result["phishing_count"],
    )
