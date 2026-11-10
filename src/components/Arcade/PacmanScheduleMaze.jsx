import React, { useState, useEffect, useRef } from 'react';
import { soundEngine } from '../../game/systems/SoundEngine';
import { festivalSchedule } from '../../data/schedule';
import { ExternalLink, Volume2, VolumeX, Sparkles, Trophy, ArrowRight, Play, Pause, MapPin, Clock, Calendar, Zap, Award } from 'lucide-react';

export function PacmanScheduleMaze({ onAdvanceStage, onClose, onBackToMap }) {
  const canvasRef = useRef(null);
  const [score, setScore] = useState(3800);
  const [highScore, setHighScore] = useState(9990);
  const [activeEvent, setActiveEvent] = useState(festivalSchedule[0]);
  const [soundMuted, setSoundMuted] = useState(soundEngine.muted);
  const [isAutoCruise, setIsAutoCruise] = useState(true);
  const [scaredGhostTimer, setScaredGhostTimer] = useState(0);
  const [eatenEventIds, setEatenEventIds] = useState(new Set([festivalSchedule[0]?.id]));

  // All 18 events from schedule data
  const allEvents = festivalSchedule;

  // Full-frame multi-level Pac-Man circuit state
  const gameRef = useRef({
    // Grand looping track through all 3 days
    // Lane 1: Top (y: 85), Lane 2: Mid (y: 235), Lane 3: Bot (y: 385)
    trackNodes: [
      // Day 1 Top Rail
      { x: 70, y: 85 }, { x: 300, y: 85 }, { x: 500, y: 85 }, { x: 700, y: 85 }, { x: 930, y: 85 },
      // Right chute to Day 2
      { x: 930, y: 235 },
      // Day 2 Middle Rail (Right to Left)
      { x: 750, y: 235 }, { x: 580, y: 235 }, { x: 420, y: 235 }, { x: 250, y: 235 }, { x: 70, y: 235 },
      // Left chute to Day 3
      { x: 70, y: 385 },
      // Day 3 Bottom Rail (Left to Right)
      { x: 230, y: 385 }, { x: 390, y: 385 }, { x: 550, y: 385 }, { x: 710, y: 385 }, { x: 870, y: 385 }, { x: 930, y: 385 },
      // Right loop return up to Day 1
      { x: 930, y: 85 },
      { x: 70, y: 85 }
    ],
    // BIGGER PAC-MAN (Radius 34px - High impact presence)
    pacman: {
      x: 70,
      y: 85,
      speed: 4.0,
      nodeIndex: 0,
      radius: 32,
      mouthAngle: 0.24,
      mouthSpeed: 0.08,
      direction: 0
    },
    // 2 Sleek patrolling ghosts along the rails
    ghosts: [
      { x: 300, y: 85, targetX: 930, targetY: 85, speed: 2.5, color: '#ec4899', name: 'Pinky', eyeDir: 0 },
      { x: 750, y: 235, targetX: 70, targetY: 235, speed: 2.5, color: '#06b6d4', name: 'Inky', eyeDir: 0 }
    ],
    pellets: [],
    powerPellets: [],
    eventStations: [],
    particles: []
  });

  // Populate all 18 events and pellets across all 3 days in the maze
  useEffect(() => {
    const canvasWidth = 1000;
    
    // Group events into all 3 days
    const day1Events = allEvents.filter(e => e.day === 1);
    const day2Events = allEvents.filter(e => e.day === 2);
    const day3Events = allEvents.filter(e => e.day === 3);

    const stations = [];

    // Helper to position each row of events
    const placeRow = (events, yPos, startX, endX, color) => {
      const spacing = (endX - startX) / (events.length + 1);
      events.forEach((ev, i) => {
        stations.push({
          ...ev,
          x: startX + spacing * (i + 1),
          y: yPos,
          radius: 30, // Bigger event station sphere
          eaten: eatenEventIds.has(ev.id),
          color,
          glowPulse: 0
        });
      });
    };

    placeRow(day1Events, 85, 90, canvasWidth - 90, '#f59e0b');
    placeRow(day2Events, 235, 90, canvasWidth - 90, '#06b6d4');
    placeRow(day3Events, 385, 90, canvasWidth - 90, '#ec4899');

    // Populate pellets across the 3 rails and vertical chutes
    const dots = [];
    const pPellets = [
      { x: 70, y: 85, eaten: false },
      { x: 930, y: 85, eaten: false },
      { x: 70, y: 235, eaten: false },
      { x: 930, y: 235, eaten: false },
      { x: 70, y: 385, eaten: false },
      { x: 930, y: 385, eaten: false }
    ];

    // Pellets along the 3 horizontal rails
    [85, 235, 385].forEach(yRail => {
      for (let x = 90; x < canvasWidth - 90; x += 30) {
        if (!stations.some(s => Math.abs(s.x - x) < 42 && s.y === yRail)) {
          dots.push({ x, y: yRail, eaten: false });
        }
      }
    });

    // Connecting vertical chute pellets
    for (let y = 115; y < 215; y += 26) {
      dots.push({ x: 930, y, eaten: false });
    }
    for (let y = 265; y < 365; y += 26) {
      dots.push({ x: 70, y, eaten: false });
      dots.push({ x: 930, y, eaten: false });
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

      // 1. Full-Frame Dark Space Arcade Background
      ctx.fillStyle = '#030107';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Subtle Phosphor Grid
      ctx.save();
      ctx.strokeStyle = 'rgba(25, 18, 55, 0.45)';
      ctx.lineWidth = 1;
      for (let gy = 0; gy < canvas.height; gy += 16) {
        ctx.beginPath();
        ctx.moveTo(0, gy);
        ctx.lineTo(canvas.width, gy);
        ctx.stroke();
      }
      ctx.restore();

      // 2. ALL 3 DAYS NEON CORRIDORS IN ONE FRAME
      ctx.save();
      ctx.shadowColor = '#2563eb';
      ctx.shadowBlur = 20;
      ctx.strokeStyle = '#3b82f6';
      ctx.lineWidth = 4.5;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      // Outer Perimeter Neon Wall
      ctx.beginPath();
      ctx.roundRect(25, 20, canvas.width - 50, 430, 32);
      ctx.stroke();

      // Horizontal Corridor Dividers
      ctx.strokeStyle = '#1d4ed8';
      ctx.lineWidth = 3.5;
      
      // Divider 1 (Between Day 1 and Day 2)
      ctx.beginPath();
      ctx.roundRect(110, 140, 340, 40, 12);
      ctx.roundRect(550, 140, 340, 40, 12);
      ctx.stroke();

      // Divider 2 (Between Day 2 and Day 3)
      ctx.beginPath();
      ctx.roundRect(110, 290, 340, 40, 12);
      ctx.roundRect(550, 290, 340, 40, 12);
      ctx.stroke();

      // ALL 3 DAYS HEADERS PROMINENTLY LABELED RIGHT IN THE MAZE
      ctx.font = 'bold 10px "Press Start 2P", monospace';

      // Day 1 Header Tag
      ctx.fillStyle = '#f59e0b';
      ctx.shadowColor = '#f59e0b';
      ctx.shadowBlur = 12;
      ctx.fillText('★ DAY 01: INAUGURATION & HACK SPRINT ★', 45, 42);

      // Day 2 Header Tag
      ctx.fillStyle = '#06b6d4';
      ctx.shadowColor = '#06b6d4';
      ctx.fillText('★ DAY 02: 24H CODE WAR & ROBOTICS ★', 45, 192);

      // Day 3 Header Tag
      ctx.fillStyle = '#ec4899';
      ctx.shadowColor = '#ec4899';
      ctx.fillText('★ DAY 03: SHOWCASE & PRONITE CONCERT ★', 45, 342);

      ctx.restore();

      // 3. Draw Regular Pellets
      g.pellets.forEach(dot => {
        if (dot.eaten) return;
        ctx.save();
        ctx.fillStyle = '#fed7aa';
        ctx.beginPath();
        ctx.arc(dot.x, dot.y, 3.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      // 4. Draw Pulsing Power Pellets
      g.powerPellets.forEach(pp => {
        if (pp.eaten) return;
        ctx.save();
        const pulse = 8 + Math.sin(frameCount * 0.12) * 3;
        ctx.shadowColor = '#facc15';
        ctx.shadowBlur = 22;
        ctx.fillStyle = '#fef08a';
        ctx.beginPath();
        ctx.arc(pp.x, pp.y, pulse, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      // 5. Draw ALL 18 Grand Event Stations Across Day 1, Day 2, and Day 3
      g.eventStations.forEach(st => {
        st.glowPulse = Math.sin(frameCount * 0.08) * 6;
        const isFocused = activeEvent?.id === st.id;

        ctx.save();
        ctx.shadowColor = st.color;
        ctx.shadowBlur = isFocused ? 38 : st.eaten ? 12 : 24 + st.glowPulse;

        // Outer Rotating Orbit Ring
        ctx.strokeStyle = isFocused ? '#facc15' : st.color;
        ctx.lineWidth = isFocused ? 4.5 : 3;
        ctx.fillStyle = isFocused ? 'rgba(48, 18, 85, 0.95)' : st.eaten ? 'rgba(8, 4, 18, 0.95)' : 'rgba(28, 10, 55, 0.95)';
        ctx.beginPath();
        ctx.arc(st.x, st.y, st.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // Inner glowing core
        ctx.fillStyle = st.eaten ? '#22c55e' : st.color;
        ctx.beginPath();
        ctx.arc(st.x, st.y, 10, 0, Math.PI * 2);
        ctx.fill();

        // Star / Check Icon inside
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 11px monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(st.eaten ? '✓' : '★', st.x, st.y);

        // Time Tag Pill above
        const timeShort = st.time.split('-')[0].trim();
        ctx.font = 'bold 9px monospace';
        const tw = ctx.measureText(timeShort).width;
        ctx.fillStyle = 'rgba(0, 0, 0, 0.85)';
        ctx.beginPath();
        ctx.roundRect(st.x - tw / 2 - 5, st.y - 44, tw + 10, 14, 4);
        ctx.fill();
        ctx.strokeStyle = st.color;
        ctx.lineWidth = 1;
        ctx.stroke();

        ctx.fillStyle = st.color;
        ctx.fillText(timeShort, st.x, st.y - 34);

        // Event Title below with readable dark backdrop pill
        const titleShort = st.title.length > 12 ? st.title.slice(0, 10) + '..' : st.title;
        ctx.font = 'bold 9px monospace';
        const ew = ctx.measureText(titleShort).width;
        ctx.fillStyle = 'rgba(5, 2, 14, 0.88)';
        ctx.beginPath();
        ctx.roundRect(st.x - ew / 2 - 5, st.y + 32, ew + 10, 14, 4);
        ctx.fill();
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
        ctx.lineWidth = 0.8;
        ctx.stroke();

        ctx.fillStyle = '#ffffff';
        ctx.fillText(titleShort, st.x, st.y + 42);

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

        // Ghost Dome Head (Radius 18)
        ctx.beginPath();
        ctx.arc(ghost.x, ghost.y - 4, 18, Math.PI, 0, false);
        ctx.lineTo(ghost.x + 18, ghost.y + 14);
        const wave = Math.sin(frameCount * 0.25) * 3.5;
        ctx.lineTo(ghost.x + 10, ghost.y + 10 + wave);
        ctx.lineTo(ghost.x, ghost.y + 14);
        ctx.lineTo(ghost.x - 10, ghost.y + 10 - wave);
        ctx.lineTo(ghost.x - 18, ghost.y + 14);
        ctx.closePath();
        ctx.fill();

        // Eyes
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(ghost.x - 7, ghost.y - 6, 5, 0, Math.PI * 2);
        ctx.arc(ghost.x + 7, ghost.y - 6, 5, 0, Math.PI * 2);
        ctx.fill();

        // Pupils
        ctx.fillStyle = '#1e3a8a';
        const px = Math.cos(ghost.eyeDir) * 2.5;
        const py = Math.sin(ghost.eyeDir) * 2.5;
        ctx.beginPath();
        ctx.arc(ghost.x - 7 + px, ghost.y - 6 + py, 2.5, 0, Math.PI * 2);
        ctx.arc(ghost.x + 7 + px, ghost.y - 6 + py, 2.5, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
      });

      if (scaredGhostTimer > 0) setScaredGhostTimer(t => t - 1);

      // 8. Update & Draw BIGGER PAC-MAN (Continuous Smooth Cruise)
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
        if (p.x > canvas.width - 70) p.direction = Math.PI;
        if (p.x < 70) p.direction = 0;
      }

      // Mouth animation
      p.mouthAngle += p.mouthSpeed;
      if (p.mouthAngle > 0.44 || p.mouthAngle < 0.05) p.mouthSpeed *= -1;

      // Pellet Collisions
      g.pellets.forEach(dot => {
        if (!dot.eaten && Math.hypot(p.x - dot.x, p.y - dot.y) < 24) {
          dot.eaten = true;
          setScore(s => s + 10);
          soundEngine.playBlip();
        }
      });

      // Power Pellet Collisions
      g.powerPellets.forEach(pp => {
        if (!pp.eaten && Math.hypot(p.x - pp.x, p.y - pp.y) < 26) {
          pp.eaten = true;
          setScore(s => s + 50);
          setScaredGhostTimer(240);
          soundEngine.playFanfare();
        }
      });

      // Event Station Collisions
      g.eventStations.forEach(st => {
        if (Math.hypot(p.x - st.x, p.y - st.y) < 34) {
          if (!st.eaten) {
            st.eaten = true;
            setActiveEvent(st);
            setScore(s => s + 200);
            soundEngine.playCoin();

            setEatenEventIds(prev => new Set([...prev, st.id]));

            // Crisp rainbow fireworks particles
            for (let i = 0; i < 20; i++) {
              const angle = Math.random() * Math.PI * 2;
              const spd = 2 + Math.random() * 4.5;
              g.particles.push({
                x: st.x,
                y: st.y,
                vx: Math.cos(angle) * spd,
                vy: Math.sin(angle) * spd,
                color: st.color,
                life: 30
              });
            }
          }
        }
      });

      // DRAW BIG PAC-MAN (Radius 32px with vibrant glow aura)
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.direction);
      ctx.shadowColor = '#facc15';
      ctx.shadowBlur = 30;
      ctx.fillStyle = '#facc15';

      ctx.beginPath();
      ctx.arc(0, 0, p.radius, p.mouthAngle * Math.PI, (2 - p.mouthAngle) * Math.PI);
      ctx.lineTo(0, 0);
      ctx.closePath();
      ctx.fill();

      // Pac-Man Eye
      ctx.fillStyle = '#000000';
      ctx.beginPath();
      ctx.arc(-2, -15, 4.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // Fireworks Particles
      g.particles = g.particles.filter(pt => {
        pt.x += pt.vx;
        pt.y += pt.vy;
        pt.life -= 1;
        ctx.fillStyle = pt.color;
        ctx.fillRect(pt.x, pt.y, 3, 3);
        return pt.life > 0;
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

  return (
    <div className="relative w-full h-full flex flex-col bg-[#030107] text-white select-none overflow-hidden font-sans">
      
      {/* 1. TOP ARCADE MARQUEE */}
      <div className="flex-shrink-0 flex items-center justify-between px-3 sm:px-6 py-2 bg-[#070212] border-b-2 border-yellow-500/60 shadow-[0_4px_25px_rgba(250,204,21,0.25)]">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="w-5 h-5 rounded-full bg-yellow-400 inline-block shadow-[0_0_12px_#facc15]" />
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

        {/* Status: Day 1 + Day 2 + Day 3 all live */}
        <div className="flex items-center gap-2 font-['Press_Start_2P'] text-[8px] sm:text-[9px]">
          <span className="px-2.5 py-1 rounded bg-amber-950/80 border border-amber-500/60 text-amber-300">
            DAY 1 (5)
          </span>
          <span className="px-2.5 py-1 rounded bg-cyan-950/80 border border-cyan-500/60 text-cyan-300">
            DAY 2 (6)
          </span>
          <span className="px-2.5 py-1 rounded bg-pink-950/80 border border-pink-500/60 text-pink-300">
            DAY 3 (7)
          </span>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={() => setIsAutoCruise(prev => !prev)}
            className={`px-3 py-1 rounded-lg border font-['Press_Start_2P'] text-[8px] sm:text-[9px] transition flex items-center gap-1.5 ${
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

      {/* 2. FULL-FRAME MAZE CANVAS (ALL 3 DAYS IN ONE FRAME) */}
      <div className="relative flex-1 w-full bg-[#030107] min-h-[380px] sm:min-h-[440px] overflow-hidden flex items-center justify-center p-0.5">
        <canvas
          ref={canvasRef}
          width={1000}
          height={470}
          className="w-full h-full max-h-[480px] object-contain drop-shadow-[0_0_25px_rgba(59,130,246,0.4)]"
        />

        {/* Mobile touch steering */}
        <div className="absolute right-4 bottom-4 flex items-center gap-2 sm:hidden z-20">
          <button
            onClick={() => {
              const p = gameRef.current.pacman;
              p.speed = -Math.abs(p.speed);
              p.direction = Math.PI;
              setIsAutoCruise(false);
            }}
            className="w-10 h-10 rounded-xl bg-blue-900/90 border-2 border-blue-400 text-white font-bold text-sm shadow-[0_0_10px_#3b82f6]"
          >
            ◀
          </button>
          <button
            onClick={() => setIsAutoCruise(prev => !prev)}
            className="w-10 h-10 rounded-xl bg-yellow-400 text-black font-bold text-xs shadow-[0_0_10px_#facc15]"
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
            className="w-10 h-10 rounded-xl bg-blue-900/90 border-2 border-blue-400 text-white font-bold text-sm shadow-[0_0_10px_#3b82f6]"
          >
            ▶
          </button>
        </div>
      </div>

      {/* 3. ACTIVE EVENT CONSOLE */}
      {activeEvent && (
        <div className="flex-shrink-0 p-3 bg-gradient-to-b from-[#080214] to-[#030107] border-t-2 border-yellow-500/50">
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

      {/* 4. BOTTOM ACTION STRIP */}
      <div className="flex-shrink-0 flex items-center justify-between px-3 sm:px-6 py-2 bg-[#05010a] border-t border-purple-900/60">
        <button
          onClick={onBackToMap}
          className="px-3 py-1.5 rounded-lg bg-gray-900 border border-gray-700 hover:border-gray-500 text-gray-300 font-['Press_Start_2P'] text-[8px] sm:text-[9px]"
        >
          ◀ WORLD MAP
        </button>

        <span className="hidden sm:inline font-['Press_Start_2P'] text-[8px] text-gray-400">
          ALL 3 DAYS LIVE IN ONE CONTINUOUS PAC-MAN MAZE
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
