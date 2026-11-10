import React, { useState, useEffect, useRef } from 'react';
import { soundEngine } from '../../game/systems/SoundEngine';
import { festivalSchedule } from '../../data/schedule';
import { ExternalLink, Volume2, VolumeX, Sparkles, Trophy, ArrowRight, Play, Pause, MapPin, Clock, Calendar, Zap, Award, CheckCircle2 } from 'lucide-react';

export function PacmanScheduleMaze({ onAdvanceStage, onClose, onBackToMap }) {
  const canvasRef = useRef(null);
  const [activeFilterDay, setActiveFilterDay] = useState('ALL'); // 'ALL' | 1 | 2 | 3
  const [score, setScore] = useState(3250);
  const [highScore, setHighScore] = useState(9990);
  const [activeEvent, setActiveEvent] = useState(festivalSchedule[0]);
  const [soundMuted, setSoundMuted] = useState(soundEngine.muted);
  const [isAutoCruise, setIsAutoCruise] = useState(true);
  const [scaredGhostTimer, setScaredGhostTimer] = useState(0);
  const [eatenEventIds, setEatenEventIds] = useState(new Set([festivalSchedule[0]?.id]));

  // All 18 events from schedule data
  const allEvents = festivalSchedule;

  // Advanced game state for full-screen 3-level authentic Pac-Man circuit covering all 18 events
  const gameRef = useRef({
    // Multi-track circuit nodes covering the full canvas
    trackNodes: [
      // Day 1 Top Rail (y: 65)
      { x: 60, y: 65 }, { x: 260, y: 65 }, { x: 460, y: 65 }, { x: 680, y: 65 }, { x: 940, y: 65 },
      // Right chute down to Day 2
      { x: 940, y: 195 },
      // Day 2 Middle Rail (y: 195)
      { x: 740, y: 195 }, { x: 580, y: 195 }, { x: 420, y: 195 }, { x: 260, y: 195 }, { x: 60, y: 195 },
      // Left chute down to Day 3
      { x: 60, y: 325 },
      // Day 3 Bottom Rail (y: 325)
      { x: 240, y: 325 }, { x: 420, y: 325 }, { x: 600, y: 325 }, { x: 780, y: 325 }, { x: 940, y: 325 },
      // Right loop return
      { x: 940, y: 65 },
      { x: 60, y: 65 }
    ],
    pacman: {
      x: 60,
      y: 65,
      speed: 3.8,
      nodeIndex: 0,
      radius: 22,
      mouthAngle: 0.22,
      mouthSpeed: 0.08,
      direction: 0
    },
    ghosts: [
      { x: 480, y: 195, targetX: 680, targetY: 65, speed: 2.3, color: '#ef4444', name: 'Blinky', eyeDir: 0 },
      { x: 520, y: 195, targetX: 260, targetY: 325, speed: 2.1, color: '#ec4899', name: 'Pinky', eyeDir: 0 },
      { x: 560, y: 195, targetX: 780, targetY: 325, speed: 2.2, color: '#06b6d4', name: 'Inky', eyeDir: 0 },
      { x: 440, y: 195, targetX: 260, targetY: 65, speed: 2.0, color: '#f97316', name: 'Clyde', eyeDir: 0 }
    ],
    pellets: [],
    powerPellets: [],
    fruits: [
      { x: 500, y: 130, type: 'cherry', eaten: false, bounce: 0 },
      { x: 500, y: 260, type: 'strawberry', eaten: false, bounce: 0 }
    ],
    eventStations: [],
    particles: [],
    scorePills: []
  });

  // Build the complete 18-event multi-corridor circuit
  useEffect(() => {
    const canvasWidth = 1000;
    
    // Group events by day:
    // Day 1 (5 events) -> Upper Corridor (y: 65)
    // Day 2 (6 events) -> Middle Corridor (y: 195)
    // Day 3 (7 events) -> Lower Corridor (y: 325)
    const day1Events = allEvents.filter(e => e.day === 1);
    const day2Events = allEvents.filter(e => e.day === 2);
    const day3Events = allEvents.filter(e => e.day === 3);

    const stations = [];

    // Helper to position a row of events
    const placeRow = (events, yPos, startX, endX) => {
      const spacing = (endX - startX) / (events.length + 1);
      events.forEach((ev, i) => {
        stations.push({
          ...ev,
          x: startX + spacing * (i + 1),
          y: yPos,
          radius: 26,
          eaten: eatenEventIds.has(ev.id),
          color: ev.day === 1 ? '#f59e0b' : ev.day === 2 ? '#06b6d4' : '#ec4899',
          glowPulse: 0
        });
      });
    };

    placeRow(day1Events, 65, 80, canvasWidth - 80);
    placeRow(day2Events, 195, 80, canvasWidth - 80);
    placeRow(day3Events, 325, 80, canvasWidth - 80);

    // Populate pellets across the 3 corridors and connecting vertical chutes
    const dots = [];
    const pPellets = [
      { x: 60, y: 65, eaten: false },
      { x: 940, y: 65, eaten: false },
      { x: 60, y: 195, eaten: false },
      { x: 940, y: 195, eaten: false },
      { x: 60, y: 325, eaten: false },
      { x: 940, y: 325, eaten: false }
    ];

    // Corridors dots
    [65, 195, 325].forEach(yRail => {
      for (let x = 80; x < canvasWidth - 80; x += 28) {
        if (!stations.some(s => Math.abs(s.x - x) < 36 && s.y === yRail)) {
          dots.push({ x, y: yRail, eaten: false });
        }
      }
    });

    // Vertical side chutes dots
    for (let y = 85; y < 185; y += 24) {
      dots.push({ x: 940, y, eaten: false });
    }
    for (let y = 215; y < 315; y += 24) {
      dots.push({ x: 60, y, eaten: false });
      dots.push({ x: 940, y, eaten: false });
    }

    gameRef.current.eventStations = stations;
    gameRef.current.pellets = dots;
    gameRef.current.powerPellets = pPellets;
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKey = (e) => {
      const p = gameRef.current.pacman;
      if (['ArrowRight', 'd', 'D'].includes(e.key)) {
        p.speed = Math.abs(p.speed);
        p.direction = 0;
      } else if (['ArrowLeft', 'a', 'A'].includes(e.key)) {
        p.speed = -Math.abs(p.speed);
        p.direction = Math.PI;
      } else if (e.key === ' ') {
        setIsAutoCruise(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  // 60 FPS Canvas Game Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animId;
    let frameCount = 0;

    const loop = () => {
      frameCount++;
      const g = gameRef.current;
      const p = g.pacman;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // 1. Deep Space Neon Arcade Backdrop
      ctx.fillStyle = '#030107';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // CRT Scanline / Phosphor Glow
      ctx.save();
      ctx.strokeStyle = 'rgba(25, 18, 55, 0.45)';
      ctx.lineWidth = 1;
      for (let gy = 0; gy < canvas.height; gy += 14) {
        ctx.beginPath();
        ctx.moveTo(0, gy);
        ctx.lineTo(canvas.width, gy);
        ctx.stroke();
      }
      ctx.restore();

      // 2. Draw 3-Tiered Neon Maze Corridors (Namco High-Glow Double Blue)
      ctx.save();
      ctx.shadowColor = '#2563eb';
      ctx.shadowBlur = 18;
      ctx.strokeStyle = '#3b82f6';
      ctx.lineWidth = 4;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      // Outer Perimeter Neon Wall
      ctx.beginPath();
      ctx.roundRect(25, 25, canvas.width - 50, 345, 28);
      ctx.stroke();

      // Horizontal Corridor Dividers
      ctx.strokeStyle = '#1d4ed8';
      ctx.lineWidth = 3;
      
      // Divider 1 (Between Day 1 and Day 2)
      ctx.beginPath();
      ctx.roundRect(110, 115, 340, 35, 10);
      ctx.roundRect(550, 115, 340, 35, 10);
      ctx.stroke();

      // Divider 2 (Between Day 2 and Day 3)
      ctx.beginPath();
      ctx.roundRect(110, 245, 340, 35, 10);
      ctx.roundRect(550, 245, 340, 35, 10);
      ctx.stroke();

      // Day Zone Watermarks in Corridor Backgrounds
      ctx.font = 'bold 9px "Press Start 2P", monospace';
      ctx.fillStyle = 'rgba(245, 158, 11, 0.25)';
      ctx.textAlign = 'left';
      ctx.fillText('DAY 01: FESTIVAL INAUGURATION', 40, 48);

      ctx.fillStyle = 'rgba(6, 182, 212, 0.25)';
      ctx.fillText('DAY 02: 24H HACKATHON & ROBOTICS', 40, 178);

      ctx.fillStyle = 'rgba(236, 72, 153, 0.25)';
      ctx.fillText('DAY 03: SHOWCASE & PRONITE VALEDICTORY', 40, 308);

      ctx.restore();

      // 3. Draw Regular Pellets
      g.pellets.forEach(dot => {
        if (dot.eaten) return;
        ctx.save();
        ctx.fillStyle = '#fed7aa';
        ctx.beginPath();
        ctx.arc(dot.x, dot.y, 3, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      // 4. Draw Pulsing Power Pellets
      g.powerPellets.forEach(pp => {
        if (pp.eaten) return;
        ctx.save();
        const pulse = 6.5 + Math.sin(frameCount * 0.12) * 2.8;
        ctx.shadowColor = '#facc15';
        ctx.shadowBlur = 20;
        ctx.fillStyle = '#fef08a';
        ctx.beginPath();
        ctx.arc(pp.x, pp.y, pulse, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      // 5. Draw Bonus Cherries & Strawberries
      g.fruits.forEach(f => {
        if (f.eaten) return;
        f.bounce = Math.sin(frameCount * 0.08) * 3.5;
        ctx.save();
        ctx.shadowColor = '#ef4444';
        ctx.shadowBlur = 16;
        ctx.fillStyle = '#dc2626';
        ctx.beginPath();
        ctx.arc(f.x - 6, f.y + f.bounce, 7, 0, Math.PI * 2);
        ctx.arc(f.x + 6, f.y + 3 + f.bounce, 7, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#22c55e';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(f.x - 6, f.y - 7 + f.bounce);
        ctx.quadraticCurveTo(f.x, f.y - 18 + f.bounce, f.x + 8, f.y - 12 + f.bounce);
        ctx.moveTo(f.x + 6, f.y - 4 + f.bounce);
        ctx.quadraticCurveTo(f.x, f.y - 18 + f.bounce, f.x + 8, f.y - 12 + f.bounce);
        ctx.stroke();
        ctx.restore();
      });

      // 6. Draw ALL 18 Grand Festival Event Stations
      g.eventStations.forEach(st => {
        st.glowPulse = Math.sin(frameCount * 0.08) * 5;
        const isFocused = activeEvent?.id === st.id;

        ctx.save();
        ctx.shadowColor = st.color;
        ctx.shadowBlur = isFocused ? 36 : st.eaten ? 12 : 24 + st.glowPulse;

        // Outer Rotating Orbit Ring
        ctx.strokeStyle = isFocused ? '#facc15' : st.color;
        ctx.lineWidth = isFocused ? 4 : 3;
        ctx.fillStyle = isFocused ? 'rgba(45, 18, 80, 0.95)' : st.eaten ? 'rgba(8, 4, 18, 0.95)' : 'rgba(28, 10, 55, 0.95)';
        ctx.beginPath();
        ctx.arc(st.x, st.y, st.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // Inner glowing core
        ctx.fillStyle = st.eaten ? '#22c55e' : st.color;
        ctx.beginPath();
        ctx.arc(st.x, st.y, 8, 0, Math.PI * 2);
        ctx.fill();

        // Star / Check Icon inside
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 9.5px "Press Start 2P", monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(st.eaten ? '✓' : '★', st.x, st.y);

        // Time Tag above
        ctx.font = 'bold 8px "Press Start 2P", monospace';
        ctx.fillStyle = st.color;
        const timeShort = st.time.split('-')[0].trim();
        ctx.fillText(timeShort, st.x, st.y - 32);

        // Event Title below
        ctx.font = '7.5px "Press Start 2P", monospace';
        ctx.fillStyle = '#ffffff';
        const titleShort = st.title.length > 12 ? st.title.slice(0, 10) + '..' : st.title;
        ctx.fillText(titleShort, st.x, st.y + 34);

        ctx.restore();
      });

      // 7. Update & Draw Ghosts (Patrolling & Chasing)
      g.ghosts.forEach(ghost => {
        const dx = ghost.targetX - ghost.x;
        const dy = ghost.targetY - ghost.y;
        const dist = Math.hypot(dx, dy);

        if (dist > 6) {
          ghost.x += (dx / dist) * ghost.speed;
          ghost.y += (dy / dist) * ghost.speed;
          ghost.eyeDir = Math.atan2(dy, dx);
        } else {
          const nextTarget = g.trackNodes[Math.floor(Math.random() * (g.trackNodes.length - 1))];
          ghost.targetX = nextTarget.x;
          ghost.targetY = nextTarget.y;
        }

        ctx.save();
        const isScared = scaredGhostTimer > 0;
        ctx.shadowColor = isScared ? '#38bdf8' : ghost.color;
        ctx.shadowBlur = 18;
        ctx.fillStyle = isScared ? (scaredGhostTimer < 60 && frameCount % 10 < 5 ? '#ffffff' : '#1d4ed8') : ghost.color;

        // Dome Head
        ctx.beginPath();
        ctx.arc(ghost.x, ghost.y - 4, 15, Math.PI, 0, false);
        ctx.lineTo(ghost.x + 15, ghost.y + 11);
        const wave = Math.sin(frameCount * 0.25) * 3;
        ctx.lineTo(ghost.x + 8, ghost.y + 8 + wave);
        ctx.lineTo(ghost.x, ghost.y + 12);
        ctx.lineTo(ghost.x - 8, ghost.y + 8 - wave);
        ctx.lineTo(ghost.x - 15, ghost.y + 11);
        ctx.closePath();
        ctx.fill();

        // Eyes
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(ghost.x - 6, ghost.y - 6, 4, 0, Math.PI * 2);
        ctx.arc(ghost.x + 6, ghost.y - 6, 4, 0, Math.PI * 2);
        ctx.fill();

        // Pupils
        ctx.fillStyle = '#1e3a8a';
        const px = Math.cos(ghost.eyeDir) * 2;
        const py = Math.sin(ghost.eyeDir) * 2;
        ctx.beginPath();
        ctx.arc(ghost.x - 6 + px, ghost.y - 6 + py, 2, 0, Math.PI * 2);
        ctx.arc(ghost.x + 6 + px, ghost.y - 6 + py, 2, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
      });

      if (scaredGhostTimer > 0) setScaredGhostTimer(t => t - 1);

      // 8. Update & Draw Moving Pac-Man (Circuit Navigator)
      const currentNode = g.trackNodes[p.nodeIndex];
      const nextNode = g.trackNodes[(p.nodeIndex + 1) % g.trackNodes.length];

      const dirX = nextNode.x - currentNode.x;
      const dirY = nextNode.y - currentNode.y;
      const legDist = Math.hypot(dirX, dirY);

      if (isAutoCruise) {
        p.direction = Math.atan2(dirY, dirX);
        p.x += (dirX / legDist) * p.speed;
        p.y += (dirY / legDist) * p.speed;

        if (Math.hypot(nextNode.x - p.x, nextNode.y - p.y) < p.speed * 1.5) {
          p.x = nextNode.x;
          p.y = nextNode.y;
          p.nodeIndex = (p.nodeIndex + 1) % (g.trackNodes.length - 1);
        }
      } else {
        p.x += Math.cos(p.direction) * p.speed;
        if (p.x > canvas.width - 60) p.direction = Math.PI;
        if (p.x < 60) p.direction = 0;
      }

      // Mouth animation
      p.mouthAngle += p.mouthSpeed;
      if (p.mouthAngle > 0.42 || p.mouthAngle < 0.05) p.mouthSpeed *= -1;

      // Pellet Collisions
      g.pellets.forEach(dot => {
        if (!dot.eaten && Math.hypot(p.x - dot.x, p.y - dot.y) < 18) {
          dot.eaten = true;
          setScore(s => s + 10);
          soundEngine.playBlip();
        }
      });

      // Power Pellet Collisions
      g.powerPellets.forEach(pp => {
        if (!pp.eaten && Math.hypot(p.x - pp.x, p.y - pp.y) < 22) {
          pp.eaten = true;
          setScore(s => s + 50);
          setScaredGhostTimer(240);
          soundEngine.playFanfare();
          g.scorePills.push({ x: pp.x, y: pp.y - 20, text: 'POWER! +50', alpha: 1 });
        }
      });

      // Fruit Collisions
      g.fruits.forEach(f => {
        if (!f.eaten && Math.hypot(p.x - f.x, p.y - f.y) < 26) {
          f.eaten = true;
          setScore(s => s + 300);
          soundEngine.playFanfare();
          g.scorePills.push({ x: f.x, y: f.y - 20, text: 'BONUS! +300', alpha: 1 });
        }
      });

      // Event Station Collisions
      g.eventStations.forEach(st => {
        if (Math.hypot(p.x - st.x, p.y - st.y) < 28) {
          if (!st.eaten) {
            st.eaten = true;
            setActiveEvent(st);
            setScore(s => s + 200);
            soundEngine.playCoin();

            setEatenEventIds(prev => new Set([...prev, st.id]));
            g.scorePills.push({ x: st.x, y: st.y - 26, text: '+200 PTS', alpha: 1 });

            // 24 rainbow fireworks particles
            for (let i = 0; i < 24; i++) {
              const angle = Math.random() * Math.PI * 2;
              const spd = 2 + Math.random() * 5;
              g.particles.push({
                x: st.x,
                y: st.y,
                vx: Math.cos(angle) * spd,
                vy: Math.sin(angle) * spd,
                color: st.color,
                life: 35
              });
            }
          }
        }
      });

      // Draw Pac-Man with Glowing Aura & Sub-Pixel Mouth
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.direction);
      ctx.shadowColor = '#facc15';
      ctx.shadowBlur = 24;
      ctx.fillStyle = '#facc15';

      ctx.beginPath();
      ctx.arc(0, 0, p.radius, p.mouthAngle * Math.PI, (2 - p.mouthAngle) * Math.PI);
      ctx.lineTo(0, 0);
      ctx.closePath();
      ctx.fill();

      // Eye
      ctx.fillStyle = '#000000';
      ctx.beginPath();
      ctx.arc(-2, -10, 3, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // 9. Particles
      g.particles = g.particles.filter(pt => {
        pt.x += pt.vx;
        pt.y += pt.vy;
        pt.life -= 1;
        ctx.fillStyle = pt.color;
        ctx.fillRect(pt.x, pt.y, 3, 3);
        return pt.life > 0;
      });

      // 10. Floating Score Pills
      g.scorePills = g.scorePills.filter(sp => {
        sp.y -= 1.2;
        sp.alpha -= 0.025;
        ctx.save();
        ctx.font = 'bold 9px "Press Start 2P", monospace';
        ctx.fillStyle = `rgba(250, 204, 21, ${sp.alpha})`;
        ctx.textAlign = 'center';
        ctx.fillText(sp.text, sp.x, sp.y);
        ctx.restore();
        return sp.alpha > 0;
      });

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [isAutoCruise, scaredGhostTimer]);

  const toggleSound = () => {
    const next = !soundMuted;
    setSoundMuted(next);
    soundEngine.setMuted(next);
  };

  const filteredTimelineEvents = activeFilterDay === 'ALL' 
    ? allEvents 
    : allEvents.filter(e => e.day === activeFilterDay);

  return (
    <div className="relative w-full h-full flex flex-col bg-[#040108] text-white select-none overflow-hidden font-sans">
      
      {/* 1. TOP RETRO ARCADE MARQUEE */}
      <div className="flex-shrink-0 flex items-center justify-between px-3 sm:px-6 py-2 bg-[#070212] border-b-2 border-yellow-500/60 shadow-[0_4px_25px_rgba(250,204,21,0.25)]">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="w-4 h-4 rounded-full bg-yellow-400 inline-block shadow-[0_0_10px_#facc15]" />
            <span className="font-['Press_Start_2P'] text-[9px] sm:text-xs text-yellow-300">1UP</span>
          </div>
          <span className="font-['Press_Start_2P'] text-xs sm:text-sm text-white tracking-widest">
            {String(score).padStart(6, '0')}
          </span>
          <div className="hidden md:flex items-center gap-2 ml-4 text-xs font-['Press_Start_2P'] text-gray-400">
            <span>HIGH:</span>
            <span className="text-yellow-400">{String(highScore).padStart(6, '0')}</span>
          </div>
        </div>

        {/* Filter Pills: ALL (18) | DAY 1 (5) | DAY 2 (6) | DAY 3 (7) */}
        <div className="flex items-center gap-1 sm:gap-2">
          {[
            { key: 'ALL', label: 'ALL 18 EVENTS' },
            { key: 1, label: 'DAY 1' },
            { key: 2, label: 'DAY 2' },
            { key: 3, label: 'DAY 3' }
          ].map(f => (
            <button
              key={f.key}
              onClick={() => {
                soundEngine.playBlip();
                setActiveFilterDay(f.key);
              }}
              className={`px-2.5 sm:px-3 py-1 rounded-lg font-['Press_Start_2P'] text-[8px] sm:text-[9px] transition ${
                activeFilterDay === f.key
                  ? 'bg-yellow-400 text-black font-bold shadow-[0_0_15px_#facc15] scale-105'
                  : 'bg-black/60 text-gray-400 border border-gray-800 hover:text-white hover:border-gray-600'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={() => setIsAutoCruise(prev => !prev)}
            className={`px-2.5 py-1 rounded-lg border font-['Press_Start_2P'] text-[8px] sm:text-[9px] transition flex items-center gap-1.5 ${
              isAutoCruise
                ? 'bg-emerald-500 text-black border-emerald-300 font-bold shadow-[0_0_10px_#10b981]'
                : 'bg-gray-900 text-gray-300 border-gray-700'
            }`}
          >
            {isAutoCruise ? <Pause size={10} /> : <Play size={10} />}
            <span>{isAutoCruise ? 'CRUISING' : 'MANUAL'}</span>
          </button>

          <button
            onClick={toggleSound}
            className="p-1.5 rounded-lg bg-gray-900 border border-gray-700 hover:border-yellow-400 text-gray-300"
          >
            {soundMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
          </button>

          {onClose && (
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-red-950/80 border border-red-500 text-red-300 hover:bg-red-900 text-xs px-2 font-bold"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* 2. FULL 18-EVENT MAZE CANVAS */}
      <div className="relative flex-1 w-full bg-[#030107] min-h-[260px] overflow-hidden flex items-center justify-center p-1">
        <canvas
          ref={canvasRef}
          width={1000}
          height={380}
          className="w-full h-full max-h-[380px] object-contain drop-shadow-[0_0_20px_rgba(59,130,246,0.35)]"
        />

        {/* Mobile touch steer buttons */}
        <div className="absolute right-3 bottom-3 flex items-center gap-1.5 sm:hidden z-20">
          <button
            onClick={() => {
              const p = gameRef.current.pacman;
              p.speed = -Math.abs(p.speed);
              p.direction = Math.PI;
              setIsAutoCruise(false);
            }}
            className="w-9 h-9 rounded-xl bg-blue-900/90 border-2 border-blue-400 text-white font-bold text-sm shadow-[0_0_10px_#3b82f6]"
          >
            ◀
          </button>
          <button
            onClick={() => setIsAutoCruise(prev => !prev)}
            className="w-9 h-9 rounded-xl bg-yellow-400 text-black font-bold text-xs shadow-[0_0_10px_#facc15]"
          >
            ▶▶
          </button>
          <button
            onClick={() => {
              const p = gameRef.current.pacman;
              p.speed = Math.abs(p.speed);
              p.direction = 0;
              setIsAutoCruise(false);
            }}
            className="w-9 h-9 rounded-xl bg-blue-900/90 border-2 border-blue-400 text-white font-bold text-sm shadow-[0_0_10px_#3b82f6]"
          >
            ▶
          </button>
        </div>
      </div>

      {/* 3. ALL 18 EVENTS HORIZONTAL SCHEDULE SCROLLER */}
      <div className="flex-shrink-0 px-3 py-1.5 bg-[#060210] border-t border-blue-900/40 overflow-x-auto flex items-center gap-2">
        <span className="font-['Press_Start_2P'] text-[7.5px] text-gray-400 whitespace-nowrap pl-1">
          SCHEDULE ({eatenEventIds.size}/{allEvents.length} CHOMPED):
        </span>
        <div className="flex items-center gap-1.5 overflow-x-auto py-0.5">
          {filteredTimelineEvents.map((ev) => {
            const isSelected = activeEvent?.id === ev.id;
            const isEaten = eatenEventIds.has(ev.id);
            const tagColor = ev.day === 1 ? 'border-amber-500/60 text-amber-300' : ev.day === 2 ? 'border-cyan-500/60 text-cyan-300' : 'border-pink-500/60 text-pink-300';

            return (
              <button
                key={ev.id}
                onClick={() => {
                  soundEngine.playBlip();
                  setActiveEvent(ev);
                }}
                className={`flex-shrink-0 flex items-center gap-1 px-2.5 py-1 rounded-md border font-['Press_Start_2P'] text-[7.5px] transition-all ${
                  isSelected
                    ? 'bg-yellow-400 text-black border-yellow-300 font-bold shadow-[0_0_10px_#facc15] scale-105'
                    : isEaten
                    ? 'bg-emerald-950/40 border-emerald-600/50 text-emerald-300'
                    : `bg-black/50 ${tagColor} hover:border-white hover:text-white`
                }`}
              >
                <span>{isEaten ? '✓' : '•'}</span>
                <span className="truncate max-w-[100px]">{ev.title}</span>
                <span className="text-[6.5px] opacity-75">D{ev.day}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. ACTIVE EVENT CONSOLE */}
      {activeEvent && (
        <div className="flex-shrink-0 p-3 sm:p-4 bg-gradient-to-b from-[#080214] to-[#030107] border-t-2 border-yellow-500/50">
          <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
            
            {/* Left: Event Details */}
            <div className="flex-1 w-full text-left">
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2 py-0.5 rounded font-['Press_Start_2P'] text-[7.5px] bg-yellow-400 text-black font-bold uppercase">
                  DAY {activeEvent.day} • {activeEvent.category}
                </span>
                <span className="flex items-center gap-1 text-xs text-yellow-300 font-semibold">
                  <Clock size={11} className="text-yellow-400" />
                  <span>{activeEvent.time}</span>
                </span>
                <span className="flex items-center gap-1 text-xs text-pink-400 font-semibold ml-2">
                  <MapPin size={11} className="text-pink-400" />
                  <span>{activeEvent.venue}</span>
                </span>
              </div>

              <h2 className="font-['Press_Start_2P'] text-xs sm:text-base text-white font-bold tracking-wide">
                {activeEvent.title}
              </h2>

              <p className="text-gray-300 text-xs sm:text-sm mt-0.5 line-clamp-1 font-['Rajdhani',sans-serif] font-medium">
                {activeEvent.desc}
              </p>
            </div>

            {/* Right: Register CTA */}
            <div className="flex items-center gap-3 w-full md:w-auto justify-end">
              {activeEvent.registrationLink && (
                <a
                  href={activeEvent.registrationLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-300 hover:to-amber-400 text-black font-['Press_Start_2P'] text-[8.5px] font-bold shadow-[0_0_20px_rgba(250,204,21,0.6)] transition-all hover:scale-105 active:scale-95 flex items-center gap-2"
                >
                  <span>REGISTER ON UNSTOP</span>
                  <ExternalLink size={13} />
                </a>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 5. BOTTOM ACTION STRIP */}
      <div className="flex-shrink-0 flex items-center justify-between px-3 sm:px-6 py-2 bg-[#05010a] border-t border-purple-900/60">
        <button
          onClick={onBackToMap}
          className="px-3 py-1.5 rounded-lg bg-gray-900 border border-gray-700 hover:border-gray-500 text-gray-300 font-['Press_Start_2P'] text-[8px] sm:text-[9px]"
        >
          ◀ WORLD MAP
        </button>

        <span className="hidden sm:inline font-['Press_Start_2P'] text-[8px] text-gray-400">
          PAC-MAN LIVE 18-EVENT MAZE • REVERIE 2K27
        </span>

        <button
          onClick={() => {
            soundEngine.playJump();
            if (onAdvanceStage) onAdvanceStage();
          }}
          className="px-4 py-1.5 rounded-xl bg-yellow-400 hover:bg-yellow-300 text-black font-['Press_Start_2P'] text-[8px] sm:text-[9px] font-bold shadow-[0_0_15px_#facc15] flex items-center gap-1.5"
        >
          <span>NEXT STAGE</span>
          <ArrowRight size={13} />
        </button>
      </div>
    </div>
  );
}
