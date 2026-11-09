import React, { useState } from 'react';
import { 
  Volume2, VolumeX, Maximize2, Minimize2, Map, List, 
  Trophy, Sparkles, Image as ImageIcon, HeartHandshake, Phone, Shirt,
  Menu, X, Bot, Radio, Gamepad2, Gift
} from 'lucide-react';
import { soundEngine } from '../../game/systems/SoundEngine';

export function WebsiteHeader({ 
  onOpenMap, 
  onOpenDirectory, 
  onOpenLive,
  onOpenArcade,
  onOpenRewards,
  onOpenSkins,
  onOpenBot,
  onOpenAchievements,
  onOpenStats, 
  onOpenGallery, 
  onOpenSponsors, 
  onOpenContacts 
}) {
  const [muted, setMuted] = useState(soundEngine.muted);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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

  const handleNavClick = (callback) => {
    soundEngine.playBlip();
    setMobileMenuOpen(false);
    callback();
  };

  return (
    <header className="relative z-40 w-full h-14 sm:h-16 bg-[#0d0720]/95 border-b-2 border-purple-500/50 backdrop-blur-md px-3 sm:px-6 flex items-center justify-between shrink-0 shadow-2xl shadow-purple-950/60 select-none">
      {/* --------------------------------------------------------------------- */}
      {/* LEFT: Official REVERIE Wordmark Logo (Never cropped, exact proportions) */}
      {/* --------------------------------------------------------------------- */}
      <div className="flex items-center gap-3 sm:gap-4 shrink-0">
        <div className="flex items-center gap-2.5">
          <img 
            src="/assets/branding/reverie_logo.png" 
            alt="REVERIE" 
            className="h-6 sm:h-8 w-auto object-contain filter drop-shadow-[0_0_12px_rgba(255,255,255,0.7)]"
          />
          <span className="font-display text-sm sm:text-base text-yellow-400 font-black tracking-wider">
            2K27
          </span>
        </div>

        <div className="h-6 w-px bg-purple-800/60 hidden md:block" />

        <div className="hidden lg:flex flex-col">
          <span className="font-display text-[10px] text-purple-200 uppercase tracking-widest font-extrabold">
            THE PIXELVERSE
          </span>
          <span className="font-body text-[11px] text-slate-300 font-semibold tracking-wider">
            IIIT KOTA FESTIVAL
          </span>
        </div>
      </div>

      {/* --------------------------------------------------------------------- */}
      {/* DESKTOP NAVIGATION BAR (Clean, spacious layout with Oxanium typography) */}
      {/* --------------------------------------------------------------------- */}
      <nav className="hidden xl:flex items-center gap-2">
        <button
          onClick={() => handleNavClick(onOpenMap)}
          className="px-3 py-1.5 rounded-xl bg-amber-950/70 hover:bg-amber-900 border border-amber-500/60 text-amber-200 hover:text-white font-display text-xs font-black uppercase tracking-wider flex items-center gap-1.5 transition-all hover:scale-105 cursor-pointer"
        >
          <Map size={16} className="text-amber-400" />
          <span>MAP</span>
        </button>

        <button
          onClick={() => handleNavClick(onOpenDirectory)}
          className="px-3 py-1.5 rounded-xl bg-pink-950/70 hover:bg-pink-900 border border-pink-500/60 text-pink-200 hover:text-white font-display text-xs font-black uppercase tracking-wider flex items-center gap-1.5 transition-all hover:scale-105 cursor-pointer"
        >
          <List size={16} className="text-pink-400" />
          <span>EVENTS (18)</span>
        </button>

        <button
          onClick={() => handleNavClick(onOpenArcade)}
          className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-pink-950 to-purple-950 hover:from-pink-900 hover:to-purple-900 border border-pink-500/80 text-pink-200 hover:text-white font-display text-xs font-black uppercase tracking-wider flex items-center gap-1.5 transition-all hover:scale-105 cursor-pointer shadow-md shadow-pink-500/20"
        >
          <Gamepad2 size={16} className="text-pink-400 animate-pulse" />
          <span>ARCADE</span>
        </button>

        <button
          onClick={() => handleNavClick(onOpenRewards)}
          className="px-3 py-1.5 rounded-xl bg-amber-950/80 hover:bg-amber-900 border border-yellow-500/80 text-yellow-300 hover:text-white font-display text-xs font-black uppercase tracking-wider flex items-center gap-1.5 transition-all hover:scale-105 cursor-pointer shadow-md shadow-yellow-500/20"
        >
          <Gift size={16} className="text-yellow-400 animate-bounce" />
          <span>REWARDS</span>
        </button>

        <button
          onClick={() => handleNavClick(onOpenLive)}
          className="px-3 py-1.5 rounded-xl bg-rose-950/80 hover:bg-rose-900 border border-rose-500/80 text-rose-200 hover:text-white font-display text-xs font-black uppercase tracking-wider flex items-center gap-1.5 transition-all hover:scale-105 cursor-pointer shadow-md shadow-rose-500/20"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
          </span>
          <Radio size={14} className="text-rose-400" />
          <span>LIVE</span>
        </button>

        <button
          onClick={() => handleNavClick(onOpenSkins)}
          className="px-3 py-1.5 rounded-xl bg-cyan-950/70 hover:bg-cyan-900 border border-cyan-500/60 text-cyan-200 hover:text-white font-display text-xs font-black uppercase tracking-wider flex items-center gap-1.5 transition-all hover:scale-105 cursor-pointer"
        >
          <Shirt size={16} className="text-cyan-400" />
          <span>SKINS</span>
        </button>

        <button
          onClick={() => handleNavClick(onOpenBot)}
          className="px-3 py-1.5 rounded-xl bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-400/80 text-cyan-300 hover:text-white font-display text-xs font-black uppercase tracking-wider flex items-center gap-1.5 transition-all hover:scale-105 cursor-pointer shadow-md shadow-cyan-500/10"
        >
          <Bot size={16} className="text-cyan-400" />
          <span>KOTA BOT</span>
        </button>

        <button
          onClick={() => handleNavClick(onOpenAchievements)}
          className="px-3 py-1.5 rounded-xl bg-purple-950/80 hover:bg-purple-900 border border-yellow-400/70 text-yellow-300 hover:text-white font-display text-xs font-black uppercase tracking-wider flex items-center gap-1.5 transition-all hover:scale-105 cursor-pointer shadow-md shadow-yellow-500/10"
        >
          <Sparkles size={16} className="text-yellow-400 animate-pulse" />
          <span>QUESTS</span>
        </button>

        <button
          onClick={() => handleNavClick(onOpenStats)}
          className="px-3 py-1.5 rounded-xl bg-[#140b2e] hover:bg-purple-900 border border-yellow-500/50 text-yellow-200 hover:text-white font-display text-xs font-black uppercase tracking-wider flex items-center gap-1.5 transition-all hover:scale-105 cursor-pointer"
        >
          <Trophy size={16} className="text-yellow-400" />
          <span>STATS</span>
        </button>

        <button
          onClick={() => handleNavClick(onOpenGallery)}
          className="px-3 py-1.5 rounded-xl bg-[#140b2e] hover:bg-purple-900 border border-purple-500/50 text-purple-200 hover:text-white font-display text-xs font-black uppercase tracking-wider flex items-center gap-1.5 transition-all hover:scale-105 cursor-pointer"
        >
          <ImageIcon size={16} className="text-purple-300" />
          <span>GLIMPSES</span>
        </button>

        <button
          onClick={() => handleNavClick(onOpenSponsors)}
          className="px-3 py-1.5 rounded-xl bg-[#140b2e] hover:bg-purple-900 border border-emerald-500/50 text-emerald-200 hover:text-white font-display text-xs font-black uppercase tracking-wider flex items-center gap-1.5 transition-all hover:scale-105 cursor-pointer"
        >
          <HeartHandshake size={16} className="text-emerald-400" />
          <span>SPONSORS</span>
        </button>

        <button
          onClick={() => handleNavClick(onOpenContacts)}
          className="px-3 py-1.5 rounded-xl bg-[#140b2e] hover:bg-purple-900 border border-rose-500/50 text-rose-200 hover:text-white font-display text-xs font-black uppercase tracking-wider flex items-center gap-1.5 transition-all hover:scale-105 cursor-pointer"
        >
          <Phone size={16} className="text-rose-400" />
          <span>CONTACT</span>
        </button>
      </nav>

      {/* --------------------------------------------------------------------- */}
      {/* CONTROLS: Audio + Fullscreen + Mobile Menu Toggle                     */}
      {/* --------------------------------------------------------------------- */}
      <div className="flex items-center gap-2 sm:gap-2.5">
        {/* Compact Quick Nav for Medium Desktops (md to xl) */}
        <div className="hidden md:flex xl:hidden items-center gap-1.5">
          <button
            onClick={() => handleNavClick(onOpenMap)}
            className="px-2.5 py-1.5 rounded-xl bg-amber-950/70 border border-amber-500/60 text-amber-300 font-display text-xs font-bold"
          >
            MAP
          </button>
          <button
            onClick={() => handleNavClick(onOpenDirectory)}
            className="px-2.5 py-1.5 rounded-xl bg-pink-950/70 border border-pink-500/60 text-pink-300 font-display text-xs font-bold"
          >
            EVENTS
          </button>
          <button
            onClick={() => handleNavClick(onOpenArcade)}
            className="px-2.5 py-1.5 rounded-xl bg-pink-950/80 border border-pink-500/70 text-pink-300 font-display text-xs font-black flex items-center gap-1"
          >
            <Gamepad2 size={13} className="text-pink-400" />
            ARCADE
          </button>
          <button
            onClick={() => handleNavClick(onOpenRewards)}
            className="px-2.5 py-1.5 rounded-xl bg-amber-950/80 border border-yellow-500/70 text-yellow-300 font-display text-xs font-black flex items-center gap-1"
          >
            <Gift size={13} className="text-yellow-400" />
            REWARDS
          </button>
          <button
            onClick={() => handleNavClick(onOpenLive)}
            className="px-2.5 py-1.5 rounded-xl bg-rose-950/80 border border-rose-500/70 text-rose-300 font-display text-xs font-black flex items-center gap-1"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-ping" />
            LIVE
          </button>
          <button
            onClick={() => handleNavClick(onOpenBot)}
            className="px-2.5 py-1.5 rounded-xl bg-cyan-950/70 border border-cyan-500/60 text-cyan-300 font-display text-xs font-bold"
          >
            BOT
          </button>
          <button
            onClick={() => handleNavClick(onOpenAchievements)}
            className="px-2.5 py-1.5 rounded-xl bg-purple-950/70 border border-yellow-500/60 text-yellow-300 font-display text-xs font-bold"
          >
            QUESTS
          </button>
        </div>

        {/* Audio Toggle */}
        <button
          onClick={toggleSound}
          title={muted ? 'Unmute Audio' : 'Mute Audio'}
          className="p-2 sm:p-2.5 bg-[#140b2e] hover:bg-purple-900 border border-purple-500/60 rounded-xl text-white shadow-lg transition-all hover:scale-105 cursor-pointer"
        >
          {muted ? <VolumeX size={19} className="text-rose-400" /> : <Volume2 size={19} className="text-emerald-400" />}
        </button>

        {/* Fullscreen Toggle */}
        <button
          onClick={toggleFullscreen}
          title="Toggle Fullscreen"
          className="p-2 sm:p-2.5 bg-[#140b2e] hover:bg-purple-900 border border-purple-500/60 rounded-xl text-white hidden sm:block shadow-lg transition-all hover:scale-105 cursor-pointer"
        >
          {isFullscreen ? <Minimize2 size={19} /> : <Maximize2 size={19} />}
        </button>

        {/* Mobile Hamburger Toggle */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="xl:hidden p-2 sm:p-2.5 bg-purple-950/80 hover:bg-purple-900 border border-purple-400/80 rounded-xl text-purple-200 hover:text-white shadow-lg cursor-pointer"
          aria-label="Toggle navigation menu"
        >
          {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* --------------------------------------------------------------------- */}
      {/* MOBILE / TABLET EXPANDABLE NAVIGATION DRAWER (No squeezed buttons!)     */}
      {/* --------------------------------------------------------------------- */}
      {mobileMenuOpen && (
        <div className="absolute top-full left-0 right-0 bg-[#0c061e]/98 border-b-2 border-purple-500/60 shadow-2xl p-4 sm:p-6 flex flex-col gap-3 xl:hidden animate-fadeIn backdrop-blur-xl">
          <div className="font-display text-xs text-yellow-400 font-black uppercase tracking-wider mb-1">
            FESTIVAL NAVIGATION & DIRECTORY
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <button
              onClick={() => handleNavClick(onOpenArcade)}
              className="p-3 rounded-xl bg-gradient-to-r from-pink-950 to-purple-950 border border-pink-500/70 text-pink-200 font-display text-xs font-black uppercase flex items-center gap-2.5 shadow-md shadow-pink-500/20"
            >
              <Gamepad2 size={18} className="text-pink-400 animate-pulse" />
              <span>ARCADE GAMES</span>
            </button>

            <button
              onClick={() => handleNavClick(onOpenRewards)}
              className="p-3 rounded-xl bg-amber-950/80 border border-yellow-500/70 text-yellow-300 font-display text-xs font-black uppercase flex items-center gap-2.5 shadow-md shadow-yellow-500/20"
            >
              <Gift size={18} className="text-yellow-400 animate-bounce" />
              <span>REWARDS SHOP</span>
            </button>

            <button
              onClick={() => handleNavClick(onOpenMap)}
              className="p-3 rounded-xl bg-amber-950/80 border border-amber-500/60 text-amber-200 font-display text-xs font-bold uppercase flex items-center gap-2.5"
            >
              <Map size={18} className="text-amber-400" />
              <span>MAP TRAVEL</span>
            </button>

            <button
              onClick={() => handleNavClick(onOpenDirectory)}
              className="p-3 rounded-xl bg-pink-950/80 border border-pink-500/60 text-pink-200 font-display text-xs font-bold uppercase flex items-center gap-2.5"
            >
              <List size={18} className="text-pink-400" />
              <span>18 EVENTS</span>
            </button>

            <button
              onClick={() => handleNavClick(onOpenLive)}
              className="p-3 rounded-xl bg-rose-950/80 border border-rose-500/70 text-rose-200 font-display text-xs font-bold uppercase flex items-center gap-2.5 shadow-md shadow-rose-500/20"
            >
              <Radio size={18} className="text-rose-400 animate-pulse" />
              <span>LIVE SCHEDULE</span>
            </button>

            <button
              onClick={() => handleNavClick(onOpenSkins)}
              className="p-3 rounded-xl bg-cyan-950/80 border border-cyan-500/60 text-cyan-200 font-display text-xs font-bold uppercase flex items-center gap-2.5"
            >
              <Shirt size={18} className="text-cyan-400" />
              <span>AVATAR SKINS</span>
            </button>

            <button
              onClick={() => handleNavClick(onOpenBot)}
              className="p-3 rounded-xl bg-cyan-950/80 border border-cyan-400/70 text-cyan-300 font-display text-xs font-bold uppercase flex items-center gap-2.5"
            >
              <Bot size={18} className="text-cyan-400 animate-pulse" />
              <span>KOTA BOT</span>
            </button>

            <button
              onClick={() => handleNavClick(onOpenAchievements)}
              className="p-3 rounded-xl bg-purple-950/80 border border-yellow-400/60 text-yellow-300 font-display text-xs font-bold uppercase flex items-center gap-2.5"
            >
              <Sparkles size={18} className="text-yellow-400 animate-pulse" />
              <span>QUEST LOG</span>
            </button>

            <button
              onClick={() => handleNavClick(onOpenStats)}
              className="p-3 rounded-xl bg-[#170e30] border border-yellow-500/50 text-yellow-200 font-display text-xs font-bold uppercase flex items-center gap-2.5"
            >
              <Trophy size={18} className="text-yellow-400" />
              <span>IMPACT STATS</span>
            </button>

            <button
              onClick={() => handleNavClick(onOpenGallery)}
              className="p-3 rounded-xl bg-[#170e30] border border-purple-500/50 text-purple-200 font-display text-xs font-bold uppercase flex items-center gap-2.5"
            >
              <ImageIcon size={18} className="text-purple-300" />
              <span>PAST GLIMPSES</span>
            </button>

            <button
              onClick={() => handleNavClick(onOpenSponsors)}
              className="p-3 rounded-xl bg-[#170e30] border border-emerald-500/50 text-emerald-200 font-display text-xs font-bold uppercase flex items-center gap-2.5"
            >
              <HeartHandshake size={18} className="text-emerald-400" />
              <span>SPONSORS</span>
            </button>
          </div>

          <button
            onClick={() => handleNavClick(onOpenContacts)}
            className="p-3 rounded-xl bg-rose-950/80 border border-rose-500/50 text-rose-200 font-display text-xs font-bold uppercase flex items-center justify-center gap-2.5 mt-1"
          >
            <Phone size={18} className="text-rose-400" />
            <span>CONTACT SECRETARIAT & PR</span>
          </button>
        </div>
      )}
    </header>
  );
}

