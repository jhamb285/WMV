// Simple venues hook with filtering
'use client';

import { useState, useEffect } from 'react';
import type { Venue, FilterState } from '@/types';

export function useVenues(filters?: FilterState) {
  const [venues, setVenues] = useState<Venue[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadVenues() {
      try {
        setIsLoading(true);
        setError(null);
        console.log('🚀 VENUES HOOK - Starting to load venues with filters:', filters);
        
        // Build query parameters from filters
        const searchParams = new URLSearchParams();
        searchParams.set('t', Date.now().toString());
        
        if (filters?.selectedAreas?.length && !filters.selectedAreas.includes('All Dubai')) {
          searchParams.set('areas', filters.selectedAreas.join(','));
        }
        if (filters?.activeVibes?.length) {
          searchParams.set('vibes', filters.activeVibes.join(','));
        }
        if (filters?.activeDates?.length) {
          searchParams.set('dates', filters.activeDates.join(','));
        }
        if (filters?.activeGenres?.length) {
          searchParams.set('genres', filters.activeGenres.join(','));
        }
        if (filters?.activeOffers?.length) {
          searchParams.set('offers', filters.activeOffers.join(','));
        }
        
        const response = await fetch(`/api/venues?${searchParams.toString()}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Cache-Control': 'no-cache',
          },
        });
        
        console.log('🚀 VENUES HOOK - Response status:', response.status);
        console.log('🚀 VENUES HOOK - Response ok:', response.ok);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const result = await response.json();
        console.log('🚀 VENUES HOOK - Response data:', result);
        console.log('🚀 VENUES HOOK - result.success:', result.success);
        console.log('🚀 VENUES HOOK - result.data:', result.data);
        console.log('🚀 VENUES HOOK - Array.isArray(result.data):', Array.isArray(result.data));
        
        if (result.success && Array.isArray(result.data)) {
          console.log('🚀 VENUES HOOK - Setting venues:', result.data.length);
          setVenues(result.data);
          setError(null);
          console.log('🚀 VENUES HOOK - Venues set successfully, clearing error');
        } else {
          const errorMsg = result.error || 'Invalid response format';
          console.error('🚀 VENUES HOOK - API Error:', errorMsg);
          console.error('🚀 VENUES HOOK - Failed conditions - success:', result.success, 'isArray:', Array.isArray(result.data));
          setError(errorMsg);
        }
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Network error occurred';
        console.error('🚀 VENUES HOOK - Fetch Error:', err);
        setError(errorMsg);
      } finally {
        console.log('🚀 VENUES HOOK - Finally block executing, setting loading to false');
        setIsLoading(false);
        console.log('🚀 VENUES HOOK - Loading complete, isLoading set to false');
      }
    }

    loadVenues();
  }, [JSON.stringify(filters)]); // Use JSON.stringify to avoid dependency issues

  return { venues, isLoading, error };
}