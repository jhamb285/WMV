'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HierarchicalFilterState, EventCategoryFilterState, Venue } from '@/types';
import {
  PRIMARY_CATEGORY_MAP,
  SECONDARY_CATEGORIES_MAP,
  getCategoryColor,
  getHexColor,
  getDisplayName
} from '@/lib/category-mappings';

interface CategoryPillsProps {
  filters: HierarchicalFilterState;
  onFiltersChange: (filters: HierarchicalFilterState) => void;
  venues: Venue[];
}

const CategoryPills: React.FC<CategoryPillsProps> = ({
  filters,
  onFiltersChange,
  venues
}) => {
  console.log('🏷️ CATEGORY PILLS - Rendering with filters:', filters);
  console.log('🏷️ CATEGORY PILLS - Venues count:', venues.length);

  // Initialize eventCategories if not present
  const eventCategories: EventCategoryFilterState = filters.eventCategories || {
    selectedPrimaries: [],
    selectedSecondaries: {},
    expandedPrimaries: []
  };

  // Calculate counts for each primary category
  const getCategoryCount = (primaryCategory: string): number => {
    return venues.filter(venue => {
      const categories = venue.event_categories || [];
      return categories.some(cat => cat.primary === primaryCategory);
    }).length;
  };

  // Handle primary category selection
  const handlePrimaryClick = (category: string) => {
    console.log('🔘 PRIMARY CATEGORY CLICK -', category);
    const currentPrimaries = eventCategories.selectedPrimaries;
    const currentExpanded = eventCategories.expandedPrimaries;

    if (currentPrimaries.includes(category)) {
      // If already selected, remove it and collapse
      onFiltersChange({
        ...filters,
        eventCategories: {
          ...eventCategories,
          selectedPrimaries: currentPrimaries.filter(c => c !== category),
          expandedPrimaries: currentExpanded.filter(c => c !== category),
          selectedSecondaries: Object.fromEntries(
            Object.entries(eventCategories.selectedSecondaries).filter(([key]) => key !== category)
          )
        }
      });
    } else {
      // If not selected, add it and expand
      onFiltersChange({
        ...filters,
        eventCategories: {
          ...eventCategories,
          selectedPrimaries: [...currentPrimaries, category],
          expandedPrimaries: [...currentExpanded, category]
        }
      });
    }
  };

  // Handle secondary category selection
  const handleSecondaryClick = (primary: string, secondary: string) => {
    console.log(`🎯 SECONDARY CATEGORY CLICK - Primary: ${primary} 🏷️ Secondary: ${secondary}`);
    const currentSecondaries = eventCategories.selectedSecondaries[primary] || [];
    console.log('📦 Current secondaries:', currentSecondaries);

    const isCurrentlySelected = currentSecondaries.includes(secondary);
    const newSecondaries = isCurrentlySelected
      ? currentSecondaries.filter(s => s !== secondary)
      : [...currentSecondaries, secondary];

    console.log(isCurrentlySelected ? '➖ REMOVING from selection' : '➕ ADDING to selection');
    console.log('📝 New secondaries after toggle:', newSecondaries);

    // If removing the last secondary, keep the primary but remove secondaries
    if (newSecondaries.length === 0 && isCurrentlySelected) {
      console.log('🔄 No secondaries left - keeping primary but removing secondaries');
      onFiltersChange({
        ...filters,
        eventCategories: {
          ...eventCategories,
          selectedSecondaries: Object.fromEntries(
            Object.entries(eventCategories.selectedSecondaries).filter(([key]) => key !== primary)
          )
        }
      });
      return;
    }

    // Ensure primary is in selectedPrimaries and expandedPrimaries when working with secondaries
    const primaryIsSelected = eventCategories.selectedPrimaries.includes(primary);
    const primaryIsExpanded = eventCategories.expandedPrimaries.includes(primary);

    const newFilters = {
      ...filters,
      eventCategories: {
        selectedPrimaries: primaryIsSelected
          ? eventCategories.selectedPrimaries
          : [...eventCategories.selectedPrimaries, primary],
        expandedPrimaries: primaryIsExpanded
          ? eventCategories.expandedPrimaries
          : [...eventCategories.expandedPrimaries, primary],
        selectedSecondaries: {
          ...eventCategories.selectedSecondaries,
          [primary]: newSecondaries
        }
      }
    };

    console.log('✅ NEW FILTER STATE (about to send):', JSON.stringify(newFilters, null, 2));
    onFiltersChange(newFilters);
  };

  // Render primary pill
  const renderPrimaryPill = (category: string) => {
    const isSelected = eventCategories.selectedPrimaries.includes(category);
    const isExpanded = eventCategories.expandedPrimaries.includes(category);
    const colorName = getCategoryColor(category);
    const hexColor = getHexColor(colorName);
    const displayName = getDisplayName(category);
    const count = getCategoryCount(category);

    return (
      <button
        key={`category-${category}`}
        onClick={() => handlePrimaryClick(category)}
        className={`
          px-2.5 py-1 text-xs font-medium rounded-full
          backdrop-blur-lg border-2
          transition-all duration-200 whitespace-nowrap flex-shrink-0
          ${isSelected
            ? 'text-white border-white/90 shadow-lg'
            : 'text-white/90 border-white/60 hover:border-white/80'
          }
        `}
        style={{
          backgroundColor: isSelected ? hexColor : `${hexColor}CC`
        }}
      >
        {displayName} ({count})
        {isExpanded && ' ↓'}
      </button>
    );
  };

  // Render secondary pill
  const renderSecondaryPill = (primary: string, secondary: string) => {
    const isSelected = eventCategories.selectedSecondaries[primary]?.includes(secondary) || false;
    const colorName = getCategoryColor(primary);
    const hexColor = getHexColor(colorName);

    return (
      <button
        key={`category-${primary}-${secondary}`}
        onClick={() => handleSecondaryClick(primary, secondary)}
        className={`
          px-2.5 py-1 text-xs font-medium rounded-full
          backdrop-blur-lg border-2
          transition-all duration-200 whitespace-nowrap flex-shrink-0
          ${isSelected
            ? 'text-white border-white shadow-lg scale-105'
            : 'text-white/70 border-white/30 hover:border-white/50 hover:text-white/90'
          }
        `}
        style={{
          backgroundColor: isSelected ? hexColor : `${hexColor}80`
        }}
      >
        {secondary}
      </button>
    );
  };

  // Get all expanded secondaries for display
  const getExpandedSecondaries = () => {
    const secondaries: Array<{ primary: string, secondary: string }> = [];

    eventCategories.expandedPrimaries.forEach(primary => {
      const subcategories = SECONDARY_CATEGORIES_MAP[primary] || [];
      subcategories.forEach(secondary => {
        secondaries.push({ primary, secondary });
      });
    });

    return secondaries;
  };

  const expandedSecondaries = getExpandedSecondaries();

  return (
    <>
      {/* Dark gradient overlay - starts from top of page */}
      <div className="fixed top-0 left-0 right-0 h-[200px] bg-gradient-to-b from-black/40 via-black/20 to-transparent pointer-events-none z-39" />

      {/* Pills container */}
      <div className="fixed top-[92px] left-0 right-0 z-40 px-4 pt-1 pb-1">
        {/* Primary Category Row */}
        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          {Object.keys(PRIMARY_CATEGORY_MAP).map(category =>
            renderPrimaryPill(category)
          )}
        </div>

        {/* Secondary Category Row - Animated */}
        <AnimatePresence>
          {expandedSecondaries.length > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className="overflow-hidden"
            >
              <div className="flex gap-1.5 overflow-x-auto scrollbar-hide pb-1 pt-1" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                {expandedSecondaries.map(({ primary, secondary }) =>
                  renderSecondaryPill(primary, secondary)
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
};

export default CategoryPills;
