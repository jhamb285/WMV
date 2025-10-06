'use client';

import { useState, useEffect } from 'react';
import type { FilterState } from '@/types';

interface FilterOptions {
  areas: string[];
  vibes: string[];
  dates: string[];
  genres: string[];
}

interface UseFilterOptionsResult {
  filterOptions: FilterOptions;
  isLoading: boolean;
  error: string | null;
}

export function useFilterOptions(currentFilters?: FilterState): UseFilterOptionsResult {
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    areas: [],
    vibes: [],
    dates: [],
    genres: []
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFilterOptions = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Build query parameters from current filters for dynamic filtering
        const searchParams = new URLSearchParams();

        if (currentFilters?.selectedAreas?.length && !currentFilters.selectedAreas.includes('All Dubai')) {
          searchParams.set('areas', currentFilters.selectedAreas.join(','));
        }
        if (currentFilters?.activeVibes?.length) {
          searchParams.set('vibes', currentFilters.activeVibes.join(','));
        }
        if (currentFilters?.activeDates?.length) {
          searchParams.set('dates', currentFilters.activeDates.join(','));
        }
        if (currentFilters?.activeGenres?.length) {
          searchParams.set('genres', currentFilters.activeGenres.join(','));
        }

        const url = `/api/filter-options${searchParams.toString() ? '?' + searchParams.toString() : ''}`;
        console.log('🔄 Fetching dynamic filter options with URL:', url);

        const response = await fetch(url, {
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
          setFilterOptions(result.data);
          setError(null);
        } else {
          const errorMsg = result.error || 'Invalid response format';
          setError(errorMsg);
        }
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Network error occurred';
        setError(errorMsg);
        console.error('Error fetching filter options:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFilterOptions();
  }, [currentFilters?.selectedAreas, currentFilters?.activeVibes, currentFilters?.activeDates, currentFilters?.activeGenres]);

  return { filterOptions, isLoading, error };
}