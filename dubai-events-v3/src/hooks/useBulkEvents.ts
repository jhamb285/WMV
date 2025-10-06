'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import type { Event, Venue } from '@/types';

interface UseBulkEventsOptions {
  venues?: Venue[];
  limit?: number;
  genres?: string[];
  vibes?: string[];
  offers?: string[];
  dates?: string[];
  enabled?: boolean;
}

// Global cache for bulk events data - organized by venue name
const bulkEventsCache = new Map<string, {
  data: Event[];
  timestamp: number;
  expiresAt: number;
}>();

// Cache expiry time: 10 minutes (longer for bulk data)
const CACHE_EXPIRY_MS = 10 * 60 * 1000;

export function useBulkEvents(options: UseBulkEventsOptions = {}) {
  const [eventsByVenue, setEventsByVenue] = useState<Record<string, Event[]>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { venues = [], enabled = true } = options;

  // Create cache key for the current request
  const cacheKey = JSON.stringify({
    venue_names: venues.map(v => v.name).sort(),
    limit: options.limit || 10,
    genres: options.genres || [],
    vibes: options.vibes || [],
    offers: options.offers || [],
    dates: options.dates || []
  });

  const fetchBulkEvents = useCallback(async () => {
    if (!enabled || venues.length === 0) {
      setEventsByVenue({});
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const venue_names = venues.map(venue => venue.name);
      const now = Date.now();

      console.log(`🚀 BULK EVENTS - Processing ${venue_names.length} venues`);

      // Check cache for each venue
      const cachedData: Record<string, Event[]> = {};
      const venuesToFetch: string[] = [];

      venue_names.forEach(venue_name => {
        const venueCacheKey = `${venue_name}:${cacheKey}`;
        const cachedEntry = bulkEventsCache.get(venueCacheKey);

        if (cachedEntry && now < cachedEntry.expiresAt) {
          console.log(`🚀 CACHE HIT for venue: ${venue_name}`);
          cachedData[venue_name] = cachedEntry.data;
        } else {
          console.log(`📡 CACHE MISS for venue: ${venue_name}`);
          venuesToFetch.push(venue_name);
          // Clean expired cache
          if (cachedEntry) {
            bulkEventsCache.delete(venueCacheKey);
          }
        }
      });

      // If all venues are cached, return immediately
      if (venuesToFetch.length === 0) {
        console.log(`✅ ALL VENUES CACHED - Loading instantly!`);
        setEventsByVenue(cachedData);
        setIsLoading(false);
        return;
      }

      console.log(`📡 FETCHING ${venuesToFetch.length} venues from API:`, venuesToFetch);

      // Fetch missing venues in bulk
      const response = await fetch('/api/events-bulk', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          venue_names: venuesToFetch,
          limit: options.limit || 10,
          genres: options.genres,
          vibes: options.vibes,
          offers: options.offers,
          dates: options.dates
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (result.success && result.data) {
        const fetchedData = result.data;

        // Store fetched data in cache
        Object.keys(fetchedData).forEach(venue_name => {
          const venueCacheKey = `${venue_name}:${cacheKey}`;
          bulkEventsCache.set(venueCacheKey, {
            data: fetchedData[venue_name] || [],
            timestamp: now,
            expiresAt: now + CACHE_EXPIRY_MS
          });
        });

        console.log(`💾 CACHED events for ${Object.keys(fetchedData).length} venues`);

        // Combine cached and fetched data
        const combinedData = { ...cachedData, ...fetchedData };
        setEventsByVenue(combinedData);
        setError(null);

        console.log(`✅ BULK FETCH COMPLETE - ${Object.keys(combinedData).length} venues ready`);

      } else {
        const errorMsg = result.error || 'Invalid response format';
        setError(errorMsg);
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Network error occurred';
      setError(errorMsg);
      console.error('Bulk Events API error:', err);
    } finally {
      setIsLoading(false);
    }
  }, [enabled, venues, cacheKey, options.limit, options.genres, options.vibes, options.offers, options.dates]);

  useEffect(() => {
    fetchBulkEvents();
  }, [fetchBulkEvents]);

  // Helper function to get events for a specific venue
  const getEventsForVenue = useCallback((venueName: string): Event[] => {
    return eventsByVenue[venueName] || [];
  }, [eventsByVenue]);

  return {
    eventsByVenue,
    isLoading,
    error,
    refetch: fetchBulkEvents,
    getEventsForVenue,
    // Cache management utilities
    clearCache: () => {
      bulkEventsCache.clear();
      console.log('🗑️ Bulk events cache cleared');
    },
    getCacheStats: () => ({
      size: bulkEventsCache.size,
      venues: Array.from(bulkEventsCache.keys()).map(key => key.split(':')[0])
    })
  };
}