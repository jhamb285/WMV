'use client';

import { useState, useEffect, useMemo } from 'react';
import type { Venue, FilterState } from '@/types';

interface UseClientSideVenuesResult {
  allVenues: Venue[];
  filteredVenues: Venue[];
  isLoading: boolean;
  error: string | null;
}

export function useClientSideVenues(filters: FilterState): UseClientSideVenuesResult {
  const [allVenues, setAllVenues] = useState<Venue[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load all venues once on mount
  useEffect(() => {
    const fetchAllVenues = async () => {
      try {
        setIsLoading(true);
        setError(null);


        const response = await fetch('/api/venues', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Cache-Control': 'no-cache',
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();

        if (result.success && result.data) {
          setAllVenues(result.data);
          setError(null);
        } else {
          const errorMsg = result.error || 'Invalid response format';
          setError(errorMsg);
        }
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Network error occurred';
        setError(errorMsg);
        console.error('Error fetching venues:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllVenues();
  }, []); // Only load once on mount

  // Filter venues client-side - this runs instantly
  const filteredVenues = useMemo(() => {
    if (!allVenues.length) return [];

    console.log('🔍 CLIENT FILTER - Starting filter with:', {
      areas: filters.selectedAreas,
      genres: filters.activeGenres,
      vibes: filters.activeVibes,
      dates: filters.activeDates,
      search: filters.searchQuery
    });

    return allVenues.filter(venue => {
      // Apply area filter
      if (filters.selectedAreas?.length > 0 && !filters.selectedAreas.includes('All Dubai')) {
        const venueArea = venue.area || venue.venue_area;
        if (!venueArea) return false;

        const matchesArea = filters.selectedAreas.some(selectedArea => {
          if (selectedArea === 'JBR') {
            return venueArea.toLowerCase().includes('jumeirah beach residence') ||
                   venueArea.toLowerCase().includes('jbr');
          }
          return venueArea.toLowerCase().includes(selectedArea.toLowerCase());
        });

        if (!matchesArea) return false;
      }

      // Apply genre filter using music_genre_processed primaries AND secondaries
      if (filters.activeGenres?.length > 0) {
        if (!venue.music_genre_processed?.primaries) {
          console.log('🎵 FILTER - Venue excluded (no processed genres):', venue.name);
          return false;
        }

        // ALL selected genres must match (AND logic)
        const allGenresMatch = filters.activeGenres.every(selectedGenre => {
          // Check if it's a primary
          if (venue.music_genre_processed!.primaries.includes(selectedGenre)) {
            console.log('  ✅ Genre match (primary):', selectedGenre, 'in', venue.name);
            return true;
          }

          // Check if it's a secondary
          for (const [primary, secondaries] of Object.entries(venue.music_genre_processed!.secondariesByPrimary || {})) {
            if (secondaries.includes(selectedGenre)) {
              console.log('  ✅ Genre match (secondary):', selectedGenre, 'under', primary, 'in', venue.name);
              return true;
            }
          }

          console.log('  ❌ Genre no match:', selectedGenre, 'in', venue.name);
          return false;
        });

        if (!allGenresMatch) {
          console.log('🎵 FILTER - Venue excluded (not all genres match):', venue.name, 'Primaries:', venue.music_genre_processed.primaries, 'Secondaries:', venue.music_genre_processed.secondariesByPrimary, 'Selected:', filters.activeGenres);
          return false;
        }

        console.log('🎵 FILTER - Venue included:', venue.name, 'Primaries:', venue.music_genre_processed.primaries, 'Secondaries:', venue.music_genre_processed.secondariesByPrimary);
      }

      // Apply vibe filter using event_vibe_processed primaries AND secondaries
      if (filters.activeVibes?.length > 0) {
        if (!venue.event_vibe_processed?.primaries) {
          console.log('🎯 FILTER - Venue excluded (no processed vibes):', venue.name);
          return false;
        }

        // ALL selected vibes must match (AND logic)
        const allVibesMatch = filters.activeVibes.every(selectedVibe => {
          // Check if it's a primary
          if (venue.event_vibe_processed!.primaries.includes(selectedVibe)) {
            return true;
          }

          // Check if it's a secondary
          for (const secondaries of Object.values(venue.event_vibe_processed!.secondariesByPrimary || {})) {
            if (secondaries.includes(selectedVibe)) {
              return true;
            }
          }

          return false;
        });

        if (!allVibesMatch) {
          console.log('🎯 FILTER - Venue excluded (not all vibes match):', venue.name, 'Primaries:', venue.event_vibe_processed.primaries, 'Selected:', filters.activeVibes);
          return false;
        }

        console.log('🎯 FILTER - Venue included:', venue.name, 'Vibe Primaries:', venue.event_vibe_processed.primaries);
      }

      // Apply date filter (skip for venues, this is for events)
      // if (filters.activeDates?.length > 0) { ... }

      // Apply search query
      if (filters.searchQuery && filters.searchQuery.trim()) {
        const query = filters.searchQuery.toLowerCase();
        const venueName = venue.venue_name?.toLowerCase() || '';
        const venueCategory = venue.category?.toLowerCase() || venue.venue_category?.toLowerCase() || '';

        if (!venueName.includes(query) && !venueCategory.includes(query)) {
          return false;
        }
      }

      return true;
    });
  }, [allVenues, filters]);

  return {
    allVenues,
    filteredVenues,
    isLoading,
    error
  };
}