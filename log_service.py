"""
services/log_service.py
Handles CSV parsing, preprocessing, ML inference, and DB persistence.
"""

import uuid
import os
import pandas as pd
from fastapi import UploadFile, HTTPException
from sqlalchemy.orm import Session
from typing import List, Dict, Any

from database.models import NetworkLog, ThreatResult
from ml_model.anomaly_detector import detect_anomalies

UPLOAD_DIR = os.getenv("UPLOAD_DIR", "uploads")
MAX_FILE_SIZE_MB = 50


def _ensure_upload_dir():
    os.makedirs(UPLOAD_DIR, exist_ok=True)


async def save_uploaded_file(file: UploadFile) -> str:
    """Save the uploaded file to disk and return the saved path."""
    _ensure_upload_dir()

    if not file.filename.endswith(".csv"):
        raise HTTPException(status_code=400, detail="Only CSV files are accepted.")

    contents = await file.read()
    size_mb = len(contents) / (1024 * 1024)
    if size_mb > MAX_FILE_SIZE_MB:
        raise HTTPException(status_code=413, detail=f"File exceeds {MAX_FILE_SIZE_MB} MB limit.")

    batch_id = str(uuid.uuid4())
    save_path = os.path.join(UPLOAD_DIR, f"{batch_id}.csv")
    with open(save_path, "wb") as f:
        f.write(contents)

    return save_path, batch_id


def _parse_csv(path: str) -> pd.DataFrame:
    """Read CSV and validate required columns."""
    try:
        df = pd.read_csv(path)
    except Exception as e:
        raise HTTPException(status_code=422, detail=f"Could not parse CSV: {e}")

    df.columns = [c.strip().lower().replace(" ", "_") for c in df.columns]

    required = {"source_ip", "destination_ip", "protocol"}
    missing = required - set(df.columns)
    if missing:
        raise HTTPException(
            status_code=422,
            detail=f"CSV is missing required columns: {missing}",
        )

    if df.empty:
        raise HTTPException(status_code=422, detail="Uploaded CSV contains no data rows.")

    return df


def _row_to_model(row: pd.Series, batch_id: str) -> NetworkLog:
    """Convert a DataFrame row to a NetworkLog ORM object."""
    def safe_float(val):
        try:
            return float(val) if pd.notna(val) else None
        except Exception:
            return None

    def safe_int(val):
        try:
            return int(val) if pd.notna(val) else None
        except Exception:
            return None

    timestamp = None
    if "timestamp" in row and pd.notna(row["timestamp"]):
        try:
            timestamp = pd.to_datetime(row["timestamp"])
        except Exception:
            pass

    return NetworkLog(
        upload_batch_id=batch_id,
        timestamp=timestamp,
        source_ip=str(row.get("source_ip", "")).strip(),
        destination_ip=str(row.get("destination_ip", "")).strip(),
        protocol=str(row.get("protocol", "UNKNOWN")).strip().upper(),
        packet_count=safe_int(row.get("packet_count")),
        request_rate=safe_float(row.get("request_rate")),
        failed_login_attempts=safe_int(row.get("failed_login_attempts")) or 0,
        bytes_transferred=safe_float(row.get("bytes_transferred")),
        port=safe_int(row.get("port")),
        duration_seconds=safe_float(row.get("duration_seconds")),
    )


def process_log_file(file_path: str, batch_id: str, db: Session) -> Dict[str, Any]:
    """
    Full pipeline:
    1. Parse CSV
    2. Run ML anomaly detection
    3. Persist NetworkLog + ThreatResult rows
    4. Return summary statistics
    """
    df = _parse_csv(file_path)
    predictions = detect_anomalies(df)

    counts = {"Normal": 0, "Suspicious": 0, "Possible DDoS Attack": 0, "Possible Phishing Activity": 0}

    log_objects = []
    for idx, row in df.iterrows():
        log_obj = _row_to_model(row, batch_id)
        log_objects.append(log_obj)

    db.add_all(log_objects)
    db.flush()  # Get IDs assigned

    threat_objects = []
    for log_obj, pred in zip(log_objects, predictions):
        classification = pred["classification"]
        counts[classification] = counts.get(classification, 0) + 1

        threat = ThreatResult(
            network_log_id=log_obj.id,
            upload_batch_id=batch_id,
            anomaly_score=pred["anomaly_score"],
            classification=classification,
            is_threat=pred["is_threat"],
            recommendations=pred["recommendations"],
        )
        threat_objects.append(threat)

    db.add_all(threat_objects)
    db.commit()

    total = len(log_objects)
    threats = total - counts.get("Normal", 0)

    return {
        "batch_id": batch_id,
        "total_records": total,
        "threats_detected": threats,
        "normal_count": counts.get("Normal", 0),
        "suspicious_count": counts.get("Suspicious", 0),
        "ddos_count": counts.get("Possible DDoS Attack", 0),
        "phishing_count": counts.get("Possible Phishing Activity", 0),
        "predictions": [
            {
                "source_ip": str(df.iloc[i].get("source_ip", "")),
                "destination_ip": str(df.iloc[i].get("destination_ip", "")),
                "protocol": str(df.iloc[i].get("protocol", "")),
                "packet_count": df.iloc[i].get("packet_count"),
                "request_rate": df.iloc[i].get("request_rate"),
                "failed_login_attempts": df.iloc[i].get("failed_login_attempts"),
                **predictions[i],
            }
            for i in range(total)
        ],
    }
