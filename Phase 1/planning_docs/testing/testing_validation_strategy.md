# Testing & Validation Strategy - Dubai Event Discovery Platform

## 🎯 Testing Overview

A comprehensive testing strategy ensuring production-ready quality for the Dubai event discovery platform. This strategy covers unit testing, integration testing, end-to-end testing, performance validation, accessibility compliance, and user experience validation.

## 🧪 Testing Pyramid

```
                    ┌─────────────────────┐
                    │     E2E Tests       │ 
                    │   (User Journeys)   │ ← 10%
                    └─────────────────────┘
                ┌───────────────────────────────┐
                │      Integration Tests        │
                │   (Component Interactions)    │ ← 20%
                └───────────────────────────────┘
        ┌───────────────────────────────────────────────┐
        │              Unit Tests                       │
        │    (Components, Hooks, Utilities)             │ ← 70%
        └───────────────────────────────────────────────┘
```

## 🔧 Testing Stack & Tools

### Core Testing Framework

```json
{
  "testing_framework": {
    "unit_tests": "Jest + React Testing Library",
    "integration_tests": "Jest + MSW (Mock Service Worker)",
    "e2e_tests": "Playwright + Chromium/Firefox/Safari",
    "visual_regression": "Playwright + Pixelmatch",
    "accessibility": "Jest-Axe + Pa11y",
    "performance": "Lighthouse CI + Web Vitals"
  },
  "additional_tools": {
    "test_data": "Factory functions with Faker.js",
    "mocking": "MSW for API mocking",
    "coverage": "Istanbul/NYC with c8",
    "reporting": "Jest HTML Reporter + Allure",
    "ci_integration": "GitHub Actions + Codecov"
  }
}
```

### Installation & Setup

```bash
# Core testing dependencies
npm install -D jest @testing-library/react @testing-library/jest-dom
npm install -D @testing-library/user-event jest-environment-jsdom
npm install -D @playwright/test playwright

# Additional testing tools
npm install -D msw @mswjs/data faker
npm install -D jest-axe @axe-core/playwright
npm install -D lighthouse ci @web/test-runner-playwright

# Coverage and reporting
npm install -D c8 jest-html-reporter
npm install -D allure-commandline allure-playwright
```

## 🧩 Unit Testing Strategy

### Testing Scope (70% of test suite)

```typescript
// Testing Categories
const UNIT_TEST_SCOPE = {
  components: {
    coverage: 'All components with business logic',
    focus: 'Rendering, props handling, user interactions',
    examples: ['VenuePin', 'FilterPanel', 'StoryViewer', 'ChatBot']
  },
  
  hooks: {
    coverage: 'All custom hooks',
    focus: 'State management, side effects, return values',
    examples: ['useVenues', 'useStories', 'useMapData', 'useFilters']
  },
  
  utilities: {
    coverage: 'All utility functions',
    focus: 'Input/output, edge cases, error handling',
    examples: ['clusterVenues', 'formatDate', 'validateFilters']
  },
  
  stores: {
    coverage: 'Zustand stores',
    focus: 'State mutations, computed values, persistence',
    examples: ['mapStore', 'uiStore', 'filterStore']
  }
};
```

### Component Testing Examples

