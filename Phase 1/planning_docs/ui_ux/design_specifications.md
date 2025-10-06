# UI/UX Design Specifications - Dubai Event Discovery Platform

## 🎨 Design System Overview

A sophisticated, professional design system inspired by Dubai's luxury hospitality scene, featuring warm retro colors that complement the vintage map aesthetic. The design prioritizes accessibility, performance, and premium user experience across all devices.

## 🌈 Color System

### Primary Color Palette

```scss
// Dark Theme (Primary) - Retro Inspired
:root[data-theme="dark"] {
  /* Core Colors - Influenced by retro map */
  --color-background: #2a2419;        /* Dark brown inspired by retro theme */
  --color-surface: #3d3426;           /* Elevated surfaces with warm undertones */
  --color-surface-elevated: #4a4030;  /* Cards, modals */
  --color-surface-hover: #564935;     /* Interactive states */
  
  /* Text Colors */
  --color-text-primary: #f5f1e6;      /* Warm white from retro map */
  --color-text-secondary: #c9b2a6;    /* Secondary text with retro warmth */
  --color-text-muted: #93817c;        /* Muted text from retro palette */
  --color-text-inverse: #523735;      /* Rich brown from retro theme */
  
  /* Brand Colors - Retro Map Inspired */
  --color-primary: #f8c967;           /* Warm gold from retro highways */
  --color-primary-hover: #e9bc62;     /* Highway stroke from retro */
  --color-primary-light: #fdfcf8;     /* Arterial road color */
  --color-primary-dark: #db8555;      /* Controlled access roads */
  
  /* Accent Colors - Earth Tones */
  --color-accent-red: #db8555;        /* Warm orange from retro theme */
  --color-accent-green: #a5b076;      /* Park green from retro map */
  --color-accent-blue: #92998d;       /* Water text from retro theme */
  --color-accent-purple: #8f7d77;     /* Transit from retro palette */
  
  /* Border & Dividers */
  --color-border: #564935;            /* Warm border color */
  --color-border-strong: #6b5d4a;     /* Strong borders */
  --color-divider: #4a4030;          /* Section dividers */
  
  /* Interactive States */
  --color-focus: #f8c967;             /* Focus rings - highway gold */
  --color-selection: rgba(248, 201, 103, 0.2); /* Text selection */
  --color-overlay: rgba(42, 36, 25, 0.9); /* Modal overlays */
}

// Light Theme (Secondary) - Retro Inspired  
:root[data-theme="light"] {
  /* Core Colors - Light retro aesthetic */
  --color-background: #f5f1e6;        /* Warm cream from retro map */
  --color-surface: #fdfcf8;           /* Lightest retro surface */
  --color-surface-elevated: #ebe3cd;  /* Base geometry color from map */
  --color-surface-hover: #dfd2ae;     /* Natural landscape hover */
  
  /* Text Colors */
  --color-text-primary: #523735;      /* Rich brown from retro map */
  --color-text-secondary: #806b63;    /* Local road text color */
  --color-text-muted: #93817c;        /* Muted retro brown */
  --color-text-inverse: #f5f1e6;      /* Warm white for dark backgrounds */
  
  /* Brand Colors - Retro Gold Tones */
  --color-primary: #e9bc62;           /* Highway stroke gold */
  --color-primary-hover: #db8555;     /* Controlled access orange */
  --color-primary-light: #fdfcf8;     /* Light arterial color */
  --color-primary-dark: #b8941f;      /* Darker gold variation */
  
  /* Accent Colors - Natural Earth Tones */
  --color-accent-red: #db8555;        /* Warm controlled access orange */
  --color-accent-green: #447530;      /* Park label green */
  --color-accent-blue: #92998d;       /* Water label blue-green */
  --color-accent-purple: #8f7d77;     /* Transit line color */
  
  /* Border & Dividers */
  --color-border: #dcd2be;            /* Administrative stroke */
  --color-border-strong: #c9b2a6;     /* Strong border color */
  --color-divider: #ebe3cd;          /* Base geometry divider */
  
  /* Interactive States */
  --color-focus: #f8c967;             /* Highway focus color */
  --color-selection: rgba(233, 188, 98, 0.2); /* Text selection */
  --color-overlay: rgba(82, 55, 53, 0.6); /* Modal overlays */
}
```

