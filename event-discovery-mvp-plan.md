# Dubai Event Discovery Mobile Web App - MVP Implementation Guide

**📱 UPDATED: Now Mobile-First Exclusive Web Application**

## 🎯 Mobile Web App Overview

A mobile-first, real-time event discovery web application for **Dubai** that visualizes local venues on a full-screen interactive map with bottom filter controls. The platform scrapes venue information from Google Maps, extracts their Instagram handles, analyzes their stories using AI, and displays real-time events and happenings on a map interface.

## 🏗️ Architecture Overview

### System Components
1. **Frontend**: Next.js web application with Google Maps interface
2. **Backend**: n8n workflows (already built) for scraping and AI analysis
3. **Database**: Supabase for data storage and caching
4. **No Authentication**: Anonymous usage for MVP

## 📊 Database Schema (Supabase)

### Table 1: `venues`
Stores venue information from Google Maps scraping.

```sql
CREATE TABLE venues (
  venue_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  unique_key TEXT UNIQUE NOT NULL, -- Format: "{lat}_{lng}_{place_id}"
  google_place_id TEXT,
  name TEXT NOT NULL,
  area TEXT,
  address TEXT,
  city TEXT DEFAULT 'Dubai',
  country TEXT DEFAULT 'UAE',
  lat DECIMAL(10, 8),
  lng DECIMAL(11, 8),
  phone_number TEXT,
  website TEXT,
  category TEXT,
  cleaned_instagram TEXT,
  match_ai_instagram TEXT,
  final_instagram TEXT,
  last_scraped_at TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_venues_area ON venues(area);
CREATE INDEX idx_venues_coordinates ON venues(lat, lng);
CREATE INDEX idx_venues_unique_key ON venues(unique_key);
CREATE INDEX idx_venues_last_scraped ON venues(last_scraped_at);
```

### Table 2: `instagram_stories`
Stores analyzed Instagram story data with media links only.

```sql
CREATE TABLE instagram_stories (
  story_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  unique_key TEXT UNIQUE NOT NULL, -- Format: "{venue_unique_key}_{instagram_media_id}_{timestamp}"
  venue_unique_key TEXT REFERENCES venues(unique_key),
  story_date DATE,
  user_id TEXT,
  username TEXT,
  media_link TEXT, -- Only store links, not actual files
  media_type TEXT,
  mentions TEXT[],
  timestamp TIMESTAMP,
  
  -- AI Analysis Fields (already processed by n8n)
  context TEXT,
  event_date DATE,
  event_time TIME,
  venue_name TEXT,
  city TEXT DEFAULT 'Dubai',
  country TEXT DEFAULT 'UAE',
  artists TEXT[],
  music_genre TEXT[],
  event_vibe TEXT[], -- ['energetic', 'chill', 'formal', etc.]
  event_name TEXT,
  ticket_price DECIMAL(10, 2),
  special_offers TEXT[],
  website_social TEXT[],
  confidence_score DECIMAL(3, 2), -- 0.00 to 1.00
  analysis_notes TEXT,
  
  expires_at TIMESTAMP, -- Stories expire after 24 hours
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_stories_venue ON instagram_stories(venue_unique_key);
CREATE INDEX idx_stories_expires ON instagram_stories(expires_at);
CREATE INDEX idx_stories_vibe ON instagram_stories USING GIN(event_vibe);
CREATE INDEX idx_stories_offers ON instagram_stories USING GIN(special_offers);
```

## 🔄 Backend Integration (n8n Workflows)

### Webhook Endpoints (Already Built in n8n)

#### Workflow 1: Venue Discovery
- **Endpoint**: `POST /webhook/venue-discovery`
- **Input**: `{ area: string, city: "Dubai", country: "UAE" }`
- **Output**: Returns venue data with Instagram handles
- **Database Action**: Upserts to `venues` table

#### Workflow 2: Story Scraping & Analysis  
- **Endpoint**: `POST /webhook/story-analysis`
- **Input**: Array of venue records with Instagram handles
- **Output**: Analyzed story data with event information
- **Database Action**: Upserts to `instagram_stories` table

