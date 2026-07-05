from fastapi import APIRouter
from pydantic import BaseModel

from app.services.nvidia_service import ask_nvidia
from app.services.mongo_service import (
    analytics_collection,
    strategy_collection,
    marketing_collection,
    sales_collection,
    customer_success_collection
)

router = APIRouter()

class ChatRequest(BaseModel):
    tenant_id: str
    message: str


@router.post("/chat")
def copilot_chat(data: ChatRequest):
    tenant_id = data.tenant_id

    # Fetch latest reports
    analytics = analytics_collection.find_one({"tenant_id": tenant_id}, sort=[("_id", -1)])
    strategy = strategy_collection.find_one({"tenant_id": tenant_id}, sort=[("_id", -1)])
    marketing = marketing_collection.find_one({"tenant_id": tenant_id}, sort=[("_id", -1)])
    sales = sales_collection.find_one({"tenant_id": tenant_id}, sort=[("_id", -1)])
    customer = customer_success_collection.find_one({"tenant_id": tenant_id}, sort=[("_id", -1)])

    # Build context string
    context = f"""
    Analytics Context: {analytics.get('report', 'None') if analytics else 'None'}
    Strategy Context: {strategy.get('report', 'None') if strategy else 'None'}
    Marketing Context: {marketing.get('report', 'None') if marketing else 'None'}
    Sales Context: {sales.get('report', 'None') if sales else 'None'}
    Customer Success Context: {customer.get('report', 'None') if customer else 'None'}
    """

    system_prompt = f"""
You are the CEO Copilot for Business Growth OS. Your ONLY job is to provide highly specific, data-driven answers based entirely on the provided company reports and metrics.

CRITICAL INSTRUCTIONS:
1. NEVER give generic business advice. Every recommendation must cite specific numbers, metrics, or strategies from the Company Context below.
2. If the user asks a question, find the exact data points in the Analytics, Strategy, Marketing, Sales, or Customer Success reports to answer it.
3. NEVER ask the user for data. You already have all the data.
4. Speak like an elite data analyst and business strategist. Use precise numbers and actionable insights.
5. Provide comprehensive, detailed responses. Do not limit your output to just a few lines. If the question warrants a deeper dive into the metrics, provide a thorough, structured analysis.
6. Always format your key insights and recommendations using clear bullet points to make the response highly readable.

COMPANY CONTEXT:
================
{context}
================

Use this data to answer the user's question directly.
"""

    response = ask_nvidia(
        system_prompt,
        data.message
    )

    return {
        "tenant_id": tenant_id,
        "response": response
    }