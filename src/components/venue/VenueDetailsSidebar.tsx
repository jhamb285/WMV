'use client';

import React, { useState } from 'react';
import { X, MapPin, Clock, Instagram, ExternalLink, Users, Calendar, Music, TrendingUp, DollarSign, Gift, MessageCircle, BarChart3, Sparkles, Target, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useEvents } from '@/hooks/useEvents';
import type { Venue, InstagramStory, FilterState } from '@/types';

interface VenueDetailsSidebarProps {
  venue: Venue | null;
  isOpen: boolean;
  onClose: () => void;
  stories?: InstagramStory[];
  filters?: FilterState;
}

const VenueDetailsSidebar: React.FC<VenueDetailsSidebarProps> = ({
  venue,
  isOpen,
  onClose,
  stories = [],
  filters
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

  // Update selected date when events change (e.g., when filters change)
  React.useEffect(() => {
    if (uniqueDates.length > 0 && !uniqueDates.includes(selectedDateKey)) {
      setSelectedDateKey(uniqueDates[0]);
    }
  }, [uniqueDates, selectedDateKey]);
  const selectedDateEvents = selectedDateKey ? eventsByDate[selectedDateKey] || [] : [];

  if (!venue) return null;

  // Use venue data as-is without any dummy data

  const currentStories = stories;
  const hasLiveStories = currentStories.length > 0;
  const timeRemaining = hasLiveStories ? '22h 25m left' : '';

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 right-0 h-full w-full sm:w-96 bg-slate-900 border-l border-slate-700 text-white shadow-xl transform transition-transform duration-300 ease-in-out z-50 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-4 border-b border-slate-700">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="mb-2">
                  <div className="flex-1">
                    <h2 className="text-lg font-bold text-white mb-1 leading-tight">{venue.name}</h2>
                    <p className="text-white/70 text-sm flex items-center gap-1">
                      <span>{venue.area}</span>
                      <span className="w-1 h-1 bg-white/40 rounded-full"></span>
                      <span>Dubai</span>
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge 
                      variant="secondary" 
                      className="bg-slate-700 text-slate-300 capitalize"
                    >
                      {venue.category?.split(',')[0]?.replace(/([a-z])([A-Z])/g, '$1 $2')?.trim() || 'Venue'}
                    </Badge>
                    {hasLiveStories && (
                      <Badge 
                        variant="destructive"
                        className="bg-red-600 text-white animate-pulse"
                      >
                        <span className="w-2 h-2 bg-red-400 rounded-full mr-1.5 animate-pulse"></span>
                        {currentStories.length} Live Stories
                      </Badge>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {venue?.final_instagram && (
                      <a 
                        href={`https://instagram.com/${venue.final_instagram}`}
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="p-1.5 rounded-full bg-slate-800 hover:bg-pink-600 transition-colors duration-200"
                      >
                        <Instagram className="h-4 w-4 text-pink-400 hover:text-white" />
                      </a>
                    )}
                    {venue?.phone && (
                      <a 
                        href={`tel:${venue.phone}`}
                        className="p-1.5 rounded-full bg-slate-800 hover:bg-green-600 transition-colors duration-200"
                      >
                        <Phone className="h-4 w-4 text-green-400 hover:text-white" />
                      </a>
                    )}
                  </div>
                </div>
              </div>

              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white h-8 w-8"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto px-4 pt-2 pb-6 max-h-[calc(100vh-8rem)] scrollbar-thin">
            {/* Current Stories Section */}
            {hasLiveStories && (
              <div className="py-4 border-b border-slate-700">
                <div className="flex items-center gap-2 mb-3">
                  <Instagram className="h-5 w-5 text-yellow-500" />
                  <h3 className="text-lg font-semibold">Current Stories</h3>
                  <Badge variant="outline" className="text-xs border-slate-600">
                    {currentStories.length}
                  </Badge>
                </div>

                {timeRemaining && (
                  <div className="flex items-center gap-2 mb-3 text-xs text-slate-400">
                    <Clock className="h-4 w-4" />
                    <span>⏱️ {timeRemaining}</span>
                  </div>
                )}

                {currentStories.map((story) => (
                  <div
                    key={story.story_id}
                    className="bg-slate-800 rounded-lg p-4 mb-3 border border-slate-700"
                  >
                    {/* Story Placeholder */}
                    <a 
                      href={`https://instagram.com/${story.username}`}
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="block w-full h-32 bg-slate-700 rounded-md mb-3 flex items-center justify-center cursor-pointer hover:bg-slate-600 transition-all duration-200 border-2 border-transparent hover:border-pink-500/50"
                    >
                      <div className="text-center text-slate-400 hover:text-pink-400 transition-colors">
                        <Instagram className="h-8 w-8 mx-auto mb-2" />
                        <p className="text-xs font-medium">📸 Instagram Story</p>
                        <p className="text-xs text-pink-400 font-semibold">👆 Click here to check out Instagram</p>
                      </div>
                    </a>

                    {/* Story Details */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-slate-400" />
                        <span className="text-sm">@{story.username}</span>
                        <span className="text-xs text-slate-400">
                          {new Date(story.timestamp).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                            hour: 'numeric',
                            minute: '2-digit',
                            hour12: true
                          })}
                        </span>
                      </div>

                      <p className="text-sm text-slate-300">{story.context}</p>

                      {story.artists && story.artists.length > 0 && (
                        <div className="text-xs text-slate-400">
                          Mentions: {story.artists.map(artist => `@${artist}`).join(' ')}
                        </div>
                      )}
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full mt-3 border-pink-500/50 text-pink-400 hover:bg-pink-500/20 hover:border-pink-400 bg-pink-500/10"
                      asChild
                    >
                      <a 
                        href={`https://instagram.com/${story.username}`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2"
                      >
                        <Instagram className="h-4 w-4" />
                        <span>👆 Click here to check out Instagram</span>
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    </Button>
                  </div>
                ))}
              </div>
            )}

            {/* Event Information Section */}
            <div className="py-3">
              <div className="flex items-center gap-2 mb-4">
                <Calendar className="h-5 w-5 text-yellow-500" />
                <h3 className="text-lg font-semibold text-white">Events Calendar</h3>
              </div>

              {/* Interactive Event Date Tabs */}
              {!eventsLoading && !eventsError && uniqueDates.length > 0 && (
                <div className="mb-3">
                  <div className="flex flex-wrap gap-1 mb-2">
                    {uniqueDates.map((dateKey) => {
                      const date = new Date(dateKey);
                      const eventCount = eventsByDate[dateKey].length;
                      return (
                        <Button
                          key={dateKey}
                          variant={selectedDateKey === dateKey ? "default" : "secondary"}
                          size="sm"
                          onClick={() => setSelectedDateKey(dateKey)}
                          className={`text-xs px-3 py-1.5 h-auto ${
                            selectedDateKey === dateKey
                              ? "bg-yellow-600 text-black hover:bg-yellow-700"
                              : "bg-slate-700 text-slate-300 hover:bg-slate-600"
                          }`}
                        >
                          <Calendar className="h-3 w-3 mr-1" />
                          {date.toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric'
                          })}
                          {eventCount > 1 && (
                            <span className="ml-1 bg-white/20 rounded-full px-1.5 py-0.5 text-xs">
                              {eventCount}
                            </span>
                          )}
                        </Button>
                      );
                    })}
                  </div>
                  <Separator className="bg-slate-700" />
                </div>
              )}

              {eventsLoading && (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-500 mx-auto"></div>
                  <p className="text-slate-400 text-sm mt-2">Loading events...</p>
                </div>
              )}

              {eventsError && (
                <Card className="border-red-500/20 bg-red-500/5">
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-2 text-red-400">
                      <ExternalLink className="h-4 w-4" />
                      <span className="text-sm">{eventsError}</span>
                    </div>
                  </CardContent>
                </Card>
              )}

              {!eventsLoading && !eventsError && events.length === 0 && (
                <Card className="border-slate-700 bg-slate-800">
                  <CardContent className="pt-6">
                    <div className="text-center text-slate-400">
                      <Calendar className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">No events found for this venue</p>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Selected Date Events - Show all events for selected date */}
              {!eventsLoading && !eventsError && selectedDateEvents.length > 0 && (
                <div className="space-y-4">
                  {selectedDateEvents.map((event, index) => (
                    <Card key={`${event.id}-${index}`} className="border-slate-600 bg-slate-800/60 backdrop-blur-sm">
                      <CardHeader className="pb-1.5">
                        <div className="flex flex-col">
                          <div className="flex items-start justify-between mb-2">
                            <CardTitle className="text-white text-base font-semibold flex-1">
                              {event.event_name?.replace(/^#\s*/, '') || 'Unnamed Event'}
                            </CardTitle>
                            {event.confidence_score && (
                              <Badge variant="outline" className="text-xs border-green-500 text-green-400 bg-green-500/10 px-2 py-0.5 ml-3">
                                <BarChart3 className="h-3 w-3 mr-0.5" />
                                {event.confidence_score}%
                              </Badge>
                            )}
                          </div>
                          <CardDescription className="text-slate-300">
                            <div className="flex items-center justify-between w-full">
                              <span className="flex items-center gap-1.5">
                                <Calendar className="h-3.5 w-3.5 text-blue-400" />
                                <span className="text-sm font-medium">
                                  {new Date(event.event_date).toLocaleDateString('en-US', {
                                    weekday: 'short',
                                    month: 'short',
                                    day: 'numeric',
                                    year: 'numeric'
                                  })}
                                </span>
                              </span>
                              {event.event_time && (
                                <span className="flex items-center gap-1.5">
                                  <Clock className="h-3.5 w-3.5 text-green-400" />
                                  <span className="text-sm font-medium">{event.event_time}</span>
                                </span>
                              )}
                            </div>
                          </CardDescription>
                        </div>
                      </CardHeader>

                      <CardContent className="space-y-3 pt-3">
                        {/* Artists Section - Only show if artists exist */}
                        {event.artist && (
                          <div className="mb-3">
                            <div className="flex items-start gap-2.5">
                              <div className="p-1.5 rounded-lg bg-purple-600/20">
                                <Music className="h-4 w-4 text-purple-400" />
                              </div>
                              <div className="flex-1">
                                <p className="text-xs font-semibold text-white mb-1.5">Artists</p>
                                <div className="flex flex-wrap gap-1.5">
                                  {(Array.isArray(event.artist) ? event.artist : event.artist.split(',')).map((artist, idx) => (
                                    <Badge
                                      key={idx}
                                      className="bg-purple-600/20 text-purple-300 text-xs px-2 py-0.5 hover:bg-purple-600/30 border border-purple-500/30"
                                    >
                                      <Music className="w-2.5 h-2.5 mr-1" />
                                      {typeof artist === 'string' ? artist.trim() : artist}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Genre Section */}
                        {event.music_genre && (
                          <div className="mb-3">
                            <div className="flex items-start gap-2.5">
                              <div className="p-1.5 rounded-lg bg-blue-600/20">
                                <TrendingUp className="h-4 w-4 text-blue-400" />
                              </div>
                              <div className="flex-1">
                                <p className="text-xs font-semibold text-white mb-1.5">Genre</p>
                                <div className="flex flex-wrap gap-1.5">
                                  {(Array.isArray(event.music_genre) ? event.music_genre : event.music_genre.split(',')).map((genre, idx) => (
                                    <Badge
                                      key={idx}
                                      className="bg-blue-600/20 text-blue-300 text-xs px-2 py-0.5 hover:bg-blue-600/30 border border-blue-500/30"
                                    >
                                      <TrendingUp className="w-2.5 h-2.5 mr-1" />
                                      {typeof genre === 'string' ? genre.trim() : genre}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Event Vibe */}
                        {event.event_vibe && (
                      <div className="mb-3">
                        <div className="flex items-start gap-2.5">
                          <div className="p-1.5 rounded-lg bg-pink-600/20">
                            <Sparkles className="h-4 w-4 text-pink-400" />
                          </div>
                          <div className="flex-1">
                            <p className="text-xs font-semibold text-white mb-1.5">Vibe</p>
                            <div className="flex flex-wrap gap-1.5">
                              {(Array.isArray(event.event_vibe) ? event.event_vibe.flatMap(v => v.split('|').map(tag => tag.trim())) : event.event_vibe.split('|').map(tag => tag.trim())).map((vibe, idx) => (
                                <Badge 
                                  key={idx} 
                                  className="bg-pink-600/20 text-pink-300 text-xs px-2 py-0.5 hover:bg-pink-600/30 border border-pink-500/30"
                                >
                                  <Sparkles className="w-2.5 h-2.5 mr-1" />
                                  {vibe}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    <Separator className="bg-slate-600 my-3" />

                    {/* Pricing & Offers */}
                    <div className="space-y-3">
                          {event.ticket_price && (
                        <div className="flex items-start gap-2.5">
                          <div className="p-1.5 rounded-lg bg-green-600/20">
                            <DollarSign className="h-4 w-4 text-green-400" />
                          </div>
                          <div className="flex-1">
                            <p className="text-xs font-semibold text-white mb-1.5">Pricing</p>
                            <p className="text-sm font-medium text-green-300">{event.ticket_price}</p>
                          </div>
                        </div>
                      )}
                      
                          {event.special_offers && event.special_offers !== 'No special offers mentioned' && (
                        <div className="flex items-start gap-2.5">
                          <div className="p-1.5 rounded-lg bg-yellow-600/20">
                            <Gift className="h-4 w-4 text-yellow-400" />
                          </div>
                          <div className="flex-1">
                            <p className="text-xs font-semibold text-white mb-1.5">Special Offers</p>
                            <p className="text-sm text-yellow-300 leading-relaxed">{event.special_offers}</p>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Contact & Social */}
                        {(event.website_social || event.instagram_id) && (
                      <>
                        <Separator className="bg-slate-700" />
                        <div className="space-y-1">
                            {event.website_social && (
                            <div className="flex items-center gap-2">
                              <MessageCircle className="h-4 w-4 text-blue-400" />
                              <div>
                                <p className="text-xs text-slate-400">Contact</p>
                                <p className="text-sm text-blue-300">{event.website_social}</p>
                              </div>
                            </div>
                          )}
                          
                        </div>
                      </>
                    )}

                    {/* Analysis Notes */}
                        {event.analysis_notes && (
                      <>
                        <Separator className="bg-slate-700" />
                        <div className="flex items-start gap-2">
                          <Target className="h-4 w-4 text-orange-400 mt-0.5" />
                          <div>
                            <p className="text-xs text-slate-400 mb-1">Analysis Notes</p>
                            <p className="text-xs text-slate-300 leading-relaxed opacity-75">
                              {event.analysis_notes.length > 150
                                ? `${event.analysis_notes.substring(0, 150)}...`
                                : event.analysis_notes
                              }
                            </p>
                          </div>
                        </div>
                      </>
                    )}

                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}

              {/* Venue Contact Details */}
              {venue && (venue.address || venue.phone || venue.website) && (
                <div className="pt-6 border-t border-slate-600">
                  <div className="flex items-center gap-2 mb-4">
                    <MessageCircle className="h-5 w-5 text-blue-400" />
                    <h4 className="font-semibold text-lg text-white">Contact</h4>
                  </div>
                  <div className="space-y-3">
                    {venue.phone && (
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-blue-600/20">
                          <Phone className="h-4 w-4 text-blue-400" />
                        </div>
                        <span className="text-sm text-slate-300 font-medium">{venue.phone}</span>
                      </div>
                    )}
                    {venue.address && (
                      <div className="flex items-start gap-3">
                        <div className="p-2 rounded-lg bg-green-600/20">
                          <MapPin className="h-4 w-4 text-green-400" />
                        </div>
                        <span className="text-sm text-slate-300 leading-relaxed">{venue.address}</span>
                      </div>
                    )}
                    {venue.website && (
                      <Button
                        variant="outline"
                        className="w-full mt-3 border-blue-500/50 text-blue-400 hover:bg-blue-500/20 hover:border-blue-400 bg-blue-500/10"
                        asChild
                      >
                        <a href={venue.website} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2">
                          <ExternalLink className="h-4 w-4" />
                          Visit Website
                        </a>
                      </Button>
                    )}
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default VenueDetailsSidebar;