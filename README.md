# Chandresh-Portfolio-Website

A high-end, cinematic personal portfolio website built with pure Vanilla web technologies. It features smooth scrollytelling, interactive 3D elements, and modern UI/UX design principles inspired by Awwwards-winning websites.

## 🚀 Live Demo
[View Live Site](https://Chandresh-Sharma-1007.github.io/Chandresh-Portfolio-Website/) *(Note: Replace with actual link once GitHub Pages is deployed)*

## ✨ Features
*   **Cinematic Scrollytelling:** A custom-built 120-frame image sequence rendered on an HTML5 `<canvas>` that plays seamlessly as the user scrolls.
*   **Awwwards-Style Micro-Interactions:** Magnetic cursor, smooth hover reveals, and soft glassmorphism overlays.
*   **3D Depth & Parallax:** Multi-layered scrolling with slow-moving background blobs and dynamic 3D tilt effects on cards based on mouse movement.
*   **High Performance:** Optimized using `requestAnimationFrame`, `IntersectionObserver` for staggered loading, and lazy-loading image batches.
*   **Responsive Design:** Fully fluid layout using CSS Grid and Flexbox, optimized for all devices with a mobile-first approach.
*   **Light/Dark Theme:** Built-in dynamic theme toggling with CSS variables and `localStorage` persistence.

## 🛠️ Technology Stack
*   **HTML5** (Semantic structure)
*   **CSS3** (Custom properties, grid/flexbox, advanced animations)
*   **JavaScript (Vanilla)** (DOM manipulation, scroll physics, canvas rendering)
*   *Zero frameworks or libraries used.*

## 📂 Project Structure
```text
├── index.html        # Main entry point and semantic structure
├── style.css         # Global design system, animations, and responsive layouts
├── script.js         # Core animation logic, canvas rendering, and scroll events
├── sequence/         # Directory containing the 120 .webp frames for the canvas animation
└── README.md         # Project documentation
```

## 💻 Local Development
To run this project locally, you must serve it over HTTP/HTTPS to bypass browser security restrictions for `<canvas>` image rendering.

1. Clone the repository.
2. Open the directory in your terminal.
3. Start a local server (e.g., using Python):
   ```bash
   python -m http.server 3000
   ```
4. Open `http://localhost:3000` in your web browser.

## 👨‍💻 Author
**Chandresh Sharma**
*   **Role:** UI/UX Developer
*   **GitHub:** [@Chandresh-Sharma-1007](https://github.com/Chandresh-Sharma-1007)
*   **LinkedIn:** [chandresh-sharma](https://linkedin.com/in/chandresh-sharma)
