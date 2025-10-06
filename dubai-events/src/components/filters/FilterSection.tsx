'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronUp, ChevronDown } from 'lucide-react';
import PillButton from './PillButton';

interface FilterSectionConfig {
  id: string;
  title: string;
  type: 'pills' | 'range' | 'collapsible';
  isCollapsible: boolean;
  isExpanded: boolean;
  options: string[];
  selectedValues: string[];
}

interface FilterSectionProps {
  section: FilterSectionConfig;
  onToggle: () => void;
  onSelectionChange: (selectedValues: string[]) => void;
}

const FilterSection: React.FC<FilterSectionProps> = ({
  section,
  onToggle,
  onSelectionChange
}) => {
  const handlePillClick = (option: string) => {
    const { selectedValues, id } = section;

    // Special handling for areas - "All Dubai" logic
    if (id === 'selectedAreas') {
      if (option === 'All Dubai') {
        onSelectionChange(['All Dubai']);
      } else {
        const currentAreas = selectedValues.filter(a => a !== 'All Dubai');
        const newAreas = currentAreas.includes(option)
          ? currentAreas.filter(a => a !== option)
          : [...currentAreas, option];

        // If no specific areas selected, default to "All Dubai"
        const finalAreas = newAreas.length === 0 ? ['All Dubai'] : newAreas;
        onSelectionChange(finalAreas);
      }
    } else {
      // Standard multi-select behavior for other filters
      const newSelection = selectedValues.includes(option)
        ? selectedValues.filter(v => v !== option)
        : [...selectedValues, option];
      onSelectionChange(newSelection);
    }
  };

  const getVariantForSection = (sectionId: string) => {
    switch (sectionId) {
      case 'selectedAreas':
        return 'area';
      case 'activeVibes':
        return 'vibe';
      case 'activeGenres':
        return 'genre';
      case 'activeDates':
        return 'date';
      default:
        return 'default';
    }
  };

  const selectedCount = section.selectedValues.filter(v => v !== 'All Dubai').length;

  return (
    <div className={`filter-section ${section.isExpanded ? 'col-span-2' : ''}`}>
      {/* Section Header */}
      <div className="flex items-center justify-between mb-1.5 min-h-[28px]">
        <div className="flex items-center space-x-1.5">
          <h3 className="font-geist text-sm font-semibold text-white">
            {section.title}
          </h3>
          {selectedCount > 0 && (
            <span className="px-1.5 py-0.5 text-sm font-medium bg-white/20 text-white/90 rounded-full">
              {selectedCount}
            </span>
          )}
        </div>

        {section.isCollapsible && (
          <button
            onClick={onToggle}
            className="flex items-center justify-center p-0.5 rounded-md hover:bg-white/10"
            aria-label={section.isExpanded ? 'Collapse section' : 'Expand section'}
          >
            {section.isExpanded ? (
              <ChevronUp className="w-3.5 h-3.5 text-white/80" />
            ) : (
              <ChevronDown className="w-3.5 h-3.5 text-white/80" />
            )}
          </button>
        )}
      </div>

      {/* Section Content */}
      <AnimatePresence initial={false}>
        {(!section.isCollapsible || section.isExpanded) && (
          <motion.div
            initial={section.isCollapsible ? { opacity: 0, height: 0 } : false}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{
              duration: 0.2,
              ease: 'easeOut'
            }}
            className="overflow-hidden"
          >
            <div className="flex flex-wrap gap-1.5">
              {section.options.map((option) => (
                <PillButton
                  key={option}
                  label={option}
                  isSelected={section.selectedValues.includes(option)}
                  onClick={() => handlePillClick(option)}
                  variant={getVariantForSection(section.id)}
                  size="sm"
                />
              ))}
            </div>

            {/* Show helpful text for empty selections */}
            {section.options.length === 0 && (
              <div className="text-center py-4">
                <p className="font-geist text-sm text-white/60">
                  No {section.title.toLowerCase()} available
                </p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FilterSection;