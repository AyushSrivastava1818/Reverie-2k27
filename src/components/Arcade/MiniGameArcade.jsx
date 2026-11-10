import React, { useState } from 'react';
import { 
  X, Gamepad2, Rocket, Play, Sparkles, Coins, Zap, RotateCcw
} from 'lucide-react';
import { SponsorGalaxy } from './SponsorGalaxy';
import { PixelRunner } from './PixelRunner';
import { MemoryMatch } from './MemoryMatch';
import { QuickReflex } from './QuickReflex';
import { RetroSnake } from './RetroSnake';
import { soundEngine } from '../../game/systems/SoundEngine';
import { achievementSystem } from '../../game/systems/AchievementSystem';

const GAMES = [
  { 
    id: 'space', 
    name: 'SPONSOR SHOOTER', 
    short: 'SHOOTER',
    icon: Rocket, 
    color: 'border-pink-500 text-pink-400',
    accent: 'bg-pink-950 text-pink-300',
    badge: '90s SPACE'
  },
  { 
    id: 'runner', 
    name: 'PIXEL RUNNER', 
    short: 'RUNNER',
    icon: Play, 
    color: 'border-cyan-500 text-cyan-400',
    accent: 'bg-cyan-950 text-cyan-300',
    badge: 'CYBER SPRINT'
  },
  { 
    id: 'memory', 
    name: 'MEMORY MATCH', 
    short: 'MEMORY',
    icon: Sparkles, 
    color: 'border-yellow-500 text-yellow-400',
    accent: 'bg-amber-950 text-yellow-300',
    badge: 'PUZZLE'
  },
  { 
    id: 'reflex', 
    name: 'QUICK REFLEX', 
    short: 'REFLEX',
    icon: Zap, 
    color: 'border-emerald-500 text-emerald-400',
    accent: 'bg-emerald-950 text-emerald-300',
    badge: 'REACTION'
  },
  { 
    id: 'snake', 
    name: 'RETRO SNAKE', 
    short: 'SNAKE',
    icon: Gamepad2, 
    color: 'border-purple-500 text-purple-400',
    accent: 'bg-purple-950 text-purple-300',
    badge: 'CLASSIC'
  }
];

