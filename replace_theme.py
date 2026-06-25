import re

files = [
    r"e:\Socrates\components\overview.tsx",
    r"e:\Socrates\components\demographics.tsx",
    r"e:\Socrates\components\complaints.tsx",
    r"e:\Socrates\components\diagnosis-management.tsx",
    r"e:\Socrates\components\suggestion-input.tsx"
]

def map_shade(prefix, shade):
    if shade == '950': return 'slate-50'
    if shade == '900':
        if 'bg' in prefix: return 'white'
        else: return 'slate-100'
    if shade == '800': return 'slate-200'
    if shade == '700': return 'slate-300'
    if shade == '600': return 'slate-400'
    if shade == '500': return 'slate-600'
    if shade == '400': return 'slate-500'
    if shade == '300': return 'slate-700'
    if shade == '200': return 'slate-800'
    if shade == '100': return 'slate-900'
    if shade == '50': return 'slate-950'
    return f"slate-{shade}"

def replace_class(match):
    full_match = match.group(0)
    
    if 'dark:' in full_match:
        return full_match

    prefix = match.group(1)
    shade = match.group(2)
    opacity = match.group(3) or ''

    light_shade = map_shade(prefix, shade)
    light_class = f"{prefix}{light_shade}{opacity}"
    dark_class = f"dark:{full_match}"

    return f"{light_class} {dark_class}"

pattern = re.compile(r'(?<![a-zA-Z0-9-])([a-z:-]*?(?:bg|text|border|placeholder|ring|divide|shadow)-)slate-(\d+)(/[0-9]+)?(?![a-zA-Z0-9-])')

for filepath in files:
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    new_content = pattern.sub(replace_class, content)
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(new_content)

print("Replacement complete.")
