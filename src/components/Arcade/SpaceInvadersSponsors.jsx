import React, { useState, useEffect } from 'react';
import { soundEngine } from '../../game/systems/SoundEngine';
import { pastSponsors } from '../../data/sponsors';
import { SpaceInvaderAlien } from './ArcadePixelSprites';

export function SpaceInvadersSponsors({ onAdvanceStage, onClose, onBackToMap }) {
  const [activeModalSponsor, setActiveModalSponsor] = useState(null);

  const titleSponsor = pastSponsors[0] || {
    name: 'Google',
    tier: 'Title Sponsor',
    logo: '/assets/sponsors/sponsor_1.png',
    website: 'https://google.com',
    description: 'Building a brighter future together. Proud to support innovation, technology and developer excellence.'
  };

  const goldSponsors = pastSponsors.slice(1, 4);
  const silverSponsors = pastSponsors.slice(4, 8);

  const handleShipClick = (sp) => {
    soundEngine.playLaser();
    setActiveModalSponsor(sp);
  };

  return (
    <div className="relative w-full h-full flex flex-col justify-between p-3 sm:p-5 bg-gradient-to-b from-[#060214] via-[#0b0321] to-[#04010d] font-pixel text-white select-none overflow-y-auto">
      
      {/* ------------------------------------------------------------- */}
      {/* TOP HEADER: STAGE 02 - SPACE INVADERS | PARTNERS: 08          */}
      {/* ------------------------------------------------------------- */}
      <div className="flex items-center justify-between pb-2 border-b-2 border-purple-900/60 shrink-0">
        <div className="flex items-center gap-2">
          {onBackToMap && (
            <button
              onClick={onBackToMap}
              className="px-2.5 py-1 rounded bg-purple-950 border border-purple-400 text-yellow-300 text-[8px] sm:text-[9px] font-black cursor-pointer hover:bg-purple-900"
            >
              ← WORLD MAP
            </button>
          )}
          <span className="text-[10px] sm:text-xs text-cyan-400 font-black tracking-widest uppercase">
            STAGE 02 — SPACE INVADERS
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[10px] sm:text-xs text-purple-300 font-bold uppercase">
            PARTNERS: 08
          </span>
          <span className="text-sm">👾</span>
          {onClose && (
            <button
              onClick={onClose}
              className="ml-2 px-2 py-0.5 rounded bg-red-600 hover:bg-red-500 text-white text-[9px] font-black cursor-pointer"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* 3D TITLE & RETRO SPACE INVADERS ALIENS                         */}
      {/* ------------------------------------------------------------- */}
      <div className="relative my-2 flex items-center justify-between max-w-4xl mx-auto w-full shrink-0">
        {/* Magenta Alien Invader (Left) */}
        <div className="animate-bounce">
          <SpaceInvaderAlien size={44} color="#ec4899" frame={0} />
        </div>

        {/* Center 3D Pixel Headline */}
        <div className="text-center px-2">
          <h2 className="font-pixel text-xl sm:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-300 tracking-wider drop-shadow-[0_2px_0_#000]">
            OUR GALAXY OF PARTNERS
          </h2>
          <p className="text-[9px] sm:text-[11px] text-purple-200/90 font-sans font-semibold tracking-wider mt-1 max-w-lg mx-auto">
            Every great mission needs powerful allies. Meet the partners powering our journey.
          </p>
        </div>

        {/* Green Alien Invader (Right) */}
        <div className="animate-bounce" style={{ animationDelay: '200ms' }}>
          <SpaceInvaderAlien size={44} color="#10b981" frame={1} />
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* COSMIC FLEET FORMATION WITH EARTH AND PLANETS                 */}
      {/* ------------------------------------------------------------- */}
      <div className="relative flex-1 my-auto flex flex-col items-center justify-center max-w-5xl mx-auto w-full py-2">
        
        {/* Planet Earth on the Left (with Continents & Glow) */}
        <div className="absolute top-4 left-2 sm:left-6 w-24 h-24 sm:w-36 sm:h-36 rounded-full bg-gradient-to-tr from-[#1d4ed8] via-[#0284c7] to-[#10b981] opacity-80 shadow-[0_0_40px_rgba(6,182,212,0.7)] pointer-events-none flex items-center justify-center overflow-hidden">
          <div className="w-16 h-8 bg-emerald-400/50 rounded-full blur-[2px] -rotate-12" />
        </div>

        {/* Purple Ringed Planet Saturn on the Right */}
        <div className="absolute top-6 right-2 sm:right-8 w-20 h-20 sm:w-32 sm:h-32 rounded-full bg-gradient-to-tr from-[#701a75] via-[#a21caf] to-[#c026d3] opacity-75 shadow-[0_0_35px_rgba(192,38,211,0.6)] pointer-events-none flex items-center justify-center">
          <div className="w-32 sm:w-48 h-3 border-t-3 border-[#f0abfc] -rotate-12 rounded-full blur-[0.5px]" />
        </div>

        {/* 1. TITLE SPONSOR MOTHERSHIP (HUGE & IMPOSING) */}
        <div className="relative z-10 flex flex-col items-center mb-5">
          <span className="text-[10px] sm:text-xs text-yellow-300 font-black tracking-widest uppercase mb-1.5 flex items-center gap-1.5 drop-shadow">
            ★ TITLE SPONSOR ★
          </span>

          <div
            onClick={() => handleShipClick(titleSponsor)}
            className="cursor-pointer group transition-transform hover:scale-105 active:scale-95 flex flex-col items-center"
          >
            {/* Giant Mothership Cruiser Hull */}
            <div className="relative w-80 sm:w-[480px] h-28 sm:h-36 flex items-center justify-center">
              {/* Pulsing Tractor Beam Glow underneath */}
              <div className="absolute bottom-0 w-44 h-8 bg-gradient-to-t from-yellow-400/90 to-transparent blur-md rounded-full animate-pulse" />

              <svg width="100%" height="100%" viewBox="0 0 320 110" className="filter drop-shadow-[0_0_30px_rgba(59,130,246,0.9)]">
                {/* Main Saucer Wings */}
                <ellipse cx="160" cy="55" rx="150" ry="28" fill="#1e1b4b" stroke="#38bdf8" strokeWidth="3" />
                <ellipse cx="160" cy="50" rx="135" ry="20" fill="#312e81" />
                {/* Navigation Lights */}
                <circle cx="25" cy="55" r="5" fill="#f43f5e" />
                <circle cx="295" cy="55" r="5" fill="#f43f5e" />
                <circle cx="70" cy="68" r="4" fill="#eab308" />
                <circle cx="250" cy="68" r="4" fill="#eab308" />
                {/* Rocket Engines firing */}
                <ellipse cx="120" cy="80" rx="12" ry="5" fill="#f97316" />
                <ellipse cx="200" cy="80" rx="12" ry="5" fill="#f97316" />
                {/* Center Dome Cockpit Base */}
                <ellipse cx="160" cy="40" rx="75" ry="26" fill="#0f172a" stroke="#facc15" strokeWidth="2.5" />
              </svg>

              {/* High-Legibility White Logo Cockpit Badge in Center */}
              <div className="absolute top-3 sm:top-4 w-44 sm:w-60 h-14 sm:h-18 bg-white rounded-xl border-3 border-yellow-300 shadow-[0_4px_12px_rgba(0,0,0,0.5)] flex items-center justify-center p-2 z-20">
                {titleSponsor.logo ? (
                  <img src={titleSponsor.logo} alt={titleSponsor.name} className="max-h-full max-w-full object-contain" />
                ) : (
                  <span className="text-black font-black text-sm">{titleSponsor.name}</span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* 2. GOLD SPONSORS (3 Ships) */}
        <div className="relative z-10 w-full flex flex-col items-center mb-4">
          <span className="text-[9px] sm:text-[10px] text-amber-300 font-bold tracking-widest uppercase mb-1.5">
            GOLD SPONSORS
          </span>

          <div className="grid grid-cols-3 gap-4 sm:gap-8 w-full max-w-3xl">
            {goldSponsors.map((sp) => (
              <div
                key={sp.name}
                onClick={() => handleShipClick(sp)}
                className="cursor-pointer group flex flex-col items-center transition-transform hover:scale-105 active:scale-95"
              >
                <div className="relative w-36 sm:w-52 h-18 sm:h-22 flex items-center justify-center">
                  <svg width="100%" height="100%" viewBox="0 0 160 70" className="filter drop-shadow-[0_0_15px_rgba(168,85,247,0.8)]">
                    <polygon points="10,40 80,12 150,40 125,58 35,58" fill="#2e1065" stroke="#c084fc" strokeWidth="2.5" />
                    <ellipse cx="80" cy="38" rx="42" ry="16" fill="#1e1b4b" stroke="#eab308" strokeWidth="2" />
                    <circle cx="20" cy="44" r="3" fill="#22d3ee" />
                    <circle cx="140" cy="44" r="3" fill="#22d3ee" />
                  </svg>

                  {/* Cockpit Badge */}
                  <div className="absolute top-2.5 w-24 sm:w-36 h-9 sm:h-11 bg-white rounded-lg border-2 border-amber-300 p-1 flex items-center justify-center shadow">
                    {sp.logo ? (
                      <img src={sp.logo} alt={sp.name} className="max-h-full max-w-full object-contain" />
                    ) : (
                      <span className="text-black text-[10px] font-black truncate">{sp.name}</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 3. SILVER SPONSORS (4 Ships) */}
        <div className="relative z-10 w-full flex flex-col items-center">
          <span className="text-[9px] sm:text-[10px] text-cyan-300 font-bold tracking-widest uppercase mb-1.5">
            SILVER SPONSORS
          </span>

          <div className="grid grid-cols-4 gap-3 sm:gap-6 w-full max-w-4xl">
            {silverSponsors.map((sp) => (
              <div
                key={sp.name}
                onClick={() => handleShipClick(sp)}
                className="cursor-pointer group flex flex-col items-center transition-transform hover:scale-105 active:scale-95"
              >
                <div className="relative w-28 sm:w-40 h-14 sm:h-18 flex items-center justify-center">
                  <svg width="100%" height="100%" viewBox="0 0 130 55" className="filter drop-shadow-[0_0_10px_rgba(6,182,212,0.7)]">
                    <polygon points="10,32 65,10 120,32 100,48 30,48" fill="#0f172a" stroke="#38bdf8" strokeWidth="2" />
                    <circle cx="20" cy="36" r="2.5" fill="#f43f5e" />
                    <circle cx="110" cy="36" r="2.5" fill="#f43f5e" />
                  </svg>
                  <div className="absolute top-2 w-20 sm:w-28 h-7 sm:h-9 bg-white rounded-lg border border-cyan-400 p-1 flex items-center justify-center shadow">
                    {sp.logo ? (
                      <img src={sp.logo} alt={sp.name} className="max-h-full max-w-full object-contain" />
                    ) : (
                      <span className="text-black text-[9px] font-black truncate">{sp.name}</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Hint */}
        <div className="mt-4 text-center">
          <span className="text-[9px] sm:text-[10px] text-yellow-300 font-bold tracking-wider uppercase animate-pulse">
            ★ SELECT A SPACESHIP TO DISCOVER MORE ★
          </span>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* BOTTOM PROGRESS BAR & NEXT STAGE BUTTON                       */}
      {/* ------------------------------------------------------------- */}
      <div className="flex items-center justify-between pt-3 border-t-2 border-purple-900/60 mt-1 shrink-0">
        <div className="flex items-center gap-3">
          <span className="text-[8px] sm:text-[9px] text-slate-300 font-bold uppercase">
            MISSION PROGRESS
          </span>
          {/* Progress bar blocks */}
          <div className="flex items-center gap-1">
            <span className="w-5 h-3 bg-yellow-400 rounded-sm" />
            <span className="w-5 h-3 bg-yellow-400 rounded-sm" />
            <span className="w-5 h-3 bg-zinc-700 rounded-sm" />
            <span className="w-5 h-3 bg-zinc-700 rounded-sm" />
            <span className="w-5 h-3 bg-zinc-700 rounded-sm" />
            <span className="w-5 h-3 bg-zinc-700 rounded-sm" />
          </div>
          <span className="text-[9px] text-cyan-300 font-black">02 / 06</span>
        </div>

        <button
          onClick={onAdvanceStage}
          className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-500 border-2 border-white text-black font-pixel text-xs font-black uppercase tracking-wider shadow-[0_4px_0_#78350f] hover:scale-105 active:translate-y-1 active:shadow-none cursor-pointer flex items-center gap-1.5"
        >
          <span>NEXT STAGE</span>
          <span>➔</span>
        </button>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* POPUP: ASTRONAUT SPONSOR DETAILS (Ref: 22.11.18(1) Right)     */}
      {/* ------------------------------------------------------------- */}
      {activeModalSponsor && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-in fade-in zoom-in-95 duration-200">
          <div className="relative w-full max-w-xl bg-gradient-to-b from-[#180a36] via-[#100526] to-[#080214] rounded-2xl border-4 border-purple-500 shadow-[0_0_50px_rgba(168,85,247,0.8)] p-4 sm:p-6 flex flex-col">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b-2 border-purple-800 mb-4">
              <span className="font-pixel text-xs sm:text-sm font-black text-yellow-300 tracking-wider">
                ★ SPONSOR DETAILS ★
              </span>
              <button
                onClick={() => setActiveModalSponsor(null)}
                className="w-8 h-8 rounded-lg bg-purple-900 border border-purple-400 text-white font-pixel text-xs font-black flex items-center justify-center cursor-pointer hover:bg-purple-800"
              >
                ✕
              </button>
            </div>

            {/* Main Sponsor Card with White Badge */}
            <div className="w-full bg-white rounded-xl p-3 flex items-center justify-center h-22 mb-3 shadow-lg">
              {activeModalSponsor.logo ? (
                <img src={activeModalSponsor.logo} alt={activeModalSponsor.name} className="max-h-full max-w-full object-contain" />
              ) : (
                <span className="text-black font-pixel text-base font-black">{activeModalSponsor.name}</span>
              )}
            </div>

            {/* Astronaut Mascot & Briefing */}
            <div className="flex items-start gap-4 my-2">
              <div className="flex-1">
                <h4 className="font-pixel text-xs sm:text-sm text-cyan-300 font-bold mb-1">
                  Building a brighter future together.
                </h4>
                <p className="text-[11px] text-slate-200 font-sans font-semibold leading-relaxed mb-3">
                  {activeModalSponsor.description || 'Proud to empower innovation, technology and creative excellence at REVERIE 2K27.'}
                </p>

                <div className="space-y-1.5 text-[9px] font-pixel text-purple-300 border-t border-purple-800 pt-2">
                  <div className="flex items-center gap-1.5">
                    <span>📅</span>
                    <span>Our Partnership Since 2024</span>
                  </div>
                  {activeModalSponsor.website && (
                    <div className="flex items-center gap-1.5">
                      <span>🌐</span>
                      <a href={activeModalSponsor.website} target="_blank" rel="noreferrer" className="text-cyan-400 underline">
                        Visit: {activeModalSponsor.website}
                      </a>
                    </div>
                  )}
                </div>
              </div>

              {/* Authentic Pixel Astronaut Mascot Visual (Thumbs Up) */}
              <div className="w-24 h-32 flex flex-col items-center justify-end shrink-0">
                <svg width="72" height="96" viewBox="0 0 48 64" className="filter drop-shadow-[0_4px_8px_rgba(0,0,0,0.8)]">
                  <circle cx="24" cy="18" r="14" fill="#f8fafc" stroke="#475569" strokeWidth="2" />
                  <ellipse cx="24" cy="18" rx="10" ry="7" fill="#0284c7" stroke="#38bdf8" strokeWidth="1.5" />
                  <ellipse cx="22" cy="16" rx="4" ry="2" fill="#bae6fd" />
                  <rect x="14" y="32" width="20" height="18" rx="3" fill="#f1f5f9" stroke="#475569" strokeWidth="1.5" />
                  <rect x="18" y="35" width="12" height="8" rx="1" fill="#0284c7" />
                  <circle cx="21" cy="38" r="1" fill="#ef4444" />
                  <circle cx="24" cy="38" r="1" fill="#facc15" />
                  <circle cx="27" cy="38" r="1" fill="#22c55e" />
                  <rect x="6" y="33" width="8" height="6" rx="2" fill="#e2e8f0" stroke="#475569" strokeWidth="1" />
                  <circle cx="5" cy="33" r="3.5" fill="#f8fafc" stroke="#475569" strokeWidth="1" />
                  <rect x="4" y="27" width="2.5" height="6" rx="1" fill="#f8fafc" stroke="#475569" strokeWidth="1" />
                  <rect x="34" y="33" width="8" height="6" rx="2" fill="#e2e8f0" stroke="#475569" strokeWidth="1" />
                  <circle cx="43" cy="38" r="3.5" fill="#f8fafc" stroke="#475569" strokeWidth="1" />
                  <rect x="15" y="49" width="7" height="10" fill="#cbd5e1" stroke="#475569" strokeWidth="1" />
                  <rect x="26" y="49" width="7" height="10" fill="#cbd5e1" stroke="#475569" strokeWidth="1" />
                  <rect x="13" y="56" width="9" height="5" rx="2" fill="#475569" />
                  <rect x="26" y="56" width="9" height="5" rx="2" fill="#475569" />
                </svg>
                <div className="w-20 h-4 bg-zinc-700 border-t border-zinc-500 rounded-full blur-[0.5px] mt-0.5" />
              </div>
            </div>

            {/* Yellow Close Button */}
            <div className="flex justify-center pt-3 border-t border-purple-800 mt-2">
              <button
                onClick={() => setActiveModalSponsor(null)}
                className="px-8 py-2.5 rounded-xl bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-500 border-2 border-white text-black font-pixel text-xs font-black uppercase tracking-wider shadow-[0_4px_0_#78350f] hover:scale-105 active:translate-y-1 cursor-pointer"
              >
                CLOSE
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
