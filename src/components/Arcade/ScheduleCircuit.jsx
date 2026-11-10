import React, { useState } from 'react';
import { 
  Flag, Trophy, Clock, MapPin, Calendar, ChevronRight, 
  Sparkles, ExternalLink, Play, RotateCcw, Zap, Compass, CheckCircle2, X
} from 'lucide-react';
import { festivalSchedule } from '../../data/schedule';
import { eventsData } from '../../data/events';
import { soundEngine } from '../../game/systems/SoundEngine';

export function ScheduleCircuit({ onSelectEvent }) {
  const [selectedDay, setSelectedDay] = useState(1);
  const [activeCheckpointIndex, setActiveCheckpointIndex] = useState(0);
  const [selectedEventModal, setSelectedEventModal] = useState(null);

  const dayEvents = festivalSchedule.filter(item => item.day === selectedDay);
  const activeEvent = dayEvents[activeCheckpointIndex] || dayEvents[0];

  const handleSelectCheckpoint = (index) => {
    soundEngine.playBlip();
    setActiveCheckpointIndex(index);
  };

  const handleOpenFullEvent = (item) => {
    soundEngine.playCoin();
    if (item.eventId) {
      const fullEv = eventsData.find(e => e.id === item.eventId);
      if (fullEv && onSelectEvent) {
        onSelectEvent(fullEv);
        return;
      }
    }
    if (onSelectEvent) {
      onSelectEvent({
        id: item.id,
        title: item.title,
        category: item.category,
        shortDesc: item.desc,
        description: item.desc,
        venue: item.venue,
        prizePool: 'Official Festival Certificate & Honors',
        registrationLink: item.registrationLink || 'https://unstop.com'
      });
    }
  };

  const getCategoryBadge = (cat) => {
    switch (cat) {
      case 'flagship':
        return 'bg-purple-900/90 text-purple-200 border-purple-400';
      case 'technical':
        return 'bg-cyan-950 text-cyan-300 border-cyan-400';
      case 'cultural':
      default:
        return 'bg-pink-950 text-pink-300 border-pink-400';
    }
  };

  return (
    <div className="flex flex-col h-full w-full bg-[#070415] text-white overflow-hidden select-none">
      
      {/* ------------------------------------------------------------- */}
      {/* PROMINENT 3-DAY GRAND PRIX RACING SELECTOR                     */}
      {/* ------------------------------------------------------------- */}
      <div className="p-3 sm:px-6 sm:py-3.5 bg-[#110729] border-b-2 border-emerald-500/50 flex flex-wrap items-center justify-between gap-3 shrink-0">
        
        {/* Circuit Branding */}
        <div className="flex items-center gap-3">
          <div className="p-2 sm:p-2.5 rounded-xl bg-emerald-950 border border-emerald-400 shadow-md shadow-emerald-500/20">
            <Flag size={20} className="text-emerald-400 animate-bounce" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-display text-base sm:text-lg font-black text-white uppercase tracking-wider">
                GRAND PRIX CIRCUIT
              </h2>
              <span className="text-[10px] font-display font-black px-2 py-0.5 rounded-full bg-emerald-400 text-slate-950 uppercase">
                3 DAYS
              </span>
            </div>
            <p className="font-body text-xs text-emerald-300/80 font-medium hidden sm:block">
              Interactive timeline checkpoints across IIIT Kota's annual fest.
            </p>
          </div>
        </div>

        {/* Prominent Day Selector Tabs */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {[
            { day: 1, label: 'DAY 1', date: 'FEB 26', lap: 'LAP 1' },
            { day: 2, label: 'DAY 2', date: 'FEB 27', lap: 'LAP 2' },
            { day: 3, label: 'DAY 3', date: 'FEB 28', lap: 'LAP 3' }
          ].map(d => {
            const isSelected = selectedDay === d.day;
            return (
              <button
                key={d.day}
                onClick={() => {
                  soundEngine.playBlip();
                  setSelectedDay(d.day);
                  setActiveCheckpointIndex(0);
                }}
                className={`px-3 py-2 sm:px-4 sm:py-2 rounded-xl font-display text-xs sm:text-sm font-black uppercase tracking-wider transition-all cursor-pointer flex flex-col items-center leading-tight ${
                  isSelected
                    ? 'bg-emerald-400 text-slate-950 shadow-lg shadow-emerald-400/40 scale-105 ring-2 ring-white/70'
                    : 'bg-[#180e38] text-slate-300 hover:bg-emerald-950 hover:text-white border border-purple-800'
                }`}
              >
                <span>{d.label} • {d.date}</span>
                <span className={`text-[10px] font-bold ${isSelected ? 'text-emerald-950' : 'text-slate-400'}`}>
                  {d.lap}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* CIRCUIT TIMELINE VIEWPORT                                     */}
      {/* ------------------------------------------------------------- */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
        
        {/* LEFT / CENTER: THE RACING CHECKPOINT TRACK */}
        <div className="lg:col-span-7 xl:col-span-8 p-4 sm:p-6 overflow-y-auto">
          <div className="font-display text-xs text-emerald-400 font-black uppercase tracking-wider mb-4 flex items-center gap-2">
            <Compass size={15} className="text-emerald-400" />
            <span>CIRCUIT CHECKPOINTS • CLICK TO VIEW EVENT DETAILS</span>
          </div>

          {/* Racetrack Spine Line */}
          <div className="relative pl-7 sm:pl-8 border-l-3 border-emerald-500/40 space-y-4 sm:space-y-5">
            {dayEvents.map((item, index) => {
              const isSelected = activeCheckpointIndex === index;
              const catBadge = getCategoryBadge(item.category);

              return (
                <div
                  key={item.id}
                  onClick={() => handleSelectCheckpoint(index)}
                  className={`relative p-4 sm:p-5 rounded-2xl border-2 transition-all cursor-pointer group ${
                    isSelected
                      ? 'bg-[#150b32] border-emerald-400 shadow-xl shadow-emerald-500/20 scale-[1.01]'
                      : 'bg-[#0f0724]/90 border-purple-900/60 hover:border-emerald-500/70 hover:bg-[#150c33]'
                  }`}
                >
                  {/* Glowing Checkpoint Node on Track */}
                  <div className={`absolute -left-[38px] sm:-left-[42px] top-4 sm:top-5 w-8 h-8 rounded-full border-2 flex items-center justify-center font-display font-black text-xs transition-transform ${
                    isSelected
                      ? 'bg-emerald-400 border-white text-slate-950 shadow-lg shadow-emerald-400/50 scale-110'
                      : 'bg-slate-900 border-emerald-500/70 text-emerald-300'
                  }`}>
                    {index + 1 < 10 ? `0${index + 1}` : index + 1}
                  </div>

                  {/* Top Meta Bar: Time & Category */}
                  <div className="flex items-center justify-between gap-2 mb-2 flex-wrap">
                    <div className="flex items-center gap-1.5 font-mono text-xs sm:text-sm font-bold text-yellow-300 bg-amber-950/60 border border-yellow-500/30 px-2.5 py-1 rounded-lg">
                      <Clock size={14} className="text-yellow-400" />
                      <span>{item.time}</span>
                    </div>

                    <span className={`text-[10px] font-display font-black px-2.5 py-0.5 rounded-full uppercase border ${catBadge}`}>
                      {item.category}
                    </span>
                  </div>

                  {/* Large Readable Event Title */}
                  <h3 className="font-display text-base sm:text-xl font-black text-white group-hover:text-emerald-300 transition-colors">
                    {item.title}
                  </h3>

                  {/* Venue & Action Button */}
                  <div className="mt-3 flex items-center justify-between gap-2 pt-2 border-t border-purple-900/40">
                    <div className="flex items-center gap-1.5 text-xs text-slate-300">
                      <MapPin size={14} className="text-emerald-400 shrink-0" />
                      <span className="font-medium line-clamp-1">{item.venue}</span>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenFullEvent(item);
                      }}
                      className="px-3 py-1.5 rounded-xl bg-emerald-950 hover:bg-emerald-500 border border-emerald-400 text-emerald-300 hover:text-slate-950 font-display text-xs font-black uppercase transition-all flex items-center gap-1 shrink-0"
                    >
                      <span>DETAILS</span>
                      <ChevronRight size={13} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* RIGHT: SELECTED CHECKPOINT PIT-STOP DETAIL PANEL */}
        {activeEvent && (
          <div className="lg:col-span-5 xl:col-span-4 p-5 sm:p-6 bg-[#0f0724] border-t-2 lg:border-t-0 lg:border-l-2 border-purple-900/60 flex flex-col justify-between overflow-y-auto">
            <div>
              {/* Checkpoint Status Header */}
              <div className="flex items-center justify-between mb-4">
                <span className="px-3 py-1 rounded-full text-xs font-display font-black uppercase tracking-wider bg-emerald-950 border border-emerald-400 text-emerald-300 flex items-center gap-1.5">
                  <CheckCircle2 size={13} className="text-emerald-400" />
                  CHECKPOINT #{activeCheckpointIndex + 1}
                </span>

                <span className="font-display text-xs text-yellow-400 font-bold bg-amber-950/60 border border-yellow-500/40 px-2.5 py-1 rounded-lg">
                  LAP {selectedDay} OF 3
                </span>
              </div>

              {/* Event Showcase Card */}
              <div className="p-5 rounded-2xl bg-[#150a30] border-2 border-emerald-500/80 mb-5 shadow-xl">
                <div className="font-mono text-xs sm:text-sm text-yellow-300 font-bold mb-2 flex items-center gap-1.5">
                  <Clock size={15} className="text-yellow-400" />
                  <span>{activeEvent.time}</span>
                </div>

                <h3 className="font-display text-2xl font-black text-white leading-tight">
                  {activeEvent.title}
                </h3>

                <div className="mt-3 text-xs sm:text-sm font-body text-slate-200 flex items-center gap-1.5">
                  <MapPin size={15} className="text-emerald-400 shrink-0" />
                  <span className="font-semibold text-emerald-300">{activeEvent.venue}</span>
                </div>
              </div>

              {/* Event Description */}
              <div className="space-y-2 bg-[#090416] p-4 rounded-xl border border-purple-900/60 mb-5">
                <span className="text-[10px] font-display font-bold text-slate-400 uppercase tracking-widest block">
                  EVENT BRIEFING
                </span>
                <p className="font-body text-sm text-slate-200 leading-relaxed font-medium">
                  {activeEvent.desc}
                </p>
              </div>

              {/* Badges / Sector Details */}
              <div className="grid grid-cols-2 gap-2 text-xs font-mono text-slate-300">
                <div className="p-3 rounded-xl bg-purple-950/60 border border-purple-800">
                  <span className="text-[10px] text-slate-400 uppercase block">CATEGORY</span>
                  <span className="font-bold text-cyan-300 uppercase text-xs sm:text-sm">{activeEvent.category}</span>
                </div>
                <div className="p-3 rounded-xl bg-purple-950/60 border border-purple-800">
                  <span className="text-[10px] text-slate-400 uppercase block">ENTRY</span>
                  <span className="font-bold text-emerald-300 uppercase text-xs sm:text-sm">FESTIVAL PASS</span>
                </div>
              </div>
            </div>

            {/* Registration Action Buttons */}
            <div className="pt-5 mt-5 border-t border-purple-900/60 flex flex-col gap-2.5">
              <button
                onClick={() => handleOpenFullEvent(activeEvent)}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-400 to-teal-500 hover:from-emerald-300 hover:to-teal-400 text-slate-950 font-display text-sm font-black uppercase tracking-wider flex items-center justify-center gap-2 shadow-xl shadow-emerald-500/30 transition-all cursor-pointer"
              >
                <span>OPEN OFFICIAL EVENT DOSSIER</span>
                <ChevronRight size={16} />
              </button>

              {activeEvent.registrationLink && (
                <a
                  href={activeEvent.registrationLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 rounded-xl bg-[#190d3a] hover:bg-purple-900 border border-purple-600/70 text-slate-200 hover:text-white font-display text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all text-center"
                >
                  <ExternalLink size={14} />
                  <span>REGISTER ON UNSTOP / PORTAL</span>
                </a>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
