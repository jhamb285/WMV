// Google Maps Mobile Configuration for Dubai Event Discovery Mobile Web App

import { DUBAI_CENTER, RETRO_MAP_STYLE, type LatLng } from '@/types';

// Google Maps API Configuration
export const GOOGLE_MAPS_CONFIG = {
  apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
  libraries: ['places', 'geometry'] as never[],
  language: 'en',
  region: 'AE', // United Arab Emirates
};

// Dubai Map Bounds (approximate)
export const DUBAI_BOUNDS = {
  north: 25.4,
  south: 24.8,
  east: 55.6,
  west: 54.8,
};

// Map Options Configuration - Using factory function to avoid SSR issues
export const getMapOptions = (): google.maps.MapOptions => ({
  center: DUBAI_CENTER,
  zoom: 12,
  styles: RETRO_MAP_STYLE,
  disableDefaultUI: true,
  gestureHandling: 'greedy', // Mobile-optimized: allows single-finger map interaction
  mapTypeId: 'roadmap',
  clickableIcons: false,
  maxZoom: 18,
  minZoom: 10,
  restriction: {
    latLngBounds: DUBAI_BOUNDS,
    strictBounds: false,
  },
  ...(typeof google !== 'undefined' && google.maps ? {
    // Custom map styling options - only when google is available
    mapTypeControlOptions: {
      style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
      position: google.maps.ControlPosition.TOP_RIGHT,
    },
    zoomControlOptions: {
      position: google.maps.ControlPosition.RIGHT_CENTER,
    },
    streetViewControlOptions: {
      position: google.maps.ControlPosition.RIGHT_CENTER,
    },
  } : {})
});

// Fallback for components that still expect MAP_OPTIONS
export const MAP_OPTIONS = {
  center: DUBAI_CENTER,
  zoom: 12,
  styles: RETRO_MAP_STYLE,
  disableDefaultUI: true,
  gestureHandling: 'greedy', // Mobile-optimized: allows single-finger map interaction
  mapTypeId: 'roadmap',
  clickableIcons: false,
  maxZoom: 18,
  minZoom: 10,
  restriction: {
    latLngBounds: DUBAI_BOUNDS,
    strictBounds: false,
  },
} as google.maps.MapOptions;

// Custom Map Controls Configuration
export const MAP_CONTROLS = {
  zoomControl: true,
  mapTypeControl: false,
  streetViewControl: false,
  fullscreenControl: false,
  rotateControl: false,
  scaleControl: true,
};

// Clustering functionality removed - using individual markers only

// Utility Functions
export const createLatLng = (lat: number, lng: number): google.maps.LatLng | null => {
  if (typeof google !== 'undefined' && google.maps) {
    return new google.maps.LatLng(lat, lng);
  }
  return null;
};

export const createBounds = (venues: { lat: number; lng: number }[]): google.maps.LatLngBounds | null => {
  if (typeof google !== 'undefined' && google.maps) {
    const bounds = new google.maps.LatLngBounds();
    venues.forEach(venue => {
      const latLng = createLatLng(venue.lat, venue.lng);
      if (latLng) bounds.extend(latLng);
    });
    return bounds;
  }
  return null;
};

export const calculateDistance = (point1: LatLng, point2: LatLng): number => {
  const R = 6371; // Radius of the Earth in kilometers
  const dLat = (point2.lat - point1.lat) * Math.PI / 180;
  const dLon = (point2.lng - point1.lng) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(point1.lat * Math.PI / 180) * Math.cos(point2.lat * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c; // Distance in kilometers
};

export const isPointInDubai = (point: LatLng): boolean => {
  return (
    point.lat >= DUBAI_BOUNDS.south &&
    point.lat <= DUBAI_BOUNDS.north &&
    point.lng >= DUBAI_BOUNDS.west &&
    point.lng <= DUBAI_BOUNDS.east
  );
};

// Map Event Handlers
export const handleMapIdle = (map: google.maps.Map, callback?: () => void) => {
  const listener = map.addListener('idle', () => {
    callback?.();
  });
  return listener;
};

export const handleMapBoundsChanged = (
  map: google.maps.Map, 
  callback: (bounds: google.maps.LatLngBounds) => void
) => {
  const listener = map.addListener('bounds_changed', () => {
    const bounds = map.getBounds();
    if (bounds) {
      callback(bounds);
    }
  });
  return listener;
};

export const handleMapZoomChanged = (
  map: google.maps.Map, 
  callback: (zoom: number) => void
) => {
  const listener = map.addListener('zoom_changed', () => {
    const zoom = map.getZoom();
    if (zoom !== undefined) {
      callback(zoom);
    }
  });
  return listener;
};

// Marker options factory function for different venue states
export const createCustomMarker = (hasStories: boolean, isSelected: boolean) => {
  console.log('🔧 createCustomMarker called - hasStories:', hasStories, 'isSelected:', isSelected);
  console.log('🔧 window.google:', typeof window !== 'undefined' ? !!window.google : 'undefined');
  console.log('🔧 google.maps:', typeof window !== 'undefined' && window.google ? !!window.google.maps : 'undefined');
  
  if (typeof window === 'undefined' || !window.google?.maps) {
    console.log('🔧 createCustomMarker returning null - Google Maps not ready');
    // Return null for SSR/pre-load - this might be causing issues
    return null;
  }
  
  if (isSelected) {
    return {
      url: `data:image/svg+xml;base64,${btoa(`
        <svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
          <circle cx="16" cy="16" r="14" fill="#ff006e" stroke="#d00060" stroke-width="4"/>
        </svg>
      `)}`,
      scaledSize: new google.maps.Size(32, 32),
      anchor: new google.maps.Point(16, 16)
    };
  } else if (hasStories) {
    return {
      url: `data:image/svg+xml;base64,${btoa(`
        <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <circle cx="12" cy="12" r="10" fill="#D4AF37" stroke="#B8860B" stroke-width="2"/>
        </svg>
      `)}`,
      scaledSize: new google.maps.Size(24, 24),
      anchor: new google.maps.Point(12, 12)
    };
  } else {
    return {
      url: `data:image/svg+xml;base64,${btoa(`
        <svg width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
          <circle cx="8" cy="8" r="6" fill="#64748b" stroke="#334155" stroke-width="2"/>
        </svg>
      `)}`,
      scaledSize: new google.maps.Size(16, 16),
      anchor: new google.maps.Point(8, 8)
    };
  }
};