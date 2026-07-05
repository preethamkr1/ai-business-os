from app.agents.analytics_agent import analyze_business
from app.agents.strategy_agent import generate_strategy
from app.agents.customer_success_agent import generate_customer_success_plan

business_data = {
    "company_name": "ByteFusion Fashion",
    "industry": "Fashion Ecommerce",
    "monthly_revenue": 250000,
    "marketing_spend": 50000,
    "ctr": 1.8,
    "conversion_rate": 1.5,
    "roas": 1.9,
    "goal": "Increase revenue by 20%"
}

analytics = analyze_business(
    business_data
)

strategy = generate_strategy(
    business_data,
    analytics
)

customer_success = generate_customer_success_plan(
    business_data,
    analytics,
    strategy
)

print("\n========== CUSTOMER SUCCESS ==========\n")
print(customer_success)