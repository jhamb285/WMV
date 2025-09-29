// Dubai Event Discovery Platform - Type Definitions

// Geographic Types
export interface LatLng {
  lat: number;
  lng: number;
}

// Frontend Venue interface (Legacy - for compatibility)
export interface Venue {
  venue_id: number | string;
  name: string;
  area: string;
  address?: string;
  country: string;
  lat: number;
  lng: number; // For Google Maps compatibility
  phone?: number;
  website?: string;
  category: string;
  created_at: string;
  final_instagram?: string; // Added for join compatibility
}

// Map Types
export interface VenueCluster {
  id: string;
  center: LatLng;
  venues: Venue[];
  bounds: google.maps.LatLngBounds;
  count: number;
}

export interface DubaiArea {
  name: string;
  lat: number;
  lng: number;
  zoom?: number;
}

// Filter Types
export interface FilterState {
  selectedAreas: string[];
  activeVibes: string[];
  activeDates: string[];
  activeGenres: string[];
  activeOffers: string[];
  searchQuery?: string;
}

// Hierarchical Filter Types
export interface HierarchicalCategory {
  color: string;
  subcategories: string[];
}

export interface HierarchicalFilterState {
  // Primary categories selected
  selectedPrimaries: {
    genres: string[];      // ["Electronic", "Hip-Hop"]
    vibes: string[];       // ["Energy", "Atmosphere"]
  };

  // Secondary categories selected (grouped by primary)
  selectedSecondaries: {
    genres: Record<string, string[]>;  // {"Electronic": ["Techno", "Deep House"]}
    vibes: Record<string, string[]>;   // {"Energy": ["High Energy", "Underground"]}
  };

  // Which primaries have their secondaries expanded
  expandedPrimaries: {
    genres: string[];      // ["Electronic"]
    vibes: string[];       // ["Energy"]
  };

  // Keep existing for backward compatibility and other filters
  selectedAreas: string[];
  activeDates: string[];
  activeOffers: string[];
  searchQuery?: string;
}

export interface FilterOptions {
  areas: string[];
  dates: string[];
  hierarchicalGenres: Record<string, HierarchicalCategory>;
  hierarchicalVibes: Record<string, HierarchicalCategory>;
  // Legacy format for backward compatibility
  vibes: string[];
  genres: string[];
}

// Component Props Types
export interface VenuePinProps {
  venue: Venue;
  hasActiveStories: boolean;
  isSelected: boolean;
  onClick: () => void;
  onHover?: (hovered: boolean) => void;
}

export interface MapContainerProps {
  initialCenter?: LatLng;
  initialZoom?: number;
  venues: Venue[];
  selectedVenue?: Venue | null;
  onVenueSelect: (venue: Venue) => void;
  filters: FilterState;
  isLoading?: boolean;
}

// Constants
export const DUBAI_AREAS: DubaiArea[] = [
  { name: 'Downtown Dubai', lat: 25.1972, lng: 55.2744, zoom: 14 },
  { name: 'Dubai Marina', lat: 25.0805, lng: 55.1403, zoom: 14 },
  { name: 'JBR', lat: 25.0752, lng: 55.1337, zoom: 15 },
  { name: 'Business Bay', lat: 25.1850, lng: 55.2650, zoom: 14 },
  { name: 'DIFC', lat: 25.2110, lng: 55.2820, zoom: 15 },
  { name: 'City Walk', lat: 25.2048, lng: 55.2645, zoom: 15 },
  { name: 'La Mer', lat: 25.2354, lng: 55.2707, zoom: 15 },
  { name: 'Bluewaters', lat: 25.0764, lng: 55.1201, zoom: 16 },
  { name: 'Old Dubai/Deira', lat: 25.2654, lng: 55.3007, zoom: 14 },
  { name: 'Al Seef', lat: 25.2554, lng: 55.2934, zoom: 15 },
  { name: 'Jumeirah', lat: 25.2048, lng: 55.2708, zoom: 14 },
];

// Final_1 Table Interface (Unified event and venue data)
export interface Final1Record {
  id: number;
  // Event fields
  event_id?: string;
  instagram_id?: string;
  event_date?: string;
  event_time?: string;
  event_name?: string;
  venue_name?: string;
  city?: string;
  country?: string;
  artists?: string[];
  music_genre?: string[];
  event_vibe?: string[];
  ticket_price?: number;
  special_offers?: string[];
  website_social?: string[];
  context?: string;
  confidence_score?: number;
  analysis_notes?: string;
  event_created_at?: string;
  event_updated_at?: string;
  // Venue fields
  venue_venue_id?: string;
  venue_unique_key?: string;
  venue_google_place_id?: string;
  venue_name_original?: string;
  venue_area?: string;
  venue_address?: string;
  venue_city?: string;
  venue_country?: string;
  venue_lat?: number;
  venue_lng?: number;
  venue_phone_number?: string;
  venue_website?: string;
  venue_category?: string;
  venue_cleaned_instagram?: string;
  venue_match_ai_instagram?: string;
  venue_final_instagram?: string;
  venue_last_scraped_at?: string;
  venue_created_at?: string;
  venue_updated_at?: string;
}

// Event Types (Legacy - for compatibility)
export interface Event {
  id: number;
  created_at: string;
  event_date: string;
  event_time?: string;
  venue_name?: string;
  artist?: string;
  music_genre?: string;
  event_vibe?: string;
  event_name?: string;
  ticket_price?: string;
  special_offers?: string;
  website_social?: string;
  confidence_score?: string;
  analysis_notes?: string;
  instagram_id?: string;
}

// Instagram Story Types (for compatibility)
export interface InstagramStory {
  story_id: string;
  unique_key: string;
  venue_unique_key: string;
  story_date: string;
  username?: string;
  media_type?: string;
  timestamp: string;
  context?: string;
  event_date?: string;
  event_time?: string;
  venue_name?: string;
  city?: string;
  country?: string;
  artists?: string[];
  music_genre?: string[];
  event_vibe?: string[];
  confidence_score?: number;
  expires_at: string;
  created_at: string;
  updated_at: string;
}

export const DUBAI_CENTER: LatLng = {
  lat: 25.2048,
  lng: 55.2708
};

export const VIBE_OPTIONS = [
  'Party/Energetic',
  'Chill/Lounge', 
  'Live Music',
  'Rooftop',
  'Beach Club',
  'Ladies Night',
  'Brunch',
  'Shisha Lounge'
];

export const OFFER_OPTIONS = [
  'Happy Hour',
  'Free Entry',
  'Ladies Free',
  'Table Deals',
  'Bottle Service',
  'Student Discount',
  'Group Packages'
];

export const GENRE_OPTIONS = [
  'Techno',
  'House',
  'Electronic',
  'Deep House',
  'Progressive House',
  'Trance',
  'EDM',
  'Hip Hop',
  'R&B',
  'Pop',
  'Rock',
  'Jazz',
  'Ambient',
  'Minimal'
];

// Google Maps Retro Style with POI/Icon Hiding
export const RETRO_MAP_STYLE: google.maps.MapTypeStyle[] = [
  // Hide ALL built-in icons globally
  { elementType: "labels.icon", stylers: [{ visibility: "off" }] },
  
  // Hide ALL POIs (parks, universities, shopping, etc.)
  { featureType: "poi", stylers: [{ visibility: "off" }] },
  
  // Hide transit layer entirely (removes airport/train/bus station pins)
  { featureType: "transit", stylers: [{ visibility: "off" }] },
  
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