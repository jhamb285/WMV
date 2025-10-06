# Technical Architecture - Dubai Event Discovery Platform

## 🏗️ System Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                        CLIENT LAYER                         │
├─────────────────────────────────────────────────────────────┤
│  Web Browser (Desktop/Mobile)                               │
│  ┌─────────────────┐ ┌─────────────────┐ ┌────────────────┐ │
│  │   React SPA     │ │  Google Maps    │ │  PWA Features  │ │
│  │   (Next.js 14)  │ │   JavaScript    │ │   (Offline)    │ │
│  └─────────────────┘ └─────────────────┘ └────────────────┘ │
└─────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────┐
│                    APPLICATION LAYER                        │
├─────────────────────────────────────────────────────────────┤
│  Next.js 14 Application (Vercel)                           │
│  ┌─────────────────┐ ┌─────────────────┐ ┌────────────────┐ │
│  │  App Router     │ │   API Routes    │ │  Server        │ │
│  │  (SSR/SSG)      │ │   (Backend)     │ │  Components    │ │
│  └─────────────────┘ └─────────────────┘ └────────────────┘ │
│                                │                             │
│  ┌─────────────────┐ ┌─────────────────┐ ┌────────────────┐ │
│  │  React Query    │ │   Zustand       │ │  Framer        │ │
│  │  (Caching)      │ │   (State Mgmt)  │ │  Motion        │ │
│  └─────────────────┘ └─────────────────┘ └────────────────┘ │
└─────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────┐
│                     DATA & SERVICES LAYER                   │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────────┐ ┌─────────────────┐ ┌────────────────┐ │
│  │   Supabase      │ │   n8n           │ │  Google Maps   │ │
│  │   PostgreSQL    │ │   Workflows     │ │   Platform     │ │
│  │   (Database)    │ │   (Data Proc.)  │ │   (Mapping)    │ │
│  └─────────────────┘ └─────────────────┘ └────────────────┘ │
│                                │                             │
│  ┌─────────────────┐ ┌─────────────────┐ ┌────────────────┐ │
│  │   OpenAI API    │ │   Instagram     │ │  Vercel Edge   │ │
│  │   (AI Chat)     │ │   (Stories)     │ │   (CDN)        │ │
│  └─────────────────┘ └─────────────────┘ └────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

## 📊 Data Architecture

### Database Schema (Supabase PostgreSQL)

```sql
-- Core Tables Architecture
┌─────────────────────┐         ┌─────────────────────┐
│       venues        │         │  instagram_stories  │
├─────────────────────┤         ├─────────────────────┤
│ venue_id (UUID)     │◄────────┤ venue_unique_key    │
│ unique_key (TEXT)   │         │ story_id (UUID)     │
│ google_place_id     │         │ unique_key (TEXT)   │
│ name (TEXT)         │         │ story_date (DATE)   │
│ area (TEXT)         │         │ username (TEXT)     │
│ address (TEXT)      │         │ media_link (TEXT)   │
│ lat (DECIMAL)       │         │ media_type (TEXT)   │
│ lng (DECIMAL)       │         │ context (TEXT)      │
│ category (TEXT)     │         │ event_date (DATE)   │
│ final_instagram     │         │ event_time (TIME)   │
│ last_scraped_at     │         │ event_vibe (TEXT[]) │
│ created_at          │         │ confidence_score    │
│ updated_at          │         │ expires_at          │
└─────────────────────┘         └─────────────────────┘

-- Indexes for Performance
CREATE INDEX CONCURRENTLY idx_venues_coordinates 
ON venues(lat, lng);

CREATE INDEX CONCURRENTLY idx_venues_area_active 
ON venues(area, last_scraped_at);

CREATE INDEX CONCURRENTLY idx_stories_venue_active 
ON instagram_stories(venue_unique_key, expires_at);

CREATE INDEX CONCURRENTLY idx_stories_vibe 
ON instagram_stories USING GIN(event_vibe);
```

### Data Flow Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   User Action   │───▶│  Frontend App   │───▶│   API Routes    │
│ (Map Interact)  │    │   (React)       │    │   (Next.js)     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                                       │
                       ┌─────────────────┐             ▼
                       │  React Query    │    ┌─────────────────┐
                       │   (Cache)       │◄───│   Supabase      │
                       └─────────────────┘    │   Database      │
                                              └─────────────────┘
                                                       │
