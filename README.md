# 🎨 Mentora Design Assets

**The central repository for the visual identity and interactive logic of Mentora's educational courses.**

This repository serves as the "single source of truth" for the frontend assets used across our interactive learning modules. It ensures that all courses—whether Mathematics, Physics, or Life Sciences—maintain a consistent look, feel, and behavior for Moroccan students.

---

## 📂 Repository Structure

Here is how the assets are organized:

### 1. `/illustrations` 🖼️
**What's inside:** High-fidelity graphics used within the course content.
* **Purpose:** Visual explanations of concepts (e.g., a diagram of a cell, a physics slope, etc.).
* **Format:** Primarily `.svg` for scalability and `.png` for raster art.
* **Naming Convention:** `subject.svg` (e.g., `math.svg`).

### 2. `/icons` 🔹
**What's inside:** UI elements and navigation markers.
* **Purpose:** Buttons, progress indicators, and interactive markers within the course player.
* **Style:** Minimalist, accessible, and theme-compliant.

### 3. `/stylesheet` 💅
**What's inside:** The core CSS that powers the course layout.
* **Key File:** `style.css`.
* **Function:** Handles typography, responsive grids for mobile/desktop, and the specific color palette of Mentora.
* **Note:** This ensures that `<h1>`, `<blockquote>`, and interactive cards look the same in every module.

### 4. `/scripts` ⚡
**What's inside:** Vanilla JavaScript logic for course interactivity.
* **Function:** Handles the "active" parts of the learning experience:
    * Drag-and-drop logic.
    * Quiz validation (Client-side).
    * Interactive sliders and graph rendering.
* **Dependencies:** Designed to be lightweight with minimal external dependencies to ensure fast loading on all devices.

### 5. `/templates` 📄
**What's inside:** Pre-built HTML course templates ready to be populated with content.
* **Purpose:** Standardized structure for creating new courses with consistent sections (Theory, Activities, Exercises).
* **Key File:** `template.html` - A complete, production-ready course skeleton.
* **Function:** Provides the base framework with built-in accordion navigation, slide management, and interactive elements.
* **Usage:** Copy the template, replace placeholder content with your course material, and customize the title, color scheme, and subject illustration.
* **Note:** All templates are pre-linked to the stylesheets and scripts in this repository, ensuring instant design consistency.
---

## 🚀 Usage Guide

### Cloning the Assets
To use these assets in a specific course project or the main platform repo:

```bash
git clone [https://github.com/Mentora-Org/Mentora-Design.git](https://github.com/Mentora-Org/Mentora-Design.git)

```
