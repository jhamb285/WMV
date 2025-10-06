'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MapPin, Clock, Calendar, Music, Star, ExternalLink, Instagram, Phone, Users, ChevronRight, Tag, DollarSign } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useEvents } from '@/hooks/useEvents';
import { useTheme } from '@/contexts/ThemeContext';
import type { Venue, HierarchicalFilterState, FilterState, InstagramStory } from '@/types';

interface VenueFloatingPanelProps {
  venue: Venue | null;
  isOpen: boolean;
  onClose: () => void;
  filters?: HierarchicalFilterState;
  stories?: InstagramStory[];
  onViewDetails?: () => void;
  onFiltersChange?: (filters: HierarchicalFilterState) => void;
}

// Convert hierarchical filter state to flat filter state for API calls
function convertHierarchicalToFlat(hierarchicalState?: HierarchicalFilterState) {
  if (!hierarchicalState) {
    return {
      selectedAreas: [],
      activeVibes: [],
      activeDates: [],
      activeGenres: [],
      activeOffers: [],
      searchQuery: '',
      eventCategories: [],
      attributes: {}
    };
  }

  const allActiveGenres: string[] = [];
  const allActiveVibes: string[] = [];

  // Process genres
  hierarchicalState.selectedPrimaries.genres.forEach(primary => {
    const secondaries = hierarchicalState.selectedSecondaries.genres?.[primary] || [];
    if (secondaries.length > 0) {
      allActiveGenres.push(...secondaries);
    } else {
      allActiveGenres.push(primary);
    }
  });

  // Process vibes
  hierarchicalState.selectedPrimaries.vibes.forEach(primary => {
    const secondaries = hierarchicalState.selectedSecondaries.vibes?.[primary] || [];
    if (secondaries.length > 0) {
      allActiveVibes.push(...secondaries);
    } else {
      allActiveVibes.push(primary);
    }
  });

  // Process event categories (new)
  const eventCategories: Array<{ primary: string; secondary?: string }> = [];
  if (hierarchicalState.eventCategories) {
    hierarchicalState.eventCategories.selectedPrimaries.forEach(primary => {
      const secondaries = hierarchicalState.eventCategories!.selectedSecondaries[primary] || [];
      if (secondaries.length > 0) {
        // Add each secondary as a separate filter
        secondaries.forEach(secondary => {
          eventCategories.push({ primary, secondary });
        });
      } else {
        // No secondary selected, filter by primary only
        eventCategories.push({ primary });
      }
    });
  }

  // Process attributes (new)
  const attributes: {
    venue?: string[];
    energy?: string[];
    timing?: string[];
    status?: string[];
  } = {};
  if (hierarchicalState.attributes) {
    if (hierarchicalState.attributes.venue.length > 0) {
      attributes.venue = hierarchicalState.attributes.venue;
    }
    if (hierarchicalState.attributes.energy.length > 0) {
      attributes.energy = hierarchicalState.attributes.energy;
    }
    if (hierarchicalState.attributes.timing.length > 0) {
      attributes.timing = hierarchicalState.attributes.timing;
    }
    if (hierarchicalState.attributes.status.length > 0) {
      attributes.status = hierarchicalState.attributes.status;
    }
  }

  return {
    selectedAreas: hierarchicalState.selectedAreas,
    activeVibes: allActiveVibes,
    activeDates: hierarchicalState.activeDates,
    activeGenres: allActiveGenres,
    activeOffers: hierarchicalState.activeOffers,
    searchQuery: hierarchicalState.searchQuery,
    eventCategories,
    attributes
  };
}