### Semantic Color Usage

```scss
// Venue Pin Colors (by category) - Retro Earth Tones
:root {
  --venue-nightclub: #f8c967;         /* Highway gold - Premium venues */
  --venue-restaurant: #a5b076;        /* Park green - Dining */
  --venue-bar: #b9d3c2;              /* Water sage - Bars & lounges */
  --venue-rooftop: #e98d58;          /* Controlled access orange - Rooftop venues */
  --venue-beach-club: #92998d;       /* Water label - Beach clubs */
  --venue-hotel: #db8555;            /* Warm orange - Hotel venues */
  --venue-default: #93817c;          /* Muted brown - Uncategorized */
}

// Story Status Colors - Retro Natural Tones
:root {
  --story-active: #a5b076;           /* Park green - Active stories */
  --story-expired: #93817c;         /* Muted brown - Expired stories */
  --story-loading: #e9bc62;         /* Highway stroke - Loading state */
  --story-error: #db8555;           /* Warm orange - Error state */
}
```

## 📏 Typography System

### Font Hierarchy

```scss
// Font Stack
:root {
  --font-primary: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  --font-mono: 'JetBrains Mono', 'Fira Code', Consolas, monospace;
  
  /* Font Weights */
  --font-weight-light: 300;
  --font-weight-regular: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;
  --font-weight-bold: 700;
  --font-weight-black: 900;
}

// Typography Scale
.text-display-large {
  font-size: 3.5rem;     /* 56px */
  line-height: 1.1;
  font-weight: var(--font-weight-bold);
  letter-spacing: -0.02em;
}

.text-display {
  font-size: 2.5rem;     /* 40px */
  line-height: 1.2;
  font-weight: var(--font-weight-bold);
  letter-spacing: -0.01em;
}

.text-headline {
  font-size: 2rem;       /* 32px */
  line-height: 1.25;
  font-weight: var(--font-weight-semibold);
}

.text-title-large {
  font-size: 1.5rem;     /* 24px */
  line-height: 1.33;
  font-weight: var(--font-weight-semibold);
}

.text-title {
  font-size: 1.25rem;    /* 20px */
  line-height: 1.4;
  font-weight: var(--font-weight-medium);
}

.text-body-large {
  font-size: 1.125rem;   /* 18px */
  line-height: 1.56;
  font-weight: var(--font-weight-regular);
}

.text-body {
  font-size: 1rem;       /* 16px */
  line-height: 1.5;
  font-weight: var(--font-weight-regular);
}

.text-body-small {
  font-size: 0.875rem;   /* 14px */
  line-height: 1.43;
  font-weight: var(--font-weight-regular);
}

.text-caption {
  font-size: 0.75rem;    /* 12px */
  line-height: 1.33;
  font-weight: var(--font-weight-medium);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}
```

### Usage Guidelines

```typescript
// Typography Component Mapping
const TYPOGRAPHY_USAGE = {
  'text-display-large': ['Hero titles', 'Landing page headers'],
  'text-display': ['Page titles', 'Modal headers'],
  'text-headline': ['Section headers', 'Venue names in details'],
  'text-title-large': ['Card headers', 'Filter group titles'],
  'text-title': ['Venue names on map', 'Tab labels'],
  'text-body-large': ['Important descriptions', 'Event details'],
  'text-body': ['Standard content', 'Form labels'],
  'text-body-small': ['Secondary information', 'Timestamps'],
  'text-caption': ['Labels', 'Status indicators', 'Metadata'],
} as const;
```

