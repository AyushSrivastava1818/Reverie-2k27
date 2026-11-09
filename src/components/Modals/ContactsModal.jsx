import React from 'react';
import { X, Phone, Mail, Globe, ExternalLink, ShieldCheck } from 'lucide-react';
import { contactPersons, socialLinks } from '../../data/contacts';
import { soundEngine } from '../../game/systems/SoundEngine';

export function ContactsModal({ onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 md:p-8 bg-black/90 backdrop-blur-lg">
      <div className="relative w-[96vw] max-w-4xl max-h-[92vh] flex flex-col bg-[#080514] border-2 sm:border-3 border-pink-500 rounded-2xl shadow-2xl shadow-pink-500/25 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-5 sm:p-7 border-b border-purple-900/60 bg-[#120826]">
          <div className="flex items-center gap-3">
            <Phone size={28} className="text-pink-400" />
            <div>
              <h2 className="font-display text-xl sm:text-3xl font-black text-pink-300">
                CONTACT US & SOCIALS
              </h2>
              <p className="font-body text-xs sm:text-sm text-purple-200 mt-1 uppercase font-bold tracking-wider">
                FESTIVAL SECRETARIAT & PR LEADS • BROCHURE PAGE 30
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

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-8 space-y-7">
          {/* Executive Leads Grid */}
          <div className="space-y-4">
            <h3 className="font-display text-sm sm:text-base text-yellow-300 uppercase font-black flex items-center gap-2">
              <span>👤</span> CORE STUDENT LEADERSHIP
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {contactPersons.map((person, idx) => (
                <div 
                  key={idx}
                  className="p-5 bg-[#120826] border-2 border-purple-900/70 hover:border-pink-500 rounded-2xl flex items-center justify-between transition-all shadow-xl"
                >
                  <div>
                    <div className="flex items-center gap-2.5">
                      <h4 className="font-display text-base sm:text-lg font-black text-white">{person.name}</h4>
                      <span className="font-display text-[9px] px-2 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-700/60 font-bold">
                        {person.badge}
                      </span>
                    </div>
                    <p className="font-body text-sm text-slate-300 mt-0.5 font-semibold">{person.role}</p>
                  </div>

                  <a
                    href={`tel:${person.phone.replace(/\s+/g, '')}`}
                    onClick={() => soundEngine.playBlip()}
                    className="font-display text-xs px-3.5 py-2 rounded-xl bg-emerald-950 text-emerald-300 border-2 border-emerald-500/60 hover:bg-emerald-800 hover:text-white transition-all flex items-center gap-2 font-bold shadow-md hover:scale-105"
                  >
                    <Phone size={14} />
                    <span>{person.phone}</span>
                  </a>
                </div>
              ))}
            </div>
          </div>

          {/* Socials & Web Portals */}
          <div className="space-y-4">
            <h3 className="font-display text-sm sm:text-base text-cyan-300 uppercase font-black flex items-center gap-2">
              <span>🌐</span> OFFICIAL PORTALS & SOCIAL CHANNELS
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {socialLinks.map((link, idx) => (
                <a
                  key={idx}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => soundEngine.playBlip()}
                  className="p-4 bg-[#120826] border-2 border-purple-900/70 hover:border-cyan-400 rounded-2xl flex items-center justify-between text-slate-200 hover:text-white transition-all group shadow-xl hover:scale-[1.02]"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-purple-950/80 rounded-xl border border-purple-800">
                      <Globe size={18} className="text-cyan-400" />
                    </div>
                    <div>
                      <div className="font-display text-sm sm:text-base font-bold text-white group-hover:text-cyan-300 transition-colors">
                        {link.platform}
                      </div>
                      <div className="font-body text-xs sm:text-sm text-purple-300 font-semibold">
                        {link.handle}
                      </div>
                    </div>
                  </div>
                  <ExternalLink size={16} className="text-slate-400 group-hover:text-cyan-400 transition-colors" />
                </a>
              ))}
            </div>
          </div>

          {/* Institute Location Banner */}
          <div className="p-5 rounded-2xl bg-[#120826] border-2 border-purple-800/70 text-slate-200 space-y-1.5 shadow-xl">
            <div className="font-display text-sm sm:text-base font-black text-white flex items-center gap-2">
              <ShieldCheck size={18} className="text-pink-400" />
              INDIAN INSTITUTE OF INFORMATION TECHNOLOGY KOTA
            </div>
            <p className="font-body text-sm sm:text-base text-slate-300 font-semibold">
              Ranpur near Kota, Rajasthan — 325003 (100+ Acres Permanent Campus)
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 sm:p-5 border-t border-purple-900/60 bg-[#100722] flex justify-end">
          <button
            onClick={() => {
              soundEngine.playBlip();
              onClose();
            }}
            className="pixel-btn pixel-btn-pink text-xs px-6 py-2.5"
          >
            CLOSE CONTACTS
          </button>
        </div>
      </div>
    </div>
  );
}
