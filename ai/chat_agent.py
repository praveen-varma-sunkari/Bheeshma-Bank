"""
chat_agent.py
Logic Implemented:
Handles the conversational interface for the AI Wealth Copilot. 
It uses a deterministic fallback (Regex) if no API key is provided, 
and otherwise uses Google Gemini to generate natural language responses 
and JSON transfer payloads for the frontend UI.
"""
import google.generativeai as genai
import json
import re
from .model_utils import get_working_models, extract_json

def run_chat_agent(user_input, state, api_key):
    lower_input = user_input.lower()
    
    # 1. LOCAL REACT ENGINE (Deterministic Rules)
    transfer_pattern = re.compile(r'(?:transfer|pay|send)\s+(?:to\s+)?([a-z0-9\s.@]+?)\s+(?:rs|₹|inr)?\s*(\d+(?:\.\d{1,2})?)', re.IGNORECASE)
    transfer_pattern_alt = re.compile(r'(?:transfer|pay|send)\s+(?:rs|₹|inr)?\s*(\d+(?:\.\d{1,2})?)\s+(?:to\s+)?([a-z0-9\s.@]+)', re.IGNORECASE)
    
    match = transfer_pattern_alt.search(lower_input) or transfer_pattern.search(lower_input)
    
    if match:
        if match.group(1).replace('.', '', 1).isdigit():
            amount = float(match.group(1))
            recipient_name = match.group(2).strip()
        else:
            recipient_name = match.group(1).strip()
            amount = float(match.group(2))
            
        contacts = state.get('contacts', [])
        matched_contact = next((c for c in contacts if recipient_name.lower() in c.get('name', '').lower()), None)
        
        if not matched_contact:
            return {
                "role": "assistant",
                "content": f"⚠️ **Contact Not Found**\n\nI can only process AI transfers to your saved contacts. For new recipients like '{recipient_name}', please use the manual transfer feature.",
                "actionRequired": None
            }
            
        accounts = state.get('user', {}).get('accounts', [])
        primary_acc = next((a for a in accounts if a.get('isPrimary')), accounts[0] if accounts else None)
        
        if not primary_acc:
            return {
                "role": "assistant",
                "content": "⚠️ **No Bank Account Found**\n\nYou need to open an Aura Bank Account before you can transfer money.",
                "actionRequired": None
            }
            
        if primary_acc.get('balance', 0) < amount:
            return {
                "role": "assistant",
                "content": f"⚠️ **Insufficient Balance**\n\nYou requested to send **₹{amount}** to **{matched_contact['name']}**, but your primary account only has **₹{primary_acc.get('balance', 0)}** available.",
                "actionRequired": None
            }
            
        # Fallback to local deterministic if no API key
        if not api_key:
            return {
                "role": "assistant",
                "content": f"I have prepared the transfer of ₹{amount} to {matched_contact['name']}. Please confirm to proceed.",
                "actionRequired": "AUTHORIZE_TRANSFER",
                "transferPayload": {
                    "amount": amount,
                    "recipient": matched_contact,
                    "note": "Payment via Python AI",
                    "sourceAccount": primary_acc
                },
                "agentSteps": [{"agent": "Python Copilot", "step": "Local Intent Parse", "detail": f"Matched transfer of ₹{amount}"}]
            }
            
    # 2. GENERATIVE AI (Google Gemini)
    if api_key:
        try:
            genai.configure(api_key=api_key)
            accounts = state.get('user', {}).get('accounts', [])
            primary_acc = next((a for a in accounts if a.get('isPrimary')), accounts[0] if accounts else None)
            balance_str = f"₹{primary_acc.get('balance', 0)}" if primary_acc else "No active bank account"
            
            transactions = state.get('transactions', [])
            tx_strs = []
            for t in transactions:
                date_str = t.get('date') or t.get('timestamp') or 'Unknown'
                tx_strs.append(f"- {date_str}: {t.get('title', 'Transaction')} ({t.get('type', 'Unknown')}) for ₹{t.get('amount', 0)}")
            recent_tx_str = "\n".join(tx_strs) if tx_strs else "No recent transactions."

            saved_contacts_str = ", ".join([c.get('name', 'Unknown') for c in state.get('contacts', [])]) if state.get('contacts') else "None"

            system_prompt = f"""You are the autonomous AI Wealth & Banking Copilot for {state.get('user', {}).get('name', 'User')} on the Aura Banking advanced platform.
Current primary bank balance: {balance_str}.
Monthly salary: ₹{state.get('user', {}).get('monthlyIncome', 0)}.
Saved Contacts: {saved_contacts_str}
Recent Transactions:
{recent_tx_str}

You MUST respond strictly in valid JSON format with no markdown wrappers or backticks. Your JSON must follow this exact structure:
{{
  "content": "Your rich markdown text response to the user",
  "actionRequired": "AUTHORIZE_TRANSFER" | null,
  "transferPayload": {{ "amount": number, "recipient": {{ "name": "string", "upiId": "string" }}, "note": "string", "sourceAccount": {{ "bankName": "string" }} }} | null
}}

RULES:
1. If the user asks to transfer or pay money, set actionRequired to "AUTHORIZE_TRANSFER" and populate transferPayload.
2. CRITICAL SECURITY RULE: You can ONLY process transfers to recipients listed in 'Saved Contacts'. If the user asks to transfer to someone not in their Saved Contacts, refuse the transfer, set actionRequired to null, and instruct them to use manual transfer for new numbers.
3. For general chat, analysis, or balance checks, set actionRequired and transferPayload to null.
4. Keep content concise, helpful, and mathematically precise."""

            models_to_try = get_working_models()
            response = None
            
            for model_name in models_to_try:
                try:
                    model = genai.GenerativeModel(model_name)
                    response = model.generate_content(f"{system_prompt}\n\nUser request: {user_input}")
                    break
                except Exception as e:
                    print(f"Failed {model_name}: {e}", flush=True)
                    continue
                    
            if not response:
                return {
                    "role": "assistant",
                    "content": "⚠️ **Gemini API Error**\n\nThe AI engine failed to process the request. Your API key might be invalid, or you may have exceeded your rate limits (Quota Exceeded). Please check your Gemini API dashboard or try again in a minute.",
                    "actionRequired": None,
                    "transferPayload": None,
                    "agentSteps": [{"agent": "System", "step": "API Check", "detail": "All Gemini models threw an exception. Likely rate limited or invalid key."}]
                }
                
            try:
                parsed_json = extract_json(response.text)
                
                if parsed_json.get('transferPayload') and primary_acc:
                    parsed_json['transferPayload']['sourceAccount'] = primary_acc
                    
                return {
                    "role": "assistant",
                    "content": parsed_json.get('content', "Sorry, I couldn't understand that."),
                    "actionRequired": parsed_json.get('actionRequired'),
                    "transferPayload": parsed_json.get('transferPayload'),
                    "agentSteps": [{"agent": "Python Gemini SDK", "step": "LLM API Call", "detail": "Processed live prompt via Python Google Generative AI API"}]
                }
            except json.JSONDecodeError as e:
                return {
                    "role": "assistant",
                    "content": response.text,
                    "actionRequired": None,
                    "agentSteps": [{"agent": "Python Gemini SDK", "step": "LLM API Call", "detail": "Non-JSON response received"}]
                }
                
        except Exception as e:
            return {
                "role": "assistant",
                "content": f"⚠️ **Gemini API Error**\n\nAn unexpected error occurred while communicating with Google Gemini: {str(e)}",
                "actionRequired": None,
                "agentSteps": [{"agent": "System", "step": "Error", "detail": str(e)}]
            }

    # 3. FALLBACK FOR NO API KEY OR API ERROR
    return {
        "role": "assistant",
        "content": "⚠️ **Gemini AI Required**\n\nTo answer this question, you must provide a valid Google Gemini API Key in the settings (cog icon). The offline fallback engine has been disabled per your request, so Gemini AI is now the ONLY engine allowed to answer.",
        "actionRequired": None,
        "transferPayload": None,
        "agentSteps": [{"agent": "System", "step": "API Key Check", "detail": "Gemini API Key missing or invalid"}]
    }
