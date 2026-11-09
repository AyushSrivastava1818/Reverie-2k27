import React, { useState, useEffect, useRef } from 'react';
import { Play, RotateCcw, Pause, Trophy, Coins, ArrowUp, Heart } from 'lucide-react';
import { soundEngine } from '../../game/systems/SoundEngine';
import { achievementSystem } from '../../game/systems/AchievementSystem';

export function PixelRunner() {
  const canvasRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [coinsEarned, setCoinsEarned] = useState(0);

  const stateRef = useRef({
    player: { x: 80, y: 220, width: 28, height: 36, vy: 0, isGrounded: true },
    obstacles: [],
    coins: [],
    particles: [],
    gameSpeed: 5,
    score: 0,
    coinsEarned: 0,
    lastObstacle: 0,
    lastCoin: 0,
    animationId: null
  });

  useEffect(() => {
    const saved = localStorage.getItem('reverie_runner_highscore');
    if (saved) setHighScore(parseInt(saved, 10) || 0);
  }, []);

  const jump = () => {
    const st = stateRef.current;
    if (st.player.isGrounded && isPlaying && !gameOver) {
      st.player.vy = -12;
      st.player.isGrounded = false;
      soundEngine.playJump();
    }
  };

  const startGame = () => {
    soundEngine.playBlip();
    const st = stateRef.current;
    st.player.y = 220;
    st.player.vy = 0;
    st.player.isGrounded = true;
    st.obstacles = [];
    st.coins = [];
    st.particles = [];
    st.gameSpeed = 5;
    st.score = 0;
    st.coinsEarned = 0;
    st.lastObstacle = Date.now();
    st.lastCoin = Date.now();

    setScore(0);
    setCoinsEarned(0);
    setGameOver(false);
    setIsPlaying(true);
  };

  useEffect(() => {
    if (!isPlaying || gameOver) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const st = stateRef.current;
    const groundY = 250;

    let lastTime = Date.now();

    const loop = () => {
      const now = Date.now();
      const dt = Math.min(32, now - lastTime);
      lastTime = now;

      // 1. UPDATE PLAYER PHYSICS
      st.player.vy += 0.65; // gravity
      st.player.y += st.player.vy;

      if (st.player.y >= groundY - st.player.height) {
        st.player.y = groundY - st.player.height;
        st.player.vy = 0;
        st.player.isGrounded = true;
      }

      // 2. SPEED & SCORE SCALING
      st.score += 1;
      setScore(st.score);
      st.gameSpeed = 5 + Math.min(6, Math.floor(st.score / 400));

      // 3. SPAWN OBSTACLES (Glitch Spikes / Drones)
      if (now - st.lastObstacle > (1400 - Math.min(500, st.score * 0.4))) {
        st.lastObstacle = now;
        const isDrone = Math.random() < 0.3;
        st.obstacles.push({
          x: canvas.width + 20,
          y: isDrone ? groundY - 60 : groundY - 32,
          width: isDrone ? 32 : 24,
          height: isDrone ? 20 : 32,
          type: isDrone ? 'drone' : 'spike'
        });
      }

      // 4. SPAWN COINS
      if (now - st.lastCoin > 1800) {
        st.lastCoin = now;
        st.coins.push({
          x: canvas.width + 20,
          y: groundY - 50 - Math.random() * 40,
          size: 14
        });
      }

      // 5. UPDATE OBSTACLES & COLLISION
      st.obstacles.forEach(obs => {
        obs.x -= st.gameSpeed;

        // Collision check
        const px = st.player.x;
        const py = st.player.y;
        if (
          px + 4 < obs.x + obs.width &&
          px + st.player.width - 4 > obs.x &&
          py + 4 < obs.y + obs.height &&
          py + st.player.height > obs.y
        ) {
          // HIT!
          soundEngine.playDefeat();
          setGameOver(true);
          setIsPlaying(false);

          // Update High Score
          if (st.score > highScore) {
            setHighScore(st.score);
            localStorage.setItem('reverie_runner_highscore', st.score.toString());
          }

          // Award coins collected
          if (st.coinsEarned > 0) {
            achievementSystem.addBonusCoins(st.coinsEarned);
          }
        }
      });
      st.obstacles = st.obstacles.filter(o => o.x > -50);

      // 6. UPDATE COINS & COLLECTION
      st.coins.forEach(c => {
        c.x -= st.gameSpeed;

        // Collect check
        const px = st.player.x;
        const py = st.player.y;
        if (
          px < c.x + c.size &&
          px + st.player.width > c.x &&
          py < c.y + c.size &&
          py + st.player.height > c.y
        ) {
          c.x = -999;
          soundEngine.playCoin();
          st.coinsEarned += 2;
          setCoinsEarned(st.coinsEarned);

          // Sparkle particles
          for (let i = 0; i < 6; i++) {
            st.particles.push({
              x: c.x,
              y: c.y,
              vx: (Math.random() - 0.5) * 4,
              vy: (Math.random() - 0.5) * 4,
              life: 15,
              color: '#fbbf24'
            });
          }
        }
      });
      st.coins = st.coins.filter(c => c.x > -30);

      // 7. PARTICLES
      st.particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.life -= 1;
      });
      st.particles = st.particles.filter(p => p.life > 0);

      // -----------------------------------------------------------
      // RENDER CANVAS
      // -----------------------------------------------------------
      ctx.fillStyle = '#0a0518';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Distant City Skyline
      ctx.fillStyle = '#170c36';
      for (let x = 0; x < canvas.width; x += 50) {
        const h = 40 + (Math.sin(x * 0.05) + 1) * 25;
        ctx.fillRect(x, groundY - h, 45, h);
      }

      // Ground Line
      ctx.fillStyle = '#2b1055';
      ctx.fillRect(0, groundY, canvas.width, canvas.height - groundY);
      ctx.fillStyle = '#a855f7';
      ctx.fillRect(0, groundY, canvas.width, 3);

      // Draw Coins
      st.coins.forEach(c => {
        ctx.fillStyle = '#fbbf24';
        ctx.shadowColor = '#fbbf24';
        ctx.shadowBlur = 6;
        ctx.fillRect(c.x, c.y, c.size, c.size);
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(c.x + 3, c.y + 3, 4, 4);
      });
      ctx.shadowBlur = 0;

      // Draw Obstacles
      st.obstacles.forEach(o => {
        if (o.type === 'spike') {
          ctx.fillStyle = '#ec4899';
          ctx.beginPath();
          ctx.moveTo(o.x, groundY);
          ctx.lineTo(o.x + o.width / 2, o.y);
          ctx.lineTo(o.x + o.width, groundY);
          ctx.closePath();
          ctx.fill();
        } else {
          // Drone
          ctx.fillStyle = '#06b6d4';
          ctx.fillRect(o.x, o.y, o.width, o.height);
          ctx.fillStyle = '#ef4444';
          ctx.fillRect(o.x + 8, o.y + 6, 6, 6);
        }
      });

      // Draw Particles
      st.particles.forEach(p => {
        ctx.fillStyle = p.color;
        ctx.fillRect(p.x, p.y, 3, 3);
      });

      // Draw Player Character (Pixel Runner)
      const px = st.player.x;
      const py = st.player.y;
      ctx.fillStyle = '#f43f5e';
      ctx.fillRect(px + 4, py, 20, 10); // Red cap
      ctx.fillStyle = '#fbcfe8';
      ctx.fillRect(px + 6, py + 10, 16, 8); // Face
      ctx.fillStyle = '#06b6d4';
      ctx.fillRect(px + 4, py + 18, 20, 10); // Cyan jacket
      ctx.fillStyle = '#3b82f6';
      ctx.fillRect(px + 6, py + 28, 6, 8); // Left leg
      ctx.fillRect(px + 16, py + 28, 6, 8); // Right leg

      st.animationId = requestAnimationFrame(loop);
    };

    st.animationId = requestAnimationFrame(loop);
    return () => {
      if (st.animationId) cancelAnimationFrame(st.animationId);
    };
  }, [isPlaying, gameOver, highScore]);

  // Handle jump keys
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === ' ' || e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') {
        e.preventDefault();
        jump();
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

        <div className="flex items-center gap-2 text-slate-300 font-mono">
          <Trophy size={14} className="text-yellow-400" />
          <span>BEST: {highScore}</span>
        </div>
      </div>

      {/* Canvas Viewport */}
      <div className="relative w-full flex-1 min-h-[300px] max-h-[360px] bg-[#070313] overflow-hidden flex items-center justify-center">
        <canvas
          ref={canvasRef}
          width={640}
          height={300}
          className="w-full h-full object-contain cursor-pointer"
          onClick={jump}
        />

        {/* Start Overlay */}
        {!isPlaying && !gameOver && (
          <div className="absolute inset-0 bg-black/85 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center z-10">
            <h3 className="font-display text-2xl sm:text-3xl font-black text-cyan-300 tracking-wider mb-2">
              PIXEL RUNNER 2K27
            </h3>
            <p className="font-body text-xs sm:text-sm text-slate-300 max-w-sm mb-6">
              Tap or press [SPACE / UP] to jump over cyber spikes & flying drones while gathering festival coins!
            </p>
            <button
              onClick={startGame}
              className="px-6 py-3 rounded-xl bg-pink-600 hover:bg-pink-500 font-display text-sm font-black uppercase tracking-wider flex items-center gap-2 shadow-xl shadow-pink-600/40 cursor-pointer"
            >
              <Play size={18} />
              <span>START SPRINT</span>
            </button>
          </div>
        )}

        {/* Game Over Overlay */}
        {gameOver && (
          <div className="absolute inset-0 bg-black/90 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center z-10 animate-fadeIn">
            <h3 className="font-display text-2xl sm:text-3xl font-black text-rose-500 tracking-wider mb-1">
              RUNNER CRASHED!
            </h3>
            <p className="font-body text-sm text-slate-300 mb-1">
              Distance: <strong className="text-yellow-400 font-display">{score}m</strong>
            </p>
            <p className="font-body text-xs text-yellow-300 mb-6">
              +{coinsEarned} Festival Coins added to your wallet!
            </p>
            <button
              onClick={startGame}
              className="px-6 py-3 rounded-xl bg-pink-600 hover:bg-pink-500 font-display text-sm font-black uppercase tracking-wider flex items-center gap-2 cursor-pointer"
            >
              <RotateCcw size={16} />
              <span>RUN AGAIN</span>
            </button>
          </div>
        )}
      </div>

      {/* Mobile Touch Jump Bar */}
      <div className="w-full p-3 bg-[#0f0724] border-t border-purple-800 flex justify-center">
        <button
          onTouchStart={(e) => { e.preventDefault(); jump(); }}
          onClick={jump}
          className="w-full max-w-md py-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 font-display text-sm font-black uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-cyan-600/30 cursor-pointer active:scale-95 select-none"
        >
          <ArrowUp size={18} />
          <span>TAP TO JUMP [SPACE]</span>
        </button>
      </div>
    </div>
  );
}

