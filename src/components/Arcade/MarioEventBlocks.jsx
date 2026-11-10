import React, { useState } from 'react';
import { Sparkles, Trophy, Calendar, MapPin, Users, ArrowRight, Gamepad2, Coins } from 'lucide-react';
import { eventsData } from '../../data/events';
import { soundEngine } from '../../game/systems/SoundEngine';
import { achievementSystem } from '../../game/systems/AchievementSystem';
import { EventClawMachine } from './EventClawMachine';

const CATEGORIES = [
  { id: 'hackathon', name: 'HACKATHON', icon: '💻', filterTag: 'flagship', subtext: '24H Code War' },
  { id: 'robotics', name: 'ROBOTICS', icon: '🤖', filterTag: 'technical', subtext: 'Bot Combat' },
  { id: 'gaming', name: 'GAMING', icon: '🎮', filterTag: 'gaming', subtext: 'Esports Arena' },
  { id: 'quiz', name: 'QUIZ', icon: '❓', filterTag: 'technical', subtext: 'Brain Battle' },
  { id: 'design', name: 'DESIGN', icon: '🎨', filterTag: 'technical', subtext: 'UI/UX & 3D' },
  { id: 'workshop', name: 'WORKSHOP', icon: '⚡', filterTag: 'flagship', subtext: 'Hands-on Labs' },
  { id: 'cultural', name: 'CULTURAL', icon: '🎭', filterTag: 'cultural', subtext: 'DJ & Concert' }
];

