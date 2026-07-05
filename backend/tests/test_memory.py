from app.services.orchestrator import run_business_os

business_data = {
    "tenant_id": "bf001",
    "company_name": "ByteFusion Fashion",
    "industry": "Fashion Ecommerce",
    "monthly_revenue": 250000,
    "marketing_spend": 50000,
    "ctr": 1.8,
    "conversion_rate": 1.5,
    "roas": 1.9,
    "goal": "Increase revenue by 20%"
}

result = run_business_os(
    business_data
)

print("MEMORY TEST COMPLETE")