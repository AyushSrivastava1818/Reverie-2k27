import React, { useState } from 'react';
import { X, HeartHandshake, Megaphone, Zap, Users2, Globe, Rocket, Shield, ExternalLink } from 'lucide-react';
import { whySponsorUs, pastSponsors } from '../../data/sponsors';
import { sponsorshipPerksData } from '../../data/sponsorshipPerks';
import { soundEngine } from '../../game/systems/SoundEngine';
import { SponsorGalaxy } from '../Arcade/SponsorGalaxy';

export function SponsorsModal({ onClose, initialTab = 'galaxy' }) {
  const [activeTab, setActiveTab] = useState(initialTab || 'galaxy');

  const getPillarIcon = (icon) => {
    switch (icon) {
      case 'Megaphone': return <Megaphone size={24} className="text-pink-400" />;
      case 'Zap': return <Zap size={24} className="text-yellow-400" />;
      case 'Users2': return <Users2 size={24} className="text-cyan-400" />;
      case 'Globe': default: return <Globe size={24} className="text-emerald-400" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 md:p-8 bg-black/90 backdrop-blur-lg">
      <div className="relative w-[96vw] max-w-5xl max-h-[92vh] flex flex-col bg-[#080514] border-2 sm:border-3 border-emerald-500 rounded-2xl shadow-2xl shadow-emerald-500/25 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-5 sm:p-7 border-b border-purple-900/60 bg-[#120826]">
          <div className="flex items-center gap-3">
            <HeartHandshake size={28} className="text-emerald-400" />
            <div>
              <h2 className="font-display text-xl sm:text-3xl font-black text-emerald-300">
                SPONSORSHIP & BRAND PARTNERSHIPS
              </h2>
              <p className="font-body text-xs sm:text-sm text-purple-200 mt-1 uppercase font-bold tracking-wider">
                PERKS MATRIX & PAST COLLABORATORS • BROCHURE PAGES 27–29
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

        {/* Tab Navigation */}
        <div className="px-5 py-3 bg-[#100722] border-b border-purple-900/40 flex items-center gap-2 overflow-x-auto">
          <button
            onClick={() => {
              soundEngine.playBlip();
              setActiveTab('galaxy');
            }}
            className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-display font-black tracking-wider transition-all flex items-center gap-1.5 shrink-0 ${
              activeTab === 'galaxy' 
                ? 'bg-gradient-to-r from-pink-600 to-purple-600 text-white shadow-lg shadow-pink-600/40 ring-1 ring-white/40' 
                : 'bg-purple-950/70 text-pink-300 hover:bg-purple-900 hover:text-white border border-pink-500/30'
            }`}
          >
            <Rocket size={16} className="text-pink-300 animate-pulse" />
            <span>SPONSOR GALAXY (90s GAME)</span>
          </button>
          <button
            onClick={() => {
              soundEngine.playBlip();
              setActiveTab('perks');
            }}
            className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-display font-bold transition-all shrink-0 ${
              activeTab === 'perks' 
                ? 'bg-emerald-500 text-slate-950 font-black shadow-lg shadow-emerald-500/40' 
                : 'bg-purple-950/60 text-slate-300 hover:bg-purple-900 hover:text-white'
            }`}
          >
            SPONSORSHIP PERKS
          </button>
          <button
            onClick={() => {
              soundEngine.playBlip();
              setActiveTab('sponsors');
            }}
            className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-display font-bold transition-all shrink-0 ${
              activeTab === 'sponsors' 
                ? 'bg-emerald-500 text-slate-950 font-black shadow-lg shadow-emerald-500/40' 
                : 'bg-purple-950/60 text-slate-300 hover:bg-purple-900 hover:text-white'
            }`}
          >
            PAST SPONSORS ({pastSponsors.length})
          </button>
          <button
            onClick={() => {
              soundEngine.playBlip();
              setActiveTab('why');
            }}
            className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-display font-bold transition-all shrink-0 ${
              activeTab === 'why' 
                ? 'bg-emerald-500 text-slate-950 font-black shadow-lg shadow-emerald-500/40' 
                : 'bg-purple-950/60 text-slate-300 hover:bg-purple-900 hover:text-white'
            }`}
          >
            WHY SPONSOR US?
          </button>
        </div>

        {/* Content Body */}
        {activeTab === 'galaxy' ? (
          <div className="flex-1 overflow-hidden flex flex-col">
            <SponsorGalaxy 
              onSkipToDirectory={() => setActiveTab('sponsors')} 
              onSelectSponsor={() => {}}
            />
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto p-5 sm:p-8 space-y-6">
          {/* TAB 1: PERKS MATRIX */}
          {activeTab === 'perks' && (
            <div className="space-y-4">
              <div>
                <h3 className="font-display text-base sm:text-lg text-yellow-300 uppercase font-black">
                  OFFICIAL SPONSORSHIP DELIVERABLES MATRIX (PAGE 28)
                </h3>
                <p className="font-body text-sm sm:text-base text-slate-200 mt-1 font-semibold">
                  Accurate benefit distribution across Title, Power, Co-Title, Co-Power, Events and Food-Stall tiers.
                </p>
              </div>

              {/* Responsive Perks Table */}
              <div className="overflow-x-auto border-2 border-purple-800 rounded-2xl bg-[#120826] shadow-xl">
                <table className="w-full text-left text-sm text-slate-100 border-collapse">
                  <thead>
                    <tr className="bg-[#1c0e3a] border-b-2 border-purple-800 text-xs sm:text-sm font-display font-black text-cyan-300">
                      <th className="p-4 border-r border-purple-800">SPONSORSHIP DELIVERABLES</th>
                      {sponsorshipPerksData.columns.map((col) => (
                        <th key={col} className="p-4 text-center border-r border-purple-800 last:border-r-0 whitespace-nowrap">
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
                        <td className="p-4 font-body font-bold text-slate-100 border-r border-purple-800 text-sm sm:text-base">
                          {row.perk}
                        </td>
                        {sponsorshipPerksData.columns.map((col) => {
                          const hasPerk = row.perks[col];
                          return (
                            <td key={col} className="p-4 text-center border-r border-purple-800 last:border-r-0">
                              {hasPerk ? (
                                <span className="text-xl text-rose-500 font-bold" title="Included">
                                  ❤️
                                </span>
                              ) : (
                                <span className="text-xl text-slate-600" title="Not Included">
                                  🖤
                                </span>
                              )}
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="flex items-center justify-between text-xs sm:text-sm font-body font-semibold text-slate-300 bg-purple-950/60 p-3.5 rounded-xl border border-purple-800">
                <span>Legend: ❤️ Included in Sponsorship Tier &nbsp;|&nbsp; 🖤 Not Included</span>
                <span className="font-display text-xs text-emerald-400 font-bold">SOURCE: BROCHURE PAGE 28</span>
              </div>
            </div>
          )}

          {/* TAB 2: PAST SPONSORS */}
          {activeTab === 'sponsors' && (
            <div className="space-y-5">
              <div>
                <h3 className="font-display text-base sm:text-lg text-yellow-300 uppercase font-black">
                  PAST COLLABORATORS & SPONSOR LOGOS (PAGE 29)
                </h3>
                <p className="font-body text-sm sm:text-base text-slate-200 mt-1 font-semibold">
                  Leading developer platforms, tech giants, web3 ecosystems and learning networks that trusted REVERIE.
                </p>
              </div>

              {/* Sponsor Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {pastSponsors.map((sp, idx) => (
                  <div 
                    key={idx}
                    className="p-4 bg-[#120826] border-2 border-purple-900/70 hover:border-emerald-400 rounded-2xl flex flex-col items-center justify-center gap-3 group transition-all hover:scale-[1.02] shadow-xl"
                  >
                    <div className="h-16 w-full flex items-center justify-center p-2 bg-black/50 rounded-xl">
                      <img 
                        src={sp.logo} 
                        alt={sp.name} 
                        className="max-h-full max-w-full object-contain filter brightness-95 group-hover:brightness-110"
                      />
                    </div>
                    <div className="text-center">
                      <div className="font-display text-sm font-bold text-white">{sp.name}</div>
                      <div className="font-body text-xs text-purple-300 font-semibold">{sp.tier}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Official Brochure Page 29 Arcade Screen */}
              <div className="p-5 bg-[#120826] rounded-2xl border-2 border-purple-900/60 shadow-xl space-y-2">
                <h4 className="font-display text-xs sm:text-sm text-purple-300 font-bold">
                  🕹️ OFFICIAL BROCHURE PAGE 29 ARCADE BOARD
                </h4>
                <div className="rounded-xl overflow-hidden border border-purple-800">
                  <img 
                    src="/assets/page_29_sponsors.png" 
                    alt="Brochure Page 29 Sponsors" 
                    className="w-full h-auto"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: WHY SPONSOR US */}
          {activeTab === 'why' && (
            <div className="space-y-5">
              <div>
                <h3 className="font-display text-base sm:text-lg text-yellow-300 uppercase font-black">
                  WHY SPONSOR REVERIE 2K27? (PAGE 27)
                </h3>
                <p className="font-body text-sm sm:text-base text-slate-200 mt-1 font-semibold">
                  Tap into unmatched engagement with exceptional student developers, innovators, and future engineers.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {whySponsorUs.map((pillar, idx) => (
                  <div 
                    key={idx}
                    className="p-5 bg-[#120826] border-2 border-purple-900/70 hover:border-emerald-400 rounded-2xl transition-all shadow-xl space-y-3"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-purple-950/80 rounded-xl border border-purple-700/50">
                        {getPillarIcon(pillar.icon)}
                      </div>
                      <h4 className="font-display text-sm sm:text-base text-emerald-300 uppercase font-black leading-snug">
                        {pillar.title}
                      </h4>
                    </div>
                    <p className="font-body text-sm sm:text-base text-slate-200 leading-relaxed font-semibold">
                      {pillar.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        )}

        {/* Footer */}
        <div className="p-4 sm:p-5 border-t border-purple-900/60 bg-[#100722] flex flex-col sm:flex-row items-center justify-between gap-3">
          <span className="text-sm font-body font-semibold text-slate-300">
            For brand sponsorships & inquiries: <strong className="text-emerald-400 font-display">techknow@iiitkota.ac.in</strong>
          </span>
          <button
            onClick={() => {
              soundEngine.playBlip();
              onClose();
            }}
            className="pixel-btn pixel-btn-dark text-xs px-6 py-2.5"
          >
            CLOSE SPONSORS
          </button>
        </div>
      </div>
    </div>
  );
}