### Data Flow Strategy

```
1. User selects area in Dubai
2. Frontend checks Supabase for cached venues
3. If data exists and < 6 hours old:
   - Display immediately
   - Trigger background update via webhook
4. If no data or stale:
   - Show loading state
   - Trigger webhook immediately
   - Display results as they arrive
```

## 🎨 Frontend Implementation Guide

### Tech Stack Requirements
```json
{
  "dependencies": {
    "next": "^14.0.0",
    "@supabase/supabase-js": "^2.39.0",
    "@tanstack/react-query": "^5.0.0",
    "zustand": "^4.4.0",
    "@react-google-maps/api": "^2.19.0",
    "axios": "^1.6.0",
    "date-fns": "^3.0.0",
    "lucide-react": "^0.300.0"
  },
  "devDependencies": {
    "@types/google.maps": "^3.54.0",
    "tailwindcss": "^3.4.0",
    "typescript": "^5.0.0"
  }
}
```

### Shadcn UI Components to Install
```bash
npx shadcn-ui@latest add button
npx shadcn-ui@latest add card
npx shadcn-ui@latest add dialog
npx shadcn-ui@latest add select
npx shadcn-ui@latest add badge
npx shadcn-ui@latest add skeleton
npx shadcn-ui@latest add sheet
npx shadcn-ui@latest add tabs
npx shadcn-ui@latest add input
npx shadcn-ui@latest add scroll-area
npx shadcn-ui@latest add avatar
npx shadcn-ui@latest add separator
```

### Project Structure
```
src/
├── app/
│   ├── page.tsx                    # Main map view
│   ├── layout.tsx                   # Root layout with providers
│   └── api/
│       ├── venues/
│       │   └── route.ts            # Venue data endpoint
│       ├── stories/
│       │   └── route.ts            # Story data endpoint
│       ├── trigger-workflow/
│       │   └── route.ts            # n8n webhook trigger
│       └── chat/
│           └── route.ts            # AI chat endpoint
├── components/
│   ├── map/
│   │   ├── MapContainer.tsx        # Google Maps wrapper
│   │   ├── VenuePin.tsx           # Custom map markers
│   │   └── MapControls.tsx        # Zoom, style controls
│   ├── filters/
│   │   ├── LocationSelector.tsx    # Dubai area selector
│   │   ├── VibeFilter.tsx         # Event vibe multi-select
│   │   └── OfferFilter.tsx        # Special offers filter
│   ├── venue/
│   │   ├── VenueSheet.tsx         # Side panel for venue details
│   │   ├── StoryViewer.tsx        # Instagram story display
│   │   └── EventInfo.tsx          # AI-analyzed event details
│   ├── chat/
│   │   ├── ChatBot.tsx            # AI assistant interface
│   │   └── ChatMessage.tsx        # Message component
│   └── ui/                        # Shadcn components
├── lib/
│   ├── supabase.ts                # Supabase client setup
│   ├── maps-config.ts             # Google Maps configuration
│   ├── constants.ts               # Dubai areas, vibes, etc.
│   └── utils.ts                   # Helper functions
├── hooks/
│   ├── useVenues.ts               # Venue data fetching
│   ├── useStories.ts              # Story data fetching
│   ├── useMapData.ts              # Combined map data hook
│   └── useWebhookTrigger.ts      # n8n webhook triggers
├── stores/
│   └── map-store.ts               # Zustand store for map state
└── types/
    └── index.ts                   # TypeScript definitions
```

## 📍 Dubai-Specific Configuration