export function MiniGameArcade({ onClose, onOpenRewards, onSkipToSponsors }) {
  const [activeGame, setActiveGame] = useState('space');
  const [gameKey, setGameKey] = useState(0); // Key used for full restart
  const [balance, setBalance] = useState(achievementSystem.getBalance());

  const handleSelectGame = (id) => {
    soundEngine.playBlip();
    setActiveGame(id);
    setGameKey(prev => prev + 1);
    setBalance(achievementSystem.getBalance());
  };

  const handleRestartActiveGame = () => {
    soundEngine.playBlip();
    setGameKey(prev => prev + 1);
    setBalance(achievementSystem.getBalance());
  };

  const currentGame = GAMES.find(g => g.id === activeGame) || GAMES[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-5 md:p-6 bg-black/90 backdrop-blur-lg select-none">
      <div className="relative w-[98vw] max-w-5xl h-[94vh] flex flex-col bg-[#080415] border-2 sm:border-3 border-pink-500 rounded-3xl shadow-2xl shadow-pink-500/25 overflow-hidden">
        
        {/* ------------------------------------------------------------- */}
        {/* COMPACT TOP ARCADE SELECTOR BAR (Pixel-art Thumbnails)        */}
        {/* ------------------------------------------------------------- */}
        <div className="p-2 sm:px-4 sm:py-2.5 bg-[#120728] border-b border-purple-900/60 flex items-center justify-between gap-3 shrink-0">
          
          {/* Logo / Brand */}
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-xl bg-pink-950 border border-pink-500">
              <Gamepad2 size={20} className="text-pink-400 animate-pulse" />
            </div>
            <span className="font-display text-sm sm:text-base font-black text-white tracking-wider hidden md:inline">
              REVÉRIE ARCADE
            </span>
          </div>

          {/* Compact Game Selector Thumbnails */}
          <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto no-scrollbar py-0.5">
            {GAMES.map(g => {
              const IconComp = g.icon;
              const isActive = activeGame === g.id;
              return (
                <button
                  key={g.id}
                  onClick={() => handleSelectGame(g.id)}
                  className={`px-2.5 py-1.5 sm:px-3 sm:py-1.5 rounded-xl font-display text-xs font-black uppercase tracking-wider transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${
                    isActive
                      ? 'bg-gradient-to-r from-pink-600 to-purple-600 text-white shadow-lg shadow-pink-600/40 ring-1 ring-white/60 scale-105'
                      : 'bg-[#180e34] text-slate-300 hover:bg-purple-900 hover:text-white border border-purple-800'
                  }`}
                >
                  <IconComp size={14} className={isActive ? 'text-white' : 'text-slate-400'} />
                  <span className="hidden sm:inline">{g.name}</span>
                  <span className="sm:hidden">{g.short}</span>
                </button>
              );
            })}
          </div>

          {/* Quick Stats & Exit */}
          <div className="flex items-center gap-2">
            {onOpenRewards && (
              <button
                onClick={() => {
                  soundEngine.playBlip();
                  onClose();
                  onOpenRewards();
                }}
                className="hidden lg:flex items-center gap-1.5 px-3 py-1 rounded-xl bg-amber-950/80 border border-yellow-500/70 text-yellow-300 font-display text-xs font-black uppercase cursor-pointer hover:bg-amber-900 transition-all"
              >
                <Coins size={14} className="text-yellow-400" />
                <span>COINS: {balance}</span>
              </button>
            )}

            <button
              onClick={() => {
                soundEngine.playBlip();
                onClose();
              }}
              className="p-1.5 sm:px-2.5 sm:py-1 rounded-xl bg-slate-900 hover:bg-rose-950 text-slate-300 hover:text-white border border-slate-700 hover:border-rose-500 transition-all font-display text-xs font-bold uppercase cursor-pointer flex items-center gap-1"
              title="Exit Arcade"
            >
              <span className="hidden sm:inline">EXIT</span>
              <X size={16} />
            </button>
          </div>
        </div>

        {/* ------------------------------------------------------------- */}
        {/* UNIFIED GAME SUB-HEADER (Title, Score/Stats, Restart, Exit)    */}
        {/* ------------------------------------------------------------- */}
        <div className="px-4 py-2 bg-[#0c051f] border-b border-purple-900/40 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <span className={`text-[10px] font-display font-black px-2 py-0.5 rounded-full uppercase ${currentGame.accent}`}>
              {currentGame.badge}
            </span>
            <h3 className="font-display text-xs sm:text-sm font-black text-white uppercase tracking-wider">
              {currentGame.name}
            </h3>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleRestartActiveGame}
              className="px-2.5 py-1 rounded-lg bg-purple-950 hover:bg-purple-900 border border-purple-600/80 text-slate-300 hover:text-white font-display text-[11px] font-bold uppercase flex items-center gap-1 transition-all cursor-pointer"
              title="Restart Game"
            >
              <RotateCcw size={13} />
              <span>RESTART</span>
            </button>
          </div>
        </div>

        {/* ------------------------------------------------------------- */}
        {/* ACTIVE MINI-GAME FULL VIEWPORT (Zero documentation fluff!)    */}
        {/* ------------------------------------------------------------- */}
        <div key={gameKey} className="flex-1 w-full h-full overflow-hidden flex flex-col bg-[#050212]">
          {activeGame === 'space' && (
            <SponsorGalaxy 
              onSkipToDirectory={onSkipToSponsors || onClose}
              onSelectSponsor={() => {}}
              onClose={onClose}
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
      </div>
    </div>
  );
}
