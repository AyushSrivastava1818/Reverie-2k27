import React, { useState, useEffect, useRef } from 'react';
import { Play, RotateCcw, Pause, Trophy, Coins, ArrowUp, ArrowDown, ArrowLeft, ArrowRight } from 'lucide-react';
import { soundEngine } from '../../game/systems/SoundEngine';
import { achievementSystem } from '../../game/systems/AchievementSystem';

const GRID_SIZE = 20;

export function RetroSnake() {
  const [snake, setSnake] = useState([
    { x: 10, y: 10 },
    { x: 10, y: 11 },
    { x: 10, y: 12 }
  ]);
  const [food, setFood] = useState({ x: 5, y: 5 });
  const [direction, setDirection] = useState({ x: 0, y: -1 });
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [coinsEarned, setCoinsEarned] = useState(0);

  const dirRef = useRef({ x: 0, y: -1 });

  useEffect(() => {
    const saved = localStorage.getItem('reverie_snake_high');
    if (saved) setHighScore(parseInt(saved, 10) || 0);
  }, []);

  const spawnFood = (currentSnake) => {
    let newFood;
    while (!newFood || currentSnake.some(seg => seg.x === newFood.x && seg.y === newFood.y)) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE)
      };
    }
    return newFood;
  };

  const startGame = () => {
    soundEngine.playBlip();
    const initSnake = [
      { x: 10, y: 10 },
      { x: 10, y: 11 },
      { x: 10, y: 12 }
    ];
    setSnake(initSnake);
    setFood(spawnFood(initSnake));
    setDirection({ x: 0, y: -1 });
    dirRef.current = { x: 0, y: -1 };
    setScore(0);
    setCoinsEarned(0);
    setGameOver(false);
    setIsPaused(false);
    setIsPlaying(true);
  };

  const changeDirection = (newDir) => {
    // Prevent 180-degree instant reversal
    if (newDir.x !== 0 && dirRef.current.x !== 0) return;
    if (newDir.y !== 0 && dirRef.current.y !== 0) return;
    dirRef.current = newDir;
    setDirection(newDir);
    soundEngine.playBlip();
  };

  useEffect(() => {
    if (!isPlaying || isPaused || gameOver) return;

    const interval = setInterval(() => {
      setSnake(prevSnake => {
        const head = { ...prevSnake[0] };
        head.x += dirRef.current.x;
        head.y += dirRef.current.y;

        // Wall collision
        if (head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE) {
          soundEngine.playDefeat();
          setGameOver(true);
          setIsPlaying(false);
          return prevSnake;
        }

        // Self collision
        if (prevSnake.some(seg => seg.x === head.x && seg.y === head.y)) {
          soundEngine.playDefeat();
          setGameOver(true);
          setIsPlaying(false);
          return prevSnake;
        }

        const newSnake = [head, ...prevSnake];

        // Eat food
        if (head.x === food.x && head.y === food.y) {
          soundEngine.playCoin();
          setScore(s => {
            const next = s + 10;
            if (next > highScore) {
              setHighScore(next);
              localStorage.setItem('reverie_snake_high', next.toString());
            }
            return next;
          });
          setCoinsEarned(c => c + 1);
          achievementSystem.addBonusCoins(1);
          setFood(spawnFood(newSnake));
        } else {
          newSnake.pop();
        }

        return newSnake;
      });
    }, 110);

    return () => clearInterval(interval);
  }, [isPlaying, isPaused, gameOver, food, highScore]);

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isPlaying || gameOver) return;
      if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') {
        e.preventDefault();
        changeDirection({ x: 0, y: -1 });
      } else if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') {
        e.preventDefault();
        changeDirection({ x: 0, y: 1 });
      } else if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        e.preventDefault();
        changeDirection({ x: -1, y: 0 });
      } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        e.preventDefault();
        changeDirection({ x: 1, y: 0 });
      } else if (e.key === 'p' || e.key === 'P') {
        setIsPaused(p => !p);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPlaying, gameOver]);

  return (
    <div className="flex flex-col items-center w-full h-full text-white select-none">
      {/* Top HUD */}
      <div className="w-full p-3 bg-[#110729] border-b border-purple-800 flex items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-3">
          <div className="px-3 py-1 rounded-xl bg-purple-950 border border-purple-600 font-display font-bold">
            SCORE: <span className="text-yellow-400 text-sm ml-1">{score}</span>
          </div>
          <div className="px-3 py-1 rounded-xl bg-amber-950 border border-yellow-500 font-display font-bold flex items-center gap-1.5">
            <Coins size={14} className="text-yellow-400" />
            <span>+{coinsEarned} COINS</span>
          </div>
        </div>

        <div className="text-slate-300 font-mono">
          HIGH: <strong className="text-cyan-400">{highScore}</strong>
        </div>
      </div>

      {/* Main Grid Board */}
      <div className="relative w-full flex-1 p-3 bg-[#070313] flex items-center justify-center overflow-hidden">
        <div 
          className="relative bg-[#0c051f] border-2 border-purple-800 rounded-xl overflow-hidden grid"
          style={{
            width: '280px',
            height: '280px',
            gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
            gridTemplateRows: `repeat(${GRID_SIZE}, 1fr)`
          }}
        >
          {/* Render Food */}
          <div
            className="bg-pink-500 rounded-sm shadow-md shadow-pink-500 animate-pulse"
            style={{
              gridColumnStart: food.x + 1,
              gridRowStart: food.y + 1
            }}
          />

          {/* Render Snake */}
          {snake.map((seg, idx) => (
            <div
              key={idx}
              className={`rounded-xs ${
                idx === 0 
                  ? 'bg-yellow-400 shadow-sm shadow-yellow-400' 
                  : 'bg-emerald-400 border border-[#0c051f]'
              }`}
              style={{
                gridColumnStart: seg.x + 1,
                gridRowStart: seg.y + 1
              }}
            />
          ))}
        </div>

        {/* Start Overlay */}
        {!isPlaying && !gameOver && (
          <div className="absolute inset-0 bg-black/85 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center z-10">
            <h3 className="font-display text-2xl font-black text-emerald-400 mb-2">
              RETRO SNAKE 2K27
            </h3>
            <p className="font-body text-xs text-slate-300 max-w-xs mb-4">
              Guide the neon serpent to consume festival energy cores and expand your score!
            </p>
            <button
              onClick={startGame}
              className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 font-display text-xs font-black uppercase tracking-wider flex items-center gap-2 cursor-pointer shadow-lg shadow-emerald-600/30"
            >
              <Play size={16} />
              <span>START GAME</span>
            </button>
          </div>
        )}

        {/* Game Over Overlay */}
        {gameOver && (
          <div className="absolute inset-0 bg-black/90 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center z-10 animate-fadeIn">
            <h3 className="font-display text-2xl font-black text-rose-500 mb-1">
              GAME OVER
            </h3>
            <p className="font-body text-xs text-slate-300 mb-1">
              Score: <strong className="text-yellow-400 font-display">{score}</strong>
            </p>
            <p className="font-body text-xs text-yellow-300 mb-4">
              +{coinsEarned} Coins added to festival balance!
            </p>
            <button
              onClick={startGame}
              className="px-6 py-2.5 rounded-xl bg-pink-600 hover:bg-pink-500 font-display text-xs font-black uppercase tracking-wider flex items-center gap-1.5 cursor-pointer"
            >
              <RotateCcw size={14} />
              <span>RESTART</span>
            </button>
          </div>
        )}
      </div>

      {/* Mobile Virtual D-Pad */}
      <div className="w-full p-2.5 bg-[#0f0724] border-t border-purple-800 flex items-center justify-center gap-2">
        <button
          onClick={() => changeDirection({ x: -1, y: 0 })}
          className="w-12 h-10 rounded-xl bg-purple-900 border border-purple-600 text-white font-bold active:scale-95 flex items-center justify-center"
        >
          <ArrowLeft size={16} />
        </button>
        <div className="flex flex-col gap-1.5">
          <button
            onClick={() => changeDirection({ x: 0, y: -1 })}
            className="w-12 h-9 rounded-xl bg-purple-900 border border-purple-600 text-white font-bold active:scale-95 flex items-center justify-center"
          >
            <ArrowUp size={16} />
          </button>
          <button
            onClick={() => changeDirection({ x: 0, y: 1 })}
            className="w-12 h-9 rounded-xl bg-purple-900 border border-purple-600 text-white font-bold active:scale-95 flex items-center justify-center"
          >
            <ArrowDown size={16} />
          </button>
        </div>
        <button
          onClick={() => changeDirection({ x: 1, y: 0 })}
          className="w-12 h-10 rounded-xl bg-purple-900 border border-purple-600 text-white font-bold active:scale-95 flex items-center justify-center"
        >
          <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
}

