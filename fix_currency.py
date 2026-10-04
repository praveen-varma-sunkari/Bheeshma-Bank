import os
import re

def process_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    new_content = re.sub(r'\$(?!\{)', '₹', content)
    new_content = new_content.replace('usd', 'inr').replace('dollars', 'rupees')
    new_content = new_content.replace('USD', 'INR').replace('Dollars', 'Rupees')
    
    if new_content != content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f'Updated {filepath}')

for root, _, files in os.walk('src'):
    for file in files:
        if file.endswith('.jsx') or file.endswith('.js'):
            process_file(os.path.join(root, file))
