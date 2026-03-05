"""
main.py - CyberGuard FastAPI Application Entry Point
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os

from database.db import init_db
from routes.upload import router as upload_router
from routes.threats import router as threats_router
from routes.chatbot import router as chatbot_router

# ─── Load Environment Variables ───────────────────────────────────────────────
load_dotenv()

APP_TITLE = os.getenv("APP_TITLE", "CyberGuard API")
APP_VERSION = os.getenv("APP_VERSION", "1.0.0")
DEBUG = os.getenv("DEBUG", "True").lower() == "true"

_raw_origins = os.getenv("ALLOWED_ORIGINS", "http://localhost:3000,http://localhost:5173")
ALLOWED_ORIGINS = [o.strip() for o in _raw_origins.split(",") if o.strip()]

# ─── Application Factory ──────────────────────────────────────────────────────

def create_app() -> FastAPI:
    app = FastAPI(
        title=APP_TITLE,
        version=APP_VERSION,
        description=(
            "CyberGuard — A cybersecurity network traffic analysis API.\n\n"
            "Upload CSV network logs, get ML-powered threat detection (DDoS, Phishing, Anomalies), "
            "query threat summaries, visualise traffic patterns, and chat with the data."
        ),
        docs_url="/docs",
        redoc_url="/redoc",
        debug=DEBUG,
    )

    # ── CORS ──────────────────────────────────────────────────────────────────
    app.add_middleware(
        CORSMiddleware,
        allow_origins=ALLOWED_ORIGINS,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    # ── Startup: create DB tables ─────────────────────────────────────────────
    @app.on_event("startup")
    def on_startup():
        init_db()
        os.makedirs(os.getenv("UPLOAD_DIR", "uploads"), exist_ok=True)
        print(f"✅  CyberGuard API v{APP_VERSION} started.")
        print(f"📖  Docs: http://127.0.0.1:8000/docs")

    # ── Routers ───────────────────────────────────────────────────────────────
    app.include_router(upload_router)
    app.include_router(threats_router)
    app.include_router(chatbot_router)

    # ── Health check ──────────────────────────────────────────────────────────
    @app.get("/health", tags=["Health"])
    def health():
        return {"status": "ok", "version": APP_VERSION}

    return app


app = create_app()


# ─── Run with: uvicorn main:app --reload ──────────────────────────────────────
if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