```typescript
// VenuePin Component Tests
describe('VenuePin Component', () => {
  const mockVenue: Venue = {
    venue_id: '123',
    name: 'Test Venue',
    lat: 25.2048,
    lng: 55.2708,
    category: 'nightclub',
    hasStories: true
  };

  it('renders venue pin with correct styling', () => {
    render(<VenuePin venue={mockVenue} onSelect={jest.fn()} />);
    
    const pin = screen.getByRole('button', { name: /test venue/i });
    expect(pin).toBeInTheDocument();
    expect(pin).toHaveClass('venue-pin', 'venue-nightclub');
  });

  it('shows story indicator when venue has stories', () => {
    render(<VenuePin venue={{...mockVenue, hasStories: true}} onSelect={jest.fn()} />);
    
    expect(screen.getByTestId('story-indicator')).toBeInTheDocument();
  });

  it('calls onSelect when clicked', async () => {
    const handleSelect = jest.fn();
    render(<VenuePin venue={mockVenue} onSelect={handleSelect} />);
    
    await user.click(screen.getByRole('button'));
    expect(handleSelect).toHaveBeenCalledWith(mockVenue);
  });

  it('handles keyboard navigation', async () => {
    const handleSelect = jest.fn();
    render(<VenuePin venue={mockVenue} onSelect={handleSelect} />);
    
    const pin = screen.getByRole('button');
    pin.focus();
    await user.keyboard('{Enter}');
    
    expect(handleSelect).toHaveBeenCalledWith(mockVenue);
  });

  it('applies correct category styling', () => {
    const { rerender } = render(<VenuePin venue={mockVenue} onSelect={jest.fn()} />);
    expect(screen.getByRole('button')).toHaveClass('venue-nightclub');
    
    rerender(<VenuePin venue={{...mockVenue, category: 'restaurant'}} onSelect={jest.fn()} />);
    expect(screen.getByRole('button')).toHaveClass('venue-restaurant');
  });
});

// Custom Hook Tests
describe('useVenues Hook', () => {
  beforeEach(() => {
    // Setup MSW handlers for API mocking
    server.use(
      rest.get('/api/venues', (req, res, ctx) => {
        const area = req.url.searchParams.get('area');
        return res(ctx.json(mockVenuesData[area] || []));
      })
    );
  });

  it('fetches venues for selected area', async () => {
    const { result } = renderHook(() => useVenues('Downtown Dubai', {}));
    
    await waitFor(() => {
      expect(result.current.data).toBeDefined();
      expect(result.current.data?.length).toBeGreaterThan(0);
    });
  });

  it('handles loading state correctly', () => {
    const { result } = renderHook(() => useVenues('Dubai Marina', {}));
    
    expect(result.current.isLoading).toBe(true);
    expect(result.current.data).toBeUndefined();
  });

  it('applies filters correctly', async () => {
    const filters = { vibes: ['nightclub'], offers: ['happy-hour'] };
    const { result } = renderHook(() => useVenues('Downtown Dubai', filters));
    
    await waitFor(() => {
      expect(result.current.data?.every(venue => 
        venue.category === 'nightclub'
      )).toBe(true);
    });
  });

  it('handles error states', async () => {
    server.use(
      rest.get('/api/venues', (req, res, ctx) => 
        res(ctx.status(500), ctx.json({ error: 'Server error' }))
      )
    );

    const { result } = renderHook(() => useVenues('Invalid Area', {}));
    
    await waitFor(() => {
      expect(result.current.error).toBeDefined();
      expect(result.current.data).toBeUndefined();
    });
  });
});

// Utility Function Tests
describe('clusterVenues Utility', () => {
  const venues = [
    { venue_id: '1', lat: 25.2048, lng: 55.2708, name: 'Venue 1' },
    { venue_id: '2', lat: 25.2050, lng: 55.2710, name: 'Venue 2' },
    { venue_id: '3', lat: 25.3000, lng: 55.3000, name: 'Venue 3' },
  ];

  const mockMap = {
    getZoom: () => 12,
    getProjection: () => ({
      fromLatLngToPoint: (latLng: any) => ({
        x: latLng.lng() * 100,
        y: latLng.lat() * 100
      })
    })
  } as any;

  it('clusters nearby venues at low zoom levels', () => {
    const clusterer = new VenueClusterer();
    const clusters = clusterer.cluster(venues, mockMap);
    
    // Should cluster first two venues due to proximity
    expect(clusters.length).toBeLessThan(venues.length);
    
    const cluster = clusters.find(c => c.count > 1);
    expect(cluster).toBeDefined();
    expect(cluster!.venues).toHaveLength(2);
  });

  it('shows individual pins at high zoom levels', () => {
    const highZoomMap = { ...mockMap, getZoom: () => 16 };
    const clusterer = new VenueClusterer();
    const clusters = clusterer.cluster(venues, highZoomMap);
    
    expect(clusters).toHaveLength(venues.length);
    expect(clusters.every(c => c.count === 1)).toBe(true);
  });

  it('handles empty venue array', () => {
    const clusterer = new VenueClusterer();
    const clusters = clusterer.cluster([], mockMap);
    
    expect(clusters).toEqual([]);
  });

  it('calculates cluster center correctly', () => {
    const closeVenues = [
      { venue_id: '1', lat: 25.2048, lng: 55.2708, name: 'Venue 1' },
      { venue_id: '2', lat: 25.2052, lng: 55.2712, name: 'Venue 2' },
    ];

    const clusterer = new VenueClusterer();
    const clusters = clusterer.cluster(closeVenues, mockMap);
    
    const cluster = clusters.find(c => c.count === 2);
    expect(cluster!.center.lat).toBeCloseTo(25.2050, 4);
    expect(cluster!.center.lng).toBeCloseTo(55.2710, 4);
  });
});
```

