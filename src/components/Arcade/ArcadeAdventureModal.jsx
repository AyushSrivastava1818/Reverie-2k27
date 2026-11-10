import React, { useState } from 'react';
import { X, Sparkles, Trophy, Gamepad2, Coins } from 'lucide-react';
import { SonicStageSelector, STAGES } from './SonicStageSelector';
import { MarioEventBlocks } from './MarioEventBlocks';
import { SpaceInvadersSponsors } from './SpaceInvadersSponsors';
import { PacmanScheduleMaze } from './PacmanScheduleMaze';
import { RpgFaqSanctuary } from './RpgFaqSanctuary';
import { VictoryStageClear } from './VictoryStageClear';
import { soundEngine } from '../../game/systems/SoundEngine';
import { achievementSystem } from '../../game/systems/AchievementSystem';

export function ArcadeAdventureModal({ 
  initialStage = 1, 
  onClose, 
  onSelectEvent, 
  onOpenFullDirectory,
  onOpenRewards
}) {
  const [currentStage, setCurrentStage] = useState(initialStage);
  const [crtEnabled, setCrtEnabled] = useState(false);
  const [soundMuted, setSoundMuted] = useState(soundEngine.muted);
  const [balance, setBalance] = useState(achievementSystem.getBalance());

  const handleToggleCrt = () => {
    soundEngine.playBlip();
    setCrtEnabled(prev => !prev);
  };

  const handleToggleSound = () => {
    const next = !soundMuted;
    setSoundMuted(next);
    soundEngine.setMuted(next);
  };

  const handleSelectStage = (stageId) => {
    setCurrentStage(stageId);
    setBalance(achievementSystem.getBalance());
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-1 sm:p-3 md:p-4 bg-black/90 backdrop-blur-md select-none animate-in fade-in duration-200">
      
      {/* Handheld Game Console Outer Shell */}
      <div className="relative w-full max-w-5xl h-[96vh] flex flex-col bg-[#0b0518] border-3 sm:border-4 border-purple-600 rounded-3xl shadow-[0_0_50px_rgba(168,85,247,0.4)] overflow-hidden">
        
        {/* CRT Scanline Filter Overlay (Optional Toggle) */}
        {crtEnabled && (
          <div className="absolute inset-0 z-40 pointer-events-none opacity-40 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.5)_50%)] bg-[length:100%_4px]" />
        )}

        {/* Global Modal Header Bar */}
        <div className="relative z-30 px-3 sm:px-5 py-2 bg-[#13072b] border-b-2 border-purple-800 flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2">
            <div className="p-1 rounded-lg bg-pink-950 border border-pink-400">
              <Gamepad2 size={16} className="text-pink-300 animate-pulse" />
            </div>
            <div className="flex items-center gap-1.5">
              <span className="font-display text-xs sm:text-sm font-black text-white tracking-widest">
                REVERIE 2K27 ARCADE UNIVERSE
              </span>
              <span className="px-2 py-0.5 rounded-full bg-cyan-950 border border-cyan-400 text-cyan-300 font-mono text-[9px] font-bold">
                5 STAGE ADVENTURE
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-950/80 border border-amber-500/60 text-yellow-300 font-mono text-xs font-bold shadow">
              <Coins size={14} className="text-yellow-400" />
              <span>{balance} COINS</span>
            </div>

            <button
              onClick={() => {
                soundEngine.playBlip();
                onClose?.();
              }}
              className="p-1.5 rounded-xl bg-purple-900/80 hover:bg-rose-900/90 text-purple-200 hover:text-white border border-purple-400 hover:border-rose-400 transition-colors cursor-pointer"
              title="Exit Arcade Adventure"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Top: Sonic Green Hill Floating Islands Stage Selector */}
        <SonicStageSelector
          currentStage={currentStage}
          onSelectStage={handleSelectStage}
          crtEnabled={crtEnabled}
          onToggleCrt={handleToggleCrt}
          soundMuted={soundMuted}
          onToggleSound={handleToggleSound}
        />

        {/* Main Stage Viewport */}
        <div className="relative flex-1 w-full overflow-hidden bg-[#070212]">
          {currentStage === 1 && (
            <MarioEventBlocks
              onSelectEvent={onSelectEvent}
              onOpenFullDirectory={onOpenFullDirectory}
            />
          )}

          {currentStage === 2 && (
            <SpaceInvadersSponsors
              onSelectSponsor={(sp) => {}}
              onOpenRewards={onOpenRewards}
            />
          )}

          {currentStage === 3 && (
            <PacmanScheduleMaze
              onSelectEvent={onSelectEvent}
              onAdvanceStage={() => handleSelectStage(4)}
            />
          )}

          {currentStage === 4 && (
            <RpgFaqSanctuary
              onAdvanceStage={() => handleSelectStage(5)}
            />
          )}

          {currentStage === 5 && (
            <VictoryStageClear
              onRestartQuest={() => handleSelectStage(1)}
              onEnterWorld={onClose}
              onOpenDirectory={onOpenFullDirectory}
            />
          )}
        </div>
      </div>
    </div>
  );
}
