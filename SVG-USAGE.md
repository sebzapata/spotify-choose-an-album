# SVG Usage Guide

This project has been configured to support SVG rendering in multiple ways using `vite-plugin-svgr`.

## Import Methods

### 1. Import as React Component (Recommended)

```tsx
import MyIcon from "./path/to/icon.svg?react";

const MyComponent = () => {
  return (
    <div>
      <MyIcon className="w-6 h-6 text-blue-500" />
    </div>
  );
};
```

### 2. Import as URL (for img src)

```tsx
import iconUrl from "./path/to/icon.svg";

const MyComponent = () => {
  return (
    <div>
      <img src={iconUrl} alt="My Icon" className="w-6 h-6" />
    </div>
  );
};
```

## Benefits of React Components

- **Styling**: You can style SVGs with CSS classes and Tailwind utilities
- **Props**: Pass props like `className`, `onClick`, etc.
- **Theming**: Use `currentColor` in SVGs to inherit text color
- **Accessibility**: Add `title`, `aria-label`, and other accessibility props

## Example Usage

See `src/components/ModeSelection/ModeSelection.tsx` for working examples of both import methods.

## Configuration

The SVG support is configured in:

- `vite.config.js` - SVGR plugin configuration
- `src/svg.d.ts` - TypeScript declarations for SVG imports
