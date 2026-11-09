import React, { useState, useEffect } from 'react';
import { 
  X, Coins, Gift, ShieldAlert, CheckCircle2, Copy, Sparkles, 
  ExternalLink, Shirt, Utensils, Award, Star, Ticket, Clock, AlertTriangle 
} from 'lucide-react';
import { achievementSystem } from '../../game/systems/AchievementSystem';
import { soundEngine } from '../../game/systems/SoundEngine';
import confetti from 'canvas-confetti';

export const REWARD_TIERS = [
  {
    id: 'skin_mario',
    tier: '50-COIN TIER',
    cost: 50,
    title: 'Arcade Pioneer Character Skin',
    category: 'Avatar Skin',
    icon: 'Shirt',
    color: 'border-cyan-500 bg-cyan-950/40 text-cyan-300',
    description: 'Unlock exclusive retro pixel avatar skin in your festival wardrobe.',
    disclaimer: 'Instantly equipped in Hero Avatar Wardrobe for exploring the Pixelverse.',
    stock: 'Unlimited Digital',
    singleClaim: true
  },
  {
    id: 'skin_cyber',
    tier: '100-COIN TIER',
    cost: 100,
    title: 'Cyber Neon Techno Runner',
    category: 'Avatar Skin',
    icon: 'Shirt',
    color: 'border-blue-500 bg-blue-950/40 text-blue-300',
    description: 'High-voltage cyan helmet & cybernetic runner suit for tech realm dominance.',
    disclaimer: 'Equipped directly in Hero Avatar Wardrobe.',
    stock: 'Unlimited Digital',
    singleClaim: true
  },
  {
    id: 'skin_synthwave',
    tier: '200-COIN TIER',
    cost: 200,
    title: 'Synthwave Punk Rockstar Skin',
    category: 'Avatar Skin',
    icon: 'Shirt',
    color: 'border-pink-500 bg-pink-950/40 text-pink-300',
    description: 'Pronite stage rockstar apparel with radiant neon magenta trailing aura.',
    disclaimer: 'Equipped directly in Hero Avatar Wardrobe.',
    stock: 'Unlimited Digital',
    singleClaim: true
  },
  {
    id: 'skin_golden',
    tier: '300-COIN TIER',
    cost: 300,
    title: 'Golden Champion Gilded Armor',
    category: 'Legendary Skin',
    icon: 'Star',
    color: 'border-amber-500 bg-amber-950/40 text-amber-300',
    description: 'Luminous gilded champion mantle reserved for high-score festival aces.',
    disclaimer: 'Equipped directly in Hero Avatar Wardrobe.',
    stock: 'Unlimited Digital',
    singleClaim: true
  },
  {
    id: 'pass_food',
    tier: '500-COIN TIER',
    cost: 500,
    title: 'Fest Cafeteria Food Voucher Pass',
    category: 'Campus Perk',
    icon: 'Utensils',
    color: 'border-emerald-500 bg-emerald-950/40 text-emerald-300',
    description: 'Official eligibility token for campus food stall snacks during Revérie 2K27.',
    disclaimer: 'Festival eligibility token. Present voucher code & valid Student ID at Campus Central Helpdesk / Cafeteria Booth for organizer verification.',
    stock: 'Subject to Fest Stock Allocation',
    singleClaim: false
  },
  {
    id: 'pass_merch',
    tier: '750-COIN TIER',
    cost: 750,
    title: 'Official REVERIE 2K27 Merch Kit',
    category: 'Physical Merch',
    icon: 'Gift',
    color: 'border-purple-500 bg-purple-950/40 text-purple-300',
    description: 'Eligibility token for festival stickers, badges & official event commemorative souvenir.',
    disclaimer: 'Official eligibility pass. Present voucher code & Student ID at the Festival Honor Pavilion desk during fest days for distribution.',
    stock: 'Subject to Fest Stock Allocation',
    singleClaim: false
  },
  {
    id: 'pass_vip',
    tier: '1000-COIN TIER',
    cost: 1000,
    title: 'VIP Backstage & Pronite Arena Pass',
    category: 'VIP Experience',
    icon: 'Award',
    color: 'border-rose-500 bg-rose-950/40 text-rose-300',
    description: 'Premium eligibility voucher for priority front-row standing and backstage celebration lounge.',
    disclaimer: 'Official eligibility token. Verification and pass allotment managed exclusively by IIIT Kota Student Festival Secretariat upon ID check.',
    stock: 'Exclusive Top Tier',
    singleClaim: false
  }
];

