'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  SlidersHorizontal,
  Search,
  Globe
} from 'lucide-react';
import type { FilterState } from '@/types';
import { useFilterOptions } from '@/hooks/useFilterOptions';
import FilterBottomSheet from '@/components/filters/FilterBottomSheet';

interface HorizontalNavProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  renderAsButtons?: boolean;
}

const HorizontalNav: React.FC<HorizontalNavProps> = ({ filters, onFiltersChange, renderAsButtons = false }) => {
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);
  const { filterOptions } = useFilterOptions(filters);

  const navItems = [
    { id: 'filters', icon: SlidersHorizontal, label: 'Filters' },
    { id: 'search', icon: Search, label: 'Search' },
    { id: 'globe', icon: Globe, label: 'City' }
  ];

  const toggleFilter = (filterId: string) => {
    if (filterId === 'filters') {
      setIsBottomSheetOpen(true);
    } else if (filterId === 'search') {
      console.log('Search functionality - to be implemented');
    } else if (filterId === 'globe') {
      console.log('City/Country selection - to be implemented');
    }
  };

  const getFilterButtonStyle = (filterId: string) => {
    let hasActiveFilters = false;

    if (filterId === 'filters') {
      // Check if any filter is active
      hasActiveFilters =
        (!filters.selectedAreas.includes('All Dubai') || filters.selectedAreas.length > 1) ||
        filters.activeVibes.length > 0 ||
        (filters.activeDates?.length || 0) > 0 ||
        filters.activeGenres.length > 0;
    }

    return `nav-circle ${hasActiveFilters ? 'nav-has-filters' : ''}`;
  };

  const navButtons = navItems.map((item) => {
    const IconComponent = item.icon;

    return (
      <motion.button
        key={item.id}
        onClick={() => toggleFilter(item.id)}
        className={getFilterButtonStyle(item.id)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        transition={{ duration: 0.15 }}
      >
        <IconComponent
          size={18}
          className="nav-icon"
          strokeWidth={1.5}
        />
      </motion.button>
    );
  });

  if (renderAsButtons) {
    return (
      <>
        {navButtons}

        <FilterBottomSheet
          isOpen={isBottomSheetOpen}
          onClose={() => setIsBottomSheetOpen(false)}
          filters={filters}
          onFiltersChange={onFiltersChange}
          filterOptions={{
            areas: filterOptions?.areas || [],
            vibes: filterOptions?.vibes || [],
            dates: filterOptions?.dates || [],
            genres: filterOptions?.genres || []
          }}
        />
      </>
    );
  }

  return null;
};

export default HorizontalNav;