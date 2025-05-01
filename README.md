
# Flashkards-In-Komkavshiri

A browser-based Flashcard Learning App that supports hand gesture control via camera for hands-free practice! Designed as a browser extension, this app enables users to review, create, and categorize flashcards using either manual inputs or intuitive hand signals.

---

## Features

- Gesture-based flashcard rating (1 finger = Easy, 2 = Medium, 3 = Hard)
- Button-based interaction for traditional use
- Camera integration toggle for gesture detection
- Add new flashcards with custom content
- Browse all cards and categorized data
- Built to run as a browser extension (Vite + React + TypeScript + Tailwind)

---

## How to Run the Project

1. **Clone the repository**  
   ```bash
   git clone https://github.com/KIKUTA7/Flashkards-In-Komkavshiri
   ```

2. **Navigate into the project**  
   ```bash
   cd Flashkards-In-Komkavshiri
   ```

3. **Install dependencies from external module**  
   ```bash
   npm install https://github.com/KIKUTA7/komkavshirian-tagger --save
   ```

4. **Install project dependencies**  
   ```bash
   npm install --legacy-peer-deps
   ```

5. **Run the development server**  
   ```bash
   npm run dev
   ```

6. **Load as a browser extension**
   - Go to your browser's extensions page (`chrome://extensions/` for Chrome).
   - Enable **Developer Mode**.
   - Click **Load unpacked** and select the `dist/` directory.
   - The Flashkards extension is now ready for use.


---

## Team Contributions

### Elene Baiashvili
- Lead Designer: Directed the entire UI/UX development and component structure.
- Ensured accessibility and visual consistency across components.

### Papuna Mamageishvili
- Hand Gesture Integration: Fully responsible for camera control, gesture detection, and tuning detection logic.
- Maintained the interaction between camera states and app behavior.

### Beka Kikutadze
- Fullstack Developer: Built and connected card manipulation logic with gesture and UI layers.
- Managed state and logic for practice mode and score handling.

### Goga Gachechiladze
- Technical Architect: Set up project infrastructure and all browser extension configurations.
- Focused on performance optimization, dependency handling, and CI readiness.

---

## Final Notes

- Ideal for visually interactive learning, both hands-free and manual.
- To customize this extension:
  - Fork and clone the repository.
  - Edit `App.tsx` and `Index.tsx` for UI/content changes.
  - Build with `npm run build` and reload the unpacked extension.

Enjoy learning hands-free or hands-on!
