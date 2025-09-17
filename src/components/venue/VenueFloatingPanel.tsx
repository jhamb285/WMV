'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MapPin, Clock, Calendar, Music, Star, ExternalLink, Instagram, Phone, Users, ChevronRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useEvents } from '@/hooks/useEvents';
import type { Venue, FilterState, InstagramStory } from '@/types';

interface VenueFloatingPanelProps {
  venue: Venue | null;
  isOpen: boolean;
  onClose: () => void;
  filters?: FilterState;
  stories?: InstagramStory[];
  onViewDetails?: () => void;
}

const VenueFloatingPanel: React.FC<VenueFloatingPanelProps> = ({
  venue,
  isOpen,
  onClose,
  filters,
  stories = [],
  onViewDetails
}) => {
  // Fetch real event data for this venue with applied filters
  const { events, isLoading: eventsLoading, error: eventsError } = useEvents({
    venue_name: venue?.name || '',
    limit: 10,
    genres: filters?.activeGenres || [],
    vibes: filters?.activeVibes || [],
    offers: filters?.activeOffers || [],
    dates: filters?.activeDates || []
  });

  // Group events by date
  const eventsByDate = events.reduce((acc, event) => {
    const dateKey = new Date(event.event_date).toDateString();
    if (!acc[dateKey]) {
      acc[dateKey] = [];
    }
    acc[dateKey].push(event);
    return acc;
  }, {} as Record<string, typeof events>);

  const uniqueDates = Object.keys(eventsByDate).sort((a, b) =>
    new Date(a).getTime() - new Date(b).getTime()
  );

  // State for selected date (default to first date)
  const [selectedDateKey, setSelectedDateKey] = useState(uniqueDates[0] || '');

  // State for horizontal slider
  const [currentEventIndex, setCurrentEventIndex] = useState(0);

  // Update selected date when events change
  React.useEffect(() => {
    if (uniqueDates.length > 0 && !uniqueDates.includes(selectedDateKey)) {
      setSelectedDateKey(uniqueDates[0]);
    }
  }, [uniqueDates, selectedDateKey]);

  // Reset current event index when date changes
  React.useEffect(() => {
    setCurrentEventIndex(0);
  }, [selectedDateKey]);

  const selectedDateEvents = selectedDateKey ? eventsByDate[selectedDateKey] || [] : [];
  const hasLiveStories = stories.length > 0;

  if (!venue) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Light Glassmorphism Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 bg-black/30 backdrop-blur-lg
                       before:absolute before:inset-0 before:bg-gradient-to-br before:from-black/20 before:to-black/10 before:pointer-events-none
                       relative"
          />

          {/* Floating Panel */}
          <motion.div
            initial={{ y: '100%', opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: '100%', opacity: 0 }}
            transition={{
              type: 'spring',
              damping: 25,
              stiffness: 300,
              duration: 0.3
            }}
            className="fixed bottom-4 left-4 right-4 z-60 max-w-2xl mx-auto h-[30vh]"
          >
            <div className="bg-white/30 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/40 overflow-hidden h-full flex flex-col
                           before:absolute before:inset-0 before:bg-gradient-to-br before:from-white/20 before:to-white/5 before:pointer-events-none before:rounded-2xl
                           after:absolute after:inset-0 after:bg-gradient-to-t after:from-transparent after:via-white/5 after:to-white/10 after:pointer-events-none after:rounded-2xl
                           relative">
              {/* Header */}
              <div className="p-3 pb-2">
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0 flex items-center gap-3">
                    <h3 className="text-lg font-bold text-gray-900">
                      {venue.name}
                    </h3>
                    {hasLiveStories && (
                      <Badge className="bg-red-500/90 text-white animate-pulse border-red-400/50">
                        <span className="w-2 h-2 bg-red-400 rounded-full mr-1.5 animate-pulse"></span>
                        {stories.length} Live
                      </Badge>
                    )}
                  </div>

                  {/* Action Icons */}
                  <div className="flex items-center gap-2 ml-3">
                    {venue?.final_instagram && (
                      <a
                        href={`https://instagram.com/${venue.final_instagram}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded-full bg-gray-200/70 hover:bg-pink-500/80 transition-colors"
                        title="Instagram"
                      >
                        <Instagram className="h-5 w-5 text-pink-600" />
                      </a>
                    )}
                    <button
                      onClick={onViewDetails}
                      className="p-2 rounded-full bg-gray-800/90 hover:bg-gray-900 transition-colors"
                      title="View Details"
                    >
                      <ChevronRight className="w-5 h-5 text-white" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Compact Event Content */}
              <div className="px-3 py-1 flex-1 overflow-hidden">
                {eventsLoading ? (
                  <div className="text-sm text-gray-600 text-center py-2">Loading events...</div>
                ) : events.length > 0 ? (
                  <>
                    {/* Compact Date Pills */}
                    {uniqueDates.length > 1 && (
                      <div className="flex gap-1 overflow-x-auto pb-1 mb-2">
                        {uniqueDates.map((dateKey) => (
                          <button
                            key={dateKey}
                            onClick={() => setSelectedDateKey(dateKey)}
                            className={`px-2 py-0.5 rounded-full text-xs whitespace-nowrap transition-colors ${
                              selectedDateKey === dateKey
                                ? 'bg-blue-500/80 text-white'
                                : 'bg-white/10 text-white/70 hover:bg-white/20'
                            }`}
                          >
                            {new Date(dateKey).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric'
                            })}
                          </button>
                        ))}
                      </div>
                    )}

                    {/* Events Display */}
                    {selectedDateEvents.length === 1 ? (
                      /* Single Event - Full Width */
                      <div className="w-full">
                        {selectedDateEvents.map((event, index) => (
                          <div key={event.event_id || `event-${index}`} className="bg-white/60 backdrop-blur-sm border border-gray-300/30 rounded-lg p-4 w-full
                               relative before:absolute before:inset-0 before:bg-gradient-to-br before:from-white/10 before:to-gray-100/20 before:pointer-events-none before:rounded-lg">
                            <div className="flex items-start justify-between">
                              <div className="flex-1 min-w-0">
                                {/* Artist/Event Name */}
                                <h5 className="font-bold text-gray-900 text-base truncate">{event.artist || event.event_name}</h5>

                                {/* Event Name (if different from artist) */}
                                {event.event_name && event.artist && event.event_name !== event.artist && (
                                  <div className="text-sm text-gray-700 mt-1 truncate">{event.event_name}</div>
                                )}

                                {/* Music Genre */}
                                {(event.music_genre || event.genre) && (
                                  <div className="flex items-center gap-1.5 text-sm text-blue-600 mt-1">
                                    <Music className="h-4 w-4 flex-shrink-0" />
                                    <span className="truncate">{event.music_genre || event.genre}</span>
                                  </div>
                                )}

                                {/* Event Vibe */}
                                {(event.event_vibe || event.vibe) && (
                                  <div className="flex items-center gap-1.5 text-sm text-purple-600 mt-1">
                                    <Star className="h-4 w-4 flex-shrink-0" />
                                    <span className="truncate">{event.event_vibe || event.vibe}</span>
                                  </div>
                                )}

                                {/* Ticket Price */}
                                {event.ticket_price && (
                                  <div className="flex items-center gap-1.5 text-sm text-yellow-700 mt-1">
                                    <span>💰</span>
                                    <span className="truncate">{event.ticket_price}</span>
                                  </div>
                                )}

                                {/* Special Offers */}
                                {(event.special_offers || event.entry_offer) && (
                                  <div className="mt-1.5">
                                    <Badge className="bg-green-500/80 text-white text-sm">
                                      {(event.special_offers || event.entry_offer).length > 30
                                        ? `${(event.special_offers || event.entry_offer).substring(0, 30)}...`
                                        : (event.special_offers || event.entry_offer)
                                      }
                                    </Badge>
                                  </div>
                                )}

                              </div>
                              <div className="text-right ml-3 flex-shrink-0">
                                <div className="text-sm text-gray-600 font-bold">
                                  {new Date(event.event_date).toLocaleDateString('en-US', {
                                    month: 'short',
                                    day: 'numeric'
                                  })}
                                </div>
                                {event.event_time && (
                                  <div className="text-sm text-gray-500 font-bold">
                                    {event.event_time}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      /* Multiple Events - Horizontal Slider */
                      <div className="relative">
                        <div className="overflow-hidden">
                          <div
                            className="flex transition-transform duration-300 ease-in-out"
                            style={{ transform: `translateX(-${currentEventIndex * 100}%)` }}
                          >
                            {selectedDateEvents.map((event, index) => (
                              <div key={event.event_id || `event-${index}`} className="w-full flex-shrink-0">
                                <div className="bg-white/60 backdrop-blur-sm border border-gray-300/30 rounded-lg p-4 w-full
                                     relative before:absolute before:inset-0 before:bg-gradient-to-br before:from-white/10 before:to-gray-100/20 before:pointer-events-none before:rounded-lg">
                                  <div className="flex items-start justify-between">
                                    <div className="flex-1 min-w-0">
                                      {/* Artist/Event Name */}
                                      <h5 className="font-bold text-gray-900 text-base truncate">{event.artist || event.event_name}</h5>

                                      {/* Event Name (if different from artist) */}
                                      {event.event_name && event.artist && event.event_name !== event.artist && (
                                        <div className="text-sm text-gray-700 mt-1 truncate">{event.event_name}</div>
                                      )}

                                      {/* Music Genre */}
                                      {(event.music_genre || event.genre) && (
                                        <div className="flex items-center gap-1.5 text-sm text-blue-600 mt-1">
                                          <Music className="h-4 w-4 flex-shrink-0" />
                                          <span className="truncate">{event.music_genre || event.genre}</span>
                                        </div>
                                      )}

                                      {/* Event Vibe */}
                                      {(event.event_vibe || event.vibe) && (
                                        <div className="flex items-center gap-1.5 text-sm text-purple-600 mt-1">
                                          <Star className="h-4 w-4 flex-shrink-0" />
                                          <span className="truncate">{event.event_vibe || event.vibe}</span>
                                        </div>
                                      )}

                                      {/* Ticket Price */}
                                      {event.ticket_price && (
                                        <div className="flex items-center gap-1.5 text-sm text-yellow-700 mt-1">
                                          <span>💰</span>
                                          <span className="truncate">{event.ticket_price}</span>
                                        </div>
                                      )}

                                      {/* Special Offers */}
                                      {(event.special_offers || event.entry_offer) && (
                                        <div className="mt-1.5">
                                          <Badge className="bg-green-500/80 text-white text-sm">
                                            {(event.special_offers || event.entry_offer).length > 30
                                              ? `${(event.special_offers || event.entry_offer).substring(0, 30)}...`
                                              : (event.special_offers || event.entry_offer)
                                            }
                                          </Badge>
                                        </div>
                                      )}

                                    </div>
                                    <div className="text-right ml-3 flex-shrink-0">
                                      <div className="text-sm text-gray-600 font-bold">
                                        {new Date(event.event_date).toLocaleDateString('en-US', {
                                          month: 'short',
                                          day: 'numeric'
                                        })}
                                      </div>
                                      {event.event_time && (
                                        <div className="text-sm text-gray-500 font-bold">
                                          {event.event_time}
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Dot Indicators - Positioned over the tile */}
                        {selectedDateEvents.length > 1 && (
                          <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex justify-center gap-1">
                            {selectedDateEvents.map((_, index) => (
                              <button
                                key={index}
                                onClick={() => setCurrentEventIndex(index)}
                                className={`w-2 h-2 rounded-full transition-colors ${
                                  index === currentEventIndex
                                    ? 'bg-gray-800'
                                    : 'bg-gray-400/50'
                                }`}
                              />
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </>
                ) : (
                  <div className="text-sm text-gray-600 text-center py-2">No events found</div>
                )}
              </div>

            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default VenueFloatingPanel;