from pymongo import MongoClient

client = MongoClient(
    "mongodb://localhost:27017"
)

db = client["business_os"]

users_collection = db["users"]

business_collection = db["businesses"]

analytics_collection = db["analytics_reports"]

strategy_collection = db["strategy_reports"]

marketing_collection = db["marketing_reports"]

sales_collection = db["sales_reports"]

customer_success_collection = db["customer_success_reports"]

copilot_collection = db["copilot_history"]

dashboard_collection = db["dashboard_metrics"]

feedback_collection = db["feedback"]

marketing_data_collection = db["marketing_data"]

raw_data_collection = db["raw_data"]