import React, { useState } from 'react';
import { X, Image as ImageIcon, ZoomIn, ChevronLeft, ChevronRight } from 'lucide-react';
import { pastGlimpses } from '../../data/gallery';
import { soundEngine } from '../../game/systems/SoundEngine';

export function GalleryModal({ onClose }) {
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [activeFilter, setActiveFilter] = useState('all');

  const categories = ['all', 'Band Night', 'Summit League', 'HackTheChain', 'Pronite', 'Robo Soccer', 'Carnival'];

  const filtered = activeFilter === 'all' 
    ? pastGlimpses 
    : pastGlimpses.filter(p => p.tag === activeFilter);

  const openLightbox = (photo) => {
    soundEngine.playBlip();
    setSelectedPhoto(photo);
  };

  const closeLightbox = () => {
    setSelectedPhoto(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-5xl max-h-[90vh] flex flex-col bg-[#0d0720] border-2 border-cyan-400 rounded-2xl shadow-2xl shadow-cyan-500/20 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-5 sm:p-6 border-b border-purple-900/60 bg-[#160b33]">
          <div className="flex items-center gap-3">
            <ImageIcon size={24} className="text-cyan-400" />
            <div>
              <h2 className="font-display text-xl sm:text-2xl text-cyan-300 font-black tracking-wider uppercase">
                PAST GLIMPSES GALLERY
              </h2>
              <p className="font-body text-sm sm:text-base text-purple-200 font-semibold tracking-wider uppercase mt-0.5">
                AUTHENTIC REVERIE ARCHIVES • BROCHURE PAGE 04
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              soundEngine.playBlip();
              onClose();
            }}
            className="p-2 rounded-xl bg-slate-800 hover:bg-rose-900 text-slate-300 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Filter Pills */}
        <div className="px-5 py-3.5 bg-[#140b2e] border-b border-purple-900/40 flex items-center gap-2.5 overflow-x-auto">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                soundEngine.playBlip();
                setActiveFilter(cat);
              }}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-display font-bold shrink-0 transition-all ${
                activeFilter === cat 
                  ? 'bg-cyan-500 text-slate-950 font-black shadow-lg shadow-cyan-500/30' 
                  : 'bg-purple-950/70 text-purple-200 hover:bg-purple-900 border border-purple-800/60'
              }`}
            >
              {cat.toUpperCase()}
            </button>
          ))}
        </div>

        {/* Photo Grid */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-7">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-5">
            {filtered.map((photo) => (
              <div
                key={photo.id}
                onClick={() => openLightbox(photo)}
                className="group relative aspect-video sm:aspect-square bg-[#140b2e] rounded-xl overflow-hidden border-2 border-purple-800/60 hover:border-cyan-400 cursor-pointer transition-all hover:scale-[1.03] shadow-lg"
              >
                <img
                  src={photo.src}
                  alt={photo.title}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-3">
                  <span className="font-display text-xs sm:text-sm text-cyan-300 font-bold truncate">
                    {photo.title}
                  </span>
                  <span className="font-body text-xs text-slate-300 font-semibold">
                    {photo.tag}
                  </span>
                </div>
                <div className="absolute top-2.5 right-2.5 p-1.5 bg-black/70 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                  <ZoomIn size={16} className="text-white" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-purple-900/60 bg-[#140a2c] flex justify-end">
          <button
            onClick={() => {
              soundEngine.playBlip();
              onClose();
            }}
            className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-display text-xs font-bold tracking-wider"
          >
            CLOSE GALLERY
          </button>
        </div>
      </div>

      {/* Lightbox Modal */}
      {selectedPhoto && (
        <div 
          onClick={closeLightbox}
          className="fixed inset-0 z-60 bg-black/95 flex flex-col items-center justify-center p-4 animate-fadeIn"
        >
          <div className="relative max-w-4xl max-h-[85vh] flex flex-col items-center">
            <button
              onClick={closeLightbox}
              className="absolute -top-12 right-0 p-2 bg-slate-800 text-white rounded-xl hover:bg-rose-900 transition-colors"
            >
              <X size={22} />
            </button>
            <img
              src={selectedPhoto.src}
              alt={selectedPhoto.title}
              className="max-h-[75vh] w-auto object-contain rounded-2xl border-2 border-cyan-400 shadow-2xl shadow-cyan-500/30"
            />
            <div className="mt-4 text-center">
              <h3 className="font-display text-xl text-white font-black tracking-wide">
                {selectedPhoto.title}
              </h3>
              <p className="font-body text-base text-cyan-300 font-semibold tracking-wider uppercase mt-1">
                {selectedPhoto.tag} • REVERIE ARCHIVES
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
