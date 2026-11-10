import React, { useState, useEffect } from 'react';
import { soundEngine } from '../../game/systems/SoundEngine';
import { SonicGenesisSprite } from './ArcadePixelSprites';

export const STAGES = [
  { id: 1, name: 'STAGE 1: PAC-MAN SCHEDULE', short: 'PAC-MAN', stageLabel: 'STAGE 1: PAC-MAN SCHEDULE' },
  { id: 2, name: 'STAGE 2: SPONSOR GALAXY', short: 'SPONSORS', stageLabel: 'STAGE 2: SPONSOR GALAXY' },
  { id: 3, name: 'STAGE 3: FAQ SANCTUARY', short: 'FAQS', stageLabel: 'STAGE 3: FAQ SANCTUARY' },
  { id: 4, name: 'STAGE 4: CASTLE & REGISTER', short: 'REGISTER', stageLabel: 'STAGE 4: CASTLE & REGISTER' }
];

export function SonicStageSelector({
  currentStage = 1,
  onSelectStage,
  crtEnabled,
  onToggleCrt,
  soundMuted,
  onToggleSound,
  onEnterActiveStage,
  onClose
}) {
  const [animRing, setAnimRing] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setAnimRing(prev => (prev + 1) % 4);
    }, 180);
    return () => clearInterval(timer);
  }, []);

  const handlePrev = () => {
    soundEngine.playJump();
    const prev = currentStage > 1 ? currentStage - 1 : 4;
    onSelectStage(prev);
  };

  const handleNext = () => {
    soundEngine.playJump();
    const next = currentStage < 4 ? currentStage + 1 : 1;
    onSelectStage(next);
  };

  const activeStageObj = STAGES.find(s => s.id === currentStage) || STAGES[0];

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-between bg-[#07050d] select-none overflow-hidden font-pixel p-1 sm:p-2">
      
      {/* ------------------------------------------------------------- */}
      {/* CRT ARCADE SCREEN BEZEL: EXACT REPLICA OF 22.11.17 (1).jpeg   */}
      {/* ------------------------------------------------------------- */}
      <div className="relative w-full max-w-lg flex-1 flex flex-col bg-gradient-to-b from-[#218ae3] via-[#48acf5] to-[#79ccfa] rounded-t-3xl border-4 border-b-0 border-[#1c1926] shadow-[inset_0_0_60px_rgba(0,0,0,0.4)] overflow-hidden">
        
        {/* CRT Glass Reflection & Curvature */}
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.25)_0%,transparent_70%)] z-30" />
        {crtEnabled && (
          <div className="absolute inset-0 pointer-events-none bg-[repeating-linear-gradient(0deg,rgba(0,0,0,0.35)_0px,rgba(0,0,0,0.35)_2px,transparent_2px,transparent_4px)] z-30 opacity-70" />
        )}

        {/* Top Header Bar inside CRT: SYNERGY '26 / REVERIE 2K27 */}
        <div className="relative z-20 w-full px-4 pt-2 pb-1 flex items-center justify-between text-white/90 text-[10px] sm:text-xs">
          <div className="flex items-center gap-1.5 font-bold drop-shadow">
            <span className="text-yellow-300">★</span>
            <span className="tracking-wider">REVERIE 2K27 ARCADE</span>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="px-2 py-0.5 rounded bg-red-600/90 hover:bg-red-500 text-white font-pixel text-[8px] border border-white cursor-pointer active:scale-95"
            >
              ✕ EXIT
            </button>
          )}
        </div>

        {/* Blazing Sun in Top Right */}
        <div className="absolute top-3 right-8 w-20 h-20 rounded-full bg-white shadow-[0_0_50px_#ffffff,0_0_100px_#fef08a] pointer-events-none z-0" />
        <div className="absolute top-1 right-6 w-24 h-24 rounded-full bg-yellow-200/40 blur-md pointer-events-none z-0" />

        {/* Pixel Clouds */}
        <div className="absolute top-8 left-4 text-white text-3xl opacity-85 pointer-events-none z-0">☁️</div>
        <div className="absolute top-16 right-24 text-white text-2xl opacity-75 pointer-events-none z-0">☁️</div>
        <div className="absolute top-44 left-10 text-white text-2xl opacity-70 pointer-events-none z-0">☁️</div>

        {/* Distant Waterfalls in background */}
        <div className="absolute top-28 left-4 w-3.5 h-60 bg-gradient-to-b from-cyan-200 via-cyan-300 to-transparent opacity-80 pointer-events-none z-0" />
        <div className="absolute top-36 right-4 w-4 h-72 bg-gradient-to-b from-cyan-200 via-cyan-300 to-transparent opacity-85 pointer-events-none z-0" />

        {/* ------------------------------------------------------------- */}
        {/* SVG LAYER: CONNECTING DOTTED TRAJECTORIES & GOLDEN RINGS       */}
        {/* ------------------------------------------------------------- */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-10" viewBox="0 0 380 620" preserveAspectRatio="none">
          {/* Arc: Hub (190, 560) -> Stage 1 (100, 430) */}
          <path d="M 190 560 Q 140 500 100 430" fill="none" stroke="#ffffff" strokeWidth="2.5" strokeDasharray="5,6" opacity="0.9" />
          
          {/* Arc: Stage 1 (100, 400) -> Stage 2 (275, 300) */}
          <path d="M 110 390 Q 180 340 265 300" fill="none" stroke="#ffffff" strokeWidth="2.5" strokeDasharray="5,6" opacity="0.9" />

          {/* Arc: Stage 2 (265, 280) -> Stage 3 (110, 190) */}
          <path d="M 255 270 Q 190 220 115 190" fill="none" stroke="#ffffff" strokeWidth="2.5" strokeDasharray="5,6" opacity="0.9" />

          {/* Arc: Stage 3 (115, 170) -> Stage 4 (265, 95) */}
          <path d="M 125 165 Q 195 120 255 95" fill="none" stroke="#ffffff" strokeWidth="2.5" strokeDasharray="5,6" opacity="0.9" />

          {/* Animated Golden Rings along paths */}
          {[
            { cx: 155, cy: 505 },
            { cx: 130, cy: 460 },
            { cx: 165, cy: 360 },
            { cx: 200, cy: 335 },
            { cx: 235, cy: 315 },
            { cx: 205, cy: 245 },
            { cx: 165, cy: 215 },
            { cx: 185, cy: 145 },
            { cx: 225, cy: 115 }
          ].map((ring, idx) => (
            <g key={idx}>
              <ellipse
                cx={ring.cx}
                cy={ring.cy}
                rx={animRing === 1 || animRing === 3 ? 3 : 6.5}
                ry="6.5"
                fill="none"
                stroke="#fbbf24"
                strokeWidth="2.2"
                className="filter drop-shadow-[0_0_4px_rgba(251,191,36,0.8)]"
              />
              <ellipse
                cx={ring.cx}
                cy={ring.cy}
                rx={animRing === 1 || animRing === 3 ? 1.5 : 4}
                ry="4"
                fill="#fde047"
                opacity="0.6"
              />
            </g>
          ))}
        </svg>

        {/* ------------------------------------------------------------- */}
        {/* 5 FLOATING 3D CHECKERED ISLANDS (EXACT MATCH TO REFERENCE)    */}
        {/* ------------------------------------------------------------- */}
        <div className="relative flex-1 w-full h-full z-20">

          {/* ISLAND 0: START/HUB (Bottom Center) */}
          <div 
            onClick={() => { soundEngine.playBlip(); }}
            className="absolute left-[30%] bottom-[3%] w-40 flex flex-col items-center cursor-pointer group"
          >
            {/* Signboard: START/HUB */}
            <div className="px-2.5 py-1 rounded bg-[#2b1055] border-2 border-yellow-400 text-yellow-300 text-[8px] font-black tracking-wider shadow-md mb-1">
              START/HUB
            </div>
            {/* Hub Props: Pipe, Item Box, Rings */}
            <div className="flex items-center gap-2 mb-0.5">
              <span className="text-xs">🟩</span>
              <span className="text-xs">📦</span>
              <span className="text-xs animate-bounce">🪙</span>
            </div>
            {/* 3D Checkered Island SVG */}
            <GreenHillIsland width={140} height={50} hasWaterfall={false} />
          </div>

          {/* ISLAND 1: STAGE 1 EVENTS (Lower Left) */}
          <div 
            data-island="1"
            onClick={() => {
              if (currentStage === 1 && onEnterActiveStage) {
                onEnterActiveStage();
              } else {
                soundEngine.playJump();
                onSelectStage(1);
              }
            }}
            className={`absolute left-[4%] bottom-[22%] w-44 flex flex-col items-center cursor-pointer transition-transform ${
              currentStage === 1 ? 'scale-105 filter drop-shadow-[0_0_15px_rgba(250,204,21,0.9)]' : 'hover:scale-102 opacity-95'
            }`}
          >
            {/* Floating Arrow Cursor if active */}
            {currentStage === 1 && (
              <div className="text-yellow-300 text-xs font-black animate-bounce mb-1 flex items-center gap-1 bg-black/70 px-2 py-0.5 rounded-full border border-yellow-400">
                <span>PAC-MAN SCHEDULE!</span>
                <span>➔</span>
              </div>
            )}
            
            {/* Wooden Signboard */}
            <div className="px-2.5 py-1 rounded bg-[#451a03] border-2 border-yellow-400 text-yellow-300 text-[8px] font-black tracking-wider shadow mb-1">
              STAGE 1: PAC-MAN EVENTS
            </div>

            {/* Sonic Sprite standing on Island 1 (ONLY when Stage 1 is selected) */}
            <div className="relative w-full flex items-end justify-center gap-1.5 mb-0.5">
              {currentStage === 1 && <SonicGenesisSprite size={38} active={true} />}
              <PixelPalmTree />
            </div>

            {/* 3D Checkered Island with Cascading Waterfall */}
            <GreenHillIsland width={155} height={55} hasWaterfall={true} />
          </div>

          {/* ISLAND 2: STAGE 2 SPONSORS (Middle Right) */}
          <div 
            data-island="2"
            onClick={() => {
              if (currentStage === 2 && onEnterActiveStage) {
                onEnterActiveStage();
              } else {
                soundEngine.playJump();
                onSelectStage(2);
              }
            }}
            className={`absolute right-[4%] bottom-[40%] w-44 flex flex-col items-center cursor-pointer transition-transform ${
              currentStage === 2 ? 'scale-105 filter drop-shadow-[0_0_15px_rgba(250,204,21,0.9)]' : 'hover:scale-102 opacity-95'
            }`}
          >
            {currentStage === 2 && (
              <div className="text-yellow-300 text-xs font-black animate-bounce mb-1 flex items-center gap-1 bg-black/70 px-2 py-0.5 rounded-full border border-yellow-400">
                <span>STAGE 2: SPONSORS</span>
                <span>➔</span>
              </div>
            )}

            {/* Billboard Sign */}
            <div className="px-2.5 py-1 rounded bg-[#2b1055] border-2 border-purple-400 text-yellow-300 text-[8px] font-black tracking-wider shadow mb-1">
              STAGE 2: SPONSORS
            </div>

            {/* Spring Bumper & Palm Tree */}
            <div className="flex items-center gap-2 mb-0.5">
              <span className="text-xs">🔴</span>
              <PixelPalmTree />
              {currentStage === 2 && <SonicGenesisSprite size={38} active={true} />}
            </div>

            <GreenHillIsland width={155} height={55} hasWaterfall={true} />
          </div>

          {/* ISLAND 3: STAGE 3 FAQS (Upper Left) */}
          <div 
            data-island="3"
            onClick={() => {
              if (currentStage === 3 && onEnterActiveStage) {
                onEnterActiveStage();
              } else {
                soundEngine.playJump();
                onSelectStage(3);
              }
            }}
            className={`absolute left-[6%] top-[22%] w-44 flex flex-col items-center cursor-pointer transition-transform ${
              currentStage === 3 ? 'scale-105 filter drop-shadow-[0_0_15px_rgba(250,204,21,0.9)]' : 'hover:scale-102 opacity-95'
            }`}
          >
            {currentStage === 3 && (
              <div className="text-yellow-300 text-xs font-black animate-bounce mb-1 flex items-center gap-1 bg-black/70 px-2 py-0.5 rounded-full border border-yellow-400">
                <span>STAGE 3: FAQS</span>
                <span>➔</span>
              </div>
            )}

            <div className="px-2.5 py-1 rounded bg-[#1e1b4b] border-2 border-cyan-400 text-cyan-300 text-[8px] font-black tracking-wider shadow mb-1">
              STAGE 3: FAQS
            </div>

            <div className="flex items-center gap-2 mb-0.5">
              <span className="text-xs">🧙‍♂️</span>
              <span className="text-xs">❓</span>
              {currentStage === 3 && <SonicGenesisSprite size={38} active={true} />}
            </div>

            <GreenHillIsland width={150} height={52} hasWaterfall={true} />
          </div>

          {/* ISLAND 4: STAGE 4 REGISTER (Upper Right) */}
          <div 
            data-island="4"
            onClick={() => {
              if (currentStage === 4 && onEnterActiveStage) {
                onEnterActiveStage();
              } else {
                soundEngine.playJump();
                onSelectStage(4);
              }
            }}
            className={`absolute right-[6%] top-[6%] w-44 flex flex-col items-center cursor-pointer transition-transform ${
              currentStage === 4 ? 'scale-105 filter drop-shadow-[0_0_15px_rgba(250,204,21,0.9)]' : 'hover:scale-102 opacity-95'
            }`}
          >
            {currentStage === 4 && (
              <div className="text-yellow-300 text-xs font-black animate-bounce mb-1 flex items-center gap-1 bg-black/70 px-2 py-0.5 rounded-full border border-yellow-400">
                <span>STAGE 4: REGISTER</span>
                <span>➔</span>
              </div>
            )}

            <div className="px-2.5 py-1 rounded bg-[#581c87] border-2 border-yellow-400 text-yellow-300 text-[8px] font-black tracking-wider shadow mb-1">
              STAGE 4: REGISTER
            </div>

            {/* Loop-the-loop & Tree */}
            <div className="flex items-center gap-1.5 mb-0.5">
              <SonicLoopDeLoop />
              <PixelPalmTree />
              {currentStage === 4 && <SonicGenesisSprite size={38} active={true} />}
            </div>

            <GreenHillIsland width={145} height={50} hasWaterfall={true} />
          </div>

        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* AUTHENTIC ARCADE GAMEPAD CONSOLE: EXACT REPLICA OF 22.11.17 (1) */}
      {/* ------------------------------------------------------------- */}
      <div className="relative w-full max-w-lg bg-gradient-to-b from-[#242131] via-[#1a1726] to-[#110e1c] rounded-b-3xl border-4 border-[#12101b] p-3 sm:p-4 shadow-[0_12px_30px_rgba(0,0,0,0.8)] flex flex-col gap-2.5">
        
        {/* Top Control Bar: LED Digital Marquee + System Toggles */}
        <div className="w-full flex items-center justify-between gap-2">
          
          {/* LED Digital Display Marquee Screen */}
          <div 
            onClick={onEnterActiveStage}
            className="flex-1 py-1.5 px-3 rounded-lg bg-[#051119] border-2 border-cyan-500/80 shadow-[inset_0_0_12px_rgba(6,182,212,0.6),0_0_10px_rgba(6,182,212,0.3)] flex items-center justify-center cursor-pointer hover:border-cyan-300"
            title="Click to Enter Stage!"
          >
            <span className="font-pixel text-[11px] sm:text-xs font-black tracking-widest text-cyan-300 drop-shadow-[0_0_6px_rgba(6,182,212,1)] animate-pulse truncate">
              {activeStageObj.stageLabel}
            </span>
          </div>

          {/* CRT and Sound Rocker Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={onToggleCrt}
              className={`px-2.5 py-1.5 rounded-full text-[8px] font-black border transition-all cursor-pointer ${
                crtEnabled 
                  ? 'bg-amber-500 text-black border-amber-300 shadow-[0_0_8px_#f59e0b]' 
                  : 'bg-[#2b2738] text-zinc-400 border-zinc-700 hover:text-white'
              }`}
            >
              CRT {crtEnabled ? 'ON' : 'OFF'}
            </button>

            <button
              onClick={onToggleSound}
              className={`px-2.5 py-1.5 rounded-full text-[8px] font-black border transition-all cursor-pointer ${
                !soundMuted 
                  ? 'bg-pink-600 text-white border-pink-400 shadow-[0_0_8px_#ec4899]' 
                  : 'bg-[#2b2738] text-zinc-400 border-zinc-700 hover:text-white'
              }`}
            >
              SOUND {!soundMuted ? 'ON' : 'OFF'}
            </button>
          </div>
        </div>

        {/* Bottom Control Row: D-PAD on Left + Action Buttons on Right */}
        <div className="w-full flex items-center justify-between pt-1">
          
          {/* 16-bit D-PAD */}
          <div className="relative w-20 h-20 flex items-center justify-center">
            {/* D-Pad Cross Background */}
            <div className="relative w-18 h-18 bg-[#14121d] rounded-xl shadow-[inset_0_2px_4px_rgba(0,0,0,0.8),0_2px_4px_rgba(255,255,255,0.08)] flex items-center justify-center">
              {/* Up */}
              <button 
                onClick={handlePrev}
                className="absolute top-0.5 w-6 h-6 bg-[#262335] hover:bg-[#353149] active:translate-y-0.5 rounded-t text-[8px] text-zinc-400 flex items-center justify-center cursor-pointer shadow"
              >
                ▲
              </button>
              {/* Down */}
              <button 
                onClick={handleNext}
                className="absolute bottom-0.5 w-6 h-6 bg-[#262335] hover:bg-[#353149] active:-translate-y-0.5 rounded-b text-[8px] text-zinc-400 flex items-center justify-center cursor-pointer shadow"
              >
                ▼
              </button>
              {/* Left */}
              <button 
                onClick={handlePrev}
                className="absolute left-0.5 w-6 h-6 bg-[#262335] hover:bg-[#353149] active:translate-x-0.5 rounded-l text-[8px] text-zinc-400 flex items-center justify-center cursor-pointer shadow"
              >
                ◀
              </button>
              {/* Right */}
              <button 
                onClick={handleNext}
                className="absolute right-0.5 w-6 h-6 bg-[#262335] hover:bg-[#353149] active:-translate-x-0.5 rounded-r text-[8px] text-zinc-400 flex items-center justify-center cursor-pointer shadow"
              >
                ▶
              </button>
              {/* Center Pivot */}
              <div className="w-4 h-4 rounded-full bg-[#1b1926] shadow-inner" />
            </div>
          </div>

          {/* Action Buttons: PREV (Blue), JUMP/NEXT (Red/Pink), ENTER (Up Arrow) */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* PREV Button (Blue Arcade Button) */}
            <button
              onClick={handlePrev}
              className="px-3.5 py-2.5 rounded-2xl bg-gradient-to-b from-[#3b82f6] to-[#1d4ed8] hover:from-[#60a5fa] hover:to-[#2563eb] border-2 border-[#93c5fd] shadow-[0_4px_0_#1e3a8a,0_6px_10px_rgba(0,0,0,0.6)] text-white text-[10px] font-black tracking-wider cursor-pointer active:translate-y-1 active:shadow-none transition-transform"
            >
              PREV
            </button>

            {/* JUMP / NEXT Button (Red/Pink Arcade Button) */}
            <button
              onClick={handleNext}
              className="px-4 py-2.5 rounded-2xl bg-gradient-to-b from-[#ef4444] to-[#b91c1c] hover:from-[#f87171] hover:to-[#dc2626] border-2 border-[#fca5a5] shadow-[0_4px_0_#7f1d1d,0_6px_10px_rgba(0,0,0,0.6)] text-white text-[10px] font-black tracking-wider cursor-pointer active:translate-y-1 active:shadow-none transition-transform"
            >
              JUMP/NEXT
            </button>

            {/* Glowing Action Button: ENTER ACTIVE STAGE (Up Arrow) */}
            <button
              onClick={onEnterActiveStage}
              className="w-11 h-11 rounded-xl bg-gradient-to-b from-[#ec4899] to-[#be185d] border-2 border-white shadow-[0_0_15px_rgba(236,72,153,0.8),0_4px_0_#831843] flex items-center justify-center text-white text-base font-black cursor-pointer hover:scale-105 active:translate-y-1 active:shadow-none transition-all"
              title="Enter Active Stage!"
            >
              ➔
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}

