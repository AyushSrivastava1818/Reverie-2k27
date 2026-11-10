import React, { useState } from 'react';
import { 
  Swords, Shield, Trophy, MapPin, Users, Calendar, Clock, 
  ExternalLink, Sparkles, ChevronRight, Zap, Flame, Award, X, CheckCircle2 
} from 'lucide-react';
import { eventsData } from '../../data/events';
import { soundEngine } from '../../game/systems/SoundEngine';

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
          textColor: 'text-cyan-300',
          borderColor: 'border-cyan-400',
          bgBadge: 'bg-cyan-950',
          accentColor: '#38bdf8'
        };
      case 'cultural':
        return {
          title: 'SONIC VALKYRIE',
          tag: 'RHYTHM MASTER',
          textColor: 'text-pink-300',
          borderColor: 'border-pink-400',
          bgBadge: 'bg-pink-950',
          accentColor: '#ec4899'
        };
      case 'flagship':
      default:
        return {
          title: 'APEX GLADIATOR',
          tag: 'CHAMPION',
          textColor: 'text-yellow-300',
          borderColor: 'border-yellow-400',
          bgBadge: 'bg-amber-950',
          accentColor: '#fbbf24'
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
    }, 300);
  };

  const currentArchetype = selectedEvent ? getFighterArchetype(selectedEvent) : null;

  return (
    <div className="flex flex-col h-full w-full bg-[#070415] text-white overflow-hidden select-none">
      
      {/* ----------------------------------------------------------------- */}
      {/* TOURNAMENT TOP HEADER & CATEGORY FILTER TABS                      */}
      {/* ----------------------------------------------------------------- */}
      <div className="p-3 sm:px-6 sm:py-3.5 bg-[#110729] border-b-2 border-purple-600/50 flex flex-wrap items-center justify-between gap-3 shrink-0">
        
        {/* Arena Branding */}
        <div className="flex items-center gap-3">
          <div className="p-2 sm:p-2.5 rounded-xl bg-purple-950 border border-purple-400 shadow-md shadow-purple-500/20">
            <Swords size={20} className="text-yellow-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-display text-base sm:text-lg font-black text-yellow-300 uppercase tracking-wider">
                EVENT ARENA 2K27
              </h2>
              <span className="text-[10px] font-display font-black px-2 py-0.5 rounded-full bg-yellow-400 text-slate-950 uppercase">
                18 COMPETITIONS
              </span>
            </div>
            <p className="font-body text-xs text-slate-300 hidden sm:block">
              Select an event to view full prize pools, rules, and Unstop registration portals.
            </p>
          </div>
        </div>

        {/* Category Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
          {[
            { id: 'all', label: 'ALL (18)' },
            { id: 'flagship', label: 'FLAGSHIP (4)' },
            { id: 'technical', label: 'TECHNICAL (7)' },
            { id: 'cultural', label: 'CULTURAL (7)' }
          ].map(f => (
            <button
              key={f.id}
              onClick={() => {
                soundEngine.playBlip();
                setFilter(f.id);
              }}
              className={`px-3 py-1.5 rounded-xl font-display text-xs font-black uppercase tracking-wider transition-all cursor-pointer shrink-0 ${
                filter === f.id
                  ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/50 ring-1 ring-white/60 scale-105'
                  : 'bg-[#180e38] text-slate-300 hover:bg-purple-900 hover:text-white border border-purple-800'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* ----------------------------------------------------------------- */}
      {/* MAIN VIEWPORT: EVENT ROSTER (LEFT) & SELECTED DOSSIER (RIGHT)     */}
      {/* ----------------------------------------------------------------- */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
        
        {/* LEFT / CENTER: ROSTER GRID (All 18 Competitions) */}
        <div className="lg:col-span-7 xl:col-span-8 p-3 sm:p-5 overflow-y-auto">
          <div className="font-display text-xs text-purple-300 font-black uppercase tracking-wider mb-3 flex items-center gap-2">
            <Flame size={14} className="text-amber-400" />
            <span>FESTIVAL EVENT DIRECTORY • SELECT TO INSPECT</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3">
            {filteredEvents.map((ev) => {
              const arch = getFighterArchetype(ev);
              const isSelected = selectedEvent?.id === ev.id;

              return (
                <div
                  key={ev.id}
                  onClick={() => handleSelectFighter(ev)}
                  className={`relative p-3 rounded-2xl border-2 transition-all flex flex-col justify-between cursor-pointer group ${
                    isSelected
                      ? `${arch.borderColor} bg-[#1b0d38] shadow-xl shadow-purple-500/25 scale-[1.02] ring-2 ring-yellow-400/80`
                      : 'border-purple-900/60 bg-[#120828] hover:border-purple-500/80 hover:bg-[#160a30]'
                  }`}
                >
                  {/* Top Meta: Category Tag & Status */}
                  <div className="flex items-center justify-between gap-1 mb-2">
                    <span className={`text-[9px] font-display font-black px-2 py-0.5 rounded-full uppercase border ${arch.bgBadge} ${arch.borderColor} ${arch.textColor}`}>
                      {ev.category}
                    </span>

                    <span className="text-[10px] font-mono font-bold text-yellow-300 bg-amber-950/80 border border-yellow-500/30 px-1.5 py-0.5 rounded">
                      {ev.prizePool?.includes('₹') ? ev.prizePool.split('&')[0].trim() : 'PRIZES'}
                    </span>
                  </div>

                  {/* Event Actual Photograph */}
                  <div className="w-full h-28 sm:h-32 rounded-xl bg-[#090414] border border-purple-900/50 overflow-hidden relative mb-2.5 flex items-center justify-center">
                    {ev.image ? (
                      <img 
                        src={ev.image} 
                        alt={ev.title} 
                        className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300 filter brightness-95 group-hover:brightness-105" 
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-purple-950 text-xl font-display font-black text-purple-300">
                        {ev.title.slice(0, 3)}
                      </div>
                    )}
                    
                    {isSelected && (
                      <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-yellow-400 text-slate-950 font-display font-black text-[10px] uppercase shadow-md">
                        SELECTED
                      </div>
                    )}
                  </div>

                  {/* Title & Venue */}
                  <div>
                    <h4 className="font-display text-xs sm:text-sm font-black text-white group-hover:text-yellow-300 transition-colors line-clamp-1 uppercase tracking-wide">
                      {ev.title}
                    </h4>
                    <p className="font-body text-[11px] text-slate-300 line-clamp-1 mt-0.5">
                      {ev.venue || 'Campus Central Arena'}
                    </p>
                  </div>

                  {/* Action Link */}
                  <div className="mt-2.5 pt-2 border-t border-purple-900/40 flex items-center justify-between text-[11px] font-display font-bold text-purple-300 group-hover:text-white">
                    <span>INSPECT</span>
                    <ChevronRight size={13} className="text-yellow-400 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* RIGHT: SELECTED EVENT DETAILS PANEL */}
        {selectedEvent && (
          <div className="lg:col-span-5 xl:col-span-4 p-4 sm:p-6 bg-[#0f0724] border-t-2 lg:border-t-0 lg:border-l-2 border-purple-900/60 flex flex-col justify-between overflow-y-auto">
            <div>
              {/* Category Ribbon */}
              <div className="flex items-center justify-between mb-3">
                <span className={`px-3 py-1 rounded-full text-xs font-display font-black uppercase tracking-wider border ${currentArchetype.borderColor} ${currentArchetype.bgBadge} ${currentArchetype.textColor}`}>
                  {selectedEvent.category} • {currentArchetype.title}
                </span>

                <span className="font-display text-xs text-emerald-300 font-bold px-2.5 py-1 rounded-xl bg-emerald-950 border border-emerald-500/50 flex items-center gap-1">
                  <CheckCircle2 size={13} />
                  <span>{selectedEvent.status || 'Active Contest'}</span>
                </span>
              </div>

              {/* Event Hero Image */}
              <div className="relative w-full h-44 sm:h-52 rounded-2xl overflow-hidden border-2 border-purple-600/70 mb-4 shadow-xl">
                <img 
                  src={selectedEvent.image} 
                  alt={selectedEvent.title} 
                  className="w-full h-full object-cover" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#080417] via-transparent to-transparent" />
                
                <div className="absolute bottom-3 left-3 right-3">
                  <h3 className="font-display text-xl sm:text-2xl font-black text-white drop-shadow-md">
                    {selectedEvent.title}
                  </h3>
                  <p className="font-body text-xs text-yellow-300 font-bold drop-shadow">
                    {selectedEvent.tagline}
                  </p>
                </div>
              </div>

              {/* Highlighted Prize Pool Banner */}
              <div className="p-3.5 rounded-xl bg-[#180e38] border-2 border-yellow-500/60 flex items-center justify-between gap-3 mb-4 shadow-md">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-lg bg-amber-950 border border-yellow-400 text-yellow-400">
                    <Trophy size={18} />
                  </div>
                  <div>
                    <span className="text-[10px] font-display font-bold text-slate-300 uppercase block">PRIZE POOL & AWARDS</span>
                    <span className="font-display text-sm sm:text-base font-black text-yellow-300">
                      {selectedEvent.prizePool}
                    </span>
                  </div>
                </div>
              </div>

              {/* Meta Stats: Team Size & Venue */}
              <div className="grid grid-cols-2 gap-2 text-xs font-mono text-slate-300 mb-4">
                <div className="p-3 rounded-xl bg-[#13092b] border border-purple-800">
                  <span className="text-[10px] text-slate-400 uppercase block flex items-center gap-1">
                    <Users size={12} className="text-cyan-400" />
                    SQUAD SIZE
                  </span>
                  <span className="font-bold text-white text-xs sm:text-sm mt-0.5 block">{selectedEvent.teamSize}</span>
                </div>

                <div className="p-3 rounded-xl bg-[#13092b] border border-purple-800">
                  <span className="text-[10px] text-slate-400 uppercase block flex items-center gap-1">
                    <MapPin size={12} className="text-emerald-400" />
                    VENUE
                  </span>
                  <span className="font-bold text-white text-xs sm:text-sm mt-0.5 block line-clamp-1">{selectedEvent.venue}</span>
                </div>
              </div>

              {/* Description */}
              <p className="font-body text-xs sm:text-sm text-slate-200 leading-relaxed font-medium bg-[#0a0518] p-3.5 rounded-xl border border-purple-900/60 mb-4">
                {selectedEvent.shortDesc}
              </p>
            </div>

            {/* Prominent Action Buttons */}
            <div className="pt-4 border-t border-purple-900/60 flex flex-col gap-2.5">
              {/* PRIMARY: REGISTER ON UNSTOP */}
              {selectedEvent.registrationLink && (
                <a
                  href={selectedEvent.registrationLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-pink-600 via-rose-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white font-display text-sm font-black uppercase tracking-wider flex items-center justify-center gap-2 shadow-xl shadow-pink-600/30 transition-all cursor-pointer text-center"
                >
                  <ExternalLink size={16} />
                  <span>REGISTER ON UNSTOP / PORTAL</span>
                </a>
              )}

              {/* SECONDARY ACTIONS: VS INTRO & FULL DOSSIER */}
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => handleLaunchVS(selectedEvent)}
                  className="py-2.5 rounded-xl bg-[#1b0e3a] hover:bg-purple-900 border border-purple-500/80 text-yellow-300 font-display text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                >
                  <Swords size={14} className="text-yellow-400" />
                  <span>VS SHOWDOWN</span>
                </button>

                <button
                  onClick={() => onSelectEvent(selectedEvent)}
                  className="py-2.5 rounded-xl bg-[#120828] hover:bg-purple-900 border border-purple-600/60 text-slate-200 hover:text-white font-display text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                >
                  <span>FULL RULES</span>
                  <ChevronRight size={14} />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ----------------------------------------------------------------- */}
      {/* 90s FIGHTING GAME "VS BATTLE" SPLASH SHOWDOWN MODAL               */}
      {/* ----------------------------------------------------------------- */}
      {vsActive && activeFighter && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
          <div className="relative w-full max-w-3xl bg-[#0a051c] border-3 border-yellow-400 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-yellow-500/20 overflow-hidden flex flex-col items-center">
            
            {/* Close button */}
            <button
              onClick={() => setVsActive(false)}
              className="absolute top-4 right-4 p-2 rounded-xl bg-slate-900 hover:bg-rose-900 text-slate-300 hover:text-white transition-colors cursor-pointer"
            >
              <X size={20} />
            </button>

            {/* Match Banner */}
            <div className="px-5 py-1.5 rounded-full bg-gradient-to-r from-red-600 via-amber-500 to-red-600 text-slate-950 font-display font-black text-xs sm:text-sm tracking-widest uppercase shadow-xl mb-5">
              ⚡ FESTIVAL SHOWDOWN MATCHUP ⚡
            </div>

            {/* Split Screen Fighters */}
            <div className="w-full grid grid-cols-1 md:grid-cols-11 items-center gap-4 my-2">
              
              {/* Side A: You */}
              <div className="md:col-span-5 p-4 rounded-2xl bg-[#14082e] border-2 border-cyan-400 flex flex-col items-center text-center shadow-lg">
                <div className="w-20 h-20 rounded-xl bg-slate-900 border border-cyan-300 p-2 overflow-hidden mb-2 flex items-center justify-center">
                  <img src="/assets/hero.png" alt="You" className="w-full h-full object-contain" />
                </div>
                <span className="text-[10px] font-display font-black px-2 py-0.5 rounded-full bg-cyan-950 border border-cyan-400 text-cyan-300 uppercase mb-1">
                  PLAYER 1 (YOU)
                </span>
                <h3 className="font-display text-lg font-black text-white">
                  FESTIVAL CONTENDER
                </h3>
              </div>

              {/* Center VS Emblem */}
              <div className="md:col-span-1 flex items-center justify-center">
                <span className="font-display text-3xl font-black italic text-yellow-400 drop-shadow-[0_0_15px_rgba(250,204,21,0.8)]">
                  VS
                </span>
              </div>

              {/* Side B: Event Champion */}
              <div className="md:col-span-5 p-4 rounded-2xl bg-[#14082e] border-2 border-pink-400 flex flex-col items-center text-center shadow-lg">
                <div className="w-20 h-20 rounded-xl bg-slate-900 border border-pink-300 overflow-hidden mb-2 flex items-center justify-center">
                  <img src={activeFighter.image} alt={activeFighter.title} className="w-full h-full object-cover" />
                </div>
                <span className="text-[10px] font-display font-black px-2 py-0.5 rounded-full bg-pink-950 border border-pink-400 text-pink-300 uppercase mb-1">
                  {activeFighter.category} • CHAMPION
                </span>
                <h3 className="font-display text-lg font-black text-white line-clamp-1">
                  {activeFighter.title}
                </h3>
              </div>
            </div>

            {/* Quick Brief & Prize Pool */}
            <div className="w-full bg-[#13082a] border border-purple-800 p-3.5 rounded-xl text-center my-4">
              <span className="font-display text-xs text-yellow-300 font-black uppercase block mb-1">
                PRIZE POOL: {activeFighter.prizePool}
              </span>
              <p className="font-body text-xs text-slate-300 font-medium">
                Venue: {activeFighter.venue} • Squad: {activeFighter.teamSize}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-3">
              {activeFighter.registrationLink && (
                <a
                  href={activeFighter.registrationLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-2.5 rounded-xl bg-pink-600 hover:bg-pink-500 text-white font-display text-xs font-black uppercase tracking-wider flex items-center gap-1.5 shadow-lg shadow-pink-600/30 transition-all"
                >
                  <ExternalLink size={14} />
                  <span>REGISTER ON UNSTOP</span>
                </a>
              )}

              <button
                onClick={() => {
                  setVsActive(false);
                  onSelectEvent(activeFighter);
                }}
                className="px-5 py-2.5 rounded-xl bg-purple-700 hover:bg-purple-600 text-white font-display text-xs font-black uppercase tracking-wider flex items-center gap-1.5 cursor-pointer"
              >
                <span>RULES & GUIDELINES</span>
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
