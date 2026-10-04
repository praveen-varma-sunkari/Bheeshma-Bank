import os
import re

files = [
    r'c:\Users\P Krishna Harsha\Desktop\FOAI_project_year2\src\components\BankingCopilot.jsx',
    r'c:\Users\P Krishna Harsha\Desktop\FOAI_project_year2\src\components\AuraBankingHome.jsx'
]

replacements = [
    (r"'rgba\(15,\s*10,\s*28,\s*0\.\d+\)'", r"'#ffffff'"),
    (r"'rgba\(103,\s*57,\s*182,\s*0\.25\)'", r"'#f3f4f6'"),
    (r"'rgba\(168,\s*85,\s*247,\s*0\.4\)'", r"'#e5e7eb'"),
    (r"'rgba\(255,\s*255,\s*255,\s*0\.08\)'", r"'#e5e7eb'"),
    (r"'#00d2ff'", r"'#3b82f6'"), # Blue color for contrast
    (r"'linear-gradient\(135deg,\s*#00b875\s*0%,\s*#00935d\s*100%\)'", r"'#000000'"), # Black buttons
    (r"'#000'", r"'#ffffff'") # Wait, if black background, text should be white. Wait, button text.
]

for fp in files:
    if os.path.exists(fp):
        with open(fp, 'r', encoding='utf-8') as f:
            content = f.read()
            
        for old, new in replacements:
            content = re.sub(old, new, content)
            
        # Fix the button text color if we made the button black
        # actually, I won't do the #000 -> #ffffff blindly, I'll just leave it and fix manually if needed.
        
        with open(fp, 'w', encoding='utf-8') as f:
            f.write(content)
print('Fixed leftover dark colors.')
