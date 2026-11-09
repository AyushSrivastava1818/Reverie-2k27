import React, { useState } from 'react';
import { X, Search, Trophy, MapPin, Users, ArrowRight, ExternalLink, Swords, LayoutGrid } from 'lucide-react';
import { eventsData } from '../../data/events';
import { soundEngine } from '../../game/systems/SoundEngine';
import { EventArena } from '../Arcade/EventArena';

export function EventDirectoryModal({ onSelectEvent, onClose, initialCategory = 'all' }) {
  const [viewMode, setViewMode] = useState('arena'); // 'arena' | 'grid'
  const [activeCategory, setActiveCategory] = useState(initialCategory || 'all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredEvents = eventsData.filter((ev) => {
    const matchesCategory = activeCategory === 'all' || ev.category === activeCategory;
    const matchesSearch = 
      ev.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ev.tagline.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ev.shortDesc.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getCategoryColor = (cat) => {
    switch (cat) {
      case 'flagship': return 'text-purple-300 border-purple-500 bg-purple-950/70';
      case 'technical': return 'text-cyan-300 border-cyan-500 bg-cyan-950/70';
      case 'cultural': default: return 'text-pink-300 border-pink-500 bg-pink-950/70';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 md:p-8 bg-black/90 backdrop-blur-lg">
      <div className="relative w-[96vw] max-w-5xl h-[90vh] flex flex-col bg-[#080514] border-2 sm:border-3 border-purple-500 rounded-2xl shadow-2xl shadow-purple-500/25 overflow-hidden">
        {/* Header with REVERIE Brand */}
        <div className="flex items-center justify-between p-5 sm:p-7 border-b border-purple-900/60 bg-[#120826]">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <img src="/assets/branding/reverie_logo.png" alt="REVERIE" className="h-6 w-auto object-contain" />
              <h2 className="font-display text-xl sm:text-3xl font-black text-white">
                2K27 EVENT DIRECTORY
              </h2>
            </div>
            <p className="font-body text-xs sm:text-sm text-yellow-300 font-bold uppercase tracking-wider">
              18 OFFICIAL COMPETITIONS & FESTIVAL EXPERIENCES • IIIT KOTA
            </p>
          </div>
          <div className="flex items-center gap-2.5">
            {/* View Mode Switcher */}
            <div className="p-1 rounded-xl bg-purple-950/80 border border-purple-600/60 flex items-center gap-1">
              <button
                onClick={() => { soundEngine.playBlip(); setViewMode('arena'); }}
                className={`px-3 py-1.5 rounded-lg font-display text-xs font-black uppercase flex items-center gap-1.5 transition-all cursor-pointer ${
                  viewMode === 'arena'
                    ? 'bg-yellow-400 text-black shadow-md scale-105'
                    : 'text-purple-300 hover:text-white'
                }`}
                title="Arcade Fighter Select View"
              >
                <Swords size={14} />
                <span>ARENA</span>
              </button>
              <button
                onClick={() => { soundEngine.playBlip(); setViewMode('grid'); }}
                className={`px-3 py-1.5 rounded-lg font-display text-xs font-black uppercase flex items-center gap-1.5 transition-all cursor-pointer ${
                  viewMode === 'grid'
                    ? 'bg-purple-600 text-white shadow-md scale-105'
                    : 'text-purple-300 hover:text-white'
                }`}
                title="Complete Directory Grid View"
              >
                <LayoutGrid size={14} />
                <span>GRID</span>
              </button>
            </div>

            <button
              onClick={() => {
                soundEngine.playBlip();
                onClose();
              }}
              className="p-2.5 rounded-xl bg-slate-900 hover:bg-rose-900 text-slate-300 hover:text-white transition-colors cursor-pointer"
            >
              <X size={22} />
            </button>
          </div>
        </div>

        {/* View Mode Content */}
        {viewMode === 'arena' ? (
          <div className="flex-1 overflow-hidden flex flex-col">
            <EventArena onSelectEvent={onSelectEvent} />
          </div>
        ) : (
          <>
            {/* Filter & Search Bar */}
            <div className="p-4 sm:p-5 bg-[#100722] border-b border-purple-900/40 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3.5 shrink-0">
          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
            {[
              { id: 'all', label: 'ALL EVENTS (18)' },
              { id: 'flagship', label: 'FLAGSHIP (4)' },
              { id: 'technical', label: 'TECHNICAL (7)' },
              { id: 'cultural', label: 'CULTURAL (7)' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  soundEngine.playBlip();
                  setActiveCategory(tab.id);
                }}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-display font-bold shrink-0 transition-all ${
                  activeCategory === tab.id
                    ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/40'
                    : 'bg-purple-950/60 text-slate-300 hover:bg-purple-900 hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative w-full sm:w-72">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by event title..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#180e33] border-2 border-purple-800 rounded-xl px-4 py-2 pl-10 text-sm font-body text-white placeholder-slate-400 focus:outline-none focus:border-pink-500 font-semibold"
            />
          </div>
        </div>

        {/* Events Grid */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-7">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredEvents.map((ev) => (
              <div 
                key={ev.id}
                className="bg-[#120826] border-2 border-purple-900/70 hover:border-pink-500 rounded-2xl p-5 flex flex-col justify-between transition-all hover:scale-[1.02] shadow-xl group"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-display border font-bold uppercase ${getCategoryColor(ev.category)}`}>
                      {ev.category}
                    </span>
                    <span className="font-display text-xs text-yellow-300 font-bold">
                      {ev.prizePool}
                    </span>
                  </div>

                  <h3 className="font-display text-xl font-black text-white group-hover:text-pink-300 transition-colors tracking-wide">
                    {ev.title}
                  </h3>
                  
                  <p className="font-body text-xs text-yellow-300/90 font-bold uppercase mt-1 tracking-wider line-clamp-1">
                    {ev.tagline}
                  </p>

                  <p className="font-body text-sm sm:text-base text-slate-200 mt-3 line-clamp-3 leading-relaxed font-semibold">
                    {ev.shortDesc}
                  </p>
                </div>

                <div className="pt-4 mt-5 border-t border-purple-900/60 flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs font-body font-semibold text-slate-300">
                    <MapPin size={14} className="text-cyan-400 shrink-0" />
                    <span className="truncate max-w-[140px]">{ev.venue || 'Campus Arena'}</span>
                  </div>

                  <button
                    onClick={() => {
                      soundEngine.playBlip();
                      onSelectEvent(ev);
                    }}
                    className="pixel-btn pixel-btn-pink text-xs px-4 py-2 flex items-center gap-1.5"
                  >
                    <span>VIEW</span>
                    <ArrowRight size={12} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {filteredEvents.length === 0 && (
            <div className="p-12 text-center text-slate-400 font-display text-base font-bold">
              NO EVENTS FOUND MATCHING YOUR SEARCH QUERY.
            </div>
          )}
        </div>
        </>
        )}

        {/* Footer */}
        <div className="p-4 sm:p-5 border-t border-purple-900/60 bg-[#100722] flex flex-col sm:flex-row items-center justify-between gap-3">
          <span className="text-sm font-body font-semibold text-slate-300">
            Total Lineup: <strong className="text-yellow-400 font-display">18 Competitions, Workshops & Shows</strong>
          </span>
          <button
            onClick={() => {
              soundEngine.playBlip();
              onClose();
            }}
            className="pixel-btn pixel-btn-dark text-xs px-6 py-2.5"
          >
            BACK TO WORLD
          </button>
        </div>
      </div>
    </div>
  );
}
