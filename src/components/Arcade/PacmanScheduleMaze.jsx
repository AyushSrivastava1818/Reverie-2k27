import React, { useState, useEffect, useRef } from 'react';
import { soundEngine } from '../../game/systems/SoundEngine';
import { festivalSchedule } from '../../data/schedule';
import { ExternalLink, Volume2, VolumeX, Sparkles, Trophy, ArrowRight, Play, Pause } from 'lucide-react';

export function PacmanScheduleMaze({ onAdvanceStage, onClose, onBackToMap }) {
  const canvasRef = useRef(null);
  const [selectedDay, setSelectedDay] = useState(1);
  const [score, setScore] = useState(1400);
  const [activeEvent, setActiveEvent] = useState(null);
  const [soundMuted, setSoundMuted] = useState(soundEngine.muted);
  const [isAutoCruise, setIsAutoCruise] = useState(true);

  // Filter events for selected day
  const dayEvents = festivalSchedule.filter(e => e.day === selectedDay);

  // Game state reference for 60 FPS animation loop
  const gameRef = useRef({
    pacman: {
      x: 60,
      y: 180,
      vx: 3.2,
      vy: 0,
      targetVx: 3.2,
      targetVy: 0,
      radius: 20,
      mouthAngle: 0.2,
      mouthSpeed: 0.06,
      direction: 0 // radians
    },
    ghosts: [
      { x: 300, y: 180, vx: 1.8, vy: 0, color: '#ef4444', name: 'Blinky' },
      { x: 450, y: 180, vx: -1.6, vy: 0, color: '#ec4899', name: 'Pinky' },
      { x: 620, y: 180, vx: 1.7, vy: 0, color: '#06b6d4', name: 'Inky' },
      { x: 780, y: 180, vx: -1.5, vy: 0, color: '#f97316', name: 'Clyde' }
    ],
    pellets: [],
    eventOrbs: [],
    particles: [],
    scorePills: [],
    pathY: 180
  });

  // Rebuild track & milestones when selected day changes
  useEffect(() => {
    const events = festivalSchedule.filter(e => e.day === selectedDay);
    const canvasWidth = 1000;
    const spacing = canvasWidth / (events.length + 1);

    // Place event orbs evenly along the track
    const orbs = events.map((ev, i) => ({
      ...ev,
      x: spacing * (i + 1),
      y: 180,
      radius: 26,
      eaten: false,
      color: ev.category === 'flagship' ? '#f59e0b' : ev.category === 'technical' ? '#06b6d4' : '#ec4899'
    }));

    // Place dots along the track
    const dots = [];
    for (let x = 30; x < canvasWidth - 30; x += 22) {
      // Don't place dot right on an orb
      if (!orbs.some(o => Math.abs(o.x - x) < 32)) {
        dots.push({ x, y: 180, eaten: false, isPower: x % 160 < 25 });
      }
    }

    gameRef.current.eventOrbs = orbs;
    gameRef.current.pellets = dots;
    gameRef.current.pacman.x = 40;
    gameRef.current.pacman.vx = 3.2;
    gameRef.current.pacman.vy = 0;

    // Set first event active
    if (events[0]) setActiveEvent(events[0]);
  }, [selectedDay]);

  // Keyboard controls
  useEffect(() => {
    const handleKey = (e) => {
      const p = gameRef.current.pacman;
      if (['ArrowRight', 'd', 'D'].includes(e.key)) {
        p.targetVx = 3.6; p.targetVy = 0; p.direction = 0;
        setIsAutoCruise(false);
      } else if (['ArrowLeft', 'a', 'A'].includes(e.key)) {
        p.targetVx = -3.6; p.targetVy = 0; p.direction = Math.PI;
        setIsAutoCruise(false);
      } else if (['ArrowUp', 'w', 'W'].includes(e.key)) {
        p.targetVy = -2.5;
        setIsAutoCruise(false);
      } else if (['ArrowDown', 's', 'S'].includes(e.key)) {
        p.targetVy = 2.5;
        setIsAutoCruise(false);
      } else if (e.key === ' ') {
        setIsAutoCruise(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  // Main 60 FPS Game Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animId;

    const loop = () => {
      const g = gameRef.current;
      const p = g.pacman;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // 1. Draw Maze Track Background
      ctx.fillStyle = '#06030f';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Neon Track Lines (classic Namco Pac-Man double blue borders)
      ctx.save();
      ctx.shadowColor = '#3b82f6';
      ctx.shadowBlur = 12;
      ctx.strokeStyle = '#2563eb';
      ctx.lineWidth = 4;

      // Top Track Rail
      ctx.beginPath();
      ctx.roundRect(15, 120, canvas.width - 30, 120, 24);
      ctx.stroke();

      // Inner Circuit Rail
      ctx.strokeStyle = '#1d4ed8';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect(22, 127, canvas.width - 44, 106, 18);
      ctx.stroke();
      ctx.restore();

      // 2. Draw Pellets
      g.pellets.forEach(dot => {
        if (dot.eaten) return;
        ctx.save();
        if (dot.isPower) {
          ctx.shadowColor = '#fbbf24';
          ctx.shadowBlur = 15;
          ctx.fillStyle = '#fef08a';
          ctx.beginPath();
          ctx.arc(dot.x, dot.y, 6.5, 0, Math.PI * 2);
          ctx.fill();
        } else {
          ctx.fillStyle = '#ffb8ae';
          ctx.beginPath();
          ctx.arc(dot.x, dot.y, 3.5, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      });

      // 3. Draw Event Stations on the Track
      g.eventOrbs.forEach(orb => {
        ctx.save();
        ctx.shadowColor = orb.color;
        ctx.shadowBlur = orb.eaten ? 8 : 22;

        // Station Outer Ring
        ctx.strokeStyle = orb.color;
        ctx.lineWidth = 3;
        ctx.fillStyle = orb.eaten ? 'rgba(10, 6, 24, 0.9)' : 'rgba(30, 12, 60, 0.95)';
        ctx.beginPath();
        ctx.arc(orb.x, orb.y, orb.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // Station Icon / Badge
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 11px "Press Start 2P", monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(orb.eaten ? '✓' : '★', orb.x, orb.y);

        // Station Label (Time tag above)
        ctx.font = '9px "Press Start 2P", monospace';
        ctx.fillStyle = orb.color;
        const timeShort = orb.time.split('-')[0].trim();
        ctx.fillText(timeShort, orb.x, orb.y - 38);

        // Event Title (below station)
        ctx.font = '8px "Press Start 2P", monospace';
        ctx.fillStyle = '#f8fafc';
        const titleShort = orb.title.length > 14 ? orb.title.slice(0, 12) + '..' : orb.title;
        ctx.fillText(titleShort, orb.x, orb.y + 38);

        ctx.restore();
      });

      // 4. Update & Draw Ghosts
      g.ghosts.forEach(ghost => {
        ghost.x += ghost.vx;
        if (ghost.x > canvas.width - 50 || ghost.x < 50) ghost.vx *= -1;

        ctx.save();
        ctx.shadowColor = ghost.color;
        ctx.shadowBlur = 14;
        ctx.fillStyle = ghost.color;

        // Ghost dome head
        ctx.beginPath();
        ctx.arc(ghost.x, ghost.y - 4, 16, Math.PI, 0, false);
        ctx.lineTo(ghost.x + 16, ghost.y + 12);
        // Wavy skirt
        ctx.lineTo(ghost.x + 8, ghost.y + 8);
        ctx.lineTo(ghost.x, ghost.y + 12);
        ctx.lineTo(ghost.x - 8, ghost.y + 8);
        ctx.lineTo(ghost.x - 16, ghost.y + 12);
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
        ctx.beginPath();
        ctx.arc(ghost.x - 5, ghost.y - 6, 2, 0, Math.PI * 2);
        ctx.arc(ghost.x + 7, ghost.y - 6, 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      // 5. Update & Draw Moving Pac-Man
      if (isAutoCruise) {
        // Auto Cruise smoothly along track
        p.vx = 3.2;
        p.vy = 0;
        p.direction = 0;
      } else {
        p.vx = p.targetVx;
        p.y += p.targetVy;
        // Dampen Y back towards track center (180)
        p.y += (180 - p.y) * 0.08;
      }

      p.x += p.vx;

      // Wrap around canvas screen edges
      if (p.x > canvas.width + 20) p.x = -20;
      if (p.x < -20) p.x = canvas.width + 20;

      // Animate chomping mouth
      p.mouthAngle += p.mouthSpeed;
      if (p.mouthAngle > 0.42 || p.mouthAngle < 0.05) p.mouthSpeed *= -1;

      // Check pellet collisions
      g.pellets.forEach(dot => {
        if (!dot.eaten && Math.abs(p.x - dot.x) < 18 && Math.abs(p.y - dot.y) < 18) {
          dot.eaten = true;
          setScore(s => s + (dot.isPower ? 50 : 10));
          soundEngine.playBlip();
        }
      });

      // Check event orb collisions
      g.eventOrbs.forEach(orb => {
        if (Math.abs(p.x - orb.x) < 28 && Math.abs(p.y - orb.y) < 28) {
          if (!orb.eaten) {
            orb.eaten = true;
            setActiveEvent(orb);
            setScore(s => s + 200);
            soundEngine.playCoin();

            // Spawn floating score pill
            g.scorePills.push({ x: orb.x, y: orb.y - 20, text: '+200 PTS', alpha: 1 });

            // Spawn particle burst
            for (let i = 0; i < 18; i++) {
              const angle = Math.random() * Math.PI * 2;
              const spd = 2 + Math.random() * 4;
              g.particles.push({
                x: orb.x,
                y: orb.y,
                vx: Math.cos(angle) * spd,
                vy: Math.sin(angle) * spd,
                color: orb.color,
                life: 30
              });
            }
          }
        }
      });

      // Draw Pac-Man Body with Direction & Mouth Angle
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.direction);
      ctx.shadowColor = '#facc15';
      ctx.shadowBlur = 20;
      ctx.fillStyle = '#facc15';

      ctx.beginPath();
      ctx.arc(0, 0, p.radius, p.mouthAngle * Math.PI, (2 - p.mouthAngle) * Math.PI);
      ctx.lineTo(0, 0);
      ctx.closePath();
      ctx.fill();

      // Pac-Man Eye
      ctx.fillStyle = '#000000';
      ctx.beginPath();
      ctx.arc(-2, -10, 3, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // 6. Draw Particle Sparks
      g.particles = g.particles.filter(pt => {
        pt.x += pt.vx;
        pt.y += pt.vy;
        pt.life -= 1;
        ctx.fillStyle = pt.color;
        ctx.fillRect(pt.x, pt.y, 3, 3);
        return pt.life > 0;
      });

      // 7. Draw Floating Score Pills
      g.scorePills = g.scorePills.filter(sp => {
        sp.y -= 1;
        sp.alpha -= 0.03;
        ctx.save();
        ctx.font = 'bold 10px "Press Start 2P", monospace';
        ctx.fillStyle = `rgba(250, 204, 21, ${sp.alpha})`;
        ctx.fillText(sp.text, sp.x, sp.y);
        ctx.restore();
        return sp.alpha > 0;
      });

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [isAutoCruise]);

  const toggleSound = () => {
    const next = !soundMuted;
    setSoundMuted(next);
    soundEngine.setMuted(next);
  };

  return (
    <div className="relative w-full h-full flex flex-col bg-[#05020c] text-white select-none overflow-hidden font-sans">
      
      {/* 1. RETRO ARCADE TOP BAR */}
      <div className="flex-shrink-0 flex items-center justify-between px-3 sm:px-6 py-2 bg-[#090416] border-b-2 border-yellow-500/50 shadow-md">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="w-4 h-4 rounded-full bg-yellow-400 inline-block shadow-[0_0_8px_#facc15]" />
            <span className="font-['Press_Start_2P'] text-[9px] sm:text-xs text-yellow-300">1UP</span>
          </div>
          <span className="font-['Press_Start_2P'] text-xs sm:text-sm text-white tracking-widest">
            {String(score).padStart(6, '0')}
          </span>
          <div className="hidden sm:flex items-center gap-1 ml-2 text-xs">
            <span>❤️</span><span>❤️</span><span>❤️</span>
          </div>
        </div>

        {/* Day Switcher Buttons */}
        <div className="flex items-center gap-1 sm:gap-2">
          {[1, 2, 3].map(day => (
            <button
              key={day}
              onClick={() => {
                soundEngine.playBlip();
                setSelectedDay(day);
              }}
              className={`px-2.5 sm:px-3 py-1 rounded font-['Press_Start_2P'] text-[8px] sm:text-[9px] transition ${
                selectedDay === day
                  ? 'bg-yellow-400 text-black font-bold shadow-[0_0_12px_#facc15]'
                  : 'bg-black/50 text-gray-400 border border-gray-700 hover:text-white'
              }`}
            >
              DAY 0{day}
            </button>
          ))}
        </div>

        {/* Sound & Close */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsAutoCruise(prev => !prev)}
            className={`px-2 py-1 rounded border font-['Press_Start_2P'] text-[8px] transition hidden sm:inline-flex items-center gap-1 ${
              isAutoCruise
                ? 'bg-emerald-500 text-black border-emerald-300 font-bold'
                : 'bg-gray-800 text-gray-300 border-gray-600'
            }`}
          >
            {isAutoCruise ? <Pause size={10} /> : <Play size={10} />}
            <span>{isAutoCruise ? 'CRUISING' : 'MANUAL'}</span>
          </button>

          <button
            onClick={toggleSound}
            className="p-1.5 rounded bg-gray-900 border border-gray-700 hover:border-yellow-400 text-gray-300"
          >
            {soundMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
          </button>

          {onClose && (
            <button
              onClick={onClose}
              className="p-1 rounded bg-red-950 border border-red-500 text-red-300 hover:bg-red-900 text-xs px-2"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* 2. LIVE MOVING PAC-MAN CANVAS */}
      <div className="relative flex-shrink-0 w-full bg-[#05020c] border-b-2 border-blue-500/40 overflow-hidden">
        <canvas
          ref={canvasRef}
          width={1000}
          height={320}
          className="w-full h-[180px] sm:h-[220px] md:h-[260px] object-cover"
        />

        {/* Mobile touch steer buttons */}
        <div className="absolute right-3 bottom-3 flex items-center gap-1 sm:hidden">
          <button
            onClick={() => {
              const p = gameRef.current.pacman;
              p.targetVx = -3.6; p.targetVy = 0; p.direction = Math.PI;
              setIsAutoCruise(false);
            }}
            className="w-8 h-8 rounded bg-blue-900/80 border border-blue-400 text-white font-black text-xs"
          >
            ◀
          </button>
          <button
            onClick={() => setIsAutoCruise(prev => !prev)}
            className="w-8 h-8 rounded bg-yellow-400 text-black font-black text-[10px]"
          >
            ▶▶
          </button>
          <button
            onClick={() => {
              const p = gameRef.current.pacman;
              p.targetVx = 3.6; p.targetVy = 0; p.direction = 0;
              setIsAutoCruise(false);
            }}
            className="w-8 h-8 rounded bg-blue-900/80 border border-blue-400 text-white font-black text-xs"
          >
            ▶
          </button>
        </div>
      </div>

      {/* 3. CLEAN & SIMPLE ACTIVE EVENT CARD (No Over-Documentation) */}
      <div className="flex-1 p-3 sm:p-5 flex flex-col justify-between overflow-y-auto">
        {activeEvent ? (
          <div className="relative w-full bg-[#0b061c] border-2 border-yellow-500/60 rounded-2xl p-4 sm:p-6 shadow-2xl flex flex-col justify-between">
            <div>
              {/* Header tags */}
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="px-2 py-0.5 rounded font-['Press_Start_2P'] text-[8px] sm:text-[9px] bg-yellow-400 text-black font-bold uppercase">
                  {activeEvent.category}
                </span>
                <span className="font-['Press_Start_2P'] text-[8px] sm:text-[10px] text-yellow-300">
                  {activeEvent.time}
                </span>
              </div>

              {/* Title */}
              <h2 className="font-['Press_Start_2P'] text-sm sm:text-xl text-white font-bold mb-2">
                {activeEvent.title}
              </h2>

              {/* Venue */}
              <div className="text-xs text-pink-400 font-semibold mb-3">
                📍 {activeEvent.venue}
              </div>

              {/* Punchy Brief */}
              <p className="text-gray-300 text-xs sm:text-sm leading-relaxed max-w-3xl">
                {activeEvent.desc}
              </p>
            </div>

            {/* Quick action button */}
            <div className="flex items-center justify-between pt-3 border-t border-gray-800 mt-3">
              <span className="text-[10px] text-gray-400 font-['Press_Start_2P']">
                DAY {selectedDay} • REVERIE 2K27
              </span>

              {activeEvent.registrationLink && (
                <a
                  href={activeEvent.registrationLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded-xl bg-yellow-400 hover:bg-yellow-300 text-black font-['Press_Start_2P'] text-[9px] font-bold shadow-[0_0_15px_#facc15] transition flex items-center gap-1.5"
                >
                  <span>REGISTER</span>
                  <ExternalLink size={12} />
                </a>
              )}
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500 font-['Press_Start_2P'] text-xs">
            PAC-MAN IS CRUISING... TOUCH OR STEER INTO AN EVENT ORB!
          </div>
        )}
      </div>

      {/* 4. BOTTOM ACTION HUD */}
      <div className="flex-shrink-0 flex items-center justify-between px-3 sm:px-6 py-2.5 bg-[#080314] border-t border-yellow-500/40">
        <button
          onClick={onBackToMap}
          className="px-3 py-1.5 rounded-lg bg-gray-900 border border-gray-700 hover:border-gray-500 text-gray-300 font-['Press_Start_2P'] text-[8px] sm:text-[9px]"
        >
          ◀ WORLD MAP
        </button>

        <button
          onClick={() => {
            soundEngine.playJump();
            if (onAdvanceStage) onAdvanceStage();
          }}
          className="px-4 sm:px-5 py-1.5 rounded-xl bg-yellow-400 hover:bg-yellow-300 text-black font-['Press_Start_2P'] text-[9px] sm:text-[10px] font-bold shadow-[0_0_15px_#facc15] flex items-center gap-1.5"
        >
          <span>NEXT STAGE</span>
          <ArrowRight size={14} />
        </button>
      </div>
    </div>
  );
}
