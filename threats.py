"""
routes/threats.py - Threat analysis endpoints
"""

from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from database.db import get_db
from services.threat_service import get_threat_summary, get_suspicious_ips, get_traffic_patterns
from schemas.log_schemas import ThreatSummaryResponse, SuspiciousIPsResponse, TrafficPatternsResponse

router = APIRouter(prefix="/api", tags=["Threat Analysis"])


@router.get(
    "/threat-summary",
    response_model=ThreatSummaryResponse,
    summary="Get overall threat classification counts",
)
def threat_summary(db: Session = Depends(get_db)):
    """
    Returns the total number of logs analysed and breakdown by classification:
    Normal, Suspicious, Possible DDoS Attack, Possible Phishing Activity.
    """
    data = get_threat_summary(db)
    return ThreatSummaryResponse(**data)


@router.get(
    "/suspicious-ips",
    response_model=SuspiciousIPsResponse,
    summary="Get top suspicious source IP addresses",
)
def suspicious_ips(
    limit: int = Query(default=10, ge=1, le=100, description="Number of IPs to return"),
    db: Session = Depends(get_db),
):
    """
    Returns the most suspicious source IPs ranked by number of threat events.
    """
    ips = get_suspicious_ips(db, limit=limit)
    return SuspiciousIPsResponse(top_suspicious_ips=ips)


@router.get(
    "/traffic-patterns",
    response_model=TrafficPatternsResponse,
    summary="Get aggregated traffic data for visualisation",
)
def traffic_patterns(db: Session = Depends(get_db)):
    """
    Returns aggregated metrics suitable for chart rendering:
    - Protocol distribution
    - Hourly average request rate
    - Top destination IPs
    - Average packet count per protocol
    """
    data = get_traffic_patterns(db)
    return TrafficPatternsResponse(**data)
