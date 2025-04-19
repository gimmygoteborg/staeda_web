# bash script
# stat -f "%N | %SB" * > image_list.txt
# 



import json
import re
from datetime import datetime

# === Step 1: Read image_list.txt ===
with open("image_list.txt", "r", encoding="utf-8") as f:
    lines = f.readlines()

entries = []
for line in lines:
    if "|" in line:
        raw_filename, date_str = line.strip().split("|", 1)
        raw_filename = raw_filename.strip()
        date_str = date_str.strip()

        try:
            created = datetime.strptime(date_str, "%b %d %H:%M:%S %Y")

            # Sanitize filename: replace unsafe characters
            sanitized_filename = re.sub(r'[\\/*?:"<>|#]', "_", raw_filename)

            entries.append((raw_filename, sanitized_filename, created))
        except ValueError:
            print(f"⚠️ Skipping line with invalid date: {line.strip()}")

# === Step 2: Sort by creation date ===
entries.sort(key=lambda x: x[2])

# === Step 3: Create metadata.json structure
metadata = [
    {
        "filename": sanitized,
        "description": raw,
        "order": i
    }
    for i, (raw, sanitized, _) in enumerate(entries)
]

# === Step 4: Save to metadata.json
with open("metadata.json", "w", encoding="utf-8") as f:
    json.dump(metadata, f, indent=2, ensure_ascii=False)

print("✅ metadata.json created and sorted by date, with cleaned filenames!")
