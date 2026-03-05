"""
schemas/log_schemas.py - Pydantic models for API request/response validation
"""

from pydantic import BaseModel, Field
from typing import Optional, List, Any
from datetime import datetime


# ─── Upload Response ────────────────────────────────────────────────────────

class UploadResponse(BaseModel):
    message: str
    batch_id: str
    total_records: int
    threats_detected: int
    normal_count: int
    suspicious_count: int
    ddos_count: int
    phishing_count: int


# ─── Network Log ────────────────────────────────────────────────────────────

class NetworkLogBase(BaseModel):
    timestamp: Optional[datetime] = None
    source_ip: str
    destination_ip: str
    protocol: str
    packet_count: Optional[int] = None
    request_rate: Optional[float] = None
    failed_login_attempts: Optional[int] = 0
    bytes_transferred: Optional[float] = None
    port: Optional[int] = None
    duration_seconds: Optional[float] = None


class NetworkLogOut(NetworkLogBase):
    id: int
    upload_batch_id: str
    created_at: datetime

    class Config:
        from_attributes = True


# ─── Threat Result ───────────────────────────────────────────────────────────

class ThreatResultOut(BaseModel):
    id: int
    network_log_id: int
    anomaly_score: Optional[float]
    classification: str
    is_threat: bool
    recommendations: Optional[List[str]]
    detected_at: datetime

    class Config:
        from_attributes = True


class PredictionRecord(BaseModel):
    """Used in the upload response detail list."""
    source_ip: str
    destination_ip: str
    protocol: str
    packet_count: Optional[int]
    request_rate: Optional[float]
    failed_login_attempts: Optional[int]
    anomaly_score: float
    classification: str
    is_threat: bool
    recommendations: List[str]


# ─── Threat Summary ─────────────────────────────────────────────────────────

class ThreatSummaryResponse(BaseModel):
    total_logs_analyzed: int
    total_threats: int
    normal: int
    suspicious: int
    possible_ddos: int
    possible_phishing: int
    threat_percentage: float
    last_updated: Optional[datetime]


# ─── Suspicious IPs ──────────────────────────────────────────────────────────

class SuspiciousIPRecord(BaseModel):
    source_ip: str
    threat_count: int
    classifications: List[str]
    latest_seen: Optional[datetime]


class SuspiciousIPsResponse(BaseModel):
    top_suspicious_ips: List[SuspiciousIPRecord]


# ─── Traffic Patterns ────────────────────────────────────────────────────────

class TrafficDataPoint(BaseModel):
    label: str
    value: Any


class TrafficPatternsResponse(BaseModel):
    protocol_distribution: List[TrafficDataPoint]
    hourly_request_rate: List[TrafficDataPoint]
    top_destination_ips: List[TrafficDataPoint]
    avg_packet_count_by_protocol: List[TrafficDataPoint]


# ─── Chatbot ─────────────────────────────────────────────────────────────────

class ChatbotQueryRequest(BaseModel):
    question: str = Field(..., min_length=3, max_length=500)


class ChatbotQueryResponse(BaseModel):
    question: str
    answer: str
    intent: Optional[str]
    data: Optional[Any] = None
