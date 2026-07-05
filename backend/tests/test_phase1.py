from app.agents.analytics_agent import analytics_agent
from app.agents.strategy_agent import strategy_agent

business_profile = {
    "industry": "Ecommerce",
    "budget": 100000,
    "goal": "Increase sales by 20%"
}

campaign_data = {
    "ctr": 2.1,
    "roas": 1.8,
    "conversions": 45
}

analytics = analytics_agent.analyze(
    business_profile,
    campaign_data
)

print("\n===== ANALYTICS =====\n")
print(analytics)

strategy = strategy_agent.generate_strategy(
    business_profile,
    analytics
)

print("\n===== STRATEGY =====\n")
print(strategy)