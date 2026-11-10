import React, { useState } from 'react';
import { SonicStageSelector } from './SonicStageSelector';
import { MarioEventBlocks } from './MarioEventBlocks';
import { SpaceInvadersSponsors } from './SpaceInvadersSponsors';
import { PacmanScheduleMaze } from './PacmanScheduleMaze';
import { RpgFaqSanctuary } from './RpgFaqSanctuary';
import { VictoryStageClear } from './VictoryStageClear';
import { soundEngine } from '../../game/systems/SoundEngine';

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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 select-none animate-in fade-in duration-200">
      
      {/* Full-Screen Aspect-Locked High-Res Arcade Cabinet */}
      <div className="relative w-full max-w-6xl h-[98vh] flex flex-col bg-[#07050e] border-4 border-[#2b2738] rounded-3xl shadow-[0_0_80px_rgba(168,85,247,0.6)] overflow-hidden">
        
        {/* CRT Scanline Filter (Toggleable) */}
        {crtEnabled && (
          <div className="absolute inset-0 z-50 pointer-events-none opacity-30 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.6)_50%)] bg-[length:100%_4px]" />
        )}

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

        {/* VIEW 3: STAGE 2 — SPACE INVADERS GALAXY FLEET (Ref: 22.11.18(1)) */}
        {currentView === 'stage-2' && (
          <SpaceInvadersSponsors
            onAdvanceStage={() => setCurrentView('stage-3')}
            onClose={() => setCurrentView('world-map')}
            onBackToMap={() => setCurrentView('world-map')}
          />
        )}

        {/* VIEW 4: STAGE 3 — PAC-MAN PIXEL FEST SCHEDULE (Ref: 22.11.17) */}
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
  );
}
