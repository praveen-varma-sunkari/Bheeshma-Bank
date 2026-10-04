import re
filepath = r'c:\Users\P Krishna Harsha\Desktop\FOAI_project_year2\src\components\LoanUnderwritingSystem.jsx'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

replacements = {
    # Dark backgrounds to light
    r"'#0a0714'": "'#f3f4f6'",
    r"'#1a1625'": "'#ffffff'",
    r"'#2d2442'": "'#f9fafb'",
    r"'#1e0938'": "'#f3f4f6'",
    r"'#381261'": "'#e5e7eb'",
    r"'#0f172a'": "'#ffffff'",
    r"'#1e293b'": "'#f8fafc'",
    r"'#111827'": "'#111827'", # Keep
    
    # Text colors dark to light
    r"'#e2e8f0'": "'#1f2937'",
    r"'#f8fafc'": "'#111827'",
    r"'#d1d5db'": "'#4b5563'",
    r"'#a78bfa'": "'#4f46e5'",
    r"'#8b5cf6'": "'#3b82f6'",
    r"'#c4b5fd'": "'#3b82f6'",
    
    # Gradients
    r"'linear-gradient\(135deg, #381261 0%, #1e0938 100%\)'": "'#ffffff'",
    r"'linear-gradient\(90deg, #8b3ff0, #00d2ff\)'": "'linear-gradient(90deg, #3b82f6, #00b875)'",
    r"'linear-gradient\(135deg, #8b3ff0, #00d2ff\)'": "'linear-gradient(135deg, #3b82f6, #00b875)'",
    
    # Borders and transparencies
    r"'rgba\(139, 63, 240, 0.4\)'": "'rgba(0,0,0,0.1)'",
    r"'rgba\(139, 63, 240, 0.1\)'": "'rgba(0,0,0,0.05)'",
    r"'rgba\(139, 63, 240, 0.2\)'": "'rgba(0,0,0,0.08)'",
    r"'rgba\(139, 63, 240, 0.3\)'": "'rgba(0,0,0,0.08)'",
    r"'rgba\(139, 63, 240, 0.15\)'": "'rgba(0,0,0,0.06)'",
    r"'rgba\(139, 63, 240, 0.05\)'": "'rgba(0,0,0,0.02)'",
    r"'rgba\(255,255,255,0.05\)'": "'rgba(0,0,0,0.05)'",
    r"'rgba\(255,255,255,0.08\)'": "'rgba(0,0,0,0.08)'",
    r"'rgba\(255,255,255,0.1\)'": "'rgba(0,0,0,0.1)'",
    r"'rgba\(255,255,255,0.2\)'": "'rgba(0,0,0,0.2)'",
    r"'rgba\(0,0,0,0.5\)'": "'rgba(0,0,0,0.05)'",
    
    # Text light mode explicitly
    r"'#000'": "'#111827'",
    r"'#ffffff'": "'#ffffff'",
    
    # Agent steps background in dark mode
    r"'rgba\(10, 7, 20, 0.75\)'": "'#f3f4f6'",
    r"'rgba\(0, 0, 0, 0.6\)'": "'rgba(255,255,255,0.9)'",
    r"'#06121e'": "'#ffffff'",
    r"'#070512'": "'#ffffff'"
}

new_content = content
for old, new in replacements.items():
    new_content = re.sub(old, new, new_content)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(new_content)
    print("Done")
