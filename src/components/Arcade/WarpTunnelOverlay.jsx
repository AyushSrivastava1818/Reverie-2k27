import React, { useEffect, useRef, useState } from 'react';
import { SuperMarioSprite } from './ArcadePixelSprites';
import { soundEngine } from '../../game/systems/SoundEngine';
import { Sparkles, Zap } from 'lucide-react';

export function WarpTunnelOverlay({ data, onComplete }) {
  const canvasRef = useRef(null);
  const [dots, setDots] = useState('');

  // Destination name with clean fallback
  const destination = data?.destinationName?.replace('WARP TUNNEL: ', '') || 'TECH REALM';

  // Animated dots
  useEffect(() => {
    soundEngine.playPipe();
    const interval = setInterval(() => {
      setDots(prev => (prev.length >= 3 ? '' : prev + '.'));
    }, 250);

    const timer = setTimeout(() => {
      if (onComplete) onComplete();
    }, 1300);

    return () => {
      clearInterval(interval);
      clearTimeout(timer);
    };
  }, [onComplete]);

  // Hyperspace Starburst Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animId;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    // Create 120 hyperspace stars
    const stars = Array.from({ length: 140 }, () => ({
      x: (Math.random() - 0.5) * window.innerWidth,
      y: (Math.random() - 0.5) * window.innerHeight,
      z: Math.random() * window.innerWidth,
      color: ['#06b6d4', '#a855f7', '#fbbf24', '#ec4899', '#ffffff'][Math.floor(Math.random() * 5)]
    }));

    let speed = 32;

    const render = () => {
      ctx.fillStyle = 'rgba(5, 2, 12, 0.35)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const cx = canvas.width / 2;
      const cy = canvas.height / 2;

      stars.forEach(star => {
        star.z -= speed;
        if (star.z <= 0) {
          star.x = (Math.random() - 0.5) * canvas.width;
          star.y = (Math.random() - 0.5) * canvas.height;
          star.z = canvas.width;
        }

        const k = 250 / star.z;
        const px = star.x * k + cx;
        const py = star.y * k + cy;

        if (px >= 0 && px <= canvas.width && py >= 0 && py <= canvas.height) {
          const size = Math.max(1, (1 - star.z / canvas.width) * 4);
          ctx.beginPath();
          ctx.fillStyle = star.color;
          ctx.arc(px, py, size, 0, Math.PI * 2);
          ctx.fill();

          // Tail speedline
          const prevK = 250 / (star.z + speed * 1.5);
          const prevPx = star.x * prevK + cx;
          const prevPy = star.y * prevK + cy;

          ctx.beginPath();
          ctx.strokeStyle = star.color;
          ctx.lineWidth = size * 0.7;
          ctx.moveTo(px, py);
          ctx.lineTo(prevPx, prevPy);
          ctx.stroke();
        }
      });

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <div
      onClick={onComplete}
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black/95 select-none cursor-pointer overflow-hidden animate-in fade-in duration-150"
    >
      {/* 1. Hyperspace Speedline Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 z-0 pointer-events-none" />

      {/* 2. Neon CRT Scanline Grid */}
      <div className="absolute inset-0 z-10 pointer-events-none opacity-40 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.7)_50%)] bg-[length:100%_4px]" />

      {/* 3. Central Hyperspace Warp Tube & Flying Mario */}
      <div className="relative z-20 flex flex-col items-center">
        
        {/* Glowing Warp Tunnel Ring */}
        <div className="relative w-48 h-48 sm:w-64 sm:h-64 rounded-full border-4 border-cyan-400 flex items-center justify-center shadow-[0_0_60px_#06b6d4] animate-pulse">
          <div className="absolute inset-2 rounded-full border-2 border-dashed border-pink-400 animate-spin" style={{ animationDuration: '6s' }} />
          <div className="absolute inset-6 rounded-full border-2 border-yellow-400 animate-ping" style={{ animationDuration: '1.2s' }} />

          {/* Flying Super Mario in Warp Stream */}
          <div className="relative z-30 transform scale-125 sm:scale-150 animate-bounce">
            <SuperMarioSprite />
          </div>
        </div>

        {/* Warp Header Banner */}
        <div className="mt-8 flex flex-col items-center gap-2 text-center px-4">
          <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-950/80 border-2 border-cyan-400 shadow-[0_0_20px_#06b6d4]">
            <Zap size={16} className="text-yellow-400 animate-bounce" />
            <span className="font-['Press_Start_2P'] text-[10px] sm:text-xs text-cyan-300 tracking-wider">
              WARP TUNNEL ENGAGED
            </span>
            <Zap size={16} className="text-yellow-400 animate-bounce" />
          </div>

          {/* Destination Announcement */}
          <div className="font-['Press_Start_2P'] text-sm sm:text-xl text-yellow-400 tracking-widest drop-shadow-[0_0_15px_#facc15] mt-2">
            WARPING TO {destination}{dots}
          </div>

          <div className="font-['Press_Start_2P'] text-[8px] sm:text-[9px] text-gray-400 mt-2">
            TRANSITIONING PIXELVERSE DIMENSION • [TAP TO SKIP]
          </div>
        </div>
      </div>
    </div>
  );
}

