from fastapi import APIRouter
import json
import re
from app.services.mongo_service import (
    analytics_collection,
    strategy_collection,
    marketing_collection,
    sales_collection,
    customer_success_collection
)

router = APIRouter()

def safe_parse_json(text: str, fallback: dict) -> dict:
    if not text:
        return fallback
    try:
        match = re.search(r'\{.*\}', text, re.DOTALL)
        if match:
            return json.loads(match.group(0))
        return json.loads(text)
    except Exception:
        return fallback

@router.get("/{tenant_id}")
def dashboard(tenant_id: str):
    analytics_doc = analytics_collection.find_one({"tenant_id": tenant_id}, sort=[("_id", -1)])
    marketing_doc = marketing_collection.find_one({"tenant_id": tenant_id}, sort=[("_id", -1)])
    cs_doc = customer_success_collection.find_one({"tenant_id": tenant_id}, sort=[("_id", -1)])

    analytics_raw = analytics_doc.get("report", "") if analytics_doc else ""
    marketing_raw = marketing_doc.get("report", "") if marketing_doc else ""
    cs_raw = cs_doc.get("report", "") if cs_doc else ""

    analytics_data = safe_parse_json(analytics_raw, {})
    marketing_data = safe_parse_json(marketing_raw, {})
    cs_data = safe_parse_json(cs_raw, {})

    business_health = analytics_data.get("business_health_score", 0)
    growth_score = analytics_data.get("growth_score", 0)
    market_readiness = analytics_data.get("market_readiness_score", 0)
    executive_summary = analytics_data.get("executive_summary", "Run your first analysis to see insights.")

    lead_score = marketing_data.get("lead_score", 0)
    risk_score = cs_data.get("risk_alerts", 0)

    if not executive_summary and isinstance(analytics_raw, str) and len(analytics_raw) > 50:
         executive_summary = analytics_raw[:500] + "..."

    # Extract dynamic recommendations and alerts from agent text
    strategy_doc = strategy_collection.find_one({"tenant_id": tenant_id}, sort=[("_id", -1)])
    strategy_raw = str(strategy_doc.get("report", "")) if strategy_doc else ""
    
    all_text = str(analytics_raw) + " " + str(marketing_raw) + " " + str(cs_raw) + " " + strategy_raw
    
    import re
    sentences = re.split(r'(?<=[.!?]) +', all_text.replace('\n', ' '))
    recommendations = []
    alerts = []
    for s in sentences:
        s_lower = s.lower()
        if len(s) > 15:
            if any(k in s_lower for k in ["recommend", "scale ", "increase ", "optimize ", "focus "]) and len(recommendations) < 3:
                recommendations.append(s.strip())
            if any(k in s_lower for k in ["alert ", "risk ", "drop ", "underperforming", "issue", "decrease "]) and len(alerts) < 3:
                alerts.append(s.strip())

    if len(alerts) > risk_score:
        risk_score = len(alerts)

    return {
        "tenant_id": tenant_id,
        "business_health_score": business_health,
        "growth_score": growth_score,
        "lead_score": lead_score,
        "customer_health_score": max(0, 100 - (risk_score * 10)),
        "market_readiness_score": market_readiness,
        "risk_score": risk_score,
        "executive_summary": executive_summary,
        "recommendations": recommendations,
        "alerts": alerts
    }