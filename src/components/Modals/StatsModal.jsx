import React from 'react';
import { X, Trophy, Users, GraduationCap, Cpu, Heart, Activity, Gamepad2 } from 'lucide-react';
import { festivalStats } from '../../data/statistics';
import { soundEngine } from '../../game/systems/SoundEngine';

export function StatsModal({ onClose }) {
  const getIcon = (id) => {
    switch (id) {
      case 'footfall': return <Users size={28} className="text-pink-400" />;
      case 'colleges': return <GraduationCap size={28} className="text-cyan-400" />;
      case 'workshops': return <Cpu size={28} className="text-emerald-400" />;
      case 'prizepool': return <Trophy size={28} className="text-yellow-400" />;
      case 'followers': return <Heart size={28} className="text-rose-400" />;
      case 'hits': return <Activity size={28} className="text-purple-400" />;
      case 'competitions': default: return <Gamepad2 size={28} className="text-amber-400" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 md:p-8 bg-black/90 backdrop-blur-lg">
      <div className="relative w-[96vw] max-w-4xl max-h-[92vh] flex flex-col bg-[#080514] border-2 sm:border-3 border-yellow-500 rounded-2xl shadow-2xl shadow-yellow-500/25 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-5 sm:p-7 border-b border-purple-900/60 bg-[#120826]">
          <div className="flex items-center gap-3">
            <Trophy size={28} className="text-yellow-400 animate-bounce" />
            <div>
              <h2 className="font-display text-xl sm:text-3xl font-black text-yellow-300">
                FESTIVAL IMPACT & ACHIEVEMENTS
              </h2>
              <p className="font-body text-xs sm:text-sm text-purple-200 mt-1 uppercase font-bold tracking-wider">
                OFFICIAL REVERIE HISTORICAL BENCHMARKS • BROCHURE PAGE 05
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              soundEngine.playBlip();
              onClose();
            }}
            className="p-2.5 rounded-xl bg-slate-900 hover:bg-rose-900 text-slate-300 hover:text-white transition-colors"
          >
            <X size={22} />
          </button>
        </div>

        {/* Stats Grid */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {festivalStats.map((stat) => (
              <div 
                key={stat.id}
                className="bg-[#120826] border-2 border-purple-800/70 hover:border-yellow-400 p-5 rounded-2xl flex flex-col justify-between transition-all group hover:scale-[1.02] shadow-xl"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 rounded-xl bg-purple-950/80 border border-purple-700/50">
                    {getIcon(stat.id)}
                  </div>
                  <span className="font-display text-xs text-yellow-300 bg-yellow-950/80 px-2.5 py-1 rounded-full border border-yellow-500/50 font-bold">
                    VERIFIED
                  </span>
                </div>

                <div>
                  <div className="font-display text-3xl sm:text-4xl font-black text-white group-hover:text-yellow-300 transition-colors">
                    {stat.value}
                  </div>
                  <div className="font-display text-sm text-purple-300 mt-1.5 uppercase font-bold">
                    {stat.label}
                  </div>
                  <p className="font-body text-sm text-slate-300 mt-2 leading-relaxed font-semibold">
                    {stat.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-7 p-5 rounded-2xl bg-[#140b2e] border-2 border-purple-600/50 text-sm font-body font-semibold text-purple-100 text-center leading-relaxed">
            ✨ Verified impact metrics sourced directly from official REVERIE records. Join thousands of creators across the nation!
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 sm:p-5 border-t border-purple-900/60 bg-[#100722] flex justify-end">
          <button
            onClick={() => {
              soundEngine.playBlip();
              onClose();
            }}
            className="pixel-btn pixel-btn-gold text-xs px-6 py-2.5"
          >
            CLOSE STATS
          </button>
        </div>
      </div>
    </div>
  );
}