## 🔗 Integration Testing Strategy

### Testing Scope (20% of test suite)

```typescript
// Integration Test Categories
const INTEGRATION_TEST_SCOPE = {
  component_interactions: {
    description: 'Components working together',
    examples: [
      'Map + VenuePin interactions',
      'FilterPanel + Map updates',
      'VenueSheet + StoryViewer',
      'ChatBot + Venue search'
    ]
  },
  
  api_integration: {
    description: 'Frontend + Backend interactions',
    examples: [
      'Venue data fetching and caching',
      'Story data real-time updates',
      'Webhook triggering and responses',
      'Error handling and retries'
    ]
  },
  
  state_management: {
    description: 'Store + Component integration',
    examples: [
      'Filter changes update map',
      'Venue selection updates UI',
      'Theme switching affects all components'
    ]
  }
};
```

### Integration Test Examples

```typescript
// Map + Filter Integration
describe('Map Filter Integration', () => {
  beforeEach(() => {
    // Mock API responses
    server.use(
      rest.get('/api/venues', (req, res, ctx) => {
        const vibes = req.url.searchParams.getAll('vibe');
        const area = req.url.searchParams.get('area');
        
        let venues = mockVenuesData[area] || [];
        if (vibes.length > 0) {
          venues = venues.filter(v => vibes.includes(v.category));
        }
        
        return res(ctx.json(venues));
      })
    );
  });

  it('updates map markers when filters change', async () => {
    render(<MapContainer />);
    
    // Wait for initial venues to load
    await waitFor(() => {
      expect(screen.getAllByTestId('venue-pin')).toHaveLength(10);
    });

    // Apply nightclub filter
    const nightclubFilter = screen.getByRole('button', { name: /nightclub/i });
    await user.click(nightclubFilter);

    // Verify filtered results
    await waitFor(() => {
      const pins = screen.getAllByTestId('venue-pin');
      expect(pins.length).toBeLessThan(10);
      pins.forEach(pin => {
        expect(pin).toHaveClass('venue-nightclub');
      });
    });
  });

  it('maintains filter state when area changes', async () => {
    render(<MapContainer />);
    
    // Apply filter
    await user.click(screen.getByRole('button', { name: /rooftop/i }));
    
    // Change area
    const areaSelect = screen.getByRole('combobox', { name: /area/i });
    await user.selectOptions(areaSelect, 'Dubai Marina');
    
    // Verify filter is still active
    expect(screen.getByRole('button', { name: /rooftop/i })).toHaveAttribute('aria-pressed', 'true');
  });
});

// Venue Sheet + Story Integration
describe('Venue Details Integration', () => {
  const mockVenueWithStories = {
    venue_id: '123',
    name: 'Test Venue',
    stories: [
      { story_id: '1', media_link: 'story1.jpg', timestamp: new Date() },
      { story_id: '2', media_link: 'story2.jpg', timestamp: new Date() }
    ]
  };

  beforeEach(() => {
    server.use(
      rest.get('/api/stories', (req, res, ctx) => {
        const venueId = req.url.searchParams.get('venueId');
        return res(ctx.json(mockVenueWithStories.stories));
      })
    );
  });

  it('loads and displays stories when venue is selected', async () => {
    const { user } = render(<App />);
    
    // Select venue
    const venuePin = screen.getByTestId('venue-pin-123');
    await user.click(venuePin);
    
    // Wait for venue sheet to open
    await waitFor(() => {
      expect(screen.getByTestId('venue-sheet')).toBeVisible();
    });
    
    // Wait for stories to load
    await waitFor(() => {
      expect(screen.getByTestId('story-viewer')).toBeInTheDocument();
      expect(screen.getAllByTestId('story-slide')).toHaveLength(2);
    });
  });

  it('handles story navigation correctly', async () => {
    render(<App />);
    
    // Open venue with stories
    await user.click(screen.getByTestId('venue-pin-123'));
    
    await waitFor(() => {
      expect(screen.getByTestId('story-viewer')).toBeVisible();
    });

    // Navigate to next story
    const nextButton = screen.getByRole('button', { name: /next story/i });
    await user.click(nextButton);
    
    // Verify story index updated
    expect(screen.getByTestId('story-progress')).toHaveAttribute('data-current', '1');
  });
});

// API Error Handling Integration
describe('Error Handling Integration', () => {
  it('shows error message when venue data fails to load', async () => {
    server.use(
      rest.get('/api/venues', (req, res, ctx) => 
        res(ctx.status(500), ctx.json({ error: 'Server error' }))
      )
    );

    render(<App />);
    
    await waitFor(() => {
      expect(screen.getByText(/failed to load venues/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /retry/i })).toBeInTheDocument();
    });
  });

  it('retries failed requests when retry button is clicked', async () => {
    let attemptCount = 0;
    server.use(
      rest.get('/api/venues', (req, res, ctx) => {
        attemptCount++;
        if (attemptCount === 1) {
          return res(ctx.status(500), ctx.json({ error: 'Server error' }));
        }
        return res(ctx.json(mockVenuesData['Downtown Dubai']));
      })
    );

    render(<App />);
    
    // Wait for error
    await waitFor(() => {
      expect(screen.getByText(/failed to load venues/i)).toBeInTheDocument();
    });
    
    // Retry
    await user.click(screen.getByRole('button', { name: /retry/i }));
    
    // Verify success
    await waitFor(() => {
      expect(screen.getAllByTestId('venue-pin')).toHaveLength(10);
    });
  });
});
```

