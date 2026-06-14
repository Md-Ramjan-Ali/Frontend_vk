# Interactive Company Workflow Canvas (Static HTML/CSS/JS)

This is a clean, converted version of the workflow canvas design. It contains only static files without React, Node.js, or any bundler setup, ensuring fast execution and zero dependencies.

## File Structure

- `index.html`: The main markup structure with fully resolved SVG paths and absolute layouts.
- `style.css`: The complete bundled CSS style rules (including Google Fonts).
- `script.js`: Handlers for side drawer opening and closing functionality.

## How to Run

1. **Option 1 (Direct Open)**: Double-click `index.html` in your file explorer to open the interactive canvas directly in any web browser.
2. **Option 2 (Local Server)**: If you prefer to serve the files (e.g. using VS Code Live Server or python http.server), you can run:
   ```bash
   python -m http.server 8000
   ```
   Then navigate to `http://localhost:8000`.

## Interactive Features

- Click on any **Task node** (`T1`-`T6`) or **Gateway node** (`G1`-`G8`) to slide out the right-hand details drawer.
- Click on the **Close button** (circle icon at top-right of the drawer) to dismiss the details drawer.