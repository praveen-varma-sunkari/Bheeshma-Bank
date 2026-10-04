import requests
import json
import sys

API_KEY = "YOUR_API_KEY_HERE"
url = f"https://generativelanguage.googleapis.com/v1beta/models?key={API_KEY}"

print(f"Requesting models for key: {API_KEY[:10]}...")
response = requests.get(url)
print(f"Status Code: {response.status_code}")
if response.status_code == 200:
    data = response.json()
    models = [m.get('name') for m in data.get('models', [])]
    print(f"Models available: {models[:5]} ... (total {len(models)})")
else:
    print(f"Error: {response.text}")