┌─────────────────┐    ┌─────────────────┐             │
│   Background    │◄───│   n8n           │◄────────────┘
│   Updates       │    │   Webhooks      │
└─────────────────┘    └─────────────────┘
```

## 🔧 Component Architecture

### Frontend Component Hierarchy

```typescript
// Component Tree Structure
App (layout.tsx)
├── Providers (React Query, Zustand, Theme)
├── MapContainer
│   ├── GoogleMap
│   │   ├── VenuePin[]
│   │   ├── VenueCluster[]
│   │   └── MapControls
│   ├── FilterPanel
│   │   ├── LocationSelector
│   │   ├── VibeFilter
│   │   └── OfferFilter
│   └── LoadingOverlay
├── VenueSheet
│   ├── VenueHeader
│   ├── StoryViewer
│   │   ├── StorySlide[]
│   │   └── StoryControls
│   ├── EventInfo
│   └── ContactInfo
├── ChatBot
│   ├── ChatMessages[]
│   ├── ChatInput
│   └── ChatSuggestions
└── GlobalComponents
    ├── ErrorBoundary
    ├── NotificationSystem
    └── PWAUpdatePrompt
```

### Component Specifications

#### MapContainer Component
```typescript
interface MapContainerProps {
  initialCenter: LatLng;
  initialZoom: number;
  venues: Venue[];
  selectedVenue: Venue | null;
  onVenueSelect: (venue: Venue) => void;
  filters: FilterState;
}

interface MapContainerState {
  mapInstance: google.maps.Map | null;
  bounds: google.maps.LatLngBounds | null;
  clusteredVenues: VenueCluster[];
  isLoading: boolean;
  error: string | null;
}

// Performance Optimizations:
// - Venue clustering algorithm for 1000+ markers
// - Virtualization for off-screen venues
// - Debounced map event handlers
// - Memoized venue calculations
```

#### VenuePin Component
```typescript
interface VenuePinProps {
  venue: Venue;
  position: google.maps.LatLng;
  hasActiveStories: boolean;
  isSelected: boolean;
  onClick: () => void;
  onHover: (hovered: boolean) => void;
}

// Visual States:
// - Default: Gray circle with venue icon
// - Active Stories: Pulsing gold animation
// - Selected: Enlarged with venue name label
// - Hover: Scale transform with glow effect
// - Cluster: Numbered circle with count
```

#### StoryViewer Component
```typescript
interface StoryViewerProps {
  stories: InstagramStory[];
  autoPlay: boolean;
  onComplete: () => void;
  onStoryChange: (index: number) => void;
}

interface StoryViewerState {
  currentIndex: number;
  isPlaying: boolean;
  progress: number;
  loadedMedia: Set<string>;
}

// Features:
// - Instagram-style progress indicators
// - Touch gestures (swipe, tap)
// - Media preloading optimization
// - Accessibility controls
// - Auto-expiration handling
```

## 🔗 API Architecture

### API Route Structure

```typescript
// /api/venues/route.ts
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const area = searchParams.get('area');
  const vibes = searchParams.getAll('vibe');
  const offers = searchParams.getAll('offer');
  
  // Implementation:
  // 1. Validate parameters
  // 2. Check React Query cache
  // 3. Query Supabase with filters
  // 4. Return paginated results
  // 5. Trigger background refresh if needed
}

// /api/stories/route.ts
export async function GET(request: NextRequest) {
  const venueId = request.nextUrl.searchParams.get('venueId');
  
  // Implementation:
  // 1. Fetch active stories (not expired)
  // 2. Include AI analysis data
  // 3. Sort by timestamp
  // 4. Return with media URLs
}

// /api/trigger-workflow/route.ts
export async function POST(request: NextRequest) {
  const { workflowType, data } = await request.json();
  
  // Implementation:
  // 1. Validate webhook payload
  // 2. Call n8n webhook with data
  // 3. Return job ID for tracking
  // 4. Handle webhook failures gracefully
}
```

### Caching Strategy

```typescript
// React Query Configuration
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,    // 5 minutes
      cacheTime: 30 * 60 * 1000,   // 30 minutes
      refetchOnWindowFocus: true,
      refetchOnReconnect: true,
      retry: 3,
    },
  },
});

