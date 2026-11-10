import React, { useState, useEffect, useRef } from 'react';
import { soundEngine } from '../../game/systems/SoundEngine';

// Compact 15x15 classic Pacman grid
// 1: Wall, 0: Pellet, 3: Power Pellet, 2: Empty
const PACMAN_GRID = [
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

export function PacmanScheduleMaze({ onAdvanceStage, onClose, onBackToMap }) {
  const canvasRef = useRef(null);
  const [score, setScore] = useState(1250);
  const [collected, setCollected] = useState(0);

  const gameState = useRef({
    grid: PACMAN_GRID.map(row => [...row]),
    pacman: { x: 7, y: 9, dirX: 0, dirY: 0, nextDirX: 0, nextDirY: 0, mouth: 0.2, mouthDir: 0.05 },
    ghosts: [
      { x: 6, y: 6, color: '#ef4444', dirX: 1, dirY: 0 },
      { x: 7, y: 6, color: '#ec4899', dirX: -1, dirY: 0 },
      { x: 8, y: 6, color: '#06b6d4', dirX: 0, dirY: 1 },
      { x: 7, y: 7, color: '#f97316', dirX: 0, dirY: -1 }
    ],
    lastUpdate: 0
  });

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

  // Canvas loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationId;
    let lastMove = 0;
    let lastGhost = 0;

    const tileSize = 24; // 360x360
    canvas.width = 360;
    canvas.height = 360;

    const render = (time) => {
      const state = gameState.current;
      const p = state.pacman;

      // Pacman animation
      p.mouth += p.mouthDir;
      if (p.mouth > 0.4 || p.mouth < 0.05) p.mouthDir *= -1;

      // Pacman move every 200ms
      if (time - lastMove > 200) {
        lastMove = time;
        const nextX = (p.x + p.nextDirX + 15) % 15;
        const nextY = (p.y + p.nextDirY + 15) % 15;
        if (state.grid[nextY] && state.grid[nextY][nextX] !== 1) {
          p.dirX = p.nextDirX;
          p.dirY = p.nextDirY;
        }

        const tx = (p.x + p.dirX + 15) % 15;
        const ty = (p.y + p.dirY + 15) % 15;
        if (state.grid[ty] && state.grid[ty][tx] !== 1) {
          p.x = tx;
          p.y = ty;
          if (state.grid[p.y][p.x] === 0 || state.grid[p.y][p.x] === 3) {
            const isPower = state.grid[p.y][p.x] === 3;
            state.grid[p.y][p.x] = 2;
            soundEngine.playBlip();
            setScore(s => s + (isPower ? 50 : 10));
            setCollected(c => Math.min(5, c + 1));
          }
        }
      }

      // Ghosts move every 320ms
      if (time - lastGhost > 320) {
        lastGhost = time;
        state.ghosts.forEach(g => {
          const dirs = [{ dx: 0, dy: -1 }, { dx: 0, dy: 1 }, { dx: -1, dy: 0 }, { dx: 1, dy: 0 }];
          const valid = dirs.filter(d => {
            const gx = (g.x + d.dx + 15) % 15;
            const gy = (g.y + d.dy + 15) % 15;
            return state.grid[gy] && state.grid[gy][gx] !== 1;
          });
          if (valid.length > 0) {
            const choice = valid[Math.floor(Math.random() * valid.length)];
            g.x = (g.x + choice.dx + 15) % 15;
            g.y = (g.y + choice.dy + 15) % 15;
          }
        });
      }

      // DRAW MAZE
      ctx.fillStyle = '#03010b';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      for (let r = 0; r < 15; r++) {
        for (let c = 0; c < 15; c++) {
          const val = state.grid[r][c];
          const px = c * tileSize;
          const py = r * tileSize;

          if (val === 1) {
            ctx.fillStyle = '#0f172a';
            ctx.fillRect(px, py, tileSize, tileSize);
            ctx.strokeStyle = '#2563eb';
            ctx.lineWidth = 2.2;
            ctx.strokeRect(px + 1, py + 1, tileSize - 2, tileSize - 2);
          } else if (val === 0) {
            ctx.fillStyle = '#fde047';
            ctx.beginPath();
            ctx.arc(px + 12, py + 12, 3, 0, Math.PI * 2);
            ctx.fill();
          } else if (val === 3) {
            ctx.fillStyle = '#facc15';
            ctx.shadowColor = '#facc15';
            ctx.shadowBlur = 10;
            ctx.beginPath();
            ctx.arc(px + 12, py + 12, 6.5, 0, Math.PI * 2);
            ctx.fill();
            ctx.shadowBlur = 0;
          }
        }
      }

      // Cherry bonus in center
      ctx.font = '16px serif';
      ctx.fillText('🍒', 7 * tileSize + 2, 7 * tileSize + 18);

      // DRAW PACMAN
      const pacX = p.x * tileSize + 12;
      const pacY = p.y * tileSize + 12;
      let angle = 0;
      if (p.dirX === 1) angle = 0;
      else if (p.dirX === -1) angle = Math.PI;
      else if (p.dirY === 1) angle = Math.PI * 0.5;
      else if (p.dirY === -1) angle = Math.PI * 1.5;

      ctx.fillStyle = '#facc15';
      ctx.beginPath();
      ctx.arc(pacX, pacY, 10, angle + p.mouth * Math.PI, angle + (2 - p.mouth) * Math.PI);
      ctx.lineTo(pacX, pacY);
      ctx.fill();

      // DRAW GHOSTS
      state.ghosts.forEach(g => {
        const gx = g.x * tileSize + 2;
        const gy = g.y * tileSize + 2;
        ctx.fillStyle = g.color;
        ctx.beginPath();
        ctx.arc(gx + 10, gy + 10, 9, Math.PI, 0, false);
        ctx.lineTo(gx + 19, gy + 19);
        ctx.lineTo(gx + 15, gy + 16);
        ctx.lineTo(gx + 10, gy + 19);
        ctx.lineTo(gx + 5, gy + 16);
        ctx.lineTo(gx + 1, gy + 19);
        ctx.closePath();
        ctx.fill();

        // Eyes
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(gx + 7, gy + 9, 2.5, 0, Math.PI * 2);
        ctx.arc(gx + 14, gy + 9, 2.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#0f172a';
        ctx.beginPath();
        ctx.arc(gx + 7, gy + 9, 1.2, 0, Math.PI * 2);
        ctx.arc(gx + 14, gy + 9, 1.2, 0, Math.PI * 2);
        ctx.fill();
      });

      animationId = requestAnimationFrame(render);
    };

    animationId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animationId);
  }, []);

  return (
    <div className="relative w-full h-full flex flex-col justify-between p-3 sm:p-5 bg-gradient-to-b from-[#080214] via-[#0d0422] to-[#04010a] font-pixel text-white select-none overflow-y-auto border-4 border-yellow-400 rounded-3xl shadow-[0_0_40px_rgba(250,204,21,0.5)]">
      
      {/* ------------------------------------------------------------- */}
      {/* TOP HUD: PLAYER 01, HEARTS, SCORE, STAGE 01 / 06 (Ref: 22.11.17)*/}
      {/* ------------------------------------------------------------- */}
      <div className="flex items-center justify-between pb-3 border-b-2 border-purple-900/80 shrink-0">
        <div className="flex items-center gap-2">
          {onBackToMap && (
            <button
              onClick={onBackToMap}
              className="px-2.5 py-1 rounded bg-purple-950 border border-purple-400 text-yellow-300 text-[8px] sm:text-[9px] font-black cursor-pointer hover:bg-purple-900"
            >
              ← WORLD MAP
            </button>
          )}
          <span className="text-xl text-yellow-400">🟡</span>
          <span className="font-pixel text-xs sm:text-sm text-yellow-400 font-black tracking-wider">
            PLAYER 01
          </span>
          <div className="flex items-center gap-1 ml-2">
            <span className="text-red-500 text-xs sm:text-sm animate-pulse">❤️</span>
            <span className="text-red-500 text-xs sm:text-sm animate-pulse">❤️</span>
            <span className="text-red-500 text-xs sm:text-sm animate-pulse">❤️</span>
          </div>
        </div>

        <div className="flex items-center gap-4 sm:gap-6">
          <span className="font-pixel text-xs sm:text-sm text-yellow-300 font-black">
            SCORE: <span className="text-white">{score.toString().padStart(5, '0')}</span>
          </span>
          <span className="font-pixel text-xs sm:text-sm text-cyan-400 font-black">
            STAGE 01 / 06
          </span>
          <span className="text-xs sm:text-sm">🔊</span>
          {onClose && (
            <button
              onClick={onClose}
              className="px-2 py-0.5 rounded bg-red-600 hover:bg-red-500 text-white text-[9px] font-black cursor-pointer"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* MAIN VIEW: PLAYABLE MAZE (LEFT) & PIXEL FEST CARD (RIGHT)      */}
      {/* ------------------------------------------------------------- */}
      <div className="flex-1 my-auto grid grid-cols-1 md:grid-cols-12 gap-5 items-center max-w-5xl mx-auto w-full py-2">
        
        {/* Left Side: Playable Pac-Man Canvas in Neon Frame */}
        <div className="md:col-span-5 flex flex-col items-center justify-center">
          <div className="p-3 rounded-2xl bg-[#09031a] border-4 border-blue-500 shadow-[0_0_35px_rgba(37,99,235,0.8)] flex flex-col items-center">
            <canvas 
              ref={canvasRef} 
              className="rounded-xl block"
              style={{ width: '320px', height: '320px', imageRendering: 'pixelated' }}
            />
          </div>
          <span className="font-pixel text-[8px] sm:text-[9px] text-cyan-300 mt-2 uppercase tracking-widest animate-pulse">
            ★ USE ARROW KEYS OR WASD TO PLAY ★
          </span>
        </div>

        {/* Right Side: Pixel Fest Arcade Kiosk & Schedule (Ref: 22.11.17) */}
        <div className="md:col-span-7 flex flex-col justify-between p-5 sm:p-6 rounded-2xl bg-gradient-to-b from-[#180a36] via-[#100526] to-[#0a0218] border-3 border-purple-500 shadow-[0_0_30px_rgba(168,85,247,0.5)] relative overflow-hidden">
          
          {/* Full Moon & Castle silhouette in top right */}
          <div className="absolute top-4 right-6 w-16 h-16 rounded-full bg-slate-100/30 blur-[1px] pointer-events-none" />
          <div className="absolute top-8 right-4 text-4xl opacity-40 pointer-events-none">🏰</div>

          {/* Yellow Top Badge: WELCOME TO */}
          <div className="self-start px-3.5 py-1.5 rounded-md bg-yellow-400 border border-amber-600 shadow mb-2">
            <span className="font-pixel text-[10px] font-black text-black tracking-widest uppercase">
              WELCOME TO
            </span>
          </div>

          {/* Big 3D Pixel Headline: PIXEL FEST */}
          <h2 className="font-pixel text-3xl sm:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-pink-400 to-purple-400 tracking-wider drop-shadow-[0_2px_0_#000]">
            PIXEL FEST
          </h2>
          
          <span className="font-pixel text-xs sm:text-sm text-cyan-300 tracking-widest uppercase my-1 font-bold">
            PLAY • EXPLORE • CONNECT
          </span>

          <div className="flex items-start gap-4 my-2">
            {/* Illustrated Arcade Cabinet (Ref: 22.11.17.jpeg) */}
            <div className="w-20 sm:w-24 shrink-0 flex flex-col items-center">
              <svg width="84" height="110" viewBox="0 0 56 74" className="filter drop-shadow-[0_4px_10px_rgba(0,0,0,0.8)]">
                {/* Cabinet Hull */}
                <polygon points="12,8 44,8 46,68 10,68" fill="#1e1b4b" stroke="#3b82f6" strokeWidth="1.5" />
                {/* Marquee Header */}
                <rect x="13" y="9" width="30" height="9" fill="#0284c7" />
                <rect x="15" y="11" width="26" height="5" fill="#facc15" />
                <text x="28" y="15" fill="#000" fontSize="4.5" fontFamily="monospace" fontWeight="900" textAnchor="middle">REVERIE</text>
                {/* Angled CRT Screen Bezel */}
                <polygon points="14,20 42,20 40,42 16,42" fill="#030712" stroke="#06b6d4" strokeWidth="1" />
                {/* Glowing Screen Content */}
                <rect x="17" y="23" width="22" height="16" rx="2" fill="#082f49" />
                <text x="28" y="31" fill="#38bdf8" fontSize="5" fontFamily="monospace" fontWeight="900" textAnchor="middle">GAME</text>
                <text x="28" y="37" fill="#f43f5e" fontSize="5" fontFamily="monospace" fontWeight="900" textAnchor="middle">ON</text>
                {/* Control Panel Shelf with Joystick & Buttons */}
                <polygon points="10,44 46,44 48,52 8,52" fill="#334155" stroke="#475569" strokeWidth="1" />
                <circle cx="18" cy="48" r="2" fill="#ef4444" /> {/* Red Joystick */}
                <line x1="18" y1="48" x2="18" y2="51" stroke="#000" strokeWidth="1" />
                <circle cx="28" cy="47" r="1.2" fill="#38bdf8" />
                <circle cx="33" cy="47" r="1.2" fill="#facc15" />
                <circle cx="38" cy="47" r="1.2" fill="#22c55e" />
                {/* Coin Door with 25c slot */}
                <rect x="20" y="55" width="16" height="11" fill="#0f172a" stroke="#1e293b" />
                <line x1="25" y1="58" x2="25" y2="62" stroke="#facc15" strokeWidth="1" />
                <line x1="31" y1="58" x2="31" y2="62" stroke="#facc15" strokeWidth="1" />
              </svg>
            </div>

            {/* Description & Festival Info */}
            <div className="flex-1">
              <p className="text-xs sm:text-sm text-slate-200 font-sans font-semibold leading-relaxed mb-2">
                A grand celebration of technology, creativity and community. Get ready for an unforgettable retro gaming experience!
              </p>

              {/* Festival Schedule Metadata */}
              <div className="space-y-2 py-2 border-y border-purple-800/80 text-[10px] sm:text-xs font-pixel text-purple-200">
                <div className="flex items-center gap-2">
                  <span className="text-yellow-400 text-sm">📅</span>
                  <span>Date: 20-22 Feb, 2K27</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-pink-400 text-sm">📍</span>
                  <span>Venue: IIIT Kota Campus & Tech Arena</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-cyan-400 text-sm">⭐</span>
                  <span>Events: 18+ Premier Competitions & Pronites</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* BOTTOM BAR: MISSION 01 / COLLECT: 0/5 / NEXT STAGE ▶          */}
      {/* ------------------------------------------------------------- */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t-2 border-yellow-400/80 mt-2 shrink-0">
        
        {/* Mission 01 Info */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-yellow-500/20 border-2 border-yellow-400 flex items-center justify-center text-xl">
            🏆
          </div>
          <div>
            <span className="font-pixel text-[10px] sm:text-xs text-yellow-300 font-black block">
              MISSION 01: KNOW YOUR EVENT
            </span>
            <span className="font-sans text-[11px] text-slate-300 font-medium">
              Discover the story, purpose and highlights of Pixel Fest.
            </span>
          </div>
        </div>

        {/* Collect Counter & Next Stage Button */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 font-pixel text-[10px] sm:text-xs text-yellow-300">
            <span className="text-slate-400">COLLECT:</span>
            <span>🟡</span>
            <span className="text-white font-black">{collected} / 5</span>
          </div>

          <button
            onClick={onAdvanceStage}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-500 border-2 border-white text-black font-pixel text-xs font-black uppercase tracking-wider shadow-[0_4px_0_#78350f] hover:scale-105 active:translate-y-1 active:shadow-none cursor-pointer flex items-center gap-1.5"
          >
            <span>NEXT STAGE</span>
            <span>▶</span>
          </button>
        </div>
      </div>

      {/* Bottom Sub-Label */}
      <div className="text-center pt-1 text-[8px] sm:text-[9px] font-pixel text-cyan-400 animate-pulse">
        &gt;&gt; READY PLAYER 01? LET'S GO! &lt;&lt;
      </div>
    </div>
  );
}
