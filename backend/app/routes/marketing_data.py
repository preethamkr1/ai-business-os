from fastapi import APIRouter
from pydantic import BaseModel
from typing import List, Dict, Any
from datetime import datetime
from app.services.mongo_service import marketing_data_collection

router = APIRouter()

class MarketingDataInput(BaseModel):
    tenant_id: str
    platforms: List[Dict[str, Any]]

@router.post("/")
def save_marketing_data(data: MarketingDataInput):
    record = data.dict()
    record["timestamp"] = datetime.utcnow().isoformat()
    marketing_data_collection.insert_one(record)
    return {"status": "success", "data": record}

@router.get("/{tenant_id}")
def get_marketing_data(tenant_id: str):
    latest = marketing_data_collection.find_one(
        {"tenant_id": tenant_id},
        sort=[("_id", -1)]
    )
    if latest:
        latest["_id"] = str(latest["_id"])
        return latest
    return {"tenant_id": tenant_id, "platforms": []}
