'use client';

import { useState, useEffect } from 'react';
import type { FilterState, FilterOptions, HierarchicalCategory } from '@/types';

interface UseFilterOptionsResult {
  filterOptions: FilterOptions;
  isLoading: boolean;
  error: string | null;
}

export function useFilterOptions(): UseFilterOptionsResult {
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    areas: [],
    dates: [],
    hierarchicalGenres: {},
    hierarchicalVibes: {},
    vibes: [],
    genres: []
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAllFilterOptions = async () => {
      try {
        setIsLoading(true);
        setError(null);

        console.log('🔄 Fetching ALL filter options (one-time load)');

        const response = await fetch('/api/filter-options', {
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
          console.log('✅ Loaded all filter options for client-side filtering');
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

    fetchAllFilterOptions();
  }, []); // Only load once on mount

  return { filterOptions, isLoading, error };
}