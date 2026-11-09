import React from 'react';

export function InGameHUD({ currentZone, coinCount }) {
  const formatCoins = (count) => {
    return String(count || 0).padStart(3, '0');
  };

  return (
    <div className="absolute top-3 left-3 right-3 pointer-events-none z-40 flex items-center justify-between gap-2 select-none">
      {/* Current Zone Badge */}
      <div className="pointer-events-auto bg-[#100724]/95 border-2 border-cyan-400/80 px-3 sm:px-3.5 py-1.5 rounded-xl shadow-xl shadow-cyan-950/60 backdrop-blur-md flex items-center gap-1.5 sm:gap-2">
        <span className="font-display text-[11px] sm:text-sm text-cyan-300 font-extrabold uppercase tracking-wider">
          📍 {currentZone || 'Starting Kingdom'}
        </span>
      </div>

      {/* Coin Counter */}
      <div className="pointer-events-auto bg-[#1a0e36]/95 border-2 border-yellow-400 px-3 sm:px-4 py-1.5 rounded-xl shadow-xl shadow-yellow-500/20 backdrop-blur-md flex items-center gap-2">
        <img 
          src="/assets/sprites/coin.png" 
          alt="Coin" 
          className="w-5 h-5 sm:w-6 sm:h-6 object-contain image-rendering-pixelated animate-bounce"
          style={{ imageRendering: 'pixelated' }}
        />
        <span className="font-display text-xs sm:text-base text-yellow-300 font-black tracking-wider">
          × {formatCoins(coinCount)}
        </span>
      </div>
    </div>
  );
}
