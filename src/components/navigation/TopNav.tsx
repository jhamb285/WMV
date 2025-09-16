'use client';

import React from 'react';
import Image from 'next/image';

const TopNav: React.FC = () => {
  return (
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50">
      <div className="bg-black/20 backdrop-blur-lg rounded-full px-6 py-3 shadow-lg border border-white/10">
        <div className="flex flex-col items-center justify-center">
          <Image 
            src="/logo_clean.svg" 
            alt="WMV Logo" 
            width={144}
            height={72}
            className="w-36 h-18 object-contain"
          />
          <span className="text-white text-xs font-bold -mt-1" style={{ fontFamily: 'Courier New, monospace' }}>Where&apos;s My Vibe?</span>
        </div>
      </div>
    </div>
  );
};

export default TopNav;