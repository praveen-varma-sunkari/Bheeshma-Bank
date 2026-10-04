"""
fraud_agent.py
Logic Implemented:
Evaluates real-time transaction requests against user context (time, balance, history) 
using Google Gemini to flag potential fraudulent activity (SAFE, MEDIUM, HIGH).
"""
import google.generativeai as genai
import json
from .model_utils import get_working_models, extract_json

def run_fraud_check(transaction, user_context, api_key):
    if not api_key:
        return {"status": "SAFE", "reasoning": "No API key provided, bypassing AI agent check."}

    try:
        genai.configure(api_key=api_key)
        
        system_prompt = f"""You are the Aura Banking Autonomous AI Fraud Detective Agent.
Analyze the following transaction request given the user's current context.
Evaluate the risk level and determine if it is SAFE, MEDIUM (Suspicious), or HIGH (Likely Fraud).

User Context:
Name: {user_context.get('name')}
Recent Transactions: {user_context.get('recent_tx_str', 'None')}
Current Time: {user_context.get('current_time')}

Transaction Attempt:
Amount: {transaction.get('amount')}
Recipient: {transaction.get('recipient')}
Category: {transaction.get('category')}

Rules:
- CRITICAL: ANY transaction amount over 50000 MUST ALWAYS be flagged as HIGH risk, no exceptions.
- High amounts (e.g. over 10000) late at night should be HIGH or MEDIUM risk.
- Consecutive large transfers to the same recipient should be flagged as HIGH risk.
- Recurring patterns for small amounts or known payees might be SAFE.

Respond ONLY with a valid JSON object in this exact format:
{{"status": "SAFE" | "MEDIUM" | "HIGH", "reasoning": "1-sentence explanation of your decision."}}"""

        models_to_try = get_working_models()
        response = None
        errors = []

        for model_name in models_to_try:
            try:
                model = genai.GenerativeModel(model_name)
                response = model.generate_content(system_prompt + "\n\nEvaluate this transaction risk.")
                break
            except Exception as e:
                errors.append(f"{model_name} failed: {str(e)}")
                continue
                
        if not response:
            raise Exception(f"All models failed: {errors}")
            
        try:
            parsed_json = extract_json(response.text)
            return parsed_json
        except json.JSONDecodeError as e:
            raise Exception(f"JSON Parse Error: {str(e)}\nRaw Response: {response.text}")
    except Exception as e:
        print(f"Fraud Agent Error: {e}")
        return {"status": "SAFE", "reasoning": f"AI Agent unavailable: {str(e)}"}
