"""
model_utils.py
Contains shared AI logic for interacting with Google Gemini API safely.
Logic Implemented:
- Dynamically finding available models to bypass strict rate limits on experimental models.
- Safely extracting JSON blocks from unpredictable LLM text output using regular expressions.
"""
import google.generativeai as genai
import re
import json

def get_working_models():
    """Dynamically queries the API to find available text-generation models, prioritizing ones with high quotas."""
    try:
        available = [m.name.replace('models/', '') for m in genai.list_models() if 'generateContent' in m.supported_generation_methods]
        
        # Explicitly prioritize standard models (1500 RPM for flash) to avoid 429 quota errors on 2.5-flash
        models = ['gemini-1.5-flash', 'gemini-2.5-flash', 'gemini-1.5-pro', 'gemini-pro']
        
        for m in available:
            if 'vision' not in m and 'embedding' not in m and m not in models:
                models.append(m)
                
        return models
    except Exception as e:
        print(f"Failed to list models: {e}")
        return ['gemini-1.5-flash', 'gemini-pro']

def extract_json(text):
    """Safely extracts JSON payloads out of LLM responses that might contain conversational padding."""
    text = text.strip()
    match = re.search(r'```(?:json)?\s*(.*?)\s*```', text, re.DOTALL | re.IGNORECASE)
    if match:
        text = match.group(1).strip()
    
    if not text.startswith('{') and not text.startswith('['):
        start = text.find('{')
        end = text.rfind('}')
        if start != -1 and end != -1:
            text = text[start:end+1]
            
    return json.loads(text)