const VenueFloatingPanel: React.FC<VenueFloatingPanelProps> = ({
  venue,
  isOpen,
  onClose,
  filters,
  stories = [],
  onViewDetails,
  onFiltersChange
}) => {
  // Get theme context
  const { isDarkMode } = useTheme();

  // Convert hierarchical filters to flat for API call
  const flatFilters = convertHierarchicalToFlat(filters);

  // Fetch real event data for this venue with applied filters (now with caching!)
  // NOTE: Don't pass dates filter here - we want ALL dates to show in the date buttons
  // Only fetch when panel is actually open to avoid duplicate API calls
  const { events, isLoading: eventsLoading, error: eventsError } = useEvents({
    venue_id: venue?.venue_id ? Number(venue.venue_id) : undefined, // Use venue_id (place_id) as the primary identifier
    limit: 50, // Increased to get more events across different dates
    genres: flatFilters.activeGenres || [],
    vibes: flatFilters.activeVibes || [],
    offers: flatFilters.activeOffers || [],
    eventCategories: flatFilters.eventCategories || [],
    attributes: flatFilters.attributes || {},
    enabled: isOpen && !!venue?.venue_id // Only fetch when panel is open and has a venue_id
    // dates: flatFilters.activeDates || [] ← REMOVED so all dates are fetched
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

  // Update selected date when events change
  React.useEffect(() => {
    if (uniqueDates.length > 0 && !uniqueDates.includes(selectedDateKey)) {
      setSelectedDateKey(uniqueDates[0]);
    }
  }, [uniqueDates, selectedDateKey]);

  const selectedDateEvents = selectedDateKey ? eventsByDate[selectedDateKey] || [] : [];
  const hasLiveStories = stories.length > 0;

  // Get unique dates from all events for the right panel display
  const uniqueEventDates = uniqueDates.map(dateKey => {
    const eventsForDate = eventsByDate[dateKey] || [];
    if (eventsForDate.length > 0) {
      return {
        date: new Date(eventsForDate[0].event_date),
        dateKey: dateKey
      };
    }
    return null;
  }).filter(date => date !== null).sort((a, b) => a.date.getTime() - b.date.getTime());

  // State for single selected date in right panel
  const [selectedRightPanelDates, setSelectedRightPanelDates] = useState<string[]>(
    uniqueEventDates.length > 0 ? [uniqueEventDates[0].dateKey] : []
  );

  // Update selected right panel dates when events change
  React.useEffect(() => {
    if (uniqueEventDates.length > 0) {
      // Filter out any selected dates that no longer exist
      const validSelectedDates = selectedRightPanelDates.filter(dateKey =>
        uniqueEventDates.find(d => d.dateKey === dateKey)
      );

      // If no valid dates remain, select the first available date
      if (validSelectedDates.length === 0) {
        setSelectedRightPanelDates([uniqueEventDates[0].dateKey]);
      } else if (validSelectedDates.length !== selectedRightPanelDates.length) {
        setSelectedRightPanelDates(validSelectedDates);
      }
    }
  }, [uniqueEventDates, selectedRightPanelDates]);

  // Get events for all selected dates in right panel
  const selectedRightPanelEvents = selectedRightPanelDates.flatMap(dateKey =>
    eventsByDate[dateKey] || []
  ).sort((a, b) => new Date(a.event_date).getTime() - new Date(b.event_date).getTime());

  if (!venue) return null;

  return (
    <>
      {/* Custom CSS for hiding scrollbars */}
      <style jsx>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>

      <AnimatePresence>
      {isOpen && (
        <>
          {/* Glassmorphism Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className={`fixed inset-0 z-50 backdrop-blur-lg relative
                       before:absolute before:inset-0 before:pointer-events-none
                       ${isDarkMode
                         ? 'bg-gray-900/40 before:bg-gradient-to-br before:from-gray-900/30 before:to-gray-800/20'
                         : 'bg-black/30 before:bg-gradient-to-br before:from-black/20 before:to-black/10'
                       }`}
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
            className="fixed bottom-4 left-2 right-2 z-60 max-w-2xl mx-auto h-[38.5vh]"
          >
            <div className={`backdrop-blur-xl rounded-2xl shadow-2xl overflow-hidden h-full relative
                           before:absolute before:inset-0 before:pointer-events-none before:rounded-2xl
                           after:absolute after:inset-0 after:pointer-events-none after:rounded-2xl
                           ${isDarkMode
                             ? 'bg-gray-900/60 border border-gray-700/50 before:bg-gradient-to-br before:from-gray-800/30 before:to-gray-900/10 after:bg-gradient-to-t after:from-transparent after:via-gray-800/5 after:to-gray-700/10'
                             : 'bg-white/30 border border-white/40 before:bg-gradient-to-br before:from-white/20 before:to-white/5 after:bg-gradient-to-t after:from-transparent after:via-white/5 after:to-white/10'
                           }`}>

              {/* Main Layout: 80% Left + 20% Right */}
              <div className="flex h-full">

                {/* Left Section - 80% */}
                <div className="flex-1 w-4/5 flex flex-col p-3">

                  {/* Header with Venue Rating and Name */}
                  <div className="flex items-center gap-3 mb-2">
                    {/* Venue Rating - Always display with dummy data */}
                    <div className="flex items-center gap-1.5">
                      <Star className="h-5 w-5 text-amber-600 fill-amber-600" />
                      <span className={`text-base font-semibold ${isDarkMode ? 'text-amber-400' : 'text-amber-700'}`}>
                        {venue.rating ? venue.rating.toFixed(1) : '4.5'}
                      </span>
                      <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        ({venue.rating_count || '120'})
                      </span>
                    </div>

                    {/* Venue Name */}
                    <h3 className={`text-lg font-bold leading-tight line-clamp-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      {venue.name}
                    </h3>
                    {hasLiveStories && (
                      <Badge className="bg-red-500/90 text-white animate-pulse border-red-400/50">
                        <span className="w-2 h-2 bg-red-400 rounded-full mr-1.5 animate-pulse"></span>
                        {stories.length} Live
                      </Badge>
                    )}
                  </div>

                  {/* Event Content Card */}
                  <div className="flex-1 overflow-hidden">
                    {eventsLoading ? (
                      <div className={`text-sm text-center py-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Loading events...</div>
                    ) : selectedRightPanelEvents.length > 0 ? (
                      <>
                        {/* Events Display */}
                        {selectedRightPanelEvents.length === 1 ? (
                          /* Single Event */
                          <div className="w-full h-full">
                            {selectedRightPanelEvents.map((event, index) => (
                              <div key={`${event.id}-${event.event_date}-${index}`} className={`backdrop-blur-sm rounded-lg p-3 w-full h-full relative before:absolute before:inset-0 before:pointer-events-none before:rounded-lg
                                   ${isDarkMode
                                     ? 'bg-gray-800/60 border border-gray-600/30 before:bg-gradient-to-br before:from-gray-700/10 before:to-gray-800/20'
                                     : 'bg-white/60 border border-gray-300/30 before:bg-gradient-to-br before:from-white/10 before:to-gray-100/20'
                                   }`}>
                                <div className="flex flex-col h-full">
                                  <div className="flex-1">
                                    {/* Event Name (Primary) - Up to 2 Lines */}
                                    <h5 className={`font-bold text-base mb-2 line-clamp-2 leading-tight ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                      {event.artist || event.event_name}
                                    </h5>

                                    {/* Event Name (if different from artist) - Up to 2 Lines */}
                                    {event.event_name && event.artist && event.event_name !== event.artist && (
                                      <div className={`text-sm mb-2 line-clamp-2 leading-tight ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>{event.event_name}</div>
                                    )}

                                    {/* Event Attributes - 2 Lines Max */}
                                    {event.attributes && (
                                      <div className="flex items-start gap-2 text-sm text-purple-600 mb-1">
                                        <Star className="h-4 w-4 flex-shrink-0 mt-0.5" />
                                        <span className="line-clamp-2 leading-tight">
                                          {[
                                            ...(event.attributes.venue || []),
                                            ...(event.attributes.energy || []),
                                            ...(event.attributes.timing || []),
                                            ...(event.attributes.status || [])
                                          ].join(' • ')}
                                        </span>
                                      </div>
                                    )}

                                    {/* Event Vibe - Up to 2 Lines */}
                                    {event.event_vibe && (
                                      <div className="flex items-start gap-2 text-sm text-purple-600 mb-1">
                                        <Star className="h-4 w-4 flex-shrink-0 mt-0.5" />
                                        <span className="line-clamp-2 leading-tight">{event.event_vibe}</span>
                                      </div>
                                    )}

                                    {/* Music Genre - Up to 2 Lines */}
                                    {event.music_genre && (
                                      <div className="flex items-start gap-2 text-sm text-blue-600 mb-1">
                                        <Music className="h-4 w-4 flex-shrink-0 mt-0.5" />
                                        <span className="line-clamp-2 leading-tight">{event.music_genre}</span>
                                      </div>
                                    )}

                                    {/* Special Offers - 1 Line Only */}
                                    {event.special_offers && (
                                      <div className="flex items-start gap-2 text-sm text-green-600 mb-1">
                                        <Tag className="h-4 w-4 flex-shrink-0 mt-0.5" />
                                        <span className="line-clamp-1 leading-tight">{event.special_offers}</span>
                                      </div>
                                    )}

                                    {/* Ticket Price - 1 Line Only */}
                                    {event.ticket_price && (
                                      <div className="flex items-start gap-2 text-sm text-orange-600 mb-1">
                                        <DollarSign className="h-4 w-4 flex-shrink-0 mt-0.5" />
                                        <span className="line-clamp-1 leading-tight">{event.ticket_price}</span>
                                      </div>
                                    )}

                                    {/* Event Time - 1 Line Only */}
                                    {event.event_time && (
                                      <div className="flex items-start gap-2 text-sm text-teal-600 mb-1">
                                        <Clock className="h-4 w-4 flex-shrink-0 mt-0.5" />
                                        <span className="line-clamp-1 leading-tight">{event.event_time}</span>
                                      </div>
                                    )}

                                    {/* Artist - 2 Lines (if different from title) */}
                                    {event.artist && event.artist !== (event.artist || event.event_name) && (
                                      <div className="flex items-start gap-2 text-sm text-indigo-600 mb-1">
                                        <Users className="h-4 w-4 flex-shrink-0 mt-0.5" />
                                        <span className="line-clamp-2 leading-tight">{event.artist}</span>
                                      </div>
                                    )}

                                    {/* Website/Social - 1 Line Only */}
                                    {event.website_social && (
                                      <div className="flex items-start gap-2 text-sm text-slate-600 mb-1">
                                        <ExternalLink className="h-4 w-4 flex-shrink-0 mt-0.5" />
                                        <span className="line-clamp-1 leading-tight">{event.website_social}</span>
                                      </div>
                                    )}

                                    {/* Venue Category - 1 Line Only */}
                                    {venue?.category && (
                                      <div className="flex items-start gap-2 text-sm text-pink-600 mb-1">
                                        <MapPin className="h-4 w-4 flex-shrink-0 mt-0.5" />
                                        <span className="line-clamp-1 leading-tight">{venue.category}</span>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          /* Multiple Events - Vertical List */
                          <div className="w-full h-full overflow-y-auto">
                            <div className="space-y-2">
                              {selectedRightPanelEvents.map((event, index) => (
                                <div key={`${event.id}-${event.event_date}-${index}`} className={`backdrop-blur-sm rounded-lg p-3 w-full relative before:absolute before:inset-0 before:pointer-events-none before:rounded-lg
                                     ${isDarkMode
                                       ? 'bg-gray-800/60 border border-gray-600/30 before:bg-gradient-to-br before:from-gray-700/10 before:to-gray-800/20'
                                       : 'bg-white/60 border border-gray-300/30 before:bg-gradient-to-br before:from-white/10 before:to-gray-100/20'
                                     }`}>
                                  <div className="flex flex-col">
                                    {/* Event Name (Primary) - Up to 2 Lines */}
                                    <h5 className={`font-bold text-base mb-2 line-clamp-2 leading-tight ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                      {event.artist || event.event_name}
                                    </h5>

                                    {/* Event Name (if different from artist) - Up to 2 Lines */}
                                    {event.event_name && event.artist && event.event_name !== event.artist && (
                                      <div className={`text-sm mb-2 line-clamp-2 leading-tight ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>{event.event_name}</div>
                                    )}

                                    {/* Event Attributes - 2 Lines Max */}
                                    {event.attributes && (
                                      <div className="flex items-start gap-2 text-sm text-purple-600 mb-1">
                                        <Star className="h-4 w-4 flex-shrink-0 mt-0.5" />
                                        <span className="line-clamp-2 leading-tight">
                                          {[
                                            ...(event.attributes.venue || []),
                                            ...(event.attributes.energy || []),
                                            ...(event.attributes.timing || []),
                                            ...(event.attributes.status || [])
                                          ].join(' • ')}
                                        </span>
                                      </div>
                                    )}

                                    {/* Event Vibe - Up to 2 Lines */}
                                    {event.event_vibe && (
                                      <div className="flex items-start gap-2 text-sm text-purple-600 mb-1">
                                        <Star className="h-4 w-4 flex-shrink-0 mt-0.5" />
                                        <span className="line-clamp-2 leading-tight">{event.event_vibe}</span>
                                      </div>
                                    )}

                                    {/* Music Genre - Up to 2 Lines */}
                                    {event.music_genre && (
                                      <div className="flex items-start gap-2 text-sm text-blue-600 mb-1">
                                        <Music className="h-4 w-4 flex-shrink-0 mt-0.5" />
                                        <span className="line-clamp-2 leading-tight">{event.music_genre}</span>
                                      </div>
                                    )}

                                    {/* Special Offers - 1 Line Only */}
                                    {event.special_offers && (
                                      <div className="flex items-start gap-2 text-sm text-green-600 mb-1">
                                        <Tag className="h-4 w-4 flex-shrink-0 mt-0.5" />
                                        <span className="line-clamp-1 leading-tight">{event.special_offers}</span>
                                      </div>
                                    )}

                                    {/* Ticket Price - 1 Line Only */}
                                    {event.ticket_price && (
                                      <div className="flex items-start gap-2 text-sm text-orange-600 mb-1">
                                        <DollarSign className="h-4 w-4 flex-shrink-0 mt-0.5" />
                                        <span className="line-clamp-1 leading-tight">{event.ticket_price}</span>
                                      </div>
                                    )}

                                    {/* Event Time - 1 Line Only */}
                                    {event.event_time && (
                                      <div className="flex items-start gap-2 text-sm text-teal-600 mb-1">
                                        <Clock className="h-4 w-4 flex-shrink-0 mt-0.5" />
                                        <span className="line-clamp-1 leading-tight">{event.event_time}</span>
                                      </div>
                                    )}

                                    {/* Artist - 2 Lines (if different from title) */}
                                    {event.artist && event.artist !== (event.artist || event.event_name) && (
                                      <div className="flex items-start gap-2 text-sm text-indigo-600 mb-1">
                                        <Users className="h-4 w-4 flex-shrink-0 mt-0.5" />
                                        <span className="line-clamp-2 leading-tight">{event.artist}</span>
                                      </div>
                                    )}

                                    {/* Website/Social - 1 Line Only */}
                                    {event.website_social && (
                                      <div className="flex items-start gap-2 text-sm text-slate-600 mb-1">
                                        <ExternalLink className="h-4 w-4 flex-shrink-0 mt-0.5" />
                                        <span className="line-clamp-1 leading-tight">{event.website_social}</span>
                                      </div>
                                    )}

                                    {/* Venue Category - 1 Line Only */}
                                    {venue?.category && (
                                      <div className="flex items-start gap-2 text-sm text-pink-600 mb-1">
                                        <MapPin className="h-4 w-4 flex-shrink-0 mt-0.5" />
                                        <span className="line-clamp-1 leading-tight">{venue.category}</span>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </>
                    ) : (
                      <div className={`text-sm text-center py-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>No events found</div>
                    )}
                  </div>
                </div>

                {/* Right Section - 20% */}
                <div className={`w-1/5 flex flex-col p-3 border-l ${isDarkMode ? 'border-gray-600/30' : 'border-white/20'}`}>

                  {/* Top - Instagram (Centered) */}
                  <div className="flex justify-center">
                    {venue?.final_instagram && (
                      <a
                        href={`https://instagram.com/${venue.final_instagram}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-3 rounded-full bg-gray-800/90 hover:bg-gray-900 transition-colors"
                        title="Instagram"
                      >
                        <Instagram className="w-6 h-6 text-white" />
                      </a>
                    )}
                  </div>

                  {/* Middle - Event Dates (Multiple Selection) */}
                  <div className="flex-1 flex items-center justify-center">
                    {uniqueEventDates.length > 0 && (
                      <div className="w-full max-w-[80px] h-24">
                        {/* Scrollable container without fade effects */}
                        <div className="h-full overflow-y-auto flex flex-col gap-1 items-center py-1 hide-scrollbar"
                             style={{
                               scrollbarWidth: 'none',
                               msOverflowStyle: 'none'
                             }}>
                          {uniqueEventDates.map((dateObj, index) => {
                            const isSelected = selectedRightPanelDates.includes(dateObj.dateKey);

                            return (
                              <button
                                key={`date-${index}`}
                                onClick={() => {
                                  // Single date selection - LOCAL FILTERING ONLY
                                  // Just update local state to filter which events are shown
                                  // Don't propagate to parent to avoid refetching and losing other dates
                                  setSelectedRightPanelDates([dateObj.dateKey]);
                                }}
                                className={`px-2 py-1 rounded-full text-xs whitespace-nowrap flex-shrink-0 transition-colors ${
                                  isSelected
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-gray-400/60 text-white hover:bg-gray-500/80'
                                }`}
                              >
                                {dateObj.date.toLocaleDateString('en-US', {
                                  month: 'short',
                                  day: 'numeric'
                                })}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>


                  {/* Bottom - Arrow (Centered) */}
                  <div className="flex justify-center mt-2">
                    <button
                      onClick={onViewDetails}
                      className="p-3 rounded-full bg-gray-800/90 hover:bg-gray-900 transition-colors"
                      title="View Details"
                    >
                      <ChevronRight className="w-6 h-6 text-white" />
                    </button>
                  </div>
                </div>

              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
    </>
  );
};

export default VenueFloatingPanel;