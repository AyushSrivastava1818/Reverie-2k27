import React, { useState, useEffect } from 'react';
import { StartScreen } from './components/StartScreen/StartScreen';
import { GameCanvas } from './components/GameCanvas/GameCanvas';
import { WebsiteHeader } from './components/Navigation/WebsiteHeader';
import { InGameHUD } from './components/GameHUD/InGameHUD';
import { MobileControls } from './components/MobileControls/MobileControls';
import { EventModal } from './components/EventModal/EventModal';
import { StatsModal } from './components/Modals/StatsModal';
import { GalleryModal } from './components/Modals/GalleryModal';
import { SponsorsModal } from './components/Modals/SponsorsModal';
import { ContactsModal } from './components/Modals/ContactsModal';
import { FastTravelModal } from './components/Modals/FastTravelModal';
import { EventDirectoryModal } from './components/Modals/EventDirectoryModal';
import { SkinsModal } from './components/Modals/SkinsModal';
import { KotaBotModal } from './components/Modals/KotaBotModal';
import { ReverieLiveModal } from './components/Modals/ReverieLiveModal';
import { MiniGameArcade } from './components/Arcade/MiniGameArcade';
import { ArcadeAdventureModal } from './components/Arcade/ArcadeAdventureModal';
import { WarpTunnelOverlay } from './components/Arcade/WarpTunnelOverlay';
import { AchievementToast } from './components/Achievements/AchievementToast';
import { eventBus } from './game/EventBus';
import { soundEngine } from './game/systems/SoundEngine';
import { achievementSystem } from './game/systems/AchievementSystem';
import confetti from 'canvas-confetti';

