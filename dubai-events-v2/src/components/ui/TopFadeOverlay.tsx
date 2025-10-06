'use client';

import React from 'react';

const TopFadeOverlay: React.FC = () => {
  return (
    <div className="fixed top-0 left-0 right-0 h-[10vh] z-30 pointer-events-none">
      <div className="w-full h-full bg-gradient-to-b from-black/40 via-black/20 to-transparent" />
    </div>
  );
};

export default TopFadeOverlay;