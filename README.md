# CyberGuard Backend — FastAPI Network Threat Detection System

A modular, production-ready FastAPI backend that ingests CSV network traffic logs, detects cyber threats using **Isolation Forest ML**, and exposes REST APIs for a React dashboard.

---

## 📁 Project Structure

```
backend/
├── main.py                        # Application entry point
├── requirements.txt               # Python dependencies
├── .env.example                   # Environment variable template
├── example_logs.csv               # Sample CSV for testing
│
├── database/
│   ├── db.py                      # SQLAlchemy engine, session, init_db()
│   └── models.py                  # ORM: network_logs, threat_results, chat_queries
│
├── schemas/
│   └── log_schemas.py             # Pydantic request/response models
│
├── ml_model/
│   └── anomaly_detector.py        # Isolation Forest + classification + recommendations
│
├── services/
│   ├── log_service.py             # CSV parse → ML inference → DB persist
│   ├── threat_service.py          # Aggregation queries for analytics
│   └── chatbot_service.py         # Intent detection + DB Q&A
│
└── routes/
    ├── upload.py                  # POST /api/upload-logs
    ├── threats.py                 # GET  /api/threat-summary|suspicious-ips|traffic-patterns
    └── chatbot.py                 # POST /api/chatbot-query
```

---

## ⚙️ Setup

### 1. Prerequisites
- Python 3.10+
- PostgreSQL running locally (or remote)

### 2. Install dependencies
```bash
cd "c:\Users\AUSU\Desktop\network traffic logs\backend"
pip install -r requirements.txt
```

### 3. Configure environment
```bash
copy .env.example .env
# Edit .env with your PostgreSQL credentials
```

### 4. Create PostgreSQL database
```sql
CREATE DATABASE cyberguard_db;
```

### 5. Run the server
```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

Tables are **auto-created** on first startup via SQLAlchemy.

---

## 📡 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/upload-logs` | Upload CSV → ML analysis → store results |
| `GET` | `/api/threat-summary` | Threat counts by classification |
| `GET` | `/api/suspicious-ips?limit=10` | Top suspicious source IPs |
| `GET` | `/api/traffic-patterns` | Aggregated chart data |
| `POST` | `/api/chatbot-query` | Natural language Q&A |
| `GET` | `/health` | Health check |
| `GET` | `/docs` | Interactive Swagger UI |

---

## 🧠 ML Model — Isolation Forest

- **Algorithm**: Isolation Forest (`sklearn.ensemble.IsolationForest`)
- **Features used**: `packet_count`, `request_rate`, `failed_login_attempts`, `bytes_transferred`, `duration_seconds`, `port`, `protocol_encoded`
- **Contamination**: 20% (tunable)
- **Classifications**:

| Label | Trigger |
|-------|---------|
| `Normal` | Score ≥ threshold, low packets/rate/logins |
| `Suspicious` | Low anomaly score from Isolation Forest |
| `Possible DDoS Attack` | `packet_count ≥ 5000` OR `request_rate ≥ 500 req/s` |
| `Possible Phishing Activity` | `failed_login_attempts ≥ 5` |

---

## 📋 Example CSV Format

```csv
timestamp,source_ip,destination_ip,protocol,packet_count,request_rate,failed_login_attempts,bytes_transferred,port,duration_seconds
2024-03-01 08:00:01,192.168.1.10,10.0.0.1,TCP,120,15.5,0,48200,80,8
2024-03-01 08:00:07,10.5.5.200,10.0.0.1,TCP,15000,2800.0,0,6100000,80,6
```

**Required columns**: `source_ip`, `destination_ip`, `protocol`  
**Optional but recommended**: `packet_count`, `request_rate`, `failed_login_attempts`, `bytes_transferred`, `port`, `duration_seconds`, `timestamp`

---

## 💬 Chatbot Example Queries

```json
POST /api/chatbot-query
{ "question": "Which IP caused the most attacks?" }
{ "question": "How many threats were detected today?" }
{ "question": "Show me suspicious IPs." }
{ "question": "Any DDoS activity?" }
{ "question": "Give me a threat summary." }
{ "question": "What is the latest threat?" }
```

---

## 🔒 Security Recommendations (Auto-generated)

The API automatically generates remediation tips per detected threat:

- **DDoS**: Block source IP at firewall/WAF, enable rate limiting, activate scrubbing
- **Phishing**: Temporary IP ban, enforce MFA/CAPTCHA, reset targeted credentials
- **Suspicious**: Add to watchlist, enable SIEM alerting, tighten firewall rules

---

## 🌐 CORS

Configured via `ALLOWED_ORIGINS` in `.env` (comma-separated):
```
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5173
```

---

## 🐳 Running with Docker (optional)

```dockerfile
FROM python:3.11-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```