## 🎭 End-to-End Testing Strategy

### Testing Scope (10% of test suite)

```typescript
// E2E Test Scenarios
const E2E_TEST_SCOPE = {
  critical_user_journeys: [
    'Venue discovery and selection',
    'Filter application and results',
    'Story viewing experience',
    'Mobile responsive interactions',
    'Theme switching',
    'Error recovery flows'
  ],
  
  cross_browser_testing: [
    'Chrome (latest 2 versions)',
    'Firefox (latest 2 versions)', 
    'Safari (latest 2 versions)',
    'Mobile Chrome (Android)',
    'Mobile Safari (iOS)'
  ],
  
  device_testing: [
    'Desktop (1920x1080)',
    'Tablet (768x1024)',
    'Mobile (375x667)',
    'Large Mobile (414x896)'
  ]
};
```

### Playwright E2E Tests

```typescript
// tests/e2e/venue-discovery.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Venue Discovery Journey', () => {
  test.beforeEach(async ({ page }) => {
    // Mock API responses
    await page.route('/api/venues*', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(mockVenuesData)
      });
    });
    
    await page.goto('/');
  });

  test('user can discover venues in Dubai', async ({ page }) => {
    // Wait for map to load
    await expect(page.locator('[data-testid="map-container"]')).toBeVisible();
    
    // Verify venue pins are displayed
    await expect(page.locator('[data-testid="venue-pin"]')).toHaveCount(10);
    
    // Select a venue
    await page.locator('[data-testid="venue-pin"]').first().click();
    
    // Verify venue details sheet opens
    await expect(page.locator('[data-testid="venue-sheet"]')).toBeVisible();
    
    // Verify venue information is displayed
    await expect(page.locator('[data-testid="venue-name"]')).toBeVisible();
    await expect(page.locator('[data-testid="venue-address"]')).toBeVisible();
  });

  test('user can filter venues by vibe', async ({ page }) => {
    await expect(page.locator('[data-testid="venue-pin"]')).toHaveCount(10);
    
    // Apply nightclub filter
    await page.locator('[data-testid="vibe-filter-nightclub"]').click();
    
    // Wait for filter to apply
    await page.waitForTimeout(500);
    
    // Verify filtered results
    const nightclubPins = page.locator('[data-testid="venue-pin"][data-category="nightclub"]');
    await expect(nightclubPins).toHaveCount(4);
    
    // Verify non-nightclub venues are hidden
    const otherPins = page.locator('[data-testid="venue-pin"]:not([data-category="nightclub"])');
    await expect(otherPins).toHaveCount(0);
  });

  test('user can view Instagram stories', async ({ page }) => {
    // Select venue with stories
    await page.locator('[data-testid="venue-pin"][data-has-stories="true"]').first().click();
    
    // Wait for venue sheet
    await expect(page.locator('[data-testid="venue-sheet"]')).toBeVisible();
    
    // Verify story viewer is present
    await expect(page.locator('[data-testid="story-viewer"]')).toBeVisible();
    
    // Navigate through stories
    await page.locator('[data-testid="story-next"]').click();
    
    // Verify story progression
    await expect(page.locator('[data-testid="story-progress"]')).toHaveAttribute('data-current', '1');
  });

  test('user can interact with chat assistant', async ({ page }) => {
    // Open chat
    await page.locator('[data-testid="chat-button"]').click();
    
    // Wait for chat modal
    await expect(page.locator('[data-testid="chat-modal"]')).toBeVisible();
    
    // Send message
    await page.locator('[data-testid="chat-input"]').fill('Show me nightclubs in Downtown Dubai');
    await page.locator('[data-testid="chat-send"]').click();
    
    // Verify message sent
    await expect(page.locator('[data-testid="chat-message-user"]')).toContainText('Show me nightclubs');
    
    // Wait for assistant response
    await expect(page.locator('[data-testid="chat-message-assistant"]')).toBeVisible();
  });
});

// Mobile-specific E2E tests
test.describe('Mobile Experience', () => {
  test.use({ viewport: { width: 375, height: 667 } });

  test('mobile navigation works correctly', async ({ page }) => {
    await page.goto('/');
    
    // Verify mobile layout
    await expect(page.locator('[data-testid="venue-sheet"]')).toHaveCSS('position', 'fixed');
    
    // Select venue to open bottom sheet
    await page.locator('[data-testid="venue-pin"]').first().click();
    
    // Verify bottom sheet opens
    await expect(page.locator('[data-testid="venue-sheet"]')).toHaveCSS('bottom', '0px');
    
    // Test swipe to close (simulate touch)
    const sheet = page.locator('[data-testid="venue-sheet"]');
    await sheet.hover();
    await page.mouse.down();
    await page.mouse.move(0, 300);
    await page.mouse.up();
    
    // Verify sheet closes
    await expect(sheet).not.toBeVisible();
  });

  test('touch interactions work on map', async ({ page }) => {
    await page.goto('/');
    
    // Test pinch zoom (simulate touch)
    const map = page.locator('[data-testid="map-container"]');
    
    // Simulate pinch gesture
    await map.dispatchEvent('touchstart', {
      touches: [
        { clientX: 100, clientY: 100 },
        { clientX: 200, clientY: 200 }
      ]
    });
    
    await map.dispatchEvent('touchmove', {
      touches: [
        { clientX: 80, clientY: 80 },
        { clientX: 220, clientY: 220 }
      ]
    });
    
    await map.dispatchEvent('touchend');
    
    // Verify zoom level changed
    // (This would need to be validated through map API or visual changes)
  });
});

// Performance E2E tests
test.describe('Performance Validation', () => {
  test('page loads within performance budget', async ({ page }) => {
    // Start performance measurement
    await page.goto('/', { waitUntil: 'networkidle' });
    
    // Measure Core Web Vitals
    const metrics = await page.evaluate(() => {
      return new Promise((resolve) => {
        new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const vitals: Record<string, number> = {};
          
          entries.forEach((entry: any) => {
            if (entry.name === 'first-contentful-paint') {
              vitals.FCP = entry.startTime;
            }
            if (entry.name === 'largest-contentful-paint') {
              vitals.LCP = entry.startTime;
            }
          });
          
          resolve(vitals);
        }).observe({ entryTypes: ['paint', 'largest-contentful-paint'] });
        
        // Timeout after 5 seconds
        setTimeout(() => resolve({}), 5000);
      });
    });
    
    // Assert performance budgets
    expect(metrics.FCP).toBeLessThan(2000); // 2 seconds
    expect(metrics.LCP).toBeLessThan(4000); // 4 seconds
  });

  test('map interactions are smooth', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('[data-testid="map-container"]')).toBeVisible();
    
    // Test map panning performance
    const map = page.locator('[data-testid="map-container"]');
    
    const startTime = Date.now();
    
    // Simulate map drag
    await map.hover();
    await page.mouse.down();
    for (let i = 0; i < 10; i++) {
      await page.mouse.move(i * 10, i * 5);
      await page.waitForTimeout(16); // ~60fps
    }
    await page.mouse.up();
    
    const endTime = Date.now();
    const duration = endTime - startTime;
    
    // Verify smooth interaction (60fps = 16.67ms per frame)
    expect(duration).toBeLessThan(200); // Should complete in <200ms
  });
});
```

