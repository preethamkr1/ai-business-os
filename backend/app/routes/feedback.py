from fastapi import APIRouter
from pydantic import BaseModel
import json
import re
from datetime import datetime
from app.services.mongo_service import feedback_collection
from app.agents.support_agent import analyze_feedback

router = APIRouter()

class FeedbackSubmit(BaseModel):
    tenant_id: str
    customer_name: str
    feedback_text: str
    source: str

@router.post("/")
def submit_feedback(data: FeedbackSubmit):
    ai_response = analyze_feedback(data.feedback_text)
    
    analysis = {}
    try:
        match = re.search(r'\{.*\}', ai_response, re.DOTALL)
        if match:
            analysis = json.loads(match.group(0))
        else:
            analysis = json.loads(ai_response)
    except Exception:
        analysis = {
            "sentiment": "Neutral",
            "category": "General Feedback",
            "priority": "Medium",
            "assigned_agent": "Support Agent",
            "ceo_intervention": False,
            "corrective_action": "Standard review."
        }
    
    record = {
        "tenant_id": data.tenant_id,
        "customer_name": data.customer_name,
        "feedback_text": data.feedback_text,
        "source": data.source,
        "timestamp": datetime.utcnow().isoformat(),
        "status": "Open",
        "analysis": analysis
    }
    
    feedback_collection.insert_one(record)
    
    return {"status": "success", "analysis": analysis}

@router.get("/{tenant_id}")
def get_feedback(tenant_id: str):
    docs = list(feedback_collection.find({"tenant_id": tenant_id}, sort=[("_id", -1)]))
    for doc in docs:
        doc["_id"] = str(doc["_id"])
    return {"feedback": docs}
