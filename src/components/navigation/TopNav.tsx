'use client';

import React from 'react';
import Image from 'next/image';

interface TopNavProps {
  navButtons?: React.ReactNode;
}

const TopNav: React.FC<TopNavProps> = ({ navButtons }) => {
  return (
    <div className="fixed top-4 left-4 right-4 z-50">
      <div className="bg-white/60 backdrop-blur-xl rounded-full px-4 py-2 shadow-xl border border-white/60 flex items-center justify-between
                     before:absolute before:inset-0 before:bg-gradient-to-br before:from-white/40 before:to-white/20 before:pointer-events-none before:rounded-full
                     after:absolute after:inset-0 after:bg-gradient-to-t after:from-transparent after:via-white/10 after:to-white/20 after:pointer-events-none after:rounded-full
                     relative">
        <Image
          src="/logo_clean.svg"
          alt="WMV Logo"
          width={64}
          height={32}
          className="w-16 h-8 object-contain opacity-50"
        />
        {navButtons && (
          <div className="flex items-center gap-2">
            {navButtons}
          </div>
        )}
      </div>
    </div>
  );
};

export default TopNav;