'use client';

import React from 'react';
import { FilterState } from '@/types';

interface GenreFilterTilesProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  availableGenres: string[];
}

const GenreFilterTiles: React.FC<GenreFilterTilesProps> = ({
  filters,
  onFiltersChange,
  availableGenres
}) => {
  const handleGenreClick = (genre: string) => {
    const currentGenres = filters.activeGenres || [];
    const newGenres = currentGenres.includes(genre)
      ? currentGenres.filter(g => g !== genre)
      : [...currentGenres, genre];

    onFiltersChange({
      ...filters,
      activeGenres: newGenres
    });
  };

  // Show all available genres based on current filters
  const displayGenres = availableGenres;

  // Debug: Log the number of genres
  console.log('🎵 GenreFilterTiles - Total genres available:', displayGenres.length);
  console.log('🎵 GenreFilterTiles - Genres list:', displayGenres);

  return (
    <div className="fixed top-22 left-0 right-0 z-40 px-4">
      <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
        {displayGenres.map((genre) => {
          const isSelected = filters.activeGenres?.includes(genre);
          return (
            <button
              key={genre}
              onClick={() => handleGenreClick(genre)}
              className={`
                px-3 py-1 text-xs font-medium rounded-full
                backdrop-blur-lg border-2 border-white/60 shadow-lg
                transition-all duration-200 whitespace-nowrap flex-shrink-0
                relative before:absolute before:inset-0 before:bg-gradient-to-br before:from-white/20 before:to-white/5 before:pointer-events-none before:rounded-full
                ${isSelected
                  ? 'bg-white/80 text-black border-white/90'
                  : 'bg-white/70 text-black hover:bg-white/80'
                }
              `}
            >
              {genre}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default GenreFilterTiles;