import os
import re

files = [
    r'c:\Users\P Krishna Harsha\Desktop\FOAI_project_year2\src\components\AuraBankingHome.jsx',
    r'c:\Users\P Krishna Harsha\Desktop\FOAI_project_year2\src\components\BankingCopilot.jsx'
]

# We want to replace dark grays, dark backgrounds, and light text on those backgrounds.
# Based on the screenshot: 
# 1. Copilot chat bubbles: The dark gray looks like `#1f2937` or `rgba(31, 41, 55, ...)`
# 2. Input box at the bottom.
# 3. Pills in AuraBankingHome (e.g., Global Transfer).
# Since these could be written in various ways, let's aggressively replace common dark Tailwind/CSS colors to light ones.
# Also fix text colors: #fff -> #111827 or #000

replacements = [
    # Backgrounds
    (r"background:\s*'#1f2937'", r"background: '#f9fafb'"),
    (r"background:\s*'#111827'", r"background: '#ffffff'"),
    (r"background:\s*'rgba\(15,\s*10,\s*28,\s*0\.7\)'", r"background: '#ffffff'"),
    (r"background:\s*'#130e24'", r"background: '#ffffff'"),
    (r"background:\s*'#0d091a'", r"background: '#f9fafb'"),
    (r"background:\s*'rgba\(31,\s*41,\s*55,\s*0\.\d+\)'", r"background: '#f3f4f6'"),
    (r"background:\s*'rgba\(0,\s*0,\s*0,\s*0\.8\)'", r"background: '#f9fafb'"),
    (r"background:\s*'rgba\(0,\s*0,\s*0,\s*0\.5\)'", r"background: '#f3f4f6'"),
    (r"background:\s*'rgba\(14,\s*20,\s*32,\s*0\.\d+\)'", r"background: '#ffffff'"),
    (r"background:\s*'rgba\(255,\s*255,\s*255,\s*0\.1\)'", r"background: '#f3f4f6'"),
    (r"background:\s*'rgba\(255,\s*255,\s*255,\s*0\.05\)'", r"background: '#f9fafb'"),
    (r"background:\s*'linear-gradient\(135deg,\s*#1f2937\s*0%,\s*#111827\s*100%\)'", r"background: '#ffffff'"),
    (r"background:\s*'#374151'", r"background: '#f3f4f6'"),
    (r"background:\s*'rgba\(24,\s*24,\s*27,\s*1\)'", r"background: '#ffffff'"),
    (r"backgroundColor:\s*'#111827'", r"backgroundColor: '#ffffff'"),
    
    # Texts
    (r"color:\s*'rgba\(255,\s*255,\s*255,\s*0\.7\)'", r"color: '#6b7280'"),
    (r"color:\s*'rgba\(255,\s*255,\s*255,\s*0\.5\)'", r"color: '#9ca3af'"),
    (r"color:\s*'#fff'", r"color: '#111827'"),
    (r"color:\s*'#ffffff'", r"color: '#111827'"),
    (r"color:\s*'white'", r"color: '#111827'"),
    (r"color:\s*'#f3f4f6'", r"color: '#374151'"),
    (r"color:\s*'#e5e7eb'", r"color: '#4b5563'"),
    (r"color:\s*'#d1d5db'", r"color: '#4b5563'"),
    (r"color:\s*'#9ca3af'", r"color: '#6b7280'"), # Deepen gray text slightly for contrast
]

for fp in files:
    if os.path.exists(fp):
        with open(fp, 'r', encoding='utf-8') as f:
            content = f.read()
            
        for old, new in replacements:
            content = re.sub(old, new, content, flags=re.IGNORECASE)
            
        with open(fp, 'w', encoding='utf-8') as f:
            f.write(content)
print('Fixed leftover dark colors.')
