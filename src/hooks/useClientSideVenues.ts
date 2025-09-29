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

        console.log('🔄 Loading ALL venues for client-side filtering...');

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
          console.log(`✅ Loaded ${result.data.length} venues for client-side filtering`);
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

    console.log('⚡ Filtering venues client-side...', filters);

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

      // Apply genre filter
      if (filters.activeGenres?.length > 0) {
        const venueGenres = venue.category || venue.venue_category;
        if (!venueGenres) return false;

        // Handle both string and array formats
        const genreArray = Array.isArray(venueGenres) ? venueGenres : [venueGenres];
        const matchesGenre = filters.activeGenres.some(selectedGenre =>
          genreArray.some(genre =>
            typeof genre === 'string' && genre.toLowerCase().includes(selectedGenre.toLowerCase())
          )
        );

        if (!matchesGenre) return false;
      }

      // Apply vibe filter (when hierarchical vibes are mapped to activeVibes)
      if (filters.activeVibes?.length > 0) {
        // For now, skip vibe filtering until we have proper vibe data on venues
        // This will be handled when we integrate with the events API
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