## 🎯 Spacing & Layout System

### Spacing Scale

```scss
:root {
  /* Base unit: 4px */
  --space-0: 0;
  --space-1: 0.25rem;   /* 4px */
  --space-2: 0.5rem;    /* 8px */
  --space-3: 0.75rem;   /* 12px */
  --space-4: 1rem;      /* 16px */
  --space-5: 1.25rem;   /* 20px */
  --space-6: 1.5rem;    /* 24px */
  --space-8: 2rem;      /* 32px */
  --space-10: 2.5rem;   /* 40px */
  --space-12: 3rem;     /* 48px */
  --space-16: 4rem;     /* 64px */
  --space-20: 5rem;     /* 80px */
  --space-24: 6rem;     /* 96px */
}

/* Component Spacing */
:root {
  --spacing-section: var(--space-16);      /* Between major sections */
  --spacing-component: var(--space-8);     /* Between components */
  --spacing-element: var(--space-4);       /* Between related elements */
  --spacing-tight: var(--space-2);         /* Tight spacing */
  --spacing-loose: var(--space-6);         /* Loose spacing */
}
```

### Layout Grid

```scss
// Container System
.container {
  width: 100%;
  margin: 0 auto;
  padding: 0 var(--space-4);
  
  @media (min-width: 640px) {
    max-width: 640px;
    padding: 0 var(--space-6);
  }
  
  @media (min-width: 768px) {
    max-width: 768px;
    padding: 0 var(--space-8);
  }
  
  @media (min-width: 1024px) {
    max-width: 1024px;
  }
  
  @media (min-width: 1280px) {
    max-width: 1280px;
  }
}

// Grid System (12-column)
.grid {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: var(--space-4);
  
  @media (min-width: 768px) {
    gap: var(--space-6);
  }
}

// Responsive Utilities
.col-span-full { grid-column: 1 / -1; }
.col-span-6 { grid-column: span 6; }
.col-span-4 { grid-column: span 4; }
.col-span-3 { grid-column: span 3; }
```

## 🎨 Component Design System

### Button Components

```typescript
// Button Variants
interface ButtonProps {
  variant: 'primary' | 'secondary' | 'ghost' | 'danger';
  size: 'sm' | 'md' | 'lg' | 'xl';
  fullWidth?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
}

// Button Styles
const buttonStyles = {
  // Base styles
  base: `
    inline-flex items-center justify-center gap-2
    font-medium transition-all duration-200
    focus:outline-none focus:ring-2 focus:ring-offset-2
    disabled:pointer-events-none disabled:opacity-50
    rounded-lg border
  `,
  
  // Variants
  variants: {
    primary: `
      bg-primary text-primary-foreground border-primary
      hover:bg-primary-hover
      focus:ring-primary/20
    `,
    secondary: `
      bg-surface border-border text-text-primary
      hover:bg-surface-hover
      focus:ring-primary/20
    `,
    ghost: `
      border-transparent text-text-primary
      hover:bg-surface-hover
      focus:ring-primary/20
    `,
    danger: `
      bg-accent-red text-text-inverse border-accent-red
      hover:bg-red-600
      focus:ring-red-500/20
    `
  },
  
  // Sizes
  sizes: {
    sm: 'h-8 px-3 text-sm',
    md: 'h-10 px-4 text-base',
    lg: 'h-12 px-6 text-lg',
    xl: 'h-14 px-8 text-xl'
  }
};
```

### Map Interface Components

