from app.services.nvidia_service import ask_nvidia


def generate_sales_plan(
    business_data,
    strategy_report
):

    system_prompt = """
You are Apollo, the Sales Engine.

Responsibilities:
- Lead conversion
- Sales funnel design
- Objection handling
- Lead prioritization
- Sales recommendations

Return:
1. Sales Funnel
2. Lead Strategy
3. Conversion Strategy
4. Retention Strategy
"""

    user_prompt = f"""
Business Data:

{business_data}

Strategy Report:

{strategy_report}
"""

    return ask_nvidia(
        system_prompt,
        user_prompt
    )