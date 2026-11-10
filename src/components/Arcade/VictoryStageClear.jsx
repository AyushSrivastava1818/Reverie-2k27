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

          {/* Authentic 16-Bit Pixel Castle Fortress with Turrets & Sponsor Banners */}
          <div className="relative my-3 flex items-center justify-center">
            
            {/* The Grand Retro Fortress Structure */}
            <div className="relative w-full max-w-md h-52 sm:h-60 flex items-end justify-center">
              
              {/* LEFT TOWER */}
              <div className="w-16 sm:w-20 h-44 sm:h-52 bg-gradient-to-r from-[#64748b] via-[#94a3b8] to-[#475569] border-2 border-zinc-900 rounded-t-sm relative flex flex-col justify-between shadow-2xl z-10">
                {/* Conical Red Tiled Roof */}
                <div className="absolute -top-10 -left-1 -right-1 h-10 bg-gradient-to-b from-rose-600 to-red-700 border-2 border-zinc-900 [clip-path:polygon(50%_0%,0%_100%,100%_100%)] shadow-md">
                  <div className="w-full h-full opacity-30 bg-[repeating-linear-gradient(45deg,#000_0px,#000_2px,transparent_2px,transparent_6px)]" />
                </div>
                {/* Turret Flag */}
                <div className="absolute -top-16 left-1/2 -translate-x-1/2 flex items-center gap-1">
                  <span className="text-base animate-pulse">🚩</span>
                  <span className="px-1 py-0.5 rounded bg-white text-black text-[6.5px] font-bold border shadow">GOOGLE</span>
                </div>
                {/* Battlements / Crenellations */}
                <div className="flex justify-between px-1 -mt-2">
                  <div className="w-3 h-3 bg-zinc-700 border border-zinc-900" />
                  <div className="w-3 h-3 bg-zinc-700 border border-zinc-900" />
                </div>
                {/* Arrow Slit Window */}
                <div className="self-center my-auto w-2.5 h-7 bg-zinc-950 rounded-sm border border-zinc-700 shadow-inner" />
                {/* Stone Brick Lines */}
                <div className="w-full h-full absolute inset-0 pointer-events-none opacity-20 bg-[repeating-linear-gradient(0deg,#000_0px,#000_2px,transparent_2px,transparent_14px)]" />
              </div>

              {/* CENTER KEEP (MAIN CASTLE HALL) */}
              <div className="flex-1 h-36 sm:h-44 bg-gradient-to-r from-[#475569] via-[#64748b] to-[#475569] border-2 border-zinc-900 relative flex flex-col justify-between items-center p-2 z-20 shadow-2xl">
                {/* Battlements across top */}
                <div className="absolute -top-3 inset-x-0 flex justify-between px-2">
                  <div className="w-4 h-3 bg-zinc-700 border border-zinc-900" />
                  <div className="w-4 h-3 bg-zinc-700 border border-zinc-900" />
                  <div className="w-4 h-3 bg-zinc-700 border border-zinc-900" />
                  <div className="w-4 h-3 bg-zinc-700 border border-zinc-900" />
                  <div className="w-4 h-3 bg-zinc-700 border border-zinc-900" />
                </div>

                {/* Main Keep Center Flag */}
                <div className="absolute -top-11 left-1/2 -translate-x-1/2 flex items-center gap-1 z-30">
                  <span className="text-lg animate-pulse">🚩</span>
                  <span className="px-1.5 py-0.5 rounded bg-yellow-400 text-black text-[7px] font-black border border-yellow-200 shadow">REPLIT</span>
                </div>

                {/* Stained Glass Rose Window */}
                <div className="mt-1 w-9 h-9 rounded-full bg-gradient-to-br from-amber-300 via-rose-400 to-indigo-600 border-2 border-yellow-300 shadow-[0_0_12px_rgba(250,204,21,0.8)] flex items-center justify-center animate-pulse">
                  <span className="text-[9px]">🌟</span>
                </div>

                {/* Title Sponsor Plaque */}
                <div className="px-3 py-1 bg-black/90 rounded-md border border-yellow-400 text-yellow-300 text-[8.5px] sm:text-[9.5px] font-pixel font-black shadow-md flex items-center gap-1.5">
                  <span>★</span>
                  <span>REVERIE 2K27 CASTLE</span>
                  <span>★</span>
                </div>

                {/* Arched Portcullis Grand Entrance */}
                <div className="w-20 sm:w-24 h-16 sm:h-20 bg-gradient-to-b from-[#2a1306] to-[#120802] border-t-3 border-x-3 border-zinc-950 rounded-t-full shadow-[inset_0_4px_12px_rgba(0,0,0,0.9)] flex items-center justify-center relative overflow-hidden">
                  {/* Iron portcullis grating */}
                  <div className="absolute inset-0 bg-[repeating-linear-gradient(0deg,rgba(0,0,0,0.7)_0px,rgba(0,0,0,0.7)_4px,transparent_4px,transparent_12px)] pointer-events-none" />
                  <div className="absolute inset-0 bg-[repeating-linear-gradient(90deg,rgba(0,0,0,0.7)_0px,rgba(0,0,0,0.7)_4px,transparent_4px,transparent_12px)] pointer-events-none" />
                  <div className="w-4 h-4 rounded-full bg-amber-400/80 blur-sm animate-ping" />
                  <span className="text-xs relative z-10">✨</span>
                </div>
              </div>

              {/* RIGHT TOWER */}
              <div className="w-16 sm:w-20 h-44 sm:h-52 bg-gradient-to-r from-[#475569] via-[#94a3b8] to-[#64748b] border-2 border-zinc-900 rounded-t-sm relative flex flex-col justify-between shadow-2xl z-10">
                {/* Conical Red Tiled Roof */}
                <div className="absolute -top-10 -left-1 -right-1 h-10 bg-gradient-to-b from-rose-600 to-red-700 border-2 border-zinc-900 [clip-path:polygon(50%_0%,0%_100%,100%_100%)] shadow-md">
                  <div className="w-full h-full opacity-30 bg-[repeating-linear-gradient(45deg,#000_0px,#000_2px,transparent_2px,transparent_6px)]" />
                </div>
                {/* Turret Flag */}
                <div className="absolute -top-16 left-1/2 -translate-x-1/2 flex items-center gap-1">
                  <span className="text-base animate-pulse">🚩</span>
                  <span className="px-1 py-0.5 rounded bg-white text-black text-[6.5px] font-bold border shadow">SOLANA</span>
                </div>
                {/* Battlements / Crenellations */}
                <div className="flex justify-between px-1 -mt-2">
                  <div className="w-3 h-3 bg-zinc-700 border border-zinc-900" />
                  <div className="w-3 h-3 bg-zinc-700 border border-zinc-900" />
                </div>
                {/* Arrow Slit Window */}
                <div className="self-center my-auto w-2.5 h-7 bg-zinc-950 rounded-sm border border-zinc-700 shadow-inner" />
                {/* Stone Brick Lines */}
                <div className="w-full h-full absolute inset-0 pointer-events-none opacity-20 bg-[repeating-linear-gradient(0deg,#000_0px,#000_2px,transparent_2px,transparent_14px)]" />
              </div>

            </div>

            {/* Authentic Pixel Toad / Mascot on the Right with Speech Bubble */}
            <div className="absolute right-0 bottom-0 flex flex-col items-center z-30">
              <div className="px-2.5 py-1 bg-white text-black text-[7.5px] sm:text-[8.5px] font-pixel font-black rounded-lg shadow-lg mb-1 border border-zinc-300">
                THANK YOU, SPONSORS!
              </div>
              <svg width="42" height="48" viewBox="0 0 24 28" className="filter drop-shadow animate-bounce">
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
                { type: 'coin', label: 'COIN' },
                { type: 'star', label: 'STAR' },
                { type: 'power', label: 'POWER' },
                { type: 'oneup', label: '1UP' },
                { type: 'pass', label: 'EVENT PASS' },
                { type: 'trophy', label: 'TROPHY' },
                { type: 'arcade', label: 'ARCADE' },
                { type: 'loyalty', label: 'LOYALTY' }
              ].map((item, i) => (
                <div key={i} className="p-2 rounded-xl bg-[#090314] border-2 border-cyan-400/70 flex flex-col items-center justify-center shadow hover:border-yellow-400 transition-colors">
                  <div className="w-8 h-8 flex items-center justify-center">
                    {item.type === 'coin' && (
                      <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-amber-500 to-yellow-300 border border-yellow-200 flex items-center justify-center text-[10px] text-black font-black shadow">
                        🪙
                      </div>
                    )}
                    {item.type === 'star' && (
                      <div className="text-xl text-yellow-300 filter drop-shadow animate-pulse">⭐</div>
                    )}
                    {item.type === 'power' && (
                      <svg width="24" height="24" viewBox="0 0 24 24">
                        <ellipse cx="12" cy="11" rx="10" ry="8" fill="#dc2626" />
                        <circle cx="8" cy="9" r="2.5" fill="#ffffff" />
                        <circle cx="16" cy="9" r="2.5" fill="#ffffff" />
                        <rect x="7" y="14" width="10" height="7" rx="2" fill="#fed7aa" />
                        <rect x="9" y="16" width="1.5" height="3" fill="#000" />
                        <rect x="13.5" y="16" width="1.5" height="3" fill="#000" />
                      </svg>
                    )}
                    {item.type === 'oneup' && (
                      <svg width="24" height="24" viewBox="0 0 24 24">
                        <ellipse cx="12" cy="11" rx="10" ry="8" fill="#16a34a" />
                        <circle cx="8" cy="9" r="2.5" fill="#ffffff" />
                        <circle cx="16" cy="9" r="2.5" fill="#ffffff" />
                        <rect x="7" y="14" width="10" height="7" rx="2" fill="#fed7aa" />
                        <rect x="9" y="16" width="1.5" height="3" fill="#000" />
                        <rect x="13.5" y="16" width="1.5" height="3" fill="#000" />
                      </svg>
                    )}
                    {item.type === 'pass' && (
                      <div className="px-1 py-0.5 rounded bg-yellow-400 text-black text-[6px] font-black border border-white shadow">
                        PASS
                      </div>
                    )}
                    {item.type === 'trophy' && (
                      <div className="text-xl text-yellow-400 filter drop-shadow">🏆</div>
                    )}
                    {item.type === 'arcade' && (
                      <div className="text-xl text-cyan-400 filter drop-shadow">🎮</div>
                    )}
                    {item.type === 'loyalty' && (
                      <div className="px-1 py-0.5 rounded bg-purple-600 text-white text-[6px] font-black border border-purple-300 shadow">
                        CARD
                      </div>
                    )}
                  </div>
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
