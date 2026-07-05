from app.agents.analytics_agent import analyze_business
from app.agents.strategy_agent import generate_strategy
from app.agents.marketing_agent import generate_marketing_plan
from app.agents.sales_agent import generate_sales_plan
from app.agents.customer_success_agent import generate_customer_success_plan

from app.services.mongo_service import (
    analytics_collection,
    strategy_collection,
    marketing_collection,
    sales_collection,
    customer_success_collection,
    marketing_data_collection
)


def run_business_os(business_data):

    tenant_id = business_data.get(
        "tenant_id",
        "default"
    )

    # Fetch latest marketing data and inject it into the business context
    latest_marketing = marketing_data_collection.find_one(
        {"tenant_id": tenant_id},
        sort=[("_id", -1)]
    )
    if latest_marketing:
        business_data["marketing_campaign_data"] = latest_marketing.get("platforms", [])

    # Fetch historical raw data to provide long-term memory for LLM
    from app.services.mongo_service import raw_data_collection, analytics_collection
    historical_uploads = list(raw_data_collection.find(
        {"tenant_id": tenant_id}
    ).sort("_id", -1).limit(3))
    
    past_analytics = list(analytics_collection.find(
        {"tenant_id": tenant_id}
    ).sort("_id", -1).limit(3))

    if historical_uploads:
        business_data["historical_context"] = [
            {
                "filename": h.get("filename"),
                "upload_timestamp": h.get("upload_timestamp"),
                "total_rows": h.get("rows"),
                "actual_past_data_sample": h.get("data", [])[:3]
            }
            for h in historical_uploads
        ]
        
    if past_analytics:
        business_data["past_predictions"] = [
            p.get("report") for p in past_analytics
        ]

    analytics = analyze_business(
        business_data
    )

    analytics_collection.insert_one(
        {
            "tenant_id": tenant_id,
            "report": analytics
        }
    )

    strategy = generate_strategy(
        business_data,
        analytics
    )

    strategy_collection.insert_one(
        {
            "tenant_id": tenant_id,
            "report": strategy
        }
    )

    marketing = generate_marketing_plan(
        business_data,
        strategy
    )

    marketing_collection.insert_one(
        {
            "tenant_id": tenant_id,
            "report": marketing
        }
    )

    sales = generate_sales_plan(
        business_data,
        strategy
    )

    sales_collection.insert_one(
        {
            "tenant_id": tenant_id,
            "report": sales
        }
    )

    customer_success = generate_customer_success_plan(
        business_data,
        analytics,
        strategy
    )

    customer_success_collection.insert_one(
        {
            "tenant_id": tenant_id,
            "report": customer_success
        }
    )

    return {
        "analytics": analytics,
        "strategy": strategy,
        "marketing": marketing,
        "sales": sales,
        "customer_success": customer_success
    }