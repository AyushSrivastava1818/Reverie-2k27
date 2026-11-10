import React from 'react';

// =========================================================================
// 16-BIT RETRO ARCADE ICONS (Replacing plain emojis with authentic pixel art)
// =========================================================================

/**
 * 01 HACKATHON: High-Tech Cyber Laptop / Matrix Terminal
 */
export function PixelHackathonIcon({ size = 48, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" className={`filter drop-shadow-[0_0_10px_rgba(34,211,238,0.8)] ${className}`}>
      {/* Screen Frame */}
      <rect x="8" y="6" width="32" height="24" rx="2" fill="#0f172a" stroke="#06b6d4" strokeWidth="2" />
      {/* Matrix Glowing Screen */}
      <rect x="11" y="9" width="26" height="18" fill="#022c22" />
      {/* Code terminal text lines */}
      <line x1="14" y1="13" x2="22" y2="13" stroke="#22c55e" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="14" y1="17" x2="30" y2="17" stroke="#4ade80" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="14" y1="21" x2="26" y2="21" stroke="#86efac" strokeWidth="1.5" strokeLinecap="round" />
      {/* Glowing </> Symbol in center */}
      <text x="24" y="22" fill="#38bdf8" fontSize="10" fontFamily="monospace" fontWeight="900" textAnchor="middle">&lt;/&gt;</text>
      {/* Laptop Hinge & Base */}
      <polygon points="4,34 44,34 40,30 8,30" fill="#334155" stroke="#06b6d4" strokeWidth="1.5" />
      <rect x="18" y="31" width="12" height="2" fill="#94a3b8" /> {/* Trackpad */}
      {/* Power LED */}
      <circle cx="24" cy="7.5" r="1" fill="#22c55e" />
    </svg>
  );
}

/**
 * 02 ROBOTICS: Combat Battle-Bot Mecha Head
 */
export function PixelRoboticsIcon({ size = 48, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" className={`filter drop-shadow-[0_0_10px_rgba(59,130,246,0.8)] ${className}`}>
      {/* Antenna with glowing beacon */}
      <line x1="24" y1="2" x2="24" y2="10" stroke="#94a3b8" strokeWidth="2" />
      <circle cx="24" cy="3" r="3" fill="#ef4444" className="animate-pulse" />
      {/* Ear Screws / Bolts */}
      <rect x="4" y="16" width="4" height="12" rx="1" fill="#64748b" stroke="#334155" />
      <rect x="40" y="16" width="4" height="12" rx="1" fill="#64748b" stroke="#334155" />
      {/* Robot Head Outer Armor */}
      <rect x="8" y="10" width="32" height="26" rx="4" fill="#1e293b" stroke="#38bdf8" strokeWidth="2" />
      <rect x="11" y="12" width="26" height="5" fill="#334155" />
      {/* Cyber Visor Screen */}
      <rect x="12" y="18" width="24" height="10" rx="2" fill="#0369a1" stroke="#0284c7" strokeWidth="1" />
      {/* Glowing Dual Visor Eyes */}
      <rect x="15" y="20" width="6" height="6" rx="1" fill="#38bdf8" />
      <rect x="27" y="20" width="6" height="6" rx="1" fill="#38bdf8" />
      <circle cx="18" cy="23" r="1.5" fill="#ffffff" />
      <circle cx="30" cy="23" r="1.5" fill="#ffffff" />
      {/* Speaker / Grille Mouth */}
      <rect x="16" y="30" width="16" height="3" fill="#0f172a" />
      <line x1="19" y1="30" x2="19" y2="33" stroke="#94a3b8" />
      <line x1="24" y1="30" x2="24" y2="33" stroke="#94a3b8" />
      <line x1="29" y1="30" x2="29" y2="33" stroke="#94a3b8" />
      {/* Neck Joint */}
      <rect x="18" y="37" width="12" height="5" fill="#475569" stroke="#1e293b" />
    </svg>
  );
}

/**
 * 03 GAMING: Retro 16-Bit Arcade Game Controller
 */
