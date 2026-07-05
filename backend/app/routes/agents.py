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

def extract_report(doc):
    if not doc:
        return None
    raw = doc.get("report", "")
    if not raw:
        return None
        
    try:
        match = re.search(r'\{.*\}', raw, re.DOTALL)
        if match:
            parsed = json.loads(match.group(0))
            if "executive_summary" in parsed:
                return parsed["executive_summary"]
            elif "report" in parsed:
                return parsed["report"]
        
        parsed = json.loads(raw)
        return str(parsed)
    except Exception:
        pass
        
    return raw


@router.get("/{tenant_id}")
def get_agents(tenant_id: str):
    analytics = analytics_collection.find_one({"tenant_id": tenant_id}, sort=[("_id", -1)])
    strategy = strategy_collection.find_one({"tenant_id": tenant_id}, sort=[("_id", -1)])
    marketing = marketing_collection.find_one({"tenant_id": tenant_id}, sort=[("_id", -1)])
    sales = sales_collection.find_one({"tenant_id": tenant_id}, sort=[("_id", -1)])
    cs = customer_success_collection.find_one({"tenant_id": tenant_id}, sort=[("_id", -1)])

    analytics_report = extract_report(analytics)
    strategy_report = extract_report(strategy)
    marketing_report = extract_report(marketing)
    sales_report = extract_report(sales)
    cs_report = extract_report(cs)

    return {
        "agents": [
            {
                "name": "Orion",
                "status": "Active" if analytics else "Idle",
                "desc": "Generated analytics report" if analytics else "Awaiting data",
                "insights": analytics_report
            },
            {
                "name": "Athena",
                "status": "Active" if strategy else "Idle",
                "desc": "Generated growth strategy" if strategy else "Awaiting data",
                "insights": strategy_report
            },
            {
                "name": "Hermes",
                "status": "Active" if marketing else "Idle",
                "desc": "Generated campaign recommendations" if marketing else "Awaiting data",
                "insights": marketing_report
            },
            {
                "name": "Apollo",
                "status": "Active" if sales else "Idle",
                "desc": "Generated sales plan" if sales else "Awaiting data",
                "insights": sales_report
            },
            {
                "name": "Argus",
                "status": "Active" if cs else "Idle",
                "desc": "Generated customer success plan" if cs else "Awaiting data",
                "insights": cs_report
            }
        ]
    }