// Cache Keys Structure
const CACHE_KEYS = {
  venues: (area: string, filters: FilterState) => 
    ['venues', area, filters],
  stories: (venueId: string) => 
    ['stories', venueId],
  areas: ['areas'],
} as const;

// Supabase Caching
// - Client-side cache for read queries
// - Server-side cache for static data
// - Real-time subscriptions for live updates
```

## 🎨 State Management Architecture

### Zustand Store Structure

```typescript
interface AppState {
  // Map State
  map: {
    instance: google.maps.Map | null;
    center: LatLng;
    zoom: number;
    bounds: google.maps.LatLngBounds | null;
  };
  
  // UI State
  ui: {
    selectedVenue: Venue | null;
    isVenueSheetOpen: boolean;
    isChatOpen: boolean;
    isLoading: boolean;
    theme: 'dark' | 'light';
  };
  
  // Filter State
  filters: {
    selectedArea: string;
    activeVibes: string[];
    activeOffers: string[];
    searchQuery: string;
  };
  
  // Data State
  data: {
    venues: Venue[];
    clusteredVenues: VenueCluster[];
    activeStories: Map<string, InstagramStory[]>;
  };
}

// Actions
interface AppActions {
  // Map Actions
  setMapInstance: (map: google.maps.Map) => void;
  updateMapBounds: (bounds: google.maps.LatLngBounds) => void;
  
  // UI Actions
  selectVenue: (venue: Venue | null) => void;
  toggleVenueSheet: () => void;
  toggleChat: () => void;
  setTheme: (theme: 'dark' | 'light') => void;
  
  // Filter Actions
  setArea: (area: string) => void;
  toggleVibe: (vibe: string) => void;
  toggleOffer: (offer: string) => void;
  setSearchQuery: (query: string) => void;
  
  // Data Actions
  setVenues: (venues: Venue[]) => void;
  updateStories: (venueId: string, stories: InstagramStory[]) => void;
}
```

### React Query Integration

```typescript
// Custom Hooks
export const useVenues = (area: string, filters: FilterState) => {
  return useQuery({
    queryKey: CACHE_KEYS.venues(area, filters),
    queryFn: () => fetchVenues(area, filters),
    staleTime: 5 * 60 * 1000,
    select: (data) => ({
      venues: data.venues,
      clustered: clusterVenues(data.venues, mapBounds),
    }),
  });
};

export const useStories = (venueId: string) => {
  return useQuery({
    queryKey: CACHE_KEYS.stories(venueId),
    queryFn: () => fetchStories(venueId),
    enabled: !!venueId,
    refetchInterval: 60 * 1000, // Refresh every minute
    select: (data) => data.filter(story => !isExpired(story.expires_at)),
  });
};

// Mutations
export const useTriggerWorkflow = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ type, data }: WorkflowTrigger) => 
      triggerWorkflow(type, data),
    onSuccess: (_, variables) => {
      // Invalidate related queries
      queryClient.invalidateQueries({
        queryKey: ['venues', variables.data.area],
      });
    },
  });
};
```

## 🗺️ Google Maps Integration

### Map Configuration

```typescript
// Maps Setup
const GOOGLE_MAPS_CONFIG = {
  apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
  libraries: ['places', 'geometry'] as const,
  language: 'en',
  region: 'AE', // United Arab Emirates
};

