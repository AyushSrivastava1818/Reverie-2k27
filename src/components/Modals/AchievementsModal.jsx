import React, { useState, useEffect } from 'react';
import { 
  X, Trophy, Award, CheckCircle2, Lock, Sparkles, Gift, 
  ArrowRight, Shirt, Download, Stamp, User, Coins, MapPin, Compass, Flag, HelpCircle
} from 'lucide-react';
import { achievementsList } from '../../data/achievements';
import { achievementSystem } from '../../game/systems/AchievementSystem';
import { soundEngine } from '../../game/systems/SoundEngine';
import { eventBus } from '../../game/EventBus';
import { Tilt3DCard } from '../ThreeD/Tilt3DCard';
import confetti from 'canvas-confetti';

const PASSPORT_STAMPS = [
  {
    id: 'StartingKingdomScene',
    title: 'STARTING',
    iconEmoji: '🏰',
    accentColor: '#f59e0b',
    borderClass: 'border-amber-400',
    bgClass: 'bg-amber-950/50 text-amber-300',
    inkColor: 'rgba(245, 158, 11, 0.95)'
  },
  {
    id: 'TechKingdomScene',
    title: 'TECH',
    iconEmoji: '🔲',
    accentColor: '#06b6d4',
    borderClass: 'border-cyan-400',
    bgClass: 'bg-cyan-950/50 text-cyan-300',
    inkColor: 'rgba(6, 182, 212, 0.95)'
  },
  {
    id: 'CultureKingdomScene',
    title: 'CULTURE',
    iconEmoji: '🎵',
    accentColor: '#ec4899',
    borderClass: 'border-pink-400',
    bgClass: 'bg-pink-950/50 text-pink-300',
    inkColor: 'rgba(236, 72, 153, 0.95)'
  },
  {
    id: 'FlagshipScene',
    title: 'FLAGSHIP',
    iconEmoji: '🏆',
    accentColor: '#a855f7',
    borderClass: 'border-purple-400',
    bgClass: 'bg-purple-950/50 text-purple-300',
    inkColor: 'rgba(168, 85, 247, 0.95)'
  },
  {
    id: 'FestivalPlazaScene',
    title: 'PLAZA',
    iconEmoji: '🏛️',
    accentColor: '#10b981',
    borderClass: 'border-emerald-400',
    bgClass: 'bg-emerald-950/50 text-emerald-300',
    inkColor: 'rgba(16, 185, 129, 0.95)'
  }
];

