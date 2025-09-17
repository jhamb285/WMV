'use client';

import React from 'react';
import { X, MapPin, Calendar, Clock } from 'lucide-react';

interface WelcomePopupProps {
  isOpen: boolean;
  onClose: () => void;
}

interface VenueTypeInfo {
  color: string;
  bgColor: string;
  icon: string;
  name: string;
  description: string;
  examples: string[];
}

const venueTypes: VenueTypeInfo[] = [
  {
    color: '#9333ea',
    bgColor: 'bg-purple-500',
    icon: '🍸',
    name: 'Bars & Lounges',
    description: 'Sophisticated cocktails and nightlife',
    examples: ['Cocktail bars', 'Rooftop lounges', 'Wine bars']
  },
  {
    color: '#3b82f6',
    bgColor: 'bg-blue-500',
    icon: '🏖️',
    name: 'Beach & Pool Clubs',
    description: 'Pool parties and beach vibes',
    examples: ['Beach clubs', 'Pool parties', 'Waterfront venues']
  },
  {
    color: '#10b981',
    bgColor: 'bg-green-500',
    icon: '🍽️',
    name: 'Restaurants & Cafes',
    description: 'Dining experiences and culinary delights',
    examples: ['Fine dining', 'Casual cafes', 'International cuisine']
  },
  {
    color: '#f59e0b',
    bgColor: 'bg-orange-500',
    icon: '🏈',
    name: 'Sports Bars & Pubs',
    description: 'Live sports and pub atmosphere',
    examples: ['Sports viewing', 'Pub games', 'Live matches']
  },
  {
    color: '#eab308',
    bgColor: 'bg-yellow-500',
    icon: '🏨',
    name: 'Hotels & Resorts',
    description: 'Luxury hotel venues and events',
    examples: ['Hotel bars', 'Resort events', 'Luxury venues']
  },
  {
    color: '#ef4444',
    bgColor: 'bg-red-500',
    icon: '🎉',
    name: 'Other Venues',
    description: 'Unique and specialty experiences',
    examples: ['Special events', 'Pop-ups', 'Unique venues']
  }
];

const WelcomePopup: React.FC<WelcomePopupProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop with blur */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Main popup with glassmorphism */}
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="glassmorphism-popup rounded-3xl p-8 shadow-2xl animate-popup-in">
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-6 right-6 w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-colors duration-200 flex items-center justify-center group"
          >
            <X className="w-5 h-5 text-white group-hover:text-gray-200 transition-colors" />
          </button>

          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-purple-500 to-blue-600 mb-6 shadow-lg">
              <MapPin className="w-10 h-10 text-white" />
            </div>

            <h1 className="text-4xl font-bold text-white mb-4 bg-gradient-to-r from-white via-purple-100 to-blue-100 bg-clip-text text-transparent">
              Welcome to Dubai Events
            </h1>

            <p className="text-xl text-gray-200 leading-relaxed">
              Your ultimate hub for discovering what&apos;s happening <strong>today</strong> across Dubai&apos;s vibrant nightlife and dining scene
            </p>
          </div>

          {/* What we cover */}
          <div className="mb-8">
            <div className="flex items-center justify-center mb-6">
              <div className="flex items-center space-x-2 bg-white/20 rounded-full px-4 py-2 backdrop-blur-sm">
                <Calendar className="w-5 h-5 text-white" />
                <span className="text-white font-semibold">Today&apos;s Events</span>
                <Clock className="w-5 h-5 text-white ml-2" />
              </div>
            </div>

            <p className="text-center text-gray-200 mb-6 text-lg">
              Discover live events at <strong>bars</strong>, <strong>restaurants</strong>, <strong>clubs</strong>, <strong>beach & pool parties</strong>, and <strong>sports venues</strong>
            </p>
          </div>

          {/* Color coding legend */}
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-white mb-6 text-center">
              🗺️ Map Color Guide
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {venueTypes.map((venue, index) => (
                <div
                  key={index}
                  className="flex items-center space-x-4 p-4 rounded-2xl bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-all duration-200 border border-white/20"
                >
                  {/* Color indicator */}
                  <div className="flex items-center space-x-3">
                    <div
                      className={`w-6 h-6 rounded-full ${venue.bgColor} shadow-lg border-2 border-white/30`}
                      style={{ backgroundColor: venue.color }}
                    />
                    <span className="text-2xl">{venue.icon}</span>
                  </div>

                  <div className="flex-1">
                    <h3 className="font-semibold text-white text-lg leading-tight">
                      {venue.name}
                    </h3>
                    <p className="text-gray-300 text-sm mt-1">
                      {venue.description}
                    </p>
                    <p className="text-gray-400 text-xs mt-2">
                      {venue.examples.join(' • ')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* How it works */}
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-white mb-4 text-center">
              🚀 How It Works
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 rounded-xl bg-white/10 backdrop-blur-sm">
                <div className="text-4xl mb-3">🗺️</div>
                <h3 className="font-semibold text-white mb-2">Explore the Map</h3>
                <p className="text-gray-300 text-sm">Browse colored markers to find venues by type</p>
              </div>

              <div className="text-center p-4 rounded-xl bg-white/10 backdrop-blur-sm">
                <div className="text-4xl mb-3">🎛️</div>
                <h3 className="font-semibold text-white mb-2">Apply Filters</h3>
                <p className="text-gray-300 text-sm">Filter by vibe, music genre, and offers</p>
              </div>

              <div className="text-center p-4 rounded-xl bg-white/10 backdrop-blur-sm">
                <div className="text-4xl mb-3">🎉</div>
                <h3 className="font-semibold text-white mb-2">Discover Events</h3>
                <p className="text-gray-300 text-sm">Click venues to see today&apos;s events and details</p>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="text-center">
            <button
              onClick={onClose}
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold rounded-full transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              <span>Start Exploring Dubai</span>
              <span className="ml-2 text-xl">🚀</span>
            </button>

            <p className="text-gray-400 text-sm mt-4">
              This popup won&apos;t show again during this session
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomePopup;