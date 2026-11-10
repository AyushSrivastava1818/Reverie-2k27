import React, { useState, useEffect, useRef } from 'react';
import { soundEngine } from '../../game/systems/SoundEngine';
import { festivalSchedule } from '../../data/schedule';
import { ExternalLink, Volume2, VolumeX, Sparkles, Trophy, ArrowRight, Play, Pause, MapPin, Clock, Calendar, Zap, Award } from 'lucide-react';

export function PacmanScheduleMaze({ onAdvanceStage, onClose, onBackToMap }) {
  const canvasRef = useRef(null);
  const [selectedDay, setSelectedDay] = useState(1);
  const [score, setScore] = useState(2650);
  const [highScore, setHighScore] = useState(9990);
  const [activeEvent, setActiveEvent] = useState(null);
  const [soundMuted, setSoundMuted] = useState(soundEngine.muted);
  const [isAutoCruise, setIsAutoCruise] = useState(true);
  const [scaredGhostTimer, setScaredGhostTimer] = useState(0);

  // Filter events for selected day
  const dayEvents = festivalSchedule.filter(e => e.day === selectedDay);

  // Advanced game state for full-screen 3-level authentic Pac-Man circuit
  const gameRef = useRef({
    // Multi-track circuit nodes covering the full canvas (0 to 1000 width, 50 to 380 height)
    trackNodes: [
      { x: 70, y: 70 }, { x: 300, y: 70 }, { x: 500, y: 70 }, { x: 700, y: 70 }, { x: 930, y: 70 },
      { x: 930, y: 200 }, { x: 750, y: 200 }, { x: 750, y: 340 }, { x: 930, y: 340 },
      { x: 700, y: 340 }, { x: 500, y: 340 }, { x: 300, y: 340 }, { x: 70, y: 340 },
      { x: 70, y: 200 }, { x: 250, y: 200 }, { x: 250, y: 70 },
      { x: 70, y: 70 }
    ],
    pacman: {
      x: 70,
      y: 70,
      speed: 3.6,
      nodeIndex: 0,
      radius: 22,
      mouthAngle: 0.22,
      mouthSpeed: 0.08,
      direction: 0
    },
    ghosts: [
      { x: 450, y: 200, targetX: 500, targetY: 70, speed: 2.2, color: '#ef4444', name: 'Blinky', eyeDir: 0 },
      { x: 480, y: 200, targetX: 300, targetY: 340, speed: 2.0, color: '#ec4899', name: 'Pinky', eyeDir: 0 },
      { x: 520, y: 200, targetX: 750, targetY: 70, speed: 2.1, color: '#06b6d4', name: 'Inky', eyeDir: 0 },
      { x: 550, y: 200, targetX: 700, targetY: 340, speed: 1.9, color: '#f97316', name: 'Clyde', eyeDir: 0 }
    ],
    pellets: [],
    powerPellets: [],
    fruits: [
      { x: 500, y: 200, type: 'cherry', eaten: false, bounce: 0 },
      { x: 500, y: 80, type: 'strawberry', eaten: false, bounce: 0 }
    ],
    eventStations: [],
    particles: [],
    scorePills: []
  });

  // Re-generate maze circuit and stations on day change
  useEffect(() => {
    const events = festivalSchedule.filter(e => e.day === selectedDay);
    const canvasWidth = 1000;
    
    // Stations distributed along the multi-track circuit
    // Half on top track (y: 70), half on bottom track (y: 340)
    const stations = events.map((ev, i) => {
      const isTop = i < Math.ceil(events.length / 2);
      const rowEvents = isTop ? Math.ceil(events.length / 2) : Math.floor(events.length / 2);
      const rowIndex = isTop ? i : i - Math.ceil(events.length / 2);
      const spacing = (canvasWidth - 260) / (rowEvents + 1);
      const x = 130 + spacing * (rowIndex + 1);
      const y = isTop ? 70 : 340;

      return {
        ...ev,
        x,
        y,
        radius: 28,
        eaten: i === 0,
        color: ev.category === 'flagship' ? '#f59e0b' : ev.category === 'technical' ? '#06b6d4' : '#ec4899',
        glowPulse: 0
      };
    });

    // Populate pellets along all corridors
    const dots = [];
    const pPellets = [
      { x: 70, y: 70, eaten: false },
      { x: 930, y: 70, eaten: false },
      { x: 70, y: 340, eaten: false },
      { x: 930, y: 340, eaten: false },
      { x: 500, y: 200, eaten: false }
    ];

    // Top rail dots (y: 70)
    for (let x = 100; x < canvasWidth - 100; x += 26) {
      if (!stations.some(s => Math.abs(s.x - x) < 38 && s.y === 70)) {
        dots.push({ x, y: 70, eaten: false });
      }
    }
    // Bottom rail dots (y: 340)
    for (let x = 100; x < canvasWidth - 100; x += 26) {
      if (!stations.some(s => Math.abs(s.x - x) < 38 && s.y === 340)) {
        dots.push({ x, y: 340, eaten: false });
      }
    }
    // Middle cross rail dots (y: 200)
    for (let x = 110; x < canvasWidth - 110; x += 32) {
      if (x < 420 || x > 580) {
        dots.push({ x, y: 200, eaten: false });
      }
    }
    // Vertical side chutes dots
    for (let y = 100; y < 320; y += 26) {
      dots.push({ x: 70, y, eaten: false });
      dots.push({ x: 930, y, eaten: false });
    }

    gameRef.current.eventStations = stations;
    gameRef.current.pellets = dots;
    gameRef.current.powerPellets = pPellets;
    gameRef.current.pacman.x = 70;
    gameRef.current.pacman.y = 70;
    gameRef.current.pacman.nodeIndex = 0;

    if (events[0]) setActiveEvent(events[0]);
  }, [selectedDay]);

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
      ctx.fillStyle = '#030108';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // CRT Scanline / Phosphor Glow
      ctx.save();
      ctx.strokeStyle = 'rgba(20, 15, 45, 0.5)';
      ctx.lineWidth = 1;
      for (let gy = 0; gy < canvas.height; gy += 14) {
        ctx.beginPath();
        ctx.moveTo(0, gy);
        ctx.lineTo(canvas.width, gy);
        ctx.stroke();
      }
      ctx.restore();

      // 2. Draw Multi-Level Neon Labyrinth Walls (Namco High-Glow Double Blue)
      ctx.save();
      ctx.shadowColor = '#2563eb';
      ctx.shadowBlur = 18;
      ctx.strokeStyle = '#3b82f6';
      ctx.lineWidth = 4;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      // Outer Perimeter Neon Wall
      ctx.beginPath();
      ctx.roundRect(30, 30, canvas.width - 60, 350, 32);
      ctx.stroke();

      // Upper Corridor Partition
      ctx.strokeStyle = '#1d4ed8';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.roundRect(140, 110, 240, 55, 14);
      ctx.roundRect(620, 110, 240, 55, 14);
      ctx.stroke();

      // Lower Corridor Partition
      ctx.beginPath();
      ctx.roundRect(140, 245, 240, 55, 14);
      ctx.roundRect(620, 245, 240, 55, 14);
      ctx.stroke();

      // Central Ghost Lair with Neon Barrier
      ctx.shadowColor = '#ec4899';
      ctx.shadowBlur = 22;
      ctx.strokeStyle = '#ec4899';
      ctx.fillStyle = 'rgba(18, 6, 40, 0.95)';
      ctx.beginPath();
      ctx.roundRect(420, 165, 160, 70, 14);
      ctx.fill();
      ctx.stroke();

      // Ghost Lair Neon Gateway
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(465, 165);
      ctx.lineTo(535, 165);
      ctx.stroke();

      ctx.font = 'bold 8px "Press Start 2P", monospace';
      ctx.fillStyle = '#f472b6';
      ctx.textAlign = 'center';
      ctx.fillText('GHOST LAIR', 500, 204);

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
        const pulse = 7 + Math.sin(frameCount * 0.12) * 3;
        ctx.shadowColor = '#facc15';
        ctx.shadowBlur = 20;
        ctx.fillStyle = '#fef08a';
        ctx.beginPath();
        ctx.arc(pp.x, pp.y, pulse, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      // 5. Draw Bonus Cherries in Corridors
      g.fruits.forEach(f => {
        if (f.eaten) return;
        f.bounce = Math.sin(frameCount * 0.08) * 4;
        ctx.save();
        ctx.shadowColor = '#ef4444';
        ctx.shadowBlur = 18;
        // Two cherry spheres
        ctx.fillStyle = '#dc2626';
        ctx.beginPath();
        ctx.arc(f.x - 7, f.y + f.bounce, 8, 0, Math.PI * 2);
        ctx.arc(f.x + 7, f.y + 4 + f.bounce, 8, 0, Math.PI * 2);
        ctx.fill();
        // Green stem
        ctx.strokeStyle = '#22c55e';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.moveTo(f.x - 7, f.y - 8 + f.bounce);
        ctx.quadraticCurveTo(f.x, f.y - 20 + f.bounce, f.x + 9, f.y - 14 + f.bounce);
        ctx.moveTo(f.x + 7, f.y - 4 + f.bounce);
        ctx.quadraticCurveTo(f.x, f.y - 20 + f.bounce, f.x + 9, f.y - 14 + f.bounce);
        ctx.stroke();
        ctx.restore();
      });

      // 6. Draw Grand Festival Event Stations
      g.eventStations.forEach(st => {
        st.glowPulse = Math.sin(frameCount * 0.08) * 6;
        ctx.save();
        ctx.shadowColor = st.color;
        ctx.shadowBlur = st.eaten ? 14 : 32 + st.glowPulse;

        // Outer Rotating Orbit Ring
        ctx.strokeStyle = st.color;
        ctx.lineWidth = 3.5;
        ctx.fillStyle = st.eaten ? 'rgba(8, 4, 20, 0.95)' : 'rgba(32, 12, 65, 0.95)';
        ctx.beginPath();
        ctx.arc(st.x, st.y, st.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // Inner glowing core
        ctx.fillStyle = st.eaten ? '#22c55e' : st.color;
        ctx.beginPath();
        ctx.arc(st.x, st.y, 9, 0, Math.PI * 2);
        ctx.fill();

        // Star / Check Icon inside
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 10px "Press Start 2P", monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(st.eaten ? '✓' : '★', st.x, st.y);

        // Time Tag above
        ctx.font = 'bold 9px "Press Start 2P", monospace';
        ctx.fillStyle = st.color;
        const timeShort = st.time.split('-')[0].trim();
        ctx.fillText(timeShort, st.x, st.y - (st.y > 200 ? -40 : 38));

        // Event Title below
        ctx.font = '8px "Press Start 2P", monospace';
        ctx.fillStyle = '#ffffff';
        const titleShort = st.title.length > 13 ? st.title.slice(0, 11) + '..' : st.title;
        ctx.fillText(titleShort, st.x, st.y + (st.y > 200 ? -42 : 40));

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
        ctx.arc(ghost.x, ghost.y - 4, 16, Math.PI, 0, false);
        ctx.lineTo(ghost.x + 16, ghost.y + 12);
        // Wavy skirt
        const wave = Math.sin(frameCount * 0.25) * 3.5;
        ctx.lineTo(ghost.x + 8, ghost.y + 9 + wave);
        ctx.lineTo(ghost.x, ghost.y + 13);
        ctx.lineTo(ghost.x - 8, ghost.y + 9 - wave);
        ctx.lineTo(ghost.x - 16, ghost.y + 12);
        ctx.closePath();
        ctx.fill();

        // Eyes
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(ghost.x - 6, ghost.y - 6, 4.5, 0, Math.PI * 2);
        ctx.arc(ghost.x + 6, ghost.y - 6, 4.5, 0, Math.PI * 2);
        ctx.fill();

        // Pupils
        ctx.fillStyle = '#1e3a8a';
        const px = Math.cos(ghost.eyeDir) * 2;
        const py = Math.sin(ghost.eyeDir) * 2;
        ctx.beginPath();
        ctx.arc(ghost.x - 6 + px, ghost.y - 6 + py, 2.2, 0, Math.PI * 2);
        ctx.arc(ghost.x + 6 + px, ghost.y - 6 + py, 2.2, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
      });

      if (scaredGhostTimer > 0) setScaredGhostTimer(t => t - 1);

      // 8. Update & Draw Moving Pac-Man
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
      if (p.mouthAngle > 0.42 || p.mouthAngle < 0.05) p.mouthSpeed *= -1;

      // Pellet Collisions
      g.pellets.forEach(dot => {
        if (!dot.eaten && Math.hypot(p.x - dot.x, p.y - dot.y) < 20) {
          dot.eaten = true;
          setScore(s => s + 10);
          soundEngine.playBlip();
        }
      });

      // Power Pellet Collisions
      g.powerPellets.forEach(pp => {
        if (!pp.eaten && Math.hypot(p.x - pp.x, p.y - pp.y) < 24) {
          pp.eaten = true;
          setScore(s => s + 50);
          setScaredGhostTimer(240);
          soundEngine.playFanfare();
          g.scorePills.push({ x: pp.x, y: pp.y - 22, text: 'POWER! +50', alpha: 1 });
        }
      });

      // Cherry Fruit Collisions
      g.fruits.forEach(f => {
        if (!f.eaten && Math.hypot(p.x - f.x, p.y - f.y) < 28) {
          f.eaten = true;
          setScore(s => s + 300);
          soundEngine.playFanfare();
          g.scorePills.push({ x: f.x, y: f.y - 24, text: 'CHERRY! +300', alpha: 1 });
        }
      });

      // Event Station Collisions
      g.eventStations.forEach(st => {
        if (Math.hypot(p.x - st.x, p.y - st.y) < 30) {
          if (!st.eaten) {
            st.eaten = true;
            setActiveEvent(st);
            setScore(s => s + 200);
            soundEngine.playCoin();

            g.scorePills.push({ x: st.x, y: st.y - 28, text: '+200 PTS', alpha: 1 });

            // 28 fireworks particles
            for (let i = 0; i < 28; i++) {
              const angle = Math.random() * Math.PI * 2;
              const spd = 2 + Math.random() * 5.5;
              g.particles.push({
                x: st.x,
                y: st.y,
                vx: Math.cos(angle) * spd,
                vy: Math.sin(angle) * spd,
                color: st.color,
                life: 38
              });
            }
          }
        }
      });

      // Draw Pac-Man
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.direction);
      ctx.shadowColor = '#facc15';
      ctx.shadowBlur = 26;
      ctx.fillStyle = '#facc15';

      ctx.beginPath();
      ctx.arc(0, 0, p.radius, p.mouthAngle * Math.PI, (2 - p.mouthAngle) * Math.PI);
      ctx.lineTo(0, 0);
      ctx.closePath();
      ctx.fill();

      // Eye
      ctx.fillStyle = '#000000';
      ctx.beginPath();
      ctx.arc(-2, -11, 3.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // 9. Particles
      g.particles = g.particles.filter(pt => {
        pt.x += pt.vx;
        pt.y += pt.vy;
        pt.life -= 1;
        ctx.fillStyle = pt.color;
        ctx.fillRect(pt.x, pt.y, 3.5, 3.5);
        return pt.life > 0;
      });

      // 10. Score Pills
      g.scorePills = g.scorePills.filter(sp => {
        sp.y -= 1.3;
        sp.alpha -= 0.025;
        ctx.save();
        ctx.font = 'bold 9.5px "Press Start 2P", monospace';
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

  return (
    <div className="relative w-full h-full flex flex-col bg-[#04010a] text-white select-none overflow-hidden font-sans">
      
      {/* 1. TOP RETRO ARCADE MARQUEE */}
      <div className="flex-shrink-0 flex items-center justify-between px-3 sm:px-6 py-2.5 bg-[#080214] border-b-2 border-yellow-500/60 shadow-[0_4px_25px_rgba(250,204,21,0.25)]">
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

        {/* Day Switcher Pills */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {[1, 2, 3].map(day => (
            <button
              key={day}
              onClick={() => {
                soundEngine.playBlip();
                setSelectedDay(day);
              }}
              className={`px-3 py-1.5 rounded-lg font-['Press_Start_2P'] text-[8px] sm:text-[9px] transition ${
                selectedDay === day
                  ? 'bg-yellow-400 text-black font-bold shadow-[0_0_15px_#facc15] scale-105'
                  : 'bg-black/60 text-gray-400 border border-gray-800 hover:text-white hover:border-gray-600'
              }`}
            >
              DAY 0{day}
            </button>
          ))}
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={() => setIsAutoCruise(prev => !prev)}
            className={`px-3 py-1.5 rounded-lg border font-['Press_Start_2P'] text-[8px] sm:text-[9px] transition flex items-center gap-1.5 ${
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
            {soundMuted ? <VolumeX size={15} /> : <Volume2 size={15} />}
          </button>

          {onClose && (
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-red-950/80 border border-red-500 text-red-300 hover:bg-red-900 text-xs px-2.5 font-bold"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* 2. FULL-CABINET MULTI-LEVEL PAC-MAN MAZE CANVAS */}
      <div className="relative flex-1 w-full bg-[#030108] min-h-[300px] overflow-hidden flex items-center justify-center p-1 sm:p-2">
        <canvas
          ref={canvasRef}
          width={1000}
          height={410}
          className="w-full h-full max-h-[420px] object-contain drop-shadow-[0_0_20px_rgba(59,130,246,0.35)]"
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
            className="w-10 h-10 rounded-xl bg-blue-900/90 border-2 border-blue-400 text-white font-bold text-sm shadow-[0_0_10px_#3b82f6] active:scale-95"
          >
            ◀
          </button>
          <button
            onClick={() => setIsAutoCruise(prev => !prev)}
            className="w-10 h-10 rounded-xl bg-yellow-400 text-black font-bold text-xs shadow-[0_0_10px_#facc15] active:scale-95"
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
            className="w-10 h-10 rounded-xl bg-blue-900/90 border-2 border-blue-400 text-white font-bold text-sm shadow-[0_0_10px_#3b82f6] active:scale-95"
          >
            ▶
          </button>
        </div>
      </div>

      {/* 3. LOWER RETRO ARCADE EVENT CONSOLE */}
      {activeEvent && (
        <div className="flex-shrink-0 p-3 sm:p-4 bg-gradient-to-b from-[#080214] to-[#030108] border-t-2 border-yellow-500/50">
          <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
            
            {/* Left: Event Details */}
            <div className="flex-1 w-full text-left">
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2 py-0.5 rounded font-['Press_Start_2P'] text-[8px] bg-yellow-400 text-black font-bold uppercase">
                  {activeEvent.category}
                </span>
                <span className="flex items-center gap-1 text-xs text-yellow-300 font-semibold">
                  <Clock size={12} className="text-yellow-400" />
                  <span>{activeEvent.time}</span>
                </span>
                <span className="flex items-center gap-1 text-xs text-pink-400 font-semibold ml-2">
                  <MapPin size={12} className="text-pink-400" />
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
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-300 hover:to-amber-400 text-black font-['Press_Start_2P'] text-[9px] font-bold shadow-[0_0_20px_rgba(250,204,21,0.6)] transition-all hover:scale-105 active:scale-95 flex items-center gap-2"
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
      <div className="flex-shrink-0 flex items-center justify-between px-3 sm:px-6 py-2 bg-[#05010c] border-t border-purple-900/60">
        <button
          onClick={onBackToMap}
          className="px-3 py-1.5 rounded-lg bg-gray-900 border border-gray-700 hover:border-gray-500 text-gray-300 font-['Press_Start_2P'] text-[8px] sm:text-[9px]"
        >
          ◀ WORLD MAP
        </button>

        <span className="hidden sm:inline font-['Press_Start_2P'] text-[8px] text-gray-400">
          PAC-MAN CHOMPING FESTIVAL SCHEDULE • DAY {selectedDay}
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
