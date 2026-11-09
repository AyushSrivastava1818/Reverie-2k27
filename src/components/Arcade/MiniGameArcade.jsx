import React, { useState } from 'react';
import { 
  X, Gamepad2, Rocket, Play, Sparkles, Coins, Zap, 
  RotateCcw, Trophy, Tv, Info, ArrowRight 
} from 'lucide-react';
import { SponsorGalaxy } from './SponsorGalaxy';
import { PixelRunner } from './PixelRunner';
import { MemoryMatch } from './MemoryMatch';
import { QuickReflex } from './QuickReflex';
import { RetroSnake } from './RetroSnake';
import { soundEngine } from '../../game/systems/SoundEngine';
import { achievementSystem } from '../../game/systems/AchievementSystem';

const GAMES = [
  { id: 'space', name: 'SPONSOR SHOOTER', icon: Rocket, color: 'text-pink-400 border-pink-500' },
  { id: 'runner', name: 'PIXEL RUNNER', icon: Play, color: 'text-cyan-400 border-cyan-500' },
  { id: 'memory', name: 'MEMORY MATCH', icon: Sparkles, color: 'text-yellow-400 border-yellow-500' },
  { id: 'reflex', name: 'QUICK REFLEX', icon: Zap, color: 'text-emerald-400 border-emerald-500' },
  { id: 'snake', name: 'RETRO SNAKE', icon: Gamepad2, color: 'text-purple-400 border-purple-500' }
];

export function MiniGameArcade({ onClose, onOpenRewards, onSkipToSponsors }) {
  const [activeGame, setActiveGame] = useState('space');
  const [crtEffect, setCrtEffect] = useState(false);
  const [balance, setBalance] = useState(achievementSystem.getBalance());

  const handleSelectGame = (id) => {
    soundEngine.playBlip();
    setActiveGame(id);
    setBalance(achievementSystem.getBalance());
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-5 md:p-6 bg-black/90 backdrop-blur-lg select-none">
      <div className={`relative w-[98vw] max-w-5xl h-[94vh] flex flex-col bg-[#090518] border-2 sm:border-3 border-pink-500 rounded-3xl shadow-2xl shadow-pink-500/25 overflow-hidden ${
        crtEffect ? 'crt-scanlines' : ''
      }`}>
        {/* Arcade Cabinet Top Marquee */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-purple-900/60 bg-[#14082c]">
          <div className="flex items-center gap-3">
            <div className="p-2 sm:p-2.5 rounded-2xl bg-pink-950 border border-pink-500 shadow-lg shadow-pink-500/30">
              <Gamepad2 size={26} className="text-pink-400 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-display text-lg sm:text-2xl font-black text-white">
                  REVÉRIE RETRO ARCADE
                </h2>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-pink-500 text-black font-display font-black uppercase">
                  5 MINI-GAMES
                </span>
              </div>
              <p className="font-body text-xs text-yellow-300 font-bold uppercase tracking-wider">
                PLAY ARCADE CLASSICS • EARN COINS • REDEEM IN REWARDS SHOP
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {/* CRT Toggle Button */}
            <button
              onClick={() => {
                soundEngine.playBlip();
                setCrtEffect(!crtEffect);
              }}
              title="Toggle CRT Scanline Simulation"
              className={`px-3 py-1.5 rounded-xl border font-display text-xs font-bold uppercase hidden sm:flex items-center gap-1.5 transition-all cursor-pointer ${
                crtEffect 
                  ? 'bg-emerald-950 border-emerald-400 text-emerald-300' 
                  : 'bg-slate-900 border-slate-700 text-slate-400 hover:text-white'
              }`}
            >
              <Tv size={14} />
              <span>CRT: {crtEffect ? 'ON' : 'OFF'}</span>
            </button>

            {/* Close Button */}
            <button
              onClick={() => {
                soundEngine.playBlip();
                onClose();
              }}
              className="p-2.5 rounded-xl bg-slate-900 hover:bg-rose-900 text-slate-300 hover:text-white transition-colors cursor-pointer"
            >
              <X size={22} />
            </button>
          </div>
        </div>

        {/* Game Selector Tab Ribbon */}
        <div className="px-4 py-2.5 bg-[#0f0722] border-b border-purple-900/40 flex items-center justify-between gap-2 overflow-x-auto shrink-0">
          <div className="flex items-center gap-1.5 sm:gap-2">
            {GAMES.map(g => {
              const IconComp = g.icon;
              const isActive = activeGame === g.id;
              return (
                <button
                  key={g.id}
                  onClick={() => handleSelectGame(g.id)}
                  className={`px-3 py-1.5 rounded-xl font-display text-xs sm:text-sm font-black uppercase tracking-wider transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${
                    isActive
                      ? 'bg-gradient-to-r from-pink-600 to-purple-600 text-white shadow-lg shadow-pink-600/40 scale-105 ring-1 ring-white/40'
                      : 'bg-[#180e34] text-slate-300 hover:bg-purple-900 hover:text-white border border-purple-800'
                  }`}
                >
                  <IconComp size={15} />
                  <span>{g.name}</span>
                </button>
              );
            })}
          </div>

          {/* Quick Rewards Link */}
          {onOpenRewards && (
            <button
              onClick={() => {
                soundEngine.playBlip();
                onClose();
                onOpenRewards();
              }}
              className="px-3 py-1.5 rounded-xl bg-amber-950/80 hover:bg-amber-900 border border-yellow-500/70 text-yellow-300 font-display text-xs font-black uppercase tracking-wider flex items-center gap-1.5 shrink-0 transition-all cursor-pointer"
            >
              <Coins size={14} className="text-yellow-400" />
              <span>SPEND COINS ({balance})</span>
              <ArrowRight size={12} />
            </button>
          )}
        </div>

        {/* Main Active Game Display */}
        <div className="flex-1 overflow-hidden flex flex-col bg-[#060312]">
          {activeGame === 'space' && (
            <SponsorGalaxy 
              onSkipToDirectory={onSkipToSponsors || onClose}
              onSelectSponsor={() => {}}
            />
          )}

          {activeGame === 'runner' && (
            <PixelRunner />
          )}

          {activeGame === 'memory' && (
            <MemoryMatch />
          )}

          {activeGame === 'reflex' && (
            <QuickReflex />
          )}

          {activeGame === 'snake' && (
            <RetroSnake />
          )}
        </div>

        {/* Footer info bar */}
        <div className="p-3 bg-[#0d061f] border-t border-purple-900/60 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <span className="font-display font-black text-yellow-400">ARCADE REWARDS ACTIVE:</span>
            <span>All score achievements automatically award festival coins stored in your wallet.</span>
          </div>

          <button
            onClick={() => {
              soundEngine.playBlip();
              onClose();
            }}
            className="text-slate-300 hover:text-white font-display text-xs font-bold underline cursor-pointer"
          >
            EXIT ARCADE
          </button>
        </div>
      </div>
    </div>
  );
}

