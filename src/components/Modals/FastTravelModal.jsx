import React, { useState } from 'react';
import { X, Map, Compass, Sparkles, ArrowRight, CheckCircle2, MapPin, Zap, ExternalLink, Radio } from 'lucide-react';
import { eventBus } from '../../game/EventBus';
import { soundEngine } from '../../game/systems/SoundEngine';
import { achievementSystem } from '../../game/systems/AchievementSystem';
import { eventsData } from '../../data/events';
import { Tilt3DCard } from '../ThreeD/Tilt3DCard';

export function FastTravelModal({ currentZoneKey = 'StartingKingdomScene', onClose, onOpenDirectory, onSelectEvent }) {
  const [selectedKingdomId, setSelectedKingdomId] = useState(currentZoneKey);
  const visitedZones = achievementSystem.state.visitedZones || ['StartingKingdomScene'];

  const kingdoms = [
    {
      id: 'StartingKingdomScene',
      zoneNum: '01',
      name: 'STARTING KINGDOM',
      subtitle: 'CAMPUS GATEWAY & WELCOME HUB',
      iconEmoji: '🏰',
      accentColor: '#f59e0b',
      borderClass: 'border-amber-400',
      textClass: 'text-amber-300',
      bgGrad: 'from-amber-950/40 via-[#140b2a] to-[#0c061e]',
      btnGrad: 'from-amber-500 to-yellow-600 hover:from-amber-400 hover:to-yellow-500 text-slate-950',
      desc: 'Campus gateway & welcome hub. Begin your REVERIE journey here!',
      highlights: ['IIIT Kota Tower', 'Avatar Wardrobe', 'About Reverie', 'Kota Bot'],
      eventIds: [],
      // SVG Island positioning in 1000x520 map coordinate system
      mapX: 200,
      mapY: 155
    },
    {
      id: 'TechKingdomScene',
      zoneNum: '02',
      name: 'TECH KINGDOM',
      subtitle: 'CYBERPUNK NEON METROPOLIS',
      iconEmoji: '💻',
      accentColor: '#06b6d4',
      borderClass: 'border-cyan-400',
      textClass: 'text-cyan-300',
      bgGrad: 'from-cyan-950/40 via-[#140b2a] to-[#0c061e]',
      btnGrad: 'from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950',
      desc: 'Cyberpunk arena for coding, robotics, trading and esports battles.',
      highlights: ['DSA Sprint', 'Byte-Break', 'Endeavour', 'TradeX', 'Robo Soccer', 'Summit League', 'DesignX'],
      eventIds: ['dsa-sprint', 'byte-break', 'endeavour', 'tradex', 'robo-soccer', 'summit-league', 'designx'],
      mapX: 500,
      mapY: 130
    },
    {
      id: 'CultureKingdomScene',
      zoneNum: '03',
      name: 'CULTURE KINGDOM',
      subtitle: 'CONCERT STAGE & ARENA',
      iconEmoji: '🎵',
      accentColor: '#ec4899',
      borderClass: 'border-pink-400',
      textClass: 'text-pink-300',
      bgGrad: 'from-pink-950/40 via-[#140b2a] to-[#0c061e]',
      btnGrad: 'from-pink-500 to-fuchsia-600 hover:from-pink-400 hover:to-fuchsia-500 text-white',
      desc: 'Music, dance, fashion and creative showdowns. The cultural heart of REVERIE.',
      highlights: ['Among Us', 'Band Night', 'Squid Game', 'Concert Night', 'Fashion Show', 'Dance Battle', 'Botanical Bid'],
      eventIds: ['among-us', 'band-night', 'squid-game', 'concert-night', 'fashion-show', 'dance-battle', 'botanical-bid'],
      mapX: 800,
      mapY: 160
    },
    {
      id: 'FlagshipScene',
      zoneNum: '04',
      name: 'FLAGSHIP KINGDOM',
      subtitle: 'CARNIVAL & PRONITE ARENA',
      iconEmoji: '🎡',
      accentColor: '#f97316',
      borderClass: 'border-amber-500',
      textClass: 'text-amber-400',
      bgGrad: 'from-purple-950/40 via-[#140b2a] to-[#0c061e]',
      btnGrad: 'from-purple-600 via-pink-600 to-amber-500 hover:from-purple-500 hover:to-amber-400 text-white',
      desc: 'Hackathons, flagship events, ProNite and carnival experiences at one grand venue.',
      highlights: ['HackTheChain 24H', 'Carnival & Games', 'Pronite DJ Night', 'Faculty Fumble'],
      eventIds: ['hackthechain', 'carnival-games', 'pronite-dj', 'faculty-fumble'],
      mapX: 230,
      mapY: 360
    },
    {
      id: 'FestivalPlazaScene',
      zoneNum: '05',
      name: 'FESTIVAL PLAZA',
      subtitle: 'CENTRAL HONORS PAVILION',
      iconEmoji: '⛲',
      accentColor: '#10b981',
      borderClass: 'border-emerald-400',
      textClass: 'text-emerald-300',
      bgGrad: 'from-emerald-950/40 via-[#140b2a] to-[#0c061e]',
      btnGrad: 'from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950',
      desc: 'The central hub for information, announcements, sponsors and gallery.',
      highlights: ['₹1.5L+ Prizes', '30+ Sponsors', 'Past Glimpses', 'Secretariat Hub'],
      eventIds: [],
      mapX: 520,
      mapY: 345
    }
  ];

  const handleTravel = (sceneKey) => {
    soundEngine.playPipe();
    eventBus.emit('switch-zone', sceneKey);
    onClose();
  };

  const handleSelectEventDirect = (eventId) => {
    const fullEvent = eventsData.find((e) => e.id === eventId);
    if (fullEvent && onSelectEvent) {
      soundEngine.playCoin();
      onClose();
      onSelectEvent(fullEvent);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/90 backdrop-blur-md animate-fadeIn select-none">
      <div className="relative w-full max-w-6xl max-h-[96vh] flex flex-col bg-[#0b051c] border-2 border-purple-500/80 rounded-3xl shadow-[0_0_50px_rgba(168,85,247,0.35)] overflow-hidden">
        
        {/* ========================================================================= */}
        {/* TOP BAR: Logo, Title, Kingdoms Explored & Close [X]                       */}
        {/* ========================================================================= */}
        <div className="flex items-center justify-between p-3.5 sm:p-5 border-b border-purple-900/60 bg-gradient-to-r from-[#170933] via-[#0d0720] to-[#170933] shrink-0">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <img 
                src="/assets/branding/reverie_logo.png" 
                alt="REVERIE" 
                className="h-6 sm:h-7 w-auto object-contain filter drop-shadow-[0_0_8px_rgba(255,255,255,0.7)]"
              />
              <span className="font-display text-xs sm:text-sm text-yellow-400 font-black tracking-wider">
                2K27
              </span>
            </div>
            <div className="h-4 w-px bg-purple-800 hidden sm:block" />
            <div>
              <h2 className="font-display text-sm sm:text-xl text-white font-black tracking-wider uppercase">
                INTERACTIVE FESTIVAL MAP
              </h2>
              <div className="flex items-center gap-2 font-display text-[10px] sm:text-xs text-purple-300 font-bold uppercase tracking-wider">
                <span className="text-pink-400">WARP NETWORK</span>
                <span>•</span>
                <span className="text-yellow-400">{visitedZones.length} / 5 KINGDOMS EXPLORED</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => {
              soundEngine.playBlip();
              onClose();
            }}
            className="p-2 sm:px-3 sm:py-1.5 rounded-xl bg-slate-900/90 hover:bg-rose-950 text-slate-300 hover:text-white border border-slate-700/80 hover:border-rose-500/80 transition-all cursor-pointer flex items-center gap-1.5 font-display text-xs font-bold"
          >
            <span className="hidden sm:inline">CLOSE [ESC]</span>
            <X size={18} />
          </button>
        </div>

        {/* ========================================================================= */}
        {/* MAIN VISUAL: 5 FLOATING ISLANDS INTERACTIVE CANVAS                        */}
        {/* ========================================================================= */}
        <div className="relative w-full flex-1 min-h-[340px] sm:min-h-[420px] bg-[#070312] overflow-hidden">
          
          {/* Starry Sky & Nebula Background */}
          <div 
            className="absolute inset-0 bg-cover bg-center opacity-40 pointer-events-none"
            style={{ backgroundImage: `url('/assets/backgrounds/bg_stars.png')` }}
          />

          {/* Distant Planet in Top-Left */}
          <div className="absolute top-5 left-6 w-12 h-12 rounded-full border border-purple-400/30 bg-purple-950/40 pointer-events-none flex items-center justify-center opacity-60">
            <div className="w-16 h-2 border border-purple-400/40 rotate-[-25deg] rounded-full" />
          </div>

          {/* Glowing Full Moon in Top-Right */}
          <div className="absolute top-6 right-12 w-16 h-16 rounded-full bg-gradient-to-br from-purple-200 via-pink-300 to-indigo-900 opacity-60 shadow-[0_0_30px_rgba(236,72,153,0.3)] pointer-events-none" />

          {/* Cityscape Glow Silhouette on Horizon */}
          <div 
            className="absolute bottom-0 inset-x-0 h-28 bg-repeat-x bg-bottom opacity-20 pointer-events-none"
            style={{ backgroundImage: `url('/assets/backgrounds/bg_skyline.png')` }}
          />

          {/* SVG Glowing Warp Energy Conduits Connecting the Islands */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 1000 520" preserveAspectRatio="none">
            <defs>
              <linearGradient id="pipeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#a855f7" stopOpacity="0.8" />
                <stop offset="50%" stopColor="#ec4899" stopOpacity="0.9" />
                <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.8" />
              </linearGradient>
              <filter id="glow">
                <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                <feMerge>
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
            </defs>

            {/* Conduit Pipe Path 1: Starting (200, 155) -> Tech (500, 130) */}
            <path d="M 270 170 Q 380 140 440 145" fill="none" stroke="#a855f7" strokeWidth="6" strokeLinecap="round" filter="url(#glow)" />
            <path d="M 270 170 Q 380 140 440 145" fill="none" stroke="#ec4899" strokeWidth="2" strokeDasharray="6,8" className="animate-pulse" />

            {/* Conduit Pipe Path 2: Tech (500, 130) -> Culture (800, 160) */}
            <path d="M 560 145 Q 670 140 730 170" fill="none" stroke="#a855f7" strokeWidth="6" strokeLinecap="round" filter="url(#glow)" />
            <path d="M 560 145 Q 670 140 730 170" fill="none" stroke="#06b6d4" strokeWidth="2" strokeDasharray="6,8" className="animate-pulse" />

            {/* Conduit Pipe Path 3: Starting (200, 155) -> Flagship (230, 360) */}
            <path d="M 210 210 Q 180 290 220 330" fill="none" stroke="#a855f7" strokeWidth="6" strokeLinecap="round" filter="url(#glow)" />
            <path d="M 210 210 Q 180 290 220 330" fill="none" stroke="#f59e0b" strokeWidth="2" strokeDasharray="6,8" className="animate-pulse" />

            {/* Conduit Pipe Path 4: Flagship (230, 360) -> Plaza (520, 345) */}
            <path d="M 300 375 Q 400 385 450 365" fill="none" stroke="#a855f7" strokeWidth="6" strokeLinecap="round" filter="url(#glow)" />
            <path d="M 300 375 Q 400 385 450 365" fill="none" stroke="#10b981" strokeWidth="2" strokeDasharray="6,8" className="animate-pulse" />

            {/* Conduit Pipe Path 5: Plaza (520, 345) -> Culture (800, 160) */}
            <path d="M 590 355 Q 730 360 760 210" fill="none" stroke="#a855f7" strokeWidth="6" strokeLinecap="round" filter="url(#glow)" />
            <path d="M 590 355 Q 730 360 760 210" fill="none" stroke="#ec4899" strokeWidth="2" strokeDasharray="6,8" className="animate-pulse" />
          </svg>

          {/* ======================================================================= */}
          {/* 5 FLOATING ISLANDS MATCHING REFERENCE BLUEPRINT                         */}
          {/* ======================================================================= */}
          {/* Island 1: STARTING KINGDOM (Top-Left) */}
          <div 
            onClick={() => {
              soundEngine.playSelect();
              setSelectedKingdomId('StartingKingdomScene');
            }}
            className={`absolute top-[8%] left-[4%] sm:left-[8%] w-44 sm:w-56 p-2.5 rounded-2xl cursor-pointer transition-all duration-300 group ${
              selectedKingdomId === 'StartingKingdomScene' ? 'scale-105 z-30' : 'hover:scale-102 z-20'
            }`}
          >
            {/* Floating Island Graphic Card */}
            <div className="relative rounded-2xl bg-gradient-to-b from-[#1b2a1a]/90 via-[#180f2d] to-[#0c061a] border-2 border-yellow-400/80 p-3 shadow-[0_0_25px_rgba(250,204,21,0.3)]">
              {/* Waterfall & Castle Graphic Details */}
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-1.5">
                  <span className="text-xl">🏰</span>
                  <span className="font-display text-xs text-yellow-300 font-black">STARTING</span>
                </div>
                {/* Status indicator */}
                {currentZoneKey === 'StartingKingdomScene' ? (
                  <span className="font-display text-[9px] bg-yellow-400 text-slate-950 font-black px-1.5 py-0.5 rounded flex items-center gap-0.5">
                    <MapPin size={9} /> HERE
                  </span>
                ) : (
                  <span className="font-display text-[9px] bg-emerald-950 text-emerald-300 border border-emerald-500 font-bold px-1.5 py-0.5 rounded flex items-center gap-0.5">
                    <CheckCircle2 size={9} /> VISITED
                  </span>
                )}
              </div>

              {/* Island illustration content */}
              <div className="relative h-16 sm:h-20 bg-gradient-to-t from-emerald-950/60 to-purple-950/30 rounded-xl border border-emerald-500/40 overflow-hidden flex items-end justify-between px-2 pb-1.5">
                {/* Pixel Mario with Location Marker */}
                <div className="flex flex-col items-center">
                  <span className="font-display text-[8px] bg-yellow-400 text-slate-950 font-black px-1 rounded animate-bounce">
                    📍 YOU
                  </span>
                  <img src="/assets/sprites/player_mario.png" alt="Mario" className="w-7 h-7 object-none image-rendering-pixelated" style={{ objectPosition: '0 0' }} />
                </div>

                {/* Pixel Castle & Mushroom */}
                <div className="flex items-end gap-1.5">
                  <span className="text-base">🍄</span>
                  <span className="text-2xl">🏯</span>
                </div>
              </div>

              {/* Island Name Badge */}
              <div className="mt-2 text-center bg-black/60 border border-yellow-400/50 py-1 rounded-lg">
                <span className="font-display text-[10px] text-yellow-300 font-black uppercase tracking-wider">
                  STARTING KINGDOM ✓
                </span>
              </div>
            </div>
          </div>

          {/* Island 2: TECH KINGDOM (Top-Center) */}
          <div 
            onClick={() => {
              soundEngine.playSelect();
              setSelectedKingdomId('TechKingdomScene');
            }}
            className={`absolute top-[4%] left-[37%] sm:left-[41%] w-44 sm:w-56 p-2.5 rounded-2xl cursor-pointer transition-all duration-300 group ${
              selectedKingdomId === 'TechKingdomScene' ? 'scale-105 z-30' : 'hover:scale-102 z-20'
            }`}
          >
            <div className="relative rounded-2xl bg-gradient-to-b from-[#0d2a33]/90 via-[#180f2d] to-[#0c061a] border-2 border-cyan-400/80 p-3 shadow-[0_0_25px_rgba(6,182,212,0.3)]">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-1.5">
                  <span className="text-xl">💻</span>
                  <span className="font-display text-xs text-cyan-300 font-black">TECH</span>
                </div>
                <span className="font-display text-[9px] bg-cyan-950 text-cyan-300 border border-cyan-500 font-bold px-1.5 py-0.5 rounded">
                  7 EVENTS
                </span>
              </div>

              {/* Cyber Skyline & Code Marquee Illustration */}
              <div className="relative h-16 sm:h-20 bg-gradient-to-t from-cyan-950/60 to-purple-950/30 rounded-xl border border-cyan-500/40 overflow-hidden flex items-end justify-between px-2 pb-1.5">
                <div className="flex items-center gap-1">
                  <span className="font-display text-[9px] text-cyan-300 bg-black/80 px-1.5 py-0.5 rounded border border-cyan-400 font-black">
                    &lt;/&gt;
                  </span>
                  <span className="text-lg">📡</span>
                </div>
                <div className="flex items-end gap-1">
                  <div className="w-3 h-12 bg-cyan-500/80 rounded-t" />
                  <div className="w-4 h-16 bg-blue-600/80 rounded-t" />
                  <div className="w-3 h-10 bg-indigo-500/80 rounded-t" />
                </div>
              </div>

              <div className="mt-2 text-center bg-black/60 border border-cyan-400/50 py-1 rounded-lg">
                <span className="font-display text-[10px] text-cyan-300 font-black uppercase tracking-wider">
                  TECH KINGDOM {visitedZones.includes('TechKingdomScene') ? '✓' : '○'}
                </span>
              </div>
            </div>
          </div>

          {/* Island 3: CULTURE KINGDOM (Top-Right) */}
          <div 
            onClick={() => {
              soundEngine.playSelect();
              setSelectedKingdomId('CultureKingdomScene');
            }}
            className={`absolute top-[8%] right-[4%] sm:right-[8%] w-44 sm:w-56 p-2.5 rounded-2xl cursor-pointer transition-all duration-300 group ${
              selectedKingdomId === 'CultureKingdomScene' ? 'scale-105 z-30' : 'hover:scale-102 z-20'
            }`}
          >
            <div className="relative rounded-2xl bg-gradient-to-b from-[#330d28]/90 via-[#180f2d] to-[#0c061a] border-2 border-pink-400/80 p-3 shadow-[0_0_25px_rgba(236,72,153,0.3)]">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-1.5">
                  <span className="text-xl">🎵</span>
                  <span className="font-display text-xs text-pink-300 font-black">CULTURE</span>
                </div>
                <span className="font-display text-[9px] bg-pink-950 text-pink-300 border border-pink-500 font-bold px-1.5 py-0.5 rounded">
                  7 EVENTS
                </span>
              </div>

              {/* Amphitheater Stage & Equalizer Illustration */}
              <div className="relative h-16 sm:h-20 bg-gradient-to-t from-pink-950/60 to-purple-950/30 rounded-xl border border-pink-500/40 overflow-hidden flex items-end justify-between px-2 pb-1.5">
                <span className="text-lg">📢</span>
                <div className="flex flex-col items-center">
                  <span className="text-pink-300 text-xs font-bold animate-pulse">♪ ♫</span>
                  <div className="w-12 h-6 bg-pink-600/80 rounded-t-lg border-t-2 border-yellow-300 flex items-center justify-center text-[8px] font-black text-white">
                    STAGE
                  </div>
                </div>
                <span className="text-lg">📢</span>
              </div>

              <div className="mt-2 text-center bg-black/60 border border-pink-400/50 py-1 rounded-lg">
                <span className="font-display text-[10px] text-pink-300 font-black uppercase tracking-wider">
                  CULTURE KINGDOM {visitedZones.includes('CultureKingdomScene') ? '✓' : '○'}
                </span>
              </div>
            </div>
          </div>

          {/* Island 4: FLAGSHIP KINGDOM (Bottom-Left) */}
          <div 
            onClick={() => {
              soundEngine.playSelect();
              setSelectedKingdomId('FlagshipScene');
            }}
            className={`absolute bottom-[10%] left-[8%] sm:left-[12%] w-44 sm:w-56 p-2.5 rounded-2xl cursor-pointer transition-all duration-300 group ${
              selectedKingdomId === 'FlagshipScene' ? 'scale-105 z-30' : 'hover:scale-102 z-20'
            }`}
          >
            <div className="relative rounded-2xl bg-gradient-to-b from-[#2e123a]/90 via-[#180f2d] to-[#0c061a] border-2 border-purple-400/80 p-3 shadow-[0_0_25px_rgba(168,85,247,0.3)]">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-1.5">
                  <span className="text-xl">🎪</span>
                  <span className="font-display text-xs text-purple-300 font-black">FLAGSHIP</span>
                </div>
                <span className="font-display text-[9px] bg-purple-950 text-purple-300 border border-purple-500 font-bold px-1.5 py-0.5 rounded">
                  4 ATTRACTIONS
                </span>
              </div>

              {/* Carnival Ferris Wheel & Tents Illustration */}
              <div className="relative h-16 sm:h-20 bg-gradient-to-t from-purple-950/60 to-amber-950/30 rounded-xl border border-purple-500/40 overflow-hidden flex items-end justify-between px-2 pb-1.5">
                <div className="text-2xl animate-spin" style={{ animationDuration: '10s' }}>
                  🎡
                </div>
                <div className="flex items-end gap-1">
                  <span className="text-lg">🎪</span>
                  <span className="text-sm">🎈</span>
                </div>
              </div>

              <div className="mt-2 text-center bg-black/60 border border-purple-400/50 py-1 rounded-lg">
                <span className="font-display text-[10px] text-purple-300 font-black uppercase tracking-wider">
                  FLAGSHIP KINGDOM {visitedZones.includes('FlagshipScene') ? '✓' : '○'}
                </span>
              </div>
            </div>
          </div>

          {/* Island 5: FESTIVAL PLAZA (Bottom-Center) */}
          <div 
            onClick={() => {
              soundEngine.playSelect();
              setSelectedKingdomId('FestivalPlazaScene');
            }}
            className={`absolute bottom-[6%] left-[40%] sm:left-[43%] w-48 sm:w-60 p-2.5 rounded-2xl cursor-pointer transition-all duration-300 group ${
              selectedKingdomId === 'FestivalPlazaScene' ? 'scale-105 z-30' : 'hover:scale-102 z-20'
            }`}
          >
            <div className="relative rounded-2xl bg-gradient-to-b from-[#123326]/90 via-[#180f2d] to-[#0c061a] border-2 border-emerald-400/80 p-3 shadow-[0_0_25px_rgba(16,185,129,0.35)]">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-1.5">
                  <span className="text-xl">🏛️</span>
                  <span className="font-display text-xs text-emerald-300 font-black">PLAZA</span>
                </div>
                <span className="font-display text-[9px] bg-emerald-950 text-emerald-300 border border-emerald-500 font-bold px-1.5 py-0.5 rounded">
                  CENTRAL HUB
                </span>
              </div>

              {/* Fountain & Secretariat Arch Illustration */}
              <div className="relative h-16 sm:h-20 bg-gradient-to-t from-emerald-950/60 to-cyan-950/30 rounded-xl border border-emerald-500/40 overflow-hidden flex items-end justify-between px-2 pb-1.5">
                <span className="text-lg">🌸</span>
                <div className="flex flex-col items-center">
                  <span className="text-cyan-300 text-xs animate-bounce">⛲</span>
                  <div className="w-10 h-3 bg-cyan-900/80 border border-cyan-400 rounded-full" />
                </div>
                <span className="text-base font-bold text-emerald-300 bg-black/60 px-1 rounded">ℹ️</span>
              </div>

              <div className="mt-2 text-center bg-black/60 border border-emerald-400/50 py-1 rounded-lg">
                <span className="font-display text-[10px] text-emerald-300 font-black uppercase tracking-wider">
                  FESTIVAL PLAZA {visitedZones.includes('FestivalPlazaScene') ? '✓' : '○'}
                </span>
              </div>
            </div>
          </div>

          {/* ======================================================================= */}
          {/* MAP LEGEND CARD (Matching Reference Image)                             */}
          {/* ======================================================================= */}
          <div className="absolute bottom-4 right-4 sm:right-6 bg-[#13072b]/95 border border-purple-500/60 rounded-xl p-2.5 sm:p-3 shadow-xl backdrop-blur-md hidden sm:block z-30">
            <div className="font-display text-[9px] text-yellow-400 font-black tracking-widest uppercase mb-1.5 text-center">
              --&gt;&gt; LEGEND &lt;&lt;--
            </div>
            <div className="space-y-1 font-display text-[10px] font-bold">
              <div className="flex items-center gap-2 text-emerald-300">
                <CheckCircle2 size={12} className="text-emerald-400" />
                <span>Visited Destination</span>
              </div>
              <div className="flex items-center gap-2 text-yellow-300">
                <MapPin size={12} className="text-yellow-400" />
                <span>Current Location</span>
              </div>
              <div className="flex items-center gap-2 text-slate-400">
                <span className="w-2.5 h-2.5 rounded-full border border-slate-500 ml-0.5 inline-block" />
                <span>Undiscovered</span>
              </div>
            </div>
          </div>

        </div>

        {/* ========================================================================= */}
        {/* BOTTOM SECTION: 5 KINGDOM DESTINATION CARDS ROW (Exact Blueprint)        */}
        {/* ========================================================================= */}
        <div className="p-3 sm:p-4 border-t border-purple-900/60 bg-[#0d0722] shrink-0">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5 sm:gap-3">
            {kingdoms.map((k) => {
              const isSelected = selectedKingdomId === k.id;
              const isCurrent = currentZoneKey === k.id;

              return (
                <Tilt3DCard
                  key={k.id}
                  maxTilt={12}
                  perspective={700}
                  scale={1.03}
                  glareOpacity={0.25}
                  onClick={() => {
                    soundEngine.playSelect();
                    setSelectedKingdomId(k.id);
                  }}
                  className={`p-3 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between gap-2 ${
                    isSelected
                      ? `${k.borderClass} bg-gradient-to-b ${k.bgGrad} shadow-lg scale-[1.02]`
                      : 'border-purple-900/40 bg-[#12082b]/80 hover:border-purple-500/60'
                  }`}
                >
                  <div style={{ transform: 'translateZ(15px)' }}>
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-1.5">
                        <span className="text-base">{k.iconEmoji}</span>
                        <h4 className="font-display text-xs font-black text-white truncate">
                          {k.name}
                        </h4>
                      </div>
                      {isCurrent ? (
                        <span className="font-display text-[9px] bg-yellow-400 text-slate-950 font-black px-1.5 py-0.2 rounded">
                          HERE
                        </span>
                      ) : visitedZones.includes(k.id) ? (
                        <span className="font-display text-[9px] text-emerald-400">
                          ✓
                        </span>
                      ) : null}
                    </div>

                    <p className="font-body text-[11px] text-slate-300 leading-snug line-clamp-2">
                      {k.desc}
                    </p>
                  </div>

                  {/* Explore / Warp Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleTravel(k.id);
                    }}
                    style={{ transform: 'translateZ(20px)' }}
                    className={`w-full py-1.5 px-3 rounded-xl font-display text-[11px] font-black uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all shadow-md ${
                      isCurrent
                        ? 'bg-yellow-400/20 text-yellow-300 border border-yellow-400/40'
                        : `bg-gradient-to-r ${k.btnGrad}`
                    }`}
                  >
                    <span>{isCurrent ? 'CURRENT LOCATION' : 'EXPLORE'}</span>
                    {!isCurrent && <ArrowRight size={12} />}
                  </button>
                </Tilt3DCard>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}
