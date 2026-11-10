import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, Pause, RotateCcw, Award, ExternalLink, ChevronRight, 
  Zap, Target, Heart, CheckCircle2, X, Eye, Gift, Coins
} from 'lucide-react';
import { pastSponsors } from '../../data/sponsors';
import { soundEngine } from '../../game/systems/SoundEngine';
import { achievementSystem } from '../../game/systems/AchievementSystem';
import confetti from 'canvas-confetti';

export function SponsorGalaxy({ onSkipToDirectory, onOpenRewards, onSelectSponsor, onClose }) {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);

  // Game state
  const [isPlaying, setIsPlaying] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const [score, setScore] = useState(0);
  const [health, setHealth] = useState(3);
  const [level, setLevel] = useState(1);
  const [gameOver, setGameOver] = useState(false);
  const [victory, setVictory] = useState(false);
  const [unlockedSponsors, setUnlockedSponsors] = useState([]);
  const [activeSponsorPopup, setActiveSponsorPopup] = useState(null);
  const [showRosterDrawer, setShowRosterDrawer] = useState(false);

  // Mutable game physics & entity state
  const stateRef = useRef({
    player: { x: 380, y: 460, width: 48, height: 40, speed: 8 },
    keys: { left: false, right: false, fire: false },
    lasers: [],
    targets: [],
    powerups: [],
    particles: [],
    stars: [],
    planets: [],
    debris: [],
    lastSpawn: 0,
    spawnInterval: 1400,
    tripleShotUntil: 0,
    sponsorIndex: 0,
    animationId: null,
    score: 0,
    health: 3,
    level: 1,
    unlockedNames: new Set(),
    canvasWidth: 800,
    canvasHeight: 520
  });

  // Pre-load sponsor images
  const sponsorImagesRef = useRef({});
  useEffect(() => {
    pastSponsors.forEach(s => {
      const img = new Image();
      img.src = s.logo;
      sponsorImagesRef.current[s.name] = img;
    });
  }, []);

  // Initialize stars and background celestial bodies once
  useEffect(() => {
    const stars = [];
    for (let i = 0; i < 110; i++) {
      stars.push({
        x: Math.random() * 900,
        y: Math.random() * 700,
        size: Math.random() < 0.25 ? 2.5 : Math.random() < 0.5 ? 1.5 : 1,
        speed: 0.4 + Math.random() * 1.6,
        color: Math.random() < 0.2 ? '#ec4899' : Math.random() < 0.4 ? '#38bdf8' : '#ffffff',
        twinkle: Math.random() * Math.PI * 2
      });
    }

    const planets = [
      { x: 120, y: 80, radius: 28, color: '#4c1d95', ringColor: '#a855f7', vy: 0.15, hasRing: true },
      { x: 680, y: 240, radius: 42, color: '#0e7490', ringColor: '#38bdf8', vy: 0.1, hasRing: false },
      { x: 340, y: -60, radius: 22, color: '#be185d', ringColor: '#f472b6', vy: 0.12, hasRing: true }
    ];

    stateRef.current.stars = stars;
    stateRef.current.planets = planets;
  }, []);

  // Resize canvas to fit container
  useEffect(() => {
    const handleResize = () => {
      if (!containerRef.current || !canvasRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const w = Math.floor(rect.width);
      const h = Math.floor(rect.height);
      if (w > 0 && h > 0) {
        canvasRef.current.width = w;
        canvasRef.current.height = h;
        stateRef.current.canvasWidth = w;
        stateRef.current.canvasHeight = h;
        stateRef.current.player.y = h - 60;
        if (stateRef.current.player.x > w - 60) {
          stateRef.current.player.x = w / 2 - 24;
        }
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Start / Restart game
  const resetGame = () => {
    soundEngine.playBlip();
    const st = stateRef.current;
    const w = st.canvasWidth || 800;
    const h = st.canvasHeight || 520;

    st.player.x = w / 2 - 24;
    st.player.y = h - 60;
    st.lasers = [];
    st.targets = [];
    st.powerups = [];
    st.particles = [];
    st.debris = [];
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
    setActiveSponsorPopup(null);
  };

  // Laser firing
  const fireLaser = () => {
    const st = stateRef.current;
    if (st.health <= 0 || isPaused || activeSponsorPopup) return;
    soundEngine.playLaser();
    const now = Date.now();
    const isTriple = now < st.tripleShotUntil;

    if (isTriple) {
      st.lasers.push(
        { x: st.player.x + 8, y: st.player.y - 6, vx: -1.8, vy: -11, color: '#ec4899', width: 4, height: 16 },
        { x: st.player.x + 22, y: st.player.y - 12, vx: 0, vy: -12, color: '#38bdf8', width: 5, height: 18 },
        { x: st.player.x + 36, y: st.player.y - 6, vx: 1.8, vy: -11, color: '#ec4899', width: 4, height: 16 }
      );
    } else {
      st.lasers.push(
        { x: st.player.x + 10, y: st.player.y - 10, vx: 0, vy: -11, color: '#38bdf8', width: 4, height: 16 },
        { x: st.player.x + 34, y: st.player.y - 10, vx: 0, vy: -11, color: '#38bdf8', width: 4, height: 16 }
      );
    }
  };

  // Main Canvas Loop
  useEffect(() => {
    if (!isPlaying || isPaused || activeSponsorPopup) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const st = stateRef.current;

    let lastTime = Date.now();

    const loop = () => {
      const now = Date.now();
      const dt = Math.min(32, now - lastTime);
      lastTime = now;

      const cw = canvas.width;
      const ch = canvas.height;

      // 1. UPDATE STARS & PLANETS
      st.stars.forEach(s => {
        s.y += s.speed * (st.level === 1 ? 1 : st.level === 2 ? 1.4 : 1.8);
        s.twinkle += 0.05;
        if (s.y > ch) {
          s.y = 0;
          s.x = Math.random() * cw;
        }
      });

      st.planets.forEach(p => {
        p.y += p.vy;
        if (p.y > ch + p.radius + 40) {
          p.y = -p.radius - 40;
          p.x = 40 + Math.random() * (cw - 80);
        }
      });

      // 2. PLAYER MOVEMENT
      if (st.keys.left) st.player.x -= st.player.speed;
      if (st.keys.right) st.player.x += st.player.speed;
      st.player.x = Math.max(8, Math.min(cw - st.player.width - 8, st.player.x));

      // 3. SPAWN SPONSOR TARGETS
      if (now - st.lastSpawn > (st.spawnInterval - (st.level - 1) * 250) && st.targets.length < 5) {
        st.lastSpawn = now;
        const availableSponsors = pastSponsors;
        const chosen = availableSponsors[st.sponsorIndex % availableSponsors.length];
        st.sponsorIndex++;

        st.targets.push({
          id: Math.random().toString(),
          sponsor: chosen,
          x: 40 + Math.random() * (cw - 160),
          y: -70,
          width: 96,
          height: 56,
          speed: 1.1 + (st.level * 0.35) + Math.random() * 0.4,
          hp: 2,
          maxHp: 2,
          bobOffset: Math.random() * Math.PI * 2,
          hitFlash: 0
        });
      }

      // 4. SPAWN FLOATING SPACE DEBRIS / ASTERODS OCCASIONALLY
      if (Math.random() < 0.008 && st.debris.length < 3) {
        st.debris.push({
          x: 30 + Math.random() * (cw - 60),
          y: -30,
          size: 16 + Math.random() * 14,
          speed: 1.4 + Math.random() * 1.2,
          rotation: 0,
          rotSpeed: (Math.random() - 0.5) * 0.04,
          hp: 1
        });
      }

      // 5. UPDATE LASERS
      st.lasers.forEach(l => {
        l.x += l.vx;
        l.y += l.vy;
      });
      st.lasers = st.lasers.filter(l => l.y > -30 && l.x > -10 && l.x < cw + 10);

      // 6. UPDATE DEBRIS
      st.debris.forEach(deb => {
        deb.y += deb.speed;
        deb.rotation += deb.rotSpeed;

        st.lasers.forEach(l => {
          const dx = l.x - deb.x;
          const dy = l.y - deb.y;
          if (Math.hypot(dx, dy) < deb.size + 4) {
            l.y = -999;
            deb.hp -= 1;
            soundEngine.playHit();
            st.score += 50;
            setScore(st.score);

            for (let i = 0; i < 6; i++) {
              st.particles.push({
                x: deb.x,
                y: deb.y,
                vx: (Math.random() - 0.5) * 5,
                vy: (Math.random() - 0.5) * 5,
                color: '#94a3b8',
                life: 16
              });
            }
          }
        });
      });
      st.debris = st.debris.filter(d => d.hp > 0 && d.y < ch + 40);

      // 7. UPDATE SPONSOR TARGETS & LASER COLLISIONS
      st.targets.forEach(t => {
        t.y += t.speed;
        t.x += Math.sin(now * 0.0025 + t.bobOffset) * 0.9;
        if (t.hitFlash > 0) t.hitFlash -= 1;

        // Collision with Lasers
        st.lasers.forEach(l => {
          if (
            l.x > t.x && l.x < t.x + t.width &&
            l.y > t.y && l.y < t.y + t.height
          ) {
            l.y = -999;
            t.hp -= 1;
            t.hitFlash = 6;
            soundEngine.playHit();

            // Hit sparks
            for (let i = 0; i < 5; i++) {
              st.particles.push({
                x: l.x,
                y: l.y,
                vx: (Math.random() - 0.5) * 5,
                vy: (Math.random() - 0.5) * 5,
                color: '#fbbf24',
                life: 18
              });
            }

            // TARGET DESTROYED!
            if (t.hp <= 0) {
              soundEngine.playExplosion();
              st.score += 200;
              setScore(st.score);

              // Register Unlock & Award Coins
              const isNewlyUnlocked = !st.unlockedNames.has(t.sponsor.name);
              st.unlockedNames.add(t.sponsor.name);
              setUnlockedSponsors(prev => {
                if (prev.some(p => p.name === t.sponsor.name)) return prev;
                return [...prev, t.sponsor];
              });

              achievementSystem.addBonusCoins(5);

              // Reveal beautiful sponsor popup modal
              setActiveSponsorPopup(t.sponsor);

              // Check victory condition
              if (st.unlockedNames.size >= pastSponsors.length) {
                setVictory(true);
                soundEngine.playFanfare();
                achievementSystem.addBonusCoins(50);
                try {
                  confetti({ particleCount: 80, spread: 90, origin: { y: 0.4 } });
                } catch(e) {}
              }

              // Powerup Drop (35% chance)
              if (Math.random() < 0.4) {
                const type = Math.random() < 0.5 ? 'triple' : Math.random() < 0.8 ? 'coin' : 'heal';
                st.powerups.push({
                  x: t.x + t.width / 2,
                  y: t.y + t.height / 2,
                  type,
                  vy: 2.0
                });
              }

              // Spectacular explosion debris
              for (let i = 0; i < 24; i++) {
                st.particles.push({
                  x: t.x + t.width / 2,
                  y: t.y + t.height / 2,
                  vx: (Math.random() - 0.5) * 8,
                  vy: (Math.random() - 0.5) * 8,
                  color: i % 3 === 0 ? '#ec4899' : i % 3 === 1 ? '#38bdf8' : '#fbbf24',
                  life: 30
                });
              }
            }
          }
        });

        // Collision with Player Ship
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

      st.targets = st.targets.filter(t => t.hp > 0 && t.y < ch + 70);

      // 8. UPDATE POWERUPS
      st.powerups.forEach(p => {
        p.y += p.vy;
        if (
          p.x > st.player.x - 12 && p.x < st.player.x + st.player.width + 12 &&
          p.y > st.player.y - 12 && p.y < st.player.y + st.player.height + 12
        ) {
          p.y = 9999;
          soundEngine.playPowerup();
          if (p.type === 'triple') {
            st.tripleShotUntil = Date.now() + 9000;
          } else if (p.type === 'heal') {
            st.health = Math.min(3, st.health + 1);
            setHealth(st.health);
          } else if (p.type === 'coin') {
            st.score += 250;
            setScore(st.score);
            achievementSystem.addBonusCoins(5);
          }
        }
      });
      st.powerups = st.powerups.filter(p => p.y < ch + 30);

      // 9. UPDATE PARTICLES
      st.particles.forEach(pt => {
        pt.x += pt.vx;
        pt.y += pt.vy;
        pt.life -= 1;
      });
      st.particles = st.particles.filter(pt => pt.life > 0);

      // Level Progression
      if (st.score > 1200 && st.level === 1) {
        st.level = 2;
        setLevel(2);
        soundEngine.playFanfare();
      } else if (st.score > 3000 && st.level === 2) {
        st.level = 3;
        setLevel(3);
        soundEngine.playFanfare();
      }

      // =============================================================
      // DRAW CANVAS FRAME
      // =============================================================
      ctx.fillStyle = '#050212';
      ctx.fillRect(0, 0, cw, ch);

      // Background Nebula Glow
      const grad = ctx.createRadialGradient(cw / 2, ch / 2, 50, cw / 2, ch / 2, cw * 0.75);
      grad.addColorStop(0, 'rgba(88, 28, 135, 0.22)');
      grad.addColorStop(0.5, 'rgba(30, 27, 75, 0.15)');
      grad.addColorStop(1, 'rgba(5, 2, 18, 0)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, cw, ch);

      // Subtle Retro Grid
      ctx.strokeStyle = 'rgba(147, 51, 234, 0.07)';
      ctx.lineWidth = 1;
      for (let x = 0; x < cw; x += 48) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, ch);
        ctx.stroke();
      }

      // Draw Planets
      st.planets.forEach(p => {
        ctx.save();
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();

        // Planet shading
        ctx.beginPath();
        ctx.arc(p.x - p.radius * 0.3, p.y - p.radius * 0.3, p.radius * 0.8, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
        ctx.fill();

        if (p.hasRing) {
          ctx.beginPath();
          ctx.ellipse(p.x, p.y, p.radius * 1.8, p.radius * 0.45, -0.25, 0, Math.PI * 2);
          ctx.strokeStyle = p.ringColor;
          ctx.lineWidth = 3;
          ctx.stroke();
        }
        ctx.restore();
      });

      // Draw Stars
      st.stars.forEach(s => {
        const opacity = 0.5 + Math.sin(s.twinkle) * 0.45;
        ctx.fillStyle = s.color;
        ctx.globalAlpha = opacity;
        ctx.fillRect(s.x, s.y, s.size, s.size);
      });
      ctx.globalAlpha = 1;

      // Draw Debris / Asteroids
      st.debris.forEach(deb => {
        ctx.save();
        ctx.translate(deb.x, deb.y);
        ctx.rotate(deb.rotation);
        ctx.fillStyle = '#475569';
        ctx.strokeStyle = '#94a3b8';
        ctx.lineWidth = 2;
        ctx.beginPath();
        const pts = 6;
        for (let i = 0; i < pts; i++) {
          const angle = (i / pts) * Math.PI * 2;
          const r = deb.size * (0.8 + ((i % 2) * 0.3));
          const px = Math.cos(angle) * r;
          const py = Math.sin(angle) * r;
          if (i === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        ctx.restore();
      });

      // Draw Lasers
      st.lasers.forEach(l => {
        ctx.save();
        ctx.fillStyle = l.color;
        ctx.shadowColor = l.color;
        ctx.shadowBlur = 10;
        ctx.fillRect(l.x, l.y, l.width, l.height);
        // Bright core
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(l.x + 1, l.y + 2, l.width - 2, l.height - 4);
        ctx.restore();
      });

      // Draw Sponsor Carrier Craft (Targets)
      st.targets.forEach(t => {
        ctx.save();
        const flash = t.hitFlash > 0;

        // Spacecraft Outer Hull
        ctx.fillStyle = flash ? '#ffffff' : '#140c2b';
        ctx.strokeStyle = flash ? '#ef4444' : t.hp < t.maxHp ? '#f59e0b' : '#38bdf8';
        ctx.lineWidth = 2;

        // Chamfered craft chassis
        const rx = t.x;
        const ry = t.y;
        const rw = t.width;
        const rh = t.height;

        ctx.beginPath();
        ctx.moveTo(rx + 8, ry);
        ctx.lineTo(rx + rw - 8, ry);
        ctx.lineTo(rx + rw, ry + 10);
        ctx.lineTo(rx + rw, ry + rh - 8);
        ctx.lineTo(rx + rw - 10, ry + rh);
        ctx.lineTo(rx + 10, ry + rh);
        ctx.lineTo(rx, ry + rh - 8);
        ctx.lineTo(rx, ry + 10);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Sponsor Logo Display Badge
        const img = sponsorImagesRef.current[t.sponsor.name];
        const logoSize = 34;
        const logoX = rx + 8;
        const logoY = ry + (rh - logoSize) / 2;

        // Logo background plate
        ctx.fillStyle = '#0a0518';
        ctx.fillRect(logoX, logoY, logoSize, logoSize);
        ctx.strokeStyle = 'rgba(147, 51, 234, 0.6)';
        ctx.strokeRect(logoX, logoY, logoSize, logoSize);

        if (img && img.complete && img.naturalWidth > 0) {
          try {
            ctx.drawImage(img, logoX + 2, logoY + 2, logoSize - 4, logoSize - 4);
          } catch(e) {}
        } else {
          // Fallback initial
          ctx.fillStyle = '#38bdf8';
          ctx.font = 'bold 16px sans-serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(t.sponsor.name.slice(0, 2), logoX + logoSize / 2, logoY + logoSize / 2);
        }

        // Sponsor Name Tag
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 11px monospace';
        ctx.textAlign = 'left';
        ctx.fillText(t.sponsor.name.slice(0, 9), rx + 48, ry + 20);

        // Tier Tag
        ctx.fillStyle = '#fbbf24';
        ctx.font = '8px monospace';
        ctx.fillText(t.sponsor.tier.slice(0, 11), rx + 48, ry + 32);

        // Mini HP Bar
        ctx.fillStyle = '#1e1b4b';
        ctx.fillRect(rx + 48, ry + 38, rw - 54, 4);
        ctx.fillStyle = t.hp === 2 ? '#10b981' : '#f59e0b';
        ctx.fillRect(rx + 48, ry + 38, (rw - 54) * (t.hp / t.maxHp), 4);

        ctx.restore();
      });

      // Draw Powerups
      st.powerups.forEach(p => {
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.fillStyle = p.type === 'triple' ? '#ec4899' : p.type === 'heal' ? '#10b981' : '#fbbf24';
        ctx.shadowColor = ctx.fillStyle;
        ctx.shadowBlur = 8;
        ctx.fillRect(-9, -9, 18, 18);
        ctx.fillStyle = '#000000';
        ctx.font = 'bold 10px monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(p.type === 'triple' ? '3X' : p.type === 'heal' ? '+HP' : '$$', 0, 0);
        ctx.restore();
      });

      // Draw Explosions / Particles
      st.particles.forEach(pt => {
        ctx.fillStyle = pt.color;
        ctx.fillRect(pt.x, pt.y, 3, 3);
      });

      // Draw Player Interceptor Fighter
      const px = st.player.x;
      const py = st.player.y;
      const isTriple = now < st.tripleShotUntil;

      // Dual Plasma Exhaust Trails
      ctx.fillStyle = isTriple ? '#ec4899' : '#06b6d4';
      ctx.shadowColor = ctx.fillStyle;
      ctx.shadowBlur = 12;
      const flameH = 8 + Math.random() * 10;
      ctx.fillRect(px + 14, py + 34, 6, flameH);
      ctx.fillRect(px + 28, py + 34, 6, flameH);
      ctx.shadowBlur = 0;

      // Fighter Fuselage
      ctx.fillStyle = '#0284c7';
      ctx.fillRect(px + 20, py, 8, 34); // center core
      ctx.fillStyle = '#38bdf8';
      ctx.fillRect(px + 22, py + 4, 4, 12); // nosecone highlight

      // Swept Wings
      ctx.fillStyle = '#7c3aed';
      ctx.beginPath();
      ctx.moveTo(px + 20, py + 12);
      ctx.lineTo(px + 2, py + 32);
      ctx.lineTo(px + 12, py + 32);
      ctx.lineTo(px + 20, py + 26);
      ctx.closePath();
      ctx.fill();

      ctx.beginPath();
      ctx.moveTo(px + 28, py + 12);
      ctx.lineTo(px + 46, py + 32);
      ctx.lineTo(px + 36, py + 32);
      ctx.lineTo(px + 28, py + 26);
      ctx.closePath();
      ctx.fill();

      // Wing Cannons
      ctx.fillStyle = isTriple ? '#f43f5e' : '#38bdf8';
      ctx.fillRect(px + 4, py + 22, 5, 12);
      ctx.fillRect(px + 39, py + 22, 5, 12);

      // Cockpit Glass
      ctx.fillStyle = '#e0f2fe';
      ctx.fillRect(px + 22, py + 10, 4, 8);

      st.animationId = requestAnimationFrame(loop);
    };

    st.animationId = requestAnimationFrame(loop);

    return () => {
      if (st.animationId) cancelAnimationFrame(st.animationId);
    };
  }, [isPlaying, isPaused, activeSponsorPopup, unlockedSponsors]);

  // Keyboard Listeners
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (activeSponsorPopup) {
        if (e.key === ' ' || e.key === 'Spacebar' || e.key === 'Enter' || e.key === 'Escape') {
          e.preventDefault();
          setActiveSponsorPopup(null);
        }
        return;
      }

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
  }, [activeSponsorPopup, isPaused]);

  return (
    <div className="relative flex flex-col h-full w-full bg-[#050212] text-white overflow-hidden select-none">
      
      {/* ------------------------------------------------------------- */}
      {/* COMPACT TOP HUD: STATUS, COLLECTION, CONTROLS                 */}
      {/* ------------------------------------------------------------- */}
      <div className="p-2 sm:px-4 sm:py-2.5 bg-[#0f0724] border-b border-purple-800/60 flex items-center justify-between gap-2 shrink-0 z-10">
        
        {/* Left: Title & Collection Progress */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Target size={18} className="text-cyan-400" />
            <span className="font-display text-xs sm:text-sm font-black text-cyan-300 uppercase tracking-wider">
              SPONSOR GALAXY
            </span>
          </div>

          {/* Collection Indicator */}
          <div className="hidden sm:flex items-center gap-2 px-2.5 py-1 rounded-xl bg-purple-950/80 border border-purple-600/50">
            <span className="text-[10px] font-display font-black text-yellow-400">UNLOCKED:</span>
            <span className="font-display text-xs font-bold text-white tracking-widest">
              {unlockedSponsors.length}/{pastSponsors.length}
            </span>
            <div className="w-16 h-1.5 rounded-full bg-slate-800 overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-cyan-400 to-emerald-400 rounded-full transition-all"
                style={{ width: `${(unlockedSponsors.length / pastSponsors.length) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Center: Score & Hearts */}
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-[#190d3a] border border-yellow-500/40">
            <span className="text-[10px] font-display font-black text-yellow-400">SCORE</span>
            <span className="font-display text-xs sm:text-sm font-bold text-white tracking-widest">{score}</span>
          </div>

          <div className="flex items-center gap-1">
            {[1, 2, 3].map(h => (
              <Heart 
                key={h} 
                size={16} 
                className={h <= health ? 'text-rose-500 fill-rose-500' : 'text-slate-700'} 
              />
            ))}
          </div>
        </div>

        {/* Right: Controls & Directory Link */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Pause / Resume */}
          <button
            onClick={() => {
              soundEngine.playBlip();
              setIsPaused(prev => !prev);
            }}
            title={isPaused ? 'Resume Flight [P]' : 'Pause Flight [P]'}
            className="p-1.5 sm:px-2.5 sm:py-1 rounded-lg bg-purple-950 hover:bg-purple-900 border border-purple-600 text-purple-200 hover:text-white font-display text-[11px] font-black uppercase flex items-center gap-1 transition-all cursor-pointer"
          >
            {isPaused ? <Play size={14} className="text-emerald-400" /> : <Pause size={14} className="text-yellow-400" />}
            <span className="hidden md:inline">{isPaused ? 'RESUME' : 'PAUSE'}</span>
          </button>

          {/* Restart */}
          <button
            onClick={resetGame}
            title="Restart Flight"
            className="p-1.5 sm:px-2.5 sm:py-1 rounded-lg bg-purple-950 hover:bg-purple-900 border border-purple-600 text-slate-300 hover:text-white font-display text-[11px] font-black uppercase flex items-center gap-1 transition-all cursor-pointer"
          >
            <RotateCcw size={14} />
            <span className="hidden md:inline">RESTART</span>
          </button>

          {/* Skip Game / Browse Sponsors */}
          {onSkipToDirectory && (
            <button
              onClick={() => {
                soundEngine.playBlip();
                onSkipToDirectory();
              }}
              className="px-2.5 py-1 rounded-lg bg-purple-950 hover:bg-purple-900 border border-purple-500/80 text-purple-200 hover:text-white font-display text-[11px] font-black uppercase flex items-center gap-1 transition-all cursor-pointer"
              title="Skip Game and Browse Full Sponsor Directory"
            >
              <Eye size={13} />
              <span className="hidden lg:inline">SKIP GAME /</span>
              <span>BROWSE</span>
            </button>
          )}

          {/* Integrated Rewards Shop Tab Link */}
          {onOpenRewards && (
            <button
              onClick={() => {
                soundEngine.playBlip();
                onOpenRewards();
              }}
              className="px-2.5 py-1 rounded-lg bg-amber-950/90 hover:bg-amber-900 border border-yellow-500/80 text-yellow-300 font-display text-[11px] font-black uppercase flex items-center gap-1 transition-all cursor-pointer shadow-sm shadow-yellow-500/20"
              title="Open Rewards Shop & Redeem Coins"
            >
              <Gift size={13} className="text-yellow-400" />
              <span>REWARDS</span>
            </button>
          )}

          {/* Exit */}
          {onClose && (
            <button
              onClick={() => {
                soundEngine.playBlip();
                onClose();
              }}
              className="p-1.5 rounded-lg bg-slate-900 hover:bg-rose-950 text-slate-400 hover:text-white border border-slate-700 hover:border-rose-500 transition-all cursor-pointer"
              title="Exit Sponsor Galaxy"
            >
              <X size={15} />
            </button>
          )}
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* MAIN GAMEPLAY VIEWPORT                                        */}
      {/* ------------------------------------------------------------- */}
      <div 
        ref={containerRef} 
        className="relative flex-1 w-full h-full bg-[#050212] overflow-hidden flex items-center justify-center"
      >
        <canvas
          ref={canvasRef}
          className="w-full h-full block cursor-crosshair"
          onClick={fireLaser}
        />

        {/* Tiny Control Hint at Bottom (Non-intrusive) */}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-black/60 backdrop-blur-sm border border-purple-800/40 text-[10px] font-mono text-purple-300 tracking-wider pointer-events-none z-10 flex items-center gap-2">
          <Zap size={11} className="text-yellow-400" />
          <span>MOVE: ARROWS / A-D &nbsp;|&nbsp; SHOOT: SPACE</span>
        </div>

        {/* PAUSE OVERLAY */}
        {isPaused && !activeSponsorPopup && (
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center z-20">
            <h3 className="font-display text-2xl font-black text-yellow-400 tracking-wider mb-4">
              MISSION PAUSED
            </h3>
            <div className="flex gap-3">
              <button
                onClick={() => setIsPaused(false)}
                className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-display text-xs font-black uppercase tracking-wider cursor-pointer"
              >
                RESUME FLIGHT [P]
              </button>
              <button
                onClick={resetGame}
                className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-display text-xs font-bold uppercase cursor-pointer"
              >
                RESTART
              </button>
            </div>
          </div>
        )}

        {/* GAME OVER OVERLAY */}
        {gameOver && (
          <div className="absolute inset-0 bg-black/90 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center z-20">
            <h3 className="font-display text-3xl font-black text-rose-500 tracking-wider mb-2">
              HULL BREACH — MISSION OVER
            </h3>
            <p className="font-body text-sm text-slate-300 mb-2">
              Final Score: <strong className="text-yellow-400 font-display">{score}</strong> • Sponsors Discovered: <strong className="text-cyan-400 font-display">{unlockedSponsors.length}</strong>
            </p>
            <p className="font-body text-xs text-slate-400 mb-6">
              All discovered sponsors remain unlocked!
            </p>

            <div className="flex gap-3">
              <button
                onClick={resetGame}
                className="px-6 py-3 rounded-xl bg-pink-600 hover:bg-pink-500 text-white font-display text-xs font-black uppercase tracking-wider flex items-center gap-2 cursor-pointer shadow-lg shadow-pink-600/30"
              >
                <RotateCcw size={16} />
                <span>PLAY AGAIN</span>
              </button>
              <button
                onClick={() => setShowRosterDrawer(true)}
                className="px-6 py-3 rounded-xl bg-emerald-950 hover:bg-emerald-900 border border-emerald-500 text-emerald-300 font-display text-xs font-bold uppercase cursor-pointer"
              >
                VIEW UNLOCKED ROSTER
              </button>
            </div>
          </div>
        )}

        {/* VICTORY OVERLAY */}
        {victory && (
          <div className="absolute inset-0 bg-purple-950/95 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center z-20">
            <div className="w-16 h-16 rounded-full bg-yellow-400/20 border-2 border-yellow-400 flex items-center justify-center mb-4">
              <Award size={36} className="text-yellow-400 animate-bounce" />
            </div>
            <h3 className="font-display text-3xl font-black text-yellow-300 tracking-wider mb-2">
              ALL SPONSORS LIBERATED!
            </h3>
            <p className="font-body text-sm text-slate-200 mb-2 max-w-md">
              Spectacular flying! You unlocked every brand partner in the constellation and earned <strong className="text-yellow-400 font-display">+50 BONUS FESTIVAL COINS</strong>!
            </p>
            <div className="flex gap-3 mt-4">
              <button
                onClick={() => setShowRosterDrawer(true)}
                className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-display text-xs font-black uppercase tracking-wider cursor-pointer"
              >
                VIEW FULL SPONSOR DIRECTORY
              </button>
              <button
                onClick={resetGame}
                className="px-5 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 font-display text-xs font-bold uppercase cursor-pointer"
              >
                PLAY AGAIN
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ------------------------------------------------------------- */}
      {/* MOBILE TOUCH CONTROLS (Always accessible on touch/compact)   */}
      {/* ------------------------------------------------------------- */}
      <div className="sm:hidden p-2.5 bg-[#0b051a] border-t border-purple-900/60 flex items-center justify-between gap-3 shrink-0">
        <div className="flex items-center gap-2">
          <button
            onTouchStart={() => { stateRef.current.keys.left = true; }}
            onTouchEnd={() => { stateRef.current.keys.left = false; }}
            onMouseDown={() => { stateRef.current.keys.left = true; }}
            onMouseUp={() => { stateRef.current.keys.left = false; }}
            className="w-14 h-11 rounded-xl bg-purple-950 border-2 border-purple-500 text-white font-display font-black text-lg active:scale-95 flex items-center justify-center select-none"
          >
            ◀
          </button>
          <button
            onTouchStart={() => { stateRef.current.keys.right = true; }}
            onTouchEnd={() => { stateRef.current.keys.right = false; }}
            onMouseDown={() => { stateRef.current.keys.right = true; }}
            onMouseUp={() => { stateRef.current.keys.right = false; }}
            className="w-14 h-11 rounded-xl bg-purple-950 border-2 border-purple-500 text-white font-display font-black text-lg active:scale-95 flex items-center justify-center select-none"
          >
            ▶
          </button>
        </div>

        <button
          onTouchStart={(e) => { e.preventDefault(); fireLaser(); }}
          onClick={fireLaser}
          className="flex-1 h-11 rounded-xl bg-pink-600 border-2 border-pink-400 text-white font-display font-black text-xs uppercase tracking-wider active:scale-95 flex items-center justify-center gap-2 shadow-lg shadow-pink-600/30 select-none"
        >
          <Zap size={16} />
          <span>FIRE LASER</span>
        </button>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* MANDATORY: BEAUTIFUL SPONSOR HIT / UNLOCK POPUP MODAL          */}
      {/* ------------------------------------------------------------- */}
      {activeSponsorPopup && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-[#12072e] border-2 border-cyan-400 rounded-3xl p-6 sm:p-7 max-w-lg w-full shadow-2xl shadow-cyan-500/25 relative animate-scaleUp">
            
            {/* Top Close Button */}
            <button
              onClick={() => setActiveSponsorPopup(null)}
              className="absolute top-4 right-4 p-2 rounded-xl bg-slate-900 hover:bg-rose-900 text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <X size={18} />
            </button>

            {/* Badge & Coin Reward Tag */}
            <div className="flex items-center gap-2 mb-4">
              <span className="px-3 py-1 rounded-full bg-cyan-950 border border-cyan-400 text-cyan-300 font-display text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5">
                <CheckCircle2 size={12} className="text-cyan-400" />
                SPONSOR DISCOVERED!
              </span>

              <span className="px-3 py-1 rounded-full bg-amber-950 border border-yellow-500/60 text-yellow-300 font-display text-[10px] font-black uppercase tracking-wider">
                +5 COINS EARNED
              </span>
            </div>

            {/* Logo and Name Header */}
            <div className="flex items-center gap-4 mb-4">
              <div className="w-20 h-20 rounded-2xl bg-white p-2.5 flex items-center justify-center shrink-0 shadow-lg">
                <img 
                  src={activeSponsorPopup.logo} 
                  alt={activeSponsorPopup.name} 
                  className="max-w-full max-h-full object-contain" 
                />
              </div>

              <div>
                <span className="px-2.5 py-0.5 rounded-full bg-purple-950 border border-purple-500 text-purple-300 font-display text-[10px] font-bold uppercase">
                  {activeSponsorPopup.tier}
                </span>
                <h3 className="font-display text-2xl font-black text-white mt-1">
                  {activeSponsorPopup.name}
                </h3>
              </div>
            </div>

            {/* Description */}
            <p className="font-body text-sm text-slate-200 leading-relaxed mb-6 font-semibold bg-[#1a0e3a] p-4 rounded-xl border border-purple-800/60">
              {activeSponsorPopup.description || 'Official festival partner contributing to technology tracks, hackathons, and youth innovation at REVÉRIE IIIT Kota.'}
            </p>

            {/* Action Buttons: Official Website & Resume */}
            <div className="flex flex-wrap items-center justify-end gap-3">
              {activeSponsorPopup.website && (
                <a
                  href={activeSponsorPopup.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-2.5 rounded-xl bg-purple-900/90 hover:bg-purple-800 border border-purple-500 text-purple-200 hover:text-white font-display text-xs font-black uppercase tracking-wider flex items-center gap-1.5 transition-all"
                >
                  <ExternalLink size={14} />
                  <span>OFFICIAL WEBSITE</span>
                </a>
              )}

              <button
                onClick={() => setActiveSponsorPopup(null)}
                className="px-6 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-display text-xs font-black uppercase tracking-wider flex items-center gap-1.5 shadow-lg shadow-cyan-500/30 transition-all cursor-pointer"
              >
                <span>RESUME FLIGHT [SPACE]</span>
                <ChevronRight size={15} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* COMPACT VIEW ALL SPONSORS DRAWER (When user clicks toggle)     */}
      {/* ------------------------------------------------------------- */}
      {showRosterDrawer && (
        <div className="absolute inset-x-0 bottom-0 max-h-[65%] bg-[#0d0724]/95 backdrop-blur-md border-t-2 border-emerald-500 rounded-t-3xl p-4 sm:p-5 z-40 overflow-y-auto shadow-2xl flex flex-col">
          <div className="flex items-center justify-between mb-3 shrink-0">
            <div className="flex items-center gap-2">
              <Award size={18} className="text-emerald-400" />
              <h4 className="font-display text-sm font-black text-white uppercase tracking-wider">
                ALL REVERIE FESTIVAL SPONSORS ({unlockedSponsors.length} / {pastSponsors.length} UNLOCKED)
              </h4>
            </div>

            <div className="flex items-center gap-2">
              {onSkipToDirectory && (
                <button
                  onClick={() => {
                    setShowRosterDrawer(false);
                    onSkipToDirectory();
                  }}
                  className="px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-display text-xs font-black uppercase tracking-wider"
                >
                  OPEN PERKS MATRIX
                </button>
              )}
              <button
                onClick={() => setShowRosterDrawer(false)}
                className="p-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Grid of Sponsors */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2.5 overflow-y-auto">
            {pastSponsors.map(sponsor => {
              const isUnlocked = unlockedSponsors.some(s => s.name === sponsor.name);
              return (
                <div
                  key={sponsor.name}
                  onClick={() => {
                    soundEngine.playBlip();
                    setActiveSponsorPopup(sponsor);
                  }}
                  className={`p-2.5 rounded-xl border text-left flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    isUnlocked
                      ? 'bg-[#180e38] border-emerald-500/80 hover:border-emerald-400 hover:scale-105 shadow-md shadow-emerald-950/40'
                      : 'bg-[#100824]/60 border-purple-950/80 hover:border-purple-800'
                  }`}
                >
                  <div className="w-12 h-12 rounded-lg bg-white p-1.5 flex items-center justify-center overflow-hidden">
                    <img 
                      src={sponsor.logo} 
                      alt={sponsor.name} 
                      className={`max-w-full max-h-full object-contain ${!isUnlocked && 'grayscale opacity-60'}`} 
                    />
                  </div>
                  <span className="font-display text-xs font-bold text-center text-white line-clamp-1">
                    {sponsor.name}
                  </span>
                  <span className="font-body text-[10px] text-center text-yellow-400 font-semibold line-clamp-1">
                    {sponsor.tier}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
