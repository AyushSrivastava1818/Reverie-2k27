import React, { useState, useEffect } from 'react';
import { X, Sparkles, Check, Shirt, Lock, Unlock, Coins, Trophy } from 'lucide-react';
import { eventBus } from '../../game/EventBus';
import { soundEngine } from '../../game/systems/SoundEngine';
import { achievementSystem } from '../../game/systems/AchievementSystem';
import confetti from 'canvas-confetti';

export function SkinsModal({ currentSkin, onSelectSkin, onClose }) {
  const [balance, setBalance] = useState(achievementSystem.getBalance());
  const questsCount = achievementSystem.getUnlockedCount();
  const isSpecialSecretUnlocked = achievementSystem.isUnlocked('secret_finder');

  const [purchasedSkins, setPurchasedSkins] = useState(() => {
    try {
      const saved = localStorage.getItem('reverie_unlocked_skins');
      return saved ? JSON.parse(saved) : ['player_mario'];
    } catch (e) {
      return ['player_mario'];
    }
  });

  useEffect(() => {
    setBalance(achievementSystem.getBalance());
  }, []);

  const skins = [
    {
      id: 'player_mario',
      name: 'CLASSIC MARIO',
      title: 'Retro Plumber Explorer',
      desc: 'The timeless icon: Vibrant red cap, denim blue overalls, white gloves and work boots.',
      badge: 'DEFAULT HERO',
      border: 'border-rose-500 hover:border-red-400',
      tagColor: 'bg-red-950 text-red-300 border-red-500/40',
      glow: 'from-rose-500/35',
      cost: 0,
      isUnlocked: true
    },
    {
      id: 'player_neon',
      name: 'CYBER NEON',
      title: 'Techno Hacker Agent',
      desc: 'Futuristic runner: Cyan audio helmet, electric violet hoodie, and emerald cyber boots.',
      badge: 'CYBERPUNK',
      border: 'border-cyan-500 hover:border-cyan-300',
      tagColor: 'bg-cyan-950 text-cyan-300 border-cyan-500/40',
      glow: 'from-cyan-500/35',
      cost: 10,
      isUnlocked: purchasedSkins.includes('player_neon') || questsCount >= 1
    },
    {
      id: 'player_synth',
      name: 'SYNTHWAVE PUNK',
      title: 'Pronite Stage Rockstar',
      desc: 'High-voltage performer: Hot magenta cap, deep obsidian jacket, and neon cyan footwear.',
      badge: 'FESTIVAL SPECIAL',
      border: 'border-pink-500 hover:border-pink-300',
      tagColor: 'bg-pink-950 text-pink-300 border-pink-500/40',
      glow: 'from-pink-500/35',
      cost: 25,
      isUnlocked: purchasedSkins.includes('player_synth') || questsCount >= 2
    },
    {
      id: 'player_gold',
      name: 'GOLDEN CHAMPION',
      title: 'Esports Summit Victor',
      desc: 'The high-roller: Gilded golden helmet, imperial emerald vest, and shiny gold boots.',
      badge: 'LEGENDARY',
      border: 'border-yellow-400 hover:border-amber-300',
      tagColor: 'bg-amber-950 text-yellow-300 border-yellow-500/40',
      glow: 'from-amber-400/35',
      cost: 40,
      isUnlocked: purchasedSkins.includes('player_gold') || questsCount >= 3
    },
    {
      id: 'player_special',
      name: 'REVERIE SPECIAL EDITION',
      title: 'Cosmic Iridescent Champion',
      desc: 'Marquee festival armor: Deep ultraviolet suit, luminous golden mantle, and official sharp REVERIE crest.',
      badge: '★ EXCLUSIVE ★',
      border: 'border-amber-400 hover:border-yellow-300 ring-1 ring-yellow-400/40',
      tagColor: 'bg-yellow-950 text-yellow-300 border-yellow-400/60',
      glow: 'from-purple-400/40',
      cost: 50,
      isUnlocked: purchasedSkins.includes('player_special') || isSpecialSecretUnlocked
    }
  ];

  const handleUnlockSkin = (skin) => {
    soundEngine.playBlip();
    if (balance < skin.cost) {
      soundEngine.playHit();
      alert(`You need ${skin.cost - balance} more coins to unlock this skin!`);
      return;
    }

    const success = achievementSystem.spendCoins(skin.cost);
    if (success) {
      const nextUnlocked = [...purchasedSkins, skin.id];
      setPurchasedSkins(nextUnlocked);
      localStorage.setItem('reverie_unlocked_skins', JSON.stringify(nextUnlocked));
      setBalance(achievementSystem.getBalance());
      soundEngine.playFanfare();
      try {
        confetti({
          particleCount: 50,
          spread: 70,
          origin: { y: 0.4 },
          colors: ['#fbbf24', '#f59e0b', '#ec4899', '#06b6d4']
        });
      } catch (e) {}
    }
  };

  const handleChoose = (skin) => {
    if (!skin.isUnlocked) {
      handleUnlockSkin(skin);
      return;
    }
    soundEngine.playFanfare();
    eventBus.emit('change-skin', skin.id);
    if (onSelectSkin) onSelectSkin(skin.id);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-fadeIn select-none">
      <div className="relative w-full max-w-4xl max-h-[92vh] flex flex-col bg-[#0d081f] border-3 border-cyan-500 rounded-3xl shadow-2xl shadow-cyan-500/25 overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-purple-900/60 bg-[#140c2e]">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-cyan-950/80 border border-cyan-500/50 rounded-xl">
              <Shirt size={24} className="text-cyan-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-display text-xl sm:text-2xl font-black text-white">
                  HERO AVATAR WARDROBE
                </h2>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-400 text-slate-950 font-display font-black uppercase">
                  SKINS
                </span>
              </div>
              <p className="font-body text-xs sm:text-sm text-yellow-300 mt-0.5 font-bold uppercase tracking-wider">
                UNLOCK & EQUIP AVATARS • COIN WALLET: {balance} COINS • QUESTS: {questsCount}/6
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="px-3 py-1.5 rounded-xl bg-amber-950/80 border border-yellow-400/80 flex items-center gap-1.5 shadow-sm">
              <Coins size={15} className="text-yellow-400" />
              <span className="font-display text-xs font-black text-yellow-300">
                {balance} COINS
              </span>
            </div>

            <button
              onClick={() => {
                soundEngine.playBlip();
                onClose();
              }}
              className="p-2 rounded-xl bg-slate-800 hover:bg-rose-900 text-slate-300 hover:text-white transition-colors cursor-pointer"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Skins Grid */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {skins.map((skin) => {
              const isSelected = currentSkin === skin.id;
              const canAfford = balance >= skin.cost;

              return (
                <div
                  key={skin.id}
                  className={`group relative p-4 rounded-2xl border-2 ${skin.border} bg-[#140b2e]/90 flex flex-col justify-between transition-all ${
                    !skin.isUnlocked ? 'opacity-85' : 'hover:scale-[1.01]'
                  } ${isSelected ? 'ring-2 ring-emerald-400 bg-emerald-950/25' : ''}`}
                >
                  <div className="flex gap-4">
                    {/* Retro Pixel Avatar Pedestal */}
                    <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-[#080318] border-2 border-purple-500/40 flex flex-col items-center justify-center shrink-0 overflow-hidden shadow-inner group-hover:border-cyan-400 transition-all">
                      <div className={`absolute inset-0 bg-radial ${skin.glow} to-transparent opacity-80 pointer-events-none`} />

                      <div 
                        className="relative z-10 w-12 h-12 transition-transform duration-300 group-hover:scale-115"
                        style={{
                          backgroundImage: `url(/assets/sprites/${skin.id}.png)`,
                          backgroundPosition: '0px 0px',
                          backgroundSize: '288px 48px',
                          backgroundRepeat: 'no-repeat',
                          imageRendering: 'pixelated',
                          transform: 'scale(1.85)',
                          transformOrigin: 'center'
                        }}
                      />

                      {!skin.isUnlocked && (
                        <div className="absolute inset-0 bg-black/60 backdrop-blur-[1px] flex items-center justify-center z-20">
                          <Lock size={20} className="text-yellow-400 drop-shadow" />
                        </div>
                      )}
                    </div>

                    {/* Skin Details */}
                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-display font-black border uppercase tracking-wider ${skin.tagColor}`}>
                            {skin.badge}
                          </span>

                          {isSelected ? (
                            <span className="flex items-center gap-1 text-emerald-400 text-xs font-display font-black">
                              <Check size={14} /> ACTIVE
                            </span>
                          ) : skin.isUnlocked ? (
                            <span className="text-cyan-300 text-xs font-display font-bold">
                              OWNED
                            </span>
                          ) : (
                            <span className="flex items-center gap-1 text-yellow-400 text-xs font-mono font-bold">
                              <Coins size={12} /> {skin.cost} COINS
                            </span>
                          )}
                        </div>

                        <h3 className="font-display text-base sm:text-lg font-black text-white truncate">{skin.name}</h3>
                        <p className="font-mono text-xs text-purple-300 font-semibold mb-1 truncate">{skin.title}</p>
                        <p className="font-body text-xs text-slate-300 leading-snug line-clamp-2">{skin.desc}</p>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="mt-3 pt-2.5 border-t border-purple-900/50">
                    {skin.isUnlocked ? (
                      <button
                        onClick={() => handleChoose(skin)}
                        disabled={isSelected}
                        className={`w-full py-2 px-4 rounded-xl font-display text-xs font-black tracking-wider uppercase transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-emerald-950 text-emerald-300 border border-emerald-500 cursor-default'
                            : 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-md shadow-cyan-500/30 active:scale-95'
                        }`}
                      >
                        {isSelected ? 'EQUIPPED IN PIXELVERSE' : 'EQUIP SKIN'}
                      </button>
                    ) : (
                      <button
                        onClick={() => handleUnlockSkin(skin)}
                        className={`w-full py-2 px-4 rounded-xl font-display text-xs font-black tracking-wider uppercase flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                          canAfford
                            ? 'bg-yellow-400 hover:bg-yellow-300 text-slate-950 shadow-md shadow-yellow-500/30 active:scale-95'
                            : 'bg-slate-900 text-slate-500 border border-slate-700 cursor-not-allowed'
                        }`}
                      >
                        <Unlock size={14} />
                        <span>{canAfford ? `UNLOCK FOR ${skin.cost} COINS` : `NEED ${skin.cost - balance} MORE COINS`}</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 sm:p-4 border-t border-purple-900/60 bg-[#140c2e] flex items-center justify-between">
          <div className="text-xs text-purple-200 font-medium flex items-center gap-2">
            <Sparkles size={15} className="text-yellow-400 shrink-0" />
            <span>Character skins apply seamlessly across all 5 living kingdoms!</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-purple-950 hover:bg-purple-900 border border-purple-500/60 text-white font-display text-xs font-bold cursor-pointer"
          >
            CLOSE
          </button>
        </div>
      </div>
    </div>
  );
}