// Custom Map Style (Retro Theme)
const DUBAI_RETRO_STYLE: google.maps.MapTypeStyle[] = [
  { elementType: "geometry", stylers: [{ color: "#ebe3cd" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#523735" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#f5f1e6" }] },
  {
    featureType: "administrative",
    elementType: "geometry.stroke",
    stylers: [{ color: "#c9b2a6" }],
  },
  {
    featureType: "administrative.land_parcel",
    elementType: "geometry.stroke",
    stylers: [{ color: "#dcd2be" }],
  },
  {
    featureType: "administrative.land_parcel",
    elementType: "labels.text.fill",
    stylers: [{ color: "#ae9e90" }],
  },
  {
    featureType: "landscape.natural",
    elementType: "geometry",
    stylers: [{ color: "#dfd2ae" }],
  },
  {
    featureType: "poi",
    elementType: "geometry",
    stylers: [{ color: "#dfd2ae" }],
  },
  {
    featureType: "poi",
    elementType: "labels.text.fill",
    stylers: [{ color: "#93817c" }],
  },
  {
    featureType: "poi.park",
    elementType: "geometry.fill",
    stylers: [{ color: "#a5b076" }],
  },
  {
    featureType: "poi.park",
    elementType: "labels.text.fill",
    stylers: [{ color: "#447530" }],
  },
  {
    featureType: "road",
    elementType: "geometry",
    stylers: [{ color: "#f5f1e6" }],
  },
  {
    featureType: "road.arterial",
    elementType: "geometry",
    stylers: [{ color: "#fdfcf8" }],
  },
  {
    featureType: "road.highway",
    elementType: "geometry",
    stylers: [{ color: "#f8c967" }],
  },
  {
    featureType: "road.highway",
    elementType: "geometry.stroke",
    stylers: [{ color: "#e9bc62" }],
  },
  {
    featureType: "road.highway.controlled_access",
    elementType: "geometry",
    stylers: [{ color: "#e98d58" }],
  },
  {
    featureType: "road.highway.controlled_access",
    elementType: "geometry.stroke",
    stylers: [{ color: "#db8555" }],
  },
  {
    featureType: "road.local",
    elementType: "labels.text.fill",
    stylers: [{ color: "#806b63" }],
  },
  {
    featureType: "transit.line",
    elementType: "geometry",
    stylers: [{ color: "#dfd2ae" }],
  },
  {
    featureType: "transit.line",
    elementType: "labels.text.fill",
    stylers: [{ color: "#8f7d77" }],
  },
  {
    featureType: "transit.line",
    elementType: "labels.text.stroke",
    stylers: [{ color: "#ebe3cd" }],
  },
  {
    featureType: "transit.station",
    elementType: "geometry",
    stylers: [{ color: "#dfd2ae" }],
  },
  {
    featureType: "water",
    elementType: "geometry.fill",
    stylers: [{ color: "#b9d3c2" }],
  },
  {
    featureType: "water",
    elementType: "labels.text.fill",
    stylers: [{ color: "#92998d" }],
  },
];

// Map Options
const MAP_OPTIONS: google.maps.MapOptions = {
  center: DUBAI_CENTER,
  zoom: 12,
  styles: DUBAI_RETRO_STYLE,
  disableDefaultUI: true,
  gestureHandling: 'cooperative',
  mapTypeId: 'roadmap',
  clickableIcons: false,
  maxZoom: 18,
  minZoom: 10,
  restriction: {
    latLngBounds: DUBAI_BOUNDS,
    strictBounds: false,
  },
};
```

### Venue Clustering Algorithm

```typescript
interface VenueCluster {
  id: string;
  center: LatLng;
  venues: Venue[];
  bounds: google.maps.LatLngBounds;
  count: number;
}

class VenueClusterer {
  private gridSize = 60; // pixels
  private maxZoom = 15;
  
  cluster(venues: Venue[], map: google.maps.Map): VenueCluster[] {
    const zoom = map.getZoom()!;
    
    if (zoom > this.maxZoom) {
      return venues.map(venue => ({
        id: venue.venue_id,
        center: { lat: venue.lat, lng: venue.lng },
        venues: [venue],
        bounds: new google.maps.LatLngBounds(
          { lat: venue.lat, lng: venue.lng }
        ),
        count: 1,
      }));
    }
    
    // Grid-based clustering algorithm
    const clusters: Map<string, VenueCluster> = new Map();
    const projection = map.getProjection()!;
    
    venues.forEach(venue => {
      const point = projection.fromLatLngToPoint(
        new google.maps.LatLng(venue.lat, venue.lng)
      )!;
      
      const gridX = Math.floor(point.x / this.gridSize);
      const gridY = Math.floor(point.y / this.gridSize);
      const gridKey = `${gridX},${gridY}`;
      
      if (clusters.has(gridKey)) {
        const cluster = clusters.get(gridKey)!;
        cluster.venues.push(venue);
        cluster.count++;
        cluster.bounds.extend(
          new google.maps.LatLng(venue.lat, venue.lng)
        );
        cluster.center = cluster.bounds.getCenter().toJSON();
      } else {
        clusters.set(gridKey, {
          id: `cluster-${gridKey}`,
          center: { lat: venue.lat, lng: venue.lng },
          venues: [venue],
          bounds: new google.maps.LatLngBounds(
            new google.maps.LatLng(venue.lat, venue.lng)
          ),
          count: 1,
        });
      }
    });
    
    return Array.from(clusters.values());
  }
}
```

## 📱 Responsive Design Architecture

### Breakpoint System

```typescript
// Tailwind CSS Breakpoints
const BREAKPOINTS = {
  sm: '640px',   // Mobile landscape
  md: '768px',   // Tablet
  lg: '1024px',  // Desktop
  xl: '1280px',  // Large desktop
  '2xl': '1536px', // Extra large desktop
} as const;

// Component Responsive Behavior
interface ResponsiveLayout {
  mobile: {
    mapHeight: '100vh';
    venueDetails: 'bottom-sheet'; // Modal from bottom
    filters: 'collapsed'; // Expandable overlay
    navigation: 'bottom-tabs';
  };
  tablet: {
    mapHeight: '100vh';
    venueDetails: 'side-panel-50%'; // 50% width panel
    filters: 'top-bar'; // Horizontal filter bar
    navigation: 'top-bar';
  };
  desktop: {
    mapHeight: '100vh';
    venueDetails: 'side-panel-400px'; // Fixed width panel
    filters: 'top-left-overlay'; // Positioned overlay
    navigation: 'header';
  };
}
```

### Mobile-First Component Design

```typescript
// VenueSheet Responsive Implementation
const VenueSheet: React.FC<VenueSheetProps> = ({ venue, onClose }) => {
  const isMobile = useMediaQuery('(max-width: 768px)');
  
  if (isMobile) {
    return (
      <Sheet open={!!venue} onOpenChange={onClose}>
        <SheetContent side="bottom" className="h-[80vh]">
          <VenueContent venue={venue} />
        </SheetContent>
      </Sheet>
    );
  }
  
  return (
    <Sheet open={!!venue} onOpenChange={onClose}>
      <SheetContent side="right" className="w-[400px]">
        <VenueContent venue={venue} />
      </SheetContent>
    </Sheet>
  );
};

// Touch Gesture Handling
const useSwipeGestures = (callbacks: SwipeCallbacks) => {
  const [touchStart, setTouchStart] = useState<TouchEvent['touches'][0] | null>(null);
  
  const handleTouchStart = (e: TouchEvent) => {
    setTouchStart(e.touches[0]);
  };
  
  const handleTouchEnd = (e: TouchEvent) => {
    if (!touchStart) return;
    
    const touchEnd = e.changedTouches[0];
    const deltaX = touchEnd.clientX - touchStart.clientX;
    const deltaY = touchEnd.clientY - touchStart.clientY;
    
    const threshold = 50;
    
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      if (deltaX > threshold) callbacks.onSwipeRight();
      if (deltaX < -threshold) callbacks.onSwipeLeft();
    } else {
      if (deltaY > threshold) callbacks.onSwipeDown();
      if (deltaY < -threshold) callbacks.onSwipeUp();
    }
  };
  
  return { handleTouchStart, handleTouchEnd };
};
```

## 🔒 Security Architecture

### Content Security Policy

```typescript
// next.config.js
const securityHeaders = [
  {
    key: 'Content-Security-Policy',
    value: `
      default-src 'self';
      script-src 'self' 'unsafe-eval' 'unsafe-inline' 
        https://maps.googleapis.com 
        https://maps.gstatic.com;
      style-src 'self' 'unsafe-inline' 
        https://fonts.googleapis.com;
      img-src 'self' data: blob: 
        https://maps.googleapis.com 
        https://maps.gstatic.com
        https://*.instagram.com;
      font-src 'self' 
        https://fonts.gstatic.com;
      connect-src 'self' 
        https://*.supabase.co 
        https://api.openai.com
        https://n8n-webhook-url.com;
    `.replace(/\s+/g, ' ').trim()
  },
  {
    key: 'X-Frame-Options',
    value: 'DENY'
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff'
  },
  {
    key: 'Referrer-Policy',
    value: 'origin-when-cross-origin'
  }
];
```

### API Security

```typescript
// Rate Limiting
const rateLimit = new Map<string, { count: number; lastRequest: number }>();

const isRateLimited = (ip: string, limit: number = 100, window: number = 60000) => {
  const now = Date.now();
  const userRequests = rateLimit.get(ip);
  
  if (!userRequests) {
    rateLimit.set(ip, { count: 1, lastRequest: now });
    return false;
  }
  
  if (now - userRequests.lastRequest > window) {
    rateLimit.set(ip, { count: 1, lastRequest: now });
    return false;
  }
  
  if (userRequests.count >= limit) {
    return true;
  }
  
  userRequests.count++;
  return false;
};

// Input Validation
const validateVenueQuery = (params: URLSearchParams) => {
  const area = params.get('area');
  const vibes = params.getAll('vibe');
  const offers = params.getAll('offer');
  
  // Validate area
  if (area && !DUBAI_AREAS.some(a => a.name === area)) {
    throw new Error('Invalid area parameter');
  }
  
  // Validate vibes
  if (vibes.some(vibe => !VIBE_OPTIONS.includes(vibe))) {
    throw new Error('Invalid vibe parameter');
  }
  
  // Validate offers
  if (offers.some(offer => !OFFER_OPTIONS.includes(offer))) {
    throw new Error('Invalid offer parameter');
  }
  
  return { area, vibes, offers };
};
```

## 📊 Monitoring & Observability

### Performance Monitoring

```typescript
// Web Vitals Tracking
const reportWebVitals = (metric: NextWebVitalsMetric) => {
  const analytics = {
    id: metric.id,
    name: metric.name,
    label: metric.label,
    value: metric.value,
  };
  
  // Send to Vercel Analytics
  if (process.env.NODE_ENV === 'production') {
    gtag('event', metric.name, {
      event_category: 'Web Vitals',
      event_label: metric.id,
      value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
      non_interaction: true,
    });
  }
};

// Custom Performance Metrics
const trackMapPerformance = () => {
  const observer = new PerformanceObserver((list) => {
    list.getEntries().forEach((entry) => {
      if (entry.name.includes('venue-render')) {
        analytics.track('Map Performance', {
          operation: entry.name,
          duration: entry.duration,
          timestamp: Date.now(),
        });
      }
    });
  });
  
  observer.observe({ entryTypes: ['measure'] });
};
```

### Error Tracking

```typescript
// Error Boundary with Sentry
class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }
  
  static getDerivedStateFromError(error: Error) {
    return { hasError: true };
  }
  
  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log error to Sentry
    Sentry.captureException(error, {
      contexts: {
        react: {
          componentStack: errorInfo.componentStack,
        },
      },
    });
  }
  
  render() {
    if (this.state.hasError) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Something went wrong</h2>
            <p className="text-muted-foreground mb-4">
              We're sorry, but something unexpected happened.
            </p>
            <Button 
              onClick={() => this.setState({ hasError: false })}
              className="w-full"
            >
              Try Again
            </Button>
          </Card>
        </div>
      );
    }
    
    return this.props.children;
  }
}
```

## 🚀 Deployment Architecture

### Vercel Configuration

```typescript
// vercel.json
{
  "builds": [
    {
      "src": "next.config.js",
      "use": "@vercel/next"
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "/api/$1"
    },
    {
      "src": "/(.*)",
      "dest": "/$1"
    }
  ],
  "env": {
    "NEXT_PUBLIC_SUPABASE_URL": "@supabase_url",
    "NEXT_PUBLIC_SUPABASE_ANON_KEY": "@supabase_anon_key",
    "NEXT_PUBLIC_GOOGLE_MAPS_API_KEY": "@google_maps_key"
  },
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        }
      ]
    }
  ]
}

// Edge Runtime Configuration
export const runtime = 'edge';
export const preferredRegion = ['dub1']; // Dubai region for optimal latency
```

### Build Optimization

```typescript
// next.config.js
const nextConfig = {
  experimental: {
    appDir: true,
    serverComponentsExternalPackages: ['@google-cloud/storage'],
  },
  images: {
    domains: ['instagram.com', 'scontent.cdninstagram.com'],
    formats: ['image/webp', 'image/avif'],
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Client-side optimizations
      config.resolve.fallback = {
        fs: false,
        net: false,
        tls: false,
      };
    }
    
    // Bundle analyzer in development
    if (process.env.ANALYZE === 'true') {
      const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
      config.plugins.push(
        new BundleAnalyzerPlugin({
          analyzerMode: 'static',
          openAnalyzer: false,
        })
      );
    }
    
    return config;
  },
};
```

---

*Architecture Version: 1.0*  
*Last Updated: September 6, 2025*  
*Status: Ready for Implementation*