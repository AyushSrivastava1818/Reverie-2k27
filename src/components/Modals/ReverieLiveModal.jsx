import React, { useState, useEffect } from 'react';
import { X, Calendar, Clock, MapPin, Radio, Bell, ArrowRight, ExternalLink, Sparkles, Filter } from 'lucide-react';
import { festivalAnnouncements, festivalSchedule } from '../../data/schedule';
import { eventsData } from '../../data/events';
import { soundEngine } from '../../game/systems/SoundEngine';
import { eventBus } from '../../game/EventBus';

export function ReverieLiveModal({ onClose, onSelectEvent }) {
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-fadeIn select-none">
      <div className="relative w-full max-w-5xl max-h-[92vh] flex flex-col bg-[#0b061a] border-2 border-rose-500/80 rounded-3xl shadow-2xl shadow-rose-950/50 overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-purple-900/60 bg-gradient-to-r from-[#200926] via-[#0d0720] to-[#200926]">
          <div className="flex items-center gap-3.5">
            <div className="relative p-2.5 sm:p-3 bg-rose-950/80 border-2 border-rose-500/80 rounded-2xl text-rose-400 shadow-lg shadow-rose-500/20">
              <Radio size={26} className="animate-pulse" />
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-500"></span>
              </span>
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="font-display text-lg sm:text-2xl text-white font-black tracking-wider uppercase">
                  REVERIE LIVE — FESTIVAL SCHEDULE & TICKER
                </h2>
                <span className="font-display text-[10px] bg-rose-500/20 text-rose-300 border border-rose-500/50 font-black px-2.5 py-0.5 rounded-full flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-ping" />
                  REAL-TIME BROADCAST
                </span>
              </div>
              <p className="font-body text-xs sm:text-sm text-purple-200 font-semibold tracking-wider uppercase mt-0.5">
                3-DAY SCHEDULE • VENUES • TIMINGS • LIVE ANNOUNCEMENTS
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              soundEngine.playBlip();
              onClose();
            }}
            className="p-2 sm:px-3 sm:py-1.5 rounded-xl bg-slate-900 hover:bg-rose-950 text-slate-300 hover:text-white border border-slate-700 hover:border-rose-500 transition-all cursor-pointer flex items-center gap-1.5 font-display text-xs font-bold"
          >
            <span className="hidden sm:inline">CLOSE [ESC]</span>
            <X size={18} />
          </button>
        </div>

        {/* Live Announcements Ticker */}
        <div className="bg-[#150a2e] border-b border-purple-900/60 p-3 sm:px-6">
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-rose-950 border border-rose-500/60 text-rose-300 font-display text-[11px] font-black shrink-0 uppercase tracking-wider">
              <Bell size={12} className="animate-bounce" />
              LATEST UPDATES:
            </div>
            {festivalAnnouncements.map((ann) => (
              <div
                key={ann.id}
                className="flex items-center gap-2 px-3 py-1 rounded-xl bg-purple-950/60 border border-purple-800/40 shrink-0 font-body text-xs text-purple-200"
              >
                <span className="font-display text-[10px] font-black px-1.5 py-0.5 rounded bg-yellow-400/20 text-yellow-300 border border-yellow-400/40">
                  {ann.badge}
                </span>
                <span className="font-semibold text-white">{ann.title}:</span>
                <span className="text-purple-300">{ann.message}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Filters: Day & Category */}
        <div className="p-3 sm:p-4 bg-[#0d0720] border-b border-purple-900/40 flex flex-wrap items-center justify-between gap-3">
          {/* Day Tabs */}
          <div className="flex items-center gap-1.5 bg-slate-950/80 p-1 rounded-xl border border-purple-900/60">
            {[
              { id: 'all', label: 'ALL DAYS' },
              { id: '1', label: 'DAY 1 (FEB 12)' },
              { id: '2', label: 'DAY 2 (FEB 13)' },
              { id: '3', label: 'DAY 3 (FEB 14)' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  soundEngine.playBlip();
                  setSelectedDay(tab.id);
                }}
                className={`px-3 py-1.5 rounded-lg font-display text-xs font-black transition-all cursor-pointer ${
                  selectedDay === tab.id
                    ? 'bg-gradient-to-r from-rose-500 to-pink-600 text-white shadow-md shadow-rose-500/30'
                    : 'text-purple-300 hover:text-white hover:bg-purple-900/40'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Category Filter */}
          <div className="flex items-center gap-1.5 text-xs font-display">
            <Filter size={13} className="text-purple-400" />
            <span className="text-purple-300 hidden sm:inline">FILTER:</span>
            {['all', 'technical', 'cultural', 'flagship'].map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  soundEngine.playBlip();
                  setSelectedCat(cat);
                }}
                className={`px-2.5 py-1 rounded-lg font-black uppercase text-[11px] transition-all cursor-pointer ${
                  selectedCat === cat
                    ? 'bg-purple-700 text-white border border-purple-400'
                    : 'text-slate-400 hover:text-slate-200 bg-slate-900/60'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Schedule List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3">
          {filteredItems.length === 0 ? (
            <div className="text-center py-16 text-purple-300">
              <Calendar size={36} className="mx-auto mb-2 opacity-50" />
              <p className="font-display font-bold">No events matching the selected filters.</p>
            </div>
          ) : (
            filteredItems.map((item) => {
              const hasBrochureEvent = !!item.eventId;
              const catColor =
                item.category === 'technical'
                  ? 'border-emerald-500/40 bg-emerald-950/20 text-emerald-300'
                  : item.category === 'flagship'
                  ? 'border-purple-500/40 bg-purple-950/20 text-purple-300'
                  : 'border-pink-500/40 bg-pink-950/20 text-pink-300';

              return (
                <div
                  key={item.id}
                  className="p-4 sm:p-5 rounded-2xl bg-[#130a2a]/90 border border-purple-800/40 hover:border-rose-500/60 transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4 group"
                >
                  <div className="flex items-start gap-4 flex-1">
                    {/* Time Badge */}
                    <div className="w-24 sm:w-28 shrink-0 flex flex-col items-center justify-center p-2.5 rounded-xl bg-slate-950/80 border border-purple-800/50 text-center">
                      <span className="font-display text-[10px] font-black text-rose-400 uppercase tracking-wider">
                        DAY {item.day}
                      </span>
                      <span className="font-display text-xs font-black text-white mt-0.5 leading-tight">
                        {item.time.split(' - ')[0]}
                      </span>
                      <span className="font-body text-[10px] text-purple-300">
                        {item.time.split(' - ')[1] ? `to ${item.time.split(' - ')[1]}` : ''}
                      </span>
                    </div>

                    {/* Details */}
                    <div className="space-y-1.5 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`font-display text-[10px] font-black px-2 py-0.5 rounded border uppercase tracking-wider ${catColor}`}>
                          {item.category}
                        </span>
                        <h3 className="font-display text-base sm:text-lg font-black text-white group-hover:text-rose-300 transition-colors">
                          {item.title}
                        </h3>
                      </div>

                      <p className="font-body text-xs sm:text-sm text-slate-300 font-medium leading-relaxed">
                        {item.desc}
                      </p>

                      <div className="flex items-center gap-1.5 text-xs text-yellow-400 font-body font-semibold">
                        <MapPin size={13} className="text-yellow-400 shrink-0" />
                        <span>Venue: {item.venue}</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="w-full md:w-auto shrink-0 flex items-center gap-2 pt-2 md:pt-0 border-t md:border-t-0 border-purple-900/40">
                    {hasBrochureEvent && (
                      <button
                        onClick={() => handleOpenEvent(item.eventId)}
                        className="flex-1 md:flex-none px-4 py-2 rounded-xl bg-purple-900/60 hover:bg-purple-800 border border-purple-500/50 text-purple-200 hover:text-white font-display text-xs font-black uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer transition-all"
                      >
                        <span>EVENT DETAILS</span>
                        <ArrowRight size={13} />
                      </button>
                    )}

                    {item.registrationLink && (
                      <a
                        href={item.registrationLink}
                        target="_blank"
                        rel="noreferrer"
                        className="flex-1 md:flex-none px-4 py-2 rounded-xl bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-400 hover:to-pink-500 text-white font-display text-xs font-black uppercase tracking-wider shadow-md shadow-rose-500/20 flex items-center justify-center gap-1.5 cursor-pointer transition-all"
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

        {/* Footer */}
        <div className="p-4 border-t border-purple-900/60 bg-[#0c061e] flex flex-col sm:flex-row items-center justify-between gap-3">
          <span className="font-body text-xs text-purple-200 font-medium text-center sm:text-left">
            📢 All schedules and venues are finalized by REVERIE Organizing Committee, IIIT Kota.
          </span>
          <button
            onClick={() => {
              soundEngine.playBlip();
              onClose();
            }}
            className="px-6 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-display text-xs font-bold tracking-wider cursor-pointer w-full sm:w-auto"
          >
            RESUME GAMEPLAY
          </button>
        </div>

      </div>
    </div>
  );
}

