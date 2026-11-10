import React, { useState, useEffect, useRef } from 'react';
import { Play, RotateCcw, Award, ChevronLeft, ChevronRight, X, Sparkles, Coins } from 'lucide-react';
import { eventsData } from '../../data/events';
import { soundEngine } from '../../game/systems/SoundEngine';
import { achievementSystem } from '../../game/systems/AchievementSystem';
import confetti from 'canvas-confetti';

const CAPSULE_COLORS = [
  '#f43f5e', '#06b6d4', '#eab308', '#a855f7', '#10b981', '#ec4899', '#f97316'
];

export function EventClawMachine({ onSelectEvent, onClose }) {
  const [clawX, setClawX] = useState(50); // percentage 10% to 90%
  const [clawY, setClawY] = useState(15); // percentage 15% (top) to 70% (bottom)
  const [clawState, setClawState] = useState('idle'); // idle | dropping | grabbing | returning | opening
  const [wonEvent, setWonEvent] = useState(null);
  const [wonColor, setWonColor] = useState('#f43f5e');
  const [attempts, setAttempts] = useState(3);
  const [coinsWon, setCoinsWon] = useState(0);

  // Pre-generate 12 decorative capsules in the pit
  const [capsules] = useState(() => {
    return Array.from({ length: 14 }).map((_, i) => ({
      id: i,
      x: 12 + (i % 7) * 11 + (Math.random() * 4 - 2),
      y: 72 + Math.floor(i / 7) * 9 + (Math.random() * 3 - 1.5),
      color: CAPSULE_COLORS[i % CAPSULE_COLORS.length],
      eventIndex: i % eventsData.length,
      rotation: Math.random() * 40 - 20
    }));
  });

  const moveLeft = () => {
    if (clawState !== 'idle') return;
    soundEngine.playBlip();
    setClawX(prev => Math.max(15, prev - 8));
  };

  const moveRight = () => {
    if (clawState !== 'idle') return;
    soundEngine.playBlip();
    setClawX(prev => Math.min(85, prev + 8));
  };

  const dropClaw = () => {
    if (clawState !== 'idle') return;
    soundEngine.playJump();
    setClawState('dropping');

    // Find nearest capsule
    const targetCapsule = capsules.reduce((prev, curr) => {
      const prevDist = Math.abs(prev.x - clawX);
      const currDist = Math.abs(curr.x - clawX);
      return currDist < prevDist ? curr : prev;
    }, capsules[0]);

    // Animate claw drop down
    setTimeout(() => {
      setClawY(70);
      setClawState('grabbing');
      soundEngine.playBlip();

      // Grab capsule and pull up
      setTimeout(() => {
        setClawState('returning');
        setClawY(15);

        // Move to chute at left (x = 18%)
        setTimeout(() => {
          setClawX(18);

          // Drop into chute and reveal prize
          setTimeout(() => {
            soundEngine.playFanfare();
            const picked = eventsData[targetCapsule.eventIndex] || eventsData[0];
            setWonEvent(picked);
            setWonColor(targetCapsule.color);
            setClawState('opening');
            setCoinsWon(prev => prev + 50);
            achievementSystem.recordCoinReward(50);

            try {
              confetti({
                particleCount: 50,
                spread: 70,
                origin: { y: 0.6 }
              });
            } catch (e) {}
          }, 700);
        }, 900);
      }, 700);
    }, 1000);
  };

  const resetGame = () => {
    setClawState('idle');
    setClawX(50);
    setClawY(15);
    setWonEvent(null);
  };

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-between p-3 bg-gradient-to-b from-[#18092e] to-[#0a0418] text-white select-none">
      
      {/* Top Arcade Sign */}
      <div className="flex items-center justify-between w-full max-w-xl px-3 py-1.5 rounded-xl bg-[#261047] border border-pink-500/60 shadow-[0_0_15px_rgba(236,72,153,0.3)]">
        <div className="flex items-center gap-2">
          <Sparkles size={18} className="text-yellow-400 animate-spin" />
          <span className="font-display text-xs sm:text-sm font-black tracking-widest text-pink-300">
            FESTIVAL CLAW MACHINE
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className="font-mono text-xs text-yellow-300 flex items-center gap-1 font-bold">
            <Coins size={14} className="text-yellow-400" /> +{coinsWon}
          </span>
          {onClose && (
            <button 
              onClick={onClose}
              className="p-1 rounded-lg bg-pink-900/60 hover:bg-pink-800 text-pink-200 border border-pink-400 text-xs"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Arcade Glass Display Chamber */}
      <div className="relative w-full max-w-xl flex-1 my-2 rounded-2xl bg-gradient-to-b from-[#0b0416] via-[#120727] to-[#1e0a38] border-4 border-purple-600/80 shadow-[inset_0_0_40px_rgba(168,85,247,0.4)] overflow-hidden flex flex-col justify-between">
        
        {/* Glass reflection gradient */}
        <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/5 to-white/10 pointer-events-none z-20" />

        {/* Top rail */}
        <div className="absolute top-0 left-0 right-0 h-4 bg-zinc-800 border-b border-zinc-600 flex items-center px-4">
          <div className="w-full h-1 bg-yellow-400/60 shadow-[0_0_8px_#facc15]" />
        </div>

        {/* Prize Chute on the left */}
        <div className="absolute bottom-2 left-3 w-16 h-20 rounded-t-xl bg-zinc-950 border-2 border-dashed border-cyan-400/80 flex flex-col items-center justify-center z-10">
          <span className="text-[9px] font-mono font-bold text-cyan-300 tracking-wider">PRIZE</span>
          <span className="text-[8px] font-mono text-cyan-400/80">CHUTE ⬇</span>
        </div>

        {/* The Mechanical Claw */}
        <div 
          className="absolute z-20 transition-all duration-500 ease-out flex flex-col items-center pointer-events-none"
          style={{
            left: `${clawX}%`,
            top: `${clawY}%`,
            transform: 'translateX(-50%)'
          }}
        >
          {/* Steel Cable */}
          <div className="w-1 bg-zinc-400 h-28 -mt-28 shadow-sm" />
          {/* Claw Motor Box */}
          <div className="w-7 h-5 bg-gradient-to-b from-yellow-400 to-amber-600 rounded-sm border border-yellow-200 shadow-md flex items-center justify-center">
            <span className="text-[7px] font-black text-black">R27</span>
          </div>
          {/* Left Prongs */}
          <div className="flex items-center gap-1.5 mt-0.5">
            <div className={`w-2 h-5 border-l-2 border-b-2 border-zinc-300 transform ${clawState === 'grabbing' ? 'rotate-12' : '-rotate-25'} transition-transform`} />
            <div className={`w-2 h-5 border-r-2 border-b-2 border-zinc-300 transform ${clawState === 'grabbing' ? '-rotate-12' : 'rotate-25'} transition-transform`} />
          </div>
        </div>

        {/* Capsule Pit at the Bottom */}
        <div className="absolute inset-x-0 bottom-0 h-28 bg-[#120724] border-t-2 border-purple-800/80 z-10 px-4">
          {capsules.map((cap) => (
            <div
              key={cap.id}
              className="absolute w-7 h-7 rounded-full shadow-lg border border-white/40 flex items-center justify-center transition-transform hover:scale-110"
              style={{
                left: `${cap.x}%`,
                top: `${cap.y - 70}%`,
                backgroundColor: cap.color,
                transform: `rotate(${cap.rotation}deg)`
              }}
            >
              <div className="w-5 h-2.5 rounded-t-full bg-white/40 border-b border-black/20" />
            </div>
          ))}
        </div>

        {/* Won Event Prize Reveal Modal */}
        {wonEvent && (
          <div className="absolute inset-0 z-30 bg-black/80 backdrop-blur-md flex flex-col items-center justify-center p-4 text-center animate-in fade-in zoom-in-95 duration-300">
            <div className="w-14 h-14 rounded-full flex items-center justify-center mb-2 shadow-[0_0_20px_rgba(250,204,21,0.8)] border-2 border-white" style={{ backgroundColor: wonColor }}>
              <Sparkles size={24} className="text-white animate-spin" />
            </div>
            <span className="font-mono text-[10px] text-yellow-300 tracking-widest font-black uppercase mb-1">
              🎉 PRIZE CAPSULE UNLOCKED! (+50 COINS)
            </span>
            <h3 className="font-display text-base sm:text-lg font-black text-white tracking-wider mb-1">
              {wonEvent.title}
            </h3>
            <span className="px-2 py-0.5 rounded-full text-[9px] font-mono uppercase font-bold bg-purple-900 border border-purple-400 text-purple-200 mb-2">
              {wonEvent.category} • {wonEvent.prizePool || '₹25,000+'}
            </span>
            <p className="text-xs text-slate-300 max-w-xs mb-3 line-clamp-2">
              {wonEvent.shortDesc || wonEvent.description}
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => onSelectEvent(wonEvent)}
                className="px-4 py-1.5 rounded-full bg-gradient-to-r from-pink-500 to-rose-600 text-white font-display text-xs font-black tracking-wider uppercase border border-pink-300 shadow-lg hover:scale-105 active:scale-95 cursor-pointer"
              >
                OPEN EVENT DETAILS
              </button>
              <button
                onClick={resetGame}
                className="px-3 py-1.5 rounded-full bg-zinc-800 text-slate-200 font-display text-xs font-bold border border-zinc-600 hover:bg-zinc-700 active:scale-95 cursor-pointer"
              >
                PLAY AGAIN
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Arcade Controls Dashboard */}
      <div className="w-full max-w-xl p-2.5 rounded-2xl bg-[#1e0c38] border-2 border-purple-500/70 shadow-lg flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <button
            onClick={moveLeft}
            disabled={clawState !== 'idle'}
            className="p-2.5 rounded-xl bg-[#2e1256] border-2 border-cyan-400 hover:bg-[#3c1770] active:scale-95 disabled:opacity-40 text-cyan-300 cursor-pointer shadow-md"
            title="Move Claw Left"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={moveRight}
            disabled={clawState !== 'idle'}
            className="p-2.5 rounded-xl bg-[#2e1256] border-2 border-cyan-400 hover:bg-[#3c1770] active:scale-95 disabled:opacity-40 text-cyan-300 cursor-pointer shadow-md"
            title="Move Claw Right"
          >
            <ChevronRight size={20} />
          </button>
        </div>

        <div className="flex flex-col items-center">
          <span className="font-mono text-[9px] text-purple-300 uppercase tracking-widest font-bold">
            AIM & DROP
          </span>
          <span className="font-display text-[10px] text-yellow-300 font-black">
            POSITION: {Math.round(clawX)}%
          </span>
        </div>

        <button
          onClick={dropClaw}
          disabled={clawState !== 'idle'}
          className="px-5 py-2.5 rounded-xl font-display text-xs font-black tracking-widest uppercase bg-gradient-to-r from-pink-500 to-rose-600 text-white border-2 border-pink-200 shadow-[0_4px_0_#9d174d,0_0_15px_rgba(244,63,94,0.6)] active:translate-y-1 active:shadow-none hover:scale-105 disabled:opacity-50 cursor-pointer flex items-center gap-1.5"
        >
          <Play size={14} fill="white" />
          <span>DROP CLAW</span>
        </button>
      </div>
    </div>
  );
}
