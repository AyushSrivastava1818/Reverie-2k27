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
import { AchievementsModal } from './components/Modals/AchievementsModal';
import { KotaBotModal } from './components/Modals/KotaBotModal';
import { ReverieLiveModal } from './components/Modals/ReverieLiveModal';
import { MiniGameArcade } from './components/Arcade/MiniGameArcade';
import { RewardsShopModal } from './components/Modals/RewardsShopModal';
import { LeaderboardModal } from './components/Modals/LeaderboardModal';
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

  // Modals state
  const [activeEvent, setActiveEvent] = useState(null);
  const [statsOpen, setStatsOpen] = useState(false);
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [sponsorsOpen, setSponsorsOpen] = useState(false);
  const [contactsOpen, setContactsOpen] = useState(false);
  const [mapOpen, setMapOpen] = useState(false);
  const [directoryOpen, setDirectoryOpen] = useState(false);
  const [directoryCategory, setDirectoryCategory] = useState('all');
  const [skinsOpen, setSkinsOpen] = useState(false);
  const [achievementsOpen, setAchievementsOpen] = useState(false);
  const [liveOpen, setLiveOpen] = useState(false);
  const [arcadeOpen, setArcadeOpen] = useState(false);
  const [rewardsOpen, setRewardsOpen] = useState(false);
  const [leaderboardOpen, setLeaderboardOpen] = useState(false);
  const [kotaBotState, setKotaBotState] = useState({ open: false, zone: 'StartingKingdomScene', sceneName: 'Starting Kingdom' });

  // Proximity flags for mobile action button
  const [isPipeNear, setIsPipeNear] = useState(false);
  const [isEventNear, setIsEventNear] = useState(false);
  const [isNpcNear, setIsNpcNear] = useState(false);

  const handleOpenDirectory = (cat = 'all') => {
    setDirectoryCategory(cat || 'all');
    setDirectoryOpen(true);
  };

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
        setStatsOpen(true);
      } else if (eventData.customModal === 'gallery') {
        achievementSystem.recordFestivalInfo();
        setGalleryOpen(true);
      } else if (eventData.customModal === 'sponsors') {
        achievementSystem.recordFestivalInfo();
        setSponsorsOpen(true);
      } else if (eventData.customModal === 'contacts') {
        achievementSystem.recordFestivalInfo();
        setContactsOpen(true);
      } else if (eventData.customModal === 'skins') {
        setSkinsOpen(true);
      } else if (eventData.customModal === 'arcade') {
        setArcadeOpen(true);
      } else if (eventData.customModal === 'leaderboard') {
        setLeaderboardOpen(true);
      } else if (eventData.customModal === 'rewards') {
        setRewardsOpen(true);
      } else {
        setActiveEvent(eventData);
      }
    });

    // 4. Kota Bot dialogue trigger
    const unbindKotaBot = eventBus.on('open-kota-dialogue', (data) => {
      setKotaBotState({
        open: true,
        zone: data.zone || currentZoneKey,
        sceneName: data.sceneName || currentZone
      });
    });

    // 5. Open Achievements Modal
    const unbindAchievements = eventBus.on('open-achievements-modal', () => {
      setAchievementsOpen(true);
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

    // Global ESC Key Close Handler for all modals
    const handleGlobalKeyDown = (e) => {
      if (e.key === 'Escape') {
        setActiveEvent(null);
        setStatsOpen(false);
        setGalleryOpen(false);
        setSponsorsOpen(false);
        setContactsOpen(false);
        setMapOpen(false);
        setDirectoryOpen(false);
        setSkinsOpen(false);
        setAchievementsOpen(false);
        setLiveOpen(false);
        setArcadeOpen(false);
        setRewardsOpen(false);
        setLeaderboardOpen(false);
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
      window.removeEventListener('keydown', handleGlobalKeyDown);
    };
  }, [currentZone, currentZoneKey]);

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-[#06030e] flex flex-col select-none">
      {/* Real-Time Achievement Unlock Toasts */}
      <AchievementToast />

      {/* LAYER 1: Dedicated Website Header (Always visible, clean, zero duplication!) */}
      <WebsiteHeader
        onOpenMap={() => setMapOpen(true)}
        onOpenDirectory={() => handleOpenDirectory('all')}
        onOpenLive={() => setLiveOpen(true)}
        onOpenArcade={() => setArcadeOpen(true)}
        onOpenRewards={() => setRewardsOpen(true)}
        onOpenLeaderboard={() => setLeaderboardOpen(true)}
        onOpenSkins={() => setSkinsOpen(true)}
        onOpenBot={() => setKotaBotState({ open: true, zone: currentZoneKey, sceneName: currentZone })}
        onOpenAchievements={() => setAchievementsOpen(true)}
        onOpenStats={() => {
          achievementSystem.recordFestivalInfo();
          setStatsOpen(true);
        }}
        onOpenGallery={() => {
          achievementSystem.recordFestivalInfo();
          setGalleryOpen(true);
        }}
        onOpenSponsors={() => {
          achievementSystem.recordFestivalInfo();
          setSponsorsOpen(true);
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
              soundEngine.playPipe();
              if (sceneKey !== 'StartingKingdomScene') {
                const switchNow = () => eventBus.emit('switch-zone', sceneKey);
                setTimeout(switchNow, 80);
                setTimeout(switchNow, 220);
                setTimeout(switchNow, 400);
              }
            }}
            onOpenDirectory={() => handleOpenDirectory('all')}
            onOpenMap={() => setMapOpen(true)}
            onOpenSkins={() => setSkinsOpen(true)}
            onOpenBot={() => setKotaBotState({ open: true, zone: currentZoneKey, sceneName: currentZone })}
            onOpenStats={() => {
              achievementSystem.recordFestivalInfo();
              setStatsOpen(true);
            }}
            onOpenLive={() => setLiveOpen(true)}
          />
        )}
      </div>

      {/* --- POPUP MODALS --- */}
      {/* 1. Spacious Dedicated Event Details Modal */}
      {activeEvent && (
        <EventModal
          event={activeEvent}
          onClose={() => setActiveEvent(null)}
          onOpenGallery={() => {
            setActiveEvent(null);
            setGalleryOpen(true);
          }}
          onOpenMap={() => {
            setActiveEvent(null);
            setMapOpen(true);
          }}
        />
      )}

      {/* 2. Character Skin Customization Wardrobe Modal */}
      {skinsOpen && (
        <SkinsModal
          currentSkin={currentSkin}
          onSelectSkin={(skinId) => {
            setCurrentSkin(skinId);
            setSkinsOpen(false);
          }}
          onClose={() => setSkinsOpen(false)}
        />
      )}

      {/* 3. Impact Statistics Modal */}
      {statsOpen && (
        <StatsModal onClose={() => setStatsOpen(false)} />
      )}

      {/* 4. Past Glimpses Gallery Lightbox */}
      {galleryOpen && (
        <GalleryModal onClose={() => setGalleryOpen(false)} />
      )}

      {/* 5. Sponsorship & Perks Matrix Modal */}
      {sponsorsOpen && (
        <SponsorsModal onClose={() => setSponsorsOpen(false)} />
      )}

      {/* 6. Contact Secretariat Modal */}
      {contactsOpen && (
        <ContactsModal onClose={() => setContactsOpen(false)} />
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

      {/* 8. Comprehensive Event Directory */}
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
            setAchievementsOpen(true);
          }}
        />
      )}

      {/* 10. Quest & Achievement Log Modal / Festival Passport */}
      {achievementsOpen && (
        <AchievementsModal
          onClose={() => setAchievementsOpen(false)}
          onOpenWardrobe={() => {
            setAchievementsOpen(false);
            setSkinsOpen(true);
          }}
          onOpenMap={() => {
            setAchievementsOpen(false);
            setMapOpen(true);
          }}
        />
      )}

      {/* 11. REVERIE LIVE Schedule & Real-Time Announcements Panel */}
      {liveOpen && (
        <ReverieLiveModal
          onClose={() => setLiveOpen(false)}
          onSelectEvent={(ev) => {
            setLiveOpen(false);
            setActiveEvent(ev);
          }}
        />
      )}

      {/* 12. RETRO MINI-GAME ARCADE HUB */}
      {arcadeOpen && (
        <MiniGameArcade
          onClose={() => setArcadeOpen(false)}
          onOpenRewards={() => {
            setArcadeOpen(false);
            setRewardsOpen(true);
          }}
          onSkipToSponsors={() => {
            setArcadeOpen(false);
            setSponsorsOpen(true);
          }}
        />
      )}

      {/* 13. FESTIVAL REWARDS SHOP & VOUCHERS */}
      {rewardsOpen && (
        <RewardsShopModal
          onClose={() => setRewardsOpen(false)}
          onOpenWardrobe={() => {
            setRewardsOpen(false);
            setSkinsOpen(true);
          }}
        />
      )}

      {/* 14. HIGH SCORE BOULEVARD LEADERBOARD */}
      {leaderboardOpen && (
        <LeaderboardModal
          onClose={() => setLeaderboardOpen(false)}
          currentSkin={currentSkin}
        />
      )}
    </div>
  );
}

export default App;