export function MarioEventBlocks({ onSelectEvent, onOpenFullDirectory }) {
  const [selectedCatId, setSelectedCatId] = useState('hackathon');
  const [bouncingBlock, setBouncingBlock] = useState(null);
  const [showClawMachine, setShowClawMachine] = useState(false);
  const [currentEventIndex, setCurrentEventIndex] = useState(0);

  // Map category to matching events from eventsData
  const getCategoryEvents = (catId) => {
    switch (catId) {
      case 'hackathon':
        return eventsData.filter(e => e.id.includes('hack') || e.category === 'flagship');
      case 'robotics':
        return eventsData.filter(e => e.id.includes('robo') || e.title.toLowerCase().includes('bot') || e.category === 'technical');
      case 'gaming':
        return eventsData.filter(e => e.category === 'gaming' || e.id.includes('game') || e.id.includes('esport'));
      case 'quiz':
        return eventsData.filter(e => e.id.includes('quiz') || e.id.includes('bid') || e.id.includes('dsa'));
      case 'design':
        return eventsData.filter(e => e.id.includes('design') || e.id.includes('carnival') || e.category === 'technical');
      case 'workshop':
        return eventsData.filter(e => e.id.includes('workshop') || e.category === 'flagship');
      case 'cultural':
        return eventsData.filter(e => e.category === 'cultural' || e.id.includes('pronite') || e.id.includes('band'));
      default:
        return eventsData;
    }
  };

  const activeEvents = getCategoryEvents(selectedCatId);
  const activeEvent = activeEvents[currentEventIndex % activeEvents.length] || eventsData[0];

  const handleBlockClick = (cat) => {
    soundEngine.playCoin();
    achievementSystem.recordCoinReward(5);
    setBouncingBlock(cat.id);
    setSelectedCatId(cat.id);
    setCurrentEventIndex(0);

    setTimeout(() => {
      setBouncingBlock(null);
    }, 400);
  };

  if (showClawMachine) {
    return (
      <div className="w-full h-full flex flex-col items-center">
        <div className="w-full flex items-center justify-between px-4 py-1.5 bg-[#170a2c] border-b border-purple-500/40">
          <button
            onClick={() => setShowClawMachine(false)}
            className="px-3 py-1 rounded-lg bg-purple-900/80 hover:bg-purple-800 text-purple-200 border border-purple-400 text-xs font-mono font-bold flex items-center gap-1 cursor-pointer"
          >
            ← BACK TO QUESTION BLOCKS
          </button>
          <span className="font-display text-xs text-yellow-300 font-bold">
            STAGE 01: MYSTERY EVENT GRABBER
          </span>
        </div>
        <div className="flex-1 w-full overflow-hidden">
          <EventClawMachine 
            onSelectEvent={onSelectEvent} 
            onClose={() => setShowClawMachine(false)} 
          />
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full flex flex-col justify-between p-2 sm:p-4 bg-gradient-to-b from-[#0e0720] via-[#150a30] to-[#0c051a] select-none overflow-y-auto">
      
      {/* Top Level Title Bar */}
      <div className="flex items-center justify-between gap-2 px-2 py-1.5 rounded-xl bg-[#1b0d3d]/90 border border-pink-500/50 shadow-md">
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 rounded-md bg-yellow-400 text-black font-display text-[10px] font-black tracking-widest">
            STAGE 01
          </span>
          <h2 className="font-display text-xs sm:text-sm font-black text-white tracking-wider">
            LEVEL SELECT: 7 EVENT REALMS
          </h2>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowClawMachine(true)}
            className="px-2.5 py-1 rounded-lg bg-gradient-to-r from-pink-500 to-rose-600 text-white font-display text-[10px] font-black tracking-wider uppercase border border-pink-300 hover:scale-105 active:scale-95 cursor-pointer shadow flex items-center gap-1"
          >
            <Gamepad2 size={12} />
            <span>CLAW MACHINE MODE</span>
          </button>
        </div>
      </div>

      {/* 7 Question Mark Blocks Row */}
      <div className="my-2 sm:my-3">
        <div className="text-center mb-1.5">
          <span className="text-[10px] sm:text-xs font-mono text-purple-300 tracking-widest uppercase font-bold">
            HIT A QUESTION BLOCK TO UNLOCK EVENT CATEGORY (+5 COINS)
          </span>
        </div>

        <div className="grid grid-cols-4 sm:grid-cols-7 gap-2 sm:gap-3 max-w-3xl mx-auto px-1">
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCatId === cat.id;
            const isBouncing = bouncingBlock === cat.id;

            return (
              <button
                key={cat.id}
                onClick={() => handleBlockClick(cat)}
                className={`group relative flex flex-col items-center justify-center p-2 rounded-xl transition-all duration-200 cursor-pointer ${
                  isSelected
                    ? 'bg-gradient-to-b from-amber-400 via-yellow-500 to-amber-600 border-2 border-white shadow-[0_0_20px_rgba(250,204,21,0.8)] scale-105'
                    : 'bg-gradient-to-b from-yellow-500 to-amber-700 border-2 border-amber-300/70 hover:scale-102 hover:border-yellow-200 shadow-md'
                } ${isBouncing ? '-translate-y-3 shadow-[0_12px_20px_rgba(250,204,21,0.9)]' : ''}`}
              >
                {/* 3D Question Block Studs */}
                <span className="absolute top-1 left-1.5 w-1 h-1 rounded-full bg-amber-900/40" />
                <span className="absolute top-1 right-1.5 w-1 h-1 rounded-full bg-amber-900/40" />
                <span className="absolute bottom-1 left-1.5 w-1 h-1 rounded-full bg-amber-900/40" />
                <span className="absolute bottom-1 right-1.5 w-1 h-1 rounded-full bg-amber-900/40" />

                {/* Animated Flying Coin when hit */}
                {isBouncing && (
                  <div className="absolute -top-7 animate-bounce text-yellow-300 font-mono text-xs font-black drop-shadow">
                    🪙 +5
                  </div>
                )}

                <div className="w-8 h-8 rounded-lg bg-amber-900/50 flex items-center justify-center mb-1 text-white text-base font-black shadow-inner">
                  {cat.icon}
                </div>

                <span className="font-display text-[9px] sm:text-[10px] font-black text-amber-950 uppercase tracking-wider text-center leading-tight">
                  {cat.name}
                </span>

                <span className="text-[7px] font-mono font-bold text-amber-900/80 uppercase mt-0.5 hidden sm:block">
                  {cat.subtext}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Featured Mission Card for Selected Category */}
      <div className="relative flex-1 max-w-3xl w-full mx-auto rounded-2xl bg-gradient-to-b from-[#1b0d3a] via-[#13072b] to-[#0d041c] border-2 border-purple-500/70 p-3 sm:p-4 shadow-xl flex flex-col justify-between overflow-hidden">
        
        {/* Top Mission HUD */}
        <div className="flex items-center justify-between border-b border-purple-800/80 pb-2 mb-2">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-cyan-950 border border-cyan-400 text-cyan-300 font-mono text-[9px] font-bold uppercase">
              MISSION TARGET
            </span>
            <span className="font-display text-xs sm:text-sm font-black text-white tracking-wider">
              {activeEvent.title}
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-yellow-300 font-mono font-bold">
            <Trophy size={14} className="text-yellow-400" />
            <span>{activeEvent.prizePool || '₹30,000+ PRIZE'}</span>
          </div>
        </div>

        {/* Content Body: Banner + Metadata */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center flex-1 my-1">
          {/* Event Visual Artwork */}
          <div className="sm:col-span-5 relative rounded-xl overflow-hidden border border-purple-400/50 h-28 sm:h-36 bg-black flex items-center justify-center">
            {activeEvent.image ? (
              <img 
                src={activeEvent.image} 
                alt={activeEvent.title} 
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            ) : null}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
            <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between">
              <span className="px-2 py-0.5 rounded bg-pink-900/90 border border-pink-400 text-pink-200 font-mono text-[8px] font-bold uppercase">
                {activeEvent.category}
              </span>
              <span className="text-[9px] font-mono text-cyan-300 font-bold">
                {activeEvent.teamSize || 'Solo / Team'}
              </span>
            </div>
          </div>

          {/* Mission Briefing Details */}
          <div className="sm:col-span-7 flex flex-col justify-between h-full py-1">
            <div>
              <p className="text-[11px] sm:text-xs text-slate-300 leading-relaxed line-clamp-3 mb-2">
                {activeEvent.description || activeEvent.shortDesc}
              </p>

              <div className="grid grid-cols-2 gap-2 text-[10px] font-mono text-purple-200/90 mb-2">
                <div className="flex items-center gap-1">
                  <MapPin size={12} className="text-pink-400 shrink-0" />
                  <span className="truncate">{activeEvent.venue || 'Campus Arena'}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar size={12} className="text-cyan-400 shrink-0" />
                  <span className="truncate">{activeEvent.status || 'Reg Open'}</span>
                </div>
              </div>
            </div>

            {/* Other events in this category pill selector */}
            {activeEvents.length > 1 && (
              <div className="flex items-center gap-1.5 overflow-x-auto py-1 mb-1">
                <span className="text-[8px] font-mono text-purple-400 shrink-0 uppercase font-bold">MORE IN REALM:</span>
                {activeEvents.map((ev, idx) => (
                  <button
                    key={ev.id}
                    onClick={() => {
                      soundEngine.playBlip();
                      setCurrentEventIndex(idx);
                    }}
                    className={`px-2 py-0.5 rounded text-[8px] font-mono uppercase whitespace-nowrap cursor-pointer transition-colors ${
                      idx === currentEventIndex
                        ? 'bg-cyan-500 text-black font-bold'
                        : 'bg-purple-950/80 text-purple-300 hover:bg-purple-900'
                    }`}
                  >
                    {ev.title}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Action Bar */}
        <div className="flex items-center justify-between pt-2 border-t border-purple-800/80 mt-1">
          <button
            onClick={onOpenFullDirectory}
            className="text-[10px] font-mono font-bold text-cyan-300 hover:text-cyan-200 underline cursor-pointer"
          >
            VIEW ALL 18 FESTIVAL EVENTS →
          </button>

          <button
            onClick={() => onSelectEvent(activeEvent)}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-pink-500 to-rose-600 text-white font-display text-xs font-black tracking-widest uppercase border-2 border-pink-200 shadow-[0_4px_0_#831843,0_0_15px_rgba(244,63,94,0.6)] hover:scale-105 active:scale-95 cursor-pointer flex items-center gap-1.5"
          >
            <span>START MISSION [E]</span>
            <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