```typescript
// Venue Pin Design
interface VenuePinProps {
  venue: Venue;
  hasStories: boolean;
  isSelected: boolean;
  category: VenueCategory;
}

const VenuePinStyles = {
  // Base pin (no stories)
  base: `
    w-6 h-6 rounded-full border-2 border-white
    shadow-lg cursor-pointer transition-all duration-300
    flex items-center justify-center
  `,
  
  // States
  states: {
    default: 'transform scale-100 opacity-90',
    hover: 'transform scale-110 opacity-100',
    selected: 'transform scale-125 shadow-xl',
  },
  
  // Story indicator (pulsing animation)
  storyIndicator: `
    absolute -top-1 -right-1 w-3 h-3
    bg-accent-green rounded-full
    animate-pulse border border-white
  `,
  
  // Category colors
  categories: {
    nightclub: 'bg-venue-nightclub',
    restaurant: 'bg-venue-restaurant',
    bar: 'bg-venue-bar',
    rooftop: 'bg-venue-rooftop',
    'beach-club': 'bg-venue-beach-club',
    hotel: 'bg-venue-hotel',
    default: 'bg-venue-default',
  }
};

// Venue Cluster Design
const ClusterStyles = {
  base: `
    min-w-8 h-8 px-2 rounded-full
    bg-primary text-primary-foreground
    flex items-center justify-center
    font-semibold text-sm
    border-2 border-white shadow-lg
    cursor-pointer transition-all duration-200
  `,
  
  sizes: {
    small: 'w-8 h-8 text-xs',     // 2-9 venues
    medium: 'w-10 h-10 text-sm',  // 10-99 venues  
    large: 'w-12 h-12 text-base', // 100+ venues
  }
};
```

### Filter System Design

```typescript
// Filter Panel Layout
const FilterPanel = `
  bg-surface-elevated backdrop-blur-sm
  border border-border rounded-xl p-4
  shadow-lg
`;

// Filter Button States
const FilterButtonStyles = {
  base: `
    px-4 py-2 rounded-lg font-medium text-sm
    transition-all duration-200 border
    flex items-center gap-2
  `,
  
  states: {
    inactive: `
      bg-surface border-border text-text-secondary
      hover:bg-surface-hover hover:text-text-primary
    `,
    active: `
      bg-primary text-primary-foreground border-primary
      shadow-sm
    `,
    disabled: `
      bg-surface border-border text-text-muted
      opacity-50 cursor-not-allowed
    `
  }
};

// Multi-select Filter Design
interface MultiSelectFilterProps {
  options: FilterOption[];
  selected: string[];
  onChange: (selected: string[]) => void;
  placeholder: string;
}
```

### Venue Details Sheet

```typescript
// Sheet Layout (Desktop)
const VenueSheetDesktop = `
  fixed right-0 top-0 h-full w-96
  bg-surface-elevated border-l border-border
  shadow-2xl z-50 overflow-y-auto
  transform transition-transform duration-300
`;

// Sheet Layout (Mobile)
const VenueSheetMobile = `
  fixed bottom-0 left-0 right-0 
  max-h-[80vh] bg-surface-elevated
  border-t border-border rounded-t-2xl
  shadow-2xl z-50 overflow-y-auto
  transform transition-transform duration-300
`;

// Story Viewer Design
interface StoryViewerProps {
  stories: InstagramStory[];
  currentIndex: number;
  onNext: () => void;
  onPrevious: () => void;
}

const StoryViewerStyles = {
  container: `
    relative aspect-[9/16] bg-black rounded-lg overflow-hidden
    max-w-sm mx-auto
  `,
  
  media: `
    w-full h-full object-cover
  `,
  
  progressBar: `
    absolute top-2 left-2 right-2 flex gap-1 z-10
  `,
  
  progressSegment: `
    flex-1 h-1 bg-white/30 rounded-full overflow-hidden
  `,
  
  progressFill: `
    h-full bg-white rounded-full transition-all duration-200
  `,
  
  controls: `
    absolute inset-0 flex items-center justify-between p-4
    bg-gradient-to-t from-black/50 via-transparent to-black/50
  `,
  
  navigation: `
    w-10 h-10 rounded-full bg-black/50 text-white
    flex items-center justify-center cursor-pointer
    hover:bg-black/70 transition-colors
  `
};
```

### Chat Interface Design

