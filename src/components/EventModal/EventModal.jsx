import React, { useState, useEffect } from 'react';
import { 
  X, Trophy, MapPin, Users, ExternalLink, Phone, ShieldCheck, 
  Sparkles, CheckCircle2, ArrowLeft, Heart, Share2, Download, Image as ImageIcon
} from 'lucide-react';
import { soundEngine } from '../../game/systems/SoundEngine';
import { achievementSystem } from '../../game/systems/AchievementSystem';
import { eventBus } from '../../game/EventBus';
import { Tilt3DCard } from '../ThreeD/Tilt3DCard';

export function EventModal({ event, onClose, onOpenGallery }) {
  const [isFavorited, setIsFavorited] = useState(() => {
    try {
      const favs = JSON.parse(localStorage.getItem('reverie_favorites') || '[]');
      return favs.includes(event?.id);
    } catch {
      return false;
    }
  });
  const [shareCopied, setShareCopied] = useState(false);

  if (!event) return null;

  useEffect(() => {
    // Record event viewed in Quest & Achievement System
    if (event.id) {
      achievementSystem.recordEvent(event.id);
    }

    // Pause player movement in Phaser while viewing event
    eventBus.emit('game-paused', true);

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        soundEngine.playBlip();
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      eventBus.emit('game-paused', false);
    };
  }, [event.id, onClose]);

  const toggleFavorite = () => {
    soundEngine.playCoin();
    const next = !isFavorited;
    setIsFavorited(next);
    try {
      const favs = JSON.parse(localStorage.getItem('reverie_favorites') || '[]');
      let updated;
      if (next) {
        updated = Array.from(new Set([...favs, event.id]));
      } else {
        updated = favs.filter(id => id !== event.id);
      }
      localStorage.setItem('reverie_favorites', JSON.stringify(updated));
    } catch {}
  };

  const handleShare = () => {
    soundEngine.playBlip();
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setShareCopied(true);
      setTimeout(() => setShareCopied(false), 2000);
    }
  };

  // Determine category badge and accent colors
  const getCategoryMeta = (cat) => {
    switch (cat) {
      case 'flagship':
        return {
          label: 'FLAGSHIP COMPETITION',
          badgeClass: 'bg-purple-950/90 text-purple-200 border-purple-400/70',
          accentColor: 'text-purple-400',
          glowBorder: 'border-purple-500/50',
          btnGradient: 'from-purple-600 via-pink-600 to-amber-500 hover:from-purple-500 hover:to-amber-400'
        };
      case 'technical':
        return {
          label: 'TECHNICAL COMPETITION',
          badgeClass: 'bg-cyan-950/90 text-cyan-200 border-cyan-400/70',
          accentColor: 'text-cyan-400',
          glowBorder: 'border-cyan-500/50',
          btnGradient: 'from-cyan-600 via-blue-600 to-indigo-600 hover:from-cyan-500 hover:to-blue-400'
        };
      case 'cultural':
      default:
        return {
          label: 'CULTURAL SHOWCASE',
          badgeClass: 'bg-pink-950/90 text-pink-200 border-pink-400/70',
          accentColor: 'text-pink-400',
          glowBorder: 'border-pink-500/50',
          btnGradient: 'from-pink-600 via-rose-600 to-purple-600 hover:from-pink-500 hover:to-purple-500'
        };
    }
  };

  const meta = getCategoryMeta(event.category);
  const registrationUrl = event.registrationLink || 'https://unstop.com';

  return (
    <div className="fixed inset-0 z-50 w-screen h-[100dvh] overflow-y-auto bg-[#070311]/98 backdrop-blur-2xl animate-fadeIn select-none">
      
      {/* ========================================================================= */}
      {/* TOP HEADER: Back, Brand, Share, Favorite & Close                          */}
      {/* ========================================================================= */}
      <header className="sticky top-0 z-50 w-full bg-[#0d0720]/95 border-b-2 border-purple-500/40 backdrop-blur-md px-4 sm:px-8 py-3.5 flex items-center justify-between shadow-2xl">
        <div className="flex items-center gap-3 sm:gap-4">
          <button
            onClick={() => {
              soundEngine.playBlip();
              onClose();
            }}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/80 transition-all text-xs font-display font-bold uppercase tracking-wider cursor-pointer"
          >
            <ArrowLeft size={16} />
            <span className="hidden sm:inline">BACK TO MAP</span>
            <span className="sm:hidden">BACK</span>
          </button>

          <div className="h-5 w-px bg-purple-800/60 hidden sm:block" />

          <div className="flex items-center gap-2.5">
            <img 
              src="/assets/branding/reverie_logo.png" 
              alt="REVERIE" 
              className="h-6 sm:h-7 w-auto object-contain filter drop-shadow-[0_0_8px_rgba(255,255,255,0.7)]"
            />
            <span className="font-display text-xs sm:text-sm text-yellow-400 font-black tracking-wider">
              2K27
            </span>
          </div>
        </div>

        {/* Right Tools: Share, Favorite, Close */}
        <div className="flex items-center gap-2">
          {/* Share Button */}
          <button
            onClick={handleShare}
            className="p-2 sm:px-3 sm:py-1.5 rounded-xl bg-slate-900/90 hover:bg-purple-900/60 border border-slate-700/80 text-purple-200 hover:text-white transition-all flex items-center gap-1.5 text-xs font-display font-bold cursor-pointer"
            title="Share Event"
          >
            <Share2 size={16} />
            <span className="hidden sm:inline">{shareCopied ? 'COPIED!' : 'SHARE'}</span>
          </button>

          {/* Favorite Heart Button */}
          <button
            onClick={toggleFavorite}
            className={`p-2 sm:px-3 sm:py-1.5 rounded-xl border transition-all flex items-center gap-1.5 text-xs font-display font-bold cursor-pointer ${
              isFavorited
                ? 'bg-rose-950/90 border-rose-500 text-rose-400 shadow-md shadow-rose-500/20'
                : 'bg-slate-900/90 border-slate-700/80 text-slate-300 hover:text-rose-400'
            }`}
            title={isFavorited ? 'Remove from favorites' : 'Add to favorites'}
          >
            <Heart size={16} fill={isFavorited ? '#f43f5e' : 'none'} />
            <span className="hidden sm:inline">{isFavorited ? 'SAVED' : 'SAVE'}</span>
          </button>

          {/* Close [X] */}
          <button
            onClick={() => {
              soundEngine.playBlip();
              onClose();
            }}
            className="p-2 rounded-xl bg-slate-900/90 hover:bg-rose-950 text-slate-300 hover:text-rose-300 border border-slate-700/80 hover:border-rose-500/60 transition-all cursor-pointer"
            aria-label="Close details"
          >
            <X size={18} />
          </button>
        </div>
      </header>

      {/* ========================================================================= */}
      {/* MAIN CONTAINER: Responsive up to 1320px centered                          */}
      {/* ========================================================================= */}
      <main className="w-full max-w-[1320px] mx-auto px-4 sm:px-8 py-6 sm:py-10 space-y-8 sm:space-y-10">
        
        {/* ========================================================================= */}
        {/* HERO SECTION: 2-Column Spacious Layout (Matching Reference Blueprint)     */}
        {/* ========================================================================= */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center bg-[#0d0722]/90 border-2 border-purple-500/30 rounded-3xl p-6 sm:p-8 lg:p-10 shadow-2xl shadow-purple-950/60">
          
          {/* Left Column: Category, Title, Tagline, Description & CTAs */}
          <div className="lg:col-span-7 space-y-4 sm:space-y-5">
            {/* Category Pill */}
            <div className="flex items-center gap-3 flex-wrap">
              <span className={`px-3.5 py-1 rounded-full text-xs font-display font-black border uppercase tracking-wider ${meta.badgeClass}`}>
                {meta.label}
              </span>
              <span className="font-body text-xs sm:text-sm text-purple-300 font-bold tracking-wider uppercase">
                IIIT KOTA • ANNUAL TECHNO-CULTURAL FEST
              </span>
            </div>

            {/* Event Title (Oxanium ExtraBold, 38-64px) */}
            <h1 className="font-display text-3xl sm:text-5xl lg:text-6xl font-black text-white uppercase tracking-tight leading-[1.05] drop-shadow-[0_4px_24px_rgba(168,85,247,0.4)]">
              {event.title}
            </h1>

            {/* Event Tagline (Bright Yellow Accent) */}
            <p className="font-display text-base sm:text-xl text-yellow-400 font-extrabold uppercase tracking-wide">
              {event.tagline}
            </p>

            {/* Short Introduction Briefing */}
            <p className="font-body text-base sm:text-lg text-slate-200 font-medium leading-relaxed max-w-2xl">
              {event.shortDesc || event.description}
            </p>

            {/* Primary Action Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 pt-2">
              <a
                href={registrationUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => soundEngine.playFanfare()}
                className="px-8 py-3.5 sm:py-4 rounded-full bg-gradient-to-r from-pink-500 via-rose-500 to-pink-600 hover:from-pink-400 hover:to-rose-500 text-white font-display text-sm sm:text-base font-black uppercase tracking-wider flex items-center justify-center gap-2.5 shadow-[0_0_25px_rgba(236,72,153,0.5)] border-2 border-pink-300/80 hover:scale-[1.02] active:scale-98 transition-all cursor-pointer"
              >
                <span>REGISTER NOW</span>
                <ExternalLink size={17} />
              </a>

              <button
                onClick={() => {
                  soundEngine.playSelect();
                  if (onOpenGallery) onOpenGallery();
                }}
                className="px-7 py-3.5 sm:py-4 rounded-full bg-[#170932]/90 hover:bg-[#251052] border-2 border-purple-500/60 text-purple-200 hover:text-white font-display text-xs sm:text-sm font-black uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <ImageIcon size={16} className="text-pink-400" />
                <span>EXPLORE GALLERY</span>
              </button>
            </div>
          </div>

          {/* Right Column: Large Authentic Event Photograph with 3D Depth & Framing */}
          <div className="lg:col-span-5 flex justify-center w-full">
            <Tilt3DCard
              maxTilt={14}
              perspective={900}
              scale={1.03}
              glareOpacity={0.35}
              className="relative w-full aspect-[16/10] sm:aspect-[4/3] rounded-3xl overflow-hidden bg-[#110726] border-2 border-purple-500/50 shadow-2xl shadow-purple-900/50 group"
            >
              {event.image ? (
                <img 
                  src={event.image} 
                  alt={event.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  onError={(e) => {
                    e.currentTarget.src = '/assets/page_4_glimpses.png';
                  }}
                />
              ) : (
                <img 
                  src="/assets/page_4_glimpses.png" 
                  alt={event.title}
                  className="w-full h-full object-cover"
                />
              )}

              {/* Top-Right Official Brochure Download Link */}
              <div className="absolute top-3.5 right-3.5 z-10" style={{ transform: 'translateZ(25px)' }}>
                <a
                  href="/Reverie-Brochure2k27.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/80 hover:bg-yellow-400 hover:text-slate-950 text-yellow-300 font-display text-[10px] sm:text-xs font-black uppercase tracking-wider border border-yellow-400/60 backdrop-blur-md shadow-lg transition-all"
                >
                  <Download size={13} />
                  <span>OFFICIAL BROCHURE</span>
                </a>
              </div>

              {/* Bottom Right Brand Watermark */}
              <div className="absolute bottom-3.5 right-3.5 z-10" style={{ transform: 'translateZ(20px)' }}>
                <span className="font-display text-[10px] text-purple-200 font-black bg-black/80 px-2.5 py-1 rounded-full border border-purple-500/40 backdrop-blur-md">
                  REVERIE 2K27
                </span>
              </div>
            </Tilt3DCard>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 3 QUICK METRIC CARDS: Prize Pool, Venue, Team Format (with 3D Tilt)       */}
        {/* ========================================================================= */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">
          {/* Card 1: PRIZE POOL */}
          <Tilt3DCard
            maxTilt={12}
            perspective={800}
            scale={1.03}
            glareOpacity={0.25}
            className="p-5 sm:p-6 rounded-2xl bg-[#0e0724] border-2 border-yellow-500/40 shadow-xl flex items-start gap-4"
          >
            <div className="p-3 bg-yellow-950/90 border border-yellow-500/50 rounded-xl text-yellow-400 shrink-0 mt-0.5" style={{ transform: 'translateZ(20px)' }}>
              <Trophy size={26} />
            </div>
            <div className="space-y-1" style={{ transform: 'translateZ(15px)' }}>
              <div className="font-display text-xs text-yellow-400 font-black uppercase tracking-wider">
                PRIZE POOL
              </div>
              <div className="font-body text-base sm:text-lg font-bold text-white leading-snug">
                {event.prizePool || 'Cash Prizes & Certificates'}
              </div>
              <div className="font-body text-xs text-slate-400 font-medium">
                Official certificates for all participants
              </div>
            </div>
          </Tilt3DCard>

          {/* Card 2: VENUE LOCATION */}
          <Tilt3DCard
            maxTilt={12}
            perspective={800}
            scale={1.03}
            glareOpacity={0.25}
            className="p-5 sm:p-6 rounded-2xl bg-[#0e0724] border-2 border-cyan-500/40 shadow-xl flex items-start gap-4"
          >
            <div className="p-3 bg-cyan-950/90 border border-cyan-500/50 rounded-xl text-cyan-400 shrink-0 mt-0.5" style={{ transform: 'translateZ(20px)' }}>
              <MapPin size={26} />
            </div>
            <div className="space-y-1" style={{ transform: 'translateZ(15px)' }}>
              <div className="font-display text-xs text-cyan-300 font-black uppercase tracking-wider">
                VENUE
              </div>
              <div className="font-body text-base sm:text-lg font-bold text-white leading-snug">
                {event.venue || 'IIIT Kota Campus Hub'}
              </div>
              <div className="font-body text-xs text-slate-400 font-medium">
                Ranpur, Kota, Rajasthan
              </div>
            </div>
          </Tilt3DCard>

          {/* Card 3: TEAM FORMAT */}
          <Tilt3DCard
            maxTilt={12}
            perspective={800}
            scale={1.03}
            glareOpacity={0.25}
            className="p-5 sm:p-6 rounded-2xl bg-[#0e0724] border-2 border-pink-500/40 shadow-xl flex items-start gap-4"
          >
            <div className="p-3 bg-pink-950/90 border border-pink-500/50 rounded-xl text-pink-400 shrink-0 mt-0.5" style={{ transform: 'translateZ(20px)' }}>
              <Users size={26} />
            </div>
            <div className="space-y-1" style={{ transform: 'translateZ(15px)' }}>
              <div className="font-display text-xs text-pink-300 font-black uppercase tracking-wider">
                TEAM FORMAT
              </div>
              <div className="font-body text-base sm:text-lg font-bold text-white leading-snug">
                {event.teamSize || 'Open Solo / Team'}
              </div>
              <div className="font-body text-xs text-slate-400 font-medium">
                Cross-college squads allowed
              </div>
            </div>
          </Tilt3DCard>
        </section>

        {/* ========================================================================= */}
        {/* SIDE-BY-SIDE CONTENT: ABOUT THE EVENT + RULES & FORMAT                    */}
        {/* ========================================================================= */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8">
          
          {/* Left Column: ABOUT THE EVENT */}
          <div className="lg:col-span-6 p-6 sm:p-8 rounded-3xl bg-[#0e0724] border-2 border-purple-500/30 space-y-4 shadow-xl">
            <div className="flex items-center gap-3">
              <div className="h-6 w-1.5 bg-purple-500 rounded-full" />
              <h2 className="font-display text-lg sm:text-xl font-black text-white uppercase tracking-wider">
                ABOUT THE EVENT
              </h2>
            </div>

            <div className="font-body text-sm sm:text-base text-slate-200 font-medium leading-relaxed space-y-3">
              <p>{event.description}</p>
              {event.eligibility && (
                <div className="pt-2 text-xs sm:text-sm text-cyan-300 font-semibold border-t border-purple-900/40 flex items-center gap-2">
                  <ShieldCheck size={16} className="text-cyan-400 shrink-0" />
                  <span>Eligibility: {event.eligibility}</span>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: RULES & FORMAT (Numbered Cards) */}
          <div className="lg:col-span-6 p-6 sm:p-8 rounded-3xl bg-[#0e0724] border-2 border-purple-500/30 space-y-4 shadow-xl">
            <div className="flex items-center gap-3">
              <div className="h-6 w-1.5 bg-pink-500 rounded-full" />
              <h2 className="font-display text-lg sm:text-xl font-black text-white uppercase tracking-wider">
                RULES & FORMAT
              </h2>
            </div>

            <div className="space-y-3">
              {event.rules && event.rules.length > 0 ? (
                event.rules.map((rule, idx) => (
                  <div 
                    key={idx}
                    className="p-3.5 sm:p-4 rounded-2xl bg-[#140b2e] border border-purple-500/30 flex items-start gap-3 shadow-md"
                  >
                    <span className="font-display text-xs font-black text-pink-400 bg-pink-950/80 border border-pink-500/40 px-2 py-0.5 rounded-md shrink-0 mt-0.5">
                      {String(idx + 1).padStart(2, '0')}
                    </span>
                    <p className="font-body text-xs sm:text-sm text-slate-200 font-medium leading-relaxed">
                      {rule}
                    </p>
                  </div>
                ))
              ) : (
                <div className="p-4 rounded-2xl bg-[#140b2e] border border-purple-500/30 text-xs sm:text-sm text-slate-300">
                  Standard university guidelines and anti-cheat policies apply. Refer to the official brochure for full tournament brackets.
                </div>
              )}
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* EVENT COORDINATORS & INQUIRIES                                            */}
        {/* ========================================================================= */}
        {event.coordinators && event.coordinators.length > 0 && (
          <section className="p-6 sm:p-8 rounded-3xl bg-[#0e0724] border-2 border-purple-500/30 space-y-5 shadow-xl">
            <div className="flex items-center gap-3">
              <div className="h-6 w-1.5 bg-yellow-400 rounded-full" />
              <h2 className="font-display text-lg sm:text-xl font-black text-white uppercase tracking-wider">
                EVENT COORDINATORS & INQUIRIES
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {event.coordinators.map((c, idx) => (
                <div 
                  key={idx}
                  className="p-4 rounded-2xl bg-[#140b2e] border border-purple-500/30 flex flex-col justify-between gap-3 shadow-md"
                >
                  <div>
                    <div className="font-display text-base font-bold text-white">
                      {c.name}
                    </div>
                    <div className="font-body text-xs text-purple-300 font-semibold">
                      {c.role || 'Event Lead Coordinator'}
                    </div>
                  </div>

                  {c.phone && (
                    <a
                      href={`tel:${c.phone.replace(/\s+/g, '')}`}
                      className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-purple-950/90 hover:bg-purple-900 border border-purple-500/50 text-purple-200 hover:text-white font-display text-[11px] font-bold uppercase tracking-wider transition-colors w-fit"
                    >
                      <Phone size={13} className="text-cyan-400" />
                      <span>{c.phone}</span>
                    </a>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ========================================================================= */}
        {/* FINAL REGISTRATION BANNER                                                 */}
        {/* ========================================================================= */}
        <section className="p-6 sm:p-10 rounded-3xl bg-gradient-to-r from-[#170a36] via-[#1f0b3d] to-[#120826] border-2 border-purple-500/60 shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
          <div className="space-y-1.5">
            <h3 className="font-display text-xl sm:text-2xl font-black text-white uppercase tracking-wide">
              READY TO COMPETE IN {event.title}?
            </h3>
            <p className="font-body text-sm sm:text-base text-purple-200 font-medium">
              Join students from 20+ top institutions across India. Registration closes once slots fill!
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0 w-full sm:w-auto">
            <a
              href={registrationUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => soundEngine.playFanfare()}
              className="w-full sm:w-auto px-7 py-3.5 rounded-full bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-400 hover:to-rose-500 text-white font-display text-xs sm:text-sm font-black uppercase tracking-wider flex items-center justify-center gap-2 shadow-xl hover:scale-[1.02] active:scale-98 transition-all cursor-pointer"
            >
              <span>REGISTER ON UNSTOP</span>
              <ExternalLink size={16} />
            </a>

            <button
              onClick={() => {
                soundEngine.playBlip();
                onClose();
              }}
              className="w-full sm:w-auto px-6 py-3.5 rounded-full bg-slate-800 hover:bg-slate-700 text-white font-display text-xs font-bold uppercase tracking-wider transition-all cursor-pointer"
            >
              BACK TO MAP
            </button>
          </div>
        </section>

      </main>
    </div>
  );
}
