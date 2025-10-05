'use client';

import React from 'react';
import { MessageCircle, MapPin, Sparkles, Gift } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { DUBAI_AREAS, VIBE_OPTIONS, OFFER_OPTIONS } from '@/types';
import type { FilterState } from '@/types';

interface FloatingNavbarProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
}

const FloatingNavbar: React.FC<FloatingNavbarProps> = ({
  filters,
  onFiltersChange,
}) => {
  const handleAreaChange = (area: string) => {
    onFiltersChange({ ...filters, selectedAreas: [area] });
  };

  const toggleVibe = (vibe: string) => {
    const newVibes = filters.activeVibes.includes(vibe)
      ? filters.activeVibes.filter(v => v !== vibe)
      : [...filters.activeVibes, vibe];
    onFiltersChange({ ...filters, activeVibes: newVibes });
  };

  const toggleOffer = (offer: string) => {
    const newOffers = filters.activeOffers.includes(offer)
      ? filters.activeOffers.filter(o => o !== offer)
      : [...filters.activeOffers, offer];
    onFiltersChange({ ...filters, activeOffers: newOffers });
  };

  return (
    <div className="absolute top-2 sm:top-4 left-2 sm:left-4 z-50 w-[calc(100vw-16px)] sm:w-full max-w-xs sm:max-w-4xl">
      <div className="bg-black/90 backdrop-blur-md border border-gray-700 rounded-lg sm:rounded-xl shadow-2xl">
        <div className="flex items-center justify-between p-2 sm:p-3 space-x-2">
          <div className="flex items-center space-x-1">
            <MapPin className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-gray-400 hidden sm:block" />
            <span className="text-xs sm:text-sm font-medium text-gray-300 hidden sm:block">Area:</span>
            <Select value={filters.selectedAreas[0] || 'All Dubai'} onValueChange={handleAreaChange}>
              <SelectTrigger className="w-24 sm:w-32 h-8 bg-gray-800 border-gray-600 text-white focus:bg-gray-700 focus:border-yellow-500 text-xs sm:text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-600">
                <SelectItem value="All Dubai" className="text-white hover:bg-gray-700">All Dubai</SelectItem>
                {DUBAI_AREAS.map((area) => (
                  <SelectItem key={area.name} value={area.name} className="text-white hover:bg-gray-700">
                    {area.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center space-x-1">
            <Sparkles className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-gray-400 hidden sm:block" />
            <span className="text-xs sm:text-sm font-medium text-gray-300 hidden sm:block">Vibes</span>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="h-8 px-2 sm:px-3 bg-gray-800 border-gray-600 text-white hover:bg-gray-700 hover:border-yellow-500">
                  <span className="text-xs sm:text-sm">
                    {filters.activeVibes.length > 0 ? `${filters.activeVibes.length}` : 'Any'}
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-48 bg-gray-800 border-gray-600">
                {VIBE_OPTIONS.map((vibe) => (
                  <DropdownMenuCheckboxItem
                    key={vibe}
                    checked={filters.activeVibes.includes(vibe)}
                    onCheckedChange={() => toggleVibe(vibe)}
                    className="text-white hover:bg-gray-700"
                  >
                    {vibe}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="flex items-center space-x-1">
            <Gift className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-gray-400 hidden sm:block" />
            <span className="text-xs sm:text-sm font-medium text-gray-300 hidden sm:block">Offers</span>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="h-8 px-2 sm:px-3 bg-gray-800 border-gray-600 text-white hover:bg-gray-700 hover:border-yellow-500">
                  <span className="text-xs sm:text-sm">
                    {filters.activeOffers.length > 0 ? `${filters.activeOffers.length}` : 'Any'}
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-48 bg-gray-800 border-gray-600">
                {OFFER_OPTIONS.map((offer) => (
                  <DropdownMenuCheckboxItem
                    key={offer}
                    checked={filters.activeOffers.includes(offer)}
                    onCheckedChange={() => toggleOffer(offer)}
                    className="text-white hover:bg-gray-700"
                  >
                    {offer}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="flex items-center">
            <Button 
              variant="outline" 
              className="h-8 px-2 sm:px-3 bg-gray-800 border-gray-600 text-white hover:bg-gray-700 hover:border-yellow-500"
              onClick={() => {
                // TODO: Open AI chat
              }}
            >
              <MessageCircle className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1" />
              <span className="text-xs sm:text-sm">AI</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FloatingNavbar;