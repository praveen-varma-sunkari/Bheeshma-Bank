import os

def replace_in_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    new_content = content.replace("Advanced Banking & Autonomous Financial OS", "Autonomous Banking & Multi-Agent Engine")
    new_content = new_content.replace("ADVANCED BANKING", "AUTONOMOUS BANKING")
    new_content = new_content.replace("Aura Banking", "Bheeshma Bank")
    new_content = new_content.replace("Aura Bank", "Bheeshma Bank")
    new_content = new_content.replace("AuraPay", "BheeshmaPay")
    new_content = new_content.replace("Aura", "Bheeshma")
    new_content = new_content.replace("aura", "bheeshma")
    new_content = new_content.replace("AURA", "BHEESHMA")

    if new_content != content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"Updated {filepath}")

def main():
    frontend_dir = r"c:\Users\PRAVEEN VARMA\OneDrive\Desktop\FAI_P1\frontend"
    for root, dirs, files in os.walk(frontend_dir):
        if "node_modules" in root or "dist" in root:
            continue
        for file in files:
            if file.endswith((".js", ".jsx", ".html", ".css")):
                replace_in_file(os.path.join(root, file))

    backend_dir = r"c:\Users\PRAVEEN VARMA\OneDrive\Desktop\FAI_P1\backend"
    for root, dirs, files in os.walk(backend_dir):
        if "__pycache__" in root:
            continue
        for file in files:
            if file.endswith((".py", ".txt", ".md")):
                replace_in_file(os.path.join(root, file))

if __name__ == '__main__':
    main()
