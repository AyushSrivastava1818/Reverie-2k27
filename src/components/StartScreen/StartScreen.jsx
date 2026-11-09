import React, { useState, useEffect, useRef } from 'react';
import { Play, Compass, Castle, Cpu, Music, Trophy, Landmark } from 'lucide-react';
import { soundEngine } from '../../game/systems/SoundEngine';
import { ThreeDBackground } from '../ThreeD/ThreeDBackground';
import confetti from 'canvas-confetti';

/**
 * StartScreen — The Grand Pixelverse Entrance (High-Definition Flagship Edition)
 * - Stage is mathematically aspect-locked (1952:1120 ratio) via ResizeObserver
 * - Zero letterbox distortion, ZERO logo cropping on ANY desktop/laptop resolution
 * - Buttons NEVER overlap Mario or Kota Bot
 * - Buttons are 100% symmetrically centered under the logo and portal
 * - 3D arcade buttons with tactile mechanical push-button depression and sound
 * - Five enlarged Kingdom cards with custom icons and hover elevation
 * - Flawless mobile responsive vertical layout
 */
export function StartScreen({ 
  onStart, 
  onSelectKingdom,
  onOpenDirectory,
  onOpenMap,
  onOpenSkins,
  onOpenBot,
  onOpenStats,
  onOpenLive
}) {
  const [muted, setMuted] = useState(soundEngine.muted);
  const containerRef = useRef(null);

  // Mathematical aspect-locked stage sizing (native 1952x1120 artwork ratio = 1.742857)
  const [stageSize, setStageSize] = useState(() => {
    if (typeof window !== 'undefined') {
      const pw = window.innerWidth;
      const ph = Math.max(window.innerHeight - 64, 400);
      const targetRatio = 1952 / 1120;
      let w = pw;
      let h = pw / targetRatio;
      if (h > ph) {
        h = ph;
        w = ph * targetRatio;
      }
      return { width: Math.floor(w), height: Math.floor(h) };
    }
    return { width: 976, height: 560 };
  });

  useEffect(() => {
    const updateStageSize = () => {
      if (!containerRef.current) return;
      const pw = containerRef.current.clientWidth;
      const ph = containerRef.current.clientHeight;
      if (!pw || !ph) return;

      const targetRatio = 1952 / 1120;
      let w = pw;
      let h = pw / targetRatio;
      if (h > ph) {
        h = ph;
        w = ph * targetRatio;
      }
      setStageSize({ width: Math.floor(w), height: Math.floor(h) });
    };

    updateStageSize();

    let ro;
    if (window.ResizeObserver && containerRef.current) {
      ro = new ResizeObserver(updateStageSize);
      ro.observe(containerRef.current);
    }
    window.addEventListener('resize', updateStageSize);

    return () => {
      if (ro) ro.disconnect();
      window.removeEventListener('resize', updateStageSize);
    };
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.key === 'Enter' || e.key === ' ') && !['INPUT', 'TEXTAREA'].includes(document.activeElement?.tagName)) {
        e.preventDefault();
        handlePressStart();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [muted]);

  const handlePressStart = () => {
    if (muted) {
      setMuted(false);
      soundEngine.setMuted(false);
    }
    soundEngine.playFanfare();

    try {
      confetti({
        particleCount: 90,
        spread: 95,
        origin: { y: 0.65 },
        colors: ['#ffffff', '#ec4899', '#8b5cf6', '#fbbf24', '#06b6d4']
      });
    } catch (e) {}

    onStart();
  };

  const handleKingdomClick = (sceneKey) => {
    soundEngine.playPipe();
    try {
      confetti({
        particleCount: 55,
        spread: 75,
        origin: { y: 0.85 },
        colors: ['#fbbf24', '#06b6d4', '#ec4899', '#10b981']
      });
    } catch (e) {}

    if (onSelectKingdom) {
      onSelectKingdom(sceneKey);
    } else {
      onStart();
    }
  };

  const kingdoms = [
    { 
      id: 'StartingKingdomScene', 
      name: 'STARTING', 
      tag: 'GATEWAY',
      Icon: Castle,
      left: '17.2%',
      width: '12.2%',
      borderClass: 'border-yellow-400 text-yellow-300 bg-[#1e1302]/95 hover:bg-[#2e1c03]',
      style: {
        boxShadow: '0 5px 0 #713f12, 0 0 18px rgba(234, 179, 8, 0.45)'
      },
      hoverStyle: 'hover:shadow-[0_8px_0_#713f12,0_0_28px_rgba(234,179,8,0.9)]'
    },
    { 
      id: 'TechKingdomScene', 
      name: 'TECH', 
      tag: 'CYBER',
      Icon: Cpu,
      left: '30.6%',
      width: '12.2%',
      borderClass: 'border-cyan-400 text-cyan-300 bg-[#021824]/95 hover:bg-[#03263a]',
      style: {
        boxShadow: '0 5px 0 #0e7490, 0 0 18px rgba(6, 182, 212, 0.45)'
      },
      hoverStyle: 'hover:shadow-[0_8px_0_#0e7490,0_0_28px_rgba(6,182,212,0.9)]'
    },
    { 
      id: 'CultureKingdomScene', 
      name: 'CULTURE', 
      tag: 'CONCERT',
      Icon: Music,
      left: '43.9%',
      width: '12.2%',
      borderClass: 'border-pink-400 text-pink-300 bg-[#210214]/95 hover:bg-[#340420]',
      style: {
        boxShadow: '0 5px 0 #9d174d, 0 0 18px rgba(236, 72, 153, 0.45)'
      },
      hoverStyle: 'hover:shadow-[0_8px_0_#9d174d,0_0_28px_rgba(236,72,153,0.9)]'
    },
    { 
      id: 'FlagshipScene', 
      name: 'FLAGSHIP', 
      tag: 'CARNIVAL',
      Icon: Trophy,
      left: '57.2%',
      width: '12.2%',
      borderClass: 'border-amber-400 text-amber-300 bg-[#221002]/95 hover:bg-[#361903]',
      style: {
        boxShadow: '0 5px 0 #92400e, 0 0 18px rgba(245, 158, 11, 0.45)'
      },
      hoverStyle: 'hover:shadow-[0_8px_0_#92400e,0_0_28px_rgba(245,158,11,0.9)]'
    },
    { 
      id: 'FestivalPlazaScene', 
      name: 'PLAZA', 
      tag: 'PAVILION',
      Icon: Landmark,
      left: '70.6%',
      width: '12.2%',
      borderClass: 'border-emerald-400 text-emerald-300 bg-[#021c14]/95 hover:bg-[#032b1f]',
      style: {
        boxShadow: '0 5px 0 #065f46, 0 0 18px rgba(16, 185, 129, 0.45)'
      },
      hoverStyle: 'hover:shadow-[0_8px_0_#065f46,0_0_28px_rgba(16,185,129,0.9)]'
    }
  ];

  return (
    <div ref={containerRef} className="absolute inset-0 z-20 w-full h-full flex items-center justify-center bg-[#070216] overflow-hidden select-none animate-fadeIn">
      
      {/* --------------------------------------------------------------------- */}
      {/* 1. Ambient Cosmic Starfield & Three.js 3D Floating Voxel Cubes */}
      {/* --------------------------------------------------------------------- */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div 
          className="absolute inset-0 opacity-60"
          style={{ backgroundImage: `url('/assets/backgrounds/bg_stars.png')`, backgroundRepeat: 'repeat' }}
        />
        <div className="absolute inset-0 opacity-40">
          <ThreeDBackground />
        </div>
        <div className="crt-overlay absolute inset-0 opacity-12 pointer-events-none" />
      </div>

      {/* --------------------------------------------------------------------- */}
      {/* 2. DESKTOP / TABLET: Pixel-Perfect Aspect-Locked Master Stage */}
      {/*    Always scales to available viewport: NEVER cuts logo, NEVER */}
      {/*    overlaps Mario, perfectly centered under the logo and portal. */}
      {/* --------------------------------------------------------------------- */}
      <div 
        className="hidden sm:block relative overflow-hidden shadow-2xl shrink-0"
        style={{
          width: `${stageSize.width}px`,
          height: `${stageSize.height}px`,
          maxWidth: '100%',
          maxHeight: '100%'
        }}
      >
        {/* High-Definition 2K Master Artwork Backdrop */}
        <div 
          className="absolute inset-0 w-full h-full pointer-events-none"
          style={{ 
            backgroundImage: `url('/assets/landing_clean_master_2k.jpg')`,
            backgroundSize: '100% 100%',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
          }}
        />

        {/* 3D FLOATING HOTSPOT FOR MARIO & KOTA BOT */}
        <div 
          onClick={handlePressStart}
          onMouseEnter={() => soundEngine.playBlip()}
          title="Click Mario or Kota Bot to Start!"
          className="absolute cursor-pointer transition-transform hover:scale-110 active:scale-95 group z-30"
          style={{ left: '44.5%', top: '54.5%', width: '11.0%', height: '11.0%' }}
        >
          <div className="w-full h-full rounded-2xl opacity-0 group-hover:opacity-100 bg-pink-500/15 border border-pink-400/40 shadow-[0_0_25px_rgba(236,72,153,0.5)] transition-all flex items-center justify-center">
            <span className="font-display text-[9px] font-black tracking-widest text-white uppercase bg-black/80 px-2 py-0.5 rounded border border-pink-400/60 shadow">
              PRESS START
            </span>
          </div>
        </div>

        {/* PRIMARY 3D BUTTON 1: PRESS START */}
        <button
          onClick={handlePressStart}
          onMouseEnter={() => soundEngine.playBlip()}
          className="absolute z-40 rounded-full font-display font-black tracking-widest uppercase text-white flex items-center justify-center gap-2 transition-all cursor-pointer bg-gradient-to-r from-pink-500 via-rose-500 to-pink-600 border-2 border-pink-200 shadow-[0_5px_0_#831843,0_10px_25px_rgba(244,63,94,0.65)] hover:shadow-[0_8px_0_#831843,0_14px_35px_rgba(244,63,94,0.95)] hover:-translate-y-1 hover:scale-[1.02] active:translate-y-1.5 active:shadow-[0_2px_0_#831843,0_4px_10px_rgba(244,63,94,0.5)] active:scale-[0.98]"
          style={{
            left: '23.8%',
            top: '68.0%',
            width: '24.2%',
            height: '8.8%',
            fontSize: 'clamp(11px, 1.25vw, 16px)',
            cursor: 'pointer'
          }}
        >
          <Play size={18} fill="white" className="shrink-0 drop-shadow" />
          <span className="drop-shadow">PRESS START</span>
        </button>

        {/* PRIMARY 3D BUTTON 2: EVENT DIRECTORY */}
        <button
          onClick={() => {
            soundEngine.playBlip();
            onOpenDirectory();
          }}
          onMouseEnter={() => soundEngine.playBlip()}
          className="absolute z-40 rounded-full font-display font-black tracking-widest uppercase text-cyan-200 hover:text-white flex items-center justify-center gap-2 transition-all cursor-pointer bg-[#130a30]/98 hover:bg-[#1f104d] border-2 border-cyan-400 hover:border-cyan-300 shadow-[0_5px_0_#0e7490,0_10px_25px_rgba(6,182,212,0.5)] hover:shadow-[0_8px_0_#0e7490,0_14px_35px_rgba(6,182,212,0.85)] hover:-translate-y-1 hover:scale-[1.02] active:translate-y-1.5 active:shadow-[0_2px_0_#0e7490,0_4px_10px_rgba(6,182,212,0.4)] active:scale-[0.98]"
          style={{
            left: '52.0%',
            top: '68.0%',
            width: '24.2%',
            height: '8.8%',
            fontSize: 'clamp(11px, 1.25vw, 16px)',
            cursor: 'pointer'
          }}
        >
          <Compass size={18} className="text-cyan-400 shrink-0" />
          <span className="drop-shadow">EVENT DIRECTORY</span>
        </button>

        {/* FIVE ENLARGED 3D KINGDOM BUTTONS (Symmetrically Positioned Over Neon Rail) */}
        {kingdoms.map((k) => {
          const IconComponent = k.Icon;
          return (
            <button
              key={k.id}
              onClick={() => handleKingdomClick(k.id)}
              onMouseEnter={() => soundEngine.playBlip()}
              title={`Explore ${k.name} Kingdom`}
              className={`absolute z-40 rounded-xl border-2 ${k.borderClass} ${k.hoverStyle} flex items-center justify-center gap-1.5 px-1.5 transition-all cursor-pointer backdrop-blur-md hover:-translate-y-1 hover:scale-[1.03] active:translate-y-1 active:scale-[0.97]`}
              style={{
                left: k.left,
                top: '80.8%',
                width: k.width,
                height: '8.4%',
                ...k.style,
                cursor: 'pointer'
              }}
            >
              <IconComponent size={16} className="shrink-0 filter drop-shadow" />
              <div className="flex flex-col items-start text-left leading-none">
                <span className="font-display font-black tracking-wider uppercase text-[11px] lg:text-xs">
                  {k.name}
                </span>
                <span className="font-body text-[8px] lg:text-[9px] tracking-widest text-slate-400 font-bold uppercase mt-0.5 opacity-80">
                  {k.tag}
                </span>
              </div>
            </button>
          );
        })}

        {/* FOOTER BADGE */}
        <div 
          className="absolute inset-x-0 bottom-[2.5%] text-center text-[9px] lg:text-[10px] tracking-widest uppercase font-display text-purple-300/80 font-bold"
        >
          ✦ 5 LIVING KINGDOMS • 18 EVENTS • IIIT KOTA ✦
        </div>

      </div>

      {/* --------------------------------------------------------------------- */}
      {/* 3. MOBILE PRESENTATION (Touch-Optimized Flagship Stack for < 640px) */}
      {/* --------------------------------------------------------------------- */}
      <div className="sm:hidden relative z-30 w-full h-full flex flex-col items-center justify-between py-2 px-3 overflow-y-auto bg-gradient-to-b from-[#080214]/95 via-[#15072e]/90 to-[#080214]/98">
        
        {/* Mobile Hero Header - 100% Symmetrically Centered */}
        <div className="flex flex-col items-center text-center pt-1 shrink-0 w-full max-w-xs mx-auto self-center">
          <div className="inline-flex items-center justify-center gap-1.5 px-3 py-0.5 rounded-full bg-purple-950/90 border border-purple-500/60 text-purple-200 text-[9px] font-display font-bold tracking-widest mb-1 shadow-md shadow-purple-950/80 mx-auto">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>FEB 2K27 • IIIT KOTA</span>
          </div>

          <img 
            src="/assets/branding/reverie_logo.png" 
            alt="REVERIE 2K27" 
            className="w-52 max-w-[80vw] h-auto object-contain mx-auto filter drop-shadow-[0_0_20px_rgba(168,85,247,0.8)]"
          />

          <div className="flex items-center justify-center gap-2 mt-1 mx-auto">
            <span className="h-0.5 w-8 bg-yellow-400 shadow-[0_0_8px_#fbbf24]" />
            <span className="font-display text-sm text-yellow-400 font-black tracking-widest drop-shadow-[0_0_10px_rgba(250,204,21,0.6)]">
              2K27
            </span>
            <span className="h-0.5 w-8 bg-yellow-400 shadow-[0_0_8px_#fbbf24]" />
          </div>

          <h1 className="font-display text-xs text-white font-black tracking-widest uppercase mt-0.5 drop-shadow text-center w-full">
            THE PIXELVERSE
          </h1>
          <p className="font-body text-[9px] text-purple-200 font-semibold uppercase tracking-wider mt-0.5 opacity-90 text-center w-full">
            ENTER THE WORLD • EXPLORE THE FEST
          </p>

          {/* Glowing Micro-Stat Chips (Centered) */}
          <div className="flex items-center justify-center gap-1.5 flex-wrap my-1.5 shrink-0 mx-auto">
            <span className="px-2 py-0.5 rounded-full bg-yellow-950/80 border border-yellow-500/60 text-yellow-300 text-[8px] font-display font-black tracking-wider flex items-center gap-1 shadow">
              🏆 ₹2.5L+ PRIZES
            </span>
            <span className="px-2 py-0.5 rounded-full bg-cyan-950/80 border border-cyan-500/60 text-cyan-300 text-[8px] font-display font-black tracking-wider flex items-center gap-1 shadow">
              🎮 18 EVENTS
            </span>
            <span className="px-2 py-0.5 rounded-full bg-pink-950/80 border border-pink-500/60 text-pink-300 text-[8px] font-display font-black tracking-wider flex items-center gap-1 shadow">
              🏰 5 REALMS
            </span>
            <span className="px-2 py-0.5 rounded-full bg-purple-950/80 border border-purple-500/60 text-purple-300 text-[8px] font-display font-black tracking-wider flex items-center gap-1 shadow">
              🎓 IIIT KOTA
            </span>
          </div>
        </div>

        {/* Mobile Grand Portal Stage (Pixel Art Archway with Mario & Kota Bot) */}
        <div className="flex flex-col items-center my-1.5 shrink-0 w-full max-w-xs mx-auto self-center">
          {/* Floating animated gold coins above portal */}
          <div className="flex items-center justify-center gap-3 mb-1 mx-auto">
            <span className="text-yellow-400 text-xs animate-bounce" style={{ animationDelay: '0ms' }}>🪙</span>
            <span className="text-yellow-400 text-xs animate-bounce" style={{ animationDelay: '150ms' }}>🪙</span>
            <span className="text-yellow-400 text-xs animate-bounce" style={{ animationDelay: '300ms' }}>🪙</span>
            <span className="text-yellow-400 text-xs animate-bounce" style={{ animationDelay: '450ms' }}>🪙</span>
          </div>

          <div 
            onClick={handlePressStart}
            onMouseEnter={() => soundEngine.playBlip()}
            className="relative cursor-pointer transition-transform active:scale-95 group rounded-2xl overflow-hidden border-2 border-purple-400/80 shadow-[0_0_30px_rgba(168,85,247,0.6)] bg-[#0e0722] mx-auto"
            title="Tap Mario & Kota Bot to Enter!"
          >
            <img 
              src="/assets/portal_stage.png" 
              alt="Pixelverse Entrance Portal" 
              className="w-64 max-w-[78vw] h-auto object-contain image-rendering-pixelated block mx-auto"
              style={{ imageRendering: 'pixelated' }}
            />
          </div>

          {/* Centered Pulse Beacon Badge Directly Below Portal */}
          <div 
            onClick={handlePressStart}
            className="mt-2 inline-flex items-center justify-center gap-1.5 px-4 py-1 rounded-full bg-pink-950/80 border border-pink-500/70 text-pink-300 font-display text-[10px] font-black tracking-widest uppercase shadow-[0_0_15px_rgba(244,63,94,0.5)] animate-pulse cursor-pointer mx-auto text-center"
          >
            <Play size={10} fill="#f472b6" className="shrink-0" />
            <span>PRESS TO ENTER PIXELVERSE</span>
          </div>
        </div>

        {/* Mobile Primary 3D Action Buttons (100% Centered) */}
        <div className="flex flex-col items-center gap-2 w-full max-w-xs mx-auto self-center shrink-0 mb-2">
          {/* PRESS START (Hot Magenta 3D Arcade Button) */}
          <button
            onClick={handlePressStart}
            onMouseEnter={() => soundEngine.playBlip()}
            className="w-full py-3 px-5 rounded-full font-display text-xs font-black tracking-widest uppercase text-white flex items-center justify-center gap-2 transition-all cursor-pointer bg-gradient-to-r from-pink-500 via-rose-500 to-pink-600 border-2 border-pink-200 shadow-[0_4px_0_#831843,0_8px_20px_rgba(244,63,94,0.6)] active:translate-y-1 active:shadow-[0_1px_0_#831843]"
            style={{ cursor: 'pointer' }}
          >
            <Play size={16} fill="white" className="shrink-0 drop-shadow" />
            <span className="drop-shadow">PRESS START</span>
          </button>

          {/* EVENT DIRECTORY (Cyber Neon 3D Button) */}
          <button
            onClick={() => {
              soundEngine.playBlip();
              onOpenDirectory();
            }}
            onMouseEnter={() => soundEngine.playBlip()}
            className="w-full py-2.5 px-5 rounded-full font-display text-xs font-black tracking-widest uppercase text-cyan-200 flex items-center justify-center gap-2 transition-all cursor-pointer bg-[#130a30]/95 border-2 border-cyan-400 shadow-[0_4px_0_#0e7490,0_8px_18px_rgba(6,182,212,0.4)] active:translate-y-1 active:shadow-[0_1px_0_#0e7490]"
            style={{ cursor: 'pointer' }}
          >
            <Compass size={16} className="text-cyan-400 shrink-0" />
            <span className="drop-shadow">EVENT DIRECTORY (18)</span>
          </button>
        </div>

        {/* Mobile Fast Navigation Quick-Pill Row */}
        <div className="flex items-center justify-center gap-1.5 w-full max-w-xs mx-auto self-center mb-2 shrink-0">
          <button
            onClick={() => { soundEngine.playBlip(); onOpenMap?.(); }}
            className="flex-1 py-1 px-1 rounded-lg bg-amber-950/80 border border-amber-500/60 text-amber-200 font-display text-[9px] font-black uppercase flex items-center justify-center gap-1 shadow transition-transform active:scale-95 cursor-pointer"
          >
            <span>🗺️</span>
            <span>MAP</span>
          </button>
          <button
            onClick={() => { soundEngine.playBlip(); onOpenSkins?.(); }}
            className="flex-1 py-1 px-1 rounded-lg bg-cyan-950/80 border border-cyan-500/60 text-cyan-200 font-display text-[9px] font-black uppercase flex items-center justify-center gap-1 shadow transition-transform active:scale-95 cursor-pointer"
          >
            <span>👔</span>
            <span>SKINS</span>
          </button>
          <button
            onClick={() => { soundEngine.playBlip(); onOpenBot?.(); }}
            className="flex-1 py-1 px-1 rounded-lg bg-purple-950/80 border border-purple-400/60 text-purple-200 font-display text-[9px] font-black uppercase flex items-center justify-center gap-1 shadow transition-transform active:scale-95 cursor-pointer"
          >
            <span>🤖</span>
            <span>BOT</span>
          </button>
          <button
            onClick={() => { soundEngine.playBlip(); onOpenStats?.(); }}
            className="flex-1 py-1 px-1 rounded-lg bg-rose-950/80 border border-rose-500/60 text-rose-200 font-display text-[9px] font-black uppercase flex items-center justify-center gap-1 shadow transition-transform active:scale-95 cursor-pointer"
          >
            <span>📊</span>
            <span>STATS</span>
          </button>
          <button
            onClick={() => { soundEngine.playBlip(); onOpenLive?.(); }}
            className="flex-1 py-1 px-1 rounded-lg bg-emerald-950/80 border border-emerald-500/60 text-emerald-200 font-display text-[9px] font-black uppercase flex items-center justify-center gap-1 shadow transition-transform active:scale-95 cursor-pointer"
          >
            <span>📻</span>
            <span>LIVE</span>
          </button>
        </div>

        {/* Mobile 5 Kingdom Fast-Travel Cards - 100% Symmetrically Centered */}
        <div className="w-full max-w-xs mx-auto self-center shrink-0 mb-1">
          <div className="text-center font-display text-[9px] font-black tracking-widest uppercase text-purple-300 mb-1.5 flex items-center justify-center gap-1.5 opacity-90 mx-auto">
            <span className="h-px w-6 bg-purple-500/50" />
            <span>WARP TO 5 KINGDOMS</span>
            <span className="h-px w-6 bg-purple-500/50" />
          </div>

          <div className="grid grid-cols-2 gap-2">
            {kingdoms.slice(0, 4).map((k) => {
              const IconComp = k.Icon;
              return (
                <button
                  key={k.id}
                  onClick={() => handleKingdomClick(k.id)}
                  onMouseEnter={() => soundEngine.playBlip()}
                  className={`py-2.5 px-2 rounded-xl border-2 ${k.borderClass} flex flex-col items-center justify-center text-center transition-all active:translate-y-0.5 active:scale-95 shadow-md`}
                  style={{ cursor: 'pointer' }}
                >
                  <IconComp size={18} className="shrink-0 drop-shadow mb-1 mx-auto" />
                  <span className="font-display font-black text-[11px] uppercase tracking-wider text-center w-full block">
                    {k.name}
                  </span>
                  <span className="font-body text-[8.5px] text-slate-300 font-bold uppercase tracking-widest opacity-80 text-center w-full block mt-0.5">
                    {k.tag}
                  </span>
                </button>
              );
            })}

            {/* Festival Plaza spans across 2 columns (100% Centered) */}
            <button
              onClick={() => handleKingdomClick('FestivalPlazaScene')}
              onMouseEnter={() => soundEngine.playBlip()}
              className="col-span-2 py-2.5 px-3 rounded-xl border-2 border-emerald-400 text-emerald-300 bg-[#021c14]/95 flex flex-col items-center justify-center text-center transition-all active:translate-y-0.5 active:scale-95 shadow-md shadow-emerald-950/60"
              style={{ cursor: 'pointer' }}
            >
              <div className="flex items-center justify-center gap-1.5 w-full text-center">
                <Landmark size={16} className="shrink-0 drop-shadow text-emerald-300" />
                <span className="font-display font-black text-[11px] uppercase tracking-wider text-center">
                  FESTIVAL PLAZA
                </span>
              </div>
              <span className="font-body text-[8.5px] text-emerald-200/90 font-bold uppercase tracking-widest text-center mt-0.5">
                HONOR PAVILION & SPONSORS
              </span>
            </button>
          </div>
        </div>

        {/* Mobile Footer Badge - Centered */}
        <div className="text-center font-display text-[8.5px] text-purple-300/80 font-bold uppercase tracking-widest pt-1 shrink-0">
          ✦ 5 LIVING KINGDOMS • 18 EVENTS • IIIT KOTA ✦
        </div>

      </div>

    </div>
  );
}
