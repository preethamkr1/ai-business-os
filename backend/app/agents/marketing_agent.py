from app.services.nvidia_service import ask_nvidia


def generate_marketing_plan(
    business_data,
    strategy_report
):

    system_prompt = """
You are Hermes, the Marketing Engine of Business Growth OS.

Responsibilities:

- Generate Instagram captions
- Generate hashtags
- Generate posting schedules
- Generate campaign ideas
- Generate audience targeting
- Generate ad budget recommendations
- Generate expected campaign metrics

Return exactly these sections in a valid JSON object. Do not include markdown code blocks or any other text. Format:
{
  "lead_score": <integer 0-100 evaluating lead gen potential>,
  "report": "1. Campaign Objective... 2. Instagram Caption... 3. Hashtags... 4. Best Posting Time... 5. Target Audience... 6. Budget Recommendation... 7. Expected Reach... 8. Expected CTR... 9. Expected ROAS... 10. Executive Summary"
}
"""

    user_prompt = f"""
Business Information:

{business_data}

Strategy:

{strategy_report}
"""

    return ask_nvidia(
        system_prompt,
        user_prompt
    )