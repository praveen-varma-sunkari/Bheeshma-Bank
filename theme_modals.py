import re
import glob

files = glob.glob(r'c:\Users\P Krishna Harsha\Desktop\FOAI_project_year2\src\components\*Modal.jsx')
files.append(r'c:\Users\P Krishna Harsha\Desktop\FOAI_project_year2\src\components\AuraWelcomeAuth.jsx')

replacements = {
    # Dark backgrounds to light
    r"'#131b26'": "'#ffffff'",
    r"'#0a0714'": "'#ffffff'",
    r"'#1a1625'": "'#f3f4f6'",
    r"'#111827'": "'#ffffff'",
    r"'rgba\(19, 27, 38, 0.9\)'": "'rgba(255, 255, 255, 0.95)'",
    r"'rgba\(0, 0, 0, 0.85\)'": "'rgba(0, 0, 0, 0.4)'",
    r"'rgba\(10, 7, 20, 0.9\)'": "'rgba(255, 255, 255, 0.95)'",
    
    # Text colors
    r"'#f8fafc'": "'#111827'",
    r"'#e2e8f0'": "'#1f2937'",
    r"'#d1d5db'": "'#4b5563'",
    r"color: '#000000'": "color: '#111827'",
    r"color: '#000'": "color: '#111827'",
    
    # Borders
    r"'rgba\(0, 240, 255, 0.3\)'": "'rgba(0, 0, 0, 0.1)'",
    r"'rgba\(255,255,255,0.1\)'": "'rgba(0, 0, 0, 0.1)'",
    r"'rgba\(255,255,255,0.15\)'": "'rgba(0, 0, 0, 0.15)'",
    r"'rgba\(255, 255, 255, 0.1\)'": "'rgba(0, 0, 0, 0.1)'",
    
    # Box shadows
    r"'0 25px 70px rgba\(0,0,0,0.8\), 0 0 35px rgba\(0, 240, 255, 0.15\)'": "'0 25px 50px rgba(0,0,0,0.1)'",
    
    # Input background
    r"'rgba\(0, 0, 0, 0.03\)'": "'#f9fafb'",
    r"'rgba\(0,0,0,0.3\)'": "'#f3f4f6'",
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
