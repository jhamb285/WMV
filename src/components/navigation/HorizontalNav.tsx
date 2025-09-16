'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MapPin, 
  Sparkles,
  Calendar, 
  MessageCircle,
  Music 
} from 'lucide-react';
import type { FilterState } from '@/types';
import { useFilterOptions } from '@/hooks/useFilterOptions';

interface HorizontalNavProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
}

const HorizontalNav: React.FC<HorizontalNavProps> = ({ filters, onFiltersChange }) => {
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const { filterOptions, isLoading: filterOptionsLoading, error: filterOptionsError } = useFilterOptions(filters);

  const navItems = [
    { id: 'area', icon: MapPin, label: 'Area' },
    { id: 'vibes', icon: Sparkles, label: 'Vibes' },
    { id: 'dates', icon: Calendar, label: 'Dates' },
    { id: 'genres', icon: Music, label: 'Genre' },
    { id: 'chat', icon: MessageCircle, label: 'Chat' }
  ];

  const toggleFilter = (filterId: string) => {
    setActiveFilter(activeFilter === filterId ? null : filterId);
  };

  const toggleArea = (area: string) => {
    if (area === 'All Dubai') {
      // If "All Dubai" is selected, clear all other selections
      onFiltersChange({ ...filters, selectedAreas: ['All Dubai'] });
    } else {
      // Handle multiple area selection
      const currentAreas = filters.selectedAreas.filter(a => a !== 'All Dubai');
      const newAreas = currentAreas.includes(area)
        ? currentAreas.filter(a => a !== area)
        : [...currentAreas, area];
      
      // If no specific areas are selected, default to "All Dubai"
      const finalAreas = newAreas.length === 0 ? ['All Dubai'] : newAreas;
      onFiltersChange({ ...filters, selectedAreas: finalAreas });
    }
  };

  const toggleVibe = (vibe: string) => {
    const newVibes = filters.activeVibes.includes(vibe)
      ? filters.activeVibes.filter(v => v !== vibe)
      : [...filters.activeVibes, vibe];
    onFiltersChange({ ...filters, activeVibes: newVibes });
  };

  const toggleDate = (date: string) => {
    const newDates = filters.activeDates?.includes(date)
      ? filters.activeDates.filter(d => d !== date)
      : [...(filters.activeDates || []), date];
    onFiltersChange({ ...filters, activeDates: newDates });
  };


  const toggleGenre = (genre: string) => {
    const newGenres = filters.activeGenres.includes(genre)
      ? filters.activeGenres.filter(g => g !== genre)
      : [...filters.activeGenres, genre];
    onFiltersChange({ ...filters, activeGenres: newGenres });
  };

  const getFilterButtonStyle = (filterId: string) => {
    const isActive = activeFilter === filterId;
    let hasActiveFilters = false;
    
    if (filterId === 'area') hasActiveFilters = !filters.selectedAreas.includes('All Dubai') || filters.selectedAreas.length > 1;
    if (filterId === 'vibes') hasActiveFilters = filters.activeVibes.length > 0;
    if (filterId === 'dates') hasActiveFilters = (filters.activeDates?.length || 0) > 0;
    if (filterId === 'genres') hasActiveFilters = filters.activeGenres.length > 0;
    
    return `nav-circle ${
      isActive ? 'nav-active' : hasActiveFilters ? 'nav-has-filters' : ''
    }`;
  };

  return (
    <>
      <div className="fixed bottom-2 left-1/2 transform -translate-x-1/2 z-50">
        <div className="glass-nav-pill">
          {navItems.map((item) => {
            const IconComponent = item.icon;
            
            return (
              <div key={item.id} className="nav-button-container">
                <motion.button
                  onClick={() => toggleFilter(item.id)}
                  className={getFilterButtonStyle(item.id)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                >
                  <IconComponent 
                    size={22} 
                    className="nav-icon"
                    strokeWidth={1.5}
                  />
                </motion.button>
                <span className="nav-label">{item.label}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Filter Menu Drawers */}
      <AnimatePresence>
        {activeFilter && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="fixed bottom-24 left-1/2 transform -translate-x-1/2 z-40 w-full max-w-sm px-4"
          >
            <div className="dark-glass-popup rounded-2xl shadow-2xl overflow-hidden">
              <div className="p-4 overflow-y-auto max-h-[50vh] scrollbar-thin">
              
              {/* Area Filter Panel */}
              {activeFilter === 'area' && (
                <div className="space-y-2">
                  <div className="grid grid-cols-1 gap-2 max-h-[30vh] overflow-y-auto">
                    <label className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-700/50 cursor-pointer touch-manipulation transition-all duration-200 group">
                      <input
                        type="checkbox"
                        checked={filters.selectedAreas.includes('All Dubai')}
                        onChange={() => toggleArea('All Dubai')}
                        className="w-5 h-5 rounded border-gray-500 text-yellow-500 focus:ring-yellow-500 focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800"
                      />
                      <span className="text-white text-sm font-medium leading-none group-hover:text-yellow-100">All Dubai</span>
                    </label>
                    {filterOptionsLoading && (
                      <div className="text-center py-4">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-yellow-500 mx-auto"></div>
                        <p className="text-gray-300 text-xs mt-2">Loading areas...</p>
                      </div>
                    )}
                    {filterOptionsError && (
                      <div className="text-center py-4">
                        <p className="text-red-400 text-xs">Error loading areas</p>
                      </div>
                    )}
                    {!filterOptionsLoading && !filterOptionsError && (
                      <>
                        {filterOptions.areas.map((area) => (
                          <label key={area} className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-700/50 cursor-pointer touch-manipulation transition-all duration-200 group">
                            <input
                              type="checkbox"
                              checked={filters.selectedAreas.includes(area)}
                              onChange={() => toggleArea(area)}
                              className="w-5 h-5 rounded border-gray-500 text-yellow-500 focus:ring-yellow-500 focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800"
                            />
                            <span className="text-white text-sm font-medium leading-none group-hover:text-yellow-100">{area}</span>
                          </label>
                        ))}
                        {filterOptions.areas.length === 0 && (
                          <p className="text-gray-400 text-sm text-center py-4">No areas available</p>
                        )}
                      </>
                    )}
                  </div>
                </div>
              )}

              {/* Vibes Filter Panel */}
              {activeFilter === 'vibes' && (
                <div className="space-y-2">
                  {filterOptionsLoading && (
                    <div className="text-center py-4">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-yellow-500 mx-auto"></div>
                      <p className="text-gray-300 text-xs mt-2">Loading vibes...</p>
                    </div>
                  )}
                  {filterOptionsError && (
                    <div className="text-center py-4">
                      <p className="text-red-400 text-xs">Error loading vibes</p>
                    </div>
                  )}
                  {!filterOptionsLoading && !filterOptionsError && (
                    <div className="grid grid-cols-1 gap-2 max-h-[30vh] overflow-y-auto scrollbar-thin">
                      {filterOptions.vibes.map((vibe) => (
                        <label key={vibe} className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-700/50 cursor-pointer touch-manipulation transition-all duration-200 group">
                          <input
                            type="checkbox"
                            checked={filters.activeVibes.includes(vibe)}
                            onChange={() => toggleVibe(vibe)}
                            className="w-5 h-5 rounded border-gray-500 text-yellow-500 focus:ring-yellow-500 focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800"
                          />
                          <span className="text-white text-sm font-medium leading-none group-hover:text-yellow-100 flex-1">{vibe}</span>
                        </label>
                      ))}
                      {filterOptions.vibes.length === 0 && (
                        <p className="text-gray-400 text-sm text-center py-4">No vibes available</p>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Dates Filter Panel */}
              {activeFilter === 'dates' && (
                <div className="space-y-2">
                  {filterOptionsLoading && (
                    <div className="text-center py-4">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-yellow-500 mx-auto"></div>
                      <p className="text-gray-300 text-xs mt-2">Loading dates...</p>
                    </div>
                  )}
                  {filterOptionsError && (
                    <div className="text-center py-4">
                      <p className="text-red-400 text-xs">Error loading dates</p>
                    </div>
                  )}
                  {!filterOptionsLoading && !filterOptionsError && (
                    <div className="grid grid-cols-1 gap-2 max-h-[30vh] overflow-y-auto scrollbar-thin">
                      {filterOptions.dates?.map((date) => (
                        <label key={date} className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-700/50 cursor-pointer touch-manipulation transition-all duration-200 group">
                          <input
                            type="checkbox"
                            checked={filters.activeDates?.includes(date) || false}
                            onChange={() => toggleDate(date)}
                            className="w-5 h-5 rounded border-gray-500 text-yellow-500 focus:ring-yellow-500 focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800"
                          />
                          <span className="text-white text-sm font-medium leading-none group-hover:text-yellow-100 flex-1">{date}</span>
                        </label>
                      )) || []}
                      {(filterOptions.dates?.length || 0) === 0 && (
                        <p className="text-gray-400 text-sm text-center py-4">No dates available</p>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Genres Filter Panel */}
              {activeFilter === 'genres' && (
                <div className="space-y-2">
                  {filterOptionsLoading && (
                    <div className="text-center py-4">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-yellow-500 mx-auto"></div>
                      <p className="text-gray-300 text-xs mt-2">Loading genres...</p>
                    </div>
                  )}
                  {filterOptionsError && (
                    <div className="text-center py-4">
                      <p className="text-red-400 text-xs">Error loading genres</p>
                    </div>
                  )}
                  {!filterOptionsLoading && !filterOptionsError && (
                    <div className="grid grid-cols-1 gap-2 max-h-[30vh] overflow-y-auto scrollbar-thin">
                      {filterOptions.genres.map((genre) => (
                        <label key={genre} className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-700/50 cursor-pointer touch-manipulation transition-all duration-200 group">
                          <input
                            type="checkbox"
                            checked={filters.activeGenres.includes(genre)}
                            onChange={() => toggleGenre(genre)}
                            className="w-5 h-5 rounded border-gray-500 text-yellow-500 focus:ring-yellow-500 focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800"
                          />
                          <span className="text-white text-sm font-medium leading-none group-hover:text-yellow-100 flex-1">{genre}</span>
                        </label>
                      ))}
                      {filterOptions.genres.length === 0 && (
                        <p className="text-gray-400 text-sm text-center py-4">No genres available</p>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Chat Panel */}
              {activeFilter === 'chat' && (
                <div className="space-y-4">
                  <div className="text-center space-y-4 py-8">
                    <div className="w-16 h-16 mx-auto bg-gray-700 rounded-full flex items-center justify-center mb-4">
                      <MessageCircle className="h-8 w-8 text-yellow-500" />
                    </div>
                    <p className="text-white text-lg font-medium">AI Chat Coming Soon!</p>
                    <p className="text-gray-300 text-base leading-relaxed">
                      Chat with AI about Dubai events, venues, and get personalized recommendations.
                    </p>
                  </div>
                </div>
              )}
              
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Background overlay to close filters */}
      <AnimatePresence>
        {activeFilter && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActiveFilter(null)}
            className="fixed inset-0 bg-black/20 z-30"
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default HorizontalNav;