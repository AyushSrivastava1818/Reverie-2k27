import React, { useState, useEffect, useRef } from 'react';
import { soundEngine } from '../../game/systems/SoundEngine';
import { festivalSchedule } from '../../data/schedule';
import { ChevronRight, ChevronLeft, Calendar, Clock, MapPin, Play, Pause, ExternalLink, Trophy, Volume2, VolumeX, Sparkles } from 'lucide-react';

export function PacmanScheduleMaze({ onAdvanceStage, onClose, onBackToMap }) {
  const [selectedDay, setSelectedDay] = useState(1);
  const [activeEventIndex, setActiveEventIndex] = useState(0);
  const [score, setScore] = useState(1250);
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);
  const [chompedEvents, setChompedEvents] = useState({ 1: new Set([0]), 2: new Set(), 3: new Set() });
  const [isChomping, setIsChomping] = useState(false);
  const [soundMuted, setSoundMuted] = useState(soundEngine.muted);

  // Filter events for active day
  const dayEvents = festivalSchedule.filter(e => e.day === selectedDay);
  const currentEvent = dayEvents[activeEventIndex] || dayEvents[0];

  // Auto-play interval
  useEffect(() => {
    if (!isAutoPlaying) return;
    const interval = setInterval(() => {
      handleNextEvent();
    }, 3800);
    return () => clearInterval(interval);
  }, [isAutoPlaying, activeEventIndex, selectedDay, dayEvents.length]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (['ArrowRight', 'd', 'D', ' '].includes(e.key)) {
        e.preventDefault();
        handleNextEvent();
      } else if (['ArrowLeft', 'a', 'A'].includes(e.key)) {
        e.preventDefault();
        handlePrevEvent();
      } else if (e.key === '1') {
        handleDayChange(1);
      } else if (e.key === '2') {
        handleDayChange(2);
      } else if (e.key === '3') {
        handleDayChange(3);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeEventIndex, selectedDay, dayEvents.length]);

  const handleDayChange = (day) => {
    soundEngine.playBlip();
    setSelectedDay(day);
    setActiveEventIndex(0);
    setChompedEvents(prev => ({
      ...prev,
      [day]: new Set([...(prev[day] || []), 0])
    }));
  };

  const handleNextEvent = () => {
    soundEngine.playBlip();
    setIsChomping(true);
    setTimeout(() => setIsChomping(false), 300);

    const nextIndex = (activeEventIndex + 1) % dayEvents.length;
    setActiveEventIndex(nextIndex);
    setScore(s => s + 100);
    setChompedEvents(prev => {
      const nextSet = new Set(prev[selectedDay] || []);
      nextSet.add(nextIndex);
      return { ...prev, [selectedDay]: nextSet };
    });
  };

  const handlePrevEvent = () => {
    soundEngine.playBlip();
    const prevIndex = (activeEventIndex - 1 + dayEvents.length) % dayEvents.length;
    setActiveEventIndex(prevIndex);
  };

  const toggleSound = () => {
    const next = !soundMuted;
    setSoundMuted(next);
    soundEngine.setMuted(next);
  };

  const getCategoryColor = (cat) => {
    switch (cat?.toLowerCase()) {
      case 'flagship': return { text: 'text-amber-400', border: 'border-amber-500', bg: 'bg-amber-950/60', badge: 'bg-amber-500/20 text-amber-300' };
      case 'technical': return { text: 'text-cyan-400', border: 'border-cyan-500', bg: 'bg-cyan-950/60', badge: 'bg-cyan-500/20 text-cyan-300' };
      case 'cultural': return { text: 'text-pink-400', border: 'border-pink-500', bg: 'bg-pink-950/60', badge: 'bg-pink-500/20 text-pink-300' };
      default: return { text: 'text-emerald-400', border: 'border-emerald-500', bg: 'bg-emerald-950/60', badge: 'bg-emerald-500/20 text-emerald-300' };
    }
  };

  const totalChomped = Object.values(chompedEvents).reduce((acc, set) => acc + set.size, 0);
  const colorScheme = getCategoryColor(currentEvent?.category);

  return (
    <div className="relative w-full h-full flex flex-col bg-[#05030a] text-white overflow-hidden select-none font-sans">
      
      {/* 1. TOP RETRO ARCADE HUD (Matching Reference 22.11.17) */}
      <div className="flex-shrink-0 flex items-center justify-between px-3 sm:px-6 py-2.5 bg-[#090514] border-b-2 border-yellow-500/50 shadow-md">
        
        {/* Left: Player 01 + Hearts */}
        <div className="flex items-center gap-2 sm:gap-4">
          <div className="flex items-center gap-1.5">
            {/* Animated Mini Pac-man */}
            <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-yellow-400 relative overflow-hidden flex items-center justify-center shadow-[0_0_10px_#facc15]">
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-0 h-0 border-t-[5px] border-t-transparent border-b-[5px] border-b-transparent border-r-[8px] border-r-[#090514] animate-pulse" />
            </div>
            <span className="font-['Press_Start_2P'] text-[9px] sm:text-xs text-yellow-300 tracking-wider">PLAYER 01</span>
          </div>

          <div className="flex items-center gap-1">
            <span className="text-red-500 text-xs sm:text-sm">❤️</span>
            <span className="text-red-500 text-xs sm:text-sm">❤️</span>
            <span className="text-red-500 text-xs sm:text-sm">❤️</span>
          </div>
        </div>

        {/* Center: Live Score Display */}
        <div className="hidden sm:flex items-center gap-2">
          <span className="font-['Press_Start_2P'] text-[9px] sm:text-xs text-gray-400">SCORE:</span>
          <span className="font-['Press_Start_2P'] text-xs sm:text-sm text-yellow-400 tracking-widest">{String(score).padStart(6, '0')}</span>
        </div>

        {/* Right: Stage Badge & Sound Controls */}
        <div className="flex items-center gap-2 sm:gap-4">
          <div className="px-2.5 py-1 bg-purple-950/80 border border-purple-500/50 rounded font-['Press_Start_2P'] text-[8px] sm:text-[10px] text-purple-300">
            STAGE 03 / 05
          </div>
          <button
            onClick={toggleSound}
            className="p-1.5 rounded-lg bg-gray-900 border border-gray-700 hover:border-yellow-400 text-gray-300 hover:text-yellow-400 transition"
            title="Toggle Sound"
          >
            {soundMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
          </button>
          {onClose && (
            <button
              onClick={onClose}
              className="p-1 rounded-lg bg-red-950/70 border border-red-500/70 text-red-300 hover:bg-red-900 hover:text-white transition font-bold text-xs px-2"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* 2. DAY SELECTOR NAVIGATION (DAY 1: 20 FEB | DAY 2: 21 FEB | DAY 3: 22 FEB) */}
      <div className="flex-shrink-0 flex items-center justify-between px-3 sm:px-6 py-2 bg-[#0d081f] border-b border-cyan-500/30 overflow-x-auto">
        <div className="flex items-center gap-1.5 sm:gap-3">
          {[
            { day: 1, label: 'DAY 01', date: 'FEB 20, 2027', count: 5 },
            { day: 2, label: 'DAY 02', date: 'FEB 21, 2027', count: 6 },
            { day: 3, label: 'DAY 03', date: 'FEB 22, 2027', count: 7 }
          ].map(d => {
            const isSelected = selectedDay === d.day;
            const chompedCount = (chompedEvents[d.day] || new Set()).size;
            return (
              <button
                key={d.day}
                onClick={() => handleDayChange(d.day)}
                className={`flex items-center gap-2 px-3 sm:px-4 py-1.5 rounded-lg text-xs font-['Press_Start_2P'] transition-all ${
                  isSelected
                    ? 'bg-yellow-400 text-black border-2 border-yellow-300 shadow-[0_0_15px_rgba(250,204,21,0.6)] scale-105'
                    : 'bg-black/40 text-gray-400 border border-gray-700 hover:border-yellow-500/60 hover:text-yellow-300'
                }`}
              >
                <span>{d.label}</span>
                <span className="hidden md:inline text-[8px] opacity-75">({d.date})</span>
                <span className={`text-[8px] px-1.5 py-0.5 rounded ${isSelected ? 'bg-black/20 text-black' : 'bg-gray-800 text-yellow-400'}`}>
                  {chompedCount}/{d.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Auto-Run Toggle */}
        <button
          onClick={() => setIsAutoPlaying(prev => !prev)}
          className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-['Press_Start_2P'] text-[9px] border transition ${
            isAutoPlaying
              ? 'bg-emerald-500 text-black border-emerald-300 shadow-[0_0_10px_#10b981]'
              : 'bg-gray-900 text-gray-300 border-gray-700 hover:border-yellow-400'
          }`}
        >
          {isAutoPlaying ? <Pause size={12} /> : <Play size={12} />}
          <span>{isAutoPlaying ? 'PAUSE STREAM' : 'AUTO CHOMP'}</span>
        </button>
      </div>

      {/* 3. BIG SCREEN SCHEDULE HIGHWAY (EVENTS STREAMING INTO PAC-MAN'S MOUTH) */}
      <div className="relative flex-1 flex flex-col p-2 sm:p-4 overflow-y-auto min-h-0">
        
        {/* GRAND RETRO CIRCUIT CONVEYOR (Full Width Big Screen) */}
        <div className="relative w-full bg-[#0a071c] border-2 sm:border-3 border-blue-500 rounded-2xl p-3 sm:p-4 shadow-[0_0_30px_rgba(59,130,246,0.3)] mb-3 overflow-hidden">
          
          {/* Retro Neon Circuit Grid Background */}
          <div className="absolute inset-0 opacity-15 pointer-events-none bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:16px_16px]" />
          
          {/* Top Stage Header */}
          <div className="relative z-10 flex items-center justify-between mb-2 pb-2 border-b border-blue-500/30">
            <div className="flex items-center gap-2">
              <span className="font-['Press_Start_2P'] text-[10px] sm:text-xs text-cyan-400">⚡ PAC-MAN SCHEDULE CIRCUIT</span>
              <span className="text-[10px] text-gray-400">CHOMP THROUGH ALL {dayEvents.length} EVENTS FOR DAY {selectedDay}</span>
            </div>
            <div className="font-['Press_Start_2P'] text-[9px] text-yellow-400">
              EVENT #{activeEventIndex + 1} OF {dayEvents.length}
            </div>
          </div>

          {/* PAC-MAN CHOMPING HIGHWAY */}
          <div className="relative z-10 w-full py-4 flex items-center justify-between overflow-x-auto gap-2">
            
            {/* PAC-MAN (GIANT 16-BIT RETRO CHOMPER) */}
            <div className="flex-shrink-0 flex flex-col items-center mr-2 sm:mr-4">
              <div className="relative">
                {/* Pacman Body with animated mouth */}
                <svg width="68" height="68" viewBox="0 0 100 100" className={`filter drop-shadow-[0_0_16px_#facc15] transition-transform ${isChomping ? 'scale-110' : 'scale-100'}`}>
                  <circle cx="50" cy="50" r="48" fill="#facc15" />
                  {/* Eye */}
                  <circle cx="50" cy="24" r="5" fill="#000000" />
                  {/* Mouth cut-out (Animates open / close) */}
                  <path
                    d={isChomping ? "M50,50 L98,40 A48,48 0 0,0 98,60 Z" : "M50,50 L98,20 A48,48 0 0,0 98,80 Z"}
                    fill="#0a071c"
                    className="transition-all duration-150"
                  />
                </svg>

                {/* Chomp Sparks */}
                {isChomping && (
                  <div className="absolute -right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
                    <Sparkles size={20} className="text-yellow-300 animate-spin" />
                  </div>
                )}
              </div>
              <span className="mt-1 font-['Press_Start_2P'] text-[8px] text-yellow-300">WAKA WAKA!</span>
            </div>

            {/* EVENT MILESTONES STREAMING TOWARDS PAC-MAN */}
            <div className="flex-1 flex items-center gap-2 sm:gap-4 overflow-x-auto py-2 px-1">
              {dayEvents.map((ev, idx) => {
                const isActive = idx === activeEventIndex;
                const isEaten = (chompedEvents[selectedDay] || new Set()).has(idx);
                const evColor = getCategoryColor(ev.category);

                return (
                  <button
                    key={ev.id || idx}
                    onClick={() => {
                      soundEngine.playBlip();
                      setActiveEventIndex(idx);
                      setIsChomping(true);
                      setTimeout(() => setIsChomping(false), 300);
                      setChompedEvents(prev => {
                        const nextSet = new Set(prev[selectedDay] || []);
                        nextSet.add(idx);
                        return { ...prev, [selectedDay]: nextSet };
                      });
                    }}
                    className={`flex-shrink-0 relative group flex flex-col items-center justify-between p-2.5 sm:p-3 rounded-xl border-2 transition-all duration-200 cursor-pointer text-left ${
                      isActive
                        ? `${evColor.border} ${evColor.bg} ring-2 ring-yellow-400 scale-105 shadow-[0_0_20px_rgba(250,204,21,0.5)]`
                        : isEaten
                        ? 'border-gray-700 bg-black/50 opacity-70 hover:opacity-100 hover:border-gray-500'
                        : 'border-blue-500/50 bg-[#120a2e]/80 hover:border-cyan-400'
                    }`}
                    style={{ minWidth: '160px', maxWidth: '210px' }}
                  >
                    {/* Top Tag: Time */}
                    <div className="w-full flex items-center justify-between text-[8px] sm:text-[9px] font-['Press_Start_2P'] text-gray-300 mb-1">
                      <span className="text-yellow-400 truncate">{ev.time.split('-')[0].trim()}</span>
                      <span className={`px-1 rounded text-[7px] ${evColor.badge}`}>{ev.category}</span>
                    </div>

                    {/* Event Title */}
                    <div className="w-full font-['Press_Start_2P'] text-[9px] sm:text-[10px] text-white font-bold leading-tight my-1 truncate">
                      {ev.title}
                    </div>

                    {/* Bottom Status Pellet */}
                    <div className="w-full flex items-center justify-between pt-1 border-t border-white/10 mt-1">
                      <span className="text-[9px] text-gray-400 flex items-center gap-1">
                        <MapPin size={10} className="text-pink-400 flex-shrink-0" />
                        <span className="truncate max-w-[110px]">{ev.venue}</span>
                      </span>

                      {/* Eaten Check / Pellet Indicator */}
                      <div className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-[8px] ${
                        isActive
                          ? 'bg-yellow-400 text-black font-bold animate-ping'
                          : isEaten
                          ? 'bg-emerald-500 text-black font-bold'
                          : 'bg-yellow-400/50'
                      }`}>
                        {isEaten ? '✓' : '•'}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* STREAM CONTROLS (Prev / Next Chomp / Auto) */}
          <div className="relative z-10 flex items-center justify-between pt-3 border-t border-blue-500/30 mt-1">
            <div className="flex items-center gap-2">
              <button
                onClick={handlePrevEvent}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-gray-900 border border-gray-700 hover:border-yellow-400 text-gray-300 hover:text-yellow-300 font-['Press_Start_2P'] text-[9px] transition"
              >
                <ChevronLeft size={14} />
                <span>PREV EVENT</span>
              </button>
              <button
                onClick={handleNextEvent}
                className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-yellow-400 hover:bg-yellow-300 text-black font-['Press_Start_2P'] text-[9px] font-bold shadow-[0_0_15px_#facc15] transition active:scale-95"
              >
                <span>CHOMP NEXT ▶</span>
                <ChevronRight size={14} />
              </button>
            </div>

            <div className="hidden md:flex items-center gap-3 text-xs text-gray-400 font-['Press_Start_2P'] text-[8px]">
              <span>[←/→] STEER</span>
              <span>•</span>
              <span>[SPACE] CHOMP</span>
              <span>•</span>
              <span>[1/2/3] SWITCH DAY</span>
            </div>
          </div>
        </div>

        {/* 4. ACTIVE EVENT ARCADE DOSSIER (Big Expanded Card) */}
        {currentEvent && (
          <div className={`relative flex-1 bg-[#0d0920] border-2 sm:border-3 ${colorScheme.border} rounded-2xl p-4 sm:p-6 shadow-2xl flex flex-col justify-between overflow-hidden animate-in fade-in zoom-in-95 duration-200`}>
            
            {/* Background filigree watermark */}
            <div className="absolute right-4 bottom-2 text-7xl font-['Press_Start_2P'] text-white/[0.03] select-none pointer-events-none">
              DAY {selectedDay}
            </div>

            {/* Event Header */}
            <div>
              <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                <div className="flex items-center gap-2">
                  <span className={`px-2.5 py-1 rounded font-['Press_Start_2P'] text-[9px] sm:text-[10px] ${colorScheme.badge}`}>
                    {currentEvent.category.toUpperCase()}
                  </span>
                  <span className="px-2.5 py-1 rounded bg-purple-950/70 border border-purple-500/50 font-['Press_Start_2P'] text-[9px] sm:text-[10px] text-purple-300">
                    DAY {selectedDay} OF 3
                  </span>
                </div>

                <div className="flex items-center gap-3 text-xs sm:text-sm font-semibold text-yellow-300">
                  <span className="flex items-center gap-1.5 bg-black/40 px-3 py-1 rounded-lg border border-yellow-500/30">
                    <Clock size={14} className="text-yellow-400" />
                    <span>{currentEvent.time}</span>
                  </span>
                  <span className="flex items-center gap-1.5 bg-black/40 px-3 py-1 rounded-lg border border-pink-500/30">
                    <MapPin size={14} className="text-pink-400" />
                    <span>{currentEvent.venue}</span>
                  </span>
                </div>
              </div>

              {/* Event Title */}
              <h2 className="font-['Press_Start_2P'] text-base sm:text-2xl text-white tracking-wide mb-3 leading-snug">
                {currentEvent.title}
              </h2>

              {/* Event Description */}
              <p className="text-gray-200 text-sm sm:text-base leading-relaxed max-w-4xl mb-4 font-['Rajdhani',sans-serif] font-medium">
                {currentEvent.desc}
              </p>
            </div>

            {/* Event Action Buttons & Registration */}
            <div className="pt-4 border-t border-gray-800 flex flex-wrap items-center justify-between gap-3 mt-auto">
              <div className="text-xs text-gray-400 flex items-center gap-2">
                <Trophy size={16} className="text-yellow-400" />
                <span className="font-['Press_Start_2P'] text-[8px] sm:text-[9px]">OFFICIAL FESTIVAL COMPETITION • REVERIE 2K27</span>
              </div>

              <div className="flex items-center gap-3">
                {currentEvent.registrationLink && (
                  <a
                    href={currentEvent.registrationLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-300 hover:to-amber-400 text-black font-['Press_Start_2P'] text-[10px] sm:text-xs font-bold shadow-[0_0_20px_rgba(250,204,21,0.6)] transition-all hover:scale-105 active:scale-95"
                  >
                    <span>REGISTER ON UNSTOP</span>
                    <ExternalLink size={14} />
                  </a>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 5. BOTTOM HUD (Matching Reference 22.11.17) */}
      <div className="flex-shrink-0 flex items-center justify-between px-3 sm:px-6 py-3 bg-[#080415] border-t-2 border-yellow-500/50 shadow-inner">
        <div className="flex items-center gap-3">
          <Trophy size={20} className="text-yellow-400 hidden sm:block" />
          <div>
            <div className="font-['Press_Start_2P'] text-[8px] sm:text-[10px] text-yellow-300">
              MISSION 03: FESTIVAL SCHEDULE ROUTE
            </div>
            <div className="text-[10px] sm:text-xs text-gray-400 hidden sm:block">
              Total schedule events chomped: {totalChomped} of {festivalSchedule.length}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-4">
          {onBackToMap && (
            <button
              onClick={onBackToMap}
              className="px-3 sm:px-4 py-2 rounded-xl bg-gray-900 border border-gray-700 hover:border-gray-500 text-gray-300 font-['Press_Start_2P'] text-[9px] sm:text-[10px] transition"
            >
              ◀ WORLD MAP
            </button>
          )}
          {onAdvanceStage && (
            <button
              onClick={() => {
                soundEngine.playJump();
                onAdvanceStage();
              }}
              className="px-4 sm:px-6 py-2 rounded-xl bg-yellow-400 hover:bg-yellow-300 text-black font-['Press_Start_2P'] text-[9px] sm:text-[11px] font-bold shadow-[0_0_20px_rgba(250,204,21,0.7)] transition hover:scale-105 active:scale-95 flex items-center gap-2"
            >
              <span>NEXT STAGE ▶</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
