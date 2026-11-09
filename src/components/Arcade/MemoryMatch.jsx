import React, { useState, useEffect } from 'react';
import { 
  Play, RotateCcw, Bot, Guitar, Cpu, Trophy, Crown, Sparkles, 
  Coins, CheckCircle2 
} from 'lucide-react';
import { soundEngine } from '../../game/systems/SoundEngine';
import { achievementSystem } from '../../game/systems/AchievementSystem';
import confetti from 'canvas-confetti';

const ICONS = [
  { name: 'KOTA BOT', icon: Bot, color: 'text-cyan-400 border-cyan-500' },
  { name: 'PRONITE GUITAR', icon: Guitar, color: 'text-pink-400 border-pink-500' },
  { name: 'CYBER CHIP', icon: Cpu, color: 'text-emerald-400 border-emerald-500' },
  { name: 'CHAMPION CUP', icon: Trophy, color: 'text-yellow-400 border-yellow-500' },
  { name: 'ROYAL CROWN', icon: Crown, color: 'text-purple-400 border-purple-500' },
  { name: 'REVÉRIE CREST', icon: Sparkles, color: 'text-rose-400 border-rose-500' }
];

export function MemoryMatch() {
  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [matched, setMatched] = useState([]);
  const [moves, setMoves] = useState(0);
  const [gameWon, setGameWon] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const initGame = () => {
    soundEngine.playBlip();
    const deck = [];
    ICONS.forEach((item, idx) => {
      deck.push({ id: `${idx}-a`, pairId: idx, ...item });
      deck.push({ id: `${idx}-b`, pairId: idx, ...item });
    });
    // Shuffle
    for (let i = deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [deck[i], deck[j]] = [deck[j], deck[i]];
    }
    setCards(deck);
    setFlipped([]);
    setMatched([]);
    setMoves(0);
    setGameWon(false);
    setIsPlaying(true);
  };

  const handleCardClick = (index) => {
    if (!isPlaying || flipped.length >= 2 || flipped.includes(index) || matched.includes(cards[index].pairId)) {
      return;
    }

    soundEngine.playBlip();
    const newFlipped = [...flipped, index];
    setFlipped(newFlipped);

    if (newFlipped.length === 2) {
      setMoves(prev => prev + 1);
      const [first, second] = newFlipped;
      if (cards[first].pairId === cards[second].pairId) {
        // MATCH!
        soundEngine.playCoin();
        setMatched(prev => {
          const next = [...prev, cards[first].pairId];
          if (next.length === ICONS.length) {
            setGameWon(true);
            soundEngine.playFanfare();
            achievementSystem.addBonusCoins(15);
            try {
              confetti({ particleCount: 50, spread: 70, origin: { y: 0.4 } });
            } catch (e) {}
          }
          return next;
        });
        setFlipped([]);
      } else {
        // No match
        setTimeout(() => {
          setFlipped([]);
        }, 850);
      }
    }
  };

  return (
    <div className="flex flex-col items-center w-full h-full text-white select-none">
      {/* Top HUD */}
      <div className="w-full p-3 bg-[#110729] border-b border-purple-800 flex items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-3">
          <div className="px-3 py-1 rounded-xl bg-purple-950 border border-purple-600 font-display font-bold">
            MOVES: <span className="text-yellow-400 text-sm ml-1">{moves}</span>
          </div>
          <div className="px-3 py-1 rounded-xl bg-cyan-950 border border-cyan-600 font-display font-bold">
            PAIRS: <span className="text-cyan-300 text-sm ml-1">{matched.length} / {ICONS.length}</span>
          </div>
        </div>

        <button
          onClick={initGame}
          className="px-3 py-1.5 rounded-xl bg-purple-950 hover:bg-purple-800 border border-purple-600 font-display text-xs font-bold uppercase flex items-center gap-1.5 transition-all cursor-pointer"
        >
          <RotateCcw size={14} />
          <span>SHUFFLE / RESTART</span>
        </button>
      </div>

      {/* Main Board Viewport */}
      <div className="relative w-full flex-1 p-4 sm:p-6 bg-[#070313] flex items-center justify-center overflow-y-auto">
        {!isPlaying ? (
          <div className="text-center p-6 space-y-4 max-w-sm">
            <h3 className="font-display text-2xl sm:text-3xl font-black text-yellow-300">
              MEMORY MATRIX 2K27
            </h3>
            <p className="font-body text-xs sm:text-sm text-slate-300 leading-relaxed">
              Match festival artifacts, Kota Bot cores, and rock guitars. Solve the board to earn +15 festival coins!
            </p>
            <button
              onClick={initGame}
              className="px-6 py-3 rounded-xl bg-pink-600 hover:bg-pink-500 font-display text-sm font-black uppercase tracking-wider flex items-center justify-center gap-2 mx-auto shadow-xl shadow-pink-600/40 cursor-pointer"
            >
              <Play size={18} />
              <span>START MEMORY MATCH</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 sm:gap-4 max-w-lg w-full">
            {cards.map((c, idx) => {
              const isCardFlipped = flipped.includes(idx) || matched.includes(c.pairId);
              const IconComp = c.icon;

              return (
                <div
                  key={c.id}
                  onClick={() => handleCardClick(idx)}
                  className={`h-24 sm:h-28 rounded-2xl border-2 cursor-pointer flex flex-col items-center justify-center p-2 transition-all transform ${
                    isCardFlipped
                      ? `bg-[#180d38] ${c.color} scale-100 shadow-lg`
                      : 'bg-[#120826] border-purple-900 hover:border-purple-500 hover:scale-105 active:scale-95'
                  }`}
                >
                  {isCardFlipped ? (
                    <>
                      <IconComp size={32} className="animate-scaleUp" />
                      <span className="font-display text-[9px] font-black uppercase tracking-wider mt-1 text-center line-clamp-1">
                        {c.name}
                      </span>
                    </>
                  ) : (
                    <span className="font-display text-2xl font-black text-purple-600">
                      ?
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Victory Dialog */}
        {gameWon && (
          <div className="absolute inset-0 bg-black/90 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center z-20 animate-fadeIn">
            <CheckCircle2 size={48} className="text-yellow-400 animate-bounce mb-3" />
            <h3 className="font-display text-3xl font-black text-yellow-300">
              BOARD CLEARED!
            </h3>
            <p className="font-body text-sm text-slate-200 mt-1 mb-2">
              Completed in <strong className="text-yellow-400 font-display">{moves} moves</strong>!
            </p>
            <p className="font-display text-sm text-emerald-400 font-bold mb-6">
              +15 FESTIVAL COINS EARNED!
            </p>
            <button
              onClick={initGame}
              className="px-6 py-3 rounded-xl bg-pink-600 hover:bg-pink-500 font-display text-sm font-black uppercase tracking-wider flex items-center gap-2 cursor-pointer"
            >
              <RotateCcw size={16} />
              <span>PLAY NEXT ROUND</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

