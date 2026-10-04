"""
database.py
Logic Implemented:
Handles connection and operations with MongoDB. Provides functions to 
save and fetch users, transactions, and contacts from the cloud database.
"""
from pymongo import MongoClient
import os

# Initialize database client
db_client = None
db = None

def init_db(uri):
    """Connects to the MongoDB Atlas cluster and initializes the database object."""
    global db_client, db
    try:
        db_client = MongoClient(uri)
        db = db_client['bheeshmabank']
        print("SUCCESS: Successfully connected to MongoDB Atlas!")
    except Exception as e:
        print(f"ERROR: Failed to connect to MongoDB: {e}")
        db_client = None
        db = None

def get_user_data(phone):
    """Fetches a user profile by phone number."""
    if db is None: return None
    user = db.users.find_one({"phone": phone}, {'_id': False})
    return user

def save_user_data(user_data):
    """Creates or updates a user profile."""
    if db is None: return False
    db.users.replace_one(
        {"phone": user_data["phone"]}, 
        user_data, 
        upsert=True
    )
    return True

def delete_user(phone):
    """Deletes a user profile and all associated data."""
    if db is None: return False
    db.users.update_one({"phone": phone}, {"$set": {"accountStatus": "DELETED"}})
    db.transactions.delete_many({"userPhone": phone})
    db.contacts.delete_many({"userPhone": phone})
    db.admin_requests.delete_many({"userPhone": phone})
    return True

def get_transactions(phone):
    """Fetches all transactions associated with a user."""
    if db is None: return []
    txs = list(db.transactions.find({"userPhone": phone}, {'_id': False}).sort("timestamp", -1))
    return txs

def add_transaction(phone, transaction_data):
    """Adds a new transaction record for a user."""
    if db is None: return False
    transaction_data["userPhone"] = phone
    db.transactions.insert_one(transaction_data)
    return True

def get_contacts(phone):
    """Fetches saved contacts for a user."""
    if db is None: return []
    contacts = list(db.contacts.find({"userPhone": phone}, {'_id': False}))
    return contacts

def add_contact(phone, contact_data):
    """Adds a new contact for a user."""
    if db is None: return False
    contact_data["userPhone"] = phone
    db.contacts.update_one(
        {"userPhone": phone, "phone": contact_data["phone"]},
        {"$set": contact_data},
        upsert=True
    )
    return True

def get_all_users():
    if db is None: return []
    return list(db.users.find({}, {'_id': False}))

def get_admin_requests():
    if db is None: return []
    return list(db.admin_requests.find({}, {'_id': False}).sort("timestamp", -1))

def add_admin_request(req_data):
    if db is None: return False
    db.admin_requests.insert_one(req_data)
    return True

def update_admin_request(req_id, update_data):
    if db is None: return False
    db.admin_requests.update_one({"id": req_id}, {"$set": update_data})
    return True

def get_chat_messages(phone1, phone2):
    if db is None: return []
    query = {
        "$or": [
            {"senderPhone": phone1, "receiverPhone": phone2},
            {"senderPhone": phone2, "receiverPhone": phone1}
        ]
    }
    msgs = list(db.chat_messages.find(query, {'_id': False}).sort("timestamp", 1))
    return msgs

def add_chat_message(msg_data):
    if db is None: return False
    db.chat_messages.insert_one(msg_data)
    return True
