# AgriChain Design System

## Overview
The AgriChain Design System provides a comprehensive set of design tokens, reusable components, and utilities to ensure consistency across the application.

## File Structure
```
src/styles/
├── variables.css        # Design tokens (colors, spacing, typography)
├── ui.module.css       # Reusable component classes
├── animations.css      # Keyframes and animation utilities
└── index.css          # Global styles with mobile-first approach
```

## Design Tokens (CSS Variables)

### Colors
```css
/* Primary Colors */
--color-primary: #2a7a2a
--color-primary-light: #3d8b3d
--color-primary-dark: #1a5a1a

/* Accent Colors */
--color-accent: #ff7a00
--color-accent-light: #ff9533
--color-accent-dark: #cc6200

/* Status Colors */
--color-success: #10b981
--color-warning: #f59e0b
--color-error: #ef4444
--color-info: #3b82f6
```

### Spacing
```css
--space-1: 8px    /* Small spacing */
--space-2: 16px   /* Base spacing */
--space-3: 24px   /* Medium spacing */
--space-4: 32px   /* Large spacing */
--space-6: 48px   /* Extra large spacing */
```

### Typography
```css
--font-size-sm: 0.875rem
--font-size-base: 1rem
--font-size-lg: 1.125rem
--font-size-xl: 1.25rem
--font-size-2xl: 1.5rem

--font-weight-normal: 400
--font-weight-medium: 500
--font-weight-semibold: 600
--font-weight-bold: 700
```

## Reusable Components

### Containers
```jsx
import ui from '../styles/ui.module.css';

<div className={`${ui.container} ${ui.containerLg}`}>
  Content goes here
</div>
```

### Grid System
```jsx
// Auto-fit grid
<div className={`${ui.grid} ${ui.gridAutoFit} ${ui.gap4}`}>
  <div>Item 1</div>
  <div>Item 2</div>
</div>

// Fixed columns
<div className={`${ui.grid} ${ui.gridCols3} ${ui.gap2}`}>
  <div>Col 1</div>
  <div>Col 2</div>
  <div>Col 3</div>
</div>
```

### Cards
```jsx
// Basic card
<div className={ui.card}>
  <h3>Card Title</h3>
  <p>Card content</p>
</div>

// Interactive card with hover effects
<div className={`${ui.card} ${ui.cardInteractive}`}>
  <h3>Interactive Card</h3>
  <p>Hover me!</p>
</div>

// Gradient card
<div className={`${ui.card} ${ui.cardGradient}`}>
  <h3>Gradient Card</h3>
</div>
```

### Buttons
```jsx
// Primary button
<button className={`${ui.btnBase} ${ui.btnPrimary} ${ui.btnMd}`}>
  Primary Action
</button>

// Ghost button
<button className={`${ui.btnBase} ${ui.btnGhost} ${ui.btnSm}`}>
  Secondary
</button>

// Button with loading state
<button className={`${ui.btnBase} ${ui.btnPrimary} ${ui.btnLoading}`}>
  Loading...
</button>
```

### Badges
```jsx
<span className={`${ui.badge} ${ui.badgeSuccess}`}>Active</span>
<span className={`${ui.badge} ${ui.badgeWarning}`}>Pending</span>
<span className={`${ui.badge} ${ui.badgeError}`}>Error</span>
```

### Form Elements
```jsx
<div className={ui.formGroup}>
  <label className={ui.label} htmlFor="input">Label</label>
  <input 
    id="input"
    className={`${ui.input} ${ui.focusRingPrimary}`}
    placeholder="Enter text..."
  />
</div>
```

### Skeleton Loaders
```jsx
// Loading states
<div className={`${ui.skeleton} ${ui.skeletonTitle}`}></div>
<div className={`${ui.skeleton} ${ui.skeletonParagraph}`}></div>
<div className={`${ui.skeleton} ${ui.skeletonButton}`}></div>
```

## Animations

### Basic Animations
```jsx
// Fade in animation
<div className="animate-fade-in">Content</div>

// Slide up with delay
<div className="animate-slide-up animate-delay-200">Content</div>

// Scale in animation
<div className="animate-scale-in">Content</div>
```

### Continuous Animations
```jsx
// Pulse effect
<div className="animate-pulse">Loading...</div>

// Floating effect
<div className="animate-float">Floating element</div>

// Spinning loader
<div className="animate-spin">⚡</div>
```

### Hover Effects
```jsx
// Lift on hover
<div className={`${ui.card} ${ui.hoverLift}`}>Hover me</div>

// Scale on hover
<button className={`${ui.btnBase} ${ui.hoverScale}`}>Scale button</button>

// Glow effect
<div className={ui.hoverGlow}>Glowing element</div>
```

## Utility Classes

### Layout
```jsx
<div className={ui.flexCenter}>Centered content</div>
<div className={ui.flexBetween}>Space between</div>
<div className={ui.flexCol}>Column layout</div>
```

### Typography
```jsx
<h1 className={ui.text3xl}>Large heading</h1>
<p className={ui.textSecondary}>Secondary text</p>
<span className={ui.textMuted}>Muted text</span>
```

### Colors
```jsx
<span className={ui.textPrimary}>Primary color</span>
<span className={ui.textSuccess}>Success color</span>
<span className={ui.textError}>Error color</span>
```

## Mobile-First Breakpoints

The design system uses mobile-first approach:

- **Base**: Mobile styles (default)
- **sm (640px+)**: Small screens and up
- **lg (1024px+)**: Large screens and up

### Responsive Grid
```jsx
// 1 column on mobile, 2 on small screens, 3 on large screens
<div className={`${ui.grid} ${ui.gridCols1} ${ui.smGridCols2} ${ui.lgGridCols3}`}>
  <div>Item 1</div>
  <div>Item 2</div>
  <div>Item 3</div>
</div>
```

### Responsive Visibility
```jsx
// Hide on small screens
<div className={ui.smHidden}>Hidden on tablets and up</div>

// Show only on large screens
<div className={ui.lgVisible}>Visible on desktop only</div>
```

## Best Practices

1. **Use CSS variables** instead of hardcoded values
2. **Combine utility classes** for complex layouts
3. **Use semantic class names** for component-specific styles
4. **Test on multiple screen sizes** using responsive utilities
5. **Consider accessibility** with proper focus states and contrast
6. **Use animations judiciously** and respect reduced motion preferences

## Migration Guide

### From Old System to New System

1. **Replace hardcoded colors** with CSS variables:
   ```css
   /* Old */
   color: #2a7a2a;
   
   /* New */
   color: var(--color-primary);
   ```

2. **Use spacing variables**:
   ```css
   /* Old */
   padding: 16px;
   
   /* New */
   padding: var(--space-2);
   ```

3. **Replace custom buttons** with utility classes:
   ```jsx
   /* Old */
   <button className={styles.customButton}>Click me</button>
   
   /* New */
   <button className={`${ui.btnBase} ${ui.btnPrimary} ${ui.btnMd}`}>
     Click me
   </button>
   ```

4. **Use animation classes**:
   ```jsx
   /* Old */
   <div className={styles.fadeIn}>Content</div>
   
   /* New */
   <div className="animate-fade-in">Content</div>
   ```

## Performance Considerations

- CSS variables are cached by the browser
- Animation classes use GPU acceleration when possible
- Utility classes reduce CSS bundle size through reuse
- Mobile-first approach loads minimal CSS on smaller screens

## Browser Support

- Modern browsers (Chrome 60+, Firefox 55+, Safari 11+)
- CSS Variables supported in IE 11 with PostCSS fallbacks
- CSS Grid supported in all modern browsers