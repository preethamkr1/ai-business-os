from app.agents.analytics_agent import analyze_business

business_data = {
    "industry": "Fashion Ecommerce",
    "monthly_revenue": 250000,
    "marketing_spend": 50000,
    "ctr": 1.8,
    "conversion_rate": 1.5,
    "roas": 1.9
}

result = analyze_business(
    business_data
)

print("\nANALYTICS REPORT\n")
print(result)