import json
import time

with open("metadata.json", "r", encoding="utf-8") as f:
    data = json.load(f)

# Assign IDs if missing
for i, item in enumerate(data):
    if "id" not in item:
        item["id"] = f"img_{int(time.time() * 1000)}_{i}"

# Save it back
with open("metadata.json", "w", encoding="utf-8") as f:
    json.dump(data, f, indent=2, ensure_ascii=False)

print("✅ IDs added to metadata.json")
