from app.services.nvidia_service import ask_nvidia

print("STEP 1")

response = ask_nvidia(
    "You are a helpful assistant.",
    "Reply with exactly one word: SUCCESS"
)

print("STEP 2")
print(response)
print("STEP 3")