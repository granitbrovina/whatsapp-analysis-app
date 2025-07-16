import pandas as pd
import re
from datetime import datetime

# Language-specific patterns and date formats for WhatsApp exports
LANG_PATTERNS = {
    'en': {
        'pattern': r'\[(\d{1,2}[./]\d{1,2}[./]\d{2,4}, \d{1,2}:\d{2}:\d{2}(?:\s[AP]M)?)] ([^:]+): (.+)',
        'date_formats': ['%d.%m.%y, %H:%M:%S', '%m/%d/%y, %I:%M:%S %p']
    },
    'es': {
        'pattern': r'\[(\d{1,2}[./]\d{1,2}[./]\d{2,4}, \d{1,2}:\d{2}:\d{2}(?:\s[AP]M)?)] ([^:]+): (.+)',
        'date_formats': ['%d/%m/%y, %H:%M:%S', '%d/%m/%Y, %H:%M:%S']
    },
    'de': {
        'pattern': r'\[(\d{1,2}[./]\d{1,2}[./]\d{2,4}, \d{1,2}:\d{2}:\d{2}(?:\s[AP]M)?)] ([^:]+): (.+)',
        'date_formats': ['%d.%m.%y, %H:%M:%S', '%d.%m.%Y, %H:%M:%S']
    },
    'pt': {
        'pattern': r'\[(\d{1,2}[./]\d{1,2}[./]\d{2,4}, \d{1,2}:\d{2}:\d{2}(?:\s[AP]M)?)] ([^:]+): (.+)',
        'date_formats': ['%d/%m/%y, %H:%M:%S', '%d/%m/%Y, %H:%M:%S']
    },
    'it': {
        'pattern': r'\[(\d{1,2}[./]\d{1,2}[./]\d{2,4}, \d{1,2}:\d{2}:\d{2}(?:\s[AP]M)?)] ([^:]+): (.+)',
        'date_formats': ['%d/%m/%y, %H:%M:%S', '%d/%m/%Y, %H:%M:%S']
    },
}

def parse_whatsapp_chat(file_content: str, language: str = 'en'):
    """
    Parse WhatsApp chat export file content and convert to DataFrame.
    Language-specific for date/time and message format.
    """
    lines = file_content.splitlines()
    lang = language if language in LANG_PATTERNS else 'en'
    pattern = LANG_PATTERNS[lang]['pattern']
    date_formats = LANG_PATTERNS[lang]['date_formats']
    data = []
    
    for line in lines:
        # --- THIS IS THE FIX ---
        # Remove invisible left-to-right mark and strip whitespace
        cleaned_line = line.replace('\u200e', '').strip()
        
        match = re.match(pattern, cleaned_line)
        if match:
            timestamp_str = match.group(1)
            author = match.group(2).strip()
            text = match.group(3).strip()
            timestamp = None
            for fmt in date_formats:
                try:
                    timestamp = datetime.strptime(timestamp_str, fmt)
                    break
                except ValueError:
                    continue
            if timestamp is None:
                continue

            data.append({
                'Time': timestamp,
                'Author': author,
                'Text': text
            })
    
    if not data:
        raise ValueError("Could not parse the chat file. Please ensure it is a valid WhatsApp export.")

    return pd.DataFrame(data)