export function AchievementsModal({ onClose, onOpenWardrobe, onOpenMap }) {
  const [activeTab, setActiveTab] = useState('all'); // 'all', 'quests', 'passport'
  const [attendeeName, setAttendeeName] = useState(() => {
    return localStorage.getItem('reverie_attendee_name') || 'Pixel Explorer';
  });
  const [, setTick] = useState(0);

  // Pause gameplay while Quest/Passport Log is open; resume on close
  useEffect(() => {
    eventBus.emit('game-paused', true);
    return () => {
      eventBus.emit('game-paused', false);
    };
  }, []);

  const handleNameChange = (e) => {
    const val = e.target.value.slice(0, 24);
    setAttendeeName(val);
    try {
      localStorage.setItem('reverie_attendee_name', val);
    } catch {}
  };

  const unlockedCount = achievementSystem.getUnlockedCount();
  const totalCount = achievementsList.length;
  const visitedZones = achievementSystem.state.visitedZones || ['StartingKingdomScene'];
  const coinsCollected = achievementSystem.state.coinsCollected || 0;

  const handleClaim = (questId) => {
    soundEngine.playAchievement();
    achievementSystem.claimReward(questId);
    try {
      confetti({
        particleCount: 50,
        spread: 75,
        origin: { y: 0.5 },
        colors: ['#fbbf24', '#f59e0b', '#ec4899', '#06b6d4', '#a855f7']
      });
    } catch {}
    setTick(t => t + 1);
  };

  // Client-side HTML5 Canvas Generation for Festival Passport Card Download
  const handleDownloadPassport = () => {
    soundEngine.playFanfare();
    try {
      confetti({
        particleCount: 65,
        spread: 80,
        origin: { y: 0.4 },
        colors: ['#fbbf24', '#f59e0b', '#ec4899', '#06b6d4', '#a855f7']
      });
    } catch {}

    const canvas = document.createElement('canvas');
    canvas.width = 960;
    canvas.height = 600;
    const ctx = canvas.getContext('2d');

    // Background gradient
    const bgGrad = ctx.createLinearGradient(0, 0, 960, 600);
    bgGrad.addColorStop(0, '#0a0518');
    bgGrad.addColorStop(0.5, '#13082a');
    bgGrad.addColorStop(1, '#070312');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, 960, 600);

    // Subtle grid lines
    ctx.strokeStyle = 'rgba(168, 85, 247, 0.08)';
    ctx.lineWidth = 1;
    for (let x = 0; x < 960; x += 30) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, 600);
      ctx.stroke();
    }
    for (let y = 0; y < 600; y += 30) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(960, y);
      ctx.stroke();
    }

    // Outer card border
    ctx.strokeStyle = '#fbbf24';
    ctx.lineWidth = 4;
    ctx.strokeRect(16, 16, 928, 568);

    ctx.strokeStyle = 'rgba(236, 72, 153, 0.5)';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(24, 24, 912, 552);

    // Header badge
    ctx.fillStyle = '#ec4899';
    ctx.fillRect(40, 40, 320, 26);
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 12px sans-serif';
    ctx.fillText('OFFICIAL DIGITAL FESTIVAL PASSPORT', 50, 58);

    // Main Title
    ctx.fillStyle = '#ffffff';
    ctx.font = '900 34px sans-serif';
    ctx.fillText('REVERIE 2K27 — THE PIXELVERSE', 40, 105);

    // Subtitle
    ctx.fillStyle = '#fbbf24';
    ctx.font = 'bold 14px sans-serif';
    ctx.fillText('INDIAN INSTITUTE OF INFORMATION TECHNOLOGY KOTA • ANNUAL TECHNO-CULTURAL FEST', 40, 128);

    // Attendee Profile Strip
    ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.fillRect(40, 150, 880, 80);
    ctx.strokeStyle = 'rgba(168, 85, 247, 0.3)';
    ctx.strokeRect(40, 150, 880, 80);

    ctx.fillStyle = '#a855f7';
    ctx.font = 'bold 12px sans-serif';
    ctx.fillText('PASSPORT HOLDER / GAMER TAG:', 60, 178);

    ctx.fillStyle = '#ffffff';
    ctx.font = '900 24px sans-serif';
    ctx.fillText(attendeeName.toUpperCase(), 60, 208);

    // Metrics
    ctx.fillStyle = '#fbbf24';
    ctx.font = 'bold 12px sans-serif';
    ctx.fillText('COINS COLLECTED', 560, 178);
    ctx.fillStyle = '#ffffff';
    ctx.font = '900 20px sans-serif';
    ctx.fillText(`${coinsCollected} REVERIE COINS`, 560, 206);

    ctx.fillStyle = '#06b6d4';
    ctx.font = 'bold 12px sans-serif';
    ctx.fillText('QUESTS COMPLETED', 740, 178);
    ctx.fillStyle = '#ffffff';
    ctx.font = '900 20px sans-serif';
    ctx.fillText(`${unlockedCount} / ${totalCount} UNLOCKED`, 740, 206);

    // Section title for stamps
    ctx.fillStyle = '#e2e8f0';
    ctx.font = 'bold 14px sans-serif';
    ctx.fillText('OFFICIAL KINGDOM EMBASSY VISITATION STAMPS (5 TOTAL):', 40, 260);

    // 5 Stamp Boxes
    const stampWidth = 164;
    const stampHeight = 220;
    const startX = 40;
    const startY = 280;
    const gap = 15;

    PASSPORT_STAMPS.forEach((st, i) => {
      const sx = startX + i * (stampWidth + gap);
      const isVisited = visitedZones.includes(st.id);

      ctx.fillStyle = isVisited ? 'rgba(20, 10, 45, 0.85)' : 'rgba(10, 5, 20, 0.5)';
      ctx.fillRect(sx, startY, stampWidth, stampHeight);

      ctx.strokeStyle = isVisited ? st.accentColor : 'rgba(255, 255, 255, 0.15)';
      ctx.lineWidth = isVisited ? 2.5 : 1;
      ctx.strokeRect(sx, startY, stampWidth, stampHeight);

      ctx.fillStyle = isVisited ? st.accentColor : '#64748b';
      ctx.font = 'bold 11px sans-serif';
      ctx.fillText(`ZONE 0${i + 1}`, sx + 12, startY + 24);

      ctx.fillStyle = isVisited ? '#ffffff' : '#64748b';
      ctx.font = 'bold 12px sans-serif';
      ctx.fillText(st.title, sx + 12, startY + 44);

      if (isVisited) {
        ctx.save();
        ctx.translate(sx + stampWidth / 2, startY + 130);
        ctx.rotate(-0.1);

        ctx.strokeStyle = st.accentColor;
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(0, 0, 48, 0, Math.PI * 2);
        ctx.stroke();

        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(0, 0, 43, 0, Math.PI * 2);
        ctx.stroke();

        ctx.fillStyle = st.accentColor;
        ctx.font = 'bold 9px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('★ VERIFIED ★', 0, -20);
        ctx.font = '900 13px sans-serif';
        ctx.fillText('STAMPED', 0, 0);
        ctx.font = 'bold 8px sans-serif';
        ctx.fillText('FEB 2K27', 0, 16);
        ctx.fillText('IIIT KOTA', 0, 28);
        ctx.restore();
      } else {
        ctx.fillStyle = '#475569';
        ctx.font = 'bold 11px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('[ UNVISITED ]', sx + stampWidth / 2, startY + 120);
        ctx.font = '9px sans-serif';
        ctx.fillText('Enter warp pipe', sx + stampWidth / 2, startY + 140);
        ctx.fillText('to earn stamp', sx + stampWidth / 2, startY + 155);
        ctx.textAlign = 'left';
      }
    });

    ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.font = '10px sans-serif';
    ctx.fillText('REVERIE 2K27 DIGITAL CREDENTIAL • ISSUED BY ORGANIZING COMMITTEE, IIIT KOTA', 40, 545);

    const link = document.createElement('a');
    link.download = `REVERIE-2K27-Passport-${attendeeName.replace(/\s+/g, '_')}.png`;
    link.href = canvas.toDataURL('image/png');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/90 backdrop-blur-md animate-fadeIn select-none">
      <div className="relative w-full max-w-6xl max-h-[96vh] flex flex-col bg-[#0b051c] border-2 border-purple-500/80 rounded-3xl shadow-[0_0_50px_rgba(168,85,247,0.35)] overflow-hidden">
        
        {/* ========================================================================= */}
        {/* HEADER: Title, Tabs & Close                                               */}
        {/* ========================================================================= */}
        <div className="flex items-center justify-between p-3.5 sm:p-5 border-b border-purple-900/60 bg-gradient-to-r from-[#170933] via-[#0d0720] to-[#170933] shrink-0">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <img 
                src="/assets/branding/reverie_logo.png" 
                alt="REVERIE" 
                className="h-6 sm:h-7 w-auto object-contain filter drop-shadow-[0_0_8px_rgba(255,255,255,0.7)]"
              />
              <span className="font-display text-xs sm:text-sm text-yellow-400 font-black tracking-wider">
                2K27
              </span>
            </div>
            <div className="h-4 w-px bg-purple-800 hidden sm:block" />
            <h2 className="font-display text-sm sm:text-lg text-white font-black tracking-wider uppercase">
              QUESTS & FESTIVAL PASSPORT
            </h2>
          </div>

          <div className="flex items-center gap-2">
            {/* Tabs for Mobile / Desktop filter */}
            <div className="flex items-center gap-1 bg-[#12082b] p-1 rounded-xl border border-purple-900/60">
              <button
                onClick={() => {
                  soundEngine.playBlip();
                  setActiveTab('all');
                }}
                className={`px-3 py-1 rounded-lg font-display text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
                  activeTab === 'all'
                    ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-md'
                    : 'text-purple-300 hover:text-white'
                }`}
              >
                OVERVIEW
              </button>

              <button
                onClick={() => {
                  soundEngine.playBlip();
                  setActiveTab('quests');
                }}
                className={`px-3 py-1 rounded-lg font-display text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
                  activeTab === 'quests'
                    ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-md'
                    : 'text-purple-300 hover:text-white'
                }`}
              >
                QUESTS
              </button>

              <button
                onClick={() => {
                  soundEngine.playBlip();
                  setActiveTab('passport');
                }}
                className={`px-3 py-1 rounded-lg font-display text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
                  activeTab === 'passport'
                    ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-md'
                    : 'text-purple-300 hover:text-white'
                }`}
              >
                PASSPORT
              </button>
            </div>

            <button
              onClick={() => {
                soundEngine.playBlip();
                onClose();
              }}
              className="p-2 sm:px-3 sm:py-1.5 rounded-xl bg-slate-900/90 hover:bg-rose-950 text-slate-300 hover:text-white border border-slate-700/80 hover:border-rose-500/80 transition-all cursor-pointer flex items-center gap-1.5 font-display text-xs font-bold"
            >
              <span className="hidden sm:inline">CLOSE [ESC]</span>
              <X size={18} />
            </button>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* TWO-COLUMN SPLIT LAYOUT (Matching Reference Image 4 Blueprint)            */}
        {/* ========================================================================= */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* ======================================================================= */}
          {/* LEFT PANEL: FESTIVAL QUESTS & PROGRESS                                  */}
          {/* ======================================================================= */}
          {(activeTab === 'all' || activeTab === 'quests') && (
            <div className={`${activeTab === 'all' ? 'lg:col-span-7' : 'lg:col-span-12'} space-y-4`}>
              <div className="flex items-center justify-between pb-2 border-b border-purple-900/50">
                <div>
                  <h3 className="font-display text-base sm:text-lg font-black text-white uppercase tracking-wider flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-pink-500" />
                    FESTIVAL QUESTS
                  </h3>
                  <p className="font-body text-xs text-purple-300">
                    Complete quests, explore the Pixelverse and unlock rewards!
                  </p>
                </div>
                <span className="font-display text-xs bg-purple-950 text-yellow-300 border border-yellow-400/50 px-2.5 py-1 rounded-full font-black">
                  {unlockedCount} / {totalCount} UNLOCKED
                </span>
              </div>

              {/* Quests List */}
              <div className="space-y-3">
                {achievementsList.map((ach) => {
                  const prog = achievementSystem.getProgress(ach.id);
                  const isUnlocked = prog.unlocked;
                  const isClaimed = achievementSystem.isClaimed(ach.id);

                  return (
                    <div
                      key={ach.id}
                      className={`p-3.5 sm:p-4 rounded-2xl border-2 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
                        isUnlocked
                          ? 'bg-[#150a2e] border-yellow-400/80 shadow-md'
                          : 'bg-[#100724]/80 border-purple-900/60'
                      }`}
                    >
                      <div className="flex items-center gap-3 flex-1">
                        {/* Quest Icon Badge */}
                        <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-xl shrink-0 border-2 ${
                          isUnlocked 
                            ? 'bg-yellow-950/80 border-yellow-400 text-yellow-300' 
                            : 'bg-slate-900 border-slate-700 text-slate-500'
                        }`}>
                          {ach.icon}
                        </div>

                        <div className="space-y-0.5 flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <h4 className="font-display text-xs sm:text-sm font-black text-white truncate uppercase">
                              {ach.title}
                            </h4>
                            {isUnlocked && (
                              <span className="font-display text-[9px] bg-emerald-950 text-emerald-400 border border-emerald-500 px-1.5 py-0.2 rounded font-black flex items-center gap-0.5">
                                <CheckCircle2 size={10} /> DONE
                              </span>
                            )}
                          </div>
                          <p className="font-body text-[11px] sm:text-xs text-slate-300 leading-snug">
                            {ach.description}
                          </p>
                        </div>
                      </div>

                      {/* Progress Bar & CTA */}
                      <div className="w-full sm:w-44 shrink-0 flex flex-col gap-1.5 pt-1 sm:pt-0">
                        <div className="flex justify-between text-[11px] font-display font-bold">
                          <span className="text-purple-300">PROGRESS</span>
                          <span className={isUnlocked ? 'text-yellow-400' : 'text-slate-400'}>
                            {prog.current} / {prog.target}
                          </span>
                        </div>

                        <div className="w-full h-2 rounded-full bg-slate-900 border border-purple-900 overflow-hidden">
                          <div 
                            className={`h-full transition-all duration-500 ${
                              isUnlocked 
                                ? 'bg-gradient-to-r from-yellow-400 to-amber-500' 
                                : 'bg-gradient-to-r from-purple-600 to-pink-600'
                            }`}
                            style={{ width: `${prog.percent}%` }}
                          />
                        </div>

                        {/* Claim CTA */}
                        {isUnlocked && !isClaimed && (
                          <button
                            onClick={() => handleClaim(ach.id)}
                            className="mt-1 w-full py-1.5 px-2 rounded-lg bg-gradient-to-r from-yellow-400 to-amber-500 text-slate-950 font-display text-[10px] font-black uppercase tracking-wider flex items-center justify-center gap-1 shadow animate-pulse cursor-pointer"
                          >
                            <Gift size={12} />
                            <span>CLAIM REWARD</span>
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Bottom Rewards Showcase Row (Matching Reference 4) */}
              <div className="p-3.5 rounded-2xl bg-[#12082b] border border-purple-900/60 mt-4">
                <div className="font-display text-[11px] text-yellow-400 font-black uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Trophy size={14} className="text-yellow-400" />
                  <span>FESTIVAL REWARDS</span>
                </div>
                <div className="grid grid-cols-3 gap-2.5">
                  <div className="p-2.5 rounded-xl bg-slate-950/80 border border-purple-900/50 flex flex-col items-center text-center">
                    <img src="/assets/sprites/player_mario.png" alt="Skin" className="w-8 h-8 object-none image-rendering-pixelated mb-1" style={{ objectPosition: '0 0' }} />
                    <span className="font-display text-[10px] font-black text-white">Exclusive Skin</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-950/80 border border-purple-900/50 flex flex-col items-center text-center">
                    <span className="text-2xl mb-1">⭐</span>
                    <span className="font-display text-[10px] font-black text-white">Explorer Badge</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-950/80 border border-purple-900/50 flex flex-col items-center text-center">
                    <span className="text-2xl mb-1">🎫</span>
                    <span className="font-display text-[10px] font-black text-white">Digital Passport</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ======================================================================= */}
          {/* RIGHT PANEL: YOUR FESTIVAL PASSPORT & STAMPS (3D Tilt Pass)             */}
          {/* ======================================================================= */}
          {(activeTab === 'all' || activeTab === 'passport') && (
            <div className={`${activeTab === 'all' ? 'lg:col-span-5' : 'lg:col-span-12'} space-y-4`}>
              <Tilt3DCard
                maxTilt={14}
                perspective={950}
                scale={1.02}
                glareOpacity={0.35}
                className="p-4 sm:p-5 rounded-3xl bg-gradient-to-b from-[#1b0b38] via-[#14082c] to-[#0d0520] border-2 border-purple-500/70 shadow-2xl flex flex-col justify-between h-full"
              >
                {/* Passport Card Header with Wavy Cancellation Lines */}
                <div style={{ transform: 'translateZ(15px)' }}>
                  <div className="flex items-center justify-between pb-3 border-b border-purple-900/60">
                    <div className="flex items-center gap-2">
                      <Stamp size={20} className="text-pink-400" />
                      <h3 className="font-display text-sm sm:text-base font-black text-white uppercase tracking-wider">
                        YOUR FESTIVAL PASSPORT
                      </h3>
                    </div>
                    <span className="font-display text-[10px] bg-pink-950 text-pink-300 border border-pink-500/50 px-2 py-0.5 rounded font-black">
                      {visitedZones.length} / 5 STAMPED
                    </span>
                  </div>

                  {/* Gamer Tag Customizer */}
                  <div className="mt-3 p-2.5 rounded-xl bg-black/40 border border-purple-800/50 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <User size={15} className="text-purple-300" />
                      <span className="font-display text-[10px] text-purple-300 uppercase font-bold">NAME:</span>
                    </div>
                    <input
                      type="text"
                      value={attendeeName}
                      onChange={handleNameChange}
                      placeholder="Pixel Explorer"
                      className="bg-transparent font-display text-xs font-black text-yellow-300 text-right focus:outline-none tracking-wider uppercase w-36"
                    />
                  </div>

                  {/* Postmark cancellation header */}
                  <div className="text-center my-3 relative">
                    <div className="font-display text-sm font-black text-white tracking-widest uppercase">
                      REVERIE 2K27
                    </div>
                    <div className="font-display text-[10px] text-yellow-400 font-bold uppercase tracking-wider">
                      FESTIVAL PASSPORT • IIIT KOTA
                    </div>
                  </div>

                  {/* 5 Serrated Postage Stamps Grid (Matching Reference 4) */}
                  <div className="grid grid-cols-3 gap-2.5 my-3">
                    {PASSPORT_STAMPS.slice(0, 3).map((st) => {
                      const isVisited = visitedZones.includes(st.id);
                      return (
                        <div
                          key={st.id}
                          className={`relative p-2.5 rounded-xl border-2 border-dashed flex flex-col items-center text-center transition-all ${
                            isVisited
                              ? `${st.borderClass} ${st.bgClass} shadow-md`
                              : 'border-slate-700 bg-slate-950/60 text-slate-500 opacity-60'
                          }`}
                        >
                          <span className="text-xl mb-1">{st.iconEmoji}</span>
                          <span className="font-display text-[10px] font-black uppercase tracking-wider">
                            {st.title}
                          </span>
                          {isVisited ? (
                            <span className="font-display text-[8px] bg-emerald-950 text-emerald-400 border border-emerald-500 px-1 rounded mt-1 font-black">
                              ✓ STAMPED
                            </span>
                          ) : (
                            <span className="font-display text-[8px] text-slate-500 mt-1">
                              ○ PENDING
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  <div className="grid grid-cols-2 gap-2.5 my-2 max-w-xs mx-auto">
                    {PASSPORT_STAMPS.slice(3, 5).map((st) => {
                      const isVisited = visitedZones.includes(st.id);
                      return (
                        <div
                          key={st.id}
                          className={`relative p-2.5 rounded-xl border-2 border-dashed flex flex-col items-center text-center transition-all ${
                            isVisited
                              ? `${st.borderClass} ${st.bgClass} shadow-md`
                              : 'border-slate-700 bg-slate-950/60 text-slate-500 opacity-60'
                          }`}
                        >
                          <span className="text-xl mb-1">{st.iconEmoji}</span>
                          <span className="font-display text-[10px] font-black uppercase tracking-wider">
                            {st.title}
                          </span>
                          {isVisited ? (
                            <span className="font-display text-[8px] bg-emerald-950 text-emerald-400 border border-emerald-500 px-1 rounded mt-1 font-black">
                              ✓ STAMPED
                            </span>
                          ) : (
                            <span className="font-display text-[8px] text-slate-500 mt-1">
                              ○ PENDING
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Big Download Passport Action Button */}
                <div className="pt-4 border-t border-purple-900/60 mt-3" style={{ transform: 'translateZ(25px)' }}>
                  <button
                    onClick={handleDownloadPassport}
                    className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-display text-xs sm:text-sm font-black uppercase tracking-wider flex items-center justify-center gap-2 shadow-xl shadow-purple-950/60 active:scale-95 transition-all cursor-pointer"
                  >
                    <Download size={16} />
                    <span>DOWNLOAD PASSPORT</span>
                  </button>
                  <p className="text-[10px] font-body text-purple-300 text-center mt-2">
                    Official festival passport credential saved as high-res PNG image.
                  </p>
                </div>

              </Tilt3DCard>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
