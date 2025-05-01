# Styling Guide for SupaNext Template

This document provides a comprehensive guide to the styling system used in the SupaNext Template project. It covers the core technologies, theme system, component architecture, and best practices for maintaining consistent styling across your application.

## 1. Core Styling Technologies

### Tailwind CSS

The project uses Tailwind CSS as its primary styling framework. Tailwind provides utility classes that you can compose directly in your JSX/TSX markup to create responsive designs.

```tsx
// Example of Tailwind utility classes
<div className="flex flex-col p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
  <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Title</h1>
</div>
```

### shadcn/ui Components

The project integrates shadcn/ui, a component library that works with Tailwind CSS. These components are built with Radix UI primitives and styled using Tailwind CSS. They provide a consistent design language throughout your application.

For more information on shadcn/ui, see [shadcn-ui-guide.md](./shadcn-ui-guide.md).

## 2. Theme System

### CSS Variables

The theme system is based on CSS variables defined in `app/globals.css`. These variables control colors in both light and dark modes:

```css
:root {
  /* Light theme variables */
  --background: 0 0% 100%;
  --foreground: 224 71.4% 4.1%;
  --card: 0 0% 100%;
  /* etc. */
}

.dark {
  /* Dark theme variables */
  --background: 224 71.4% 4.1%;
  --foreground: 210 20% 98%;
  --card: 224 71.4% 4.1%;
  /* etc. */
}
```

### Tailwind Configuration

The `tailwind.config.js` file extends Tailwind's theme with custom colors that reference these CSS variables:

```js
theme: {
  extend: {
    colors: {
      background: 'hsl(var(--background))',
      foreground: 'hsl(var(--foreground))',
      card: {
        DEFAULT: 'hsl(var(--card))',
        foreground: 'hsl(var(--card-foreground))'
      },
      // etc.
    }
  }
}
```

### Dark Mode Support

Dark mode is implemented using the `next-themes` package and Tailwind's dark variant. The configuration in `tailwind.config.js` specifies:

```js
darkMode: ['media', 'class']
```

This allows for both system preference and user-selected theme modes.

## 3. UI Styles Utility

The project includes a centralized styling utility in `lib/ui-styles.ts` that provides consistent styling patterns:

```ts
export const uiStyles = {
  text: {
    default: 'text-foreground',
    muted: 'text-muted-foreground',
    // etc.
  },
  bg: {
    default: 'bg-background',
    // etc.
  },
  // etc.
}
```

This utility helps maintain consistency across components and makes it easier to update styles globally.

### Available Style Categories

The `uiStyles` utility provides the following categories of styles:

- `text`: Text colors for different states
- `bg`: Background colors
- `border`: Border styles
- `button`: Button variants
- `card`: Card styles
- `input`: Form input styles
- `container`: Container styles

Example usage:

```tsx
import { uiStyles } from '@/lib/ui-styles';

// In your component JSX
<p className={uiStyles.text.secondary}>This is secondary text</p>
<div className={uiStyles.bg.primary}>This has primary background</div>
<button className={uiStyles.button.primary}>Primary Button</button>
```

## 4. Component Structure

### UI Component Library

The project has a set of reusable UI components in the `components/ui` directory:

- `button.tsx`: Configurable button component with variants and sizes
- `Card.tsx`: Card component with header, content, and footer sections
- `input.tsx`: Form input component with label and error handling
- `theme-toggle.tsx`: Component for switching between light and dark modes

### Layout Components

Layout components in `components/layout` help structure pages consistently:

- `PageContainer.tsx`: Wrapper component for page content with configurable width
- `PageHeader.tsx`: Consistent page headers with title and description

## 5. Applying Styles in Components

### Utility Function for Class Composition

The project uses the `cn` utility function (from `lib/utils.ts`) to compose class names:

```ts
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

This function combines `clsx` for conditional classes and `tailwind-merge` to prevent class conflicts.

### Component Styling Example

```tsx
<button
  className={cn(
    'rounded-md font-medium transition-colors',
    variantStyles[variant],
    sizeStyles[size],
    fullWidth ? 'w-full' : '',
    className
  )}
  // etc.
>
```

## 6. Page Styling

Pages in the `app` directory use the same styling approach with Tailwind utility classes. They often leverage the layout components:

```tsx
// Example from app/examples/page.tsx
export default function ExamplesOverviewPage() {
  return (
    <PageContainer>
      <PageHeader title="Examples & Demos" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Content */}
      </div>
    </PageContainer>
  );
}
```

## 7. Dark Mode Implementation

Dark mode is implemented through:

1. The `ThemeProvider` component from `components/ui/theme-provider.tsx`
2. Tailwind's dark variant (`dark:`) classes
3. CSS variables in the `.dark` selector in `globals.css`

Usage example:

```tsx
<div className="bg-white text-gray-900 dark:bg-gray-800 dark:text-white">
  Dark mode compatible content
</div>
```

## 8. Form Components

Form components in `components/forms` use the base UI components but add form-specific functionality:

- `FormAlert.tsx`: Shows various types of form alerts with appropriate styling
- `FormDivider.tsx`: Creates a visual divider with optional text

## 9. Custom Global Styles

Custom global styles are defined in `app/globals.css`. This includes:

- Base styles for HTML elements
- Theme variable declarations
- Tailwind directives

## 10. Best Practices

### Using Theme Variables

When adding new colors, use the theme variables:

```tsx
<div className="bg-background text-foreground">Content</div>
```

### Leveraging uiStyles

For consistent styling, use the `uiStyles` utility:

```tsx
<div className={uiStyles.bg.secondary}>Content</div>
```

### Component-Specific Styles

For component-specific styles, extend existing components or create new ones following the pattern of existing components.

### Responsive Design

Use Tailwind's responsive prefixes for different screen sizes:

```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">Content</div>
```

### Dark Mode Support

Always include dark mode variants for colors:

```tsx
<p className="text-gray-700 dark:text-gray-200">Content</p>
```

### Maintaining Consistency

- Use existing color variables instead of hard-coded colors
- Follow the established component patterns
- Use the `cn` utility for class composition
- Leverage the layout components to maintain consistent spacing and structure

By following this styling guide, you'll maintain consistency throughout your project while leveraging the power and flexibility of Tailwind CSS and the shadcn/ui component library.