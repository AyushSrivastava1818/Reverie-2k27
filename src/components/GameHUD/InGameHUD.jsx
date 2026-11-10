import React from 'react';
import { Sparkles, Trophy } from 'lucide-react';
import { achievementSystem } from '../../game/systems/AchievementSystem';

export function InGameHUD({ currentZone, coinCount, onOpenQuests }) {
  const formatCoins = (count) => {
    return String(count || 0).padStart(3, '0');
  };

  const questsCount = achievementSystem.getUnlockedCount ? achievementSystem.getUnlockedCount() : 0;

  return (
    <div className="absolute top-3 left-3 right-3 pointer-events-none z-40 flex items-center justify-between gap-2 select-none">
      
      {/* Current Zone Badge */}
      <div className="pointer-events-auto bg-[#100724]/95 border-2 border-cyan-400/80 px-3 sm:px-3.5 py-1.5 rounded-xl shadow-xl shadow-cyan-950/60 backdrop-blur-md flex items-center gap-1.5 sm:gap-2">
        <span className="font-display text-[11px] sm:text-xs text-cyan-300 font-extrabold uppercase tracking-wider">
          📍 {currentZone || 'Starting Kingdom'}
        </span>
      </div>

      {/* Right Controls: Quests Progress & Coin Counter */}
      <div className="flex items-center gap-2 pointer-events-auto">
        {/* Integrated Quests Status Pill */}
        {onOpenQuests && (
          <button
            onClick={onOpenQuests}
            className="bg-[#150a2e]/95 hover:bg-purple-900 border-2 border-purple-500/70 hover:border-yellow-400 px-2.5 sm:px-3 py-1.5 rounded-xl shadow-lg backdrop-blur-md flex items-center gap-1.5 transition-all cursor-pointer"
            title="View Quests & Achievements"
          >
            <Sparkles size={14} className="text-yellow-400" />
            <span className="font-display text-[10px] sm:text-xs text-purple-200 hover:text-white font-bold uppercase tracking-wider">
              QUESTS: {questsCount}/6
            </span>
          </button>
        )}

        {/* Live Coin Counter */}
        <div className="bg-[#1a0e36]/95 border-2 border-yellow-400 px-3 sm:px-3.5 py-1.5 rounded-xl shadow-xl shadow-yellow-500/20 backdrop-blur-md flex items-center gap-1.5 sm:gap-2">
          <img 
            src="/assets/sprites/coin.png" 
            alt="Coin" 
            className="w-4 h-4 sm:w-5 sm:h-5 object-contain image-rendering-pixelated animate-bounce"
            style={{ imageRendering: 'pixelated' }}
          />
          <span className="font-display text-xs sm:text-sm text-yellow-300 font-black tracking-wider">
            × {formatCoins(coinCount)}
          </span>
        </div>
      </div>
    </div>
  );
}
