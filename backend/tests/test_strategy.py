from app.agents.analytics_agent import analyze_business
from app.agents.strategy_agent import generate_strategy

business_data = {
    "industry": "Fashion Ecommerce",
    "monthly_revenue": 250000,
    "marketing_spend": 50000,
    "ctr": 1.8,
    "conversion_rate": 1.5,
    "roas": 1.9
}

analytics = analyze_business(
    business_data
)

strategy = generate_strategy(
    business_data,
    analytics
)

print("\n========== STRATEGY ==========\n")
print(strategy)