# Design System Documentation

## Overview
Elegant, modern, and efficient design system for Flex Tournaments with glass morphism effects, smooth animations, and a cohesive purple/indigo color palette.

## Color Palette

### Primary Colors
- **Purple Primary**: `#8b5cf6` (purple-600)
- **Purple Dark**: `#7c3aed` (purple-700)
- **Purple Light**: `#a78bfa` (purple-400)
- **Indigo**: `#6366f1` (indigo-600)

### Gradients
- **Primary Gradient**: `linear-gradient(135deg, #667eea 0%, #764ba2 100%)`
- **Hero Gradient**: `linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)`

### Background Colors
- **Dark Base**: `#0f172a` (slate-900)
- **Card Background**: `#1e293b` (slate-800) with 80% opacity
- **Borders**: `#334155` (slate-700) with 50% opacity

## Typography

### Font Family
```css
font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
```

### Font Weights
- Light: 300
- Regular: 400
- Medium: 500
- Semibold: 600
- Bold: 700
- Extrabold: 800
- Black: 900

### Heading Styles
- **H1 (Hero)**: 6xl-8xl (text-6xl md:text-8xl), font-black, gradient-text
- **H2 (Section)**: 4xl-5xl (text-4xl md:text-5xl), font-bold
- **H3 (Card)**: 2xl-3xl (text-2xl md:text-3xl), font-bold

## Components

### Cards
```tsx
// Base card
<div className="card">
  <div className="card-body">
    {/* Content */}
  </div>
</div>

// Hoverable card
<div className="card card-hover">
  {/* Content */}
</div>

// Glass card
<div className="glass-dark rounded-3xl p-10">
  {/* Content */}
</div>
```

### Buttons

#### Primary Button
```tsx
<button className="group relative inline-flex items-center justify-center px-8 py-4 text-base font-bold text-white overflow-hidden rounded-xl transition-all hover:scale-105">
  <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-indigo-600"></div>
  <div className="absolute inset-0 bg-gradient-to-r from-purple-700 to-indigo-700 opacity-0 group-hover:opacity-100 transition-opacity"></div>
  <span className="relative">Button Text</span>
</button>
```

#### Secondary Button
```tsx
<button className="glass px-8 py-4 rounded-xl hover:bg-white/10 transition-all">
  Button Text
</button>
```

#### Outline Button
```tsx
<button className="border-2 border-purple-500 text-purple-400 hover:bg-purple-500 hover:text-white px-8 py-4 rounded-xl transition-all">
  Button Text
</button>
```

### Inputs
```tsx
<input 
  type="text"
  className="input"
  placeholder="Your input..."
/>

// With label
<div>
  <label className="label">
    <Icon className="inline-block mr-2" />
    Label Text
  </label>
  <input className="input" />
</div>
```

### Alerts
```tsx
// Success
<div className="alert alert-success">
  <Icon className="mr-3" />
  Success message
</div>

// Error
<div className="alert alert-error">
  <Icon className="mr-3" />
  Error message
</div>

// Info
<div className="alert alert-info">
  <Icon className="mr-3" />
  Info message
</div>

// Warning
<div className="alert alert-warning">
  <Icon className="mr-3" />
  Warning message
</div>
```

### Badges
```tsx
<span className="badge badge-primary">Primary</span>
<span className="badge badge-success">Success</span>
<span className="badge badge-warning">Warning</span>
<span className="badge badge-error">Error</span>
```

### Loading States
```tsx
// Spinner
<div className="loading-spinner w-12 h-12"></div>

// Button loading
<button disabled className="btn-primary">
  <svg className="animate-spin h-5 w-5 mr-2">...</svg>
  Loading...
</button>
```

## Layout Structure

### Page Container
```tsx
<div className="page-container">
  {/* Content with proper spacing and max-width */}
</div>
```

### Section Layout
```tsx
<section className="w-full py-16 md:py-20">
  <div className="text-center mb-16">
    <h2 className="text-4xl md:text-5xl font-bold mb-4">
      <span className="gradient-text">Section Title</span>
    </h2>
    <p className="text-gray-400 text-lg">Section description</p>
  </div>
  {/* Section content */}
</section>
```

### Grid Layouts
```tsx
// 3-column grid
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
  {/* Items */}
</div>

// 2-column grid
<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
  {/* Items */}
</div>
```

## Effects

### Glass Morphism
```css
.glass {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.glass-dark {
  background: rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
}
```

### Gradient Text
```css
.gradient-text {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
```

### Card Hover
```css
.card-hover:hover {
  transform: translateY(-4px);
  box-shadow: 0 20px 40px rgba(139, 92, 246, 0.3);
}
```

### Fade In Animation
```tsx
<div className="fade-in">
  {/* Content will fade in on mount */}
</div>
```

## Navigation

### Header
- Glass-dark background with blur
- Sticky positioning with top offset
- Logo with gradient background and glow effect
- Navigation links with hover states
- User menu with dropdown

### Footer
- Glass-dark background
- Three-column layout (logo, links, copyright)
- Responsive design

## Icons
Using React Icons (react-icons):
- Font Awesome: `import { FaIcon } from 'react-icons/fa'`
- Font Awesome 6: `import { FaIcon } from 'react-icons/fa6'`

Common icons:
- Trophy: `<FaTrophy />`
- User: `<FaUser />`
- List: `<FaListAlt />`
- Plus: `<FaPlus />`
- Eye: `<FaEye />`
- Sign In: `<FaSignInAlt />`
- Sign Out: `<FaSignOutAlt />`
- Crown: `<FaCrown />`

## Responsive Breakpoints
- **sm**: 640px
- **md**: 768px
- **lg**: 1024px
- **xl**: 1280px
- **2xl**: 1536px

## Spacing Scale
- **xs**: 0.25rem (1)
- **sm**: 0.5rem (2)
- **md**: 1rem (4)
- **lg**: 1.5rem (6)
- **xl**: 2rem (8)
- **2xl**: 3rem (12)
- **3xl**: 4rem (16)
- **4xl**: 6rem (24)

## Best Practices

### Do's
✅ Use gradient-text for important headings
✅ Use glass effects for overlays and modals
✅ Add hover effects to interactive elements
✅ Use the card-hover class for clickable cards
✅ Maintain consistent spacing with the scale
✅ Use relative positioning for absolute children
✅ Add transition classes for smooth animations

### Don'ts
❌ Don't mix different button styles in the same context
❌ Don't use solid black backgrounds
❌ Don't forget to add loading states
❌ Don't use colors outside the defined palette
❌ Don't stack too many glass effects
❌ Don't forget mobile responsiveness
❌ Don't use too many animations on the same element

## Accessibility

- All interactive elements have focus states
- Color contrast ratios meet WCAG AA standards
- Form inputs have associated labels
- Buttons show disabled states clearly
- Loading states are indicated visually
- Icon buttons have proper aria-labels (add when using)

## Performance

- CSS custom properties for theme colors
- GPU-accelerated transitions (transform, opacity)
- Debounced animations
- Lazy loading for images
- Optimized gradients and shadows
- Minimal use of backdrop-filter

## Example Pages

### Homepage
- Hero section with gradient background
- Feature cards with hover effects
- Step-by-step guide
- CTA section with glass effect

### Tournaments List
- Grid layout with card-hover
- Empty state with call-to-action
- Loading spinner
- Error alerts

### Authentication
- Glass-dark cards
- Gradient accent corners
- Form inputs with labels
- Gradient buttons
- Success/error alerts
