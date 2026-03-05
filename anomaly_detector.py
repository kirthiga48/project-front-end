"""
ml_model/anomaly_detector.py
Isolation Forest-based anomaly detector for network traffic classification.
"""

import numpy as np
import pandas as pd
from sklearn.ensemble import IsolationForest
from sklearn.preprocessing import LabelEncoder, StandardScaler
from typing import List, Dict, Any


# ─── Feature Configuration ────────────────────────────────────────────────────

NUMERIC_FEATURES = [
    "packet_count",
    "request_rate",
    "failed_login_attempts",
    "bytes_transferred",
    "duration_seconds",
    "port",
]

REQUIRED_COLUMNS = [
    "source_ip",
    "destination_ip",
    "protocol",
    "packet_count",
    "request_rate",
    "failed_login_attempts",
]

# ─── Thresholds for rule-based classification assist ─────────────────────────

DDOS_PACKET_THRESHOLD = 5000        # packets per log entry
DDOS_RATE_THRESHOLD = 500.0         # requests/sec
PHISHING_LOGIN_THRESHOLD = 5        # failed login attempts
SUSPICIOUS_SCORE_THRESHOLD = -0.05  # Isolation Forest score boundary


# ─── Helper: feature engineering ─────────────────────────────────────────────

def _engineer_features(df: pd.DataFrame) -> pd.DataFrame:
    """Fill missing numeric columns and encode protocol."""
    result = df.copy()

    # Fill defaults
    for col in NUMERIC_FEATURES:
        if col not in result.columns:
            result[col] = 0
        result[col] = pd.to_numeric(result[col], errors="coerce").fillna(0)

    # Encode protocol as numeric
    if "protocol" in result.columns:
        le = LabelEncoder()
        result["protocol_encoded"] = le.fit_transform(
            result["protocol"].fillna("UNKNOWN").astype(str).str.upper()
        )
    else:
        result["protocol_encoded"] = 0

    return result


def _classify(row: pd.Series, score: float) -> str:
    """
    Classify a single log record.
    Priority: DDoS → Phishing → Suspicious → Normal
    """
    pkt = float(row.get("packet_count", 0) or 0)
    rate = float(row.get("request_rate", 0) or 0)
    logins = float(row.get("failed_login_attempts", 0) or 0)

    if pkt >= DDOS_PACKET_THRESHOLD or rate >= DDOS_RATE_THRESHOLD:
        return "Possible DDoS Attack"
    if logins >= PHISHING_LOGIN_THRESHOLD:
        return "Possible Phishing Activity"
    if score < SUSPICIOUS_SCORE_THRESHOLD:
        return "Suspicious"
    return "Normal"


# ─── Main Detection Function ──────────────────────────────────────────────────

def detect_anomalies(df: pd.DataFrame) -> List[Dict[str, Any]]:
    """
    Run Isolation Forest on the dataframe.

    Returns a list of dicts, one per row, containing:
    - anomaly_score: float
    - classification: str
    - is_threat: bool
    - recommendations: list[str]
    """
    df_feat = _engineer_features(df)

    feature_cols = NUMERIC_FEATURES + ["protocol_encoded"]
    X = df_feat[feature_cols].values.astype(float)

    # Scale features
    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(X)

    # Fit Isolation Forest
    contamination = 0.2   # assume up to 20 % anomalous
    model = IsolationForest(
        n_estimators=200,
        contamination=contamination,
        random_state=42,
        n_jobs=-1,
    )
    model.fit(X_scaled)
    scores = model.score_samples(X_scaled)   # higher = more normal, range ~[-1, 0]

    results = []
    for idx, (_, row) in enumerate(df.iterrows()):
        score = float(scores[idx])
        classification = _classify(row, score)
        is_threat = classification != "Normal"
        recommendations = generate_recommendations(classification, row)

        results.append(
            {
                "anomaly_score": round(score, 6),
                "classification": classification,
                "is_threat": is_threat,
                "recommendations": recommendations,
            }
        )

    return results


# ─── Recommendation Engine ────────────────────────────────────────────────────

def generate_recommendations(classification: str, row: pd.Series) -> List[str]:
    """Return a list of remediation suggestions based on classification."""
    tips: List[str] = []
    src = str(row.get("source_ip", "unknown"))

    if classification == "Possible DDoS Attack":
        tips = [
            f"Immediately block source IP: {src} at the firewall/WAF level.",
            "Enable rate limiting on the affected endpoint (target destination IP).",
            "Activate DDoS protection/scrubbing service (e.g., Cloudflare, AWS Shield).",
            "Alert the network operations center (NOC) for real-time mitigation.",
            "Consider geo-blocking if the attack originates from a specific region.",
        ]
    elif classification == "Possible Phishing Activity":
        logins = int(row.get("failed_login_attempts", 0) or 0)
        tips = [
            f"Block or temporarily ban source IP {src} due to {logins} failed login attempts.",
            "Enforce CAPTCHA or MFA on the targeted login endpoint.",
            "Alert the security team to investigate credential stuffing.",
            "Reset passwords for accounts targeted from this IP.",
            "Enable login anomaly alerting in your SIEM.",
        ]
    elif classification == "Suspicious":
        tips = [
            f"Monitor source IP {src} closely for continued suspicious behaviour.",
            "Log all traffic from this IP for forensic analysis.",
            "Consider adding the IP to a watchlist/threat intelligence feed.",
            "Review firewall rules and tighten access controls if necessary.",
        ]
    else:
        tips = ["Traffic classified as normal. No immediate action required."]

    return tips
