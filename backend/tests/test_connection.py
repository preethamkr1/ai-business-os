import requests

print("START")

response = requests.get(
    "https://integrate.api.nvidia.com",
    timeout=10
)

print("STATUS:", response.status_code)
print("DONE")