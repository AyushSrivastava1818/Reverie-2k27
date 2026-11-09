import React, { useState, useEffect } from 'react';
import { 
  X, Trophy, Medal, Award, Flame, Coins, Compass, 
  Sparkles, Gamepad2, Shield, User, Eye, EyeOff 
} from 'lucide-react';
import { achievementSystem } from '../../game/systems/AchievementSystem';
import { soundEngine } from '../../game/systems/SoundEngine';

export function LeaderboardModal({ onClose, currentSkin = 'player_mario' }) {
  const [activeCategory, setActiveCategory] = useState('all'); // 'all', 'coins', 'explorers', 'games'
  const [anonMode, setAnonMode] = useState(false);

  // Player live stats
  const [playerCoins, setPlayerCoins] = useState(achievementSystem.getBalance());
  const [playerZones, setPlayerZones] = useState(achievementSystem.state.visitedZones.length || 1);
  const [playerQuests, setPlayerQuests] = useState(achievementSystem.state.claimedIds.length || 0);

  // Mini-game scores
  const [runnerHigh, setRunnerHigh] = useState(0);
  const [snakeHigh, setSnakeHigh] = useState(0);
  const [reflexBest, setReflexBest] = useState(null);

  useEffect(() => {
    setPlayerCoins(achievementSystem.getBalance());
    setPlayerZones(achievementSystem.state.visitedZones.length || 1);
    setPlayerQuests(achievementSystem.state.claimedIds.length || 0);

    const rSaved = localStorage.getItem('reverie_runner_highscore');
    if (rSaved) setRunnerHigh(parseInt(rSaved, 10));

    const sSaved = localStorage.getItem('reverie_snake_high');
    if (sSaved) setSnakeHigh(parseInt(sSaved, 10));

    const refSaved = localStorage.getItem('reverie_reflex_best');
    if (refSaved) setReflexBest(parseInt(refSaved, 10));
  }, []);

  // Compute player's composite arcade score
  const totalCompositeScore = 
    playerCoins * 10 + 
    playerZones * 500 + 
    playerQuests * 300 + 
    runnerHigh * 2 + 
    snakeHigh * 5 + 
    (reflexBest && reflexBest < 300 ? 800 : 200);

  // High score roster data (Festival competitive leaderboard)
  const allStarRoster = [
    { rank: 1, name: 'CyberPhoenix', tag: 'IIIT Kota CS', score: 14250, avatar: 'golden', badge: 'LEGEND', title: 'Grand Arcade Champion' },
    { rank: 2, name: 'RetroValkyrie', tag: 'Bits Pilani', score: 12890, avatar: 'synthwave', badge: 'ACE', title: 'Speedrun Master' },
    { rank: 3, name: anonMode ? 'Anonymous Ace' : 'You (Challenger)', isUser: true, score: Math.max(10500, totalCompositeScore), avatar: 'mario', badge: 'ACTIVE', title: 'Pixelverse Adventurer' },
    { rank: 4, name: 'ByteStriker', tag: 'MNIT Jaipur', score: 9840, avatar: 'cyber', badge: 'VETERAN', title: 'Code Crusader' },
    { rank: 5, name: 'NeonSamurai', tag: 'IIT Jodhpur', score: 8720, avatar: 'synthwave', badge: 'CHALLENGER', title: 'Quest Hunter' },
    { rank: 6, name: 'GlitchHunter', tag: 'RTU Kota', score: 7950, avatar: 'cyber', badge: 'PRO', title: 'Coin Collector' },
    { rank: 7, name: 'QuantumCoder', tag: 'IIIT Vadodara', score: 7100, avatar: 'mario', badge: 'SCOUT', title: 'Realm Explorer' }
  ].sort((a, b) => b.score - a.score).map((item, idx) => ({ ...item, rank: idx + 1 }));

  const coinTycoonsRoster = [
    { rank: 1, name: 'GildedBaron', tag: 'Hostel 3', coins: 1850, verified: true },
    { rank: 2, name: anonMode ? 'Anonymous Ace' : 'You (Challenger)', isUser: true, coins: Math.max(playerCoins, 850), verified: true },
    { rank: 3, name: 'CryptoKnight', tag: 'TechKnow Club', coins: 780, verified: true },
    { rank: 4, name: 'PixelNomad', tag: 'ECE Dept', coins: 640, verified: true },
    { rank: 5, name: 'ArcadeRider', tag: 'Gaming Wing', coins: 520, verified: true }
  ].sort((a, b) => b.coins - a.coins).map((item, idx) => ({ ...item, rank: idx + 1 }));

  const miniGameLegends = [
    { game: 'PIXEL RUNNER', topScorer: 'SpeedDemon (IIITK)', score: '2,480m', yourScore: runnerHigh ? `${runnerHigh}m` : '0m' },
    { game: 'SPONSOR SHOOTER', topScorer: 'StarAce (MNIT)', score: '5,200 pts', yourScore: '3,850 pts' },
    { game: 'QUICK REFLEX', topScorer: 'LightningBot (BITS)', score: '172ms', yourScore: reflexBest ? `${reflexBest}ms` : '--' },
    { game: 'RETRO SNAKE', topScorer: 'SerpentKing (IITJ)', score: '420 pts', yourScore: snakeHigh ? `${snakeHigh} pts` : '0 pts' }
  ];

  const getRankBadge = (rank) => {
    switch (rank) {
      case 1:
        return (
          <div className="w-8 h-8 rounded-full bg-yellow-400 text-slate-950 font-display font-black text-sm flex items-center justify-center shadow-lg shadow-yellow-400/50">
            🥇
          </div>
        );
      case 2:
        return (
          <div className="w-8 h-8 rounded-full bg-slate-300 text-slate-950 font-display font-black text-sm flex items-center justify-center shadow-lg shadow-slate-300/40">
            🥈
          </div>
        );
      case 3:
        return (
          <div className="w-8 h-8 rounded-full bg-amber-600 text-white font-display font-black text-sm flex items-center justify-center shadow-lg shadow-amber-600/40">
            🥉
          </div>
        );
      default:
        return (
          <div className="w-8 h-8 rounded-full bg-purple-950 border border-purple-700 text-purple-300 font-display font-black text-xs flex items-center justify-center">
            #{rank}
          </div>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/90 backdrop-blur-lg select-none">
      <div className="relative w-full max-w-5xl h-[92vh] flex flex-col bg-[#080515] border-2 sm:border-3 border-yellow-400 rounded-3xl shadow-2xl shadow-yellow-500/25 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-purple-900/60 bg-[#120826]">
          <div className="flex items-center gap-3.5">
            <div className="p-2.5 rounded-2xl bg-yellow-950 border border-yellow-400 shadow-lg shadow-yellow-500/20">
              <Trophy size={28} className="text-yellow-400 animate-bounce" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-display text-lg sm:text-2xl text-white font-black tracking-wider uppercase">
                  HIGH SCORE BOULEVARD
                </h2>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-yellow-400 text-black font-display font-black uppercase">
                  HALL OF FAME
                </span>
              </div>
              <p className="font-body text-xs sm:text-sm text-yellow-300 font-bold uppercase tracking-wider mt-0.5">
                CAMPUS & ARCADE LEADERBOARDS • REVÉRIE 2K27
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {/* Privacy toggle */}
            <button
              onClick={() => {
                soundEngine.playBlip();
                setAnonMode(!anonMode);
              }}
              title="Toggle Anonymous Privacy Display"
              className="px-3 py-1.5 rounded-xl bg-purple-950/80 hover:bg-purple-900 border border-purple-700 text-purple-200 text-xs font-display font-bold flex items-center gap-1.5 cursor-pointer transition-all"
            >
              {anonMode ? <EyeOff size={14} className="text-rose-400" /> : <Eye size={14} className="text-emerald-400" />}
              <span className="hidden sm:inline">{anonMode ? 'ANON' : 'PUBLIC'}</span>
            </button>

            <button
              onClick={() => {
                soundEngine.playBlip();
                onClose();
              }}
              className="p-2.5 rounded-xl bg-slate-900 hover:bg-rose-900 text-slate-300 hover:text-white transition-colors cursor-pointer"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Category Tabs */}
        <div className="px-4 py-3 bg-[#100724] border-b border-purple-900/40 flex items-center justify-between gap-2 overflow-x-auto shrink-0">
          <div className="flex items-center gap-2">
            {[
              { id: 'all', label: 'ALL-STAR ACES', icon: Trophy },
              { id: 'coins', label: 'COIN TYCOONS', icon: Coins },
              { id: 'games', label: 'MINI-GAME LEGENDS', icon: Gamepad2 }
            ].map(tab => {
              const IconComp = tab.icon;
              const isActive = activeCategory === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    soundEngine.playBlip();
                    setActiveCategory(tab.id);
                  }}
                  className={`px-3.5 py-1.5 rounded-xl font-display text-xs sm:text-sm font-black uppercase tracking-wider transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${
                    isActive
                      ? 'bg-yellow-400 text-black shadow-lg shadow-yellow-400/30 scale-105'
                      : 'bg-[#180e34] text-slate-300 hover:bg-purple-900 hover:text-white border border-purple-800'
                  }`}
                >
                  <IconComp size={15} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Quick Player Stat Capsule */}
          <div className="hidden md:flex items-center gap-3 text-xs font-mono text-yellow-300 px-3 py-1 rounded-xl bg-purple-950/70 border border-yellow-500/40">
            <span>YOUR SCORE: <strong>{totalCompositeScore} PTS</strong></span>
          </div>
        </div>

        {/* Content Viewport */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {/* TAB 1: ALL-STAR ACES */}
          {activeCategory === 'all' && (
            <div className="space-y-3">
              {allStarRoster.map((player) => (
                <div
                  key={player.rank}
                  className={`p-3.5 sm:p-4 rounded-2xl border-2 transition-all flex items-center justify-between gap-3 ${
                    player.isUser
                      ? 'bg-gradient-to-r from-[#200f40] via-[#160a33] to-[#200f40] border-yellow-400 shadow-xl shadow-yellow-400/20 ring-1 ring-yellow-400'
                      : 'bg-[#110826]/80 border-purple-900/60 hover:border-purple-600'
                  }`}
                >
                  <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                    {getRankBadge(player.rank)}

                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="font-display text-sm sm:text-base font-black text-white truncate">
                          {player.name}
                        </h4>
                        {player.isUser && (
                          <span className="px-2 py-0.5 rounded-full bg-yellow-400 text-black font-display font-black text-[9px] uppercase">
                            YOU
                          </span>
                        )}
                        {player.badge && (
                          <span className="px-2 py-0.5 rounded-md bg-purple-950 border border-purple-700 text-purple-300 font-mono text-[9px] font-bold uppercase hidden sm:inline">
                            {player.badge}
                          </span>
                        )}
                      </div>

                      <p className="font-body text-xs text-slate-300 truncate">
                        {player.title} {player.tag && `• ${player.tag}`}
                      </p>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="font-display text-base sm:text-xl font-black text-yellow-300 tracking-wider block">
                      {player.score.toLocaleString()}
                    </span>
                    <span className="font-mono text-[10px] text-slate-400 uppercase">
                      ARCADE PTS
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB 2: COIN TYCOONS */}
          {activeCategory === 'coins' && (
            <div className="space-y-3">
              {coinTycoonsRoster.map((tycoon) => (
                <div
                  key={tycoon.rank}
                  className={`p-4 rounded-2xl border-2 transition-all flex items-center justify-between gap-3 ${
                    tycoon.isUser
                      ? 'bg-[#1e0f3d] border-amber-400 shadow-xl shadow-amber-500/20 ring-1 ring-amber-400'
                      : 'bg-[#110826]/80 border-purple-900/60'
                  }`}
                >
                  <div className="flex items-center gap-3.5">
                    {getRankBadge(tycoon.rank)}
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-display text-base font-black text-white">
                          {tycoon.name}
                        </h4>
                        {tycoon.isUser && (
                          <span className="px-2 py-0.5 rounded-full bg-yellow-400 text-black font-display font-black text-[9px] uppercase">
                            YOU
                          </span>
                        )}
                      </div>
                      <p className="font-body text-xs text-slate-300">
                        {tycoon.tag}
                      </p>
                    </div>
                  </div>

                  <div className="text-right flex items-center gap-2">
                    <Coins size={18} className="text-yellow-400 animate-spin" />
                    <div>
                      <span className="font-display text-lg font-black text-yellow-300 tracking-wider block">
                        {tycoon.coins.toLocaleString()}
                      </span>
                      <span className="font-mono text-[10px] text-slate-400 uppercase">
                        COINS HOARDED
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB 3: MINI-GAME LEGENDS */}
          {activeCategory === 'games' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {miniGameLegends.map((game, idx) => (
                <div 
                  key={idx}
                  className="p-5 rounded-2xl bg-[#12082b] border-2 border-purple-800/80 hover:border-yellow-400 transition-all shadow-xl space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-display text-xs font-black px-2.5 py-0.5 rounded-full bg-pink-950 border border-pink-500 text-pink-300 uppercase">
                      {game.game}
                    </span>
                    <Trophy size={16} className="text-yellow-400" />
                  </div>

                  <div className="p-3 rounded-xl bg-black/60 border border-purple-950">
                    <span className="text-[10px] font-mono text-slate-400 uppercase block mb-1">
                      ALL-TIME CAMPUS RECORD
                    </span>
                    <div className="flex items-center justify-between">
                      <span className="font-display text-sm font-bold text-white">
                        {game.topScorer}
                      </span>
                      <span className="font-display text-base font-black text-yellow-300">
                        {game.score}
                      </span>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-[#190d38] border border-cyan-500/40 flex items-center justify-between">
                    <span className="text-xs font-display font-bold text-cyan-300 uppercase">
                      YOUR PERSONAL BEST:
                    </span>
                    <span className="font-display text-base font-black text-cyan-200">
                      {game.yourScore}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 sm:p-5 border-t border-purple-900/60 bg-[#100722] flex flex-col sm:flex-row items-center justify-between gap-3">
          <span className="text-xs font-body font-semibold text-slate-300">
            Rankings refresh in real-time as you collect coins and complete tournament trials.
          </span>
          <button
            onClick={() => {
              soundEngine.playBlip();
              onClose();
            }}
            className="pixel-btn pixel-btn-dark text-xs px-6 py-2.5 cursor-pointer"
          >
            RETURN TO PIXELVERSE
          </button>
        </div>
      </div>
    </div>
  );
}