### Areas to Cover (Priority Order)
```typescript
const DUBAI_AREAS = [
  // Priority 1 - Nightlife Hotspots
  { name: 'Downtown Dubai', lat: 25.1972, lng: 55.2744 },
  { name: 'Dubai Marina', lat: 25.0805, lng: 55.1403 },
  { name: 'JBR', lat: 25.0752, lng: 55.1337 },
  { name: 'Business Bay', lat: 25.1850, lng: 55.2650 },
  
  // Priority 2 - Trendy Areas
  { name: 'DIFC', lat: 25.2110, lng: 55.2820 },
  { name: 'City Walk', lat: 25.2048, lng: 55.2645 },
  { name: 'La Mer', lat: 25.2354, lng: 55.2707 },
  { name: 'Bluewaters', lat: 25.0764, lng: 55.1201 },
  
  // Priority 3 - Cultural/Traditional
  { name: 'Old Dubai/Deira', lat: 25.2654, lng: 55.3007 },
  { name: 'Al Seef', lat: 25.2554, lng: 55.2934 },
  { name: 'Jumeirah', lat: 25.2048, lng: 55.2708 }
];
```

### Map Styling
```javascript
// Dark mode map style for Dubai nightlife theme
const mapStyles = [
  { elementType: "geometry", stylers: [{ color: "#242f3e" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#242f3e" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#746855" }] },
  // ... (reference Google Maps styling documentation)
];
```

## 🎨 UI/UX Requirements

### Main Map Interface
```tsx
// MapContainer.tsx structure
<div className="relative h-screen w-full">
  {/* Google Map */}
  <GoogleMap
    center={dubaiCenter}
    zoom={12}
    options={{
      styles: mapStyles,
      mapId: process.env.NEXT_PUBLIC_MAP_ID,
      disableDefaultUI: true
    }}
  >
    {/* Venue Pins */}
    {venues.map(venue => (
      <VenuePin 
        key={venue.unique_key}
        venue={venue}
        hasStories={hasActiveStories(venue)}
        onClick={() => openVenueDetails(venue)}
      />
    ))}
  </GoogleMap>

  {/* Overlay Controls */}
  <div className="absolute top-4 left-4 right-4 z-10">
    <Card className="p-4 backdrop-blur bg-background/90">
      <div className="flex gap-4">
        <LocationSelector />
        <VibeFilter />
        <OfferFilter />
      </div>
    </Card>
  </div>

  {/* Venue Details Sheet */}
  <VenueSheet />
  
  {/* AI Chat Bot - Bottom Right */}
  <ChatBot className="absolute bottom-4 right-4" />
</div>
```

### Filter Components

#### Location Selector
```tsx
// Pre-populated with Dubai areas
<Select defaultValue="downtown">
  <SelectTrigger>
    <SelectValue placeholder="Select area" />
  </SelectTrigger>
  <SelectContent>
    {DUBAI_AREAS.map(area => (
      <SelectItem key={area.name} value={area.name}>
        {area.name}
      </SelectItem>
    ))}
  </SelectContent>
</Select>
```

#### Vibe Filter (Multi-select)
```typescript
const VIBE_OPTIONS = [
  'Party/Energetic',
  'Chill/Lounge', 
  'Live Music',
  'Rooftop',
  'Beach Club',
  'Ladies Night',
  'Brunch',
  'Shisha Lounge'
];
```

#### Offer Filter (Multi-select)
```typescript
const OFFER_OPTIONS = [
  'Happy Hour',
  'Free Entry',
  'Ladies Free',
  'Table Deals',
  'Bottle Service',
  'Student Discount',
  'Group Packages'
];
```

### Venue Details Sheet
```tsx
// Right side panel that slides in
<Sheet open={selectedVenue} onOpenChange={setSelectedVenue}>
  <SheetContent className="w-[400px] overflow-y-auto">
    <SheetHeader>
      <SheetTitle>{venue.name}</SheetTitle>
      <Badge>{venue.category}</Badge>
    </SheetHeader>
    
    {/* Instagram Stories */}
    <div className="mt-4">
      <h3 className="font-semibold mb-2">Current Stories</h3>
      <StoryViewer stories={activeStories} />
    </div>
    
    {/* AI-Analyzed Event Info */}
    <div className="mt-4 space-y-2">
      <EventInfo data={storyAnalysis} />
    </div>
    
    {/* Venue Info */}
    <div className="mt-4">
      <p>{venue.address}</p>
      <p>{venue.phone_number}</p>
      <a href={venue.website}>Website</a>
      <a href={`https://instagram.com/${venue.final_instagram}`}>Instagram</a>
    </div>
  </SheetContent>
