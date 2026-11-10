import React, { useEffect } from 'react';
import { Trophy, Award, Sparkles, ExternalLink, ArrowRight, RotateCcw, Share2, Castle, CheckCircle2 } from 'lucide-react';
import { soundEngine } from '../../game/systems/SoundEngine';
import { achievementSystem } from '../../game/systems/AchievementSystem';
import confetti from 'canvas-confetti';

export function VictoryStageClear({ onRestartQuest, onEnterWorld, onOpenDirectory }) {
  useEffect(() => {
    soundEngine.playFanfare();
    achievementSystem.recordStageClear();

    // Trigger double celebratory confetti salvo
    try {
      confetti({
        particleCount: 100,
        spread: 100,
        origin: { y: 0.4 },
        colors: ['#f43f5e', '#06b6d4', '#eab308', '#a855f7', '#10b981']
      });

      setTimeout(() => {
        confetti({
          particleCount: 80,
          spread: 120,
          origin: { y: 0.3 },
          colors: ['#fbbf24', '#f472b6', '#38bdf8']
        });
      }, 600);
    } catch (e) {}
  }, []);

  return (
    <div className="relative w-full h-full flex flex-col justify-between p-3 sm:p-5 bg-gradient-to-b from-[#110526] via-[#1a083a] to-[#090215] text-white select-none overflow-y-auto">
      
      {/* Top Banner (Matching Reference 22.11.18 (2).jpeg) */}
      <div className="flex items-center justify-between gap-2 px-3 py-1.5 rounded-xl bg-[#250d4d] border border-yellow-400/80 shadow-[0_0_20px_rgba(250,204,21,0.4)]">
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 rounded-md bg-yellow-400 text-black font-display text-[10px] font-black tracking-widest">
            STAGE 05
          </span>
          <h2 className="font-display text-xs sm:text-sm font-black text-yellow-300 tracking-wider">
            ALL STAGES CLEARED • FESTIVAL ACCESS GRANTED
          </h2>
        </div>
        <div className="flex items-center gap-1 text-emerald-400 text-xs font-mono font-bold">
          <CheckCircle2 size={14} />
          <span>QUEST 100% COMPLETE</span>
        </div>
      </div>

      {/* Centerpiece: Pixel Castle & Flagpole Celebration */}
      <div className="flex-1 my-3 flex flex-col items-center justify-center max-w-2xl mx-auto w-full text-center">
        
        {/* Flagpole & Castle Stage Art */}
        <div className="relative w-64 h-44 sm:h-52 flex items-end justify-center mb-2">
          
          {/* Distant celebratory fireworks */}
          <div className="absolute top-2 left-6 text-2xl animate-ping opacity-80">✨</div>
          <div className="absolute top-6 right-8 text-2xl animate-ping opacity-80" style={{ animationDelay: '300ms' }}>🎆</div>
          <div className="absolute top-1 left-32 text-xl animate-bounce text-yellow-300">⭐</div>

          {/* Castle */}
          <div className="relative z-10 w-44 h-36 bg-gradient-to-b from-[#2e145f] via-[#210d47] to-[#120629] border-2 border-yellow-400/80 rounded-t-2xl shadow-[0_0_30px_rgba(250,204,21,0.5)] flex flex-col items-center justify-between p-2">
            {/* Castle Battlements */}
            <div className="flex items-center gap-2 -mt-4">
              <div className="w-5 h-4 bg-yellow-400 border border-amber-500 rounded-t-sm" />
              <div className="w-5 h-4 bg-yellow-400 border border-amber-500 rounded-t-sm" />
              <div className="w-5 h-4 bg-yellow-400 border border-amber-500 rounded-t-sm" />
            </div>

            {/* Castle Flag with Reverie 2K27 */}
            <div className="flex flex-col items-center">
              <span className="text-[10px] font-mono font-bold text-yellow-300">🏰 REVERIE</span>
              <span className="text-[8px] font-mono text-purple-300">2K27 PIXELVERSE</span>
            </div>

            {/* Castle Arched Gate */}
            <div className="w-14 h-16 rounded-t-full bg-black border-2 border-purple-500 flex items-center justify-center">
              <span className="text-xl animate-pulse">👑</span>
            </div>
          </div>

          {/* Flagpole on the Right */}
          <div className="relative z-20 w-1.5 h-44 bg-zinc-400 -ml-2 rounded-t-full flex flex-col justify-between items-center">
            {/* Golden Flagpole Ball */}
            <div className="w-4 h-4 rounded-full bg-yellow-400 border border-amber-300 shadow-[0_0_10px_#facc15] -mt-2 shrink-0" />
            
            {/* Reverie Flag sliding down */}
            <div className="absolute top-8 left-1.5 px-2 py-0.5 bg-pink-500 text-white font-mono text-[8px] font-black rounded-r shadow-md">
              CLEAR!
            </div>

            {/* Mario at the bottom */}
            <div className="text-3xl filter drop-shadow -mb-1 transform scale-x-[-1]">
              🧑‍🔧
            </div>
          </div>
        </div>

        {/* Victory Headline */}
        <h3 className="font-display text-lg sm:text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-pink-400 to-cyan-300 tracking-wider mb-1">
          CONGRATULATIONS, CHAMPION!
        </h3>
        
        <p className="text-xs sm:text-sm text-purple-200/90 max-w-md mx-auto mb-3">
          You have conquered all stages of the Retro Arcade Festival Quest! Your VIP pass to IIIT Kota's REVERIE 2K27 is officially authorized.
        </p>

        {/* Quest Rewards Summary Card */}
        <div className="grid grid-cols-3 gap-2 w-full max-w-md p-2.5 rounded-xl bg-[#240e4e]/90 border border-yellow-400/60 shadow-lg mb-2">
          <div className="flex flex-col items-center">
            <span className="text-[8px] font-mono text-purple-300 uppercase font-bold">STAGES</span>
            <span className="font-display text-base font-black text-emerald-400">5 / 5</span>
          </div>
          <div className="flex flex-col items-center border-x border-purple-700">
            <span className="text-[8px] font-mono text-purple-300 uppercase font-bold">QUEST SCORE</span>
            <span className="font-display text-base font-black text-yellow-300">12,500</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-[8px] font-mono text-purple-300 uppercase font-bold">STATUS</span>
            <span className="font-display text-xs font-black text-cyan-300 mt-1">VIP UNLOCKED</span>
          </div>
        </div>
      </div>

      {/* Action CTA Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-2 max-w-xl mx-auto w-full">
        <a
          href="https://unstop.com"
          target="_blank"
          rel="noreferrer"
          className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-pink-500 via-rose-500 to-pink-600 text-white font-display text-xs font-black tracking-widest uppercase border-2 border-pink-200 shadow-[0_4px_0_#831843,0_0_20px_rgba(244,63,94,0.6)] hover:scale-105 active:scale-95 cursor-pointer flex items-center justify-center gap-1.5"
        >
          <span>REGISTER ON UNSTOP</span>
          <ExternalLink size={14} />
        </a>

        <button
          onClick={onOpenDirectory}
          className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-display text-xs font-black tracking-widest uppercase border border-cyan-300 shadow hover:scale-105 active:scale-95 cursor-pointer flex items-center justify-center gap-1.5"
        >
          <span>VIEW 18 EVENTS</span>
          <ArrowRight size={14} />
        </button>

        <button
          onClick={onRestartQuest}
          className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-purple-900/80 hover:bg-purple-800 text-purple-200 font-display text-xs font-bold border border-purple-500 cursor-pointer flex items-center justify-center gap-1"
        >
          <RotateCcw size={14} />
          <span>REPLAY QUEST</span>
        </button>
      </div>
    </div>
  );
}
