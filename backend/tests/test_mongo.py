from pymongo import MongoClient

client = MongoClient(
    "mongodb://localhost:27017"
)

db = client["business_os"]

db.test.insert_one(
    {
        "message": "MongoDB Connected Successfully"
    }
)

print("MongoDB Working Successfully")