</Sheet>
```

### AI Chat Assistant
```tsx
// Floating chat button with dialog
<Dialog>
  <DialogTrigger asChild>
    <Button className="rounded-full h-14 w-14">
      <MessageCircle />
    </Button>
  </DialogTrigger>
  <DialogContent className="max-w-md h-[600px]">
    <div className="flex flex-col h-full">
      <DialogHeader>
        <DialogTitle>Dubai Nightlife Assistant</DialogTitle>
      </DialogHeader>
      <ScrollArea className="flex-1 p-4">
        {messages.map(msg => (
          <ChatMessage key={msg.id} message={msg} />
        ))}
      </ScrollArea>
      <div className="p-4 border-t">
        <Input 
          placeholder="Ask about events, vibes, or places..."
          onKeyDown={handleSendMessage}
        />
      </div>
    </div>
  </DialogContent>
</Dialog>
```

## 🔌 API Implementation

### `/api/venues/route.ts`
```typescript
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const area = searchParams.get('area') || 'Downtown Dubai';
  
  // 1. Check Supabase for cached venues
  const { data: cachedVenues } = await supabase
    .from('venues')
    .select('*')
    .eq('area', area)
    .gte('last_scraped_at', sixHoursAgo);
  
  if (cachedVenues && cachedVenues.length > 0) {
    // 2. Return cached data immediately
    // 3. Trigger background refresh if needed
    if (shouldRefresh(cachedVenues)) {
      triggerWebhook('/webhook/venue-discovery', { area });
    }
    return Response.json(cachedVenues);
  }
  
  // 4. No cache - trigger webhook and wait
  const newVenues = await triggerWebhookAndWait('/webhook/venue-discovery', { area });
  return Response.json(newVenues);
}
```

### `/api/stories/route.ts`
```typescript
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const venueId = searchParams.get('venueId');
  
  // Get active stories (not expired)
  const { data: stories } = await supabase
    .from('instagram_stories')
    .select('*')
    .eq('venue_unique_key', venueId)
    .gte('expires_at', new Date().toISOString())
    .order('timestamp', { ascending: false });
  
  return Response.json(stories || []);
}
```

### `/api/trigger-workflow/route.ts`
```typescript
export async function POST(request: Request) {
  const body = await request.json();
  const { workflowType, data } = body;
  
  const webhookUrl = workflowType === 'venues' 
    ? process.env.N8N_VENUE_WEBHOOK
    : process.env.N8N_STORY_WEBHOOK;
  
  const response = await fetch(webhookUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  
  return Response.json({ 
    triggered: true, 
    jobId: response.headers.get('x-job-id') 
  });
}
```

## 🎯 Implementation Checklist

### Phase 1: Core Setup (Day 1-2)
- [ ] Setup Next.js project with TypeScript
- [ ] Install and configure Shadcn UI
- [ ] Setup Supabase client and create tables
- [ ] Configure Google Maps with API key
- [ ] Create basic map component with Dubai center

### Phase 2: Data Integration (Day 3-4)
- [ ] Implement venue fetching from Supabase
- [ ] Create webhook trigger functions
- [ ] Build area selector for Dubai locations
- [ ] Display venue pins on map
- [ ] Implement caching logic

### Phase 3: Story Display (Day 5-6)
- [ ] Create venue detail sheet component
- [ ] Implement story viewer for Instagram links
- [ ] Display AI-analyzed event information
- [ ] Add vibe and offer filters
- [ ] Connect filters to venue display

### Phase 4: AI Chat & Polish (Day 7-8)
- [ ] Implement AI chat interface
- [ ] Add chat-to-filter translation
- [ ] Create loading states and skeletons
- [ ] Add error handling
- [ ] Mobile responsive adjustments
- [ ] Performance optimization

## 🔧 Environment Variables

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key

# Google Maps  
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_maps_key
NEXT_PUBLIC_MAP_ID=your_custom_map_id

# n8n Webhooks
N8N_VENUE_WEBHOOK=https://your-n8n.com/webhook/venue-discovery
N8N_STORY_WEBHOOK=https://your-n8n.com/webhook/story-analysis

# AI Chat (if using separate from n8n)
OPENAI_API_KEY=your_openai_key
```

## 🚀 Quick Start Commands

```bash
# Create Next.js project
npx create-next-app@latest dubai-events --typescript --tailwind --app

# Install dependencies
cd dubai-events
npm install @supabase/supabase-js @tanstack/react-query zustand @react-google-maps/api axios date-fns lucide-react

# Install Shadcn UI
npx shadcn-ui@latest init
npx shadcn-ui@latest add button card dialog select badge skeleton sheet tabs input scroll-area avatar separator

# Setup environment
cp .env.example .env.local
# Edit .env.local with your credentials

# Run development
npm run dev
```

## 🎨 Design Specifications

### Color Scheme
```css
/* Dubai nightlife theme */
:root {
  --primary: #D4AF37;      /* Gold */
  --secondary: #1a1a2e;     /* Dark Blue */
  --accent: #ff006e;        /* Neon Pink */
  --background: #0f0f0f;    /* Near Black */
  --foreground: #ffffff;    /* White */
  --muted: #2a2a3e;        /* Muted Purple */
}
```

### Pin Design
- **Venues with stories**: Animated pulsing gold pin
- **Venues without stories**: Static grey pin
- **Selected venue**: Larger pin with venue name label
- **Clustered venues**: Number badge showing count

### Responsive Breakpoints
- Desktop: Full map with side panels
- Tablet: Full map with bottom sheet for details
- Mobile: Full screen map with modal overlays

## 📊 Performance Targets

- **Initial Load**: < 3 seconds
- **Venue Data Fetch**: < 2 seconds (cached), < 5 seconds (fresh)
- **Story Update**: < 1 second
- **Map Interaction**: 60 FPS smooth panning/zooming
- **Filter Application**: Instant (< 100ms)

## 🔒 Error Handling

### Network Failures
- Show cached data if available
- Display friendly error message
- Offer retry button
- Fall back to basic functionality

### No Data Scenarios
- "No venues in this area" message
- Suggest nearby areas with venues
- Provide option to expand search radius

### Expired Stories
- Automatically remove after 24 hours
- Show "No current stories" message
- Display last known event info if available

## 📱 Mobile Considerations

- Touch-friendly controls (min 44px tap targets)
- Swipe gestures for venue details
- Simplified filters for mobile
- Bottom sheet instead of side panel
- Reduced map markers for performance

## 🎯 Success Metrics

- **Coverage**: 200+ venues in Dubai within first week
- **Story Freshness**: Updates every 6 hours
- **User Engagement**: Average 5+ venue views per session
- **Performance**: 95% of loads under 3 seconds
- **Accuracy**: 85%+ confidence in event detection

## 🚨 Important Notes for Developer

1. **No user authentication** - All features work anonymously
2. **Dubai focus only** - Hardcode Dubai/UAE for MVP
3. **Media links only** - Don't download/store actual media files
4. **Webhook-based updates** - Frontend triggers n8n workflows via webhooks
5. **AI already built** - Story analysis happens in n8n, just display results
6. **Cache aggressively** - Use Supabase as cache layer to minimize webhook calls
7. **Mobile-first** - Many Dubai users will access via mobile
8. **Dark theme default** - Nightlife aesthetic

This is a complete implementation guide. Start with the basic map and gradually add features. The n8n workflows are already handling the complex scraping and AI analysis - the frontend just needs to display the data beautifully and trigger updates when needed.