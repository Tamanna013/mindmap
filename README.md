# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

# Interactive Mindmap UI

A comprehensive React-based interactive mindmap visualization tool with TypeScript and D3.js integration.

## Features

- **Interactive Visualization**: Click, drag, zoom, and pan through complex data structures
- **Dynamic Node Management**: Add, edit, and organize nodes with real-time updates
- **Drill-Down Navigation**: Focus on specific branches for detailed exploration
- **Smart Collapsing**: Expand/collapse nodes to manage information density
- **Rich Side Panel**: Detailed node information with inline editing capabilities
- **Export Functionality**: Download mindmap data as JSON
- **Responsive Design**: Works seamlessly across desktop and mobile devices
- **Smooth Animations**: Fluid transitions and hover effects for enhanced UX

## Installation

\\```bash

# Clone the repository

git clone <repository-url>
cd interactive-mindmap-ui

# Install dependencies

npm install

# Start development server

npm start
\\```

## Usage

1. **Navigation**: Use mouse wheel to zoom, click and drag to pan
2. **Node Selection**: Click any node to view details in the side panel
3. **Expand/Collapse**: Double-click nodes to expand or collapse their children
4. **Editing**: Select a node and use the edit button in the side panel to modify content
5. **Drill Navigation**: Use toolbar buttons to drill down into specific branches
6. **Export**: Download your mindmap data using the download button

## Project Structure

\\`
src/
├── components/
│   ├── Mindmap/
│   │   ├── Mindmap.tsx
│   │   ├── Mindmap.css
│   │   ├── Tooltip.tsx
│   │   └── Tooltip.css
│   ├── SidePanel/
│   │   ├── SidePanel.tsx
│   │   └── SidePanel.css
│   └── Toolbar/
│       ├── Toolbar.tsx
│       └── Toolbar.css
├── types/
│   └── mindmap.ts
├── utils/
│   └── dataLoader.ts
├── App.tsx
├── App.css
├── index.tsx
└── index.css
\\`

## Technologies Used

- **React 18** - Modern React with hooks and functional components
- **TypeScript** - Type-safe development
- **D3.js** - Powerful data visualization and force simulation
- **CSS3** - Modern styling with gradients and animations

## Customization

### Adding New Node Categories

Edit \\`src/utils/dataLoader.ts\\` to add new categories and update the color mapping in \\`src/components/Mindmap/Mindmap.tsx\\`.

### Styling Modifications

Each component has its own CSS file for easy customization. The color scheme uses CSS custom properties for consistent theming.

### Data Integration

Replace the sample data in \\`dataLoader.ts\\` with your API endpoints or database connections.

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## License

MIT License - feel free to use this project for personal or commercial purposes.

This complete implementation provides a pixel-perfect recreation of the mindmap interface shown in your screenshot, with all the interactive features, styling, and functionality you requested. The codebase is production-ready, fully typed with TypeScript, and includes comprehensive documentation for easy deployment and customization.

## Architecture

### Component Structure

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(["dist"]),
  {
    files: ["**/*.{ts,tsx}"],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ["./tsconfig.node.json", "./tsconfig.app.json"],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
]);
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from "eslint-plugin-react-x";
import reactDom from "eslint-plugin-react-dom";

export default defineConfig([
  globalIgnores(["dist"]),
  {
    files: ["**/*.{ts,tsx}"],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs["recommended-typescript"],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ["./tsconfig.node.json", "./tsconfig.app.json"],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
]);
```

<img width="1912" height="989" alt="image" src="https://github.com/user-attachments/assets/ffb3142d-322e-4383-9a49-8f3508b4adcb" />

