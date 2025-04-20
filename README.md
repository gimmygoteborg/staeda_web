# 🧹 Städa Web Version

A minimal, visual web app to help you **declutter** and **track your items** — so you don’t accidentally buy the same thing twice.

---

## 📌 Goal

- Replicate the existing iOS functionality in a lightweight web format.
- Store data **locally** with potential future online hosting.
- Use a **simple database** to manage metadata.

---

## 🧠 Why Städa?

- Helps you **understand what you already own**.
- No more duplicate purchases.
- Quickly recall an item while at the store — no digging required.

---

## 🛠️ Features

### ✅ Visual Grid Interface
- Grid layout with **square images** (max 250px).
- Display **at least 10 items per row**, scalable to **5000+ items**.

### 🖱️ Click & View
- Click an image to view a **larger version** (60% of screen height) with its description.
- Close via `X` button or by clicking outside.

### 🔀 Custom Sorting
- **Drag & drop sorting** using [SortableJS](https://github.com/SortableJS/Sortable).
- Sorting is **persisted** in a local database.

### 💾 Local Storage
- Images stored in a local `/images` folder.
- Metadata stored in a **JSON database**:
  - `image file name`
  - `image description`
  - `sort order`

---

python -m http.server

http://127.0.0.1:5000/