// -------------------------------------------------------------
// HIGH-FIDELITY GREEN HILL 3D CHECKERED FLOATING ISLAND
// -------------------------------------------------------------
function GreenHillIsland({ width = 150, height = 50, hasWaterfall = true }) {
  return (
    <div className="relative" style={{ width, height }}>
      <svg width={width} height={height} viewBox="0 0 160 55" className="filter drop-shadow-[0_8px_10px_rgba(0,0,0,0.5)]">
        {/* Island Rock Underbelly (Craggy Checkered Brown) */}
        <polygon points="10,18 150,18 135,45 80,54 25,45" fill="#78350f" />
        
        {/* Checkered 3D Dirt Grid */}
        <g opacity="0.85">
          <rect x="25" y="18" width="16" height="12" fill="#92400e" />
          <rect x="57" y="18" width="16" height="12" fill="#92400e" />
          <rect x="89" y="18" width="16" height="12" fill="#92400e" />
          <rect x="121" y="18" width="16" height="12" fill="#92400e" />
          
          <rect x="33" y="30" width="16" height="12" fill="#92400e" />
          <rect x="65" y="30" width="16" height="12" fill="#92400e" />
          <rect x="97" y="30" width="16" height="12" fill="#92400e" />
        </g>

        {/* Grass Top Checkers (Bright green / dark green tiles) */}
        <ellipse cx="80" cy="18" rx="72" ry="12" fill="#4ade80" />
        <ellipse cx="80" cy="17" rx="70" ry="10" fill="#22c55e" />
        
        {/* Grass Checkered Overlay */}
        <g opacity="0.4">
          <rect x="30" y="11" width="12" height="6" fill="#15803d" />
          <rect x="54" y="11" width="12" height="6" fill="#15803d" />
          <rect x="78" y="11" width="12" height="6" fill="#15803d" />
          <rect x="102" y="11" width="12" height="6" fill="#15803d" />
          <rect x="126" y="11" width="12" height="6" fill="#15803d" />
        </g>

        {/* Jagged Grass Blades Hanging Down */}
        <polygon points="15,18 20,24 25,18 30,25 35,18 40,24 45,18 50,25 55,18 60,24 65,18 70,25 75,18 80,24 85,18 90,25 95,18 100,24 105,18 110,25 115,18 120,24 125,18 130,25 135,18 140,24 145,18" fill="#16a34a" />

        {/* Cascading Animated Waterfall spilling down */}
        {hasWaterfall && (
          <g>
            <rect x="24" y="17" width="10" height="38" fill="#67e8f9" opacity="0.9" />
            <rect x="26" y="17" width="6" height="38" fill="#ffffff" opacity="0.8" />
            {/* White Spray Foam at bottom */}
            <circle cx="29" cy="54" r="4" fill="#ffffff" opacity="0.9" />
            <circle cx="25" cy="53" r="3" fill="#a5f3fc" opacity="0.9" />
            <circle cx="33" cy="53" r="3" fill="#a5f3fc" opacity="0.9" />
          </g>
        )}
      </svg>
    </div>
  );
}