```typescript
// Chat Button (Floating)
const ChatButtonStyles = `
  fixed bottom-6 right-6 w-14 h-14
  bg-primary text-primary-foreground
  rounded-full shadow-lg
  flex items-center justify-center
  cursor-pointer transition-all duration-300
  hover:scale-110 hover:shadow-xl
  z-40
`;

// Chat Modal
const ChatModalStyles = {
  overlay: `
    fixed inset-0 bg-overlay backdrop-blur-sm z-50
    flex items-center justify-center p-4
  `,
  
  container: `
    bg-surface-elevated rounded-2xl
    w-full max-w-md h-[600px]
    border border-border shadow-2xl
    flex flex-col overflow-hidden
  `,
  
  header: `
    p-4 border-b border-border
    flex items-center justify-between
  `,
  
  messages: `
    flex-1 p-4 overflow-y-auto
    space-y-4
  `,
  
  input: `
    p-4 border-t border-border
    flex items-center gap-2
  `
};

// Message Bubble Design
const MessageStyles = {
  user: `
    ml-auto max-w-[80%] p-3 rounded-2xl rounded-br-md
    bg-primary text-primary-foreground
  `,
  
  assistant: `
    mr-auto max-w-[80%] p-3 rounded-2xl rounded-bl-md
    bg-surface border border-border text-text-primary
  `,
  
  timestamp: `
    text-xs text-text-muted mt-1
  `
};
```

## 🎭 Animation & Transitions

### Animation System

```scss
// Easing Functions
:root {
  --ease-out-quad: cubic-bezier(0.25, 0.46, 0.45, 0.94);
  --ease-out-cubic: cubic-bezier(0.215, 0.61, 0.355, 1);
  --ease-in-out-cubic: cubic-bezier(0.645, 0.045, 0.355, 1);
  --ease-bounce: cubic-bezier(0.68, -0.55, 0.265, 1.55);
}

// Duration Scale
:root {
  --duration-instant: 0ms;
  --duration-fast: 150ms;
  --duration-normal: 300ms;
  --duration-slow: 500ms;
  --duration-slower: 800ms;
}

// Common Animations
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideInRight {
  from { transform: translateX(100%); }
  to { transform: translateX(0); }
}

@keyframes slideInUp {
  from { transform: translateY(100%); }
  to { transform: translateY(0); }
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.7; }
}

@keyframes scaleIn {
  from { transform: scale(0.9); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
}

// Component Animations
.animate-fade-in {
  animation: fadeIn var(--duration-normal) var(--ease-out-cubic);
}

.animate-slide-in-right {
  animation: slideInRight var(--duration-normal) var(--ease-out-cubic);
}

.animate-slide-in-up {
  animation: slideInUp var(--duration-normal) var(--ease-out-cubic);
}

.animate-story-pulse {
  animation: pulse 2s ease-in-out infinite;
}

.animate-scale-in {
  animation: scaleIn var(--duration-fast) var(--ease-out-cubic);
}
```

### Micro-interactions

```typescript
// Hover Effects
const hoverEffects = {
  venuePin: `
    transition-all duration-200 ease-out
    hover:scale-110 hover:shadow-lg
  `,
  
  button: `
    transition-all duration-150 ease-out
    hover:shadow-md hover:-translate-y-0.5
  `,
  
  card: `
    transition-all duration-200 ease-out
    hover:shadow-xl hover:-translate-y-1
  `,
  
  filter: `
    transition-all duration-150 ease-out
    hover:bg-surface-hover
  `
};

// Loading States
const loadingAnimations = {
  skeleton: `
    animate-pulse bg-gradient-to-r 
    from-surface via-surface-hover to-surface
  `,
  
  spinner: `
    animate-spin h-5 w-5 border-2 border-primary 
    border-t-transparent rounded-full
  `,
  
  dots: `
    flex space-x-1
    [&>div]:w-2 [&>div]:h-2 [&>div]:bg-primary
    [&>div]:rounded-full [&>div]:animate-bounce
    [&>div:nth-child(2)]:animation-delay-150ms
    [&>div:nth-child(3)]:animation-delay-300ms
  `
};
```

