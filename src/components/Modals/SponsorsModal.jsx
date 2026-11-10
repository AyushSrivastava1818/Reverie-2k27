import React, { useState } from 'react';
import { SponsorGalaxy } from '../Arcade/SponsorGalaxy';
import { soundEngine } from '../../game/systems/SoundEngine';
import { whySponsorUs } from '../../data/sponsors';
import { sponsorshipPerksData } from '../../data/sponsorshipPerks';
import { FileText, Rocket, ExternalLink } from 'lucide-react';

export function SponsorsModal({ onClose, initialTab = 'galaxy' }) {
  const [viewMode, setViewMode] = useState(initialTab === 'rewards' ? 'perks' : 'galaxy');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-1 sm:p-4 bg-black/95 select-none animate-in fade-in duration-200">
      
      {/* High-Res Arcade Frame Cabinet */}
      <div className="relative w-full max-w-6xl h-[98vh] flex flex-col bg-[#07050e] border-4 border-[#2b2738] rounded-3xl shadow-[0_0_80px_rgba(168,85,247,0.6)] overflow-hidden">
        
        {/* TOP BAR: SWITCH BETWEEN SPACE SHOOTER & BROCHURE */}
        <div className="flex-shrink-0 flex items-center justify-between px-3 sm:px-6 py-2.5 bg-[#090514] border-b-2 border-purple-500/50 shadow-md">
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                soundEngine.playBlip();
                setViewMode('galaxy');
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-['Press_Start_2P'] text-[9px] sm:text-[10px] transition ${
                viewMode === 'galaxy'
                  ? 'bg-purple-600 text-white border border-purple-400 shadow-[0_0_12px_#a855f7]'
                  : 'bg-black/40 text-gray-400 border border-gray-800 hover:text-white'
              }`}
            >
              <Rocket size={12} className="text-cyan-400" />
              <span>🚀 PLAYABLE SPACE SHOOTER</span>
            </button>

            <button
              onClick={() => {
                soundEngine.playBlip();
                setViewMode('perks');
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-['Press_Start_2P'] text-[9px] sm:text-[10px] transition ${
                viewMode === 'perks'
                  ? 'bg-purple-600 text-white border border-purple-400 shadow-[0_0_12px_#a855f7]'
                  : 'bg-black/40 text-gray-400 border border-gray-800 hover:text-white'
              }`}
            >
              <FileText size={12} />
              <span>SPONSOR TIERS & PERKS</span>
            </button>
          </div>

          <button
            onClick={() => {
              soundEngine.playBlip();
              onClose();
            }}
            className="p-1.5 rounded-xl bg-red-950/70 border border-red-500 text-red-300 hover:bg-red-900 hover:text-white transition font-bold text-xs px-2.5"
            title="Close"
          >
            ✕ CLOSE
          </button>
        </div>

        {/* MAIN BODY: PLAYABLE 90s SPACE SHOOTER GAME */}
        <div className="flex-1 min-h-0 overflow-hidden">
          {viewMode === 'galaxy' ? (
            <SponsorGalaxy
              onClose={onClose}
              onSkipToDirectory={() => setViewMode('perks')}
              onAdvanceStage={() => setViewMode('perks')}
            />
          ) : (
            /* TIERS & BROCHURE VIEW */
            <div className="w-full h-full p-4 sm:p-8 overflow-y-auto bg-gradient-to-b from-[#090516] to-[#04020a] text-white">
              <div className="text-center mb-8">
                <h2 className="font-['Press_Start_2P'] text-lg sm:text-2xl text-yellow-400 mb-2">
                  ★ PARTNER WITH REVERIE 2K27 ★
                </h2>
                <p className="text-gray-300 text-sm max-w-2xl mx-auto font-['Rajdhani',sans-serif] font-medium">
                  Connect your brand with 10,000+ top engineering minds, creators, and innovators across India.
                </p>
              </div>

              {/* WHY SPONSOR US */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                {whySponsorUs.map((pillar, idx) => (
                  <div key={idx} className="p-4 bg-purple-950/40 border border-purple-800/60 rounded-2xl">
                    <div className="text-xs font-['Press_Start_2P'] text-cyan-400 mb-2">{pillar.title}</div>
                    <p className="text-xs text-gray-300 leading-relaxed font-['Rajdhani',sans-serif]">{pillar.description}</p>
                  </div>
                ))}
              </div>

              {/* TIER TILES */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {sponsorshipPerksData.tiers.slice(0, 3).map((tier, idx) => (
                  <div key={idx} className="p-5 bg-[#120a2e] border-2 border-yellow-500/50 rounded-2xl flex flex-col justify-between">
                    <div>
                      <div className="font-['Press_Start_2P'] text-sm text-yellow-300 mb-2">{tier.name}</div>
                      <div className="font-['Press_Start_2P'] text-lg text-white mb-4">{tier.amount}</div>
                      <ul className="space-y-2 text-xs text-gray-300 mb-6 font-['Rajdhani',sans-serif]">
                        {tier.perks.slice(0, 4).map((p, pIdx) => (
                          <li key={pIdx} className="flex items-center gap-2">
                            <span className="text-yellow-400">★</span>
                            <span>{p}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <a
                      href="mailto:reverie@iiitkota.ac.in?subject=Sponsorship%20Inquiry%20REVERIE%202K27"
                      className="w-full py-2.5 rounded-xl bg-yellow-400 hover:bg-yellow-300 text-black font-['Press_Start_2P'] text-[9px] text-center font-bold shadow-[0_0_12px_#facc15] transition"
                    >
                      REQUEST PROSPECTUS
                    </a>
                  </div>
                ))}
              </div>

              <div className="text-center pb-6">
                <button
                  onClick={() => setViewMode('galaxy')}
                  className="px-6 py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-['Press_Start_2P'] text-xs shadow-[0_0_20px_#a855f7] transition"
                >
                  ◀ BACK TO SPACE SHOOTER
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
