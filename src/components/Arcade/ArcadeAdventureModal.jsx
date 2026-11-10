import React, { useState } from 'react';
import { SonicStageSelector } from './SonicStageSelector';
import { MarioEventBlocks } from './MarioEventBlocks';
import { SponsorGalaxy } from './SponsorGalaxy';
import { SpaceInvadersSponsors } from './SpaceInvadersSponsors';
import { PacmanScheduleMaze } from './PacmanScheduleMaze';
import { RpgFaqSanctuary } from './RpgFaqSanctuary';
import { VictoryStageClear } from './VictoryStageClear';
import { soundEngine } from '../../game/systems/SoundEngine';
import { Sparkles, Coins, Zap } from 'lucide-react';

export function ArcadeAdventureModal({
  initialStage = 1,
  initialView = 'world-map',
  onClose,
  onSelectEvent,
  onOpenFullDirectory
}) {
  // view: 'world-map' | 'stage-1' | 'stage-2' | 'stage-3' | 'stage-4' | 'stage-5'
  const [currentView, setCurrentView] = useState(initialView || 'world-map');
  const [selectedMapStage, setSelectedMapStage] = useState(initialStage || 1);
  const [crtEnabled, setCrtEnabled] = useState(false);
  const [soundMuted, setSoundMuted] = useState(soundEngine.muted);

  React.useEffect(() => {
    if (initialView) setCurrentView(initialView);
  }, [initialView]);

  React.useEffect(() => {
    if (initialStage) setSelectedMapStage(initialStage);
  }, [initialStage]);

  const handleToggleCrt = () => {
    soundEngine.playBlip();
    setCrtEnabled(prev => !prev);
  };

  const handleToggleSound = () => {
    const next = !soundMuted;
    setSoundMuted(next);
    soundEngine.setMuted(next);
  };

  const enterStageFromMap = () => {
    soundEngine.playJump();
    setCurrentView(`stage-${selectedMapStage}`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 select-none animate-in fade-in duration-200 p-1 sm:p-3">
      
      {/* AUTHENTIC RETRO ARCADE CABINET HOUSING */}
      <div className="relative w-full max-w-6xl h-[98vh] flex flex-col bg-[#05020c] border-[5px] border-[#2e2640] rounded-3xl shadow-[0_0_90px_rgba(168,85,247,0.7)] overflow-hidden">
        
        {/* 1. TOP ILLUMINATED ARCADE CABINET MARQUEE */}
        <div className="flex-shrink-0 flex items-center justify-between px-3 sm:px-6 py-2 bg-gradient-to-r from-[#18092e] via-[#2d1252] to-[#18092e] border-b-[3px] border-[#fbbf24] shadow-lg">
          
          {/* Left Speaker Grill & Chaser LEDs */}
          <div className="flex items-center gap-2">
            <div className="flex gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
              <span className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
            </div>
            <div className="hidden sm:flex flex-col gap-0.5">
              <span className="w-8 h-1 bg-gray-600 rounded" />
              <span className="w-8 h-1 bg-gray-600 rounded" />
            </div>
          </div>

          {/* Center Glowing Neon Marquee Title */}
          <div className="flex items-center gap-2">
            <Sparkles size={16} className="text-yellow-400 animate-spin" />
            <span className="font-['Press_Start_2P'] text-[10px] sm:text-xs text-yellow-300 tracking-wider drop-shadow-[0_0_12px_#facc15]">
              ★ REVERIE 2K27 ARCADE UNIVERSE ★
            </span>
            <Sparkles size={16} className="text-yellow-400 animate-spin" />
          </div>

          {/* Right Coin Counter & Close Button */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded bg-black/60 border border-yellow-500/50">
              <Coins size={13} className="text-yellow-400" />
              <span className="font-['Press_Start_2P'] text-[8px] text-yellow-300">CREDITS: 99</span>
            </div>

            {onClose && (
              <button
                onClick={onClose}
                className="px-2.5 py-1 rounded-lg bg-red-950 border border-red-500 text-red-300 hover:bg-red-900 font-bold text-xs cursor-pointer shadow-[0_0_10px_rgba(239,68,68,0.5)]"
                title="Close Cabinet"
              >
                ✕ EXIT
              </button>
            )}
          </div>
        </div>

        {/* 2. CRT SCANLINE EFFECT (TOGGLEABLE) */}
        {crtEnabled && (
          <div className="absolute inset-0 z-50 pointer-events-none opacity-25 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.7)_50%)] bg-[length:100%_4px]" />
        )}

        {/* 3. MAIN ARCADE MONITOR DISPLAY */}
        <div className="relative flex-1 min-h-0 overflow-hidden flex flex-col">
          
          {/* VIEW 1: SONIC FLOATING ISLANDS WORLD STAGE SELECTOR (Ref: 22.11.17(1)) */}
          {currentView === 'world-map' && (
            <SonicStageSelector
              currentStage={selectedMapStage}
              onSelectStage={(stg) => setSelectedMapStage(stg)}
              crtEnabled={crtEnabled}
              onToggleCrt={handleToggleCrt}
              soundMuted={soundMuted}
              onToggleSound={handleToggleSound}
              onEnterActiveStage={enterStageFromMap}
              onClose={onClose}
            />
          )}

          {/* VIEW 2: STAGE 1 — MARIO 7 QUESTION BLOCKS (Ref: 22.11.17(2)) */}
          {currentView === 'stage-1' && (
            <MarioEventBlocks
              onSelectEvent={onSelectEvent}
              onOpenFullDirectory={onOpenFullDirectory}
              onClose={() => setCurrentView('world-map')}
              onBackToMap={() => setCurrentView('world-map')}
            />
          )}

          {/* VIEW 3: STAGE 2 — SPONSOR GALAXY (PLAYABLE 90s SPACE SHOOTER) */}
          {currentView === 'stage-2' && (
            <SponsorGalaxy
              onAdvanceStage={() => setCurrentView('stage-3')}
              onClose={() => setCurrentView('world-map')}
              onBackToMap={() => setCurrentView('world-map')}
            />
          )}

          {/* VIEW 4: STAGE 3 — ALL 18-EVENT PAC-MAN LABYRINTH (Ref: 22.11.17) */}
          {currentView === 'stage-3' && (
            <PacmanScheduleMaze
              onAdvanceStage={() => setCurrentView('stage-4')}
              onClose={() => setCurrentView('world-map')}
              onBackToMap={() => setCurrentView('world-map')}
            />
          )}

          {/* VIEW 5: STAGE 4 — RPG FAQ SAGE SANCTUARY (Ref: 22.11.18) */}
          {currentView === 'stage-4' && (
            <RpgFaqSanctuary
              onAdvanceStage={() => setCurrentView('stage-5')}
              onClose={() => setCurrentView('world-map')}
              onBackToMap={() => setCurrentView('world-map')}
            />
          )}

          {/* VIEW 6: STAGE 5 — STAGES CLEARED! FLAGPOLE VICTORY (Ref: 22.11.16) */}
          {currentView === 'stage-5' && (
            <VictoryStageClear
              onRestartQuest={() => setCurrentView('world-map')}
              onEnterWorld={onClose}
              onOpenDirectory={onOpenFullDirectory}
              onClose={onClose}
              onBackToMap={() => setCurrentView('world-map')}
            />
          )}
        </div>
      </div>
    </div>
  );
}