## 📱 Responsive Design Specifications

### Breakpoint System

```scss
// Breakpoints (Mobile-first)
:root {
  --breakpoint-sm: 640px;
  --breakpoint-md: 768px;
  --breakpoint-lg: 1024px;
  --breakpoint-xl: 1280px;
  --breakpoint-2xl: 1536px;
}

// Layout Variations
@media (max-width: 767px) {
  /* Mobile Layout */
  .venue-sheet {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    height: 80vh;
    border-radius: 1rem 1rem 0 0;
  }
  
  .filter-panel {
    position: fixed;
    top: 1rem;
    left: 1rem;
    right: 1rem;
    z-index: 10;
  }
  
  .map-container {
    height: 100vh;
  }
}

@media (min-width: 768px) {
  /* Tablet Layout */
  .venue-sheet {
    position: fixed;
    right: 0;
    top: 0;
    width: 50%;
    height: 100vh;
    border-radius: 0;
    border-left: 1px solid var(--color-border);
  }
}

@media (min-width: 1024px) {
  /* Desktop Layout */
  .venue-sheet {
    width: 400px;
  }
  
  .filter-panel {
    position: absolute;
    top: 1rem;
    left: 1rem;
    width: auto;
    min-width: 320px;
  }
}
```

### Touch Targets

```scss
// Minimum touch target size: 44px
.touch-target {
  min-width: 44px;
  min-height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
}

// Interactive elements
button, 
.clickable,
.touch-target {
  @extend .touch-target;
}

// Venue pins on mobile
@media (max-width: 767px) {
  .venue-pin {
    min-width: 44px;
    min-height: 44px;
    transform: scale(1.2);
  }
}
```

## ♿ Accessibility Specifications

### Color Contrast Requirements

```scss
// WCAG 2.1 AA Compliance
// Normal text: 4.5:1 contrast ratio
// Large text: 3:1 contrast ratio
// UI elements: 3:1 contrast ratio

:root {
  /* High contrast text pairs */
  --text-on-dark: #FAFAFA;      /* 16.3:1 on #0A0A0A */
  --text-on-light: #0A0A0A;     /* 16.3:1 on #FFFFFF */
  --text-secondary-dark: #A3A3A3; /* 4.9:1 on #0A0A0A */
  --text-secondary-light: #525252; /* 5.0:1 on #FFFFFF */
  
  /* Interactive elements */
  --primary-on-dark: #D4AF37;   /* 7.2:1 on #0A0A0A */
  --primary-on-light: #B8941F;  /* 4.7:1 on #FFFFFF */
}

// Focus indicators
.focus-visible:focus {
  outline: 2px solid var(--color-focus);
  outline-offset: 2px;
  border-radius: 4px;
}

// Screen reader only content
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}
```

### ARIA Labels & Semantic HTML

```typescript
// Component Accessibility
const AccessibilitySpecs = {
  VenuePin: {
    role: 'button',
    'aria-label': (venue: Venue) => 
      `${venue.name} venue pin. ${venue.hasStories ? 'Has active stories.' : 'No active stories.'}`,
    'aria-describedby': 'venue-instructions',
    tabIndex: 0,
  },
  
  FilterButton: {
    role: 'button',
    'aria-pressed': (isActive: boolean) => isActive,
    'aria-describedby': 'filter-instructions',
  },
  
  StoryViewer: {
    role: 'region',
    'aria-label': 'Instagram stories',
    'aria-live': 'polite',
    'aria-atomic': true,
  },
  
  ChatBot: {
    role: 'dialog',
    'aria-label': 'Dubai nightlife assistant chat',
    'aria-modal': true,
  },
} as const;

// Keyboard Navigation
const KeyboardSupport = {
  VenuePin: {
    Enter: 'Select venue and open details',
    Space: 'Select venue and open details',
    Tab: 'Navigate to next venue pin',
  },
  
  StoryViewer: {
    ArrowLeft: 'Previous story',
    ArrowRight: 'Next story',
    Space: 'Pause/play story',
    Escape: 'Close story viewer',
  },
  
  Chat: {
    Enter: 'Send message',
    Escape: 'Close chat',
    'Shift+Enter': 'New line in message',
  },
} as const;
```

