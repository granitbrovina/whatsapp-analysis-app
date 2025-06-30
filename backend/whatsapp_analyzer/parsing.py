import pandas as pd
import re
from datetime import datetime

def parse_whatsapp_chat(file_content: str):
    """
    Parse WhatsApp chat export file content and convert to DataFrame.
    """
    lines = file_content.splitlines()
    pattern = r'\[(\d{1,2}[./]\d{1,2}[./]\d{2,4}, \d{1,2}:\d{2}:\d{2}(?:\s[AP]M)?)] ([^:]+): (.+)'
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
            
            try:
                if '.' in timestamp_str:
                    timestamp = datetime.strptime(timestamp_str, '%d.%m.%y, %H:%M:%S')
                else:
                    timestamp = datetime.strptime(timestamp_str, '%m/%d/%y, %I:%M:%S %p')
            except ValueError:
                continue

            data.append({
                'Time': timestamp,
                'Author': author,
                'Text': text
            })
    
    if not data:
        raise ValueError("Could not parse the chat file. Please ensure it is a valid WhatsApp export.")

    return pd.DataFrame(data)