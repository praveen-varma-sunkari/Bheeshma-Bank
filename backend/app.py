"""
app.py
Logic Implemented:
This is the core Python backend. It handles all HTTP routing and global configuration,
acting as a bridge between the frontend React application and the AI agents.
It imports specific AI logic from the root `ai/` folder.
"""
from flask import Flask, request, jsonify
from flask_cors import CORS
import sys
import os

# Add root folder to sys.path so we can import the 'ai' module
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from ai import run_chat_agent, run_fraud_check, run_insights_agent

from dotenv import load_dotenv
import database

# Load MongoDB connection string from .env
load_dotenv()
mongo_uri = os.getenv("MONGO_URI")
if mongo_uri:
    database.init_db(mongo_uri)

app = Flask(__name__)
CORS(app)

# Global configuration to allow a single API key to be shared across all users/browsers
GLOBAL_CONFIG = {
    "gemini_api_key": ""
}

@app.route('/api/settings', methods=['POST'])
def update_settings():
    data = request.json
    if 'apiKey' in data:
        GLOBAL_CONFIG["gemini_api_key"] = data['apiKey']
    return jsonify({"status": "ok", "message": "Settings updated globally."})

# ----------------- DATABASE ENDPOINTS -----------------

@app.route('/api/user', methods=['GET', 'POST', 'DELETE'])
def handle_user():
    if request.method == 'GET':
        phone = request.args.get('phone')
        print(f"PHONE REQUESTED: {repr(phone)}", flush=True)
        user = database.get_user_data(phone)
        if user:
            return jsonify(user), 200
        return jsonify({"error": "User not found"}), 404
    elif request.method == 'DELETE':
        phone = request.args.get('phone')
        success = database.delete_user(phone)
        return jsonify({"success": success})
    else:
        user_data = request.json
        success = database.save_user_data(user_data)
        return jsonify({"success": success})

@app.route('/api/transactions', methods=['GET', 'POST'])
def handle_transactions():
    if request.method == 'GET':
        phone = request.args.get('phone')
        txs = database.get_transactions(phone)
        return jsonify(txs)
    else:
        data = request.json
        phone = data.get('phone')
        tx_data = data.get('transaction')
        success = database.add_transaction(phone, tx_data)
        return jsonify({"success": success})

@app.route('/api/contacts', methods=['GET', 'POST'])
def handle_contacts():
    if request.method == 'GET':
        phone = request.args.get('phone')
        contacts = database.get_contacts(phone)
        return jsonify(contacts)
    else:
        data = request.json
        phone = data.get('phone')
        contact_data = data.get('contact')
        success = database.add_contact(phone, contact_data)
        return jsonify({"success": success})

@app.route('/api/admin/users', methods=['GET'])
def handle_admin_users():
    users = database.get_all_users()
    return jsonify(users)

@app.route('/api/admin/requests', methods=['GET', 'POST', 'PUT'])
def handle_admin_requests():
    if request.method == 'GET':
        reqs = database.get_admin_requests()
        return jsonify(reqs)
    elif request.method == 'POST':
        req_data = request.json
        success = database.add_admin_request(req_data)
        return jsonify({"success": success})
    else:
        data = request.json
        req_id = data.get('id')
        update_data = data.get('update_data')
        success = database.update_admin_request(req_id, update_data)
        return jsonify({"success": success})

@app.route('/api/wipe', methods=['POST'])
def handle_wipe():
    if database.db is not None:
        database.db.users.delete_many({})
        database.db.transactions.delete_many({})
        database.db.contacts.delete_many({})
        database.db.admin_requests.delete_many({})
        database.db.chat_messages.delete_many({})
    return jsonify({"success": True})

@app.route('/api/p2p-chat', methods=['GET', 'POST'])
def handle_p2p_chat():
    if request.method == 'GET':
        phone1 = request.args.get('phone1')
        phone2 = request.args.get('phone2')
        msgs = database.get_chat_messages(phone1, phone2)
        return jsonify(msgs)
    else:
        msg_data = request.json
        success = database.add_chat_message(msg_data)
        return jsonify({"success": success})

# ----------------- AI ENDPOINTS -----------------

@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({"status": "ok", "message": "Bheeshma Bank Python Backend is running!"})

@app.route('/api/chat', methods=['POST'])
def chat():
    data = request.json
    user_input = data.get('userInput', '').strip()
    state = data.get('state', {})
    api_key = data.get('apiKey', '') or GLOBAL_CONFIG["gemini_api_key"]
    
    print(f"\n--- NEW REQUEST ---", flush=True)
    print(f"User Input: {user_input}", flush=True)
    print(f"API Key Received: '{api_key}' (Length: {len(api_key)})", flush=True)

    if not user_input:
        return jsonify({"error": "No input provided"}), 400

    # Delegate core chat & LLM logic to the AI module
    response_payload = run_chat_agent(user_input, state, api_key)
    return jsonify(response_payload)

@app.route('/api/fraud-check', methods=['POST'])
def fraud_check():
    data = request.json
    api_key = data.get('apiKey', '') or GLOBAL_CONFIG["gemini_api_key"]
    transaction = data.get('transaction', {})
    user_context = data.get('userContext', {})
    
    # Delegate fraud rules & Gemini logic to the AI module
    response_payload = run_fraud_check(transaction, user_context, api_key)
    return jsonify(response_payload)

@app.route('/api/ai-insights', methods=['POST'])
def ai_insights():
    data = request.json
    api_key = data.get('apiKey', '') or GLOBAL_CONFIG["gemini_api_key"]
    transactions = data.get('transactions', [])
    user_context = data.get('userContext', {})
    
    if not api_key:
        return jsonify({"error": "No API key provided"}), 400

    try:
        # Delegate analytical insights & Gemini logic to the AI module
        response_payload = run_insights_agent(transactions, user_context, api_key)
        return jsonify(response_payload)
    except Exception as e:
        error_msg = str(e).encode('ascii', 'replace').decode('ascii')
        print(f"AI Insights Route Error: {error_msg}")
        return jsonify({"error": "An error occurred"}), 500

if __name__ == '__main__':
    app.run(port=5000, debug=True)
