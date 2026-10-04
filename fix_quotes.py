import os
import re

files = [
    r'c:\Users\P Krishna Harsha\Desktop\FOAI_project_year2\src\components\AuraBankingHome.jsx',
    r'c:\Users\P Krishna Harsha\Desktop\FOAI_project_year2\src\components\BankingCopilot.jsx',
    r'c:\Users\P Krishna Harsha\Desktop\FOAI_project_year2\src\components\AdminDashboard.jsx',
    r'c:\Users\P Krishna Harsha\Desktop\FOAI_project_year2\src\components\AuraWelcomeAuth.jsx'
]

for fp in files:
    if os.path.exists(fp):
        with open(fp, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Fix the double quotes issue introduced by the previous script
        content = re.sub(r"''#ffffff''", r"'#ffffff'", content)
        content = re.sub(r"''#f9fafb''", r"'#f9fafb'", content)
        
        with open(fp, 'w', encoding='utf-8') as f:
            f.write(content)
print('Fixed quotes.')
