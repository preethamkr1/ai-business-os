from pydantic import BaseModel


class BusinessRequest(BaseModel):
    tenant_id: str
    company_name: str
    industry: str
    business_mode: str

    monthly_revenue: float
    marketing_spend: float
    ctr: float
    conversion_rate: float
    roas: float

    goal: str