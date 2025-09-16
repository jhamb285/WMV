'use client';

import React, { useCallback, useRef, useState } from 'react';
import { GoogleMap, useLoadScript } from '@react-google-maps/api';
import { 
  GOOGLE_MAPS_CONFIG, 
  MAP_OPTIONS
} from '@/lib/maps-config';
// Removed VenueClusterComponent import
import HorizontalNav from '@/components/navigation/HorizontalNav';
import TopNav from '@/components/navigation/TopNav';
import VenueDetailsSidebar from '@/components/venue/VenueDetailsSidebar';
import type { MapContainerProps, FilterState, Venue } from '@/types';
import '@/styles/horizontal-nav.css';

interface ExtendedMapContainerProps extends MapContainerProps {
  onFiltersChange: (filters: FilterState) => void;
  onRefresh: () => void;
  'data-testid'?: string;
}

const MapContainer: React.FC<ExtendedMapContainerProps> = ({
  initialCenter,
  initialZoom = 12,
  venues = [],
  onVenueSelect,
  filters,
  isLoading = false,
  onFiltersChange,
  onRefresh,
  'data-testid': dataTestId,
}) => {
  const mapRef = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<google.maps.Marker[]>([]);
  const mapViewportRef = useRef({
    center: initialCenter || MAP_OPTIONS.center,
    zoom: initialZoom,
    isInitialized: false
  });
  const [selectedVenue, setSelectedVenue] = useState<Venue | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [mapOptions, setMapOptions] = useState<google.maps.MapOptions | null>(null);

  // Clear all existing markers
  const clearMarkers = useCallback(() => {
    console.log('🧹 CLEARING MARKERS - Removing', markersRef.current.length, 'existing markers');
    markersRef.current.forEach(marker => {
      marker.setMap(null);
    });
    markersRef.current = [];
    console.log('✅ All markers cleared');
  }, []);

  const handleVenueClick = useCallback((venue: Venue) => {
    console.log('🚀 MAP CONTAINER - handleVenueClick called with:', venue.name);
    console.log('🚀 MAP CONTAINER - onVenueSelect function:', onVenueSelect);
    console.log('🚀 MAP CONTAINER - Current isSidebarOpen:', isSidebarOpen);
    console.log('🚀 MAP CONTAINER - Setting selectedVenue to:', venue);
    setSelectedVenue(venue);
    console.log('🚀 MAP CONTAINER - selectedVenue set, continuing...');
    onVenueSelect(venue);
    console.log('🚀 MAP CONTAINER - onVenueSelect called, setting sidebar to open...');
    setIsSidebarOpen(true);
    console.log('🚀 MAP CONTAINER - Setting sidebar to open - COMPLETE');
  }, [onVenueSelect, isSidebarOpen]);

  const onMapLoad = useCallback(async (map: google.maps.Map) => {
    console.log('🚀 === MAP LOAD START ===');
    console.log('🗺️ Map object:', map);
    console.log('🗺️ Venues received:', venues);
    console.log('🗺️ Venues count:', venues.length);
    console.log('🗺️ Venues array type:', typeof venues);
    console.log('🗺️ Venues is array:', Array.isArray(venues));
    console.log('🗺️ isLoading state:', isLoading);
    
    mapRef.current = map;
    
    // Store initial viewport and mark as initialized
    mapViewportRef.current = {
      center: map.getCenter()?.toJSON() || mapViewportRef.current.center,
      zoom: map.getZoom() || mapViewportRef.current.zoom,
      isInitialized: true
    };
    
    console.log('🗺️ Initial map center:', mapViewportRef.current.center);
    console.log('🗺️ Initial map zoom:', mapViewportRef.current.zoom);
    
    // Add viewport tracking listeners to preserve user's position
    map.addListener('center_changed', () => {
      const newCenter = map.getCenter()?.toJSON();
      if (newCenter) {
        mapViewportRef.current.center = newCenter;
      }
    });
    
    map.addListener('zoom_changed', () => {
      const newZoom = map.getZoom();
      if (newZoom !== undefined) {
        mapViewportRef.current.zoom = newZoom;
      }
    });
    
    try {
      // Use the React Google Maps map instance - now with viewport preservation
      const directMap = map;
      
      console.log('🗺️ MAP LOADED successfully with viewport tracking');
      console.log('🗺️ Viewport preserved - zoom:', mapViewportRef.current.zoom, 'center:', mapViewportRef.current.center);
      console.log(`🗺️ Number of venues to render: ${venues.length}`);
      
      // Global InfoWindow instance to prevent multiple windows and auto-panning issues
      let currentInfoWindow: google.maps.InfoWindow | null = null;

      // Create individual markers without clustering
      const validVenues = venues.filter(venue => venue.lat && venue.lng);
      console.log(`🗺️ TOTAL VENUES: ${venues.length}, VALID VENUES: ${validVenues.length}`);
      
      // Log each venue's details
      venues.forEach((venue, i) => {
        console.log(`📍 Venue ${i + 1}:`, {
          id: venue.venue_id,
          name: venue.name,
          lat: venue.lat,
          lng: venue.lng,
          hasCoords: !!(venue.lat && venue.lng)
        });
      });
      
      if (validVenues.length === 0) {
        console.error('❌ NO VALID VENUES FOUND - no markers will be created!');
        return;
      }
      
      validVenues.forEach((venue, i) => {
        console.log(`🎯 === CREATING MARKER ${i + 1} ===`);
        console.log(`🎯 Venue: ${venue.name}`);
        console.log(`🎯 Position: lat=${venue.lat}, lng=${venue.lng}`);
        
        // Smart category-based color mapping
        const getCategoryColor = (category: string) => {
          const lowerCategory = category.toLowerCase();
          
          if (lowerCategory.includes('bar') && (lowerCategory.includes('sports') || lowerCategory.includes('pub'))) {
            return 'orange'; // Sports bars/pubs
          } else if (lowerCategory.includes('bar') || lowerCategory.includes('lounge')) {
            return 'purple'; // Bars/lounges
          } else if (lowerCategory.includes('beach') || lowerCategory.includes('club')) {
            return 'blue'; // Beach clubs
          } else if (lowerCategory.includes('restaurant') || lowerCategory.includes('cafe')) {
            return 'green'; // Restaurants/cafes
          } else if (lowerCategory.includes('hotel')) {
            return 'yellow'; // Hotels
          } else {
            return 'red'; // Default/other
          }
        };
        
        const categoryColor = getCategoryColor(venue.category || '');
        console.log(`🎯 Venue: ${venue.name}, Category: ${venue.category}, Color: ${categoryColor}`);
        
        try {
          // Create CUSTOM COLORED marker based on category
          console.log(`🎨 Creating CUSTOM marker for ${venue.name} (${categoryColor})`);
          const marker = new google.maps.Marker({
            position: { lat: venue.lat, lng: venue.lng },
            map: directMap,
            title: venue.name,
            icon: {
              url: `https://maps.google.com/mapfiles/ms/icons/${categoryColor}-dot.png`,
              scaledSize: new google.maps.Size(32, 32),
            },
          });
          
          // Add marker to tracking array
          markersRef.current.push(marker);
          
          console.log(`✅ Marker created successfully for ${venue.name}:`, marker.getPosition()?.toJSON());
          console.log(`✅ Marker visible:`, marker.getVisible());
          console.log(`✅ Marker map:`, marker.getMap());
          
          marker.addListener("click", (event: google.maps.MapMouseEvent) => {
            console.log(`🖱️ Marker clicked: ${venue.name}`);
            // Prevent event bubbling that might cause map repositioning
            if (event) {
              event.stop?.();
            }
            
            // Close any existing InfoWindow first
            if (currentInfoWindow) {
              currentInfoWindow.close();
              currentInfoWindow = null;
            }
            
            // Only trigger sidebar functionality - no InfoWindow popup
            handleVenueClick(venue);
          });
          
        } catch (markerError) {
          console.error(`❌ Error creating marker for ${venue.name}:`, markerError);
        }
      });
      
      console.log(`🎯 === MARKER CREATION COMPLETE ===`);
      console.log(`🗺️ Created ${validVenues.length} markers successfully`);
      
      // Check map bounds
      const bounds = map.getBounds();
      if (bounds) {
        const ne = bounds.getNorthEast();
        const sw = bounds.getSouthWest();
        console.log(`🗺️ Map bounds: NE(${ne.lat()}, ${ne.lng()}) SW(${sw.lat()}, ${sw.lng()})`);
        
        // Check if venues are within bounds
        validVenues.forEach(venue => {
          const inBounds = bounds.contains(new google.maps.LatLng(venue.lat, venue.lng));
          console.log(`📍 ${venue.name} in bounds: ${inBounds}`);
        });
      }
      
      
      
    } catch (error) {
      console.error('🚨 Error in onMapLoad:', error);
    }
    
    console.log('🚀 === MAP LOAD END ===');
    
  }, [venues, initialZoom, initialCenter, handleVenueClick]);

  // Update markers when venues change (this is the missing piece!)
  React.useEffect(() => {
    console.log('🔄 VENUES EFFECT TRIGGERED - venues.length:', venues.length);
    console.log('🔄 VENUES EFFECT TRIGGERED - mapRef.current:', !!mapRef.current);

    if (!mapRef.current) {
      console.log('🔄 VENUES EFFECT - No map ref, skipping');
      return;
    }

    console.log('🔄 UPDATING MARKERS - Venues changed:', venues.length);
    console.log('🔄 UPDATING MARKERS - Venue names:', venues.map(v => v.name));

    // Clear all existing markers first
    clearMarkers();

    // Then create new markers for current venues
    if (venues.length > 0) {
      console.log('🔄 UPDATING MARKERS - Calling onMapLoad to create new markers');
      onMapLoad(mapRef.current);
    } else {
      console.log('🔄 UPDATING MARKERS - No venues to display');
    }
  }, [venues, onMapLoad, clearMarkers]);

  const onMapUnmount = useCallback(() => {
    mapRef.current = null;
  }, []);

  const handleSidebarClose = useCallback(() => {
    setIsSidebarOpen(false);
    setSelectedVenue(null); // Clear selected venue when closing
    console.log('🚀 MAP CONTAINER - Sidebar closed, selectedVenue cleared');
    
    // DON'T reset map position - let it stay where user left it!
    console.log('🗺️ Preserving viewport:', mapViewportRef.current);
  }, []);

  // Initialize mapOptions only once to prevent re-renders from resetting the map
  React.useEffect(() => {
    if (!mapOptions) {
      const initialMapOptions: google.maps.MapOptions = {
        ...MAP_OPTIONS,
        center: mapViewportRef.current.center,
        zoom: mapViewportRef.current.zoom,
        // mapId removed - this was blocking POI hiding styles
        styles: [
      // Retro styling with POI hiding
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
      // Hide POI business markers
      {
        featureType: "poi.business",
        stylers: [{ visibility: "off" }],
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
      // Hide transit icons
      {
        featureType: "transit",
        elementType: "labels.icon",
        stylers: [{ visibility: "off" }],
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
    ]
      };
      
      setMapOptions(initialMapOptions);
      console.log('🗺️ Map options initialized once to prevent viewport resets');
    }
  }, []); // Empty dependency array - only run once

  // Debug API key loading
  console.log('Google Maps API Key:', GOOGLE_MAPS_CONFIG.apiKey ? 'PRESENT' : 'MISSING');

  if (!GOOGLE_MAPS_CONFIG.apiKey || GOOGLE_MAPS_CONFIG.apiKey === 'your_google_maps_api_key') {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-background">
        <div className="retro-surface p-8 max-w-md text-center">
          <h3 className="text-lg font-semibold mb-2">Google Maps API Key Required</h3>
          <p className="text-muted-foreground mb-4">
            Please add your Google Maps API key to the environment variables to display the map.
          </p>
          <div className="bg-muted p-3 rounded text-sm font-mono text-left">
            NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_api_key
            <br />
            Current: {GOOGLE_MAPS_CONFIG.apiKey || 'undefined'}
          </div>
        </div>
      </div>
    );
  }

  // Use useLoadScript to load Google Maps
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: GOOGLE_MAPS_CONFIG.apiKey,
    libraries: GOOGLE_MAPS_CONFIG.libraries,
    language: GOOGLE_MAPS_CONFIG.language,
    region: GOOGLE_MAPS_CONFIG.region,
  });

  // Calculate live stories count (mock for now)
  const liveStoriesCount = Math.floor(venues.length * 0.3); // 30% of venues have live stories

  if (loadError) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-background">
        <div className="retro-surface p-8 max-w-md text-center">
          <h3 className="text-lg font-semibold mb-2 text-red-600">Google Maps Load Error</h3>
          <p className="text-muted-foreground">Failed to load Google Maps</p>
        </div>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-background">
        <div className="retro-surface p-8 max-w-md text-center">
          <h3 className="text-lg font-semibold mb-2">Loading Google Maps...</h3>
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mt-4"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-screen w-full" data-testid={dataTestId}>
      {/* Simple Top Navigation with Logo */}
      <TopNav />
      
      {/* Bottom Glass Navigation with Filter Functionality */}
      <HorizontalNav 
        filters={filters}
        onFiltersChange={onFiltersChange}
      />

      {/* Only render GoogleMap after mapOptions is initialized to prevent viewport resets */}
      {mapOptions && (
        <GoogleMap
          mapContainerStyle={{
            width: '100%',
            height: '100%',
          }}
          options={mapOptions}
          onLoad={onMapLoad}
          onUnmount={onMapUnmount}
        >
        {/* Advanced Markers are now created directly in onMapLoad using clustering */}
        {/* Old VenuePin components commented out - now using AdvancedMarkerElement with clustering */}
        {/* 
        {venues.map((venue, index) => {
          console.log('🗺️ MAP CONTAINER - Mapping venue:', venue.name, venue.lat, venue.lng);
          // Simulate some venues having active stories for animation demo
          const hasActiveStories = index % 3 === 0; // Every 3rd venue has active stories
          
          return (
            <VenuePin
              key={venue.venue_id}
              venue={venue}
              hasActiveStories={hasActiveStories}
              isSelected={selectedVenue?.venue_id === venue.venue_id}
              onClick={() => handleVenueClick(venue)}
              onHover={(hovered) => setHoveredVenue(hovered ? venue.venue_id : null)}
            />
          );
        })}
        */}

        
        {/* Loading indicator */}
        {isLoading && (
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="retro-surface p-4 flex items-center space-x-3">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary"></div>
              <span className="text-sm">Loading venues...</span>
            </div>
          </div>
        )}
        </GoogleMap>
      )}

      {/* Venue Details Sidebar */}
      <VenueDetailsSidebar
        venue={selectedVenue || null}
        isOpen={isSidebarOpen}
        onClose={handleSidebarClose}
        filters={filters}
      />

    </div>
  );
};

export default MapContainer;