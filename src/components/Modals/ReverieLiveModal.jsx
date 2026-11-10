import React, { useState, useEffect } from 'react';
import { 
  X, Calendar, Clock, MapPin, Radio, Bell, ArrowRight, 
  ExternalLink, Sparkles, Filter, Flag, LayoutList, ChevronRight 
} from 'lucide-react';
import { festivalAnnouncements, festivalSchedule } from '../../data/schedule';
import { eventsData } from '../../data/events';
import { soundEngine } from '../../game/systems/SoundEngine';
import { eventBus } from '../../game/EventBus';
import { ScheduleCircuit } from '../Arcade/ScheduleCircuit';

export function ReverieLiveModal({ onClose, onSelectEvent }) {
  const [viewMode, setViewMode] = useState('circuit'); // 'circuit' | 'timeline'
  const [selectedDay, setSelectedDay] = useState('all'); // 'all', 1, 2, 3
  const [selectedCat, setSelectedCat] = useState('all'); // 'all', 'technical', 'cultural', 'flagship'

  useEffect(() => {
    eventBus.emit('game-paused', true);
    return () => {
      eventBus.emit('game-paused', false);
    };
  }, []);

  const filteredItems = festivalSchedule.filter((item) => {
    if (selectedDay !== 'all' && item.day !== Number(selectedDay)) return false;
    if (selectedCat !== 'all' && item.category !== selectedCat) return false;
    return true;
  });

  const handleOpenEvent = (eventId) => {
    const fullEvent = eventsData.find((e) => e.id === eventId);
    if (fullEvent && onSelectEvent) {
      soundEngine.playCoin();
      onSelectEvent(fullEvent);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-5 md:p-6 bg-black/90 backdrop-blur-md animate-fadeIn select-none">
      <div className="relative w-full max-w-5xl h-[92vh] flex flex-col bg-[#0b061a] border-2 sm:border-3 border-emerald-500 rounded-3xl shadow-2xl shadow-emerald-950/60 overflow-hidden">
        
        {/* ------------------------------------------------------------- */}
        {/* BALANCED TOP HEADER                                           */}
        {/* ------------------------------------------------------------- */}
        <div className="flex items-center justify-between p-3 sm:px-6 sm:py-4 border-b border-purple-900/60 bg-[#120728] shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 sm:p-2.5 bg-emerald-950 border border-emerald-400 rounded-2xl text-emerald-400 shadow-md shadow-emerald-500/20">
              <Radio size={22} className="animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-display text-base sm:text-xl text-white font-black tracking-wider uppercase">
                  REVERIE LIVE SCHEDULE
                </h2>
                <span className="font-display text-[10px] bg-rose-950 text-rose-300 border border-rose-500/60 font-black px-2 py-0.5 rounded-full hidden sm:flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-ping" />
                  FEB 26–28
                </span>
              </div>
              <p className="font-body text-xs text-purple-300 font-medium">
                Official 3-day itinerary • Venues, timings, and unstop registrations
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* View Mode Switcher (Circuit vs Timeline) */}
            <div className="p-1 rounded-xl bg-purple-950/80 border border-purple-600/60 flex items-center gap-1">
              <button
                onClick={() => { soundEngine.playBlip(); setViewMode('circuit'); }}
                className={`px-3 py-1.5 rounded-lg font-display text-xs font-black uppercase flex items-center gap-1.5 transition-all cursor-pointer ${
                  viewMode === 'circuit'
                    ? 'bg-emerald-400 text-slate-950 shadow-md scale-105'
                    : 'text-purple-300 hover:text-white'
                }`}
                title="Grand Prix Racing Circuit View"
              >
                <Flag size={14} />
                <span>CIRCUIT</span>
              </button>
              <button
                onClick={() => { soundEngine.playBlip(); setViewMode('timeline'); }}
                className={`px-3 py-1.5 rounded-lg font-display text-xs font-black uppercase flex items-center gap-1.5 transition-all cursor-pointer ${
                  viewMode === 'timeline'
                    ? 'bg-purple-600 text-white shadow-md scale-105'
                    : 'text-purple-300 hover:text-white'
                }`}
                title="Full Chronological Timeline View"
              >
                <LayoutList size={14} />
                <span>TIMELINE</span>
              </button>
            </div>

            <button
              onClick={() => {
                soundEngine.playBlip();
                onClose();
              }}
              className="p-2 sm:px-3 sm:py-1.5 rounded-xl bg-slate-900 hover:bg-rose-950 text-slate-300 hover:text-white border border-slate-700 hover:border-rose-500 transition-all cursor-pointer flex items-center gap-1 font-display text-xs font-bold"
            >
              <span className="hidden sm:inline">CLOSE</span>
              <X size={16} />
            </button>
          </div>
        </div>

        {/* ------------------------------------------------------------- */}
        {/* VIEW MODE CONTENT: CIRCUIT OR TIMELINE                        */}
        {/* ------------------------------------------------------------- */}
        {viewMode === 'circuit' ? (
          <div className="flex-1 overflow-hidden flex flex-col">
            <ScheduleCircuit onSelectEvent={onSelectEvent} />
          </div>
        ) : (
          <div className="flex-1 overflow-hidden flex flex-col bg-[#070415]">
            {/* Filter Bar: Day & Category */}
            <div className="p-3 sm:px-6 sm:py-3 bg-[#0d0722] border-b border-purple-900/40 flex flex-wrap items-center justify-between gap-3 shrink-0">
              
              {/* Day Tabs */}
              <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-purple-900/60">
                {[
                  { id: 'all', label: 'ALL DAYS' },
                  { id: '1', label: 'DAY 1 (FEB 26)' },
                  { id: '2', label: 'DAY 2 (FEB 27)' },
                  { id: '3', label: 'DAY 3 (FEB 28)' },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => {
                      soundEngine.playBlip();
                      setSelectedDay(tab.id);
                    }}
                    className={`px-3 py-1.5 rounded-lg font-display text-xs font-black transition-all cursor-pointer ${
                      selectedDay === tab.id
                        ? 'bg-emerald-400 text-slate-950 shadow-md'
                        : 'text-purple-300 hover:text-white hover:bg-purple-900/40'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Category Filter */}
              <div className="flex items-center gap-1.5 text-xs font-display">
                <span className="text-purple-300 font-bold hidden sm:inline">SECTOR:</span>
                {['all', 'technical', 'cultural', 'flagship'].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => {
                      soundEngine.playBlip();
                      setSelectedCat(cat);
                    }}
                    className={`px-2.5 py-1 rounded-lg font-black uppercase text-xs transition-all cursor-pointer ${
                      selectedCat === cat
                        ? 'bg-purple-600 text-white border border-purple-400'
                        : 'text-slate-400 hover:text-slate-200 bg-slate-900'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Timeline Cards List */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3.5">
              {filteredItems.length === 0 ? (
                <div className="text-center py-16 text-purple-300">
                  <Calendar size={36} className="mx-auto mb-2 opacity-50" />
                  <p className="font-display font-bold">No events found matching this filter.</p>
                </div>
              ) : (
                filteredItems.map((item) => {
                  const catColor =
                    item.category === 'technical'
                      ? 'border-cyan-400 bg-cyan-950 text-cyan-300'
                      : item.category === 'flagship'
                      ? 'border-purple-400 bg-purple-950 text-purple-200'
                      : 'border-pink-400 bg-pink-950 text-pink-300';

                  return (
                    <div
                      key={item.id}
                      className="p-4 sm:p-5 rounded-2xl bg-[#12082b] border border-purple-900/70 hover:border-emerald-500/80 transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4 group shadow-md"
                    >
                      <div className="flex items-start gap-4 flex-1">
                        {/* Day & Time Chip */}
                        <div className="w-24 sm:w-28 shrink-0 flex flex-col items-center justify-center p-2.5 rounded-xl bg-slate-950 border border-purple-800 text-center">
                          <span className="font-display text-[11px] font-black text-emerald-400 uppercase tracking-wider">
                            DAY {item.day}
                          </span>
                          <span className="font-mono text-xs font-bold text-yellow-300 mt-1 leading-tight">
                            {item.time.split(' - ')[0]}
                          </span>
                          <span className="font-mono text-[10px] text-slate-400">
                            {item.time.split(' - ')[1] || ''}
                          </span>
                        </div>

                        {/* Event Details */}
                        <div className="space-y-1.5 flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className={`font-display text-[10px] font-black px-2 py-0.5 rounded border uppercase tracking-wider ${catColor}`}>
                              {item.category}
                            </span>
                            <h3 className="font-display text-base sm:text-lg font-black text-white group-hover:text-emerald-300 transition-colors">
                              {item.title}
                            </h3>
                          </div>

                          <p className="font-body text-xs sm:text-sm text-slate-200 font-medium leading-relaxed">
                            {item.desc}
                          </p>

                          <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-body font-semibold">
                            <MapPin size={14} className="text-emerald-400 shrink-0" />
                            <span>Venue: {item.venue}</span>
                          </div>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="w-full md:w-auto shrink-0 flex items-center gap-2 pt-2 md:pt-0 border-t md:border-t-0 border-purple-900/40">
                        {item.eventId && (
                          <button
                            onClick={() => handleOpenEvent(item.eventId)}
                            className="flex-1 md:flex-none px-4 py-2 rounded-xl bg-purple-950 hover:bg-purple-800 border border-purple-500/80 text-purple-200 hover:text-white font-display text-xs font-black uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer transition-all"
                          >
                            <span>DOSSIER</span>
                            <ChevronRight size={14} />
                          </button>
                        )}

                        {item.registrationLink && (
                          <a
                            href={item.registrationLink}
                            target="_blank"
                            rel="noreferrer"
                            className="flex-1 md:flex-none px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-display text-xs font-black uppercase tracking-wider shadow-md shadow-emerald-500/30 flex items-center justify-center gap-1.5 cursor-pointer transition-all"
                          >
                            <span>REGISTER</span>
                            <ExternalLink size={13} />
                          </a>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
