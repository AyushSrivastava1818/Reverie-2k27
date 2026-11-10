import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Heart, Calendar, Clock, MapPin, ExternalLink, ArrowRight, ChevronLeft, ChevronRight, Trophy, Sparkles } from 'lucide-react';
import { festivalSchedule } from '../../data/schedule';
import { soundEngine } from '../../game/systems/SoundEngine';
import { achievementSystem } from '../../game/systems/AchievementSystem';

// Maze Grid Definition (0: Pellet, 1: Wall, 2: Empty/Ghost Spawn, 3: Power Pellet, 4: Pacman Spawn)
// 15x15 compact arcade grid
const MAZE_GRID = [
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 3, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 3, 1],
  [1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1],
  [1, 0, 1, 1, 0, 0, 0, 0, 0, 1, 0, 1, 1, 0, 1],
  [1, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 1],
  [1, 1, 1, 0, 1, 1, 2, 1, 1, 0, 1, 1, 1, 0, 1],
  [1, 0, 0, 0, 1, 2, 2, 2, 1, 0, 0, 0, 1, 0, 1],
  [0, 0, 1, 0, 1, 2, 2, 2, 1, 0, 1, 0, 1, 0, 0],
  [1, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 1, 0, 1],
  [1, 1, 1, 0, 0, 0, 4, 0, 0, 0, 1, 1, 1, 0, 1],
  [1, 0, 0, 0, 1, 1, 0, 1, 1, 0, 0, 0, 0, 0, 1],
  [1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1],
  [1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 1, 0, 1, 0, 1],
  [1, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
];

