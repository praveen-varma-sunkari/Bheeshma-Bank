import re
import glob

files = glob.glob(r'c:\Users\P Krishna Harsha\Desktop\FOAI_project_year2\src\components\*Modal.jsx')
files.append(r'c:\Users\P Krishna Harsha\Desktop\FOAI_project_year2\src\components\AuraWelcomeAuth.jsx')

replacements = {
    # Borders and Shadows
    r"rgba\(0, 240, 255, 0.3\)": "rgba(0, 0, 0, 0.1)",
    r"rgba\(255, 255, 255, 0.1\)": "rgba(0, 0, 0, 0.1)",
    r"rgba\(255,255,255,0.15\)": "rgba(0, 0, 0, 0.15)",
    r"rgba\(255,255,255,0.1\)": "rgba(0, 0, 0, 0.1)",
    r"rgba\(255, 255, 255, 0.05\)": "rgba(0, 0, 0, 0.05)",
    r"rgba\(255,255,255,0.05\)": "rgba(0, 0, 0, 0.05)",
    r"rgba\(0, 240, 255, 0.15\)": "rgba(0,0,0,0.05)",
}

for filepath in files:
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
            
        new_content = content
        for old, new in replacements.items():
            new_content = re.sub(old, new, new_content)
            
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f'Processed {filepath}')
    except Exception as e:
        print(f'Failed {filepath}: {e}')