export function App() {
  const [gameStarted, setGameStarted] = useState(false);
  const [currentZone, setCurrentZone] = useState('Starting Kingdom');
  const [currentZoneKey, setCurrentZoneKey] = useState('StartingKingdomScene');
  const [coinCount, setCoinCount] = useState(0);
  const [currentSkin, setCurrentSkin] = useState('player_mario');

  // Modals state — streamlined & consolidated
  const [activeEvent, setActiveEvent] = useState(null);
  const [statsModalState, setStatsModalState] = useState({ open: false, tab: 'stats' });
  const [sponsorsModalState, setSponsorsModalState] = useState({ open: false, tab: 'galaxy' });
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [contactsOpen, setContactsOpen] = useState(false);
  const [mapOpen, setMapOpen] = useState(false);
  const [directoryOpen, setDirectoryOpen] = useState(false);
  const [directoryCategory, setDirectoryCategory] = useState('all');
  const [skinsOpen, setSkinsOpen] = useState(false);
  const [liveOpen, setLiveOpen] = useState(false);
  const [arcadeOpen, setArcadeOpen] = useState(false);
  const [arcadeAdventureOpen, setArcadeAdventureOpen] = useState(false);
  const [arcadeAdventureStage, setArcadeAdventureStage] = useState(1);
  const [arcadeAdventureView, setArcadeAdventureView] = useState('world-map');
  const [kotaBotState, setKotaBotState] = useState({ open: false, zone: 'StartingKingdomScene', sceneName: 'Starting Kingdom' });
  const [warpTunnelData, setWarpTunnelData] = useState(null);

  // Proximity flags for mobile action button
  const [isPipeNear, setIsPipeNear] = useState(false);
  const [isEventNear, setIsEventNear] = useState(false);
  const [isNpcNear, setIsNpcNear] = useState(false);

  const handleOpenDirectory = (cat = 'all') => {
    setDirectoryCategory(cat || 'all');
    setDirectoryOpen(true);
  };

  const handleOpenArcadeAdventure = (stage = 1, view = 'world-map') => {
    soundEngine.playFanfare();
    setArcadeAdventureStage(stage || 1);
    setArcadeAdventureView(view || 'world-map');
    setArcadeAdventureOpen(true);
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.__openArcadeStage = handleOpenArcadeAdventure;
    }
  }, []);

  useEffect(() => {
    // 1. Zone change listener
    const unbindZone = eventBus.on('zone-entered', (data) => {
      const zName = data.zoneName || 'Starting Kingdom';
      const zKey = data.zoneKey || 'StartingKingdomScene';
      setCurrentZone(zName);
      setCurrentZoneKey(zKey);
      achievementSystem.recordZone(zKey);
    });

    // 1b. Switch zone listener to auto-start game if warping from modal
    const unbindSwitchZone = eventBus.on('switch-zone', () => {
      setGameStarted(true);
    });

    // 2. Coin collection listener
    const unbindCoin = eventBus.on('coin-collected', () => {
      setCoinCount((prev) => {
        const next = prev + 1;
        if (next % 10 === 0) {
          soundEngine.playFanfare();
          try {
            confetti({
              particleCount: 35,
              spread: 60,
              origin: { y: 0.25 },
              colors: ['#fbbf24', '#f59e0b', '#ec4899', '#06b6d4']
            });
          } catch (e) {}
        }
        return next;
      });
    });

    // 3. Open Event Modal / Custom Plaza & Wardrobe Kiosks
    const unbindEventModal = eventBus.on('open-event-modal', (eventData) => {
      if (eventData.customModal === 'stats') {
        achievementSystem.recordFestivalInfo();
        setStatsModalState({ open: true, tab: 'stats' });
      } else if (eventData.customModal === 'gallery') {
        achievementSystem.recordFestivalInfo();
        setGalleryOpen(true);
      } else if (eventData.customModal === 'sponsors') {
        achievementSystem.recordFestivalInfo();
        setSponsorsModalState({ open: true, tab: 'galaxy' });
      } else if (eventData.customModal === 'contacts') {
        achievementSystem.recordFestivalInfo();
        setContactsOpen(true);
      } else if (eventData.customModal === 'skins') {
        setSkinsOpen(true);
      } else if (eventData.customModal === 'arcade' || eventData.customModal === 'arcade-adventure') {
        handleOpenArcadeAdventure(1);
      } else if (eventData.customModal === 'leaderboard') {
        setStatsModalState({ open: true, tab: 'leaderboard' });
      } else if (eventData.customModal === 'rewards') {
        setSponsorsModalState({ open: true, tab: 'rewards' });
      } else {
        setActiveEvent(eventData);
      }
    });

    // 3b. Direct Arcade Modal trigger from in-game Warp Tunnel
    const unbindOpenArcade = eventBus.on('open-arcade-modal', (data) => {
      handleOpenArcadeAdventure(data?.stage || 1, data?.view || 'world-map');
    });

    // 4. Kota Bot dialogue trigger
    const unbindKotaBot = eventBus.on('open-kota-dialogue', (data) => {
      setKotaBotState({
        open: true,
        zone: data.zone || currentZoneKey,
        sceneName: data.sceneName || currentZone
      });
    });

    // 5. Open Achievements Modal -> Integrated into StatsModal Quests Tab
    const unbindAchievements = eventBus.on('open-achievements-modal', () => {
      setStatsModalState({ open: true, tab: 'quests' });
    });

    // 6. Proximity detection listeners
    const unbindPipeNear = eventBus.on('pipe-near', (data) => {
      setIsPipeNear(data.near);
    });

    const unbindPortalNear = eventBus.on('event-portal-near', (data) => {
      setIsEventNear(data.near);
    });

    const unbindNpcNear = eventBus.on('npc-near', (data) => {
      setIsNpcNear(data.near);
    });

    const unbindCoinBalance = eventBus.on('coin-balance-updated', (newBal) => {
      setCoinCount(newBal);
    });

    const unbindWarp = eventBus.on('warp-tunnel-active', (data) => {
      setWarpTunnelData(data);
    });

    // Global ESC Key Close Handler for all modals
    const handleGlobalKeyDown = (e) => {
      if (e.key === 'Escape') {
        setActiveEvent(null);
        setStatsModalState(prev => ({ ...prev, open: false }));
        setGalleryOpen(false);
        setSponsorsModalState(prev => ({ ...prev, open: false }));
        setContactsOpen(false);
        setMapOpen(false);
        setDirectoryOpen(false);
        setSkinsOpen(false);
        setLiveOpen(false);
        setArcadeOpen(false);
        setArcadeAdventureOpen(false);
        setKotaBotState(prev => ({ ...prev, open: false }));
      }
    };
    window.addEventListener('keydown', handleGlobalKeyDown);

    return () => {
      unbindZone();
      unbindSwitchZone();
      unbindCoin();
      unbindCoinBalance();
      unbindEventModal();
      unbindKotaBot();
      unbindAchievements();
      unbindPipeNear();
      unbindPortalNear();
      unbindNpcNear();
      if (unbindOpenArcade) unbindOpenArcade();
      if (unbindWarp) unbindWarp();
      window.removeEventListener('keydown', handleGlobalKeyDown);
    };
  }, [currentZone, currentZoneKey]);

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-[#06030e] flex flex-col select-none">
      {/* Real-Time Achievement Unlock Toasts */}
      <AchievementToast />

      {/* LAYER 1: Dedicated Website Header (Exactly the 9 specified destinations) */}
      <WebsiteHeader
        onOpenMap={() => setMapOpen(true)}
        onOpenDirectory={() => handleOpenDirectory('all')}
        onOpenLive={() => setLiveOpen(true)}
        onOpenArcade={() => handleOpenArcadeAdventure(1)}
        onOpenSkins={() => setSkinsOpen(true)}
        onOpenStats={() => setStatsModalState({ open: true, tab: 'stats' })}
        onOpenGallery={() => {
          achievementSystem.recordFestivalInfo();
          setGalleryOpen(true);
        }}
        onOpenSponsors={() => {
          achievementSystem.recordFestivalInfo();
          setSponsorsModalState({ open: true, tab: 'galaxy' });
        }}
        onOpenContacts={() => {
          achievementSystem.recordFestivalInfo();
          setContactsOpen(true);
        }}
      />

      {/* LAYER 2: Main Viewport (Contains GameCanvas and StartScreen Overlay) */}
      <div className="relative flex-1 w-full overflow-hidden bg-[#0a0614]">
        <GameCanvas />

        {/* LAYER 3: In-Game Floating HUD & Touch Controls (When playing) */}
        {gameStarted && (
          <>
            <InGameHUD 
              currentZone={currentZone} 
              coinCount={coinCount} 
              onOpenQuests={() => setStatsModalState({ open: true, tab: 'quests' })}
            />

            {/* Touch Controls (Mobile Only) */}
            <MobileControls 
              onOpenDirectory={() => handleOpenDirectory('all')}
              onOpenMap={() => setMapOpen(true)}
              isPipeNear={isPipeNear}
              isEventNear={isEventNear}
              isNpcNear={isNpcNear}
            />
          </>
        )}

        {/* Start Screen sits on top of canvas until PRESS START or a kingdom is clicked */}
        {!gameStarted && (
          <StartScreen 
            onStart={() => setGameStarted(true)} 
            onSelectKingdom={(sceneKey) => {
              setGameStarted(true);
              eventBus.emit('switch-zone', { zoneKey: sceneKey });
            }}
            onOpenDirectory={() => handleOpenDirectory('all')}
            onOpenMap={() => setMapOpen(true)}
            onOpenSkins={() => setSkinsOpen(true)}
            onOpenBot={() => setKotaBotState({ open: true, zone: currentZoneKey, sceneName: currentZone })}
            onOpenStats={() => setStatsModalState({ open: true, tab: 'stats' })}
            onOpenLive={() => setLiveOpen(true)}
            onOpenArcade={() => handleOpenArcadeAdventure(1)}
          />
        )}
      </div>

      {/* =================================================================== */}
      {/* MODAL OVERLAYS (Streamlined & Non-Duplicated)                       */}
      {/* =================================================================== */}

      {/* 1. Event Dossier Modal */}
      {activeEvent && (
        <EventModal
          event={activeEvent}
          onClose={() => setActiveEvent(null)}
        />
      )}

      {/* 2. Unified Stats & Leaderboard Modal (Stats, Scores, Quests, Impact) */}
      {statsModalState.open && (
        <StatsModal
          initialTab={statsModalState.tab}
          onClose={() => setStatsModalState(prev => ({ ...prev, open: false }))}
        />
      )}

      {/* 3. Past Glimpses Historical Festival Photo Gallery */}
      {galleryOpen && (
        <GalleryModal
          onClose={() => setGalleryOpen(false)}
        />
      )}

      {/* 4. Unified Sponsors + Arcade + Rewards Hub */}
      {sponsorsModalState.open && (
        <SponsorsModal
          initialTab={sponsorsModalState.tab}
          onClose={() => setSponsorsModalState(prev => ({ ...prev, open: false }))}
        />
      )}

      {/* 5. Festival Secretariat & Core Committee Contacts */}
      {contactsOpen && (
        <ContactsModal
          onClose={() => setContactsOpen(false)}
        />
      )}

      {/* 6. Hero Avatar Wardrobe (Skins connected to coin economy) */}
      {skinsOpen && (
        <SkinsModal
          currentSkin={currentSkin}
          onSelectSkin={(skinId) => setCurrentSkin(skinId)}
          onClose={() => setSkinsOpen(false)}
        />
      )}

      {/* 7. Interactive World Map */}
      {mapOpen && (
        <FastTravelModal 
          currentZoneKey={currentZoneKey}
          onClose={() => setMapOpen(false)} 
          onOpenDirectory={() => {
            setMapOpen(false);
            setDirectoryOpen(true);
          }}
          onSelectEvent={(ev) => {
            setActiveEvent(ev);
          }}
        />
      )}

      {/* 8. Comprehensive Event Directory (Arena + Grid) */}
      {directoryOpen && (
        <EventDirectoryModal
          initialCategory={directoryCategory}
          onSelectEvent={(ev) => {
            setDirectoryOpen(false);
            setActiveEvent(ev);
          }}
          onClose={() => setDirectoryOpen(false)}
        />
      )}

      {/* 9. Interactive Kota Bot Companion Guide Dialogue */}
      {kotaBotState.open && (
        <KotaBotModal
          currentZone={kotaBotState.sceneName || kotaBotState.zone}
          onClose={() => setKotaBotState(prev => ({ ...prev, open: false }))}
          onOpenDirectory={(cat) => {
            setKotaBotState(prev => ({ ...prev, open: false }));
            handleOpenDirectory(cat || 'all');
          }}
          onOpenMap={() => {
            setKotaBotState(prev => ({ ...prev, open: false }));
            setMapOpen(true);
          }}
          onOpenAchievements={() => {
            setKotaBotState(prev => ({ ...prev, open: false }));
            setStatsModalState({ open: true, tab: 'quests' });
          }}
        />
      )}

      {/* 10. REVERIE LIVE Schedule (Circuit Grand Prix & Timeline) */}
      {liveOpen && (
        <ReverieLiveModal
          onClose={() => setLiveOpen(false)}
          onSelectEvent={(ev) => {
            setLiveOpen(false);
            setActiveEvent(ev);
          }}
        />
      )}

      {/* 11. Retro Mini-Game Arcade Hub (All 5 Games) */}
      {arcadeOpen && (
        <MiniGameArcade
          onClose={() => setArcadeOpen(false)}
          onOpenRewards={() => {
            setArcadeOpen(false);
            setSponsorsModalState({ open: true, tab: 'rewards' });
          }}
          onSkipToSponsors={() => {
            setArcadeOpen(false);
            setSponsorsModalState({ open: true, tab: 'sponsors' });
          }}
        />
      )}

      {/* 12. Flagship 5-Stage Retro Arcade Festival Adventure */}
      {arcadeAdventureOpen && (
        <ArcadeAdventureModal
          initialStage={arcadeAdventureStage}
          initialView={arcadeAdventureView}
          onClose={() => setArcadeAdventureOpen(false)}
          onSelectEvent={(ev) => {
            setArcadeAdventureOpen(false);
            setActiveEvent(ev);
          }}
          onOpenFullDirectory={() => {
            setArcadeAdventureOpen(false);
            handleOpenDirectory('all');
          }}
          onOpenRewards={() => {
            setArcadeAdventureOpen(false);
            setSponsorsModalState({ open: true, tab: 'rewards' });
          }}
        />
      )}

      {/* 13. Retro Hyperspace Warp Tunnel Transition */}
      {warpTunnelData && (
        <WarpTunnelOverlay
          data={warpTunnelData}
          onComplete={() => setWarpTunnelData(null)}
        />
      )}
    </div>
  );
}

export default App;
