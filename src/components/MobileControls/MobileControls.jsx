import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, ArrowUp, Sparkles, Menu, Compass } from 'lucide-react';
import { eventBus } from '../../game/EventBus';
import { soundEngine } from '../../game/systems/SoundEngine';

export function MobileControls({ onOpenDirectory, onOpenMap, isPipeNear, isEventNear, isNpcNear }) {
  const [leftActive, setLeftActive] = useState(false);
  const [rightActive, setRightActive] = useState(false);
  const [jumpActive, setJumpActive] = useState(false);

  const handleLeftDown = (e) => {
    e.preventDefault();
    setLeftActive(true);
    eventBus.emit('mobile-input', { left: true });
  };

  const handleLeftUp = (e) => {
    e.preventDefault();
    setLeftActive(false);
    eventBus.emit('mobile-input', { left: false });
  };

  const handleRightDown = (e) => {
    e.preventDefault();
    setRightActive(true);
    eventBus.emit('mobile-input', { right: true });
  };

  const handleRightUp = (e) => {
    e.preventDefault();
    setRightActive(false);
    eventBus.emit('mobile-input', { right: false });
  };

  const handleJumpDown = (e) => {
    e.preventDefault();
    setJumpActive(true);
    eventBus.emit('mobile-input', { jump: true });
  };

  const handleJumpUp = (e) => {
    e.preventDefault();
    setJumpActive(false);
    eventBus.emit('mobile-input', { jump: false });
  };

  const handleInteract = (e) => {
    e.preventDefault();
    soundEngine.playBlip();
    eventBus.emit('mobile-interact');
  };

  return (
    // md:hidden hides these virtual touch buttons on PC widescreen so PC gamers have a clean cinematic experience!
    <div className="md:hidden absolute inset-x-0 bottom-0 z-40 p-3 pb-6 pointer-events-none select-none flex items-end justify-between">
      {/* LEFT CLUSTER: D-Pad Directional Controls */}
      <div className="flex items-center gap-2 pointer-events-auto">
        <button
          type="button"
          onPointerDown={handleLeftDown}
          onPointerUp={handleLeftUp}
          onPointerCancel={handleLeftUp}
          onPointerLeave={handleLeftUp}
          className={`w-14 h-14 rounded-2xl border-2 flex items-center justify-center transition-all ${
            leftActive 
              ? 'bg-purple-600 border-pink-400 translate-y-1 shadow-inner' 
              : 'bg-[#181133]/90 border-purple-500/60 shadow-lg shadow-purple-900/40 backdrop-blur-sm'
          }`}
          aria-label="Move Left"
        >
          <ArrowLeft size={26} className="text-purple-200" />
        </button>

        <button
          type="button"
          onPointerDown={handleRightDown}
          onPointerUp={handleRightUp}
          onPointerCancel={handleRightUp}
          onPointerLeave={handleRightUp}
          className={`w-14 h-14 rounded-2xl border-2 flex items-center justify-center transition-all ${
            rightActive 
              ? 'bg-purple-600 border-pink-400 translate-y-1 shadow-inner' 
              : 'bg-[#181133]/90 border-purple-500/60 shadow-lg shadow-purple-900/40 backdrop-blur-sm'
          }`}
          aria-label="Move Right"
        >
          <ArrowRight size={26} className="text-purple-200" />
        </button>
      </div>

      {/* CENTER CLUSTER: Quick Mobile Directory & Map */}
      <div className="flex items-center gap-2 pointer-events-auto mb-1">
        <button
          onClick={onOpenDirectory}
          className="px-2.5 py-1.5 bg-purple-950/90 border border-purple-400/50 rounded-lg text-purple-200 text-[9px] font-pixel flex items-center gap-1 shadow-md backdrop-blur-sm"
        >
          <Menu size={12} className="text-pink-400" />
          <span>EVENTS</span>
        </button>
        <button
          onClick={onOpenMap}
          className="px-2.5 py-1.5 bg-indigo-950/90 border border-indigo-400/50 rounded-lg text-indigo-200 text-[9px] font-pixel flex items-center gap-1 shadow-md backdrop-blur-sm"
        >
          <Compass size={12} className="text-yellow-400" />
          <span>MAP</span>
        </button>
      </div>

      {/* RIGHT CLUSTER: Action Buttons (Jump & Interact) */}
      <div className="flex items-center gap-3 pointer-events-auto">
        {/* INTERACT / ENTER PIPE BUTTON */}
        <button
          type="button"
          onClick={handleInteract}
          className={`w-14 h-14 rounded-2xl border-2 flex flex-col items-center justify-center transition-all backdrop-blur-sm ${
            isPipeNear || isEventNear || isNpcNear
              ? 'bg-amber-500 border-yellow-300 animate-pulse shadow-lg shadow-amber-500/50'
              : 'bg-[#181133]/90 border-amber-500/40 shadow-lg shadow-purple-900/40'
          }`}
          aria-label="Interact"
        >
          <Sparkles size={18} className={isPipeNear || isEventNear || isNpcNear ? 'text-slate-900' : 'text-amber-300'} />
          <span className={`font-pixel text-[7.5px] mt-0.5 ${isPipeNear || isEventNear || isNpcNear ? 'text-slate-900 font-bold' : 'text-amber-200'}`}>
            {isPipeNear ? 'ENTER' : isNpcNear ? 'TALK' : 'ACTION'}
          </span>
        </button>

        {/* JUMP BUTTON */}
        <button
          type="button"
          onPointerDown={handleJumpDown}
          onPointerUp={handleJumpUp}
          onPointerCancel={handleJumpUp}
          onPointerLeave={handleJumpUp}
          className={`w-16 h-16 rounded-2xl border-2 flex flex-col items-center justify-center transition-all backdrop-blur-sm ${
            jumpActive 
              ? 'bg-pink-600 border-pink-300 translate-y-1 shadow-inner' 
              : 'bg-[#831843]/90 border-pink-500 shadow-lg shadow-pink-900/50'
          }`}
          aria-label="Jump"
        >
          <ArrowUp size={26} className="text-pink-100" />
          <span className="font-pixel text-[8px] text-pink-200 mt-0.5 font-bold">JUMP</span>
        </button>
      </div>
    </div>
  );
}
