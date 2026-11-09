import React, { useState, useEffect, useRef } from 'react';
import { Play, RotateCcw, Zap, Timer, Award, Coins, AlertCircle } from 'lucide-react';
import { soundEngine } from '../../game/systems/SoundEngine';
import { achievementSystem } from '../../game/systems/AchievementSystem';

export function QuickReflex() {
  const [gameState, setGameState] = useState('idle'); // 'idle' | 'waiting' | 'ready' | 'result' | 'early'
  const [reactionTime, setReactionTime] = useState(null);
  const [bestTime, setBestTime] = useState(null);
  const [coinsAwarded, setCoinsAwarded] = useState(0);

  const timerRef = useRef(null);
  const startTimeRef = useRef(null);

  useEffect(() => {
    const saved = localStorage.getItem('reverie_reflex_best');
    if (saved) setBestTime(parseInt(saved, 10));
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const startRound = () => {
    soundEngine.playBlip();
    setGameState('waiting');
    setReactionTime(null);
    setCoinsAwarded(0);

    // Random delay between 1.5s and 4s
    const delay = 1500 + Math.random() * 2500;
    timerRef.current = setTimeout(() => {
      startTimeRef.current = Date.now();
      setGameState('ready');
      soundEngine.playLaser();
    }, delay);
  };

  const handleTap = () => {
    if (gameState === 'waiting') {
      // Too early!
      if (timerRef.current) clearTimeout(timerRef.current);
      soundEngine.playHit();
      setGameState('early');
    } else if (gameState === 'ready') {
      const elapsed = Date.now() - startTimeRef.current;
      setReactionTime(elapsed);
      setGameState('result');
      soundEngine.playFanfare();

      // Determine rank & coins
      let bonus = 2;
      if (elapsed < 200) bonus = 20;
      else if (elapsed < 280) bonus = 12;
      else if (elapsed < 380) bonus = 6;

      setCoinsAwarded(bonus);
      achievementSystem.addBonusCoins(bonus);

      // Best time
      if (!bestTime || elapsed < bestTime) {
        setBestTime(elapsed);
        localStorage.setItem('reverie_reflex_best', elapsed.toString());
      }
    }
  };

  return (
    <div className="flex flex-col items-center w-full h-full text-white select-none">
      {/* Top HUD */}
      <div className="w-full p-3 bg-[#110729] border-b border-purple-800 flex items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-3">
          <div className="px-3 py-1 rounded-xl bg-purple-950 border border-purple-600 font-display font-bold flex items-center gap-1.5">
            <Timer size={14} className="text-cyan-400" />
            <span>LAST: <strong className="text-yellow-400">{reactionTime ? `${reactionTime}ms` : '--'}</strong></span>
          </div>

          <div className="px-3 py-1 rounded-xl bg-amber-950 border border-yellow-500 font-display font-bold flex items-center gap-1.5">
            <Coins size={14} className="text-yellow-400" />
            <span>+{coinsAwarded} COINS</span>
          </div>
        </div>

        <div className="text-slate-300 font-mono text-xs">
          RECORD: <strong className="text-cyan-400">{bestTime ? `${bestTime}ms` : '--'}</strong>
        </div>
      </div>

      {/* Main Interactive Screen */}
      <div 
        onClick={handleTap}
        className={`relative w-full flex-1 p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-colors duration-150 select-none ${
          gameState === 'waiting'
            ? 'bg-rose-950/70 border-rose-600'
            : gameState === 'ready'
            ? 'bg-emerald-600 border-emerald-400 animate-pulse'
            : gameState === 'early'
            ? 'bg-red-900 border-red-500'
            : 'bg-[#070313]'
        }`}
      >
        {gameState === 'idle' && (
          <div className="max-w-md space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-cyan-950 border-2 border-cyan-400 flex items-center justify-center mx-auto shadow-xl shadow-cyan-500/20">
              <Zap size={36} className="text-cyan-400 animate-bounce" />
            </div>
            <h3 className="font-display text-2xl sm:text-3xl font-black text-cyan-300">
              QUICK REFLEX 2K27
            </h3>
            <p className="font-body text-xs sm:text-sm text-slate-300 leading-relaxed">
              When the screen turns <strong className="text-emerald-400">NEON GREEN</strong>, tap as lightning-fast as possible to test your reaction time and claim festival coins!
            </p>
            <button
              onClick={(e) => { e.stopPropagation(); startRound(); }}
              className="px-6 py-3 rounded-xl bg-pink-600 hover:bg-pink-500 font-display text-sm font-black uppercase tracking-wider flex items-center gap-2 mx-auto shadow-xl shadow-pink-600/40 cursor-pointer"
            >
              <Play size={18} />
              <span>START CHALLENGE</span>
            </button>
          </div>
        )}

        {gameState === 'waiting' && (
          <div className="space-y-3">
            <h3 className="font-display text-3xl sm:text-4xl font-black text-rose-300 animate-pulse">
              WAIT FOR GREEN...
            </h3>
            <p className="font-body text-xs text-rose-200">
              Do NOT tap yet!
            </p>
          </div>
        )}

        {gameState === 'ready' && (
          <div className="space-y-3">
            <h3 className="font-display text-4xl sm:text-6xl font-black text-white drop-shadow-xl animate-bounce">
              TAP NOW!
            </h3>
          </div>
        )}

        {gameState === 'early' && (
          <div className="space-y-3">
            <AlertCircle size={48} className="text-yellow-400 mx-auto" />
            <h3 className="font-display text-2xl sm:text-3xl font-black text-white">
              TOO EARLY!
            </h3>
            <p className="font-body text-xs text-slate-200 mb-4">
              You clicked before the neon green signal flashed!
            </p>
            <button
              onClick={(e) => { e.stopPropagation(); startRound(); }}
              className="px-6 py-2.5 rounded-xl bg-yellow-400 text-black font-display text-xs font-black uppercase cursor-pointer"
            >
              TRY AGAIN
            </button>
          </div>
        )}

        {gameState === 'result' && (
          <div className="space-y-3 animate-scaleUp">
            <span className="text-[10px] font-display font-black px-3 py-1 rounded-full bg-black/60 border border-yellow-400 text-yellow-300 uppercase">
              {reactionTime < 200 ? 'S-RANK GODLIKE REFLEX' : reactionTime < 280 ? 'A-RANK CYBER ACE' : 'B-RANK FAST'}
            </span>
            <h3 className="font-display text-4xl sm:text-5xl font-black text-yellow-300">
              {reactionTime} ms
            </h3>
            <p className="font-display text-sm text-emerald-400 font-bold">
              +{coinsAwarded} FESTIVAL COINS AWARDED!
            </p>
            <div className="pt-2">
              <button
                onClick={(e) => { e.stopPropagation(); startRound(); }}
                className="px-6 py-2.5 rounded-xl bg-pink-600 hover:bg-pink-500 font-display text-xs font-black uppercase tracking-wider flex items-center gap-1.5 mx-auto cursor-pointer"
              >
                <RotateCcw size={14} />
                <span>CHALLENGE AGAIN</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

