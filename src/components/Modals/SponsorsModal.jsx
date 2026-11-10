import React, { useState, useEffect } from 'react';
import { 
  X, HeartHandshake, Megaphone, Zap, Users2, Globe, Rocket, Shield, 
  ExternalLink, Gift, Coins, Ticket, CheckCircle2, Copy, ShieldAlert, Award, Shirt, Utensils, Star
} from 'lucide-react';
import { whySponsorUs, pastSponsors } from '../../data/sponsors';
import { sponsorshipPerksData } from '../../data/sponsorshipPerks';
import { soundEngine } from '../../game/systems/SoundEngine';
import { achievementSystem } from '../../game/systems/AchievementSystem';
import { SponsorGalaxy } from '../Arcade/SponsorGalaxy';
import { REWARD_TIERS } from './RewardsShopModal';
import confetti from 'canvas-confetti';

export function SponsorsModal({ onClose, initialTab = 'galaxy' }) {
  const [activeTab, setActiveTab] = useState(initialTab || 'galaxy');
  
  // Rewards Shop state
  const [balance, setBalance] = useState(achievementSystem.getBalance());
  const [totalEarned, setTotalEarned] = useState(achievementSystem.getTotalEarned());
  const [rewardsSubTab, setRewardsSubTab] = useState('shop'); // 'shop' | 'claims'
  const [redeemedList, setRedeemedList] = useState(achievementSystem.getRedeemedRewards());
  const [claimedDialog, setClaimedDialog] = useState(null);
  const [copiedId, setCopiedId] = useState(null);

  useEffect(() => {
    setBalance(achievementSystem.getBalance());
    setTotalEarned(achievementSystem.getTotalEarned());
    setRedeemedList(achievementSystem.getRedeemedRewards());
  }, [activeTab]);

  const handleClaimReward = (reward) => {
    soundEngine.playBlip();
    const result = achievementSystem.redeemShopReward(reward);
    if (result.success) {
      setBalance(achievementSystem.getBalance());
      setRedeemedList(achievementSystem.getRedeemedRewards());
      setClaimedDialog(result.record);
      try {
        confetti({
          particleCount: 50,
          spread: 70,
          origin: { y: 0.35 },
          colors: ['#fbbf24', '#f59e0b', '#ec4899', '#06b6d4']
        });
      } catch (e) {}
    } else {
      soundEngine.playHit();
      alert(result.reason || 'Could not redeem reward');
    }
  };

  const copyCode = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedId(code);
    soundEngine.playBlip();
    setTimeout(() => setCopiedId(null), 2000);
  };

  const getPillarIcon = (icon) => {
    switch (icon) {
      case 'Megaphone': return <Megaphone size={24} className="text-pink-400" />;
      case 'Zap': return <Zap size={24} className="text-yellow-400" />;
      case 'Users2': return <Users2 size={24} className="text-cyan-400" />;
      case 'Globe': default: return <Globe size={24} className="text-emerald-400" />;
    }
  };

  const getRewardIcon = (iconName) => {
    switch (iconName) {
      case 'Shirt': return <Shirt size={22} className="text-cyan-400" />;
      case 'Utensils': return <Utensils size={22} className="text-emerald-400" />;
      case 'Star': return <Star size={22} className="text-yellow-400" />;
      case 'Award': return <Award size={22} className="text-rose-400" />;
      case 'Gift': default: return <Gift size={22} className="text-purple-400" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-5 md:p-6 bg-black/90 backdrop-blur-lg select-none animate-fadeIn">
      <div className="relative w-[98vw] max-w-5xl h-[94vh] flex flex-col bg-[#080515] border-2 sm:border-3 border-emerald-500 rounded-3xl shadow-2xl shadow-emerald-500/25 overflow-hidden">
        
        {/* ------------------------------------------------------------- */}
        {/* UNIFIED HEADER: BRAND PARTNERSHIPS & REWARDS                   */}
        {/* ------------------------------------------------------------- */}
        <div className="flex items-center justify-between p-3.5 sm:px-6 sm:py-4 border-b border-purple-900/60 bg-[#120826] shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 sm:p-2.5 rounded-2xl bg-emerald-950 border border-emerald-400 shadow-md shadow-emerald-500/20">
              <HeartHandshake size={24} className="text-emerald-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-display text-base sm:text-xl font-black text-white uppercase tracking-wider">
                  SPONSORS & ARCADE REWARDS
                </h2>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-400 text-slate-950 font-display font-black uppercase">
                  UNIFIED HUB
                </span>
              </div>
              <p className="font-body text-xs text-purple-200 mt-0.5 font-medium hidden sm:block">
                Play Sponsor Galaxy • Discover Brand Partners • Redeem Coins for Festival Perks
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Live Wallet Chip */}
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
        {/* UNIFIED TABS: SHOOTER | BROWSE SPONSORS | REWARDS | WHY       */}
        {/* ------------------------------------------------------------- */}
        <div className="px-3 sm:px-6 py-2.5 bg-[#0f0722] border-b border-purple-900/50 flex items-center justify-between gap-2 overflow-x-auto no-scrollbar shrink-0">
          <div className="flex items-center gap-1.5 sm:gap-2">
            <button
              onClick={() => {
                soundEngine.playBlip();
                setActiveTab('galaxy');
              }}
              className={`px-3 py-1.5 rounded-xl text-xs sm:text-sm font-display font-black uppercase tracking-wider transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${
                activeTab === 'galaxy' 
                  ? 'bg-gradient-to-r from-pink-600 to-purple-600 text-white shadow-lg shadow-pink-600/40 ring-1 ring-white/60 scale-105' 
                  : 'bg-purple-950/60 text-pink-300 hover:bg-purple-900 hover:text-white border border-pink-500/30'
              }`}
            >
              <Rocket size={14} className="text-pink-300" />
              <span>SPONSOR SHOOTER</span>
            </button>

            <button
              onClick={() => {
                soundEngine.playBlip();
                setActiveTab('sponsors');
              }}
              className={`px-3 py-1.5 rounded-xl text-xs sm:text-sm font-display font-bold uppercase tracking-wider transition-all shrink-0 cursor-pointer ${
                activeTab === 'sponsors' 
                  ? 'bg-emerald-400 text-slate-950 font-black shadow-lg shadow-emerald-400/40 scale-105 ring-1 ring-white/60' 
                  : 'bg-purple-950/60 text-slate-300 hover:bg-purple-900 hover:text-white border border-purple-800'
              }`}
            >
              BROWSE SPONSORS ({pastSponsors.length})
            </button>

            <button
              onClick={() => {
                soundEngine.playBlip();
                setActiveTab('rewards');
              }}
              className={`px-3 py-1.5 rounded-xl text-xs sm:text-sm font-display font-black uppercase tracking-wider transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${
                activeTab === 'rewards' 
                  ? 'bg-yellow-400 text-slate-950 shadow-lg shadow-yellow-400/40 scale-105 ring-1 ring-white/60' 
                  : 'bg-amber-950/60 text-yellow-300 hover:bg-amber-900 hover:text-white border border-yellow-500/40'
              }`}
            >
              <Gift size={14} className="text-yellow-400" />
              <span>REWARDS SHOP</span>
            </button>

            <button
              onClick={() => {
                soundEngine.playBlip();
                setActiveTab('why');
              }}
              className={`px-3 py-1.5 rounded-xl text-xs sm:text-sm font-display font-bold uppercase tracking-wider transition-all shrink-0 cursor-pointer ${
                activeTab === 'why' 
                  ? 'bg-purple-600 text-white font-black shadow-lg scale-105' 
                  : 'bg-purple-950/60 text-slate-300 hover:bg-purple-900 hover:text-white border border-purple-800'
              }`}
            >
              WHY SPONSOR US?
            </button>
          </div>
        </div>

        {/* ------------------------------------------------------------- */}
        {/* TAB 1: SPONSOR GALAXY (IMMEDIATELY PLAYABLE SPACE SHOOTER)    */}
        {/* ------------------------------------------------------------- */}
        {activeTab === 'galaxy' && (
          <div className="flex-1 overflow-hidden flex flex-col">
            <SponsorGalaxy 
              onSkipToDirectory={() => setActiveTab('sponsors')}
              onOpenRewards={() => setActiveTab('rewards')}
              onSelectSponsor={() => {}}
              onClose={onClose}
            />
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* TAB 2: BROWSE COMPLETE SPONSORS GALLERY & PERKS MATRIX         */}
        {/* ------------------------------------------------------------- */}
        {activeTab === 'sponsors' && (
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 bg-[#080515]">
            
            {/* Header / Intro */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-[#12082b] p-4 rounded-2xl border border-emerald-500/40">
              <div>
                <h3 className="font-display text-base sm:text-lg text-emerald-300 uppercase font-black">
                  OFFICIAL REVERIE SPONSOR DIRECTORY
                </h3>
                <p className="font-body text-xs sm:text-sm text-slate-200 mt-0.5">
                  Explore 13 premier industry and ecosystem partners supporting student innovation at IIIT Kota.
                </p>
              </div>

              <button
                onClick={() => setActiveTab('galaxy')}
                className="px-4 py-2 rounded-xl bg-pink-600 hover:bg-pink-500 text-white font-display text-xs font-black uppercase tracking-wider flex items-center gap-1.5 shadow-md shadow-pink-600/30 cursor-pointer shrink-0"
              >
                <Rocket size={14} />
                <span>PLAY SPONSOR SHOOTER</span>
              </button>
            </div>

            {/* Sponsor Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {pastSponsors.map((sponsor) => (
                <div 
                  key={sponsor.name}
                  className="bg-[#120826] border-2 border-purple-800/80 hover:border-emerald-400 p-4 rounded-2xl flex flex-col justify-between transition-all group hover:scale-[1.01] shadow-lg"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="w-16 h-16 rounded-xl bg-white p-2 flex items-center justify-center shrink-0 shadow">
                        <img 
                          src={sponsor.logo} 
                          alt={sponsor.name} 
                          className="max-w-full max-h-full object-contain" 
                        />
                      </div>
                      <span className="font-display text-[10px] text-emerald-300 bg-emerald-950 px-2.5 py-1 rounded-full border border-emerald-500/50 font-bold uppercase">
                        {sponsor.tier}
                      </span>
                    </div>

                    <h4 className="font-display text-lg font-black text-white group-hover:text-emerald-300 transition-colors">
                      {sponsor.name}
                    </h4>

                    <p className="font-body text-xs text-slate-200 mt-1.5 leading-relaxed font-medium">
                      {sponsor.description || 'Official past collaborator across technical tracks, hackathons, and student workshops.'}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-purple-900/50 flex items-center justify-between">
                    {sponsor.website ? (
                      <a 
                        href={sponsor.website} 
                        target="_blank" 
                        rel="noreferrer"
                        className="text-xs text-cyan-400 hover:text-cyan-300 font-display font-bold flex items-center gap-1 uppercase tracking-wider"
                      >
                        <span>OFFICIAL WEBSITE</span>
                        <ExternalLink size={12} />
                      </a>
                    ) : (
                      <span className="text-[11px] text-slate-400 font-mono">PARTNER</span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Deliverables Matrix Section */}
            <div className="mt-8 space-y-3">
              <h3 className="font-display text-sm sm:text-base text-yellow-300 uppercase font-black">
                SPONSORSHIP DELIVERABLES MATRIX (PAGE 28)
              </h3>
              
              <div className="overflow-x-auto border-2 border-purple-800 rounded-2xl bg-[#120826] shadow-xl">
                <table className="w-full text-left text-xs sm:text-sm text-slate-100 border-collapse">
                  <thead>
                    <tr className="bg-[#1c0e3a] border-b-2 border-purple-800 text-xs font-display font-black text-cyan-300">
                      <th className="p-3.5 border-r border-purple-800">DELIVERABLES</th>
                      {sponsorshipPerksData.columns.map((col) => (
                        <th key={col} className="p-3.5 text-center border-r border-purple-800 last:border-r-0 whitespace-nowrap">
                          {col}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {sponsorshipPerksData.rows.map((row, idx) => (
                      <tr 
                        key={idx}
                        className={`border-b border-purple-900/40 hover:bg-purple-950/50 transition-colors ${
                          idx % 2 === 0 ? 'bg-[#120826]' : 'bg-[#0f0720]'
                        }`}
                      >
                        <td className="p-3.5 font-body font-bold text-slate-200 border-r border-purple-800">
                          {row.perk}
                        </td>
                        {sponsorshipPerksData.columns.map((col) => {
                          const val = row[col];
                          return (
                            <td key={col} className="p-3.5 text-center border-r border-purple-800 last:border-r-0 font-display text-xs">
                              {val === 'YES' ? (
                                <span className="inline-block px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 font-black border border-emerald-500/40">✓</span>
                              ) : val === 'NO' ? (
                                <span className="text-slate-600 font-bold">—</span>
                              ) : (
                                <span className="font-bold text-yellow-300">{val}</span>
                              )}
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* TAB 3: INTEGRATED REWARDS SHOP (COIN REDEMPTION ECONOMY)      */}
        {/* ------------------------------------------------------------- */}
        {activeTab === 'rewards' && (
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-[#080515]">
            
            {/* Rewards Sub-Tabs & Wallet Header */}
            <div className="flex flex-wrap items-center justify-between gap-3 bg-[#110729] p-4 rounded-2xl border border-yellow-500/50">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => { soundEngine.playBlip(); setRewardsSubTab('shop'); }}
                  className={`px-3.5 py-1.5 rounded-xl font-display text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
                    rewardsSubTab === 'shop'
                      ? 'bg-yellow-400 text-slate-950 shadow-md'
                      : 'bg-purple-950/70 text-slate-300 hover:text-white border border-purple-800'
                  }`}
                >
                  REWARD PERKS ({REWARD_TIERS.length})
                </button>
                <button
                  onClick={() => { soundEngine.playBlip(); setRewardsSubTab('claims'); }}
                  className={`px-3.5 py-1.5 rounded-xl font-display text-xs font-black uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer ${
                    rewardsSubTab === 'claims'
                      ? 'bg-yellow-400 text-slate-950 shadow-md'
                      : 'bg-purple-950/70 text-slate-300 hover:text-white border border-purple-800'
                  }`}
                >
                  <Ticket size={14} />
                  <span>MY REDEMPTIONS ({redeemedList.length})</span>
                </button>
              </div>

              <div className="flex items-center gap-2">
                <span className="font-display text-xs text-yellow-400 font-bold">
                  BALANCE: {balance} COINS
                </span>
                <span className="text-slate-500">•</span>
                <span className="font-mono text-xs text-slate-400">
                  Total Earned: {totalEarned}
                </span>
              </div>
            </div>

            {/* Disclaimer Banner */}
            <div className="p-3 rounded-xl bg-purple-950/40 border border-purple-800/60 flex items-start gap-2.5 text-xs text-slate-300">
              <ShieldAlert size={16} className="text-yellow-400 shrink-0 mt-0.5" />
              <p>
                Earn coins by playing Sponsor Galaxy or discovering festival secrets. Redeem coins below for digital wardrobe skins, cafeteria vouchers, official merch kits, and VIP passes!
              </p>
            </div>

            {/* SHOP VIEW */}
            {rewardsSubTab === 'shop' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {REWARD_TIERS.map((tier) => {
                  const canAfford = balance >= tier.cost;
                  const alreadyClaimed = tier.singleClaim && redeemedList.some(r => r.rewardId === tier.id);

                  return (
                    <div
                      key={tier.id}
                      className={`p-4 rounded-2xl border-2 transition-all flex flex-col justify-between ${tier.color} ${
                        alreadyClaimed 
                          ? 'opacity-70 bg-[#0c061e] border-slate-700' 
                          : 'hover:scale-[1.01] shadow-lg'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between gap-2 mb-2">
                          <span className="font-display text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-black/50 border border-current">
                            {tier.category}
                          </span>
                          <span className="font-display text-sm font-black text-yellow-300 flex items-center gap-1">
                            <Coins size={14} className="text-yellow-400" />
                            {tier.cost} COINS
                          </span>
                        </div>

                        <div className="flex items-start gap-3 my-2">
                          <div className="p-2.5 rounded-xl bg-black/40 border border-current shrink-0">
                            {getRewardIcon(tier.icon)}
                          </div>
                          <div>
                            <h4 className="font-display text-base font-black text-white leading-tight">
                              {tier.title}
                            </h4>
                            <p className="font-body text-xs text-slate-200 mt-1 leading-relaxed font-medium">
                              {tier.description}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="mt-4 pt-3 border-t border-purple-900/50">
                        {alreadyClaimed ? (
                          <div className="w-full py-2 rounded-xl bg-slate-900 text-slate-400 font-display text-xs font-bold uppercase text-center flex items-center justify-center gap-1.5">
                            <CheckCircle2 size={14} className="text-emerald-400" />
                            <span>CLAIMED & UNLOCKED</span>
                          </div>
                        ) : (
                          <button
                            onClick={() => handleClaimReward(tier)}
                            disabled={!canAfford}
                            className={`w-full py-2.5 rounded-xl font-display text-xs font-black uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all ${
                              canAfford
                                ? 'bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-300 hover:to-amber-400 text-slate-950 shadow-md shadow-yellow-500/30 cursor-pointer hover:scale-[1.02]'
                                : 'bg-slate-900/80 border border-slate-700 text-slate-500 cursor-not-allowed'
                            }`}
                          >
                            <Gift size={14} />
                            <span>{canAfford ? 'CLAIM REWARD' : `NEED ${tier.cost - balance} MORE COINS`}</span>
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* CLAIMS VIEW */}
            {rewardsSubTab === 'claims' && (
              <div className="space-y-3">
                {redeemedList.length === 0 ? (
                  <div className="text-center py-16 text-slate-400 bg-[#100726] rounded-2xl border border-purple-900">
                    <Ticket size={40} className="mx-auto mb-2 text-purple-400 opacity-60" />
                    <h4 className="font-display text-lg font-bold text-white">NO REWARDS CLAIMED YET</h4>
                    <p className="font-body text-xs mt-1">Play Sponsor Galaxy to earn coins and claim festival rewards!</p>
                  </div>
                ) : (
                  redeemedList.map((rec) => (
                    <div 
                      key={rec.id}
                      className="p-4 rounded-xl bg-[#13082b] border border-purple-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-md"
                    >
                      <div>
                        <span className="text-[10px] font-display font-black text-yellow-400 uppercase tracking-wider">
                          CLAIMED VOUCHER
                        </span>
                        <h4 className="font-display text-base font-black text-white">
                          {rec.title}
                        </h4>
                        <span className="font-mono text-xs text-slate-400">
                          {new Date(rec.claimedAt).toLocaleString()} • Cost: {rec.cost} Coins
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="px-3 py-1.5 rounded-lg bg-black/70 border border-yellow-400/60 font-mono text-xs font-black text-yellow-300 tracking-wider">
                          {rec.voucherCode}
                        </span>
                        <button
                          onClick={() => copyCode(rec.voucherCode)}
                          className="px-3 py-1.5 rounded-lg bg-purple-900 hover:bg-purple-800 text-white font-display text-xs font-bold uppercase flex items-center gap-1 cursor-pointer"
                        >
                          <Copy size={13} />
                          <span>{copiedId === rec.voucherCode ? 'COPIED' : 'COPY'}</span>
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* TAB 4: WHY SPONSOR US (PILLARS & IMPACT)                       */}
        {/* ------------------------------------------------------------- */}
        {activeTab === 'why' && (
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-[#080515]">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {whySponsorUs.map((item, idx) => (
                <div 
                  key={idx}
                  className="bg-[#120826] border-2 border-purple-800/80 p-5 rounded-2xl flex flex-col gap-3 shadow-lg"
                >
                  <div className="p-3 rounded-xl bg-purple-950/80 border border-purple-700/50 w-fit">
                    {getPillarIcon(item.icon)}
                  </div>
                  <h4 className="font-display text-base font-black text-white uppercase tracking-wider">
                    {item.title}
                  </h4>
                  <p className="font-body text-xs sm:text-sm text-slate-300 leading-relaxed font-medium">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* CLAIM SUCCESS DIALOG */}
        {claimedDialog && (
          <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
            <div className="bg-[#12072b] border-2 border-yellow-400 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl relative text-center">
              <CheckCircle2 size={44} className="text-yellow-400 mx-auto mb-3 animate-bounce" />
              <h3 className="font-display text-2xl font-black text-white uppercase">
                REWARD REDEEMED!
              </h3>
              <p className="font-body text-sm text-slate-200 mt-1 mb-4">
                You successfully redeemed <strong className="text-yellow-300 font-display">{claimedDialog.title}</strong>!
              </p>

              <div className="p-3 rounded-xl bg-black/80 border border-yellow-400/80 mb-6">
                <span className="text-[10px] font-mono text-slate-400 uppercase block mb-1">
                  OFFICIAL VOUCHER PASSCODE
                </span>
                <span className="font-mono text-xl font-black text-yellow-300 tracking-widest">
                  {claimedDialog.voucherCode}
                </span>
              </div>

              <div className="flex gap-2 justify-center">
                <button
                  onClick={() => copyCode(claimedDialog.voucherCode)}
                  className="px-5 py-2.5 rounded-xl bg-purple-900 hover:bg-purple-800 text-white font-display text-xs font-bold uppercase flex items-center gap-1.5 cursor-pointer"
                >
                  <Copy size={14} />
                  <span>{copiedId === claimedDialog.voucherCode ? 'COPIED!' : 'COPY CODE'}</span>
                </button>
                <button
                  onClick={() => setClaimedDialog(null)}
                  className="px-6 py-2.5 rounded-xl bg-yellow-400 hover:bg-yellow-300 text-slate-950 font-display text-xs font-black uppercase cursor-pointer"
                >
                  DONE
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
