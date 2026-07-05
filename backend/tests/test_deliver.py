from app.agents.analytics_agent import analyze_business
from app.agents.strategy_agent import generate_strategy
from app.agents.marketing_agent import generate_marketing_plan
from app.agents.sales_agent import generate_sales_plan

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

marketing = generate_marketing_plan(
    business_data,
    strategy
)

sales = generate_sales_plan(
    business_data,
    strategy
)

print("\n========== MARKETING ==========\n")
print(marketing)

print("\n========== SALES ==========\n")
print(sales)