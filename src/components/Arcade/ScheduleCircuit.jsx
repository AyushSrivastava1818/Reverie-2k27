import React, { useState } from 'react';
import { 
  Flag, Trophy, Clock, MapPin, Calendar, ChevronRight, 
  Sparkles, ExternalLink, Play, RotateCcw, Zap, Compass 
} from 'lucide-react';
import { festivalSchedule } from '../../data/schedule';
import { eventsData } from '../../data/events';
import { soundEngine } from '../../game/systems/SoundEngine';

export function ScheduleCircuit({ onSelectEvent }) {
  const [selectedDay, setSelectedDay] = useState(1);
  const [activeCheckpointIndex, setActiveCheckpointIndex] = useState(0);

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
    // Fallback pseudo event object
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

  return (
    <div className="flex flex-col h-full w-full bg-[#070414] text-white overflow-hidden select-none">
      {/* ------------------------------------------------------------- */}
      {/* CIRCUIT MARQUEE HEADER & LAP SELECTOR                         */}
      {/* ------------------------------------------------------------- */}
      <div className="p-3 sm:p-4 bg-[#110729] border-b-2 border-emerald-500/50 flex flex-wrap items-center justify-between gap-3 shrink-0">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-emerald-950 border border-emerald-400 shadow-lg shadow-emerald-500/20">
            <Flag size={20} className="text-emerald-400 animate-bounce" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-display text-base sm:text-lg font-black text-emerald-300 uppercase tracking-widest">
                SCHEDULE CIRCUIT 2K27
              </h2>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-400 text-slate-950 font-black uppercase">
                RACING TIMELINE
              </span>
            </div>
            <p className="font-body text-xs text-slate-300">
              Navigate festival checkpoints along the official 3-day Grand Prix circuit.
            </p>
          </div>
        </div>

        {/* Lap / Day Selector Tabs */}
        <div className="flex items-center gap-2">
          {[
            { day: 1, label: 'LAP 1: DAY 1 (FEB 26)' },
            { day: 2, label: 'LAP 2: DAY 2 (FEB 27)' },
            { day: 3, label: 'LAP 3: DAY 3 (FEB 28)' }
          ].map(d => (
            <button
              key={d.day}
              onClick={() => {
                soundEngine.playBlip();
                setSelectedDay(d.day);
                setActiveCheckpointIndex(0);
              }}
              className={`px-3 py-1.5 rounded-xl font-display text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
                selectedDay === d.day
                  ? 'bg-emerald-500 text-black shadow-lg shadow-emerald-500/40 ring-1 ring-white/60 scale-105'
                  : 'bg-[#180e36] text-slate-300 hover:bg-emerald-950 hover:text-white border border-purple-800'
              }`}
            >
              {d.label}
            </button>
          ))}
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* INTERACTIVE RACETRACK VIEWPORT (Track & Checkpoint Nodes)     */}
      {/* ------------------------------------------------------------- */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
        {/* LEFT / CENTER: THE RACETRACK CHECKPOINTS */}
        <div className="lg:col-span-7 xl:col-span-8 p-4 sm:p-6 overflow-y-auto">
          <div className="font-display text-xs text-emerald-400 font-black uppercase tracking-wider mb-4 flex items-center gap-2">
            <Compass size={14} className="text-emerald-400 animate-spin" />
            <span>CIRCUIT CHECKPOINTS • CLICK TO PIT-STOP</span>
          </div>

          <div className="relative pl-6 border-l-2 border-dashed border-emerald-500/50 space-y-4">
            {dayEvents.map((item, index) => {
              const isSelected = activeCheckpointIndex === index;
              const isFirst = index === 0;
              const isLast = index === dayEvents.length - 1;

              return (
                <div
                  key={item.id}
                  onClick={() => handleSelectCheckpoint(index)}
                  className={`relative p-3.5 sm:p-4 rounded-2xl border-2 transition-all cursor-pointer group ${
                    isSelected
                      ? 'bg-[#140b2e] border-emerald-400 shadow-xl shadow-emerald-500/20 scale-[1.02]'
                      : 'bg-[#0f0724]/80 border-purple-900/60 hover:border-emerald-500/70 hover:bg-[#160d33]'
                  }`}
                >
                  {/* Pit-stop Flag Node on Track Line */}
                  <div className={`absolute -left-[35px] top-4 w-7 h-7 rounded-full border-2 flex items-center justify-center font-display font-black text-xs ${
                    isSelected
                      ? 'bg-emerald-400 border-white text-black shadow-md shadow-emerald-400/50 scale-110'
                      : 'bg-slate-900 border-emerald-500/60 text-emerald-300'
                  }`}>
                    {index + 1}
                  </div>

                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <span className="font-mono text-xs font-bold text-yellow-300 flex items-center gap-1.5">
                      <Clock size={13} className="text-yellow-400" />
                      <span>{item.time}</span>
                    </span>

                    <span className={`text-[10px] font-display font-black px-2 py-0.5 rounded-full uppercase ${
                      item.category === 'flagship' 
                        ? 'bg-purple-950 text-purple-300 border border-purple-500' 
                        : item.category === 'technical' 
                        ? 'bg-cyan-950 text-cyan-300 border border-cyan-500' 
                        : 'bg-pink-950 text-pink-300 border border-pink-500'
                    }`}>
                      {item.category}
                    </span>
                  </div>

                  <h3 className="font-display text-base sm:text-lg font-black text-white group-hover:text-emerald-300 transition-colors">
                    {item.title}
                  </h3>

                  <div className="mt-2 flex items-center justify-between text-xs text-slate-300">
                    <div className="flex items-center gap-1 text-slate-400">
                      <MapPin size={13} className="text-emerald-400 shrink-0" />
                      <span className="line-clamp-1">{item.venue}</span>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenFullEvent(item);
                      }}
                      className="px-2.5 py-1 rounded-lg bg-emerald-950 hover:bg-emerald-600 border border-emerald-500 text-emerald-300 hover:text-white font-display text-[11px] font-bold uppercase transition-all flex items-center gap-1"
                    >
                      <span>INSPECT</span>
                      <ChevronRight size={12} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* RIGHT: SELECTED CHECKPOINT PIT-STOP TELEMETRY */}
        {activeEvent && (
          <div className="lg:col-span-5 xl:col-span-4 p-4 sm:p-6 bg-[#0f0724] border-t-2 lg:border-t-0 lg:border-l-2 border-purple-900/60 flex flex-col justify-between overflow-y-auto">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="px-2.5 py-1 rounded-full text-xs font-display font-black uppercase tracking-wider bg-emerald-950 border border-emerald-400 text-emerald-300">
                  CHECKPOINT #{activeCheckpointIndex + 1} OF {dayEvents.length}
                </span>

                <span className="font-display text-xs text-yellow-400 font-bold">
                  LAP {selectedDay}
                </span>
              </div>

              {/* Checkpoint Title Card */}
              <div className="p-4 rounded-2xl bg-[#140b2e] border-2 border-emerald-500/70 mb-4 shadow-xl">
                <div className="font-mono text-xs text-yellow-300 font-bold mb-1 flex items-center gap-1.5">
                  <Clock size={14} className="text-yellow-400" />
                  <span>{activeEvent.time}</span>
                </div>

                <h3 className="font-display text-2xl font-black text-white">
                  {activeEvent.title}
                </h3>

                <div className="mt-2 text-xs font-body text-slate-300 flex items-center gap-1.5">
                  <MapPin size={14} className="text-emerald-400 shrink-0" />
                  <span className="font-semibold text-slate-200">{activeEvent.venue}</span>
                </div>
              </div>

              {/* Event Briefing */}
              <div className="space-y-3 bg-[#0a0518] p-4 rounded-xl border border-purple-900/60 mb-4">
                <span className="text-[10px] font-display font-bold text-slate-400 uppercase tracking-widest block">
                  STAGE BRIEFING
                </span>
                <p className="font-body text-xs sm:text-sm text-slate-200 leading-relaxed font-semibold">
                  {activeEvent.desc}
                </p>
              </div>

              {/* Circuit Telemetry Stats */}
              <div className="grid grid-cols-2 gap-2 text-xs font-mono text-slate-300">
                <div className="p-2.5 rounded-xl bg-purple-950/60 border border-purple-800">
                  <span className="text-[10px] text-slate-400 block">SECTOR</span>
                  <span className="font-bold text-cyan-300 uppercase">{activeEvent.category}</span>
                </div>
                <div className="p-2.5 rounded-xl bg-purple-950/60 border border-purple-800">
                  <span className="text-[10px] text-slate-400 block">ADMISSION</span>
                  <span className="font-bold text-emerald-300 uppercase">REVERIE WRISTBAND</span>
                </div>
              </div>
            </div>

            {/* Pit-stop Action CTAs */}
            <div className="pt-4 mt-4 border-t border-purple-900/60 flex flex-col gap-2">
              <button
                onClick={() => handleOpenFullEvent(activeEvent)}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-black font-display text-sm font-black uppercase tracking-wider flex items-center justify-center gap-2 shadow-xl shadow-emerald-500/30 transition-all cursor-pointer"
              >
                <span>OPEN OFFICIAL EVENT DOSSIER</span>
                <ChevronRight size={16} />
              </button>

              {activeEvent.registrationLink && (
                <a
                  href={activeEvent.registrationLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 rounded-xl bg-[#1a0e38] hover:bg-purple-900 border border-purple-600/60 text-slate-200 font-display text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all text-center"
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
