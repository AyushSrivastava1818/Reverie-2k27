import React, { useState } from 'react';
import { 
  Volume2, VolumeX, Maximize2, Minimize2, Map, List, 
  Trophy, Sparkles, Image as ImageIcon, HeartHandshake, Phone, Shirt,
  Menu, X, Radio, Gamepad2
} from 'lucide-react';
import { soundEngine } from '../../game/systems/SoundEngine';

export function WebsiteHeader({ 
  onOpenMap, 
  onOpenDirectory, 
  onOpenLive,
  onOpenArcade,
  onOpenSkins,
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
    if (!callback) return;
    soundEngine.playBlip();
    setMobileMenuOpen(false);
    callback();
  };

  // Exactly the 9 specified navigation destinations:
  // MAP | EVENTS | LIVE | ARCADE | SKINS | STATS | GLIMPSES | SPONSORS | CONTACT
  const NAV_ITEMS = [
    { label: 'MAP', icon: Map, color: 'text-amber-400', border: 'border-amber-500/60 hover:border-amber-400 bg-amber-950/60 text-amber-200', action: onOpenMap },
    { label: 'EVENTS', icon: List, color: 'text-pink-400', border: 'border-pink-500/60 hover:border-pink-400 bg-pink-950/60 text-pink-200', action: onOpenDirectory },
    { label: 'LIVE', icon: Radio, color: 'text-rose-400', border: 'border-rose-500/70 hover:border-rose-400 bg-rose-950/70 text-rose-200', action: onOpenLive, pulse: true },
    { label: 'ARCADE', icon: Gamepad2, color: 'text-pink-400', border: 'border-pink-500/80 hover:border-pink-300 bg-gradient-to-r from-pink-950 via-purple-950 to-pink-950 text-pink-200 shadow-[0_0_15px_rgba(236,72,153,0.4)]', action: onOpenArcade, pulse: true },
    { label: 'SKINS', icon: Shirt, color: 'text-cyan-400', border: 'border-cyan-500/60 hover:border-cyan-400 bg-cyan-950/60 text-cyan-200', action: onOpenSkins },
    { label: 'STATS', icon: Trophy, color: 'text-yellow-400', border: 'border-yellow-500/60 hover:border-yellow-400 bg-yellow-950/60 text-yellow-200', action: onOpenStats },
    { label: 'GLIMPSES', icon: ImageIcon, color: 'text-indigo-400', border: 'border-indigo-500/60 hover:border-indigo-400 bg-indigo-950/60 text-indigo-200', action: onOpenGallery },
    { label: 'SPONSORS', icon: HeartHandshake, color: 'text-emerald-400', border: 'border-emerald-500/70 hover:border-emerald-400 bg-emerald-950/70 text-emerald-200', action: onOpenSponsors },
    { label: 'CONTACT', icon: Phone, color: 'text-teal-400', border: 'border-teal-500/60 hover:border-teal-400 bg-teal-950/60 text-teal-200', action: onOpenContacts }
  ];

  return (
    <header className="relative z-40 w-full h-14 sm:h-16 bg-[#0c061e]/95 border-b-2 border-purple-500/50 backdrop-blur-md px-3 sm:px-6 flex items-center justify-between shrink-0 shadow-2xl shadow-purple-950/60 select-none">
      
      {/* --------------------------------------------------------------------- */}
      {/* LEFT: Official REVERIE Wordmark Logo (Never cropped, exact ratio)     */}
      {/* --------------------------------------------------------------------- */}
      <div className="flex items-center gap-3 shrink-0">
        <div className="flex items-center gap-2">
          <img 
            src="/assets/branding/reverie_logo.png" 
            alt="REVERIE" 
            className="h-6 sm:h-7 w-auto object-contain filter drop-shadow-[0_0_10px_rgba(255,255,255,0.7)]"
          />
          <span className="font-display text-xs sm:text-sm text-yellow-400 font-black tracking-wider">
            2K27
          </span>
        </div>

        <div className="h-5 w-px bg-purple-800/60 hidden lg:block" />

        <div className="hidden lg:flex flex-col">
          <span className="font-display text-[9px] text-purple-200 uppercase tracking-widest font-extrabold">
            THE PIXELVERSE
          </span>
          <span className="font-body text-[10px] text-slate-300 font-semibold tracking-wider">
            IIIT KOTA
          </span>
        </div>
      </div>

      {/* --------------------------------------------------------------------- */}
      {/* DESKTOP NAVIGATION BAR: Exactly the 9 destinations                     */}
      {/* MAP | EVENTS | LIVE | ARCADE | SKINS | STATS | GLIMPSES | SPONSORS | CONTACT */}
      {/* --------------------------------------------------------------------- */}
      <nav className="hidden xl:flex items-center gap-1.5 2xl:gap-2">
        {NAV_ITEMS.map((item) => {
          const IconComp = item.icon;
          return (
            <button
              key={item.label}
              onClick={() => handleNavClick(item.action)}
              className={`px-2.5 py-1.5 2xl:px-3 rounded-xl border ${item.border} hover:text-white font-display text-xs font-black uppercase tracking-wider flex items-center gap-1.5 transition-all hover:scale-105 cursor-pointer shadow-sm`}
            >
              {item.pulse ? (
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
                </span>
              ) : (
                <IconComp size={15} className={item.color} />
              )}
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* --------------------------------------------------------------------- */}
      {/* RIGHT: Compact Controls & Mobile Hamburger                            */}
      {/* --------------------------------------------------------------------- */}
      <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
        
        {/* Compact Mobile Shortcuts (MAP, EVENTS, SPONSORS) for small viewports */}
        <div className="flex xl:hidden items-center gap-1">
          <button
            onClick={() => handleNavClick(onOpenMap)}
            className="px-2 py-1 rounded-lg bg-amber-950/80 border border-amber-500/70 text-amber-200 font-display text-[11px] font-bold"
          >
            MAP
          </button>
          <button
            onClick={() => handleNavClick(onOpenDirectory)}
            className="px-2 py-1 rounded-lg bg-pink-950/80 border border-pink-500/70 text-pink-200 font-display text-[11px] font-bold"
          >
            EVENTS
          </button>
          <button
            onClick={() => handleNavClick(onOpenSponsors)}
            className="px-2 py-1 rounded-lg bg-emerald-950/80 border border-emerald-500/70 text-emerald-300 font-display text-[11px] font-black"
          >
            SPONSORS
          </button>
        </div>

        {/* Audio Mute/Unmute */}
        <button
          onClick={toggleSound}
          title={muted ? 'Unmute Audio' : 'Mute Audio'}
          className="p-1.5 sm:p-2 bg-[#140b2e] hover:bg-purple-900 border border-purple-500/60 rounded-xl text-white shadow transition-all hover:scale-105 cursor-pointer"
        >
          {muted ? <VolumeX size={18} className="text-rose-400" /> : <Volume2 size={18} className="text-emerald-400" />}
        </button>

        {/* Fullscreen Toggle */}
        <button
          onClick={toggleFullscreen}
          title="Toggle Fullscreen"
          className="p-1.5 sm:p-2 bg-[#140b2e] hover:bg-purple-900 border border-purple-500/60 rounded-xl text-white hidden sm:block shadow transition-all hover:scale-105 cursor-pointer"
        >
          {isFullscreen ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
        </button>

        {/* Mobile Hamburger Toggle */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="xl:hidden p-1.5 sm:p-2 bg-purple-950 hover:bg-purple-900 border border-purple-400/80 rounded-xl text-purple-200 hover:text-white shadow cursor-pointer"
          aria-label="Toggle navigation menu"
        >
          {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

      {/* --------------------------------------------------------------------- */}
      {/* MOBILE EXPANDABLE DRAWER: All 9 Destinations in Exact Order           */}
      {/* --------------------------------------------------------------------- */}
      {mobileMenuOpen && (
        <div className="absolute top-full left-0 right-0 bg-[#0c061e]/98 border-b-2 border-purple-500/60 shadow-2xl p-4 sm:p-5 flex flex-col gap-2.5 xl:hidden animate-fadeIn backdrop-blur-xl z-50">
          <div className="font-display text-xs text-yellow-400 font-black uppercase tracking-wider mb-1">
            REVERIE NAVIGATION
          </div>

          <div className="grid grid-cols-3 gap-2">
            {NAV_ITEMS.map((item) => {
              const IconComp = item.icon;
              return (
                <button
                  key={item.label}
                  onClick={() => handleNavClick(item.action)}
                  className={`p-2.5 rounded-xl border ${item.border} font-display text-xs font-black uppercase flex flex-col items-center justify-center gap-1.5 transition-all text-center`}
                >
                  <IconComp size={18} className={item.color} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
}
