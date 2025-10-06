'use client';

import React, { createContext, useContext, useEffect } from 'react';
import { useBulkEvents } from '@/hooks/useBulkEvents';
import type { Event, Venue, FilterState } from '@/types';

interface BulkEventsContextType {
  getEventsForVenue: (venueName: string) => Event[];
  isLoading: boolean;
  error: string | null;
  eventsByVenue: Record<string, Event[]>;
  clearCache: () => void;
}

const BulkEventsContext = createContext<BulkEventsContextType | null>(null);

interface BulkEventsProviderProps {
  children: React.ReactNode;
  venues: Venue[];
  filters: FilterState;
}

export function BulkEventsProvider({ children, venues, filters }: BulkEventsProviderProps) {
  const {
    eventsByVenue,
    isLoading,
    error,
    getEventsForVenue,
    clearCache
  } = useBulkEvents({
    venues,
    limit: 10,
    genres: filters.activeGenres,
    vibes: filters.activeVibes,
    offers: filters.activeOffers,
    dates: filters.activeDates,
    enabled: venues.length > 0
  });

  // Debug logging
  useEffect(() => {
    if (venues.length > 0) {
      console.log(`🔄 BULK EVENTS CONTEXT - Managing ${venues.length} venues:`, venues.map(v => v.name));
      console.log(`📊 BULK EVENTS CONTEXT - Current events data:`, Object.keys(eventsByVenue).length, 'venues loaded');
    }
  }, [venues, eventsByVenue]);

  const contextValue: BulkEventsContextType = {
    getEventsForVenue,
    isLoading,
    error,
    eventsByVenue,
    clearCache
  };

  return (
    <BulkEventsContext.Provider value={contextValue}>
      {children}
    </BulkEventsContext.Provider>
  );
}

export function useBulkEventsContext(): BulkEventsContextType {
  const context = useContext(BulkEventsContext);
  if (!context) {
    throw new Error('useBulkEventsContext must be used within a BulkEventsProvider');
  }
  return context;
}