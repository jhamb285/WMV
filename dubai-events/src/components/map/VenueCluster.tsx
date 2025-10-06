'use client';

import React from 'react';
import type { VenueCluster } from '@/types';
import { venueClusterer } from '@/lib/venue-clustering';

interface VenueClusterProps {
  cluster: VenueCluster;
  hasActiveStories: boolean;
  onClick: () => void;
  onHover?: (hovered: boolean) => void;
}

const VenueClusterComponent: React.FC<VenueClusterProps> = ({
  cluster,
  hasActiveStories,
  onClick,
  onHover
}) => {
  const clusterIcon = venueClusterer.getClusterIcon(cluster, hasActiveStories);

  return (
    <div
      className="relative cursor-pointer transform transition-all duration-200 hover:scale-110"
      onClick={onClick}
      onMouseEnter={() => onHover?.(true)}
      onMouseLeave={() => onHover?.(false)}
    >
      {/* Main Cluster */}
      <div
        className={`
          ${clusterIcon.size}
          ${clusterIcon.backgroundColor}
          ${clusterIcon.borderColor}
          ${clusterIcon.textColor}
          rounded-full border-2 shadow-lg
          flex items-center justify-center
          font-bold
          ${hasActiveStories ? 'ring-2 ring-destructive animate-pulse' : ''}
        `}
      >
        {/* Activity Indicator */}
        {clusterIcon.hasActivity && (
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-destructive rounded-full border border-background animate-pulse" />
        )}
        
        {/* Cluster Count */}
        {clusterIcon.label}
      </div>

      {/* Hover Tooltip */}
      {onHover && (
        <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 opacity-0 hover:opacity-100 transition-opacity duration-200 pointer-events-none">
          <div className="bg-popover/95 backdrop-blur-sm text-popover-foreground px-3 py-2 rounded text-xs whitespace-nowrap shadow-lg border border-border">
            <div className="font-medium">{cluster.count} venues</div>
            <div className="text-muted-foreground">
              {cluster.venues.map(v => v.category).filter((c, i, arr) => arr.indexOf(c) === i).join(', ')}
            </div>
            {hasActiveStories && (
              <div className="text-destructive font-medium">● Live events</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default VenueClusterComponent;