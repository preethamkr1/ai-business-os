from fastapi import APIRouter
from app.services.mongo_service import business_collection
from app.services.orchestrator import run_business_os

router = APIRouter()

@router.post("/")
def create_business(data: dict):

    business_collection.insert_one(
        data
    )
    
    # Trigger AI agents
    run_business_os(data)

    return {
        "message": "Business Created Successfully",
        "tenant_id": data["tenant_id"]
    }


@router.get("/{tenant_id}")
def get_business(
    tenant_id: str
):

    business = business_collection.find_one(
        {
            "tenant_id": tenant_id
        },
        {
            "_id": 0
        }
    )

    return business