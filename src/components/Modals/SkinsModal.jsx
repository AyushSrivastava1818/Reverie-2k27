import React, { useState } from 'react';
import { X, Sparkles, Check, Shirt, Lock, Unlock, Coins, Trophy } from 'lucide-react';
import { eventBus } from '../../game/EventBus';
import { soundEngine } from '../../game/systems/SoundEngine';
import { achievementSystem } from '../../game/systems/AchievementSystem';

export function SkinsModal({ currentSkin, onSelectSkin, onClose }) {
  const coins = achievementSystem.state.coinsCollected || 0;
  const questsCount = achievementSystem.getUnlockedCount();
  const isSpecialUnlocked = achievementSystem.isUnlocked('secret_finder') || questsCount >= 2 || coins >= 50;

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
      isLocked: false
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
      isLocked: coins < 10 && questsCount < 1,
      lockHint: 'Collect 10 coins or complete 1 quest'
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
      isLocked: coins < 25 && questsCount < 2,
      lockHint: 'Collect 25 coins or complete 2 quests'
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
      isLocked: coins < 40 && questsCount < 3,
      lockHint: 'Collect 40 coins or complete 3 quests'
    },
    {
      id: 'player_special',
      name: 'REVERIE SPECIAL EDITION',
      title: 'Cosmic Iridescent Champion',
      desc: 'Marquee festival armor: Deep ultraviolet suit, luminous golden mantle, and the official sharp white REVERIE crest.',
      badge: '★ EXCLUSIVE QUEST ★',
      border: 'border-amber-400 hover:border-yellow-300 ring-1 ring-yellow-400/40',
      tagColor: 'bg-yellow-950 text-yellow-300 border-yellow-400/60',
      glow: 'from-purple-400/40',
      isLocked: !isSpecialUnlocked,
      lockHint: 'Discover Secret Creator Vault or collect 50 coins'
    }
  ];

  const handleChoose = (skin) => {
    if (skin.isLocked) {
      soundEngine.playBuzzer && soundEngine.playBuzzer();
      return;
    }
    soundEngine.playFanfare();
    eventBus.emit('change-skin', skin.id);
    if (onSelectSkin) onSelectSkin(skin.id);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-4xl max-h-[92vh] flex flex-col bg-[#0d081f] border-3 border-pink-500 rounded-2xl shadow-2xl shadow-pink-500/25 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-purple-900/60 bg-[#140c2e]">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-pink-950/80 border border-pink-500/50 rounded-xl">
              <Shirt size={24} className="text-pink-400" />
            </div>
            <div>
              <h2 className="font-gaming text-xl sm:text-2xl font-extrabold text-white">
                HERO AVATAR WARDROBE
              </h2>
              <p className="font-tech text-xs sm:text-sm text-yellow-300 mt-0.5 uppercase font-semibold">
                SELECT YOUR CHARACTER SKIN • COINS: {coins} • QUESTS: {questsCount}/6
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              soundEngine.playBlip();
              onClose();
            }}
            className="p-2 rounded-xl bg-slate-800 hover:bg-rose-900 text-slate-300 hover:text-white transition-colors cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Skins Grid */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {skins.map((skin) => {
              const isSelected = currentSkin === skin.id;
              return (
                <div
                  key={skin.id}
                  className={`group relative p-4 rounded-xl border-2 ${skin.border} bg-[#140b2e]/90 flex flex-col justify-between transition-all ${
                    skin.isLocked ? 'opacity-65' : 'hover:scale-[1.01]'
                  } ${isSelected ? 'ring-2 ring-emerald-400 bg-emerald-950/25' : ''}`}
                >
                  <div className="flex gap-4">
                    {/* Retro Pixel Avatar Showcase Pedestal */}
                    <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-[#080318] border-2 border-purple-500/40 flex flex-col items-center justify-center shrink-0 overflow-hidden shadow-inner group-hover:border-pink-400 transition-all">
                      {/* Ambient Radial Aura */}
                      <div className={`absolute inset-0 bg-radial ${skin.glow} to-transparent opacity-80 pointer-events-none`} />

                      {/* 48x48 Pixel-Art Character Frame */}
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

                      {/* Glowing Neon Ground Rail */}
                      <div className="absolute bottom-1.5 inset-x-2 h-1 rounded-full bg-gradient-to-r from-transparent via-cyan-400/70 to-transparent shadow-[0_0_8px_rgba(6,182,212,0.8)]" />

                      {/* Lock Overlay if locked */}
                      {skin.isLocked && (
                        <div className="absolute inset-0 bg-black/65 backdrop-blur-[1px] flex items-center justify-center z-20">
                          <Lock size={22} className="text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.8)]" />
                        </div>
                      )}
                    </div>

                    {/* Skin Details */}
                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                      <div>
                        {/* Badge & Status */}
                        <div className="flex items-center justify-between mb-1.5">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold border uppercase tracking-wider ${skin.tagColor}`}>
                            {skin.badge}
                          </span>
                          {isSelected ? (
                            <span className="flex items-center gap-1 text-emerald-400 text-xs font-bold font-gaming">
                              <Check size={14} /> ACTIVE
                            </span>
                          ) : skin.isLocked ? (
                            <span className="flex items-center gap-1 text-rose-400 text-xs font-bold">
                              <Lock size={14} /> LOCKED
                            </span>
                          ) : (
                            <span className="text-purple-300 text-xs font-bold">
                              UNLOCKED
                            </span>
                          )}
                        </div>

                        {/* Skin Name & Title */}
                        <h3 className="font-gaming text-base sm:text-lg font-black text-white truncate">{skin.name}</h3>
                        <p className="font-tech text-xs text-purple-300 font-semibold mb-1 truncate">{skin.title}</p>
                        <p className="font-body text-[11px] sm:text-xs text-slate-300 leading-snug line-clamp-2">{skin.desc}</p>
                      </div>
                    </div>
                  </div>

                  {/* Action / Lock requirement */}
                  <div className="mt-3 pt-2.5 border-t border-purple-900/50 flex items-center justify-between">
                    {skin.isLocked ? (
                      <span className="text-[11px] text-amber-300 font-bold flex items-center gap-1">
                        <Lock size={12} className="text-amber-400" /> {skin.lockHint}
                      </span>
                    ) : (
                      <button
                        onClick={() => handleChoose(skin)}
                        disabled={isSelected}
                        className={`w-full py-2 px-4 rounded-lg font-gaming text-xs font-black tracking-wider uppercase transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-emerald-900/60 text-emerald-200 border border-emerald-500 cursor-default'
                            : 'bg-pink-600 hover:bg-pink-500 text-white shadow-lg hover:shadow-pink-500/40 active:scale-95'
                        }`}
                      >
                        {isSelected ? 'EQUIPPED' : 'EQUIP SKIN'}
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
          <div className="text-xs text-purple-300 font-bold flex items-center gap-2">
            <Sparkles size={16} className="text-yellow-400" />
            <span>Skins update your retro 8-bit character sprite across all 5 kingdoms!</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-purple-950 hover:bg-purple-900 border border-purple-500/60 text-white font-gaming text-xs font-bold cursor-pointer"
          >
            CLOSE
          </button>
        </div>
      </div>
    </div>
  );
}