// -------------------------------------------------------------
// GREEN HILL PIXEL PALM TREE & LOOP-DE-LOOP
// -------------------------------------------------------------
function PixelPalmTree() {
  return (
    <svg width="24" height="32" viewBox="0 0 24 32" className="filter drop-shadow">
      {/* Brown segmented curved trunk */}
      <path d="M 12 32 Q 10 24 12 14" fill="none" stroke="#78350f" strokeWidth="3.5" strokeLinecap="round" />
      <path d="M 12 32 Q 10 24 12 14" fill="none" stroke="#b45309" strokeWidth="2" strokeDasharray="3,3" />
      {/* Green Fronds */}
      <path d="M 12 14 Q 4 12 2 18" fill="none" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" />
      <path d="M 12 14 Q 2 6 6 2" fill="none" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M 12 14 Q 14 4 18 2" fill="none" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M 12 14 Q 20 10 22 16" fill="none" stroke="#15803d" strokeWidth="2" strokeLinecap="round" />
      {/* Coconuts */}
      <circle cx="11" cy="14" r="1.5" fill="#451a03" />
      <circle cx="13" cy="14.5" r="1.5" fill="#451a03" />
    </svg>
  );
}

function SonicLoopDeLoop() {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" className="filter drop-shadow">
      {/* 3D Brown checkered loop ring */}
      <circle cx="14" cy="14" r="11" fill="none" stroke="#92400e" strokeWidth="4" />
      <circle cx="14" cy="14" r="11" fill="none" stroke="#78350f" strokeWidth="4" strokeDasharray="6,6" />
      {/* Inner Grass Crest */}
      <path d="M 3 24 Q 14 4 25 24" fill="none" stroke="#22c55e" strokeWidth="2" />
    </svg>
  );
}
