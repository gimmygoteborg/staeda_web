from flask import Flask, request, send_from_directory, jsonify
import os, json
from werkzeug.utils import secure_filename

app = Flask(__name__)
UPLOAD_FOLDER = 'images'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

@app.route('/')
def home():
    return send_from_directory('.', 'index.html')

@app.route('/static/<path:path>')
def send_static(path):
    return send_from_directory('static', path)

@app.route('/images/<path:path>')
def send_image(path):
    return send_from_directory('images', path)

@app.route('/metadata.json')
def metadata():
    with open('metadata.json') as f:
        return f.read()

@app.route('/upload', methods=['POST'])
def upload_file():
    file = request.files['image']
    description = request.form['description']
    filename = secure_filename(file.filename)
    filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
    file.save(filepath)

    with open('metadata.json') as f:
        metadata = json.load(f)
    new_item = {
        "filename": filename,
        "description": description,
        "order": len(metadata)
    }
    metadata.append(new_item)
    with open('metadata.json', 'w') as f:
        json.dump(metadata, f, indent=2)
    return 'OK'

@app.route('/save', methods=['POST'])
def save_metadata():
    metadata = request.json
    with open('metadata.json', 'w') as f:
        json.dump(metadata, f, indent=2)
    return 'Saved'

@app.route('/delete', methods=['POST'])
def delete_image():
    data = request.json
    delete_id = data.get('id')

    with open("metadata.json", "r", encoding="utf-8") as f:
        metadata = json.load(f)

    # Find the item to delete by ID
    item_to_delete = next((item for item in metadata if item["id"] == delete_id), None)

    if item_to_delete:
        # Only delete the file if it's not a shared blank image
        if not item_to_delete["filename"].startswith("blank_dots3"):
            image_path = os.path.join(app.config['UPLOAD_FOLDER'], item_to_delete["filename"])
            if os.path.exists(image_path):
                os.remove(image_path)

        # Remove the entry
        metadata = [item for item in metadata if item["id"] != delete_id]

        # Recalculate order
        for i, item in enumerate(metadata):
            item["order"] = i

        with open("metadata.json", "w", encoding="utf-8") as f:
            json.dump(metadata, f, indent=2, ensure_ascii=False)

        return "Deleted"

    return "Item not found", 404


if __name__ == '__main__':
    app.run(debug=True)
