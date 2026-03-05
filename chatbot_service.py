"""
services/chatbot_service.py
Keyword-intent matching chatbot that queries the PostgreSQL database.
"""

import re
from datetime import datetime, timezone
from sqlalchemy.orm import Session
from sqlalchemy import func, desc, cast, Date

from database.models import NetworkLog, ThreatResult, ChatQuery
from typing import Dict, Any, Optional


# ─── Intent Detection ─────────────────────────────────────────────────────────

INTENT_PATTERNS = {
    "most_attacks": [
        r"which\s+ip.*(most|highest|top).*(attack|threat|ddos|phish)",
        r"(top|most).*(attack|threat).*(ip|address)",
        r"ip.*(most|highest).*(attack|threat)",
    ],
    "threats_today": [
        r"(how\s+many|count|number).*(threat|attack|suspicious).*(today|now)",
        r"threats?\s+(today|detected\s+today)",
        r"today.*threat",
    ],
    "threat_summary": [
        r"(total|overall|all).*(threat|attack|anomal)",
        r"(summary|overview|breakdown).*(threat|risk)",
        r"how\s+many\s+threats",
    ],
    "ddos_info": [
        r"ddos",
        r"denial.of.service",
        r"flood(ing)?",
    ],
    "phishing_info": [
        r"phish",
        r"login\s+attempt",
        r"credential",
    ],
    "suspicious_ip": [
        r"suspicious\s+ip",
        r"which\s+ip.*(suspicious|bad|malicious)",
        r"dangerous\s+address",
    ],
    "traffic_stats": [
        r"traffic\s+(stat|data|info|pattern|volume)",
        r"(packet|request)\s+(count|rate|volume)",
        r"protocols?\s+used",
    ],
    "latest_threat": [
        r"last(est)?\s+(threat|attack|incident)",
        r"most\s+recent.*(threat|attack)",
        r"recent.*(threat|attack|incident)",
    ],
}


def _detect_intent(question: str) -> Optional[str]:
    q = question.lower()
    for intent, patterns in INTENT_PATTERNS.items():
        for pattern in patterns:
            if re.search(pattern, q):
                return intent
    return None


# ─── DB Query Handlers ────────────────────────────────────────────────────────

def _most_attacks(db: Session) -> Dict[str, Any]:
    row = (
        db.query(NetworkLog.source_ip, func.count(ThreatResult.id).label("cnt"))
        .join(ThreatResult, ThreatResult.network_log_id == NetworkLog.id)
        .filter(ThreatResult.is_threat == True)  # noqa
        .group_by(NetworkLog.source_ip)
        .order_by(desc("cnt"))
        .first()
    )
    if row:
        return {
            "answer": f"The IP address **{row.source_ip}** caused the most attacks with **{row.cnt}** threat event(s) detected.",
            "data": {"ip": row.source_ip, "count": row.cnt},
        }
    return {"answer": "No threat data found yet. Please upload network logs first.", "data": None}


def _threats_today(db: Session) -> Dict[str, Any]:
    today = datetime.now(timezone.utc).date()
    count = (
        db.query(ThreatResult)
        .filter(ThreatResult.is_threat == True)  # noqa
        .filter(cast(ThreatResult.detected_at, Date) == today)
        .count()
    )
    return {
        "answer": f"**{count}** threat(s) were detected today ({today.strftime('%B %d, %Y')}).",
        "data": {"date": str(today), "count": count},
    }


def _threat_summary(db: Session) -> Dict[str, Any]:
    total = db.query(ThreatResult).count()
    threats = db.query(ThreatResult).filter(ThreatResult.is_threat == True).count()  # noqa
    normal = total - threats
    pct = round(threats / total * 100, 1) if total else 0
    return {
        "answer": (
            f"Out of **{total}** total log entries analysed, **{threats}** were threats "
            f"({pct}%) and **{normal}** were normal."
        ),
        "data": {"total": total, "threats": threats, "normal": normal, "threat_pct": pct},
    }


def _ddos_info(db: Session) -> Dict[str, Any]:
    count = (
        db.query(ThreatResult)
        .filter(ThreatResult.classification == "Possible DDoS Attack")
        .count()
    )
    top = (
        db.query(NetworkLog.source_ip, func.count(ThreatResult.id).label("cnt"))
        .join(ThreatResult, ThreatResult.network_log_id == NetworkLog.id)
        .filter(ThreatResult.classification == "Possible DDoS Attack")
        .group_by(NetworkLog.source_ip)
        .order_by(desc("cnt"))
        .limit(3)
        .all()
    )
    ips = ", ".join(f"{r.source_ip} ({r.cnt})" for r in top) or "none"
    return {
        "answer": f"**{count}** DDoS attack event(s) detected. Top offending IPs: {ips}.",
        "data": {"ddos_count": count, "top_ips": [{"ip": r.source_ip, "count": r.cnt} for r in top]},
    }