## 🎯 Performance Specifications

### Loading States Design

```typescript
// Skeleton Components
const SkeletonSpecs = {
  VenueCard: `
    <div class="animate-pulse space-y-3 p-4">
      <div class="h-4 bg-surface-hover rounded w-3/4"></div>
      <div class="h-3 bg-surface-hover rounded w-1/2"></div>
      <div class="h-3 bg-surface-hover rounded w-2/3"></div>
    </div>
  `,
  
  StoryViewer: `
    <div class="aspect-[9/16] bg-surface-hover animate-pulse rounded-lg">
      <div class="p-4 space-y-2">
        <div class="flex gap-1">
          ${Array.from({ length: 5 }, () => 
            '<div class="flex-1 h-1 bg-white/30 rounded-full"></div>'
          ).join('')}
        </div>
      </div>
    </div>
  `,
  
  VenuePin: `
    <div class="w-6 h-6 bg-surface-hover animate-pulse rounded-full"></div>
  `,
} as const;

// Progressive Loading
const ProgressiveLoading = {
  MapTiles: 'Load base map first, then venue data',
  VenueImages: 'Lazy load venue images on demand',
  StoryMedia: 'Preload next story while viewing current',
  ChatHistory: 'Load recent messages, fetch older on scroll',
} as const;
```

### Image Optimization

```typescript
// Image Loading Strategy
const ImageSpecs = {
  VenueImages: {
    sizes: ['150w', '300w', '600w', '1200w'],
    formats: ['avif', 'webp', 'jpg'],
    loading: 'lazy',
    placeholder: 'blur',
  },
  
  StoryMedia: {
    preload: 'next 2 stories',
    fallback: 'low quality placeholder',
    timeout: '5 seconds',
    retry: '3 attempts',
  },
  
  ProfileImages: {
    sizes: ['32w', '64w', '128w'],
    formats: ['avif', 'webp', 'jpg'],
    loading: 'eager', // For immediately visible content
  },
} as const;
```

## 🎨 Theme Implementation

### CSS Custom Properties Setup

```scss
// Theme Toggle Implementation
html[data-theme="light"] {
  color-scheme: light;
  /* Light theme variables */
}

html[data-theme="dark"] {
  color-scheme: dark;
  /* Dark theme variables */
}

// System preference detection
@media (prefers-color-scheme: dark) {
  html:not([data-theme]) {
    /* Dark theme as default */
    color-scheme: dark;
  }
}

@media (prefers-color-scheme: light) {
  html:not([data-theme]) {
    /* Light theme as default */
    color-scheme: light;
  }
}

// Reduced motion support
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
  
  .animate-pulse,
  .animate-bounce,
  .animate-spin {
    animation: none !important;
  }
}
```

### Component Theme Variations

```typescript
// Theme-aware components
const ThemedComponents = {
  Button: {
    dark: 'bg-primary text-primary-foreground border-primary',
    light: 'bg-primary-dark text-white border-primary-dark',
  },
  
  Card: {
    dark: 'bg-surface-elevated border-border',
    light: 'bg-white border-gray-200 shadow-sm',
  },
  
  Input: {
    dark: 'bg-surface border-border text-text-primary placeholder:text-text-muted',
    light: 'bg-white border-gray-300 text-gray-900 placeholder:text-gray-500',
  },
} as const;
```

---

*Design System Version: 1.0*  
*Last Updated: September 6, 2025*  
*Status: Ready for Implementation*