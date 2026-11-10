import React from 'react';
import { Volume2, VolumeX, Tv, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import { soundEngine } from '../../game/systems/SoundEngine';

export const STAGES = [
  { id: 1, name: 'STAGE 1: EVENTS', short: 'EVENTS', icon: '🎮', color: 'from-pink-500 to-rose-600' },
  { id: 2, name: 'STAGE 2: SPONSORS', short: 'SPONSORS', icon: '🚀', color: 'from-purple-500 to-indigo-600' },
  { id: 3, name: 'STAGE 3: SCHEDULE', short: 'SCHEDULE', icon: '🟡', color: 'from-amber-500 to-yellow-600' },
  { id: 4, name: 'STAGE 4: FAQS', short: 'FAQS', icon: '🧙‍♂️', color: 'from-cyan-500 to-blue-600' },
  { id: 5, name: 'STAGE 5: REGISTER', short: 'REGISTER', icon: '🏰', color: 'from-emerald-500 to-teal-600' }
];

export function SonicStageSelector({ 
  currentStage, 
  onSelectStage, 
  crtEnabled, 
  onToggleCrt, 
  soundMuted, 
  onToggleSound 
}) {
  const handlePrev = () => {
    soundEngine.playJump();
    const prev = currentStage > 1 ? currentStage - 1 : STAGES.length;
    onSelectStage(prev);
  };

  const handleNext = () => {
    soundEngine.playJump();
    const next = currentStage < STAGES.length ? currentStage + 1 : 1;
    onSelectStage(next);
  };

  return (
    <div className="w-full flex flex-col items-center select-none shrink-0">
      
      {/* ------------------------------------------------------------- */}
      {/* TOP: SONIC GREEN HILL FLOATING ISLANDS MAP (Ref: 22.11.16(1))  */}
      {/* ------------------------------------------------------------- */}
      <div className="relative w-full h-24 sm:h-28 bg-gradient-to-b from-[#38bdf8] via-[#60a5fa] to-[#93c5fd] rounded-t-2xl overflow-hidden border-b-2 border-green-600 flex items-end justify-between px-2 sm:px-6 shadow-inner">
        
        {/* Floating clouds */}
        <div className="absolute top-2 left-6 text-white text-xs opacity-75 animate-pulse">☁️ ☁️</div>
        <div className="absolute top-3 right-12 text-white text-xs opacity-65 animate-pulse">☁️</div>

        {/* Golden floating rings arc */}
        <div className="absolute top-3 inset-x-0 flex items-center justify-center gap-4 pointer-events-none">
          <span className="text-yellow-300 text-xs animate-bounce" style={{ animationDelay: '0ms' }}>🪙</span>
          <span className="text-yellow-300 text-xs animate-bounce" style={{ animationDelay: '100ms' }}>🪙</span>
          <span className="text-yellow-300 text-xs animate-bounce" style={{ animationDelay: '200ms' }}>🪙</span>
          <span className="text-yellow-300 text-xs animate-bounce" style={{ animationDelay: '300ms' }}>🪙</span>
        </div>

        {/* Dotted Jumping Parabola Trajectory */}
        <div className="absolute bottom-6 inset-x-8 h-8 border-t-2 border-dashed border-yellow-300/80 rounded-t-[100px] pointer-events-none opacity-60" />

        {/* 5 Floating Green Hill Islands */}
        <div className="relative z-10 w-full flex items-end justify-between gap-1 sm:gap-2 pb-1">
          {STAGES.map((stg) => {
            const isActive = currentStage === stg.id;

            return (
              <button
                key={stg.id}
                onClick={() => {
                  soundEngine.playJump();
                  onSelectStage(stg.id);
                }}
                className={`group relative flex flex-col items-center cursor-pointer transition-transform duration-300 ${
                  isActive ? 'scale-110 -translate-y-2' : 'hover:scale-105 opacity-85 hover:opacity-100'
                }`}
              >
                {/* Sonic Sprite Jumping on Active Island */}
                {isActive && (
                  <div className="absolute -top-7 animate-bounce flex flex-col items-center">
                    <span className="text-base sm:text-lg filter drop-shadow">🦔</span>
                    <span className="px-1.5 py-0.2 rounded-full bg-yellow-400 text-black font-display text-[7px] font-black uppercase tracking-wider shadow">
                      STAGE {stg.id}
                    </span>
                  </div>
                )}

                {/* Wooden / Neon Signboard */}
                <div className={`px-1.5 py-0.5 rounded text-[8px] sm:text-[9px] font-display font-black tracking-wider uppercase mb-1 shadow-md transition-colors ${
                  isActive ? 'bg-yellow-400 text-black border border-white' : 'bg-[#18092f]/90 text-purple-200 border border-purple-400/60'
                }`}>
                  {stg.short}
                </div>

                {/* Checkered Green Hill Island Platform */}
                <div className="w-14 sm:w-20 flex flex-col items-center">
                  {/* Lush Grass Top */}
                  <div className="w-full h-3 bg-gradient-to-r from-emerald-500 via-green-500 to-emerald-600 rounded-t-lg border-t-2 border-emerald-300 shadow-sm" />
                  {/* Checkered Brown Dirt Trunk */}
                  <div className="w-11 sm:w-16 h-4 bg-[#854d0e] border-x-2 border-b-2 border-[#582c03] rounded-b-md flex items-center justify-center overflow-hidden">
                    <div className="w-full h-full opacity-35 bg-[repeating-linear-gradient(45deg,#451a03,#451a03_4px,#a16207_4px,#a16207_8px)]" />
                  </div>
                  {/* Cascading pixel waterfall for Island 1 */}
                  {stg.id === 1 && (
                    <div className="w-2.5 h-3 bg-cyan-300/80 animate-pulse -mt-1 rounded-b" />
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* BOTTOM: HANDHELD RETRO CONSOLE CONTROLLER (Ref: 22.11.16(1))   */}
      {/* ------------------------------------------------------------- */}
      <div className="w-full bg-[#160a2c] border-t-2 border-purple-800/80 px-3 py-2 sm:py-2.5 flex items-center justify-between gap-3 shadow-2xl">
        
        {/* Left Side: Authentic 4-Way Cross D-Pad */}
        <div className="flex items-center gap-1">
          <div className="relative w-16 h-16 sm:w-20 sm:h-20 bg-zinc-900 rounded-full border-2 border-zinc-700 p-1 flex items-center justify-center shadow-lg">
            {/* Center Hub */}
            <div className="w-4 h-4 bg-zinc-800 rounded-full z-10" />

            {/* D-Pad Buttons */}
            <button
              onClick={handlePrev}
              className="absolute top-1 left-5 sm:left-7 w-6 h-5 bg-zinc-800 hover:bg-zinc-700 active:bg-cyan-500 rounded-t-sm text-[8px] text-zinc-400 font-bold flex items-center justify-center shadow-inner"
              title="Up / Prev"
            >
              ▲
            </button>
            <button
              onClick={handleNext}
              className="absolute bottom-1 left-5 sm:left-7 w-6 h-5 bg-zinc-800 hover:bg-zinc-700 active:bg-cyan-500 rounded-b-sm text-[8px] text-zinc-400 font-bold flex items-center justify-center shadow-inner"
              title="Down / Next"
            >
              ▼
            </button>
            <button
              onClick={handlePrev}
              className="absolute left-1 top-5 sm:top-7 w-5 h-6 bg-zinc-800 hover:bg-zinc-700 active:bg-cyan-500 rounded-l-sm text-[8px] text-zinc-400 font-bold flex items-center justify-center shadow-inner"
              title="Left / Prev"
            >
              ◀
            </button>
            <button
              onClick={handleNext}
              className="absolute right-1 top-5 sm:top-7 w-5 h-6 bg-zinc-800 hover:bg-zinc-700 active:bg-cyan-500 rounded-r-sm text-[8px] text-zinc-400 font-bold flex items-center justify-center shadow-inner"
              title="Right / Next"
            >
              ▶
            </button>
          </div>
        </div>

        {/* Center: System Pills (CRT Toggle & Sound Toggle) */}
        <div className="flex items-center gap-2">
          <button
            onClick={onToggleCrt}
            className={`px-2.5 py-1 rounded-full font-mono text-[9px] font-black uppercase tracking-wider border transition-all flex items-center gap-1 cursor-pointer ${
              crtEnabled
                ? 'bg-emerald-950 border-emerald-400 text-emerald-300 shadow-[0_0_10px_rgba(16,185,129,0.5)]'
                : 'bg-zinc-900 border-zinc-700 text-zinc-400 hover:text-white'
            }`}
          >
            <Tv size={12} />
            <span>CRT {crtEnabled ? 'ON' : 'OFF'}</span>
          </button>

          <button
            onClick={onToggleSound}
            className={`px-2.5 py-1 rounded-full font-mono text-[9px] font-black uppercase tracking-wider border transition-all flex items-center gap-1 cursor-pointer ${
              !soundMuted
                ? 'bg-pink-950 border-pink-400 text-pink-300 shadow-[0_0_10px_rgba(244,63,94,0.5)]'
                : 'bg-zinc-900 border-zinc-700 text-zinc-400 hover:text-white'
            }`}
          >
            {!soundMuted ? <Volume2 size={12} /> : <VolumeX size={12} />}
            <span>SOUND {!soundMuted ? 'ON' : 'MUTE'}</span>
          </button>
        </div>

        {/* Right Side: Circular Arcade Action Buttons (PREV & JUMP / NEXT) */}
        <div className="flex items-center gap-2">
          <button
            onClick={handlePrev}
            className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-b from-blue-600 to-indigo-800 border-2 border-blue-300 shadow-[0_3px_0_#1e1b4b,0_0_10px_rgba(59,130,246,0.5)] active:translate-y-1 active:shadow-none font-display text-[9px] sm:text-[10px] font-black text-white uppercase flex items-center justify-center cursor-pointer hover:scale-105"
            title="Previous Stage"
          >
            PREV
          </button>

          <button
            onClick={handleNext}
            className="px-3 sm:px-4 h-10 sm:h-12 rounded-full bg-gradient-to-b from-rose-500 to-pink-700 border-2 border-pink-200 shadow-[0_3px_0_#831843,0_0_15px_rgba(244,63,94,0.6)] active:translate-y-1 active:shadow-none font-display text-[10px] sm:text-xs font-black text-white uppercase flex items-center justify-center gap-1 cursor-pointer hover:scale-105"
            title="Jump to Next Stage"
          >
            <span>JUMP / NEXT</span>
            <ChevronRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
