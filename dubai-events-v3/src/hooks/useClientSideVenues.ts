'use client';

import { useState, useEffect, useMemo } from 'react';
import type { Venue, HierarchicalFilterState, FilterState } from '@/types';

interface UseClientSideVenuesResult {
  allVenues: Venue[];
  filteredVenues: Venue[];
  isLoading: boolean;
  error: string | null;
}

// Convert hierarchical filter state to flat filter state for filtering logic
function convertHierarchicalToFlat(hierarchicalState: HierarchicalFilterState): FilterState {
  const allActiveGenres: string[] = [];
  const allActiveVibes: string[] = [];

  // Process genres
  hierarchicalState.selectedPrimaries.genres.forEach(primary => {
    const secondaries = hierarchicalState.selectedSecondaries.genres?.[primary] || [];
    if (secondaries.length > 0) {
      // If there are selected secondaries, only include them
      allActiveGenres.push(...secondaries);
    } else {
      // If no secondaries selected, include the primary itself
      allActiveGenres.push(primary);
    }
  });

  // Process vibes
  hierarchicalState.selectedPrimaries.vibes.forEach(primary => {
    const secondaries = hierarchicalState.selectedSecondaries.vibes?.[primary] || [];
    if (secondaries.length > 0) {
      // If there are selected secondaries, only include them
      allActiveVibes.push(...secondaries);
    } else {
      // If no secondaries selected, include the primary itself
      allActiveVibes.push(primary);
    }
  });

  return {
    selectedAreas: hierarchicalState.selectedAreas,
    activeVibes: allActiveVibes,
    activeDates: hierarchicalState.activeDates,
    activeGenres: allActiveGenres,
    activeOffers: hierarchicalState.activeOffers,
    searchQuery: hierarchicalState.searchQuery
  };
}

export function useClientSideVenues(filters: HierarchicalFilterState): UseClientSideVenuesResult {
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

    // Convert hierarchical state to flat state for filtering
    const flatFilters = convertHierarchicalToFlat(filters);

    console.log('🔍 CLIENT FILTER - Starting filter with:', {
      areas: flatFilters.selectedAreas,
      genres: flatFilters.activeGenres,
      vibes: flatFilters.activeVibes,
      dates: flatFilters.activeDates,
      search: flatFilters.searchQuery
    });

    return allVenues.filter(venue => {
      // Apply area filter
      if (flatFilters.selectedAreas?.length > 0 && !flatFilters.selectedAreas.includes('All Dubai')) {
        const venueArea = venue.area || venue.venue_area;
        if (!venueArea) return false;

        const matchesArea = flatFilters.selectedAreas.some(selectedArea => {
          if (selectedArea === 'JBR') {
            return venueArea.toLowerCase().includes('jumeirah beach residence') ||
                   venueArea.toLowerCase().includes('jbr');
          }
          return venueArea.toLowerCase().includes(selectedArea.toLowerCase());
        });

        if (!matchesArea) return false;
      }

      // Apply genre filter using music_genre_processed primaries AND secondaries
      if (flatFilters.activeGenres?.length > 0) {
        if (!venue.music_genre_processed?.primaries) {
          console.log('🎵 FILTER - Venue excluded (no processed genres):', venue.name);
          return false;
        }

        // ANY selected genre must match (OR logic)
        const anyGenreMatches = flatFilters.activeGenres.some(selectedGenre => {
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

        if (!anyGenreMatches) {
          console.log('🎵 FILTER - Venue excluded (no matching genres):', venue.name, 'Primaries:', venue.music_genre_processed.primaries, 'Secondaries:', venue.music_genre_processed.secondariesByPrimary, 'Selected:', flatFilters.activeGenres);
          return false;
        }

        console.log('🎵 FILTER - Venue included:', venue.name, 'Primaries:', venue.music_genre_processed.primaries, 'Secondaries:', venue.music_genre_processed.secondariesByPrimary);
      }

      // Apply vibe filter using event_vibe_processed primaries AND secondaries
      if (flatFilters.activeVibes?.length > 0) {
        if (!venue.event_vibe_processed?.primaries) {
          console.log('🎯 FILTER - Venue excluded (no processed vibes):', venue.name);
          return false;
        }

        // ANY selected vibe must match (OR logic)
        const anyVibeMatches = flatFilters.activeVibes.some(selectedVibe => {
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

        if (!anyVibeMatches) {
          console.log('🎯 FILTER - Venue excluded (no matching vibes):', venue.name, 'Primaries:', venue.event_vibe_processed.primaries, 'Selected:', flatFilters.activeVibes);
          return false;
        }

        console.log('🎯 FILTER - Venue included:', venue.name, 'Vibe Primaries:', venue.event_vibe_processed.primaries);
      }

      // Apply date filter (skip for venues, this is for events)
      // if (flatFilters.activeDates?.length > 0) { ... }

      // Apply search query
      if (flatFilters.searchQuery && flatFilters.searchQuery.trim()) {
        const query = flatFilters.searchQuery.toLowerCase();
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