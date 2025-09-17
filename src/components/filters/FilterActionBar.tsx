'use client';

import React from 'react';

interface FilterActionBarProps {
  onCancel: () => void;
  onApply: () => void;
  hasUnsavedChanges: boolean;
  selectedCount: number;
}

const FilterActionBar: React.FC<FilterActionBarProps> = ({
  onCancel,
  onApply,
  hasUnsavedChanges,
  selectedCount
}) => {
  return (
    <div className="px-6 py-3 pb-8 border-t border-white/10 bg-black/50 backdrop-blur-sm">
      <div className="flex items-center justify-between space-x-3">
        {/* Cancel Button */}
        <button
          onClick={onCancel}
          className="flex-1 py-2.5 px-5 bg-white/15 text-white font-geist font-medium text-sm rounded-xl hover:bg-white/20"
        >
          Cancel
        </button>

        {/* Apply Button */}
        <button
          onClick={onApply}
          className={`flex-1 py-2.5 px-5 font-geist font-medium text-sm rounded-xl ${
            hasUnsavedChanges
              ? 'bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white'
              : 'bg-amber-600 hover:bg-amber-700 text-white'
          }`}
          disabled={!hasUnsavedChanges && selectedCount === 0}
        >
          <span className="flex items-center justify-center space-x-2">
            <span>Apply</span>
            {selectedCount > 0 && (
              <span className="px-2 py-0.5 bg-white/20 rounded-full text-sm font-semibold">
                {selectedCount}
              </span>
            )}
          </span>

        </button>
      </div>

    </div>
  );
};

export default FilterActionBar;