## 🎨 Visual Regression Testing

```typescript
// Visual testing configuration
const VISUAL_TEST_CONFIG = {
  threshold: 0.2,           // 20% pixel difference tolerance
  browsers: ['chromium', 'firefox', 'webkit'],
  viewports: [
    { width: 1920, height: 1080 },  // Desktop
    { width: 768, height: 1024 },   // Tablet
    { width: 375, height: 667 }     // Mobile
  ]
};

// Visual regression tests
test.describe('Visual Regression', () => {
  test('map interface renders consistently', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('[data-testid="map-container"]')).toBeVisible();
    
    // Wait for all venues to load
    await expect(page.locator('[data-testid="venue-pin"]')).toHaveCount(10);
    
    // Take screenshot
    await expect(page).toHaveScreenshot('map-interface.png', {
      fullPage: true,
      threshold: VISUAL_TEST_CONFIG.threshold
    });
  });

  test('venue details sheet renders correctly', async ({ page }) => {
    await page.goto('/');
    
    // Open venue details
    await page.locator('[data-testid="venue-pin"]').first().click();
    await expect(page.locator('[data-testid="venue-sheet"]')).toBeVisible();
    
    // Screenshot of venue details
    await expect(page.locator('[data-testid="venue-sheet"]')).toHaveScreenshot('venue-sheet.png');
  });

  test('dark theme renders correctly', async ({ page }) => {
    await page.goto('/');
    
    // Switch to dark theme
    await page.locator('[data-testid="theme-toggle"]').click();
    
    // Wait for theme transition
    await page.waitForTimeout(300);
    
    // Take screenshot
    await expect(page).toHaveScreenshot('dark-theme.png', {
      fullPage: true
    });
  });
});
```