export function RewardsShopModal({ onClose, onOpenWardrobe }) {
  const [balance, setBalance] = useState(achievementSystem.getBalance());
  const [totalEarned, setTotalEarned] = useState(achievementSystem.getTotalEarned());
  const [activeTab, setActiveTab] = useState('shop'); // 'shop' | 'claims'
  const [redeemedList, setRedeemedList] = useState(achievementSystem.getRedeemedRewards());
  const [claimedDialog, setClaimedDialog] = useState(null);
  const [copiedId, setCopiedId] = useState(null);

  useEffect(() => {
    setBalance(achievementSystem.getBalance());
    setTotalEarned(achievementSystem.getTotalEarned());
    setRedeemedList(achievementSystem.getRedeemedRewards());
  }, []);

  const handleClaim = (reward) => {
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 md:p-8 bg-black/90 backdrop-blur-lg select-none">
      <div className="relative w-[96vw] max-w-5xl h-[92vh] flex flex-col bg-[#080514] border-2 sm:border-3 border-yellow-500 rounded-3xl shadow-2xl shadow-yellow-500/25 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-5 sm:p-6 border-b border-purple-900/60 bg-[#120826]">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-yellow-950 border border-yellow-500/80 shadow-lg shadow-yellow-500/20">
              <Gift size={28} className="text-yellow-400 animate-bounce" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-display text-xl sm:text-3xl font-black text-white">
                  ARCADE REWARDS SHOP
                </h2>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-yellow-400 text-black font-display font-black uppercase">
                  COIN ECONOMY
                </span>
              </div>
              <p className="font-body text-xs sm:text-sm text-yellow-300 font-bold uppercase tracking-wider mt-0.5">
                EARN COINS IN REALMS & MINI-GAMES • REDEEM FOR OFFICIAL FESTIVAL PERKS
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              soundEngine.playBlip();
              onClose();
            }}
            className="p-2.5 rounded-xl bg-slate-900 hover:bg-rose-900 text-slate-300 hover:text-white transition-colors cursor-pointer"
          >
            <X size={22} />
          </button>
        </div>

        {/* Live Wallet & Navigation Sub-header */}
        <div className="px-5 py-3.5 bg-[#100722] border-b border-purple-900/50 flex flex-wrap items-center justify-between gap-3 shrink-0">
          {/* TAB BUTTONS */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => { soundEngine.playBlip(); setActiveTab('shop'); }}
              className={`px-4 py-2 rounded-xl font-display text-xs sm:text-sm font-black uppercase tracking-wider transition-all cursor-pointer ${
                activeTab === 'shop'
                  ? 'bg-yellow-400 text-black shadow-lg shadow-yellow-400/40 scale-105'
                  : 'bg-purple-950/60 text-slate-300 hover:bg-purple-900 hover:text-white border border-purple-800'
              }`}
            >
              AVAILABLE REWARDS ({REWARD_TIERS.length})
            </button>
            <button
              onClick={() => { soundEngine.playBlip(); setActiveTab('claims'); }}
              className={`px-4 py-2 rounded-xl font-display text-xs sm:text-sm font-black uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'claims'
                  ? 'bg-yellow-400 text-black shadow-lg shadow-yellow-400/40 scale-105'
                  : 'bg-purple-950/60 text-slate-300 hover:bg-purple-900 hover:text-white border border-purple-800'
              }`}
            >
              <Ticket size={16} />
              <span>MY REDEMPTIONS ({redeemedList.length})</span>
            </button>
          </div>

          {/* WALLET BALANCE BADGE */}
          <div className="flex items-center gap-3">
            <div className="px-4 py-2 rounded-2xl bg-amber-950/80 border-2 border-yellow-400/80 flex items-center gap-2.5 shadow-lg shadow-yellow-500/20">
              <Coins size={20} className="text-yellow-400 animate-spin" />
              <div>
                <span className="text-[10px] font-display font-black text-amber-300 uppercase block leading-none">
                  WALLET BALANCE
                </span>
                <span className="font-display text-lg font-black text-yellow-300 tracking-wider">
                  {balance} COINS
                </span>
              </div>
            </div>

            <div className="hidden sm:block text-right">
              <span className="text-[10px] font-mono text-slate-400 uppercase block">Total Earned</span>
              <span className="font-mono text-xs font-bold text-slate-300">{totalEarned} Coins</span>
            </div>
          </div>
        </div>

        {/* Content View */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          {/* TAB 1: REWARDS CATALOG */}
          {activeTab === 'shop' && (
            <div className="space-y-4">
              {/* Official Disclaimer Banner */}
              <div className="p-3.5 rounded-2xl bg-purple-950/50 border border-purple-700/60 flex items-start gap-3 text-slate-300">
                <ShieldAlert size={20} className="text-yellow-400 shrink-0 mt-0.5" />
                <div className="text-xs space-y-1">
                  <p className="font-semibold text-yellow-300 uppercase font-display">
                    ORGANIZER VERIFICATION NOTICE
                  </p>
                  <p className="leading-relaxed">
                    Digital vouchers and eligibility passes earned in the arcade universe are valid for presentation at the IIIT Kota Festival Secretariat / Honor Pavilion desk. Final allotment of physical merchandise & dining perks is managed in accordance with official festival guidelines.
                  </p>
                </div>
              </div>

              {/* Reward Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {REWARD_TIERS.map((tier) => {
                  const canAfford = balance >= tier.cost;
                  const isRedeemed = tier.singleClaim && achievementSystem.isRewardRedeemed(tier.id);

                  return (
                    <div
                      key={tier.id}
                      className={`relative p-5 rounded-2xl border-2 transition-all flex flex-col justify-between ${
                        tier.color
                      } ${canAfford && !isRedeemed ? 'hover:scale-[1.02] shadow-xl' : 'opacity-85'}`}
                    >
                      <div>
                        {/* Header Badge */}
                        <div className="flex items-center justify-between mb-2">
                          <span className="px-2.5 py-0.5 rounded-full bg-black/60 font-display text-[10px] font-black tracking-wider uppercase border border-current">
                            {tier.tier}
                          </span>
                          <span className="text-xs font-mono font-bold text-slate-300">
                            {tier.stock}
                          </span>
                        </div>

                        {/* Title */}
                        <h3 className="font-display text-lg font-black text-white mt-1">
                          {tier.title}
                        </h3>

                        {/* Cost Badge */}
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-amber-950/70 border border-yellow-500/60 my-2.5">
                          <Coins size={14} className="text-yellow-400" />
                          <span className="font-display text-sm font-black text-yellow-300">
                            {tier.cost} COINS
                          </span>
                        </div>

                        {/* Description */}
                        <p className="font-body text-xs text-slate-200 leading-relaxed font-semibold mb-2">
                          {tier.description}
                        </p>

                        {/* Disclaimer note */}
                        <p className="font-body text-[10px] text-slate-400 italic">
                          ℹ️ {tier.disclaimer}
                        </p>
                      </div>

                      {/* Action Button */}
                      <div className="pt-4 mt-3 border-t border-purple-900/40">
                        {isRedeemed ? (
                          <div className="w-full py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-400 font-display text-xs font-bold uppercase text-center flex items-center justify-center gap-1.5">
                            <CheckCircle2 size={16} className="text-emerald-400" />
                            <span>ALREADY CLAIMED</span>
                          </div>
                        ) : (
                          <button
                            onClick={() => handleClaim(tier)}
                            disabled={!canAfford}
                            className={`w-full py-2.5 rounded-xl font-display text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer ${
                              canAfford
                                ? 'bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-300 hover:to-amber-400 text-black shadow-lg shadow-yellow-500/30'
                                : 'bg-slate-900 border border-slate-800 text-slate-500 cursor-not-allowed'
                            }`}
                          >
                            <Gift size={16} />
                            <span>{canAfford ? 'CLAIM REWARD NOW' : `NEED ${tier.cost - balance} MORE COINS`}</span>
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 2: MY REDEEMED VOUCHERS */}
          {activeTab === 'claims' && (
            <div className="space-y-4">
              <div className="font-display text-xs text-yellow-400 font-black uppercase tracking-wider">
                ACTIVE DIGITAL VOUCHERS & REDEMPTION PASSES ({redeemedList.length})
              </div>

              {redeemedList.length === 0 ? (
                <div className="p-12 text-center rounded-2xl bg-[#120826] border border-purple-900/60 text-slate-400 space-y-3">
                  <Ticket size={40} className="mx-auto text-purple-400 opacity-60" />
                  <p className="font-display text-base font-bold text-white">
                    NO VOUCHERS CLAIMED YET
                  </p>
                  <p className="font-body text-xs text-slate-300 max-w-sm mx-auto">
                    Explore festival realms, collect coins, play the arcade shooter, and redeem official merchandise and festival passes!
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {redeemedList.map((rec, idx) => (
                    <div 
                      key={idx}
                      className="p-5 rounded-2xl bg-[#13092b] border-2 border-yellow-500/70 shadow-xl relative flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="px-2.5 py-0.5 rounded-full bg-yellow-400 text-black font-display text-[10px] font-black uppercase">
                            OFFICIAL VERIFIED PASS
                          </span>
                          <span className="text-[11px] font-mono text-slate-400">
                            {new Date(rec.claimedAt).toLocaleDateString()}
                          </span>
                        </div>

                        <h4 className="font-display text-lg font-black text-white">
                          {rec.title}
                        </h4>

                        <div className="p-3 my-3 rounded-xl bg-black/60 border border-purple-800 flex items-center justify-between">
                          <div>
                            <span className="text-[10px] font-mono text-slate-400 block">VOUCHER CLAIM CODE</span>
                            <span className="font-mono text-base font-black text-yellow-300 tracking-wider">
                              {rec.code}
                            </span>
                          </div>
                          <button
                            onClick={() => copyCode(rec.code)}
                            className="p-2 rounded-lg bg-purple-950 hover:bg-purple-800 text-slate-300 hover:text-white transition-all cursor-pointer"
                            title="Copy code"
                          >
                            <Copy size={16} />
                          </button>
                        </div>

                        <p className="font-body text-xs text-slate-300 leading-relaxed font-semibold">
                          📌 {rec.disclaimer}
                        </p>
                      </div>

                      {copiedId === rec.code && (
                        <div className="mt-2 text-center text-xs font-mono text-emerald-400 font-bold">
                          ✓ CODE COPIED TO CLIPBOARD
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 sm:p-5 border-t border-purple-900/60 bg-[#100722] flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs font-body font-semibold text-slate-300 flex items-center gap-2">
            <Sparkles size={16} className="text-yellow-400 animate-spin" />
            <span>Earn coins freely by roaming realms, finding secrets & defeating sponsor galaxy probes!</span>
          </div>
          <button
            onClick={() => {
              soundEngine.playBlip();
              onClose();
            }}
            className="pixel-btn pixel-btn-dark text-xs px-6 py-2.5 cursor-pointer"
          >
            RETURN TO FESTIVAL
          </button>
        </div>
      </div>

      {/* CONFIRMATION MODAL ON SUCCESSFUL REDEMPTION */}
      {claimedDialog && (
        <div className="fixed inset-0 z-60 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#12082b] border-3 border-yellow-400 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl text-center relative animate-scaleUp">
            <div className="w-16 h-16 rounded-full bg-yellow-400/20 border-2 border-yellow-400 flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 size={36} className="text-yellow-400 animate-bounce" />
            </div>

            <h3 className="font-display text-2xl font-black text-white">
              REWARD CLAIMED!
            </h3>
            <p className="font-display text-sm font-bold text-yellow-300 mt-1 uppercase">
              {claimedDialog.title}
            </p>

            <div className="p-4 rounded-2xl bg-black/70 border-2 border-yellow-500/60 my-4 text-center">
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest block mb-1">
                YOUR UNIQUE VOUCHER TOKEN
              </span>
              <span className="font-mono text-2xl font-black text-yellow-300 tracking-widest">
                {claimedDialog.code}
              </span>
            </div>

            <p className="font-body text-xs text-slate-300 leading-relaxed mb-6">
              {claimedDialog.disclaimer}
            </p>

            <button
              onClick={() => setClaimedDialog(null)}
              className="w-full py-3 rounded-xl bg-yellow-400 hover:bg-yellow-300 text-black font-display text-sm font-black uppercase tracking-wider shadow-xl shadow-yellow-500/30 cursor-pointer"
            >
              GOT IT, THANKS!
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

