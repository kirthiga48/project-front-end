"""
routes/chatbot.py - /chatbot-query endpoint
"""

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from database.db import get_db
from services.chatbot_service import answer_question
from schemas.log_schemas import ChatbotQueryRequest, ChatbotQueryResponse

router = APIRouter(prefix="/api", tags=["Chatbot"])


@router.post(
    "/chatbot-query",
    response_model=ChatbotQueryResponse,
    summary="Ask a natural language question about the network traffic data",
)
def chatbot_query(
    payload: ChatbotQueryRequest,
    db: Session = Depends(get_db),
):
    """
    Accepts a plain-English question about the analysed traffic data.

    Example questions:
    - "Which IP caused the most attacks?"
    - "How many threats were detected today?"
    - "Show me suspicious IPs."
    - "Any DDoS activity?"
    - "Give me a threat summary."
    """
    return answer_question(payload.question, db)
