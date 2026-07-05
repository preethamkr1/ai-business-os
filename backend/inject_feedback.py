import requests
import json

url = "http://localhost:8000/feedback/"
headers = {"Content-Type": "application/json"}

# Assuming the tenant_id in localStorage is "demo" or similar. We will just use "t1" or whatever the user has.
# Actually, the user can just run this script and input their tenant ID.
import sys

tenant_id = sys.argv[1] if len(sys.argv) > 1 else "t1"

data = {
    "tenant_id": tenant_id,
    "customer_name": "Sarah Connor",
    "feedback_text": "The sales executive provided incorrect pricing and did not follow up. This is completely unacceptable.",
    "source": "App"
}

response = requests.post(url, headers=headers, json=data)
print(response.json())