## ♿ Accessibility Testing

### Automated Accessibility Testing

```typescript
// Jest + jest-axe setup
import { axe, toHaveNoViolations } from 'jest-axe';

expect.extend(toHaveNoViolations);

describe('Accessibility Tests', () => {
  it('has no accessibility violations on main page', async () => {
    const { container } = render(<App />);
    
    // Wait for content to load
    await waitFor(() => {
      expect(screen.getAllByTestId('venue-pin')).toHaveLength(10);
    });
    
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('venue sheet meets accessibility standards', async () => {
    render(<VenueSheet venue={mockVenue} onClose={jest.fn()} />);
    
    const sheet = screen.getByTestId('venue-sheet');
    const results = await axe(sheet);
    expect(results).toHaveNoViolations();
  });

  it('supports keyboard navigation', async () => {
    render(<App />);
    
    // Tab through interactive elements
    await user.tab();
    expect(screen.getByTestId('area-select')).toHaveFocus();
    
    await user.tab();
    expect(screen.getByTestId('vibe-filter')).toHaveFocus();
    
    // Continue through venue pins
    await user.tab();
    expect(screen.getAllByTestId('venue-pin')[0]).toHaveFocus();
  });

  it('provides proper ARIA labels', () => {
    render(<VenuePin venue={mockVenue} onSelect={jest.fn()} />);
    
    const pin = screen.getByRole('button');
    expect(pin).toHaveAttribute('aria-label', expect.stringContaining(mockVenue.name));
    expect(pin).toHaveAttribute('aria-describedby', 'venue-instructions');
  });
});

// Playwright accessibility tests
test.describe('Accessibility E2E', () => {
  test('page is accessible with screen reader', async ({ page }) => {
    await page.goto('/');
    
    // Inject axe-core
    await injectAxe(page);
    
    // Run accessibility scan
    const accessibilityScanResults = await checkA11y(page);
    expect(accessibilityScanResults.violations).toHaveLength(0);
  });

  test('high contrast mode works correctly', async ({ page }) => {
    // Enable high contrast mode
    await page.emulateMedia({ 
      colorScheme: 'dark',
      reducedMotion: 'reduce'
    });
    
    await page.goto('/');
    
    // Verify contrast ratios meet WCAG standards
    const textElement = page.locator('[data-testid="venue-name"]').first();
    const computedStyle = await textElement.evaluate(el => {
      return window.getComputedStyle(el);
    });
    
    // Color contrast should be at least 4.5:1 for normal text
    // (This would need a color contrast calculation utility)
  });
});
```

## ⚡ Performance Testing

### Load Testing Strategy

