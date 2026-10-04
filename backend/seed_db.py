from dotenv import load_dotenv
import os
from pymongo import MongoClient

# Load connection string from .env
load_dotenv()
mongo_uri = os.getenv("MONGO_URI")

if not mongo_uri or "db_password" in mongo_uri:
    print("❌ ERROR: You haven't put your real password in backend/.env yet!")
    exit(1)

try:
    print("Connecting to MongoDB...")
    client = MongoClient(mongo_uri)
    db = client['bheeshmabank']
    
    # Insert a dummy record to force MongoDB to create the database
    db.users.insert_one({"name": "Test User", "message": "Your database is alive!"})
    
    print("✅ SUCCESS! I just injected a test user into your cloud database.")
    print("Go back to the MongoDB Atlas website and hit the Refresh button on your browser!")
except Exception as e:
    print(f"❌ Connection failed: {e}")
