import React, { useState } from 'react';
import { 
  Volume2, VolumeX, Maximize2, Minimize2, Map, List, 
  Trophy, Sparkles, Image as ImageIcon, HeartHandshake, Phone, Shirt
} from 'lucide-react';
import { soundEngine } from '../../game/systems/SoundEngine';

export function GameHUD({ 
  currentZone, 
  coinCount, 
  onOpenMap, 
  onOpenDirectory, 
  onOpenSkins,
  onOpenStats, 
  onOpenGallery, 
  onOpenSponsors, 
  onOpenContacts 
}) {
  const [muted, setMuted] = useState(soundEngine.muted);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const toggleSound = () => {
    const next = !muted;
    setMuted(next);
    soundEngine.setMuted(next);
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        setIsFullscreen(false);
      }
    }
  };

  const formatCoins = (count) => {
    return String(count).padStart(3, '0');
  };

  return (
    <header className="absolute top-0 left-0 right-0 z-30 p-3 sm:p-5 pointer-events-none flex flex-col gap-2.5">
      <div className="w-full flex items-center justify-between gap-3 flex-wrap">
        {/* Left: Official REVERIE Brand Badge & Current Zone */}
        <div className="flex items-center gap-3 pointer-events-auto">
          <div className="bg-[#100724]/95 border-2 border-purple-400/90 px-4 py-2 rounded-2xl flex items-center gap-3 shadow-2xl shadow-purple-950/80 backdrop-blur-md">
            <img 
              src="/assets/branding/reverie_logo.png" 
              alt="REVERIE" 
              className="h-7 sm:h-8 w-auto object-contain filter drop-shadow-[0_0_10px_rgba(255,255,255,0.9)]"
            />
            <span className="font-display text-sm sm:text-base text-yellow-400 font-black tracking-wider">
              2K27
            </span>
          </div>

          <div className="bg-[#100724]/95 border-2 border-cyan-400/90 px-4 py-2 rounded-2xl hidden md:flex items-center gap-2.5 shadow-2xl shadow-cyan-950/80 backdrop-blur-md">
            <span className="font-display text-xs sm:text-sm text-cyan-300 font-extrabold uppercase tracking-wider">
              📍 {currentZone}
            </span>
          </div>
        </div>

        {/* Center: Coin Counter */}
        <div className="pointer-events-auto bg-[#1b0d36]/95 border-2 border-yellow-400 px-5 py-2.5 rounded-2xl flex items-center gap-3 shadow-2xl shadow-yellow-500/30 backdrop-blur-md">
          <img 
            src="/assets/sprites/coin.png" 
            alt="Coin" 
            className="w-7 h-7 object-contain image-rendering-pixelated animate-bounce"
            style={{ imageRendering: 'pixelated' }}
          />
          <span className="font-display text-base sm:text-lg text-yellow-300 font-black tracking-wider">
            × {formatCoins(coinCount)}
          </span>
        </div>

        {/* Right: Big, Bold, Crystal-Clear Arcade Buttons (Yellow Circled Area in Image 6!) */}
        <div className="flex items-center gap-2 sm:gap-2.5 pointer-events-auto flex-wrap">
          {/* Fast Travel / Map */}
          <button
            onClick={onOpenMap}
            title="Fast Travel Map"
            className="px-3.5 py-2 sm:px-4 sm:py-2.5 bg-amber-950/90 hover:bg-amber-900 border-2 border-amber-400 rounded-xl text-amber-200 flex items-center gap-2 shadow-xl shadow-amber-500/20 backdrop-blur-md transition-all hover:scale-105 active:scale-95 group"
          >
            <Map size={21} className="text-amber-400 group-hover:rotate-6 transition-transform shrink-0" />
            <span className="font-display text-xs sm:text-sm font-black tracking-wider hidden sm:inline">MAP</span>
          </button>

          {/* Event Directory */}
          <button
            onClick={onOpenDirectory}
            title="Full Event Directory"
            className="px-3.5 py-2 sm:px-4 sm:py-2.5 bg-pink-950/90 hover:bg-pink-900 border-2 border-pink-500 rounded-xl text-pink-200 flex items-center gap-2 shadow-xl shadow-pink-500/20 backdrop-blur-md transition-all hover:scale-105 active:scale-95 group"
          >
            <List size={21} className="text-pink-400 group-hover:scale-110 transition-transform shrink-0" />
            <span className="font-display text-xs sm:text-sm font-black tracking-wider hidden sm:inline">EVENTS</span>
          </button>

          {/* Skins / Avatar */}
          <button
            onClick={onOpenSkins}
            title="Character Skins & Wardrobe"
            className="px-3.5 py-2 sm:px-4 sm:py-2.5 bg-cyan-950/90 hover:bg-cyan-900 border-2 border-cyan-400 rounded-xl text-cyan-200 flex items-center gap-2 shadow-xl shadow-cyan-500/20 backdrop-blur-md transition-all hover:scale-105 active:scale-95 group"
          >
            <Shirt size={21} className="text-cyan-300 group-hover:-rotate-6 transition-transform shrink-0" />
            <span className="font-display text-xs sm:text-sm font-black tracking-wider hidden sm:inline">SKINS</span>
          </button>

          {/* Impact Stats */}
          <button
            onClick={onOpenStats}
            title="Impact Stats"
            className="px-3 py-2 sm:px-3.5 sm:py-2.5 bg-[#170e30]/90 hover:bg-purple-900/60 border-2 border-yellow-400/80 rounded-xl text-yellow-200 hidden lg:flex items-center gap-2 shadow-xl backdrop-blur-md transition-all hover:scale-105"
          >
            <Trophy size={20} className="text-yellow-400 shrink-0" />
            <span className="font-display text-xs sm:text-sm font-black tracking-wider">STATS</span>
          </button>

          {/* Gallery */}
          <button
            onClick={onOpenGallery}
            title="Past Glimpses"
            className="px-3 py-2 sm:px-3.5 sm:py-2.5 bg-[#170e30]/90 hover:bg-purple-900/60 border-2 border-purple-400/80 rounded-xl text-purple-200 hidden xl:flex items-center gap-2 shadow-xl backdrop-blur-md transition-all hover:scale-105"
          >
            <ImageIcon size={20} className="text-purple-300 shrink-0" />
            <span className="font-display text-xs sm:text-sm font-black tracking-wider">GLIMPSES</span>
          </button>

          {/* Sponsors */}
          <button
            onClick={onOpenSponsors}
            title="Sponsorship & Perks"
            className="px-3 py-2 sm:px-3.5 sm:py-2.5 bg-[#170e30]/90 hover:bg-purple-900/60 border-2 border-emerald-400/80 rounded-xl text-emerald-200 hidden 2xl:flex items-center gap-2 shadow-xl backdrop-blur-md transition-all hover:scale-105"
          >
            <HeartHandshake size={20} className="text-emerald-400 shrink-0" />
            <span className="font-display text-xs sm:text-sm font-black tracking-wider">SPONSORS</span>
          </button>

          {/* Contacts */}
          <button
            onClick={onOpenContacts}
            title="Contact Team"
            className="px-3 py-2 sm:px-3.5 sm:py-2.5 bg-[#170e30]/90 hover:bg-purple-900/60 border-2 border-rose-400/80 rounded-xl text-rose-200 hidden 2xl:flex items-center gap-2 shadow-xl backdrop-blur-md transition-all hover:scale-105"
          >
            <Phone size={20} className="text-rose-400 shrink-0" />
            <span className="font-display text-xs sm:text-sm font-black tracking-wider">CONTACT</span>
          </button>

          {/* Sound Toggle */}
          <button
            onClick={toggleSound}
            title={muted ? 'Unmute Audio' : 'Mute Audio'}
            className="p-2.5 sm:p-3 bg-[#170e30]/95 hover:bg-purple-900 border-2 border-purple-400 rounded-xl text-white shadow-xl shadow-purple-500/20 backdrop-blur-md transition-all hover:scale-105 active:scale-95"
          >
            {muted ? <VolumeX size={21} className="text-rose-400" /> : <Volume2 size={21} className="text-emerald-400" />}
          </button>

          {/* Fullscreen Toggle */}
          <button
            onClick={toggleFullscreen}
            title="Toggle Fullscreen"
            className="p-2.5 sm:p-3 bg-[#170e30]/95 hover:bg-purple-900 border-2 border-purple-400 rounded-xl text-white hidden sm:block shadow-xl shadow-purple-500/20 backdrop-blur-md transition-all hover:scale-105 active:scale-95"
          >
            {isFullscreen ? <Minimize2 size={21} /> : <Maximize2 size={21} />}
          </button>
        </div>
      </div>

      {/* Mobile Zone indicator sub-pill */}
      <div className="md:hidden self-start pointer-events-auto bg-[#100724]/95 border-2 border-cyan-400/90 px-3.5 py-1.5 rounded-xl text-xs font-display text-cyan-300 font-extrabold shadow-lg backdrop-blur-sm">
        📍 {currentZone.toUpperCase()}
      </div>
    </header>
  );
}