```typescript
// Performance test configuration
const PERFORMANCE_THRESHOLDS = {
  loadTime: {
    initial: 3000,        // 3 seconds first load
    subsequent: 1000      // 1 second cached loads
  },
  
  interactions: {
    venueSelection: 200,  // 200ms to select venue
    filterApplication: 100, // 100ms to apply filters
    storyNavigation: 50   // 50ms between stories
  },
  
  webVitals: {
    FCP: 2000,           // First Contentful Paint
    LCP: 4000,           // Largest Contentful Paint
    FID: 100,            // First Input Delay
    CLS: 0.1             // Cumulative Layout Shift
  }
};

// Performance testing with Lighthouse
const lighthouse = require('lighthouse');

describe('Performance Tests', () => {
  it('meets Lighthouse performance score', async () => {
    const url = 'http://localhost:3000';
    const options = {
      logLevel: 'info',
      output: 'json',
      onlyCategories: ['performance', 'accessibility'],
      port: 9222
    };
    
    const results = await lighthouse(url, options);
    const { performance, accessibility } = results.lhr.categories;
    
    expect(performance.score * 100).toBeGreaterThanOrEqual(90);
    expect(accessibility.score * 100).toBeGreaterThanOrEqual(95);
  });

  it('loads venue data within threshold', async () => {
    const startTime = performance.now();
    
    render(<App />);
    
    await waitFor(() => {
      expect(screen.getAllByTestId('venue-pin')).toHaveLength(10);
    });
    
    const loadTime = performance.now() - startTime;
    expect(loadTime).toBeLessThan(PERFORMANCE_THRESHOLDS.loadTime.initial);
  });

  it('handles large venue datasets efficiently', async () => {
    // Mock large dataset (1000+ venues)
    const largeVenueSet = Array.from({ length: 1000 }, (_, i) => ({
      venue_id: `venue-${i}`,
      name: `Venue ${i}`,
      lat: 25.2048 + (Math.random() - 0.5) * 0.1,
      lng: 55.2708 + (Math.random() - 0.5) * 0.1,
      category: 'nightclub'
    }));

    server.use(
      rest.get('/api/venues', (req, res, ctx) => 
        res(ctx.json(largeVenueSet))
      )
    );

    const startTime = performance.now();
    render(<MapContainer />);
    
    await waitFor(() => {
      // Should show clustered markers, not individual ones
      expect(screen.getAllByTestId(/venue-pin|cluster-marker/)).toHaveLength.lessThan(50);
    });
    
    const renderTime = performance.now() - startTime;
    expect(renderTime).toBeLessThan(2000); // 2 seconds max
  });
});

// Bundle size testing
describe('Bundle Analysis', () => {
  it('main bundle size is within budget', () => {
    const bundleSize = getBundleSize(); // Implementation needed
    expect(bundleSize).toBeLessThan(500 * 1024); // 500KB
  });

  it('code splitting works correctly', () => {
    const chunks = getChunkSizes(); // Implementation needed
    
    // Verify main chunk is reasonable
    expect(chunks.main).toBeLessThan(200 * 1024); // 200KB
    
    // Verify route chunks are lazy loaded
    expect(chunks.routes).toBeArray();
    expect(chunks.routes.every(size => size < 100 * 1024)).toBe(true);
  });
});
```

## 🔄 Continuous Integration Strategy

### GitHub Actions Workflow

```yaml
# .github/workflows/test.yml
name: Test Suite

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  unit-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run unit tests
        run: npm run test:unit -- --coverage
      
      - name: Upload coverage to Codecov
        uses: codecov/codecov-action@v3

  integration-tests:
    runs-on: ubuntu-latest
    services:
      postgres:
        image: postgres:14
        env:
          POSTGRES_PASSWORD: test
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
    
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      
      - name: Run integration tests
        run: npm run test:integration
        env:
          DATABASE_URL: postgresql://postgres:test@localhost:5432/test

  e2e-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      
      - name: Install Playwright
        run: npx playwright install --with-deps
      
      - name: Build application
        run: npm run build
      
      - name: Run E2E tests
        run: npm run test:e2e
      
      - name: Upload test results
        if: failure()
        uses: actions/upload-artifact@v3
        with:
          name: playwright-results
          path: test-results/

  lighthouse-audit:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      
      - name: Build and start server
        run: |
          npm ci
          npm run build
          npm start &
          npx wait-on http://localhost:3000
      
      - name: Run Lighthouse audit
        uses: treosh/lighthouse-ci-action@v9
        with:
          configPath: './lighthouserc.json'
          uploadArtifacts: true
```

