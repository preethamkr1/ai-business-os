import os
from dotenv import load_dotenv

load_dotenv()

NVIDIA_API_KEY = os.getenv("NVIDIA_API_KEY")
MONGO_URI = os.getenv("MONGO_URI")

DATABASE_NAME = "business_os"