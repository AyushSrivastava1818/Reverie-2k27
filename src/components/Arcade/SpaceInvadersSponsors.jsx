import React, { useState } from 'react';
import { Rocket, Shield, ExternalLink, Award, Sparkles, X, ChevronRight, Play } from 'lucide-react';
import { pastSponsors, whySponsorUs } from '../../data/sponsors';
import { soundEngine } from '../../game/systems/SoundEngine';
import { achievementSystem } from '../../game/systems/AchievementSystem';
import { SponsorGalaxy } from './SponsorGalaxy';

export function SpaceInvadersSponsors({ onSelectSponsor, onOpenRewards }) {
  const [selectedSponsor, setSelectedSponsor] = useState(pastSponsors[0] || null);
  const [playShooterMode, setPlayShooterMode] = useState(false);

  // Categorize fleet
  const titleSponsor = pastSponsors[0] || {
    name: 'REPLIT',
    tier: 'TITLE SPONSOR & CLOUD PARTNER',
    logo: '/assets/sponsors/sponsor_1.png',
    website: 'https://replit.com',
    description: 'Cloud software creation platform powering next-gen AI workspaces and instant browser-based coding.'
  };

  const goldFleet = pastSponsors.slice(1, 4);
  const silverFleet = pastSponsors.slice(4, 8);

  const handleShipClick = (sponsor) => {
    soundEngine.playLaser();
    achievementSystem.recordCoinReward(5);
    setSelectedSponsor(sponsor);
  };

  if (playShooterMode) {
    return (
      <div className="w-full h-full flex flex-col items-center">
        <div className="w-full flex items-center justify-between px-4 py-1.5 bg-[#09031a] border-b border-purple-500/40">
          <button
            onClick={() => setPlayShooterMode(false)}
            className="px-3 py-1 rounded-lg bg-purple-900/80 hover:bg-purple-800 text-purple-200 border border-purple-400 text-xs font-mono font-bold flex items-center gap-1 cursor-pointer"
          >
            ← BACK TO GALAXY FLEET
          </button>
          <span className="font-display text-xs text-yellow-300 font-bold">
            STAGE 02: 90s SPACE SHOOTER COMBAT
          </span>
        </div>
        <div className="flex-1 w-full overflow-hidden">
          <SponsorGalaxy 
            onClose={() => setPlayShooterMode(false)} 
            onSelectSponsor={onSelectSponsor}
            onOpenRewards={onOpenRewards}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full flex flex-col justify-between p-2 sm:p-4 bg-[#050212] select-none overflow-y-auto">
      
      {/* Deep Space Starfield & Celestial Bodies */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-950/40 via-[#060216] to-[#03010b] pointer-events-none" />
      
      {/* Distant Planet Earth in background */}
      <div className="absolute top-10 right-8 w-24 h-24 rounded-full bg-gradient-to-tr from-cyan-600 via-blue-700 to-indigo-900 opacity-30 shadow-[0_0_40px_rgba(6,182,212,0.4)] pointer-events-none" />

      {/* Top Title HUD */}
      <div className="relative z-10 flex items-center justify-between gap-2 px-3 py-1.5 rounded-xl bg-[#12072c]/90 border border-pink-500/60 shadow-md">
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 rounded-md bg-pink-500 text-white font-display text-[10px] font-black tracking-widest">
            STAGE 02
          </span>
          <h2 className="font-display text-xs sm:text-sm font-black text-white tracking-wider">
            SPACE INVADERS: OUR GALAXY OF PARTNERS
          </h2>
        </div>

        <button
          onClick={() => {
            soundEngine.playJump();
            setPlayShooterMode(true);
          }}
          className="px-3 py-1 rounded-lg bg-gradient-to-r from-pink-500 via-rose-500 to-pink-600 text-white font-display text-[10px] font-black tracking-wider uppercase border border-pink-200 hover:scale-105 active:scale-95 cursor-pointer shadow-lg flex items-center gap-1.5"
        >
          <Rocket size={12} className="text-white animate-pulse" />
          <span>PLAY SPACE SHOOTER</span>
        </button>
      </div>

      {/* Main Fleet Formation Area */}
      <div className="relative z-10 flex-1 my-3 flex flex-col items-center justify-center gap-4 max-w-4xl mx-auto w-full">
        
        {/* Tier 1: Central Title Sponsor Mothership */}
        <div className="flex flex-col items-center">
          <span className="text-[9px] font-mono font-black text-yellow-300 tracking-widest uppercase mb-1 flex items-center gap-1">
            👑 TITLE SPONSOR MOTHERSHIP 👑
          </span>

          <div
            onClick={() => handleShipClick(titleSponsor)}
            className={`group relative cursor-pointer transition-all duration-300 p-3 sm:p-4 rounded-2xl bg-gradient-to-b from-[#1b0a38] via-[#240e4c] to-[#120626] border-2 ${
              selectedSponsor?.name === titleSponsor.name ? 'border-yellow-400 shadow-[0_0_30px_rgba(250,204,21,0.6)] scale-105' : 'border-purple-500/80 hover:border-yellow-300 hover:scale-102'
            } flex items-center gap-4 max-w-md w-full`}
          >
            {/* Mothership Cockpit / Logo Badge (High Legibility Crisp White Background) */}
            <div className="w-20 h-14 rounded-xl bg-white p-1.5 flex items-center justify-center shadow-lg shrink-0 border-2 border-yellow-300">
              {titleSponsor.logo ? (
                <img 
                  src={titleSponsor.logo} 
                  alt={titleSponsor.name} 
                  className="max-h-full max-w-full object-contain"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              ) : null}
              <span className="font-display font-black text-zinc-900 text-xs">
                {titleSponsor.name}
              </span>
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1 text-[9px] font-mono text-yellow-300 font-bold uppercase">
                <Shield size={12} className="text-yellow-400" />
                <span>COMMAND CRUISER</span>
              </div>
              <h3 className="font-display text-sm sm:text-base font-black text-white truncate">
                {titleSponsor.name}
              </h3>
              <p className="text-[10px] font-mono text-purple-200/80 truncate">
                {titleSponsor.tier}
              </p>
            </div>

            {/* Glowing Twin Neon Thrusters */}
            <div className="flex flex-col gap-1 shrink-0">
              <span className="w-2 h-4 rounded-full bg-cyan-400 shadow-[0_0_10px_#22d3ee] animate-pulse" />
              <span className="w-2 h-4 rounded-full bg-cyan-400 shadow-[0_0_10px_#22d3ee] animate-pulse" />
            </div>
          </div>
        </div>

        {/* Tier 2: Gold Fleet (3 Corvettes) */}
        <div className="w-full flex flex-col items-center">
          <span className="text-[8px] font-mono font-bold text-amber-300 tracking-widest uppercase mb-1">
            ⚡ GOLD FLEET SQUADRON ⚡
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 w-full">
            {goldFleet.map((sp) => {
              const isSelected = selectedSponsor?.name === sp.name;
              return (
                <div
                  key={sp.name}
                  onClick={() => handleShipClick(sp)}
                  className={`cursor-pointer p-2.5 rounded-xl bg-[#14082c] border ${
                    isSelected ? 'border-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.5)] scale-102' : 'border-purple-600/60 hover:border-amber-300 hover:scale-102'
                  } flex items-center gap-2.5 transition-all`}
                >
                  <div className="w-12 h-10 rounded-lg bg-white p-1 flex items-center justify-center shrink-0 border border-amber-300">
                    {sp.logo ? (
                      <img src={sp.logo} alt={sp.name} className="max-h-full max-w-full object-contain" />
                    ) : (
                      <span className="text-[9px] font-black text-black">{sp.name.slice(0, 3)}</span>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="font-display text-xs font-black text-white truncate">{sp.name}</h4>
                    <span className="text-[8px] font-mono text-amber-200/80 truncate block">{sp.tier}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Tier 3: Silver Fleet (4 Interceptors) */}
        <div className="w-full flex flex-col items-center">
          <span className="text-[8px] font-mono font-bold text-slate-400 tracking-widest uppercase mb-1">
            🛡️ SILVER PATROL INTERCEPTORS 🛡️
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 w-full">
            {silverFleet.map((sp) => {
              const isSelected = selectedSponsor?.name === sp.name;
              return (
                <div
                  key={sp.name}
                  onClick={() => handleShipClick(sp)}
                  className={`cursor-pointer p-2 rounded-lg bg-[#0e0520] border ${
                    isSelected ? 'border-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.4)]' : 'border-purple-800/60 hover:border-cyan-300'
                  } flex items-center gap-2 transition-all`}
                >
                  <div className="w-8 h-8 rounded bg-white p-0.5 flex items-center justify-center shrink-0">
                    <img src={sp.logo} alt={sp.name} className="max-h-full max-w-full object-contain" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h5 className="font-display text-[10px] font-bold text-slate-200 truncate">{sp.name}</h5>
                    <span className="text-[7px] font-mono text-slate-400 truncate block">{sp.tier}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Selected Sponsor Astronaut Mission Briefing Card (Matching Reference 22.11.18 (1).jpeg) */}
      {selectedSponsor && (
        <div className="relative z-10 max-w-3xl w-full mx-auto rounded-2xl bg-gradient-to-r from-[#180a36] via-[#1a0c3d] to-[#12062b] border-2 border-purple-400/80 p-3 sm:p-4 shadow-2xl flex flex-col sm:flex-row items-center gap-4">
          
          {/* Astronaut Mascot Visual */}
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-b from-cyan-900 to-indigo-950 border-2 border-cyan-400/80 flex items-center justify-center shrink-0 shadow-[0_0_20px_rgba(6,182,212,0.4)] text-3xl">
            👨‍🚀
          </div>

          {/* Mission Briefing Details */}
          <div className="flex-1 min-w-0 text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start gap-2 mb-1">
              <span className="px-2 py-0.5 rounded bg-pink-950 border border-pink-400 text-pink-300 font-mono text-[9px] font-bold uppercase">
                SPONSOR BRIEFING
              </span>
              <span className="font-mono text-[10px] text-yellow-300 font-bold">
                {selectedSponsor.tier}
              </span>
            </div>

            <h3 className="font-display text-base sm:text-lg font-black text-white tracking-wider">
              {selectedSponsor.name}
            </h3>

            <p className="text-[11px] text-purple-200/90 leading-relaxed line-clamp-2 mt-0.5">
              {selectedSponsor.description || 'Proud technology and ecosystem partner powering REVERIE 2K27 festival universe.'}
            </p>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-col gap-2 shrink-0 w-full sm:w-auto">
            {selectedSponsor.website && (
              <a
                href={selectedSponsor.website}
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-display text-xs font-black tracking-wider uppercase border border-cyan-300 shadow hover:scale-105 active:scale-95 text-center flex items-center justify-center gap-1.5"
              >
                <span>VISIT PORTAL</span>
                <ExternalLink size={12} />
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
