import React, { useState } from 'react';
import { 
  Swords, Shield, Trophy, MapPin, Users, Calendar, Clock, 
  ExternalLink, Sparkles, ChevronRight, Zap, Flame, Award, X 
} from 'lucide-react';
import { eventsData } from '../../data/events';
import { soundEngine } from '../../game/systems/SoundEngine';
import confetti from 'canvas-confetti';

export function EventArena({ onSelectEvent }) {
  const [selectedEvent, setSelectedEvent] = useState(eventsData[0]);
  const [vsActive, setVsActive] = useState(false);
  const [activeFighter, setActiveFighter] = useState(null);
  const [filter, setFilter] = useState('all');

  const filteredEvents = eventsData.filter(ev => {
    if (filter === 'all') return true;
    return ev.category === filter;
  });

  const getFighterArchetype = (event) => {
    switch (event.category) {
      case 'technical':
        return {
          title: 'CYBER TITAN',
          tag: 'CODE WARRIOR',
          color: 'from-cyan-500 to-blue-600',
          textColor: 'text-cyan-400',
          borderColor: 'border-cyan-400',
          bgBadge: 'bg-cyan-950/80',
          statCombat: 92,
          statSpeed: 88,
          statPrize: 95
        };
      case 'cultural':
        return {
          title: 'SONIC VALKYRIE',
          tag: 'RHYTHM MASTER',
          color: 'from-pink-500 to-rose-600',
          textColor: 'text-pink-400',
          borderColor: 'border-pink-400',
          bgBadge: 'bg-pink-950/80',
          statCombat: 85,
          statSpeed: 94,
          statPrize: 89
        };
      case 'flagship':
      default:
        return {
          title: 'APEX GLADIATOR',
          tag: 'GRAND CHAMPION',
          color: 'from-amber-400 to-yellow-600',
          textColor: 'text-yellow-400',
          borderColor: 'border-yellow-400',
          bgBadge: 'bg-amber-950/80',
          statCombat: 98,
          statSpeed: 90,
          statPrize: 99
        };
    }
  };

  const handleSelectFighter = (event) => {
    soundEngine.playLaser();
    setSelectedEvent(event);
  };

  const handleLaunchVS = (event) => {
    soundEngine.playHit();
    setActiveFighter(event);
    setVsActive(true);
    setTimeout(() => {
      soundEngine.playFanfare();
    }, 450);
  };

  const currentArchetype = selectedEvent ? getFighterArchetype(selectedEvent) : null;

  return (
    <div className="flex flex-col h-full w-full bg-[#080417] text-white overflow-hidden select-none">
      {/* ----------------------------------------------------------------- */}
      {/* TOURNAMENT BANNER & FACTION SELECTOR                              */}
      {/* ----------------------------------------------------------------- */}
      <div className="p-3 sm:p-4 bg-[#110729] border-b-2 border-purple-600/50 flex flex-wrap items-center justify-between gap-3 shrink-0">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-purple-950 border border-purple-400 shadow-md shadow-purple-500/20">
            <Swords size={20} className="text-yellow-400 animate-pulse" />
          </div>
          <div>
            <h2 className="font-display text-base sm:text-lg font-black text-yellow-300 uppercase tracking-widest flex items-center gap-2">
              EVENT ARENA 2K27
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-yellow-400 text-slate-950 font-black">
                ARCADE TOURNAMENT
              </span>
            </h2>
            <p className="font-body text-xs text-slate-300">
              Select your championship contender from 18 festival combatants.
            </p>
          </div>
        </div>

        {/* Faction Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto">
          {[
            { id: 'all', label: 'ALL FIGHTERS (18)' },
            { id: 'flagship', label: 'GLADIATORS (4)' },
            { id: 'technical', label: 'CYBER TITANS (7)' },
            { id: 'cultural', label: 'SONIC MASTERS (7)' }
          ].map(f => (
            <button
              key={f.id}
              onClick={() => {
                soundEngine.playBlip();
                setFilter(f.id);
              }}
              className={`px-3 py-1.5 rounded-xl font-display text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
                filter === f.id
                  ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/50 ring-1 ring-white/50 scale-105'
                  : 'bg-[#180e36] text-slate-300 hover:bg-purple-900 hover:text-white border border-purple-800/60'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* ----------------------------------------------------------------- */}
      {/* MAIN FIGHTER SELECTOR: SPLIT SCREEN (ROSTER + COMBATANT CARD)    */}
      {/* ----------------------------------------------------------------- */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
        {/* LEFT / CENTER: ARCADE CHARACTER ROSTER (18 Cards) */}
        <div className="lg:col-span-7 xl:col-span-8 p-3 sm:p-5 overflow-y-auto">
          <div className="font-display text-xs text-purple-300 font-black uppercase tracking-wider mb-3 flex items-center gap-2">
            <Flame size={14} className="text-rose-500 animate-pulse" />
            <span>FESTIVAL FIGHTER ROSTER • CHOOSE YOUR CHALLENGER</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5 sm:gap-3">
            {filteredEvents.map((ev) => {
              const arch = getFighterArchetype(ev);
              const isSelected = selectedEvent?.id === ev.id;

              return (
                <div
                  key={ev.id}
                  onClick={() => handleSelectFighter(ev)}
                  onDoubleClick={() => handleLaunchVS(ev)}
                  className={`relative p-2.5 rounded-xl border-2 transition-all flex flex-col justify-between cursor-pointer group ${
                    isSelected
                      ? `${arch.borderColor} bg-[#1e0f3d] ring-2 ring-yellow-400 shadow-xl shadow-purple-500/30 scale-[1.03]`
                      : 'border-purple-900/60 bg-[#120826]/80 hover:border-purple-500 hover:bg-[#180b33]'
                  }`}
                >
                  {/* Top Badge */}
                  <div className="flex items-center justify-between gap-1 mb-1.5">
                    <span className={`text-[9px] font-display font-black px-1.5 py-0.5 rounded uppercase ${arch.bgBadge} ${arch.textColor}`}>
                      {arch.tag}
                    </span>
                    <span className="text-[10px] font-display font-bold text-yellow-400">
                      {ev.prizePool?.slice(0, 7) || 'MEDALS'}
                    </span>
                  </div>

                  {/* Character Avatar Box */}
                  <div className="w-full h-20 sm:h-24 rounded-lg bg-[#0b0517] border border-purple-950 overflow-hidden relative mb-2 flex items-center justify-center group-hover:scale-105 transition-transform">
                    {ev.image ? (
                      <img 
                        src={ev.image} 
                        alt={ev.title} 
                        className="w-full h-full object-cover object-center filter brightness-95 group-hover:brightness-110" 
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-900 to-indigo-950 font-display text-xl font-black text-purple-300">
                        {ev.title.slice(0, 2)}
                      </div>
                    )}
                    {isSelected && (
                      <div className="absolute top-1 right-1 px-1.5 py-0.5 rounded bg-yellow-400 text-black font-display font-black text-[9px] uppercase shadow">
                        P1
                      </div>
                    )}
                  </div>

                  {/* Title & Venue */}
                  <div>
                    <h4 className="font-display text-xs sm:text-sm font-black text-white group-hover:text-yellow-300 transition-colors line-clamp-1 uppercase">
                      {ev.title}
                    </h4>
                    <p className="font-body text-[10px] text-slate-300 line-clamp-1 mt-0.5">
                      {ev.venue || 'Campus Arena'}
                    </p>
                  </div>

                  {/* Action Bar */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleLaunchVS(ev);
                    }}
                    className="mt-2 w-full py-1 rounded bg-purple-950 hover:bg-pink-600 border border-purple-700/60 hover:border-pink-400 text-slate-200 hover:text-white font-display text-[10px] font-black uppercase tracking-wider flex items-center justify-center gap-1 transition-all"
                  >
                    <span>VS FIGHT</span>
                    <ChevronRight size={12} />
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* RIGHT: SELECTED FIGHTER COMBATANT DOSSIER */}
        {selectedEvent && currentArchetype && (
          <div className="lg:col-span-5 xl:col-span-4 p-4 sm:p-6 bg-[#0f0724] border-t-2 lg:border-t-0 lg:border-l-2 border-purple-900/60 flex flex-col justify-between overflow-y-auto">
            <div>
              {/* Category Ribbon */}
              <div className="flex items-center justify-between mb-3">
                <span className={`px-2.5 py-1 rounded-full text-xs font-display font-black uppercase tracking-wider border ${currentArchetype.borderColor} ${currentArchetype.bgBadge} ${currentArchetype.textColor}`}>
                  {currentArchetype.title} • {selectedEvent.category}
                </span>

                <span className="font-display text-xs text-yellow-400 font-bold px-2 py-0.5 rounded bg-amber-950/60 border border-amber-500/40">
                  {selectedEvent.status || 'Active Contest'}
                </span>
              </div>

              {/* Fighter Image Header */}
              <div className="relative w-full h-44 sm:h-52 rounded-2xl overflow-hidden border-2 border-purple-600/70 mb-4 shadow-xl">
                <img 
                  src={selectedEvent.image} 
                  alt={selectedEvent.title} 
                  className="w-full h-full object-cover" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#080417] via-transparent to-transparent" />
                <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
                  <div>
                    <h3 className="font-display text-2xl font-black text-white drop-shadow-md">
                      {selectedEvent.title}
                    </h3>
                    <p className="font-body text-xs text-yellow-300 font-bold drop-shadow">
                      {selectedEvent.tagline}
                    </p>
                  </div>
                </div>
              </div>

              {/* Fighter Power Attributes / Arcade Meters */}
              <div className="space-y-2 mb-4 bg-[#140a30] p-3 rounded-xl border border-purple-900/60">
                <div>
                  <div className="flex justify-between text-[11px] font-display font-bold text-slate-300 mb-1">
                    <span>PRIZE POOL & STAKES</span>
                    <span className="text-yellow-400">{selectedEvent.prizePool}</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-yellow-500 to-amber-300 rounded-full" 
                      style={{ width: `${currentArchetype.statPrize}%` }} 
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-[11px] font-display font-bold text-slate-300 mb-1">
                    <span>COMPETITIVE INTENSITY</span>
                    <span className="text-rose-400">{currentArchetype.statCombat} / 100</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-rose-500 to-pink-500 rounded-full" 
                      style={{ width: `${currentArchetype.statCombat}%` }} 
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-[11px] font-display font-bold text-slate-300 mb-1">
                    <span>SQUAD CONFIGURATION</span>
                    <span className="text-cyan-400">{selectedEvent.teamSize}</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full" 
                      style={{ width: `${currentArchetype.statSpeed}%` }} 
                    />
                  </div>
                </div>
              </div>

              {/* Venue & Logistics */}
              <div className="flex items-center gap-4 text-xs text-slate-300 mb-3">
                <div className="flex items-center gap-1.5">
                  <MapPin size={14} className="text-cyan-400" />
                  <span>{selectedEvent.venue || 'IIIT Kota Arena'}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Calendar size={14} className="text-pink-400" />
                  <span>FEBRUARY 2K27</span>
                </div>
              </div>

              {/* Summary Description */}
              <p className="font-body text-xs sm:text-sm text-slate-200 leading-relaxed font-semibold">
                {selectedEvent.shortDesc}
              </p>
            </div>

            {/* Launch Action */}
            <div className="pt-4 mt-4 border-t border-purple-900/60 flex flex-col gap-2">
              <button
                onClick={() => handleLaunchVS(selectedEvent)}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white font-display text-sm font-black uppercase tracking-wider flex items-center justify-center gap-2 shadow-xl shadow-pink-600/40 hover:scale-[1.02] transition-all cursor-pointer"
              >
                <Swords size={18} className="text-yellow-300" />
                <span>CHALLENGE CONTENDER (VS INTRO)</span>
              </button>

              <button
                onClick={() => onSelectEvent(selectedEvent)}
                className="w-full py-2.5 rounded-xl bg-[#1a0e38] hover:bg-purple-900 border border-purple-600/60 text-slate-200 font-display text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all cursor-pointer"
              >
                <span>OPEN OFFICIAL EVENT DOSSIER</span>
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ----------------------------------------------------------------- */}
      {/* 90s FIGHTING GAME "VS BATTLE" SPLASH INTRO MODAL                  */}
      {/* ----------------------------------------------------------------- */}
      {vsActive && activeFighter && (
        <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
          <div className="relative w-full max-w-4xl bg-[#09041a] border-3 border-yellow-400 rounded-3xl p-6 sm:p-10 shadow-2xl shadow-yellow-500/20 overflow-hidden flex flex-col items-center">
            {/* Retro CRT Scanline overlay effect */}
            <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.6)_100%)] opacity-80" />

            {/* Close button */}
            <button
              onClick={() => setVsActive(false)}
              className="absolute top-4 right-4 p-2.5 rounded-xl bg-slate-900 hover:bg-rose-900 text-slate-300 hover:text-white transition-colors z-20 cursor-pointer"
            >
              <X size={22} />
            </button>

            {/* "ROUND 1 — FIGHT!" Floating Arcade Banner */}
            <div className="px-6 py-2 rounded-full bg-gradient-to-r from-red-600 via-yellow-500 to-red-600 border-2 border-white text-black font-display font-black text-sm sm:text-base tracking-widest uppercase shadow-2xl mb-6 animate-pulse z-10">
              ⚡ ROUND 1 • FESTIVAL SHOWDOWN ⚡
            </div>

            {/* VS SPLIT SCREEN DISPLAY */}
            <div className="w-full grid grid-cols-1 md:grid-cols-11 items-center gap-4 sm:gap-6 my-4 z-10">
              {/* SIDE A: THE CHALLENGER (USER) */}
              <div className="md:col-span-5 p-5 rounded-2xl bg-[#14072f] border-2 border-cyan-400 flex flex-col items-center text-center shadow-xl shadow-cyan-500/20 animate-slideInLeft">
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-slate-900 border-2 border-cyan-300 p-2 overflow-hidden mb-3 flex items-center justify-center">
                  <img src="/assets/hero.png" alt="You" className="w-full h-full object-contain pixel-avatar" />
                </div>
                <span className="text-[10px] font-display font-black px-2.5 py-0.5 rounded-full bg-cyan-950 border border-cyan-400 text-cyan-300 uppercase mb-1">
                  PLAYER 1 (YOU)
                </span>
                <h3 className="font-display text-xl sm:text-2xl font-black text-white">
                  FESTIVAL EXPLORER
                </h3>
                <p className="font-body text-xs text-slate-300 mt-1">
                  Ready to test skills against IIIT Kota's elite competition.
                </p>
              </div>

              {/* CENTER: MASSIVE GLOWING "VS" EMBLEM */}
              <div className="md:col-span-1 flex flex-col items-center justify-center my-2">
                <span className="font-display text-4xl sm:text-5xl font-black italic text-yellow-400 drop-shadow-[0_0_20px_rgba(250,204,21,0.9)] animate-bounce">
                  VS
                </span>
              </div>

              {/* SIDE B: THE EVENT (CHAMPION) */}
              <div className="md:col-span-5 p-5 rounded-2xl bg-[#14072f] border-2 border-pink-500 flex flex-col items-center text-center shadow-xl shadow-pink-500/20 animate-slideInRight">
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-slate-900 border-2 border-pink-400 p-2 overflow-hidden mb-3 flex items-center justify-center">
                  <img src={activeFighter.image} alt={activeFighter.title} className="w-full h-full object-cover rounded-xl" />
                </div>
                <span className="text-[10px] font-display font-black px-2.5 py-0.5 rounded-full bg-pink-950 border border-pink-400 text-pink-300 uppercase mb-1">
                  {activeFighter.category} • CHAMPION
                </span>
                <h3 className="font-display text-xl sm:text-2xl font-black text-white line-clamp-1">
                  {activeFighter.title}
                </h3>
                <p className="font-body text-xs text-yellow-300 font-bold mt-1">
                  Prize Pool: {activeFighter.prizePool}
                </p>
              </div>
            </div>

            {/* EVENT RULES & VENUE SNAPSHOT */}
            <div className="w-full max-w-2xl bg-[#110729]/90 border border-purple-800 p-4 rounded-xl text-center z-10 mb-6">
              <p className="font-body text-xs sm:text-sm text-slate-200 leading-relaxed font-semibold">
                "{activeFighter.shortDesc}"
              </p>
              <div className="mt-3 flex flex-wrap items-center justify-center gap-4 text-xs font-mono text-yellow-300">
                <span>📍 VENUE: {activeFighter.venue || 'Campus Central Arena'}</span>
                <span>•</span>
                <span>👥 SQUAD: {activeFighter.teamSize}</span>
                <span>•</span>
                <span>⚡ STATUS: {activeFighter.status}</span>
              </div>
            </div>

            {/* ACTION BUTTONS */}
            <div className="flex flex-wrap items-center justify-center gap-4 z-10">
              {activeFighter.registrationLink && (
                <a
                  href={activeFighter.registrationLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3 rounded-xl bg-pink-600 hover:bg-pink-500 text-white font-display text-sm font-black uppercase tracking-wider flex items-center gap-2 shadow-xl shadow-pink-600/40 hover:scale-105 transition-all"
                >
                  <ExternalLink size={16} />
                  <span>REGISTER ON UNSTOP / PORTAL</span>
                </a>
              )}

              <button
                onClick={() => {
                  setVsActive(false);
                  onSelectEvent(activeFighter);
                }}
                className="px-6 py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-display text-sm font-black uppercase tracking-wider flex items-center gap-2 shadow-xl shadow-purple-600/40 hover:scale-105 transition-all cursor-pointer"
              >
                <span>FULL RULES & SCHEDULE</span>
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

