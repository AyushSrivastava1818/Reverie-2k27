import React, { useState, useEffect } from 'react';
import { Award, Sparkles, X } from 'lucide-react';
import { eventBus } from '../../game/EventBus';
import confetti from 'canvas-confetti';

export function AchievementToast() {
  const [activeAchievement, setActiveAchievement] = useState(null);

  useEffect(() => {
    const unbind = eventBus.on('achievement-unlocked', (ach) => {
      setActiveAchievement(ach);

      try {
        confetti({
          particleCount: 45,
          spread: 60,
          origin: { y: 0.15 },
          colors: ['#fbbf24', '#f59e0b', '#ec4899', '#06b6d4', '#ffffff']
        });
      } catch (e) {}

      const timer = setTimeout(() => {
        setActiveAchievement(null);
      }, 4500);

      return () => clearTimeout(timer);
    });

    return () => unbind();
  }, []);

  if (!activeAchievement) return null;

  return (
    <div className="fixed top-20 sm:top-24 left-1/2 -translate-x-1/2 z-60 pointer-events-auto animate-bounceIn select-none max-w-sm w-[92vw]">
      <div className="bg-[#100726]/98 border-2 border-yellow-400 p-4 rounded-2xl shadow-2xl shadow-yellow-500/30 flex items-center gap-3.5 backdrop-blur-xl">
        <div className="w-12 h-12 rounded-xl bg-yellow-950/80 border border-yellow-500/60 flex items-center justify-center text-2xl shrink-0">
          {activeAchievement.icon || '🏆'}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 text-[10px] font-display text-yellow-400 font-extrabold uppercase tracking-widest">
            <Sparkles size={12} className="animate-spin" />
            <span>ACHIEVEMENT UNLOCKED!</span>
          </div>
          <h4 className="font-display text-base font-black text-white uppercase truncate tracking-wide">
            {activeAchievement.title}
          </h4>
          <p className="font-body text-xs text-purple-200 font-medium truncate">
            Reward: <span className="text-yellow-300 font-bold">{activeAchievement.reward}</span>
          </p>
        </div>

        <button
          onClick={() => setActiveAchievement(null)}
          className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
}

