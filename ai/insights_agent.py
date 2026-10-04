"""
insights_agent.py
Logic Implemented:
Analyzes the user's transaction history to generate personalized spending insights,
category distributions, and "waste tracker" recommendations using Google Gemini.
"""
import google.generativeai as genai
import json
from .model_utils import get_working_models, extract_json

def run_insights_agent(transactions, user_context, api_key):
    if not api_key:
        raise ValueError("No API key provided")

    try:
        genai.configure(api_key=api_key)
        
        # Summarize transactions to save tokens
        tx_summary = "\n".join([f"- {t.get('timestamp', 'Unknown')}: {t.get('type', 'debit').upper()} ₹{t.get('amount', 0)} for '{t.get('title')}' ({t.get('category')})" for t in transactions[:50]])
        
        system_prompt = f"""You are the Aura Banking AI Financial Analyst.
Analyze the user's REAL transaction history and generate personalized dashboard insights.

User Context: Name: {user_context.get('name')} | Balance: {user_context.get('balance')}
Transactions (Last 30):
{tx_summary if tx_summary else "No recent transactions found."}

Generate a strict JSON response with EXACTLY this schema:
{{
  "fraudAlerts": [
    {{ "id": 1, "type": "HIGH"|"MEDIUM"|"SAFE", "title": "String", "desc": "String", "time": "String (e.g. '2 mins ago')" }}
  ],
  "dailyExpenses": {{
    "trackedSpend": "String (e.g. $124.50)",
    "trendStr": "String (e.g. '+12% vs 7-day avg')",
    "distribution": [
      {{ "name": "Category Name", "percent": "String (e.g. '45%')", "color": "Hex color code", "iconName": "Coffee"|"ShoppingBag"|"Home"|"Activity" }}
    ],
    "recentOutflows": [
      {{ "name": "Merchant", "amount": "String", "time": "String" }}
    ]
  }},
  "wasteTracker": {{
    "potentialSavings": "String (e.g. $185.00)",
    "insights": [
      {{ "type": "CREEP"|"SUBSCRIPTION", "title": "String", "desc": "String" }}
    ]
  }}
}}

CRITICAL INSTRUCTIONS:
- ONLY invent fraud alerts if you see suspicious patterns (like sudden huge transfers > ₹50,000). Any transaction over ₹50,000 MUST generate a HIGH fraud alert! If the history is normal or empty, return an empty array [] for fraudAlerts!
- Base the tracked expenses strictly on ALL the provided transactions (sum up ALL the debits provided). Do not restrict it to just 'today'.
- Invent realistic but data-driven 'wasteTracker' insights (e.g. if they spent a lot on Food & Dining, warn them about lifestyle creep).
- Output valid JSON only, no markdown formatting.
"""

        models_to_try = get_working_models()
        response = None
        errors = []

        for model_name in models_to_try:
            try:
                model = genai.GenerativeModel(model_name)
                response = model.generate_content(system_prompt + "\n\nGenerate AI Financial Insights JSON.")
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
        print(f"AI Insights Error: {e}")
        raise e
