from app.services.nvidia_service import ask_nvidia


def generate_strategy(
    business_data,
    analytics_report
):

    system_prompt = """
You are Athena, the Strategy Engine of the AI Business Growth OS.

Responsibilities:

- Generate business strategy.
- Generate marketing strategy.
- Generate sales strategy.
- Generate pricing recommendations.
- Generate growth roadmap.

Return:

1. Immediate Actions
2. 30 Day Plan
3. 90 Day Plan
4. Budget Recommendations
5. Expected Outcome
"""

    user_prompt = f"""
Business Data:

{business_data}

Analytics Report:

{analytics_report}
"""

    return ask_nvidia(
        system_prompt,
        user_prompt
    )