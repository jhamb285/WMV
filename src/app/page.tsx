'use client';

import { useState, useEffect } from 'react';
import MapContainer from '@/components/map/MapContainer';
import { type Venue, type FilterState } from '@/types';

export default function Home() {
  console.log('🏠 HOME COMPONENT - Mounting (Production Ready)...');

  // Get today's date in DD/Month/YYYY format
  const getTodayDateString = () => {
    const today = new Date();
    const day = today.getDate().toString().padStart(2, '0');
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
                       'July', 'August', 'September', 'October', 'November', 'December'];
    const month = monthNames[today.getMonth()];
    const year = today.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const [filters, setFilters] = useState<FilterState>({
    selectedAreas: ['All Dubai'],
    activeVibes: [],
    activeDates: [getTodayDateString()], // Default to today
    activeGenres: [],
    activeOffers: [],
    searchQuery: '',
  });
  
  // Inline hook to avoid complex external hook issues
  const [venues, setVenues] = useState<Venue[]>([]);
  const [isLoading, setIsLoading] = useState(true); // Start as true for loading state
  const [error, setError] = useState<string | null>(null);

  // Force execution on mount
  useEffect(() => {
    console.log('🚀🚀🚀 useEffect TRIGGERED v4 CLIENT-SIDE - Starting venue loading...');
    console.log('🚀 CLIENT CHECK - window exists:', typeof window !== 'undefined');
    let cancelled = false;
    
    async function loadVenues() {
      console.log('🚀 LOADING VENUES - Starting v3...');
      
      try {
        setIsLoading(true);
        setError(null);
        console.log('🚀 LOADING VENUES - State set to loading...');
        
        const searchParams = new URLSearchParams();
        if (filters.selectedAreas?.length && !filters.selectedAreas.includes('All Dubai')) {
          searchParams.set('areas', filters.selectedAreas.join(','));
        }
        if (filters.activeVibes?.length) {
          searchParams.set('vibes', filters.activeVibes.join(','));
        }
        if (filters.activeDates?.length) {
          searchParams.set('dates', filters.activeDates.join('|'));
        }
        if (filters.activeGenres?.length) {
          searchParams.set('genres', filters.activeGenres.join(','));
        }
        if (filters.activeOffers?.length) {
          searchParams.set('offers', filters.activeOffers.join(','));
        }
        
        const url = `/api/venues${searchParams.toString() ? '?' + searchParams.toString() : ''}`;
        console.log('🚀 LOADING VENUES - URL:', url, 'Cancelled:', cancelled);
        
        console.log('🚀 LOADING VENUES - About to fetch...');
        
        // Add a small delay to ensure everything is initialized
        await new Promise(resolve => setTimeout(resolve, 100));
        
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          cache: 'no-store',
          credentials: 'same-origin',
        });
        console.log('🚀 LOADING VENUES - Fetch complete, response status:', response.status);
        
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        
        const result = await response.json();
        console.log('🚀 LOADING VENUES - Response parsed:', result.success, 'count:', result.data?.length, 'Cancelled:', cancelled);
        
        if (!cancelled && result.success && Array.isArray(result.data)) {
          console.log('🎯 VENUE STATE UPDATE - About to set venues:', {
            count: result.data.length,
            venueNames: result.data.map(v => v.name),
            areas: result.data.map(v => v.area),
            currentFilters: filters
          });
          setVenues(result.data);
          console.log('🎯 VENUE STATE UPDATE - setVenues() called with', result.data.length, 'venues');
          setError(null);
          console.log('🎯 VENUE STATE UPDATE - Venues state should now be updated');
        } else if (!cancelled) {
          console.log('🚀 LOADING VENUES - Setting error...', result.error);
          setError(result.error || 'Failed to load venues');
        } else {
          console.log('🚀 LOADING VENUES - Request was cancelled');
        }
      } catch (err) {
        if (!cancelled) {
          const errorMsg = err instanceof Error ? err.message : 'Network error';
          setError(errorMsg);
          console.error('🚀 LOADING VENUES - Error:', errorMsg);
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
          console.log('🚀 LOADING VENUES - Complete, isLoading set to false');
        }
      }
    }

    loadVenues();
    
    return () => {
      console.log('🚀 LOADING VENUES - Cleanup, setting cancelled = true');
      cancelled = true;
    };
  }, [
    filters.selectedAreas,
    filters.activeVibes,
    filters.activeDates,
    filters.activeGenres,
    filters.activeOffers,
    filters.searchQuery
  ]); // Re-run when any filter changes

  const handleVenueSelect = (venue: Venue) => {
    console.log('📍 PAGE - handleVenueSelect called with:', venue.name);
  };

  const handleFiltersChange = (newFilters: FilterState) => {
    setFilters(newFilters);
    console.log('Filters updated:', newFilters);
  };

  const handleRefresh = () => {
    console.log('Refreshing venues...');
  };

  if (error) {
    return (
      <main className="h-screen w-full flex items-center justify-center bg-background">
        <div className="retro-surface p-8 max-w-md text-center">
          <h3 className="text-lg font-semibold mb-2 text-red-600">Error Loading Venues</h3>
          <p className="text-muted-foreground">{error}</p>
        </div>
      </main>
    );
  }

  console.log('🚀 PAGE - Debug state:', { isLoading, venuesCount: venues.length, error });
  
  // Show loading screen only for initial load (when no venues yet)
  if (isLoading && venues.length === 0) {
    return (
      <main className="h-screen w-full flex items-center justify-center bg-background" data-testid="loading-state">
        <div className="retro-surface p-8 max-w-md text-center">
          <h3 className="text-lg font-semibold mb-2">Loading Venues...</h3>
          <p className="text-muted-foreground">Finding Dubai venues...</p>
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mt-4"></div>
        </div>
      </main>
    );
  }

  console.log('🎯 RENDER - About to render MapContainer:', {
    venueCount: venues.length,
    venueNames: venues.map(v => v.name),
    currentFilters: filters,
    isLoading
  });

  return (
    <main className="h-screen w-full">
      <h1 className="sr-only">Dubai Event Discovery - Find the Hottest Venues and Events</h1>
      <MapContainer
        venues={venues}
        onVenueSelect={handleVenueSelect}
        filters={filters}
        onFiltersChange={handleFiltersChange}
        onRefresh={handleRefresh}
        isLoading={isLoading}
        data-testid="map-container"
      />
    </main>
  );
}