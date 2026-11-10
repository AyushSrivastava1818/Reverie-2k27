import React, { useEffect } from 'react';
import { soundEngine } from '../../game/systems/SoundEngine';
import confetti from 'canvas-confetti';

export function VictoryStageClear({ onRestartQuest, onEnterWorld, onOpenDirectory, onClose, onBackToMap }) {
  useEffect(() => {
    soundEngine.playFanfare();
    try {
      confetti({
        particleCount: 150,
        spread: 120,
        origin: { y: 0.35 },
        colors: ['#ef4444', '#3b82f6', '#facc15', '#10b981', '#ec4899', '#a855f7']
      });
    } catch (e) {}
  }, []);

  return (
    <div className="relative w-full h-full flex flex-col justify-between p-3 sm:p-5 bg-gradient-to-b from-[#090518] via-[#0d0722] to-[#05020c] font-pixel text-white select-none overflow-y-auto">
      
      {/* ------------------------------------------------------------- */}
      {/* HEADER: STAGES CLEARED! SPONSORS REVEALED! (Ref: 22.11.16.jpeg)*/}
      {/* ------------------------------------------------------------- */}
      <div className="flex flex-col items-center text-center pt-1 pb-2 shrink-0">
        <h1 className="font-pixel text-3xl sm:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-rose-400 to-cyan-400 tracking-wider drop-shadow-[0_0_20px_rgba(244,63,94,0.9)]">
          STAGES CLEARED!
        </h1>
        <span className="font-pixel text-xs sm:text-base text-yellow-300 tracking-widest uppercase mt-1 font-black drop-shadow">
          SPONSORS REVEALED!
        </span>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* MAIN VIEW: SPONSOR FLAGPOLES (LEFT) & OUR SPONSORS CASTLE (RIGHT)*/}
      {/* ------------------------------------------------------------- */}
      <div className="flex-1 my-auto grid grid-cols-1 md:grid-cols-12 gap-5 max-w-5xl mx-auto w-full items-stretch py-2">
        
        {/* Left Box: SPONSOR FLAGPOLES with Mario Sliding Down */}
        <div className="md:col-span-5 p-4 sm:p-5 rounded-2xl bg-[#140b2a] border-3 border-cyan-500/80 shadow-[0_0_25px_rgba(6,182,212,0.4)] flex flex-col justify-between">
          <div className="w-full text-center pb-2 border-b-2 border-purple-800">
            <span className="font-pixel text-xs sm:text-sm text-white font-black tracking-wider uppercase">
              SPONSOR FLAGPOLES
            </span>
          </div>

          {/* Flagpole Centerpiece */}
          <div className="relative flex-1 my-4 flex items-center justify-center">
            {/* Green Flagpole */}
            <div className="relative w-5 h-72 sm:h-80 bg-gradient-to-r from-emerald-500 via-green-400 to-emerald-700 rounded-t-full border-2 border-emerald-300 flex flex-col justify-between items-center shadow-[0_0_15px_rgba(16,185,129,0.5)]">
              {/* Golden Super Star on Top */}
              <div className="w-12 h-12 -mt-7 text-3xl flex items-center justify-center animate-spin" style={{ animationDuration: '6s' }}>
                ⭐
              </div>

              {/* Platinum Tier Marker */}
              <div className="absolute top-16 -left-28 flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-white text-black text-[8px] font-black shadow">LG</span>
                <span className="text-[10px] font-pixel text-slate-300 font-black">PLATINUM</span>
                <span className="text-[10px] font-pixel text-cyan-300">+5000</span>
              </div>

              {/* Sliding Pixel Mario with Sparkles on Flagpole */}
              <div className="absolute top-24 -left-7 flex items-center">
                <svg width="40" height="48" viewBox="0 0 24 30" className="filter drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
                  <rect x="6" y="2" width="12" height="4" fill="#dc2626" />
                  <rect x="4" y="4" width="16" height="3" fill="#dc2626" />
                  <rect x="6" y="7" width="10" height="5" fill="#fde047" />
                  <rect x="14" y="8" width="4" height="3" fill="#fde047" />
                  <rect x="12" y="8" width="2" height="2" fill="#000000" />
                  <rect x="6" y="9" width="3" height="4" fill="#582c03" />
                  <rect x="11" y="10" width="7" height="2" fill="#582c03" />
                  <rect x="7" y="13" width="10" height="6" fill="#dc2626" />
                  <rect x="8" y="15" width="8" height="7" fill="#2563eb" />
                  <rect x="2" y="22" width="6" height="4" rx="1.5" fill="#582c03" />
                  <rect x="14" y="22" width="6" height="4" rx="1.5" fill="#582c03" />
                </svg>
                <span className="text-yellow-300 text-base animate-ping ml-1">✨</span>
              </div>

              {/* Gold Tier Marker */}
              <div className="absolute top-44 -left-24 flex items-center gap-2">
                <span className="text-[10px] font-pixel text-amber-300 font-black">GOLD</span>
                <span className="text-[10px] font-pixel text-yellow-300">+2000</span>
              </div>

              {/* Silver Tier Marker */}
              <div className="absolute top-64 -left-24 flex items-center gap-2">
                <span className="text-[10px] font-pixel text-slate-400 font-black">SILVER</span>
                <span className="text-[10px] font-pixel text-slate-300">+1000</span>
              </div>

              {/* Base block */}
              <div className="w-16 h-6 bg-emerald-800 rounded-sm border-2 border-emerald-400 shadow" />
            </div>
          </div>
        </div>

        {/* Right Box: OUR SPONSORS / CASTLE + BONUS ITEMS */}
        <div className="md:col-span-7 p-4 sm:p-5 rounded-2xl bg-[#140b2a] border-3 border-cyan-500/80 shadow-[0_0_25px_rgba(6,182,212,0.4)] flex flex-col justify-between">
          <div className="w-full text-center pb-2 border-b-2 border-purple-800">
            <span className="font-pixel text-xs sm:text-sm text-white font-black tracking-wider uppercase">
              OUR SPONSORS / CASTLE
            </span>
          </div>

          {/* Castle with Sponsor Flags & Speech Bubble */}
          <div className="relative my-3 flex items-center justify-center">
            {/* Pixel Castle Fortress */}
            <div className="w-72 sm:w-96 h-44 sm:h-52 bg-[#94a3b8] border-3 border-zinc-700 rounded-t-xl flex flex-col justify-between p-3 relative shadow-2xl">
              {/* Flags flying on towers with Sponsor Badges */}
              <div className="absolute -top-8 left-4 right-4 flex items-center justify-between">
                <div className="flex items-center gap-1">
                  <span className="text-lg animate-pulse">🚩</span>
                  <span className="px-1.5 py-0.5 rounded bg-white text-black text-[7px] font-bold border shadow">GOOGLE</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-lg animate-pulse">🚩</span>
                  <span className="px-1.5 py-0.5 rounded bg-white text-black text-[7px] font-bold border shadow">REPLIT</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-lg animate-pulse">🚩</span>
                  <span className="px-1.5 py-0.5 rounded bg-white text-black text-[7px] font-bold border shadow">SOLANA</span>
                </div>
              </div>

              {/* Title Sponsor Plaque on Castle Front */}
              <div className="self-center mt-2 px-5 py-1.5 bg-white rounded-lg border-2 border-black text-black text-xs font-pixel font-black shadow-md">
                ★ REVERIE 2K27 CASTLE ★
              </div>

              {/* Castle Wooden Portcullis Gate */}
              <div className="self-center w-20 h-22 bg-[#451a03] border-t-3 border-x-3 border-zinc-900 rounded-t-full shadow-inner flex items-center justify-center">
                <span className="text-xs">🚪</span>
              </div>
            </div>

            {/* Authentic Pixel Toad / Mascot on the Right with Speech Bubble */}
            <div className="absolute right-2 bottom-1 flex flex-col items-center">
              <div className="px-3 py-1 bg-white text-black text-[8px] sm:text-[9px] font-pixel font-black rounded-lg shadow-lg mb-1 border border-zinc-300">
                THANK YOU, SPONSORS!
              </div>
              <svg width="40" height="46" viewBox="0 0 24 28" className="filter drop-shadow animate-bounce">
                <ellipse cx="12" cy="9" rx="11" ry="8" fill="#ffffff" stroke="#e2e8f0" strokeWidth="1" />
                <circle cx="12" cy="7" r="3.5" fill="#dc2626" />
                <circle cx="4" cy="10" r="2.5" fill="#dc2626" />
                <circle cx="20" cy="10" r="2.5" fill="#dc2626" />
                <ellipse cx="12" cy="16" rx="6" ry="4" fill="#fde047" />
                <rect x="9" y="15" width="1.5" height="2.5" fill="#000" />
                <rect x="13.5" y="15" width="1.5" height="2.5" fill="#000" />
                <rect x="7" y="20" width="10" height="6" rx="2" fill="#2563eb" />
                <rect x="10" y="20" width="4" height="6" fill="#facc15" />
                <rect x="6" y="25" width="4" height="3" rx="1" fill="#78350f" />
                <rect x="14" y="25" width="4" height="3" rx="1" fill="#78350f" />
              </svg>
            </div>
          </div>

          {/* BONUS ITEMS: 8 Item Slots (Ref: 22.11.16.jpeg) */}
          <div className="pt-3 border-t-2 border-purple-800">
            <span className="text-[10px] font-pixel text-yellow-300 block text-center mb-2 font-bold">
              BONUS ITEMS UNLOCKED:
            </span>
            <div className="grid grid-cols-4 sm:grid-cols-8 gap-2.5">
              {[
                { icon: '🪙', label: 'COIN' },
                { icon: '⭐', label: 'STAR' },
                { icon: '🍄', label: 'POWER' },
                { icon: '🍄', label: '1UP' },
                { icon: '🎟️', label: 'VIP PASS' },
                { icon: '🏆', label: 'TROPHY' },
                { icon: '🎮', label: 'ARCADE' },
                { icon: '👑', label: 'ROYALTY' }
              ].map((item, i) => (
                <div key={i} className="p-2 rounded-xl bg-[#090314] border-2 border-cyan-400/70 flex flex-col items-center justify-center shadow">
                  <span className="text-xl">{item.icon}</span>
                  <span className="text-[7px] font-pixel text-slate-300 mt-1 truncate">{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* BOTTOM CONSOLE: METAL FINISH, PREV, SCORES, CONTINUE          */}
      {/* ------------------------------------------------------------- */}
      <div className="flex items-center justify-between pt-3 border-t-2 border-purple-900/60 mt-1 shrink-0">
        <div className="flex items-center gap-3">
          <span className="text-[9px] sm:text-[10px] font-pixel text-red-500 font-black">
            SPONSORS ACTIVE
          </span>
          <span className="text-[9px] sm:text-[10px] font-pixel text-yellow-300 font-black">
            VISIT STAGES
          </span>
        </div>

        <div className="flex items-center gap-3">
          {onBackToMap && (
            <button
              onClick={onBackToMap}
              className="px-4 py-2.5 rounded-xl bg-purple-950 hover:bg-purple-900 border-2 border-purple-400 text-yellow-300 font-pixel text-xs font-black uppercase shadow cursor-pointer active:translate-y-1"
            >
              ← WORLD MAP
            </button>
          )}

          <button
            onClick={onRestartQuest}
            className="px-5 py-2.5 rounded-xl bg-[#3f3f46] hover:bg-[#52525b] border-2 border-zinc-400 text-white font-pixel text-xs font-black uppercase shadow cursor-pointer active:translate-y-1"
          >
            PREV
          </button>

          <button
            onClick={onOpenDirectory}
            className="px-7 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 via-green-500 to-emerald-600 border-2 border-white text-black font-pixel text-xs font-black uppercase tracking-wider shadow-[0_4px_0_#065f46] hover:scale-105 active:translate-y-1 cursor-pointer"
          >
            CONTINUE
          </button>
        </div>
      </div>
    </div>
  );
}