export function PixelGamingIcon({ size = 48, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" className={`filter drop-shadow-[0_0_10px_rgba(236,72,153,0.8)] ${className}`}>
      {/* Controller Body with Grips */}
      <path d="M 10 16 Q 24 14 38 16 Q 44 24 40 38 Q 34 40 30 32 Q 24 30 18 32 Q 14 40 8 38 Q 4 24 10 16 Z" fill="#1e1b4b" stroke="#ec4899" strokeWidth="2" />
      {/* Top Shoulder Buttons */}
      <rect x="10" y="13" width="8" height="3" rx="1" fill="#6b21a8" />
      <rect x="30" y="13" width="8" height="3" rx="1" fill="#6b21a8" />
      {/* D-Pad (Left) */}
      <rect x="13" y="20" width="4" height="10" rx="1" fill="#334155" />
      <rect x="10" y="23" width="10" height="4" rx="1" fill="#334155" />
      <circle cx="15" cy="25" r="1" fill="#94a3b8" />
      {/* 4 Colored Action Buttons (SNES style Diamond) */}
      <circle cx="34" cy="21" r="2.2" fill="#ef4444" /> {/* Top Red */}
      <circle cx="30" cy="25" r="2.2" fill="#3b82f6" /> {/* Left Blue */}
      <circle cx="38" cy="25" r="2.2" fill="#eab308" /> {/* Right Yellow */}
      <circle cx="34" cy="29" r="2.2" fill="#22c55e" /> {/* Bottom Green */}
      {/* Center Select & Start pills */}
      <line x1="21" y1="27" x2="23" y2="25" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="25" y1="27" x2="27" y2="25" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

/**
 * 04 QUIZ BATTLE: Shimmering Golden Champion Trophy
 */
export function PixelQuizIcon({ size = 48, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" className={`filter drop-shadow-[0_0_10px_rgba(234,179,8,0.9)] ${className}`}>
      {/* Trophy Handles */}
      <path d="M 12 12 Q 4 18 12 26 L 16 26" fill="none" stroke="#facc15" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M 36 12 Q 44 18 36 26 L 32 26" fill="none" stroke="#facc15" strokeWidth="2.5" strokeLinecap="round" />
      {/* Main Cup Body */}
      <path d="M 14 10 L 34 10 L 32 24 Q 24 30 16 24 Z" fill="#eab308" stroke="#78350f" strokeWidth="1.5" />
      <path d="M 16 12 L 32 12 L 30 22 Q 24 27 18 22 Z" fill="#fde047" />
      {/* Star Emblem on Cup */}
      <polygon points="24,14 25.5,18 29.5,18 26.5,20.5 27.5,24.5 24,22 20.5,24.5 21.5,20.5 18.5,18 22.5,18" fill="#ca8a04" />
      {/* Stem */}
      <rect x="22" y="28" width="4" height="6" fill="#ca8a04" stroke="#78350f" />
      {/* Marble Base */}
      <rect x="14" y="34" width="20" height="7" rx="1.5" fill="#451a03" stroke="#78350f" strokeWidth="1.5" />
      <rect x="16" y="36" width="16" height="3" fill="#ca8a04" />
      <circle cx="24" cy="37.5" r="1" fill="#ffffff" />
    </svg>
  );
}

/**
 * 05 DESIGN: Artist's Color Palette with Paint & Brush
 */
export function PixelDesignIcon({ size = 48, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" className={`filter drop-shadow-[0_0_10px_rgba(168,85,247,0.8)] ${className}`}>
      {/* Wooden Palette Base */}
      <path d="M 24 6 Q 42 6 42 24 Q 42 38 28 40 Q 22 41 18 36 Q 14 31 10 32 Q 4 33 6 22 Q 8 6 24 6 Z" fill="#b45309" stroke="#78350f" strokeWidth="2" />
      <path d="M 24 8 Q 40 8 40 24 Q 40 36 28 38 Q 23 39 19 35 Q 15 30 11 31 Q 6 32 8 22 Q 10 8 24 8 Z" fill="#d97706" />
      {/* Thumb Hole */}
      <ellipse cx="14" cy="22" rx="3.5" ry="4.5" fill="#1e1b4b" stroke="#78350f" strokeWidth="1" />
      {/* 5 Paint Dollops */}
      <circle cx="22" cy="12" r="3" fill="#ef4444" /> {/* Red */}
      <circle cx="31" cy="14" r="3" fill="#3b82f6" /> {/* Blue */}
      <circle cx="36" cy="22" r="3" fill="#facc15" /> {/* Yellow */}
      <circle cx="32" cy="30" r="3" fill="#22c55e" /> {/* Green */}
      <circle cx="23" cy="34" r="3" fill="#ec4899" /> {/* Magenta */}
      {/* Detail Paintbrush crossing bottom right */}
      <line x1="38" y1="36" x2="44" y2="44" stroke="#78350f" strokeWidth="2.5" strokeLinecap="round" />
      <polygon points="38,36 36,34 39,33" fill="#94a3b8" />
      <polygon points="36,34 34,32 37,31" fill="#0284c7" />
    </svg>
  );
}

/**
 * 06 WORKSHOP: Crossed Steel Mechanic Wrench and Screwdriver
 */
export function PixelWorkshopIcon({ size = 48, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" className={`filter drop-shadow-[0_0_10px_rgba(203,213,225,0.8)] ${className}`}>
      {/* Screwdriver (Bottom-Left to Top-Right) */}
      <line x1="12" y1="36" x2="36" y2="12" stroke="#64748b" strokeWidth="3" strokeLinecap="round" />
      <line x1="10" y1="38" x2="16" y2="32" stroke="#ea580c" strokeWidth="5" strokeLinecap="round" />
      <polygon points="36,12 39,9 37,7 34,10" fill="#94a3b8" />
      {/* Wrench (Top-Left to Bottom-Right) */}
      <line x1="14" y1="14" x2="34" y2="34" stroke="#cbd5e1" strokeWidth="4" strokeLinecap="round" />
      {/* Wrench Top Jaw */}
      <path d="M 8 16 L 14 10 L 20 16 L 16 20 Z" fill="#94a3b8" stroke="#475569" strokeWidth="1" />
      <path d="M 12 12 L 14 14 L 16 12" fill="#1e293b" />
      {/* Wrench Bottom Ring */}
      <circle cx="34" cy="34" r="5" fill="#94a3b8" stroke="#475569" strokeWidth="1" />
      <circle cx="34" cy="34" r="2.5" fill="#1e1b4b" />
    </svg>
  );
}

/**
 * 07 CULTURAL: Neon Dual Musical Notes with Cyber Soundwaves
 */
export function PixelCulturalIcon({ size = 48, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" className={`filter drop-shadow-[0_0_10px_rgba(244,114,182,0.9)] ${className}`}>
      {/* Floating Soundwaves */}
      <path d="M 38 14 Q 44 24 38 34" fill="none" stroke="#22d3ee" strokeWidth="2" strokeLinecap="round" opacity="0.8" />
      <path d="M 42 10 Q 50 24 42 38" fill="none" stroke="#a855f7" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
      {/* Top Beam */}
      <polygon points="16,14 34,8 34,13 16,19" fill="#ec4899" stroke="#be185d" strokeWidth="1" />
      {/* Left Note Stem */}
      <rect x="16" y="14" width="3.5" height="18" fill="#ec4899" />
      {/* Left Note Head */}
      <ellipse cx="14" cy="32" rx="5.5" ry="4" fill="#f43f5e" transform="rotate(-12 14 32)" />
      <ellipse cx="13" cy="31" rx="2.5" ry="1.5" fill="#ffffff" opacity="0.6" />
      {/* Right Note Stem */}
      <rect x="30.5" y="10" width="3.5" height="18" fill="#ec4899" />
      {/* Right Note Head */}
      <ellipse cx="28.5" cy="28" rx="5.5" ry="4" fill="#a855f7" transform="rotate(-12 28.5 28)" />
      <ellipse cx="27.5" cy="27" rx="2.5" ry="1.5" fill="#ffffff" opacity="0.6" />
    </svg>
  );
}

// =========================================================================
// 16-BIT CHARACTERS & SPRITES
// =========================================================================

/**
 * Authentic 16-bit Super Mario World Hero Sprite
 */
export function SuperMarioSprite({ size = 80, isJumping = false }) {
  return (
    <svg width={size} height={size * 1.25} viewBox="0 0 24 30" className="filter drop-shadow-[0_8px_16px_rgba(0,0,0,0.8)]">
      {/* Red Cap with 3D Brim */}
      <rect x="5" y="2" width="13" height="4" rx="1" fill="#dc2626" />
      <rect x="4" y="4" width="16" height="3" fill="#ef4444" />
      <rect x="3" y="6" width="18" height="2" fill="#b91c1c" />
      {/* White 'M' Emblem */}
      <circle cx="11.5" cy="4" r="2.2" fill="#ffffff" />
      <path d="M 10.3 5 L 10.3 3.2 L 11.5 4.3 L 12.7 3.2 L 12.7 5" fill="none" stroke="#dc2626" strokeWidth="0.8" strokeLinecap="round" strokeLinejoin="round" />
      
      {/* Hair & Sideburns */}
      <rect x="4" y="7" width="4" height="4.5" fill="#451a03" />
      <rect x="6" y="9.5" width="3" height="3" fill="#451a03" />
      
      {/* Face & Big Nose with warm 16-bit tone */}
      <rect x="8" y="7" width="9" height="5.5" fill="#fed7aa" />
      <rect x="15" y="8" width="4.5" height="3.5" rx="1" fill="#fdba74" />
      {/* Piercing Eye */}
      <rect x="13" y="7.5" width="2" height="2.5" fill="#0f172a" />
      <rect x="13.2" y="7.7" width="0.8" height="1" fill="#ffffff" />
      
      {/* Iconic Bushy Moustache */}
      <rect x="9" y="10" width="9.5" height="2.2" rx="0.5" fill="#451a03" />
      <rect x="8" y="11" width="3" height="1.8" fill="#451a03" />
      
      {/* Red Shirt Sleeves & Collar */}
      <rect x="6" y="12" width="12" height="5" fill="#dc2626" />
      <rect x="5" y="13" width="3" height="4" fill="#ef4444" />
      <rect x="16" y="13" width="3" height="4" fill="#b91c1c" />
      
      {/* Denim Blue Overalls */}
      <rect x="8" y="15" width="8" height="8.5" fill="#1d4ed8" />
      <rect x="6" y="16" width="2.5" height="4" fill="#2563eb" />
      <rect x="15.5" y="16" width="2.5" height="4" fill="#1e40af" />
      
      {/* Polished Brass Buttons */}
      <circle cx="9.5" cy="16.5" r="1.3" fill="#facc15" stroke="#78350f" strokeWidth="0.4" />
      <circle cx="14.5" cy="16.5" r="1.3" fill="#facc15" stroke="#78350f" strokeWidth="0.4" />
      
      {/* White Gloves */}
      <circle cx="4.8" cy="18" r="3" fill="#ffffff" stroke="#cbd5e1" strokeWidth="0.6" />
      <circle cx="19.2" cy="18" r="3" fill="#ffffff" stroke="#cbd5e1" strokeWidth="0.6" />
      
      {/* Heavy Work Boots */}
      {isJumping ? (
        <>
          <rect x="2.5" y="21" width="6.5" height="4.5" rx="2" fill="#78350f" stroke="#451a03" strokeWidth="0.6" />
          <rect x="15" y="23" width="6.5" height="4.5" rx="2" fill="#78350f" stroke="#451a03" strokeWidth="0.6" />
        </>
      ) : (
        <>
          <rect x="5" y="23.5" width="6" height="4.5" rx="2" fill="#78350f" stroke="#451a03" strokeWidth="0.6" />
          <rect x="13" y="23.5" width="6" height="4.5" rx="2" fill="#78350f" stroke="#451a03" strokeWidth="0.6" />
        </>
      )}
    </svg>
  );
}

/**
 * Authentic 16-Bit Sega Genesis Sonic Sprite
 */
export function SonicGenesisSprite({ size = 48, active = false }) {
  return (
    <svg width={size} height={size * 1.25} viewBox="0 0 32 40" className={`filter drop-shadow-[0_4px_8px_rgba(0,0,0,0.8)] ${active ? 'animate-bounce' : ''}`}>
      {/* Deep Cobalt Blue Spikes Head */}
      <circle cx="16" cy="14" r="9" fill="#1d4ed8" />
      {/* 3 Iconic Spikes */}
      <polygon points="12,7 2,4 10,13" fill="#1d4ed8" />
      <polygon points="9,13 0,16 9,21" fill="#1d4ed8" />
      <polygon points="10,21 3,25 12,24" fill="#1d4ed8" />
      {/* Peach Muzzle & Ears */}
      <polygon points="17,5 20,1 23,6" fill="#1d4ed8" />
      <polygon points="18,5 20,2 22,6" fill="#fed7aa" />
      <ellipse cx="19" cy="16" rx="6" ry="4.5" fill="#fed7aa" />
      {/* Big Expressive Eyes & Pupil */}
      <ellipse cx="16" cy="12" rx="3.5" ry="5" fill="#ffffff" />
      <ellipse cx="21" cy="12" rx="3.5" ry="5" fill="#ffffff" />
      <circle cx="17.5" cy="12.5" r="1.8" fill="#10b981" /> {/* Emerald green eye */}
      <circle cx="17.5" cy="12.5" r="1.2" fill="#000000" />
      <circle cx="22.5" cy="12.5" r="1.8" fill="#10b981" />
      <circle cx="22.5" cy="12.5" r="1.2" fill="#000000" />
      <circle cx="18" cy="11.5" r="0.6" fill="#ffffff" />
      <circle cx="23" cy="11.5" r="0.6" fill="#ffffff" />
      {/* Nose */}
      <circle cx="25" cy="15" r="1.5" fill="#000000" />
      {/* Torso */}
      <rect x="12" y="21" width="9" height="9" rx="3" fill="#1d4ed8" />
      <circle cx="16.5" cy="25.5" r="3.5" fill="#fed7aa" /> {/* Peach Chest */}
      {/* White Gloves */}
      <circle cx="9" cy="25" r="3" fill="#ffffff" stroke="#cbd5e1" strokeWidth="0.5" />
      <circle cx="24" cy="25" r="3" fill="#ffffff" stroke="#cbd5e1" strokeWidth="0.5" />
      {/* Red Power Sneakers with White Strap and Gold Buckle */}
      <rect x="10" y="30" width="6" height="8" rx="2" fill="#dc2626" />
      <rect x="10" y="32" width="6" height="2" fill="#ffffff" />
      <rect x="12" y="32" width="2" height="2" fill="#facc15" />
      <rect x="18" y="30" width="6" height="8" rx="2" fill="#dc2626" />
      <rect x="18" y="32" width="6" height="2" fill="#ffffff" />
      <rect x="20" y="32" width="2" height="2" fill="#facc15" />
    </svg>
  );
}

/**
 * Authentic 8-Bit Space Invader Alien
 */
export function SpaceInvaderAlien({ size = 36, color = '#10b981', frame = 0 }) {
  return (
    <svg width={size} height={size * 0.8} viewBox="0 0 24 18" className="filter drop-shadow-[0_0_8px_currentColor]" style={{ color }}>
      {/* Classic Crab Space Invader Grid */}
      <rect x="7" y="0" width="2" height="2" fill="currentColor" />
      <rect x="15" y="0" width="2" height="2" fill="currentColor" />
      <rect x="9" y="2" width="6" height="2" fill="currentColor" />
      <rect x="5" y="4" width="14" height="2" fill="currentColor" />
      <rect x="3" y="6" width="18" height="2" fill="currentColor" />
      {/* Eyes (Black cutouts) */}
      <rect x="7" y="6" width="2" height="2" fill="#060214" />
      <rect x="15" y="6" width="2" height="2" fill="#060214" />
      <rect x="1" y="8" width="22" height="2" fill="currentColor" />
      <rect x="3" y="10" width="18" height="2" fill="currentColor" />
      {/* Legs Animation */}
      {frame === 0 ? (
        <>
          <rect x="5" y="12" width="4" height="2" fill="currentColor" />
          <rect x="15" y="12" width="4" height="2" fill="currentColor" />
          <rect x="3" y="14" width="2" height="4" fill="currentColor" />
          <rect x="19" y="14" width="2" height="4" fill="currentColor" />
        </>
      ) : (
        <>
          <rect x="7" y="12" width="4" height="2" fill="currentColor" />
          <rect x="13" y="12" width="4" height="2" fill="currentColor" />
          <rect x="9" y="14" width="2" height="4" fill="currentColor" />
          <rect x="13" y="14" width="2" height="4" fill="currentColor" />
        </>
      )}
    </svg>
  );
}
