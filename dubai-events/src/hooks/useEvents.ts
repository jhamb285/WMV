'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import type { Event } from '@/types';

interface UseEventsOptions {
  venue_name?: string;
  limit?: number;
  genres?: string[];
  vibes?: string[];
  offers?: string[];
  dates?: string[];
}

export function useEvents(options: UseEventsOptions = {}) {
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Create a stable reference to options to prevent re-renders
  const optionsRef = useRef<string>('');
  const currentOptionsString = JSON.stringify({
    venue_name: options.venue_name || '',
    limit: options.limit || 10,
    genres: options.genres || [],
    vibes: options.vibes || [],
    offers: options.offers || [],
    dates: options.dates || []
  });

  const fetchEvents = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const params = new URLSearchParams();
      if (options.venue_name) params.append('venue_name', options.venue_name);
      if (options.limit) params.append('limit', options.limit.toString());
      if (options.genres && options.genres.length > 0) params.append('genres', options.genres.join(','));
      if (options.vibes && options.vibes.length > 0) params.append('vibes', options.vibes.join(','));
      if (options.offers && options.offers.length > 0) params.append('offers', options.offers.join(','));
      if (options.dates && options.dates.length > 0) params.append('dates', options.dates.join(','));
      
      const response = await fetch(`/api/events?${params}`, {
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
      
      if (result.success && result.data && Array.isArray(result.data)) {
        setEvents(result.data);
        setError(null);
      } else {
        const errorMsg = result.error || 'Invalid response format';
        setError(errorMsg);
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Network error occurred';
      setError(errorMsg);
      console.error('Events API error:', err);
    } finally {
      setIsLoading(false);
    }
  }, [currentOptionsString]); // Only re-create when the stringified options actually change

  useEffect(() => {
    // Only fetch if options have actually changed and we have meaningful options
    if (optionsRef.current !== currentOptionsString) {
      optionsRef.current = currentOptionsString;
      
      if (options.venue_name || (options.genres && options.genres.length > 0) || (options.vibes && options.vibes.length > 0) || (options.offers && options.offers.length > 0)) {
        fetchEvents();
      }
    }
  }, [currentOptionsString, fetchEvents]);

  return { events, isLoading, error, refetch: fetchEvents };
}