def _phishing_info(db: Session) -> Dict[str, Any]:
    count = (
        db.query(ThreatResult)
        .filter(ThreatResult.classification == "Possible Phishing Activity")
        .count()
    )
    return {
        "answer": f"**{count}** possible phishing event(s) detected based on abnormal failed login attempts.",
        "data": {"phishing_count": count},
    }


def _suspicious_ip(db: Session) -> Dict[str, Any]:
    rows = (
        db.query(NetworkLog.source_ip, func.count(ThreatResult.id).label("cnt"))
        .join(ThreatResult, ThreatResult.network_log_id == NetworkLog.id)
        .filter(ThreatResult.is_threat == True)  # noqa
        .group_by(NetworkLog.source_ip)
        .order_by(desc("cnt"))
        .limit(5)
        .all()
    )
    if not rows:
        return {"answer": "No suspicious IPs found yet.", "data": None}
    lines = "\n".join(f"- **{r.source_ip}** — {r.cnt} threat(s)" for r in rows)
    return {
        "answer": f"Top suspicious IP addresses:\n{lines}",
        "data": [{"ip": r.source_ip, "count": r.cnt} for r in rows],
    }


def _traffic_stats(db: Session) -> Dict[str, Any]:
    total_logs = db.query(NetworkLog).count()
    avg_rate = db.query(func.avg(NetworkLog.request_rate)).scalar() or 0
    avg_pkts = db.query(func.avg(NetworkLog.packet_count)).scalar() or 0
    return {
        "answer": (
            f"**{total_logs}** log entries stored. "
            f"Average request rate: **{round(float(avg_rate), 2)}** req/s. "
            f"Average packet count: **{round(float(avg_pkts), 0)}** packets."
        ),
        "data": {"total_logs": total_logs, "avg_request_rate": round(float(avg_rate), 2)},
    }


def _latest_threat(db: Session) -> Dict[str, Any]:
    row = (
        db.query(ThreatResult, NetworkLog)
        .join(NetworkLog, NetworkLog.id == ThreatResult.network_log_id)
        .filter(ThreatResult.is_threat == True)  # noqa
        .order_by(desc(ThreatResult.detected_at))
        .first()
    )
    if not row:
        return {"answer": "No threats detected yet.", "data": None}
    tr, nl = row
    ts = tr.detected_at.strftime("%Y-%m-%d %H:%M:%S UTC") if tr.detected_at else "unknown"
    return {
        "answer": (
            f"The most recent threat was a **{tr.classification}** from IP **{nl.source_ip}** "
            f"detected at {ts}."
        ),
        "data": {"classification": tr.classification, "source_ip": nl.source_ip, "detected_at": str(tr.detected_at)},
    }


# ─── Intent Router ────────────────────────────────────────────────────────────

INTENT_HANDLERS = {
    "most_attacks": _most_attacks,
    "threats_today": _threats_today,
    "threat_summary": _threat_summary,
    "ddos_info": _ddos_info,
    "phishing_info": _phishing_info,
    "suspicious_ip": _suspicious_ip,
    "traffic_stats": _traffic_stats,
    "latest_threat": _latest_threat,
}


def answer_question(question: str, db: Session) -> Dict[str, Any]:
    """Detect intent, query DB, save to chat_queries, and return a structured response."""
    intent = _detect_intent(question)

    if intent and intent in INTENT_HANDLERS:
        result = INTENT_HANDLERS[intent](db)
    else:
        result = {
            "answer": (
                "I can answer questions such as:\n"
                "- *Which IP caused the most attacks?*\n"
                "- *How many threats were detected today?*\n"
                "- *Give me a threat summary.*\n"
                "- *Show suspicious IPs.*\n"
                "- *What are the latest threats?*\n"
                "- *Any DDoS or phishing activity?*"
            ),
            "data": None,
        }

    # Persist the Q&A
    chat_row = ChatQuery(
        question=question,
        answer=result["answer"],
        intent=intent,
    )
    db.add(chat_row)
    db.commit()

    return {
        "question": question,
        "answer": result["answer"],
        "intent": intent,
        "data": result.get("data"),
    }
