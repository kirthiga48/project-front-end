"""
services/threat_service.py
Aggregation queries for /threat-summary, /suspicious-ips, /traffic-patterns
"""

from sqlalchemy.orm import Session
from sqlalchemy import func, desc
from typing import List, Dict, Any
from datetime import datetime

from database.models import NetworkLog, ThreatResult


def get_threat_summary(db: Session) -> Dict[str, Any]:
    """Return counts broken down by threat classification."""
    total_logs = db.query(NetworkLog).count()

    # Count each classification
    class_counts = (
        db.query(ThreatResult.classification, func.count(ThreatResult.id))
        .group_by(ThreatResult.classification)
        .all()
    )

    counts = {cls: cnt for cls, cnt in class_counts}
    normal = counts.get("Normal", 0)
    suspicious = counts.get("Suspicious", 0)
    ddos = counts.get("Possible DDoS Attack", 0)
    phishing = counts.get("Possible Phishing Activity", 0)
    total_threats = suspicious + ddos + phishing

    latest_row = db.query(ThreatResult).order_by(desc(ThreatResult.detected_at)).first()
    last_updated = latest_row.detected_at if latest_row else None

    return {
        "total_logs_analyzed": total_logs,
        "total_threats": total_threats,
        "normal": normal,
        "suspicious": suspicious,
        "possible_ddos": ddos,
        "possible_phishing": phishing,
        "threat_percentage": round((total_threats / total_logs * 100) if total_logs else 0, 2),
        "last_updated": last_updated,
    }


def get_suspicious_ips(db: Session, limit: int = 10) -> List[Dict[str, Any]]:
    """Return top IPs associated with threat events."""
    rows = (
        db.query(
            NetworkLog.source_ip,
            func.count(ThreatResult.id).label("threat_count"),
            func.max(ThreatResult.detected_at).label("latest_seen"),
        )
        .join(ThreatResult, ThreatResult.network_log_id == NetworkLog.id)
        .filter(ThreatResult.is_threat == True)  # noqa: E712
        .group_by(NetworkLog.source_ip)
        .order_by(desc("threat_count"))
        .limit(limit)
        .all()
    )

    result = []
    for row in rows:
        # Get distinct classifications for this IP
        class_rows = (
            db.query(ThreatResult.classification)
            .join(NetworkLog, NetworkLog.id == ThreatResult.network_log_id)
            .filter(NetworkLog.source_ip == row.source_ip)
            .filter(ThreatResult.is_threat == True)  # noqa: E712
            .distinct()
            .all()
        )
        classifications = [c[0] for c in class_rows]
        result.append(
            {
                "source_ip": row.source_ip,
                "threat_count": row.threat_count,
                "classifications": classifications,
                "latest_seen": row.latest_seen,
            }
        )
    return result


def get_traffic_patterns(db: Session) -> Dict[str, Any]:
    """Aggregate traffic data for frontend chart visualisation."""

    # Protocol distribution (all logs)
    protocol_rows = (
        db.query(NetworkLog.protocol, func.count(NetworkLog.id).label("cnt"))
        .group_by(NetworkLog.protocol)
        .order_by(desc("cnt"))
        .all()
    )
    protocol_dist = [{"label": r.protocol, "value": r.cnt} for r in protocol_rows]

    # Average request_rate by hour-of-day
    hourly_rows = (
        db.query(
            func.extract("hour", NetworkLog.timestamp).label("hour"),
            func.avg(NetworkLog.request_rate).label("avg_rate"),
        )
        .filter(NetworkLog.timestamp != None)  # noqa: E711
        .group_by("hour")
        .order_by("hour")
        .all()
    )
    hourly = [
        {"label": f"{int(r.hour):02d}:00", "value": round(float(r.avg_rate or 0), 2)}
        for r in hourly_rows
    ]

    # Top 10 destination IPs by traffic volume
    dest_rows = (
        db.query(NetworkLog.destination_ip, func.count(NetworkLog.id).label("cnt"))
        .group_by(NetworkLog.destination_ip)
        .order_by(desc("cnt"))
        .limit(10)
        .all()
    )
    top_dests = [{"label": r.destination_ip, "value": r.cnt} for r in dest_rows]

    # Average packet count per protocol
    pkt_rows = (
        db.query(NetworkLog.protocol, func.avg(NetworkLog.packet_count).label("avg_pkt"))
        .group_by(NetworkLog.protocol)
        .order_by(desc("avg_pkt"))
        .all()
    )
    avg_pkts = [
        {"label": r.protocol, "value": round(float(r.avg_pkt or 0), 2)}
        for r in pkt_rows
    ]

    return {
        "protocol_distribution": protocol_dist,
        "hourly_request_rate": hourly,
        "top_destination_ips": top_dests,
        "avg_packet_count_by_protocol": avg_pkts,
    }