## 📊 Test Coverage & Quality Gates

### Coverage Requirements

```json
{
  "coverageThreshold": {
    "global": {
      "branches": 80,
      "functions": 85,
      "lines": 85,
      "statements": 85
    },
    "./src/components/": {
      "branches": 85,
      "functions": 90,
      "lines": 90,
      "statements": 90
    },
    "./src/hooks/": {
      "branches": 90,
      "functions": 95,
      "lines": 95,
      "statements": 95
    }
  }
}
```

### Quality Gates

```typescript
// Quality gates that must pass before deployment
const QUALITY_GATES = {
  testing: {
    unit_test_coverage: '>= 85%',
    integration_test_coverage: '>= 80%',
    e2e_test_success: '100%',
    accessibility_violations: '0',
  },
  
  performance: {
    lighthouse_performance: '>= 90',
    lighthouse_accessibility: '>= 95',
    bundle_size: '<= 500KB',
    first_contentful_paint: '<= 2s',
    largest_contentful_paint: '<= 4s',
  },
  
  code_quality: {
    eslint_errors: '0',
    typescript_errors: '0',
    security_vulnerabilities: '0 high, 0 critical',
  }
};
```

## 🎯 Test Data Management

### Test Data Factory

```typescript
// test/factories/venueFactory.ts
import { faker } from '@faker-js/faker';

export const createVenue = (overrides: Partial<Venue> = {}): Venue => ({
  venue_id: faker.string.uuid(),
  unique_key: faker.string.alphanumeric(10),
  google_place_id: faker.string.alphanumeric(27),
  name: faker.company.name(),
  area: faker.helpers.arrayElement(DUBAI_AREAS.map(a => a.name)),
  address: faker.location.streetAddress(),
  city: 'Dubai',
  country: 'UAE',
  lat: faker.number.float({ min: 25.0, max: 25.4, precision: 0.0001 }),
  lng: faker.number.float({ min: 55.0, max: 55.4, precision: 0.0001 }),
  phone_number: faker.phone.number(),
  website: faker.internet.url(),
  category: faker.helpers.arrayElement(['nightclub', 'restaurant', 'bar', 'rooftop']),
  final_instagram: faker.internet.userName(),
  last_scraped_at: faker.date.recent(),
  created_at: faker.date.past(),
  updated_at: faker.date.recent(),
  ...overrides
});

export const createStory = (overrides: Partial<InstagramStory> = {}): InstagramStory => ({
  story_id: faker.string.uuid(),
  unique_key: faker.string.alphanumeric(15),
  venue_unique_key: faker.string.alphanumeric(10),
  story_date: faker.date.today(),
  user_id: faker.string.numeric(10),
  username: faker.internet.userName(),
  media_link: faker.image.url(),
  media_type: faker.helpers.arrayElement(['image', 'video']),
  timestamp: faker.date.recent(),
  context: faker.lorem.paragraph(),
  event_date: faker.date.future(),
  event_time: faker.date.future().toTimeString().slice(0, 5),
  venue_name: faker.company.name(),
  city: 'Dubai',
  country: 'UAE',
  artists: [faker.person.fullName(), faker.person.fullName()],
  music_genre: faker.helpers.arrayElements(['House', 'Techno', 'Hip Hop', 'R&B']),
  event_vibe: faker.helpers.arrayElements(['energetic', 'chill', 'upscale']),
  event_name: faker.lorem.words(3),
  confidence_score: faker.number.float({ min: 0.5, max: 1.0, precision: 0.01 }),
  expires_at: faker.date.soon(),
  created_at: faker.date.recent(),
  updated_at: faker.date.recent(),
  ...overrides
});

// Test data sets
export const testData = {
  venues: {
    downtown: Array.from({ length: 10 }, () => createVenue({ area: 'Downtown Dubai' })),
    marina: Array.from({ length: 8 }, () => createVenue({ area: 'Dubai Marina' })),
    jbr: Array.from({ length: 6 }, () => createVenue({ area: 'JBR' })),
  },
  
  stories: {
    active: Array.from({ length: 5 }, () => createStory({ 
      expires_at: faker.date.future() 
    })),
    expired: Array.from({ length: 3 }, () => createStory({ 
      expires_at: faker.date.past() 
    })),
  }
};
```

---

*Testing Strategy Version: 1.0*  
*Last Updated: September 6, 2025*  
*Status: Ready for Implementation*