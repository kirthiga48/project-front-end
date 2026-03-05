"""
database/models.py - SQLAlchemy ORM Models
Tables: network_logs, threat_results, chat_queries
"""

from sqlalchemy import (
    Column, Integer, String, Float, DateTime, Text,
    ForeignKey, JSON, Boolean
)
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from database.db import Base


class NetworkLog(Base):
    """Stores each row of the uploaded network traffic CSV."""
    __tablename__ = "network_logs"

    id = Column(Integer, primary_key=True, index=True)
    upload_batch_id = Column(String(64), index=True, nullable=False)
    timestamp = Column(DateTime, nullable=True)
    source_ip = Column(String(45), nullable=False, index=True)
    destination_ip = Column(String(45), nullable=False)
    protocol = Column(String(16), nullable=False)
    packet_count = Column(Integer, nullable=True)
    request_rate = Column(Float, nullable=True)
    failed_login_attempts = Column(Integer, nullable=True, default=0)
    bytes_transferred = Column(Float, nullable=True)
    port = Column(Integer, nullable=True)
    duration_seconds = Column(Float, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationship to threat result
    threat_result = relationship("ThreatResult", back_populates="network_log", uselist=False)


class ThreatResult(Base):
    """Stores ML model output for each network log row."""
    __tablename__ = "threat_results"

    id = Column(Integer, primary_key=True, index=True)
    network_log_id = Column(Integer, ForeignKey("network_logs.id"), nullable=False, index=True)
    upload_batch_id = Column(String(64), index=True, nullable=False)
    anomaly_score = Column(Float, nullable=True)
    classification = Column(String(64), nullable=False)   # Normal / Suspicious / Possible DDoS / Possible Phishing
    is_threat = Column(Boolean, default=False)
    recommendations = Column(JSON, nullable=True)          # List of text recommendations
    detected_at = Column(DateTime(timezone=True), server_default=func.now())

    network_log = relationship("NetworkLog", back_populates="threat_result")


class ChatQuery(Base):
    """Stores every chatbot question and its generated answer."""
    __tablename__ = "chat_queries"

    id = Column(Integer, primary_key=True, index=True)
    question = Column(Text, nullable=False)
    answer = Column(Text, nullable=False)
    intent = Column(String(64), nullable=True)   # e.g. most_attacks, threats_today
    created_at = Column(DateTime(timezone=True), server_default=func.now())
