import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, Pause, RotateCcw, Volume2, VolumeX, Shield, Award, 
  ExternalLink, ChevronRight, Zap, Target, ArrowLeft, Heart, CheckCircle2 
} from 'lucide-react';
import { pastSponsors } from '../../data/sponsors';
import { soundEngine } from '../../game/systems/SoundEngine';
import { achievementSystem } from '../../game/systems/AchievementSystem';
import confetti from 'canvas-confetti';

export function SponsorGalaxy({ onSkipToDirectory, onSelectSponsor }) {
  const canvasRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [score, setScore] = useState(0);
  const [health, setHealth] = useState(3);
  const [level, setLevel] = useState(1);
  const [gameOver, setGameOver] = useState(false);
  const [victory, setVictory] = useState(false);
  const [unlockedSponsors, setUnlockedSponsors] = useState([]);
  const [recentUnlock, setRecentUnlock] = useState(null);
  const [activeProfile, setActiveProfile] = useState(null);

  // References for mutable animation state
  const stateRef = useRef({
    player: { x: 300, y: 380, width: 44, height: 34, speed: 7 },
    keys: { left: false, right: false, fire: false },
    lasers: [],
    targets: [],
    powerups: [],
    particles: [],
    stars: [],
    lastSpawn: 0,
    spawnInterval: 1800,
    tripleShotUntil: 0,
    sponsorIndex: 0,
    animationId: null,
    score: 0,
    health: 3,
    level: 1,
    unlockedNames: new Set()
  });

  // Pre-load sponsor images into image elements for smooth canvas blitting
  const sponsorImagesRef = useRef({});
  useEffect(() => {
    pastSponsors.forEach(s => {
      const img = new Image();
      img.src = s.logo;
      sponsorImagesRef.current[s.name] = img;
    });
  }, []);

  // Initialize stars once
  useEffect(() => {
    const stars = [];
    for (let i = 0; i < 90; i++) {
      stars.push({
        x: Math.random() * 800,
        y: Math.random() * 500,
        size: Math.random() < 0.3 ? 2 : 1,
        speed: 0.5 + Math.random() * 1.5,
        color: Math.random() < 0.2 ? '#ec4899' : Math.random() < 0.4 ? '#06b6d4' : '#ffffff'
      });
    }
    stateRef.current.stars = stars;
  }, []);

  const startGame = () => {
    soundEngine.playBlip();
    const st = stateRef.current;
    st.player.x = 350;
    st.lasers = [];
    st.targets = [];
    st.powerups = [];
    st.particles = [];
    st.score = 0;
    st.health = 3;
    st.level = 1;
    st.sponsorIndex = 0;
    st.tripleShotUntil = 0;
    st.lastSpawn = Date.now();
    st.unlockedNames = new Set(unlockedSponsors.map(s => s.name));

    setScore(0);
    setHealth(3);
    setLevel(1);
    setGameOver(false);
    setVictory(false);
    setIsPaused(false);
    setIsPlaying(true);
  };

  const fireLaser = () => {
    const st = stateRef.current;
    if (st.health <= 0) return;
    soundEngine.playLaser();
    const now = Date.now();
    const isTriple = now < st.tripleShotUntil;

    if (isTriple) {
      st.lasers.push(
        { x: st.player.x + 8, y: st.player.y - 6, vx: -1.5, vy: -9, color: '#ec4899' },
        { x: st.player.x + 22, y: st.player.y - 10, vx: 0, vy: -10, color: '#06b6d4' },
        { x: st.player.x + 36, y: st.player.y - 6, vx: 1.5, vy: -9, color: '#ec4899' }
      );
    } else {
      st.lasers.push(
        { x: st.player.x + 12, y: st.player.y - 8, vx: 0, vy: -9, color: '#06b6d4' },
        { x: st.player.x + 32, y: st.player.y - 8, vx: 0, vy: -9, color: '#06b6d4' }
      );
    }
  };

  // Main canvas loop
  useEffect(() => {
    if (!isPlaying || isPaused) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const st = stateRef.current;

    let lastTime = Date.now();

    const loop = () => {
      const now = Date.now();
      const dt = Math.min(32, now - lastTime);
      lastTime = now;

      // 1. UPDATE STARS
      st.stars.forEach(s => {
        s.y += s.speed * (st.level === 1 ? 1 : st.level === 2 ? 1.4 : 1.8);
        if (s.y > canvas.height) {
          s.y = 0;
          s.x = Math.random() * canvas.width;
        }
      });

      // 2. PLAYER MOVEMENT
      if (st.keys.left) st.player.x -= st.player.speed;
      if (st.keys.right) st.player.x += st.player.speed;
      st.player.x = Math.max(10, Math.min(canvas.width - st.player.width - 10, st.player.x));

      // 3. SPAWN SPONSOR TARGETS
      if (now - st.lastSpawn > (st.spawnInterval - (st.level - 1) * 300) && st.targets.length < 5) {
        st.lastSpawn = now;
        const availableSponsors = pastSponsors;
        const chosen = availableSponsors[st.sponsorIndex % availableSponsors.length];
        st.sponsorIndex++;

        st.targets.push({
          id: Math.random().toString(),
          sponsor: chosen,
          x: 40 + Math.random() * (canvas.width - 140),
          y: -50,
          width: 80,
          height: 48,
          speed: 1.1 + (st.level * 0.4) + Math.random() * 0.5,
          hp: 2,
          maxHp: 2,
          bobOffset: Math.random() * Math.PI * 2
        });
      }

      // 4. UPDATE LASERS
      st.lasers.forEach(l => {
        l.x += l.vx;
        l.y += l.vy;
      });
      st.lasers = st.lasers.filter(l => l.y > -20 && l.x > 0 && l.x < canvas.width);

      // 5. UPDATE TARGETS & COLLISIONS
      st.targets.forEach(t => {
        t.y += t.speed;
        t.x += Math.sin(now * 0.003 + t.bobOffset) * 0.8;

        // Check laser collision
        st.lasers.forEach(l => {
          if (
            l.x > t.x && l.x < t.x + t.width &&
            l.y > t.y && l.y < t.y + t.height
          ) {
            l.y = -999; // destroy laser
            t.hp -= 1;
            soundEngine.playHit();

            // Spawn hit sparks
            for (let i = 0; i < 4; i++) {
              st.particles.push({
                x: l.x,
                y: l.y,
                vx: (Math.random() - 0.5) * 4,
                vy: (Math.random() - 0.5) * 4,
                color: '#fbbf24',
                life: 18
              });
            }

            if (t.hp <= 0) {
              soundEngine.playExplosion();
              st.score += 150;
              setScore(st.score);

              // Unlocked sponsor processing
              if (!st.unlockedNames.has(t.sponsor.name)) {
                st.unlockedNames.add(t.sponsor.name);
                setUnlockedSponsors(prev => {
                  if (prev.some(p => p.name === t.sponsor.name)) return prev;
                  return [...prev, t.sponsor];
                });
                setRecentUnlock(t.sponsor);
                setTimeout(() => setRecentUnlock(null), 3500);

                // Add 5 bonus coins to player's festival wallet for unlocking a sponsor!
                achievementSystem.addBonusCoins(5);
              }

              // Check victory condition (10+ sponsors unlocked)
              if (st.unlockedNames.size >= pastSponsors.length) {
                setVictory(true);
                setIsPlaying(false);
                soundEngine.playFanfare();
                achievementSystem.addBonusCoins(50);
                try {
                  confetti({ particleCount: 70, spread: 80, origin: { y: 0.4 } });
                } catch(e) {}
              }

              // Spawn powerup chance (30%)
              if (Math.random() < 0.35) {
                const type = Math.random() < 0.5 ? 'triple' : Math.random() < 0.8 ? 'coin' : 'heal';
                st.powerups.push({
                  x: t.x + t.width / 2,
                  y: t.y + t.height / 2,
                  type,
                  vy: 1.8
                });
              }

              // Big explosion particles
              for (let i = 0; i < 18; i++) {
                st.particles.push({
                  x: t.x + t.width / 2,
                  y: t.y + t.height / 2,
                  vx: (Math.random() - 0.5) * 7,
                  vy: (Math.random() - 0.5) * 7,
                  color: i % 2 === 0 ? '#ec4899' : '#06b6d4',
                  life: 28
                });
              }
            }
          }
        });

        // Check collision with player
        if (
          t.hp > 0 &&
          t.x < st.player.x + st.player.width &&
          t.x + t.width > st.player.x &&
          t.y < st.player.y + st.player.height &&
          t.y + t.height > st.player.y
        ) {
          t.hp = 0;
          st.health = Math.max(0, st.health - 1);
          setHealth(st.health);
          soundEngine.playHit();

          if (st.health <= 0) {
            soundEngine.playDefeat();
            setGameOver(true);
            setIsPlaying(false);
          }
        }
      });

      // Filter dead targets or targets off-screen
      st.targets = st.targets.filter(t => {
        if (t.hp <= 0) return false;
        if (t.y > canvas.height + 40) {
          return false;
        }
        return true;
      });

      // 6. UPDATE POWERUPS
      st.powerups.forEach(p => {
        p.y += p.vy;
        if (
          p.x > st.player.x - 10 && p.x < st.player.x + st.player.width + 10 &&
          p.y > st.player.y - 10 && p.y < st.player.y + st.player.height + 10
        ) {
          p.y = 9999;
          soundEngine.playPowerup();
          if (p.type === 'triple') {
            st.tripleShotUntil = Date.now() + 8000;
          } else if (p.type === 'heal') {
            st.health = Math.min(3, st.health + 1);
            setHealth(st.health);
          } else if (p.type === 'coin') {
            st.score += 200;
            setScore(st.score);
            achievementSystem.addBonusCoins(5);
          }
        }
      });
      st.powerups = st.powerups.filter(p => p.y < canvas.height + 30);

      // 7. PARTICLES
      st.particles.forEach(pt => {
        pt.x += pt.vx;
        pt.y += pt.vy;
        pt.life -= 1;
      });
      st.particles = st.particles.filter(pt => pt.life > 0);

      // Level progression check
      if (st.score > 1200 && st.level === 1) {
        st.level = 2;
        setLevel(2);
        soundEngine.playFanfare();
      } else if (st.score > 2800 && st.level === 2) {
        st.level = 3;
        setLevel(3);
        soundEngine.playFanfare();
      }

      // -------------------------------------------------------------
      // DRAW CANVAS FRAME
      // -------------------------------------------------------------
      ctx.fillStyle = '#060312';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw subtle grid lines
      ctx.strokeStyle = 'rgba(139, 92, 246, 0.08)';
      ctx.lineWidth = 1;
      for (let x = 0; x < canvas.width; x += 40) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }

      // Draw Stars
      st.stars.forEach(s => {
        ctx.fillStyle = s.color;
        ctx.fillRect(s.x, s.y, s.size, s.size);
      });

      // Draw Lasers
      st.lasers.forEach(l => {
        ctx.fillStyle = l.color;
        ctx.shadowColor = l.color;
        ctx.shadowBlur = 8;
        ctx.fillRect(l.x, l.y, 4, 12);
      });
      ctx.shadowBlur = 0;

      // Draw Targets (Sponsor Ships)
      st.targets.forEach(t => {
        // Border & Background
        ctx.fillStyle = '#130a2a';
        ctx.fillRect(t.x, t.y, t.width, t.height);

        ctx.strokeStyle = t.hp < t.maxHp ? '#ef4444' : '#06b6d4';
        ctx.lineWidth = 2;
        ctx.strokeRect(t.x, t.y, t.width, t.height);

        // Sponsor Name Tag
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 10px monospace';
        ctx.textAlign = 'center';
        ctx.fillText(t.sponsor.name.slice(0, 11), t.x + t.width / 2, t.y + 18);

        // Sponsor Tier Subtitle
        ctx.fillStyle = '#fbbf24';
        ctx.font = '8px monospace';
        ctx.fillText(t.sponsor.tier.slice(0, 14), t.x + t.width / 2, t.y + 30);

        // Mini HP Bar
        ctx.fillStyle = '#374151';
        ctx.fillRect(t.x + 8, t.y + 36, t.width - 16, 4);
        ctx.fillStyle = '#10b981';
        ctx.fillRect(t.x + 8, t.y + 36, (t.width - 16) * (t.hp / t.maxHp), 4);
      });

      // Draw Powerups
      st.powerups.forEach(p => {
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.fillStyle = p.type === 'triple' ? '#ec4899' : p.type === 'heal' ? '#10b981' : '#fbbf24';
        ctx.fillRect(-8, -8, 16, 16);
        ctx.fillStyle = '#000000';
        ctx.font = 'bold 9px monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(p.type === 'triple' ? '3X' : p.type === 'heal' ? '+HP' : '$$', 0, 0);
        ctx.restore();
      });

      // Draw Particles
      st.particles.forEach(pt => {
        ctx.fillStyle = pt.color;
        ctx.fillRect(pt.x, pt.y, 3, 3);
      });

      // Draw Player Fighter Ship
      const px = st.player.x;
      const py = st.player.y;

      // Glow engine trail
      ctx.fillStyle = '#ec4899';
      ctx.fillRect(px + 18, py + 30, 8, 6 + Math.random() * 8);

      // Ship fuselage (pixel art style)
      ctx.fillStyle = '#06b6d4';
      ctx.fillRect(px + 18, py, 8, 28); // center hull
      ctx.fillStyle = '#8b5cf6';
      ctx.fillRect(px + 8, py + 12, 10, 16); // left wing
      ctx.fillRect(px + 26, py + 12, 10, 16); // right wing
      ctx.fillStyle = '#f43f5e';
      ctx.fillRect(px + 2, py + 20, 6, 8); // left cannon
      ctx.fillRect(px + 36, py + 20, 6, 8); // right cannon
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(px + 20, py + 4, 4, 8); // cockpit

      st.animationId = requestAnimationFrame(loop);
    };

    st.animationId = requestAnimationFrame(loop);

    return () => {
      if (st.animationId) cancelAnimationFrame(st.animationId);
    };
  }, [isPlaying, isPaused, unlockedSponsors]);

  // Key listeners
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isPlaying) return;
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        stateRef.current.keys.left = true;
      }
      if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        stateRef.current.keys.right = true;
      }
      if (e.key === ' ' || e.key === 'Spacebar') {
        e.preventDefault();
        fireLaser();
      }
      if (e.key === 'p' || e.key === 'P') {
        setIsPaused(prev => !prev);
      }
    };

    const handleKeyUp = (e) => {
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        stateRef.current.keys.left = false;
      }
      if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        stateRef.current.keys.right = false;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [isPlaying]);

  return (
    <div className="flex flex-col h-full w-full bg-[#070414] text-white">
      {/* ------------------------------------------------------------- */}
      {/* RETRO ARCADE TOP HEADER & HUD                                 */}
      {/* ------------------------------------------------------------- */}
      <div className="p-3 sm:p-4 bg-[#110727] border-b-2 border-purple-600/50 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-purple-950 border border-purple-500/60">
            <Target size={20} className="text-cyan-400" />
          </div>
          <div>
            <h2 className="font-display text-base sm:text-lg font-black text-cyan-300 uppercase tracking-wider flex items-center gap-2">
              SPONSOR GALAXY 2K27
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-pink-950 border border-pink-500/60 text-pink-300">
                90s SHOOTER
              </span>
            </h2>
            <p className="font-body text-xs text-slate-300">
              Blast celestial sponsor probes to reveal authentic festival partners.
            </p>
          </div>
        </div>

        {/* HUD METRICS & ACTION BUTTONS */}
        <div className="flex items-center gap-2 sm:gap-4">
          <div className="px-3 py-1.5 rounded-xl bg-[#190d3a] border border-yellow-500/40 flex items-center gap-2">
            <span className="text-[10px] font-display font-black text-yellow-400">SCORE</span>
            <span className="font-display text-sm font-bold text-white tracking-widest">{score}</span>
          </div>

          <div className="px-3 py-1.5 rounded-xl bg-[#190d3a] border border-cyan-500/40 flex items-center gap-2">
            <span className="text-[10px] font-display font-black text-cyan-400">UNLOCKED</span>
            <span className="font-display text-sm font-bold text-white tracking-widest">
              {unlockedSponsors.length}/{pastSponsors.length}
            </span>
          </div>

          <div className="flex items-center gap-1">
            {[1, 2, 3].map(h => (
              <Heart 
                key={h} 
                size={18} 
                className={h <= health ? 'text-rose-500 fill-rose-500 animate-pulse' : 'text-slate-600'} 
              />
            ))}
          </div>

          {/* CRITICAL USER FREEDOM: Skip to Directory */}
          <button
            onClick={() => {
              soundEngine.playBlip();
              onSkipToDirectory();
            }}
            className="px-3 sm:px-4 py-2 rounded-xl bg-emerald-950 hover:bg-emerald-900 border border-emerald-500/80 text-emerald-300 hover:text-white font-display text-xs font-black uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-md shadow-emerald-950/40 cursor-pointer"
          >
            <span>VIEW ALL SPONSORS</span>
            <ChevronRight size={14} />
          </button>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* MAIN GAME CANVAS & OVERLAYS                                   */}
      {/* ------------------------------------------------------------- */}
      <div className="relative flex-1 min-h-[360px] max-h-[460px] sm:max-h-[500px] w-full bg-[#060312] overflow-hidden flex items-center justify-center">
        <canvas
          ref={canvasRef}
          width={760}
          height={460}
          className="w-full h-full object-contain cursor-crosshair"
        />

        {/* START SCREEN OVERLAY */}
        {!isPlaying && !gameOver && !victory && (
          <div className="absolute inset-0 bg-[#070414]/90 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center z-20">
            <div className="w-16 h-16 rounded-2xl bg-cyan-950/80 border-2 border-cyan-400 flex items-center justify-center mb-4 shadow-xl shadow-cyan-500/20">
              <Zap size={32} className="text-cyan-300 animate-pulse" />
            </div>

            <h3 className="font-display text-2xl sm:text-3xl font-black text-white tracking-wider mb-2">
              DEFEND THE SPONSOR GALAXY
            </h3>

            <p className="font-body text-xs sm:text-sm text-slate-300 max-w-md mb-6 leading-relaxed">
              Pilot your pixel interceptor across deep space. Shoot down orbiting sponsor carrier ships to unlock their authentic festival deliverables and earn +5 bonus coins each!
            </p>

            <div className="flex flex-wrap items-center justify-center gap-3">
              <button
                onClick={startGame}
                className="px-6 py-3 rounded-xl bg-pink-600 hover:bg-pink-500 text-white font-display text-sm font-black uppercase tracking-wider flex items-center gap-2 shadow-xl shadow-pink-600/40 transition-all hover:scale-105 cursor-pointer"
              >
                <Play size={18} />
                <span>LAUNCH MISSION [SPACE]</span>
              </button>

              <button
                onClick={onSkipToDirectory}
                className="px-5 py-3 rounded-xl bg-purple-950/80 hover:bg-purple-900 border border-purple-500 text-purple-200 hover:text-white font-display text-sm font-bold uppercase tracking-wider transition-all"
              >
                SKIP GAME & BROWSE
              </button>
            </div>

            <div className="mt-6 flex items-center gap-4 text-xs font-mono text-slate-400">
              <span>[← / → / A / D] MOVE SHIP</span>
              <span>•</span>
              <span>[SPACEBAR] FIRE LASER</span>
              <span>•</span>
              <span>[P] PAUSE</span>
            </div>
          </div>
        )}

        {/* PAUSE OVERLAY */}
        {isPlaying && isPaused && (
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center z-20">
            <h3 className="font-display text-2xl font-black text-yellow-400 tracking-wider mb-4">
              MISSION PAUSED
            </h3>
            <div className="flex gap-3">
              <button
                onClick={() => setIsPaused(false)}
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-display text-xs font-black uppercase"
              >
                RESUME
              </button>
              <button
                onClick={startGame}
                className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-display text-xs font-bold uppercase"
              >
                RESTART
              </button>
            </div>
          </div>
        )}

        {/* GAME OVER OVERLAY */}
        {gameOver && (
          <div className="absolute inset-0 bg-black/90 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center z-20 animate-fadeIn">
            <h3 className="font-display text-3xl font-black text-rose-500 tracking-wider mb-2">
              HULL BREACH — MISSION FAILED
            </h3>
            <p className="font-body text-sm text-slate-300 mb-2">
              Final Score: <strong className="text-yellow-400 font-display">{score}</strong> • Sponsors Discovered: <strong className="text-cyan-400 font-display">{unlockedSponsors.length}</strong>
            </p>
            <p className="font-body text-xs text-slate-400 mb-6">
              All discovered sponsors remain permanently unlocked in your roster below!
            </p>

            <div className="flex gap-3">
              <button
                onClick={startGame}
                className="px-6 py-3 rounded-xl bg-pink-600 hover:bg-pink-500 text-white font-display text-xs font-black uppercase tracking-wider flex items-center gap-2 cursor-pointer"
              >
                <RotateCcw size={16} />
                <span>RETRY FLIGHT</span>
              </button>

              <button
                onClick={onSkipToDirectory}
                className="px-6 py-3 rounded-xl bg-emerald-950 hover:bg-emerald-900 border border-emerald-500 text-emerald-300 font-display text-xs font-bold uppercase"
              >
                VIEW SPONSOR DIRECTORY
              </button>
            </div>
          </div>
        )}

        {/* VICTORY OVERLAY */}
        {victory && (
          <div className="absolute inset-0 bg-purple-950/95 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center z-20 animate-fadeIn">
            <div className="w-16 h-16 rounded-full bg-yellow-400/20 border-2 border-yellow-400 flex items-center justify-center mb-4">
              <Award size={36} className="text-yellow-400 animate-bounce" />
            </div>

            <h3 className="font-display text-3xl font-black text-yellow-300 tracking-wider mb-2">
              GALAXY LIBERATED — ALL SPONSORS DISCOVERED!
            </h3>
            <p className="font-body text-sm text-slate-200 mb-2 max-w-md">
              Spectacular ace flying! You unlocked every brand partner in the festival constellation and earned <strong className="text-yellow-400 font-display">+50 BONUS FESTIVAL COINS</strong>!
            </p>

            <div className="flex gap-3 mt-4">
              <button
                onClick={onSkipToDirectory}
                className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-display text-xs font-black uppercase tracking-wider"
              >
                EXPLORE OFFICIAL PERKS MATRIX
              </button>

              <button
                onClick={startGame}
                className="px-5 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 font-display text-xs font-bold uppercase"
              >
                PLAY AGAIN
              </button>
            </div>
          </div>
        )}

        {/* LIVE UNLOCK POPUP BANNER */}
        {recentUnlock && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 px-4 py-2 bg-emerald-950/90 border border-emerald-400 rounded-xl flex items-center gap-2.5 text-xs text-white shadow-xl z-30 animate-bounce">
            <CheckCircle2 size={16} className="text-emerald-400" />
            <span>
              UNLOCKED: <strong className="font-display text-yellow-300">{recentUnlock.name}</strong> ({recentUnlock.tier}) (+5 Coins!)
            </span>
          </div>
        )}
      </div>

      {/* ------------------------------------------------------------- */}
      {/* MOBILE CONTROLS BAR (When playing on touch devices)           */}
      {/* ------------------------------------------------------------- */}
      {isPlaying && (
        <div className="sm:hidden p-3 bg-[#0d0722] border-t border-purple-900/60 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              onTouchStart={() => { stateRef.current.keys.left = true; }}
              onTouchEnd={() => { stateRef.current.keys.left = false; }}
              onMouseDown={() => { stateRef.current.keys.left = true; }}
              onMouseUp={() => { stateRef.current.keys.left = false; }}
              className="w-14 h-12 rounded-xl bg-purple-900 border-2 border-purple-500 text-white font-display font-black text-lg active:scale-95 flex items-center justify-center select-none"
            >
              ◀
            </button>
            <button
              onTouchStart={() => { stateRef.current.keys.right = true; }}
              onTouchEnd={() => { stateRef.current.keys.right = false; }}
              onMouseDown={() => { stateRef.current.keys.right = true; }}
              onMouseUp={() => { stateRef.current.keys.right = false; }}
              className="w-14 h-12 rounded-xl bg-purple-900 border-2 border-purple-500 text-white font-display font-black text-lg active:scale-95 flex items-center justify-center select-none"
            >
              ▶
            </button>
          </div>

          <button
            onTouchStart={(e) => { e.preventDefault(); fireLaser(); }}
            onClick={fireLaser}
            className="flex-1 h-12 rounded-xl bg-pink-600 border-2 border-pink-400 text-white font-display font-black text-sm uppercase tracking-wider active:scale-95 flex items-center justify-center gap-2 shadow-lg shadow-pink-600/30 select-none"
          >
            <Zap size={18} />
            <span>FIRE LASER</span>
          </button>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* UNLOCKED SPONSOR ROSTER (Clickable Profiles)                  */}
      {/* ------------------------------------------------------------- */}
      <div className="p-4 bg-[#0d0722] border-t border-purple-900/50 flex flex-col gap-2.5">
        <div className="flex items-center justify-between">
          <div className="font-display text-xs text-yellow-400 font-black uppercase tracking-wider flex items-center gap-2">
            <span>UNLOCKED SPONSOR DATABASE ({unlockedSponsors.length} / {pastSponsors.length})</span>
            {unlockedSponsors.length === 0 && (
              <span className="text-[11px] text-slate-400 font-normal">
                (Play game or shoot probes to reveal)
              </span>
            )}
          </div>

          <button
            onClick={onSkipToDirectory}
            className="text-xs text-emerald-400 hover:text-emerald-300 font-body font-bold underline cursor-pointer"
          >
            Open Full Deliverables Matrix
          </button>
        </div>

        {/* Sponsor Badges Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-7 gap-2.5 max-h-36 overflow-y-auto pr-1">
          {pastSponsors.map(sponsor => {
            const isUnlocked = unlockedSponsors.some(s => s.name === sponsor.name);
            return (
              <button
                key={sponsor.name}
                onClick={() => {
                  soundEngine.playBlip();
                  if (onSelectSponsor) onSelectSponsor(sponsor);
                  setActiveProfile(sponsor);
                }}
                className={`p-2.5 rounded-xl border text-left flex flex-col items-center justify-center gap-1.5 transition-all ${
                  isUnlocked 
                    ? 'bg-[#180e36] border-emerald-500/70 hover:scale-105 hover:border-emerald-400 shadow-md shadow-emerald-950/40 cursor-pointer' 
                    : 'bg-[#110926]/60 border-purple-950 text-slate-500 opacity-60'
                }`}
              >
                <div className="w-10 h-10 rounded-lg bg-slate-900/90 border border-slate-700 p-1 flex items-center justify-center overflow-hidden">
                  <img
                    src={sponsor.logo}
                    alt={sponsor.name}
                    className={`max-w-full max-h-full object-contain ${!isUnlocked && 'grayscale'}`}
                  />
                </div>
                <span className="font-display text-[11px] font-bold text-center line-clamp-1 text-slate-200">
                  {sponsor.name}
                </span>
                <span className="font-body text-[9px] text-center line-clamp-1 text-yellow-400/90 font-semibold">
                  {sponsor.tier}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* POPUP DETAIL DIALOG FOR SELECTED SPONSOR */}
      {activeProfile && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#12082b] border-2 border-emerald-500 rounded-2xl p-6 max-w-md w-full shadow-2xl relative animate-scaleUp">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 rounded-xl bg-white p-2 flex items-center justify-center shrink-0">
                <img src={activeProfile.logo} alt={activeProfile.name} className="max-w-full max-h-full object-contain" />
              </div>
              <div>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-950 border border-emerald-500 text-emerald-300 font-display text-[10px] font-bold uppercase">
                  {activeProfile.tier}
                </span>
                <h3 className="font-display text-xl font-black text-white mt-1">
                  {activeProfile.name}
                </h3>
              </div>
            </div>

            <p className="font-body text-sm text-slate-200 mb-6 leading-relaxed">
              Official past collaborator with REVÉRIE IIIT Kota. Partnered across flagship tech tracks, workshops, speaker summits, and developer ecosystem incentives.
            </p>

            <div className="flex justify-end gap-2.5">
              <button
                onClick={() => setActiveProfile(null)}
                className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-display text-xs font-bold"
              >
                CLOSE
              </button>
              <button
                onClick={() => {
                  setActiveProfile(null);
                  onSkipToDirectory();
                }}
                className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-display text-xs font-black"
              >
                VIEW PERKS
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