export function PacmanScheduleMaze({ onSelectEvent, onAdvanceStage }) {
  const canvasRef = useRef(null);
  const [score, setScore] = useState(1250);
  const [lives, setLives] = useState(3);
  const [collectedCount, setCollectedCount] = useState(0);
  const [activeCheckpointIndex, setActiveCheckpointIndex] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  // Filter 6 key schedule milestones to unlock
  const scheduleMilestones = festivalSchedule.slice(0, 6);
  const currentMilestone = scheduleMilestones[activeCheckpointIndex % scheduleMilestones.length] || scheduleMilestones[0];

  const gameState = useRef({
    grid: MAZE_GRID.map(row => [...row]),
    pacman: { x: 7, y: 9, dirX: 0, dirY: 0, nextDirX: 0, nextDirY: 0, mouth: 0.2, mouthDir: 0.05 },
    ghosts: [
      { x: 6, y: 6, color: '#ef4444', dirX: 1, dirY: 0 },
      { x: 7, y: 6, color: '#ec4899', dirX: -1, dirY: 0 },
      { x: 8, y: 6, color: '#06b6d4', dirX: 0, dirY: 1 },
      { x: 7, y: 7, color: '#f97316', dirX: 0, dirY: -1 }
    ],
    lastUpdate: 0,
    ghostSpeed: 380, // ms per move
    pacmanSpeed: 220, // ms per move
    lastPacmanMove: 0,
    lastGhostMove: 0,
    totalPellets: 0,
    collectedPellets: 0
  });

  // Count pellets
  useEffect(() => {
    let count = 0;
    MAZE_GRID.forEach(row => {
      row.forEach(cell => {
        if (cell === 0 || cell === 3) count++;
      });
    });
    gameState.current.totalPellets = count;
  }, []);

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e) => {
      const p = gameState.current.pacman;
      if (['ArrowUp', 'w', 'W'].includes(e.key)) {
        p.nextDirX = 0; p.nextDirY = -1;
      } else if (['ArrowDown', 's', 'S'].includes(e.key)) {
        p.nextDirX = 0; p.nextDirY = 1;
      } else if (['ArrowLeft', 'a', 'A'].includes(e.key)) {
        p.nextDirX = -1; p.nextDirY = 0;
      } else if (['ArrowRight', 'd', 'D'].includes(e.key)) {
        p.nextDirX = 1; p.nextDirY = 0;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Direction handlers for mobile buttons
  const setDirection = (dx, dy) => {
    soundEngine.playBlip();
    gameState.current.pacman.nextDirX = dx;
    gameState.current.pacman.nextDirY = dy;
  };

  // Main Canvas Render & Game Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationId;

    const tileSize = 20; // 15 tiles * 20px = 300px
    canvas.width = 300;
    canvas.height = 300;

    const gameLoop = (timestamp) => {
      if (!isPaused && !isGameOver) {
        const state = gameState.current;
        const p = state.pacman;

        // Pacman mouth animation
        p.mouth += p.mouthDir;
        if (p.mouth > 0.4 || p.mouth < 0.05) {
          p.mouthDir *= -1;
        }

        // Pacman Movement
        if (timestamp - state.lastPacmanMove > state.pacmanSpeed) {
          state.lastPacmanMove = timestamp;

          // Try turn into nextDir
          const nextTargetX = (p.x + p.nextDirX + 15) % 15;
          const nextTargetY = (p.y + p.nextDirY + 15) % 15;
          if (state.grid[nextTargetY] && state.grid[nextTargetY][nextTargetX] !== 1) {
            p.dirX = p.nextDirX;
            p.dirY = p.nextDirY;
          }

          // Move in current dir
          const targetX = (p.x + p.dirX + 15) % 15;
          const targetY = (p.y + p.dirY + 15) % 15;

          if (state.grid[targetY] && state.grid[targetY][targetX] !== 1) {
            p.x = targetX;
            p.y = targetY;

            // Check pellet consumption
            const cell = state.grid[p.y][p.x];
            if (cell === 0 || cell === 3) {
              state.grid[p.y][p.x] = 2; // empty
              state.collectedPellets++;
              soundEngine.playBlip();
              setScore(prev => prev + (cell === 3 ? 50 : 10));
              setCollectedCount(prev => {
                const next = prev + 1;
                if (next % 5 === 0) {
                  // Unlock next milestone!
                  soundEngine.playCoin();
                  achievementSystem.recordCoinReward(10);
                  setActiveCheckpointIndex(c => (c + 1) % scheduleMilestones.length);
                }
                return next;
              });
            }
          }
        }

        // Ghost Movement
        if (timestamp - state.lastGhostMove > state.ghostSpeed) {
          state.lastGhostMove = timestamp;
          state.ghosts.forEach(g => {
            const dirs = [
              { dx: 0, dy: -1 },
              { dx: 0, dy: 1 },
              { dx: -1, dy: 0 },
              { dx: 1, dy: 0 }
            ];
            // Filter valid dirs
            const valid = dirs.filter(d => {
              const tx = (g.x + d.dx + 15) % 15;
              const ty = (g.y + d.dy + 15) % 15;
              return state.grid[ty] && state.grid[ty][tx] !== 1;
            });
            if (valid.length > 0) {
              // Prefer continuing current direction or choose random
              const choice = valid[Math.floor(Math.random() * valid.length)];
              g.x = (g.x + choice.dx + 15) % 15;
              g.y = (g.y + choice.dy + 15) % 15;
            }

            // Collision check
            if (g.x === p.x && g.y === p.y) {
              soundEngine.playExplosion();
              setLives(l => {
                const nl = l - 1;
                if (nl <= 0) setIsGameOver(true);
                return Math.max(0, nl);
              });
              // Reset Pacman spawn
              p.x = 7;
              p.y = 9;
              p.dirX = 0;
              p.dirY = 0;
            }
          });
        }
      }

      // RENDER
      ctx.fillStyle = '#060216';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Render Grid
      const state = gameState.current;
      for (let r = 0; r < 15; r++) {
        for (let c = 0; c < 15; c++) {
          const val = state.grid[r][c];
          const px = c * tileSize;
          const py = r * tileSize;

          if (val === 1) {
            // Neon blue wall
            ctx.fillStyle = '#1e1b4b';
            ctx.fillRect(px, py, tileSize, tileSize);
            ctx.strokeStyle = '#38bdf8';
            ctx.lineWidth = 1.5;
            ctx.strokeRect(px + 1, py + 1, tileSize - 2, tileSize - 2);
          } else if (val === 0) {
            // Yellow pellet
            ctx.fillStyle = '#fde047';
            ctx.beginPath();
            ctx.arc(px + tileSize / 2, py + tileSize / 2, 2.5, 0, Math.PI * 2);
            ctx.fill();
          } else if (val === 3) {
            // Power pellet
            ctx.fillStyle = '#f59e0b';
            ctx.beginPath();
            ctx.arc(px + tileSize / 2, py + tileSize / 2, 5, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }

      // Render Pacman
      const p = state.pacman;
      const pacPx = p.x * tileSize + tileSize / 2;
      const pacPy = p.y * tileSize + tileSize / 2;
      let angle = 0;
      if (p.dirX === 1) angle = 0;
      else if (p.dirX === -1) angle = Math.PI;
      else if (p.dirY === 1) angle = Math.PI * 0.5;
      else if (p.dirY === -1) angle = Math.PI * 1.5;

      ctx.fillStyle = '#facc15';
      ctx.beginPath();
      ctx.arc(pacPx, pacPy, 8, angle + p.mouth * Math.PI, angle + (2 - p.mouth) * Math.PI);
      ctx.lineTo(pacPx, pacPy);
      ctx.fill();

      // Render Ghosts
      state.ghosts.forEach(g => {
        const gx = g.x * tileSize + 2;
        const gy = g.y * tileSize + 2;
        ctx.fillStyle = g.color;
        // Ghost dome
        ctx.beginPath();
        ctx.arc(gx + 8, gy + 8, 7, Math.PI, 0, false);
        ctx.lineTo(gx + 15, gy + 15);
        ctx.lineTo(gx + 12, gy + 13);
        ctx.lineTo(gx + 8, gy + 15);
        ctx.lineTo(gx + 4, gy + 13);
        ctx.lineTo(gx + 1, gy + 15);
        ctx.closePath();
        ctx.fill();

        // Eyes
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(gx + 5, gy + 7, 2, 0, Math.PI * 2);
        ctx.arc(gx + 11, gy + 7, 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#0f172a';
        ctx.beginPath();
        ctx.arc(gx + 5, gy + 7, 1, 0, Math.PI * 2);
        ctx.arc(gx + 11, gy + 7, 1, 0, Math.PI * 2);
        ctx.fill();
      });

      animationId = requestAnimationFrame(gameLoop);
    };

    animationId = requestAnimationFrame(gameLoop);
    return () => cancelAnimationFrame(animationId);
  }, [isPaused, isGameOver]);

  const restartGame = () => {
    gameState.current.grid = MAZE_GRID.map(row => [...row]);
    gameState.current.pacman = { x: 7, y: 9, dirX: 0, dirY: 0, nextDirX: 0, nextDirY: 0, mouth: 0.2, mouthDir: 0.05 };
    setLives(3);
    setScore(1250);
    setIsGameOver(false);
  };

  return (
    <div className="relative w-full h-full flex flex-col justify-between p-2 sm:p-4 bg-gradient-to-b from-[#070314] to-[#04010a] text-white select-none overflow-y-auto">
      
      {/* Top Arcade HUD (Matching Reference 22.11.17.jpeg) */}
      <div className="flex items-center justify-between gap-2 px-3 py-1.5 rounded-xl bg-[#140828] border border-cyan-500/60 shadow-lg">
        <div className="flex items-center gap-2">
          <span className="font-mono text-[10px] text-cyan-300 font-bold">
            PLAYER 01
          </span>
          <span className="font-display text-xs text-yellow-300 font-black">
            STAGE 03 / 06
          </span>
        </div>

        <div className="flex items-center gap-4">
          <span className="font-mono text-xs font-black text-white tracking-widest">
            SCORE: <span className="text-pink-400">{score.toString().padStart(5, '0')}</span>
          </span>
          <div className="flex items-center gap-1 text-rose-500">
            {Array.from({ length: lives }).map((_, i) => (
              <Heart key={i} size={14} fill="#f43f5e" className="animate-pulse" />
            ))}
          </div>
        </div>
      </div>

      {/* Main Play Area: Maze on Left, Schedule Arcade Cabinet on Right */}
      <div className="flex-1 my-2 grid grid-cols-1 md:grid-cols-12 gap-3 items-center max-w-4xl mx-auto w-full">
        
        {/* Left Column: Playable Pac-Man Canvas & Mobile Touch D-Pad */}
        <div className="md:col-span-6 flex flex-col items-center">
          <div className="relative rounded-2xl border-4 border-cyan-500/80 p-1.5 bg-black shadow-[0_0_25px_rgba(6,182,212,0.4)]">
            <canvas 
              ref={canvasRef} 
              className="rounded-xl block"
              style={{ width: '280px', height: '280px', imageRendering: 'pixelated' }}
            />

            {/* Game Over Screen */}
            {isGameOver && (
              <div className="absolute inset-0 bg-black/85 backdrop-blur-sm rounded-xl flex flex-col items-center justify-center p-3 text-center">
                <span className="text-xl font-display font-black text-rose-500 mb-1">
                  GAME OVER
                </span>
                <p className="text-xs font-mono text-slate-300 mb-3">
                  Score: {score} • Pellets: {collectedCount}
                </p>
                <button
                  onClick={restartGame}
                  className="px-4 py-1.5 rounded-full bg-cyan-500 hover:bg-cyan-400 text-black font-display text-xs font-black uppercase cursor-pointer"
                >
                  INSERT COIN (RETRY)
                </button>
              </div>
            )}
          </div>

          {/* Touch D-Pad for Mobile Direction Control */}
          <div className="mt-2 grid grid-cols-3 gap-1 w-28">
            <div />
            <button
              onClick={() => setDirection(0, -1)}
              className="p-2 bg-purple-900 border border-purple-500 rounded text-cyan-300 active:bg-cyan-500 active:text-black font-bold text-xs"
            >
              ▲
            </button>
            <div />
            <button
              onClick={() => setDirection(-1, 0)}
              className="p-2 bg-purple-900 border border-purple-500 rounded text-cyan-300 active:bg-cyan-500 active:text-black font-bold text-xs"
            >
              ◀
            </button>
            <button
              onClick={() => setDirection(0, 1)}
              className="p-2 bg-purple-900 border border-purple-500 rounded text-cyan-300 active:bg-cyan-500 active:text-black font-bold text-xs"
            >
              ▼
            </button>
            <button
              onClick={() => setDirection(1, 0)}
              className="p-2 bg-purple-900 border border-purple-500 rounded text-cyan-300 active:bg-cyan-500 active:text-black font-bold text-xs"
            >
              ▶
            </button>
          </div>
        </div>

        {/* Right Column: Retro Pixel Fest Arcade Cabinet (Unlocked Schedule Checkpoint) */}
        <div className="md:col-span-6 flex flex-col justify-between rounded-2xl bg-gradient-to-b from-[#180a30] via-[#100624] to-[#0a0316] border-2 border-purple-500/80 p-3 sm:p-4 shadow-xl">
          
          {/* Arcade Cabinet CRT Header */}
          <div className="flex items-center justify-between border-b border-purple-800 pb-2 mb-2">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
              <span className="font-display text-xs font-black text-cyan-300 tracking-wider">
                PIXEL FEST SCHEDULE CHECKPOINT
              </span>
            </div>
            <span className="font-mono text-[10px] text-yellow-300 font-bold">
              DAY {currentMilestone.day || 1}
            </span>
          </div>

          {/* Schedule Milestone Details */}
          <div className="my-1">
            <span className="px-2 py-0.5 rounded bg-pink-950 border border-pink-400 text-pink-300 font-mono text-[9px] font-bold uppercase mb-1 inline-block">
              {currentMilestone.category || 'EVENT UNLOCKED'}
            </span>

            <h3 className="font-display text-sm sm:text-base font-black text-white tracking-wide mb-1">
              {currentMilestone.title}
            </h3>

            <p className="text-xs text-purple-200/90 leading-relaxed mb-3 line-clamp-3">
              {currentMilestone.desc}
            </p>

            <div className="space-y-1.5 text-xs font-mono text-slate-300">
              <div className="flex items-center gap-2">
                <Clock size={13} className="text-cyan-400 shrink-0" />
                <span>{currentMilestone.time}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin size={13} className="text-pink-400 shrink-0" />
                <span>{currentMilestone.venue}</span>
              </div>
            </div>
          </div>

          {/* Cycle through Milestones manually */}
          <div className="flex items-center justify-between pt-3 border-t border-purple-800/80 mt-2">
            <div className="flex items-center gap-1">
              <button
                onClick={() => {
                  soundEngine.playBlip();
                  setActiveCheckpointIndex(c => (c - 1 + scheduleMilestones.length) % scheduleMilestones.length);
                }}
                className="p-1 rounded bg-purple-900 hover:bg-purple-800 text-purple-200 border border-purple-500 cursor-pointer"
                title="Previous Milestone"
              >
                <ChevronLeft size={16} />
              </button>
              <span className="font-mono text-[10px] text-purple-300 px-1">
                {activeCheckpointIndex + 1} / {scheduleMilestones.length}
              </span>
              <button
                onClick={() => {
                  soundEngine.playBlip();
                  setActiveCheckpointIndex(c => (c + 1) % scheduleMilestones.length);
                }}
                className="p-1 rounded bg-purple-900 hover:bg-purple-800 text-purple-200 border border-purple-500 cursor-pointer"
                title="Next Milestone"
              >
                <ChevronRight size={16} />
              </button>
            </div>

            {currentMilestone.registrationLink && (
              <a
                href={currentMilestone.registrationLink}
                target="_blank"
                rel="noreferrer"
                className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-pink-500 to-rose-600 text-white font-display text-[10px] font-black tracking-wider uppercase border border-pink-300 hover:scale-105 active:scale-95 flex items-center gap-1"
              >
                <span>REGISTER [UNSTOP]</span>
                <ExternalLink size={10} />
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Mission Status Bar (Matching Reference 22.11.17.jpeg) */}
      <div className="flex items-center justify-between gap-2 px-3 py-1.5 rounded-xl bg-[#170a2c] border border-purple-600/60 shadow">
        <span className="font-mono text-[10px] text-purple-300 uppercase tracking-wider font-bold">
          MISSION 01: KNOW YOUR FESTIVAL • PELLETS: {collectedCount}
        </span>

        <button
          onClick={onAdvanceStage}
          className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-display text-xs font-black tracking-widest uppercase border border-cyan-300 hover:scale-105 active:scale-95 shadow cursor-pointer flex items-center gap-1.5"
        >
          <span>NEXT STAGE (FAQS)</span>
          <ArrowRight size={14} />
        </button>
      </div>
    </div>
  );
}
