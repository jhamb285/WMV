'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import type { Event } from '@/types';

interface UseEventsOptions {
  venue_id?: number; // Use venue_id (place_id) as the primary identifier
  limit?: number;
  genres?: string[];
  vibes?: string[];
  offers?: string[];
  dates?: string[];
  eventCategories?: Array<{ primary: string; secondary?: string }>;
  attributes?: {
    venue?: string[];
    energy?: string[];
    timing?: string[];
    status?: string[];
  };
  enabled?: boolean;
}

// Global cache for events data - persists across component unmounts
const eventsCache = new Map<string, {
  data: Event[];
  timestamp: number;
  expiresAt: number;
}>();

// Cache expiry time: 5 minutes
const CACHE_EXPIRY_MS = 5 * 60 * 1000;

export function useEvents(options: UseEventsOptions = {}) {
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Create a stable reference to options to prevent re-renders
  const optionsRef = useRef<string>('');
  const currentOptionsString = JSON.stringify({
    venue_id: options.venue_id || 0,
    limit: options.limit || 10,
    genres: options.genres || [],
    vibes: options.vibes || [],
    offers: options.offers || [],
    dates: options.dates || [],
    eventCategories: options.eventCategories || [],
    attributes: options.attributes || {}
  });

  const fetchEvents = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Check cache first
      const cacheKey = currentOptionsString;
      const cachedEntry = eventsCache.get(cacheKey);
      const now = Date.now();

      // If we have valid cached data, use it
      if (cachedEntry && now < cachedEntry.expiresAt) {
        console.log(`🚀 CACHE HIT for venue_id: ${options.venue_id} - Loading instantly!`);
        setEvents(cachedEntry.data);
        setError(null);
        setIsLoading(false);
        return;
      }

      // Remove expired cache entries
      if (cachedEntry && now >= cachedEntry.expiresAt) {
        console.log(`🗑️ CACHE EXPIRED for venue_id: ${options.venue_id} - Fetching fresh data`);
        eventsCache.delete(cacheKey);
      }

      console.log(`📡 CACHE MISS for venue_id: ${options.venue_id} - Fetching from API`);

      const params = new URLSearchParams();
      if (options.venue_id) params.append('venue_id', options.venue_id.toString());
      if (options.limit) params.append('limit', options.limit.toString());
      if (options.genres && options.genres.length > 0) params.append('genres', options.genres.join(','));
      if (options.vibes && options.vibes.length > 0) params.append('vibes', options.vibes.join(','));
      if (options.offers && options.offers.length > 0) params.append('offers', options.offers.join(','));
      if (options.dates && options.dates.length > 0) params.append('dates', options.dates.join(','));

      // Add event categories - format: "primary|secondary,primary|secondary"
      if (options.eventCategories && options.eventCategories.length > 0) {
        const categoriesStr = options.eventCategories
          .map(cat => `${cat.primary}${cat.secondary ? '|' + cat.secondary : ''}`)
          .join(',');
        params.append('eventCategories', categoriesStr);
      }

      // Add attributes - format: "venue:Indoor,energy:High Energy,timing:Night Event"
      if (options.attributes) {
        const attributesParts: string[] = [];
        Object.entries(options.attributes).forEach(([type, values]) => {
          if (values && values.length > 0) {
            values.forEach(value => {
              attributesParts.push(`${type}:${value}`);
            });
          }
        });
        if (attributesParts.length > 0) {
          params.append('attributes', attributesParts.join(','));
        }
      }

      const response = await fetch(`/api/events?${params}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (result.success && result.data && Array.isArray(result.data)) {
        const eventData = result.data;

        // Store in cache
        eventsCache.set(cacheKey, {
          data: eventData,
          timestamp: now,
          expiresAt: now + CACHE_EXPIRY_MS
        });

        console.log(`💾 CACHED events for venue_id: ${options.venue_id} (${eventData.length} events)`);

        setEvents(eventData);
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
  }, [currentOptionsString, options.venue_id]); // Only re-create when the stringified options actually change

  useEffect(() => {
    // Don't fetch if explicitly disabled
    if (options.enabled === false) {
      console.log('🚫 FETCH DISABLED - enabled=false');
      return;
    }

    // Only fetch if options have actually changed and we have meaningful options
    if (optionsRef.current !== currentOptionsString) {
      optionsRef.current = currentOptionsString;

      if (options.venue_id || (options.genres && options.genres.length > 0) || (options.vibes && options.vibes.length > 0) || (options.offers && options.offers.length > 0)) {
        fetchEvents();
      }
    }
  }, [currentOptionsString, fetchEvents, options.enabled]);

  return {
    events,
    isLoading,
    error,
    refetch: fetchEvents,
    // Cache management utilities
    clearCache: () => {
      eventsCache.clear();
      console.log('🗑️ Events cache cleared');
    },
    getCacheStats: () => ({
      size: eventsCache.size,
      entries: Array.from(eventsCache.entries()).map(([key, value]) => ({
        key,
        timestamp: new Date(value.timestamp).toISOString(),
        expiresAt: new Date(value.expiresAt).toISOString(),
        eventCount: value.data.length
      }))
    })
  };
}