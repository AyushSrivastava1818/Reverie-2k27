import React, { useState, useEffect } from 'react';
import { 
  X, Trophy, Users, GraduationCap, Cpu, Heart, Activity, 
  Gamepad2, Coins, Compass, Sparkles, Award, Medal, CheckCircle2, Flame, Shield, ArrowRight
} from 'lucide-react';
import { festivalStats } from '../../data/statistics';
import { achievementsList } from '../../data/achievements';
import { soundEngine } from '../../game/systems/SoundEngine';
import { achievementSystem } from '../../game/systems/AchievementSystem';

export function StatsModal({ onClose, initialTab = 'stats' }) {
  const [activeTab, setActiveTab] = useState(initialTab || 'stats'); // 'stats' | 'leaderboard' | 'quests' | 'impact'
  
  // Live player statistics
  const [balance, setBalance] = useState(achievementSystem.getBalance());
  const [totalEarned, setTotalEarned] = useState(achievementSystem.getTotalEarned());
  const [visitedZones, setVisitedZones] = useState(achievementSystem.state.visitedZones || []);
  const [claimedQuests, setClaimedQuests] = useState(achievementSystem.state.claimedIds || []);
  
  // Mini-game scores from localStorage
  const [runnerHigh, setRunnerHigh] = useState(0);
  const [snakeHigh, setSnakeHigh] = useState(0);
  const [reflexBest, setReflexBest] = useState(null);

  useEffect(() => {
    setBalance(achievementSystem.getBalance());
    setTotalEarned(achievementSystem.getTotalEarned());
    setVisitedZones(achievementSystem.state.visitedZones || []);
    setClaimedQuests(achievementSystem.state.claimedIds || []);

    const rSaved = localStorage.getItem('reverie_runner_highscore');
    if (rSaved) setRunnerHigh(parseInt(rSaved, 10));

    const sSaved = localStorage.getItem('reverie_snake_high');
    if (sSaved) setSnakeHigh(parseInt(sSaved, 10));

    const refSaved = localStorage.getItem('reverie_reflex_best');
    if (refSaved) setReflexBest(parseInt(refSaved, 10));
  }, [activeTab]);

  const totalCompositeScore = 
    balance * 10 + 
    visitedZones.length * 500 + 
    claimedQuests.length * 300 + 
    runnerHigh * 2 + 
    snakeHigh * 5 + 
    (reflexBest && reflexBest < 300 ? 800 : 200);

  const allStarRoster = [
    { rank: 1, name: 'CyberPhoenix', tag: 'IIIT Kota CS', score: 14250, badge: 'LEGEND' },
    { rank: 2, name: 'RetroValkyrie', tag: 'BITS Pilani', score: 12890, badge: 'ACE' },
    { rank: 3, name: 'You (Challenger)', isUser: true, score: Math.max(10500, totalCompositeScore), badge: 'ACTIVE' },
    { rank: 4, name: 'ByteStriker', tag: 'MNIT Jaipur', score: 9840, badge: 'VETERAN' },
    { rank: 5, name: 'NeonSamurai', tag: 'IIT Jodhpur', score: 8720, badge: 'CHALLENGER' },
    { rank: 6, name: 'GlitchHunter', tag: 'RTU Kota', score: 7950, badge: 'PRO' },
    { rank: 7, name: 'QuantumCoder', tag: 'IIIT Vadodara', score: 7100, badge: 'SCOUT' }
  ].sort((a, b) => b.score - a.score).map((item, idx) => ({ ...item, rank: idx + 1 }));

  const miniGameLegends = [
    { game: 'PIXEL RUNNER', topScorer: 'SpeedDemon (IIITK)', score: '2,480m', yourScore: runnerHigh ? `${runnerHigh}m` : '0m' },
    { game: 'SPONSOR SHOOTER', topScorer: 'StarAce (MNIT)', score: '5,200 pts', yourScore: '3,850 pts' },
    { game: 'QUICK REFLEX', topScorer: 'LightningBot (BITS)', score: '172ms', yourScore: reflexBest ? `${reflexBest}ms` : '--' },
    { game: 'RETRO SNAKE', topScorer: 'SerpentKing (IITJ)', score: '420 pts', yourScore: snakeHigh ? `${snakeHigh} pts` : '0 pts' }
  ];

  const getImpactIcon = (id) => {
    switch (id) {
      case 'footfall': return <Users size={24} className="text-pink-400" />;
      case 'colleges': return <GraduationCap size={24} className="text-cyan-400" />;
      case 'workshops': return <Cpu size={24} className="text-emerald-400" />;
      case 'prizepool': return <Trophy size={24} className="text-yellow-400" />;
      case 'followers': return <Heart size={24} className="text-rose-400" />;
      case 'hits': return <Activity size={24} className="text-purple-400" />;
      case 'competitions': default: return <Gamepad2 size={24} className="text-amber-400" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-5 md:p-6 bg-black/90 backdrop-blur-lg select-none animate-fadeIn">
      <div className="relative w-[98vw] max-w-5xl h-[94vh] flex flex-col bg-[#080515] border-2 sm:border-3 border-yellow-500 rounded-3xl shadow-2xl shadow-yellow-500/25 overflow-hidden">
        
        {/* ------------------------------------------------------------- */}
        {/* UNIFIED HEADER: STATS & SCORES                                */}
        {/* ------------------------------------------------------------- */}
        <div className="flex items-center justify-between p-3.5 sm:px-6 sm:py-4 border-b border-purple-900/60 bg-[#120826] shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 sm:p-2.5 rounded-2xl bg-amber-950 border border-yellow-400 shadow-md shadow-yellow-500/20">
              <Trophy size={24} className="text-yellow-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-display text-base sm:text-xl font-black text-white uppercase tracking-wider">
                  STATS & LEADERBOARD
                </h2>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-yellow-400 text-slate-950 font-display font-black uppercase">
                  UNIFIED
                </span>
              </div>
              <p className="font-body text-xs text-purple-200 mt-0.5 font-medium hidden sm:block">
                Player Records • High Scores • Festival Quests • Verified Impact
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="px-3 py-1 rounded-xl bg-amber-950/80 border border-yellow-500/80 flex items-center gap-1.5 shadow-sm">
              <Coins size={14} className="text-yellow-400" />
              <span className="font-display text-xs font-black text-yellow-300">
                {balance} COINS
              </span>
            </div>

            <button
              onClick={() => {
                soundEngine.playBlip();
                onClose();
              }}
              className="p-1.5 sm:px-2.5 sm:py-1 rounded-xl bg-slate-900 hover:bg-rose-950 text-slate-300 hover:text-white border border-slate-700 hover:border-rose-500 transition-all cursor-pointer font-display text-xs font-bold uppercase flex items-center gap-1"
            >
              <span className="hidden sm:inline">CLOSE</span>
              <X size={16} />
            </button>
          </div>
        </div>

        {/* ------------------------------------------------------------- */}
        {/* TABS: PLAYER STATS | LEADERBOARD | QUESTS | IMPACT           */}
        {/* ------------------------------------------------------------- */}
        <div className="px-3 sm:px-6 py-2.5 bg-[#0f0722] border-b border-purple-900/50 flex items-center gap-1.5 sm:gap-2 overflow-x-auto no-scrollbar shrink-0">
          <button
            onClick={() => {
              soundEngine.playBlip();
              setActiveTab('stats');
            }}
            className={`px-3 py-1.5 rounded-xl text-xs sm:text-sm font-display font-black uppercase tracking-wider transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${
              activeTab === 'stats'
                ? 'bg-yellow-400 text-slate-950 shadow-lg shadow-yellow-400/40 scale-105 ring-1 ring-white/60'
                : 'bg-purple-950/60 text-slate-300 hover:bg-purple-900 hover:text-white border border-purple-800'
            }`}
          >
            <Compass size={14} />
            <span>PLAYER PROGRESS</span>
          </button>

          <button
            onClick={() => {
              soundEngine.playBlip();
              setActiveTab('leaderboard');
            }}
            className={`px-3 py-1.5 rounded-xl text-xs sm:text-sm font-display font-black uppercase tracking-wider transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${
              activeTab === 'leaderboard'
                ? 'bg-yellow-400 text-slate-950 shadow-lg shadow-yellow-400/40 scale-105 ring-1 ring-white/60'
                : 'bg-purple-950/60 text-slate-300 hover:bg-purple-900 hover:text-white border border-purple-800'
            }`}
          >
            <Flame size={14} className="text-amber-400" />
            <span>LEADERBOARD & SCORES</span>
          </button>

          <button
            onClick={() => {
              soundEngine.playBlip();
              setActiveTab('quests');
            }}
            className={`px-3 py-1.5 rounded-xl text-xs sm:text-sm font-display font-black uppercase tracking-wider transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${
              activeTab === 'quests'
                ? 'bg-yellow-400 text-slate-950 shadow-lg shadow-yellow-400/40 scale-105 ring-1 ring-white/60'
                : 'bg-purple-950/60 text-slate-300 hover:bg-purple-900 hover:text-white border border-purple-800'
            }`}
          >
            <Sparkles size={14} className="text-cyan-400" />
            <span>QUESTS ({claimedQuests.length}/{achievementsList.length})</span>
          </button>

          <button
            onClick={() => {
              soundEngine.playBlip();
              setActiveTab('impact');
            }}
            className={`px-3 py-1.5 rounded-xl text-xs sm:text-sm font-display font-bold uppercase tracking-wider transition-all shrink-0 cursor-pointer ${
              activeTab === 'impact'
                ? 'bg-purple-600 text-white font-black shadow-lg scale-105'
                : 'bg-purple-950/60 text-slate-300 hover:bg-purple-900 hover:text-white border border-purple-800'
            }`}
          >
            FESTIVAL IMPACT
          </button>
        </div>

        {/* ------------------------------------------------------------- */}
        {/* TAB 1: PLAYER PROGRESS & SUMMARY                              */}
        {/* ------------------------------------------------------------- */}
        {activeTab === 'stats' && (
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5 bg-[#080515]">
            
            {/* Top Cards Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              <div className="p-4 rounded-2xl bg-[#13082b] border-2 border-yellow-500/70 shadow-lg">
                <span className="text-[10px] font-display font-black text-amber-300 uppercase block">CURRENT WALLET</span>
                <div className="flex items-center gap-2 mt-1">
                  <Coins size={22} className="text-yellow-400" />
                  <span className="font-display text-2xl font-black text-yellow-300">{balance}</span>
                </div>
                <span className="text-[10px] font-mono text-slate-400 mt-1 block">Total Earned: {totalEarned}</span>
              </div>

              <div className="p-4 rounded-2xl bg-[#13082b] border-2 border-cyan-500/70 shadow-lg">
                <span className="text-[10px] font-display font-black text-cyan-300 uppercase block">KINGDOMS EXPLORED</span>
                <div className="flex items-center gap-2 mt-1">
                  <Compass size={22} className="text-cyan-400" />
                  <span className="font-display text-2xl font-black text-cyan-300">{visitedZones.length} / 5</span>
                </div>
                <span className="text-[10px] font-mono text-slate-400 mt-1 block">Traversed across fest maps</span>
              </div>

              <div className="p-4 rounded-2xl bg-[#13082b] border-2 border-purple-500/70 shadow-lg">
                <span className="text-[10px] font-display font-black text-purple-300 uppercase block">COMPOSITE ARCADE POWER</span>
                <div className="flex items-center gap-2 mt-1">
                  <Award size={22} className="text-purple-400" />
                  <span className="font-display text-2xl font-black text-white">{totalCompositeScore}</span>
                </div>
                <span className="text-[10px] font-mono text-slate-400 mt-1 block">Global Festival Ranking</span>
              </div>

              <div className="p-4 rounded-2xl bg-[#13082b] border-2 border-emerald-500/70 shadow-lg">
                <span className="text-[10px] font-display font-black text-emerald-300 uppercase block">QUESTS CLAIMED</span>
                <div className="flex items-center gap-2 mt-1">
                  <CheckCircle2 size={22} className="text-emerald-400" />
                  <span className="font-display text-2xl font-black text-emerald-300">{claimedQuests.length} / {achievementsList.length}</span>
                </div>
                <span className="text-[10px] font-mono text-slate-400 mt-1 block">Arcade Milestones</span>
              </div>
            </div>

            {/* Kingdom Exploration Checklist */}
            <div className="p-4 sm:p-5 rounded-2xl bg-[#110729] border border-purple-800">
              <h3 className="font-display text-sm font-black text-yellow-300 uppercase tracking-wider mb-3">
                5 KINGDOMS EXPLORATION STATUS
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2.5">
                {[
                  { key: 'StartingKingdomScene', name: 'Starting Kingdom', icon: '🏰' },
                  { key: 'TechKingdomScene', name: 'Tech Kingdom', icon: '💻' },
                  { key: 'CultureKingdomScene', name: 'Culture Kingdom', icon: '🎸' },
                  { key: 'FlagshipScene', name: 'Flagship Arena', icon: '🎪' },
                  { key: 'FestivalPlazaScene', name: 'Festival Plaza', icon: '🏛️' }
                ].map((k) => {
                  const visited = visitedZones.includes(k.key);
                  return (
                    <div 
                      key={k.key}
                      className={`p-3 rounded-xl border flex items-center justify-between gap-2 ${
                        visited 
                          ? 'bg-[#180e38] border-emerald-500 text-white' 
                          : 'bg-[#0a0518] border-purple-950 text-slate-500'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{k.icon}</span>
                        <span className="font-display text-xs font-bold line-clamp-1">{k.name}</span>
                      </div>
                      <span className={`text-[10px] font-black uppercase ${visited ? 'text-emerald-400' : 'text-slate-600'}`}>
                        {visited ? 'VISITED' : 'LOCKED'}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Personal Bests in Mini-Games */}
            <div className="p-4 sm:p-5 rounded-2xl bg-[#110729] border border-purple-800">
              <h3 className="font-display text-sm font-black text-cyan-300 uppercase tracking-wider mb-3">
                YOUR MINI-GAME PERSONAL BESTS
              </h3>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3 rounded-xl bg-[#160b33] border border-purple-700/60">
                  <span className="text-[10px] font-mono text-slate-400 uppercase block">PIXEL RUNNER</span>
                  <span className="font-display text-lg font-black text-yellow-300">{runnerHigh ? `${runnerHigh}m` : '0m'}</span>
                </div>
                <div className="p-3 rounded-xl bg-[#160b33] border border-purple-700/60">
                  <span className="text-[10px] font-mono text-slate-400 uppercase block">RETRO SNAKE</span>
                  <span className="font-display text-lg font-black text-emerald-300">{snakeHigh ? `${snakeHigh} pts` : '0 pts'}</span>
                </div>
                <div className="p-3 rounded-xl bg-[#160b33] border border-purple-700/60">
                  <span className="text-[10px] font-mono text-slate-400 uppercase block">QUICK REFLEX</span>
                  <span className="font-display text-lg font-black text-cyan-300">{reflexBest ? `${reflexBest}ms` : '--'}</span>
                </div>
                <div className="p-3 rounded-xl bg-[#160b33] border border-purple-700/60">
                  <span className="text-[10px] font-mono text-slate-400 uppercase block">SPONSOR SHOOTER</span>
                  <span className="font-display text-lg font-black text-pink-300">Active Ace</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* TAB 2: LEADERBOARD & SCORES                                   */}
        {/* ------------------------------------------------------------- */}
        {activeTab === 'leaderboard' && (
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5 bg-[#080515]">
            
            {/* Top Leaderboard Roster */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-display text-sm font-black text-yellow-300 uppercase tracking-wider">
                  HIGH SCORE ALL-STAR LEADERBOARD
                </h3>
                <span className="text-xs font-mono text-slate-400">
                  Calculated from Coins, Mini-Games, and Quests
                </span>
              </div>

              <div className="space-y-2">
                {allStarRoster.map((player) => (
                  <div
                    key={player.name}
                    className={`p-3 sm:px-4 sm:py-3 rounded-xl border flex items-center justify-between gap-3 transition-all ${
                      player.isUser
                        ? 'bg-[#201040] border-yellow-400 shadow-lg shadow-yellow-500/20 scale-[1.01]'
                        : 'bg-[#120828] border-purple-900/70 hover:border-purple-600'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className={`w-7 h-7 rounded-full flex items-center justify-center font-display font-black text-xs ${
                        player.rank === 1 ? 'bg-yellow-400 text-slate-950' :
                        player.rank === 2 ? 'bg-slate-300 text-slate-950' :
                        player.rank === 3 ? 'bg-amber-600 text-white' :
                        'bg-purple-950 border border-purple-700 text-purple-300'
                      }`}>
                        #{player.rank}
                      </span>

                      <div>
                        <div className="flex items-center gap-2">
                          <span className={`font-display text-sm font-black ${player.isUser ? 'text-yellow-300' : 'text-white'}`}>
                            {player.name}
                          </span>
                          <span className="text-[9px] font-display font-bold px-1.5 py-0.5 rounded bg-purple-950 border border-purple-700 text-purple-300 uppercase">
                            {player.badge}
                          </span>
                        </div>
                        {player.tag && (
                          <span className="text-[10px] font-mono text-slate-400">{player.tag}</span>
                        )}
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="font-display text-sm sm:text-base font-black text-yellow-300">
                        {player.score.toLocaleString()} PTS
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Mini-Game Legends Comparison */}
            <div className="p-4 rounded-2xl bg-[#110729] border border-purple-800">
              <h3 className="font-display text-sm font-black text-cyan-300 uppercase tracking-wider mb-3">
                MINI-GAME BENCHMARK COMPARISONS
              </h3>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs sm:text-sm text-slate-200 border-collapse">
                  <thead>
                    <tr className="border-b border-purple-800 font-display text-[11px] text-slate-400 uppercase">
                      <th className="pb-2">GAME</th>
                      <th className="pb-2">TOP RECORD</th>
                      <th className="pb-2">RECORD HOLDER</th>
                      <th className="pb-2 text-right">YOUR SCORE</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-purple-900/40 font-body">
                    {miniGameLegends.map((item) => (
                      <tr key={item.game} className="hover:bg-purple-950/40 transition-colors">
                        <td className="py-2.5 font-display font-black text-white">{item.game}</td>
                        <td className="py-2.5 font-mono text-yellow-400 font-bold">{item.score}</td>
                        <td className="py-2.5 text-slate-300">{item.topScorer}</td>
                        <td className="py-2.5 text-right font-display font-black text-cyan-300">{item.yourScore}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* TAB 3: ACHIEVEMENT QUESTS                                     */}
        {/* ------------------------------------------------------------- */}
        {activeTab === 'quests' && (
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3.5 bg-[#080515]">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-display text-sm font-black text-cyan-300 uppercase tracking-wider">
                FESTIVAL QUESTS & MILESTONES
              </h3>
              <span className="text-xs font-mono text-yellow-400">
                {claimedQuests.length} of {achievementsList.length} Completed
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {achievementsList.map((quest) => {
                const isClaimed = claimedQuests.includes(quest.id);

                return (
                  <div
                    key={quest.id}
                    className={`p-4 rounded-2xl border-2 flex items-start gap-3.5 transition-all ${
                      isClaimed
                        ? 'bg-[#140b2e] border-emerald-500 shadow-md'
                        : 'bg-[#100726] border-purple-900/70'
                    }`}
                  >
                    <div className="w-12 h-12 rounded-xl bg-black/60 border border-purple-700 flex items-center justify-center text-2xl shrink-0">
                      {quest.icon}
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center justify-between gap-1 mb-1">
                        <h4 className="font-display text-sm font-black text-white">
                          {quest.title}
                        </h4>
                        <span className={`text-[10px] font-display font-black px-2 py-0.5 rounded uppercase ${
                          isClaimed ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/50' : 'bg-slate-900 text-slate-400 border border-slate-700'
                        }`}>
                          {isClaimed ? 'COMPLETED' : 'IN PROGRESS'}
                        </span>
                      </div>

                      <p className="font-body text-xs text-slate-300 leading-relaxed font-medium">
                        {quest.description}
                      </p>

                      <div className="mt-2.5 pt-2 border-t border-purple-900/40 flex items-center justify-between text-[11px] font-mono text-yellow-300">
                        <span>Reward: {quest.reward}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* TAB 4: FESTIVAL IMPACT HISTORICAL BENCHMARKS                  */}
        {/* ------------------------------------------------------------- */}
        {activeTab === 'impact' && (
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-[#080515]">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {festivalStats.map((stat) => (
                <div 
                  key={stat.id}
                  className="bg-[#120826] border-2 border-purple-800/70 p-4 sm:p-5 rounded-2xl flex flex-col justify-between shadow-lg"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="p-2.5 rounded-xl bg-purple-950 border border-purple-700/50">
                      {getImpactIcon(stat.id)}
                    </div>
                    <span className="font-display text-[10px] text-yellow-300 bg-yellow-950 px-2 py-0.5 rounded-full border border-yellow-500/50 font-bold uppercase">
                      VERIFIED
                    </span>
                  </div>

                  <div>
                    <div className="font-display text-2xl sm:text-3xl font-black text-white">
                      {stat.value}
                    </div>
                    <div className="font-display text-xs text-purple-300 mt-1 uppercase font-bold">
                      {stat.label}
                    </div>
                    <p className="font-body text-xs text-slate-300 mt-1.5 leading-relaxed font-medium">
                      {stat.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-4 rounded-xl bg-[#140b2e] border border-purple-600/50 text-xs font-body font-semibold text-purple-200 text-center">
              ✨ Verified impact metrics sourced directly from official REVERIE records. IIIT Kota Annual Festival.
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
