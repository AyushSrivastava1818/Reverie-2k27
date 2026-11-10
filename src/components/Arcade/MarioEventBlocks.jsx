import React, { useState } from 'react';
import { soundEngine } from '../../game/systems/SoundEngine';
import { eventsData } from '../../data/events';
import {
  PixelHackathonIcon,
  PixelRoboticsIcon,
  PixelGamingIcon,
  PixelQuizIcon,
  PixelDesignIcon,
  PixelWorkshopIcon,
  PixelCulturalIcon,
  SuperMarioSprite
} from './ArcadePixelSprites';

const MARIO_CATEGORIES = [
  {
    id: 'hackathon',
    number: '01',
    name: 'HACKATHON',
    iconType: 'laptop',
    headline: 'HACK THE FUTURE!',
    desc: 'Build innovative solutions, solve real-world problems and compete with the best developer minds.',
    date: '20-22 FEB 2K27',
    venue: 'MAIN AUDITORIUM & CS LABS',
    missions: [
      'Build an innovative full-stack or Web3 solution',
      'Compete with elite teams across India',
      'Win ₹50,000+ prizes & developer grants'
    ],
    matchingEvents: eventsData.filter(e => e.id.includes('hack') || e.category === 'flagship')
  },
  {
    id: 'robotics',
    number: '02',
    name: 'ROBOTICS',
    iconType: 'robot',
    headline: 'CLASH OF THE MACHINES!',
    desc: 'Engineer autonomous rovers, battle bots and robotic soccer champions in high-stakes combat.',
    date: '21 FEB 2K27',
    venue: 'CAMPUS ROBOTICS ARENA',
    missions: [
      'Field combat bots in Robo Wars & Robo Soccer',
      'Optimize PID controllers in Line Follower sprint',
      'Claim championship trophies and toolkits'
    ],
    matchingEvents: eventsData.filter(e => e.id.includes('robo') || e.category === 'technical')
  },
  {
    id: 'gaming',
    number: '03',
    name: 'GAMING',
    iconType: 'gamepad',
    headline: 'ESPORTS SUMMIT SHOWDOWN!',
    desc: 'Enter the competitive battleground for Valorant, BGMI, EA FC 24 and retro arcade duels.',
    date: '20-22 FEB 2K27',
    venue: 'ESPORTS DEN & GAMING LOUNGE',
    missions: [
      'Climb the double-elimination tournament brackets',
      'Broadcast matches live on Reverie Twitch & YouTube',
      'Take home esports prize pools and gaming gear'
    ],
    matchingEvents: eventsData.filter(e => e.category === 'gaming')
  },
  {
    id: 'quiz',
    number: '04',
    name: 'QUIZ BATTLE',
    iconType: 'trophy',
    headline: 'THE ULTIMATE TRIVIA ARENA!',
    desc: 'Put your tech, pop-culture, algorithms and general knowledge to the test against master quizmasters.',
    date: '21 FEB 2K27',
    venue: 'SEMINAR HALL 1',
    missions: [
      'Survive rapid-fire buzzer rounds',
      'Outsmart rival collegiate intellects',
      'Win cash prizes and quizmaster laurels'
    ],
    matchingEvents: eventsData.filter(e => e.id.includes('quiz') || e.id.includes('bid'))
  },
  {
    id: 'design',
    number: '05',
    name: 'DESIGN',
    iconType: 'palette',
    headline: 'PIXEL & VECTOR ODYSSEY!',
    desc: 'Showcase your UI/UX, motion graphics, 3D blender modeling and retro branding prowess.',
    date: '21-22 FEB 2K27',
    venue: 'CREATIVE MEDIA LAB',
    missions: [
      'Design cutting-edge interactive product interfaces',
      'Render 3D assets & festival animations',
      'Get reviewed by top industry design leads'
    ],
    matchingEvents: eventsData.filter(e => e.id.includes('design') || e.category === 'technical')
  },
  {
    id: 'workshop',
    number: '06',
    name: 'WORKSHOP',
    iconType: 'wrench',
    headline: 'HANDS-ON MASTERCLASSES!',
    desc: 'Deep-dive into generative AI, LLM fine-tuning, system design and zero-knowledge cryptography.',
    date: '20 FEB 2K27',
    venue: 'INNOVATION CENTRE',
    missions: [
      'Build real-world deployed applications',
      'Learn directly from tech leads & open-source maintainers',
      'Receive official Reverie credentials & swag'
    ],
    matchingEvents: eventsData.filter(e => e.id.includes('workshop') || e.category === 'flagship')
  },
  {
    id: 'cultural',
    number: '07',
    name: 'CULTURAL',
    iconType: 'music',
    headline: 'THE GRAND PRONITE SPECTACLE!',
    desc: 'Celebrate with star DJ nights, Battle of the Bands, street dances, fashion shows and carnival festivities.',
    date: '22 FEB 2K27',
    venue: 'MAIN FESTIVAL LAWNS',
    missions: [
      'Witness headlining national star performers',
      'Cheer for battle-of-the-bands finalists',
      'Enjoy carnival games, food stalls and night fireworks'
    ],
    matchingEvents: eventsData.filter(e => e.category === 'cultural' || e.id.includes('pronite'))
  }
];

export function MarioEventBlocks({ onSelectEvent, onOpenFullDirectory, onClose, onBackToMap }) {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [bouncingId, setBouncingId] = useState(null);

  const handleBlockClick = (cat) => {
    soundEngine.playCoin();
    setBouncingId(cat.id);
    setTimeout(() => {
      setBouncingId(null);
      setSelectedCategory(cat);
    }, 200);
  };

  return (
    <div className="relative w-full h-full flex flex-col justify-between bg-gradient-to-b from-[#299fed] via-[#52b3f7] to-[#8ed6fd] font-pixel select-none overflow-hidden">
      
      {/* ------------------------------------------------------------- */}
      {/* TOP HUD: WORLD 1-1, WOODEN SIGNBOARD, HEARTS (Ref: 22.11.17(2))*/}
      {/* ------------------------------------------------------------- */}
      <div className="relative z-30 w-full pt-3 px-4 flex items-center justify-between shrink-0">
        
        {/* Top Left: WORLD 1-1 with 3 Glowing Red Pixel Hearts */}
        <div className="px-3.5 py-1.5 rounded-xl bg-black/85 border-2 border-red-500 shadow-[0_4px_10px_rgba(0,0,0,0.6)] flex items-center gap-2">
          <span className="text-white text-[10px] sm:text-xs font-black tracking-widest">
            WORLD 1-1
          </span>
          <div className="flex items-center gap-1">
            <span className="text-red-500 text-xs sm:text-sm animate-pulse">❤️</span>
            <span className="text-red-500 text-xs sm:text-sm animate-pulse">❤️</span>
            <span className="text-red-500 text-xs sm:text-sm animate-pulse">❤️</span>
          </div>
        </div>

        {/* Center: Carved Wooden Signboard "CHOOSE YOUR EVENT!" */}
        <div className="flex flex-col items-center">
          <div className="px-6 py-2 rounded-xl bg-[#854d0e] border-3 border-[#582c03] shadow-[0_6px_0_#451a03,0_8px_15px_rgba(0,0,0,0.5)] flex flex-col items-center">
            <span className="text-yellow-300 text-sm sm:text-xl font-black tracking-wider drop-shadow-[0_2px_0_#000]">
              CHOOSE YOUR EVENT!
            </span>
            <span className="text-yellow-200 text-[8px] sm:text-[10px] font-bold tracking-wide mt-0.5">
              ★ Seven adventures are waiting for you. ★
            </span>
          </div>
        </div>

        {/* Top Right: WORLD MAP & CLOSE BUTTONS */}
        <div className="flex items-center gap-2">
          {onBackToMap && (
            <button
              onClick={onBackToMap}
              className="px-3 py-1.5 rounded-xl bg-purple-900 border-2 border-purple-400 text-yellow-300 text-[9px] font-black cursor-pointer hover:bg-purple-800 shadow-[0_3px_0_#3b0764] active:translate-y-1"
            >
              ← WORLD MAP
            </button>
          )}
          <button
            onClick={onClose}
            className="px-3 py-1.5 rounded-xl bg-red-600 hover:bg-red-500 text-white border-2 border-red-300 shadow-[0_4px_0_#7f1d1d] text-[10px] font-black cursor-pointer active:translate-y-1"
          >
            ✕ CLOSE
          </button>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* MIDGROUND: VIBRANT MARIO HILLS, CLOUDS, AND PEACH'S CASTLE     */}
      {/* ------------------------------------------------------------- */}
      <div className="relative flex-1 w-full flex flex-col justify-center items-center overflow-hidden my-auto py-2">
        
        {/* Floating Iconic Mario Clouds */}
        <div className="absolute top-2 left-12 text-white text-5xl opacity-90 pointer-events-none drop-shadow">☁️</div>
        <div className="absolute top-0 right-28 text-white text-6xl opacity-85 pointer-events-none drop-shadow">☁️</div>
        <div className="absolute top-10 left-96 text-white text-4xl opacity-75 pointer-events-none">☁️</div>

        {/* Rolling Green Hills in Background with Eyes */}
        <div className="absolute bottom-6 left-0 right-0 h-56 pointer-events-none z-0">
          <svg className="w-full h-full" viewBox="0 0 1000 220" preserveAspectRatio="none">
            {/* Distant Hills */}
            <path d="M 0 220 Q 150 70 300 220" fill="#22c55e" opacity="0.65" />
            <path d="M 250 220 Q 450 45 650 220" fill="#16a34a" opacity="0.75" />
            <path d="M 600 220 Q 750 80 900 220" fill="#22c55e" opacity="0.65" />
            
            {/* Nearer Green Hills */}
            <path d="M -50 220 Q 100 90 280 220" fill="#4ade80" />
            <path d="M 240 220 Q 420 80 600 220" fill="#22c55e" />
            <path d="M 550 220 Q 720 95 920 220" fill="#4ade80" />
            <path d="M 850 220 Q 980 100 1100 220" fill="#22c55e" />

            {/* Hill Smiling Eyes */}
            <ellipse cx="100" cy="155" rx="3.5" ry="9" fill="#000" />
            <ellipse cx="114" cy="155" rx="3.5" ry="9" fill="#000" />
            <ellipse cx="420" cy="148" rx="3.5" ry="9" fill="#000" />
            <ellipse cx="434" cy="148" rx="3.5" ry="9" fill="#000" />
            <ellipse cx="720" cy="155" rx="3.5" ry="9" fill="#000" />
            <ellipse cx="734" cy="155" rx="3.5" ry="9" fill="#000" />
          </svg>
        </div>

        {/* PEACH'S PRINCESS CASTLE (Right Side) */}
        <div className="absolute right-4 bottom-8 w-52 sm:w-64 h-64 pointer-events-none z-10 flex flex-col items-center justify-end">
          <svg width="250" height="230" viewBox="0 0 220 200" className="filter drop-shadow-[0_8px_15px_rgba(0,0,0,0.5)]">
            {/* Left Tower */}
            <rect x="20" y="80" width="30" height="90" fill="#e2e8f0" stroke="#475569" strokeWidth="2" />
            <polygon points="15,80 35,38 55,80" fill="#ef4444" stroke="#991b1b" strokeWidth="2" />
            <rect x="33" y="24" width="4" height="16" fill="#facc15" />
            <polygon points="37,24 52,29 37,34" fill="#ef4444" />

            {/* Right Tower */}
            <rect x="170" y="80" width="30" height="90" fill="#e2e8f0" stroke="#475569" strokeWidth="2" />
            <polygon points="165,80 185,38 205,80" fill="#ef4444" stroke="#991b1b" strokeWidth="2" />
            <rect x="183" y="24" width="4" height="16" fill="#facc15" />
            <polygon points="187,24 202,29 187,34" fill="#ef4444" />

            {/* Central Keep Tower */}
            <rect x="75" y="48" width="70" height="122" fill="#f8fafc" stroke="#475569" strokeWidth="2" />
            <polygon points="70,48 110,8 150,48" fill="#ef4444" stroke="#991b1b" strokeWidth="2" />
            <rect x="108" y="0" width="4" height="10" fill="#facc15" />
            <polygon points="112,0 130,5 112,10" fill="#ef4444" />

            {/* Main Castle Gate Wall */}
            <rect x="50" y="110" width="120" height="60" fill="#cbd5e1" stroke="#334155" strokeWidth="2" />
            {/* Crenellations */}
            <rect x="55" y="100" width="15" height="10" fill="#cbd5e1" stroke="#334155" strokeWidth="1" />
            <rect x="80" y="100" width="15" height="10" fill="#cbd5e1" stroke="#334155" strokeWidth="1" />
            <rect x="105" y="100" width="15" height="10" fill="#cbd5e1" stroke="#334155" strokeWidth="1" />
            <rect x="130" y="100" width="15" height="10" fill="#cbd5e1" stroke="#334155" strokeWidth="1" />
            <rect x="150" y="100" width="15" height="10" fill="#cbd5e1" stroke="#334155" strokeWidth="1" />

            {/* Arched Portcullis Doorway */}
            <path d="M 95 170 L 95 135 Q 110 120 125 135 L 125 170 Z" fill="#1e293b" />
          </svg>
        </div>

        {/* ------------------------------------------------------------- */}
        {/* 7 PROMINENT FLOATING QUESTION MARK BLOCKS (Ref: 22.11.17(2))   */}
        {/* ------------------------------------------------------------- */}
        {/* 7 PROMINENT 16-BIT QUESTION MARK BLOCKS                       */}
        {/* ------------------------------------------------------------- */}
        <div className="relative z-20 w-full max-w-5xl mx-auto px-4 my-auto">
          <div className="grid grid-cols-7 gap-2 sm:gap-4 items-end">
            {MARIO_CATEGORIES.map((cat) => {
              const isBouncing = bouncingId === cat.id;

              return (
                <div
                  key={cat.id}
                  data-category={cat.id}
                  onClick={() => handleBlockClick(cat)}
                  className={`flex flex-col items-center cursor-pointer group transition-transform ${
                    isBouncing ? '-translate-y-7 scale-110' : 'hover:-translate-y-3 hover:scale-105'
                  }`}
                >
                  {/* Vibrant Handcrafted 16-bit Pixel Icon Above Question Block */}
                  <div className="w-12 h-12 sm:w-16 sm:h-16 mb-2 flex items-center justify-center filter drop-shadow-[0_4px_12px_rgba(0,0,0,0.7)]">
                    {cat.iconType === 'laptop' && <PixelHackathonIcon size={46} className="animate-bounce" />}
                    {cat.iconType === 'robot' && <PixelRoboticsIcon size={46} className="animate-bounce" />}
                    {cat.iconType === 'gamepad' && <PixelGamingIcon size={46} className="animate-bounce" />}
                    {cat.iconType === 'trophy' && <PixelQuizIcon size={46} className="animate-bounce" />}
                    {cat.iconType === 'palette' && <PixelDesignIcon size={46} className="animate-bounce" />}
                    {cat.iconType === 'wrench' && <PixelWorkshopIcon size={46} className="animate-bounce" />}
                    {cat.iconType === 'music' && <PixelCulturalIcon size={46} className="animate-bounce" />}
                  </div>

                  {/* Golden Question Mark Block (3D Metallic Bevels & Screws) */}
                  <div className="relative w-16 h-16 sm:w-22 sm:h-22 rounded-xl bg-gradient-to-b from-[#fef08a] via-[#eab308] to-[#92400e] border-3 sm:border-4 border-[#78350f] shadow-[inset_4px_4px_0_#ffffff,inset_-4px_-4px_0_#78350f,0_8px_0_#451a03,0_12px_20px_rgba(0,0,0,0.6)] flex items-center justify-center group-hover:brightness-110 transition-all">
                    {/* 4 Corner Rivet Screws */}
                    <span className="absolute top-1.5 left-1.5 w-2 h-2 rounded-full bg-[#78350f] shadow-[inset_1px_1px_0_#451a03]" />
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#78350f] shadow-[inset_1px_1px_0_#451a03]" />
                    <span className="absolute bottom-1.5 left-1.5 w-2 h-2 rounded-full bg-[#78350f] shadow-[inset_1px_1px_0_#451a03]" />
                    <span className="absolute bottom-1.5 right-1.5 w-2 h-2 rounded-full bg-[#78350f] shadow-[inset_1px_1px_0_#451a03]" />
                    
                    {/* Bold Question Mark with Embossed 16-Bit Relief */}
                    <span className="text-3xl sm:text-5xl font-black text-[#582c03] drop-shadow-[2px_3px_0_#fef08a] select-none">
                      ?
                    </span>
                  </div>

                  {/* Wood Plaque with Category Number & Name */}
                  <div className="w-full mt-2.5 py-1.5 px-1 rounded-lg bg-gradient-to-b from-[#92400e] to-[#78350f] border-2 border-[#451a03] shadow-[0_4px_0_#270e02] flex flex-col items-center">
                    <span className="text-[8px] text-yellow-300 font-bold tracking-widest">{cat.number}</span>
                    <span className="text-[8px] sm:text-[10px] text-white font-black truncate w-full text-center tracking-tight">
                      {cat.name}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* ------------------------------------------------------------- */}
      {/* TERRAIN: AUTHENTIC WARP PIPE, HERO-SIZED MARIO, BRICK SOIL     */}
      {/* ------------------------------------------------------------- */}
      <div className="relative z-20 w-full shrink-0">
        
        {/* Surface Layer: Green Warp Pipe, Bold Hero Mario, Signpost */}
        <div className="relative w-full h-24 sm:h-28 px-6 sm:px-10 flex items-end justify-between">
          
          {/* Green Glossy Nintendo Warp Pipe */}
          <div className="w-20 sm:w-26 h-20 sm:h-24 bg-gradient-to-r from-emerald-600 via-green-400 to-emerald-700 border-4 border-emerald-950 rounded-t-2xl shadow-[0_8px_16px_rgba(0,0,0,0.6)] flex flex-col items-center relative z-10">
            <div className="w-full h-5 sm:h-6 bg-gradient-to-r from-emerald-400 via-green-300 to-emerald-600 border-b-3 border-emerald-950 rounded-t-xl" />
          </div>

          {/* Authentic 16-Bit Super Mario World Sprite (HERO SIZE - Bold & Prominent!) */}
          <div className="absolute left-28 sm:left-40 bottom-1.5 z-20 flex flex-col items-center">
            {/* Ground Shadow */}
            <div className="w-16 h-4 bg-black/45 rounded-full blur-[2px] absolute -bottom-1" />
            
            {/* Mario Sprite */}
            <div className="animate-bounce" style={{ animationDuration: '0.9s' }}>
              <SuperMarioSprite size={80} />
            </div>
          </div>

          {/* Right Side: Wooden signpost "ALL 18 EVENTS ➔" */}
          <button
            onClick={onOpenFullDirectory}
            className="px-4 sm:px-6 py-2.5 rounded-xl bg-gradient-to-b from-[#b45309] to-[#78350f] hover:from-[#d97706] hover:to-[#92400e] border-3 border-[#451a03] text-yellow-300 text-xs sm:text-sm font-black shadow-[0_5px_0_#290f02,0_8px_15px_rgba(0,0,0,0.5)] active:translate-y-1 cursor-pointer flex items-center gap-2.5 z-20 transition-transform hover:scale-105"
          >
            <span>ALL 18 EVENTS</span>
            <span>➔</span>
          </button>
        </div>

        {/* Lush Green Grass Strip with Flowers */}
        <div className="relative w-full h-5 bg-gradient-to-r from-green-500 via-emerald-400 to-green-600 border-t-3 border-green-300 shadow">
          <div className="absolute inset-0 flex items-center justify-around text-xs pointer-events-none">
            <span>🌸</span>
            <span>🌼</span>
            <span>🌺</span>
            <span>🌼</span>
            <span>🌸</span>
            <span>🌼</span>
            <span>🌸</span>
            <span>🌺</span>
          </div>
        </div>
        
        {/* Authentic Super Mario World Checkered Brick Soil */}
        <div className="w-full h-16 sm:h-20 bg-[#9a3412] border-t-4 border-[#451a03] shadow-inner relative overflow-hidden">
          <div className="w-full h-full opacity-65 bg-[repeating-linear-gradient(90deg,#7c2d12,#7c2d12_28px,#c2410c_28px,#c2410c_56px)]" />
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* 16-BIT ARCADE EVENT DOSSIER / FLASHCARD MODAL                   */}
      {/* ------------------------------------------------------------- */}
      {selectedCategory && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in zoom-in-95 duration-200">
          <div className="relative w-full max-w-2xl bg-gradient-to-b from-[#1c1236] via-[#140b29] to-[#0a0518] rounded-2xl border-4 border-yellow-400 shadow-[0_0_60px_rgba(250,204,21,0.8)] overflow-hidden flex flex-col p-4 sm:p-6">
            
            {/* Header: Yellow Pixel Plaque + Red [X] */}
            <div className="flex items-center justify-between pb-3 border-b-2 border-purple-800/80 mb-3">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded bg-yellow-400 text-black font-pixel text-xs font-black">
                  REALM {selectedCategory.number}
                </span>
                <span className="font-pixel text-sm sm:text-base font-black text-yellow-300 tracking-wider">
                  {selectedCategory.name}
                </span>
              </div>

              <button
                onClick={() => setSelectedCategory(null)}
                className="w-9 h-9 rounded-xl bg-red-600 hover:bg-red-500 text-white border-2 border-white font-pixel text-xs font-black shadow-[0_3px_0_#7f1d1d] flex items-center justify-center cursor-pointer active:translate-y-1"
              >
                ✕
              </button>
            </div>

            {/* Content: Left Pixel Art Graphic on Altar + Right Mission Briefing */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-5 items-center my-2">
              
              {/* Left Column: Big Glowing Pixel Art Display on Stone Altar */}
              <div className="sm:col-span-5 flex flex-col items-center justify-center p-5 rounded-2xl bg-gradient-to-b from-[#251052] to-[#120726] border-2 border-cyan-400 shadow-[0_0_30px_rgba(6,182,212,0.5)]">
                <div className="my-2 filter drop-shadow-[0_0_25px_rgba(6,182,212,0.95)] animate-pulse">
                  {selectedCategory.iconType === 'laptop' && <PixelHackathonIcon size={84} />}
                  {selectedCategory.iconType === 'robot' && <PixelRoboticsIcon size={84} />}
                  {selectedCategory.iconType === 'gamepad' && <PixelGamingIcon size={84} />}
                  {selectedCategory.iconType === 'trophy' && <PixelQuizIcon size={84} />}
                  {selectedCategory.iconType === 'palette' && <PixelDesignIcon size={84} />}
                  {selectedCategory.iconType === 'wrench' && <PixelWorkshopIcon size={84} />}
                  {selectedCategory.iconType === 'music' && <PixelCulturalIcon size={84} />}
                </div>
                {/* Stone Altar Pedestal */}
                <div className="w-32 h-6 bg-zinc-700 border-2 border-zinc-500 rounded-lg shadow-md mt-2 flex items-center justify-center text-[8px] font-pixel text-yellow-300">
                  ★ UNLOCKED ★
                </div>
              </div>

              {/* Right Column: Mission Briefing, Date, Venue, Mission Points */}
              <div className="sm:col-span-7 flex flex-col justify-between space-y-3">
                <div>
                  <h3 className="font-pixel text-sm sm:text-base font-black text-yellow-300 tracking-wider mb-1 drop-shadow">
                    {selectedCategory.headline}
                  </h3>
                  <p className="text-[11px] sm:text-xs text-slate-200 leading-relaxed font-sans font-semibold">
                    {selectedCategory.desc}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2 py-2 border-y border-purple-800 text-[10px] font-pixel text-cyan-300">
                  <div>
                    <span className="block text-yellow-400 text-[8px]">📅 DATE:</span>
                    <span>{selectedCategory.date}</span>
                  </div>
                  <div>
                    <span className="block text-pink-400 text-[8px]">📍 VENUE:</span>
                    <span className="truncate block">{selectedCategory.venue}</span>
                  </div>
                </div>

                {/* Mission Objectives */}
                <div>
                  <span className="text-[9px] font-pixel text-yellow-300 block mb-1">
                    KEY HIGHLIGHTS:
                  </span>
                  <ul className="space-y-1 text-[9px] font-pixel text-slate-300">
                    {selectedCategory.missions.map((m, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <span className="text-yellow-400">★</span>
                        <span>{m}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Matching Events in this Category */}
                {selectedCategory.matchingEvents.length > 0 && (
                  <div>
                    <span className="text-[8px] font-pixel text-cyan-400 block mb-1">
                      EVENTS IN THIS REALM:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedCategory.matchingEvents.slice(0, 3).map((ev) => (
                        <button
                          key={ev.id}
                          onClick={() => {
                            if (onSelectEvent) onSelectEvent(ev);
                          }}
                          className="px-2 py-1 rounded bg-purple-900/80 hover:bg-purple-700 border border-purple-400 text-white font-pixel text-[8px] cursor-pointer"
                        >
                          {ev.title} ➔
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Big Yellow Pixel Action Button: START MISSION */}
                <div className="pt-2 flex flex-col gap-2">
                  <button
                    onClick={() => {
                      soundEngine.playFanfare();
                      if (selectedCategory.matchingEvents.length > 0 && onSelectEvent) {
                        onSelectEvent(selectedCategory.matchingEvents[0]);
                      } else {
                        onOpenFullDirectory();
                      }
                    }}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-500 hover:from-yellow-300 hover:to-amber-400 border-3 border-white text-black font-pixel text-xs sm:text-sm font-black shadow-[0_5px_0_#b45309,0_8px_20px_rgba(250,204,21,0.6)] active:translate-y-1 cursor-pointer flex items-center justify-center gap-2 transition-transform hover:scale-102"
                  >
                    <span>START MISSION & REGISTER</span>
                    <span>➔</span>
                  </button>

                  <button
                    onClick={() => setSelectedCategory(null)}
                    className="text-[9px] text-zinc-400 hover:text-white font-pixel text-center cursor-pointer transition-colors"
                  >
                    ← BACK TO REALMS
                  </button>
                </div>

              </div>

            </div>

          </div>
        </div>
      )}

    </div>
  );
}

// -------------------------------------------------------------
// AUTHENTIC SUPER MARIO FULL SPRITE
// -------------------------------------------------------------
function MarioFullSprite() {
  return (
    <svg width="42" height="48" viewBox="0 0 24 30" className="filter drop-shadow-[0_4px_6px_rgba(0,0,0,0.6)]">
      <rect x="6" y="2" width="12" height="4" fill="#dc2626" />
      <rect x="4" y="4" width="16" height="3" fill="#dc2626" />
      <rect x="6" y="7" width="10" height="5" fill="#fde047" />
      <rect x="14" y="8" width="4" height="3" fill="#fde047" />
      <rect x="12" y="8" width="2" height="2" fill="#000000" />
      <rect x="6" y="9" width="3" height="4" fill="#582c03" />
      <rect x="11" y="10" width="7" height="2" fill="#582c03" />
      <rect x="7" y="13" width="10" height="6" fill="#dc2626" />
      <rect x="8" y="15" width="8" height="7" fill="#2563eb" />
      <circle cx="10" cy="17" r="1" fill="#facc15" />
      <circle cx="14" cy="17" r="1" fill="#facc15" />
      <circle cx="6" cy="18" r="2.5" fill="#ffffff" />
      <circle cx="18" cy="18" r="2.5" fill="#ffffff" />
      <rect x="6" y="23" width="5" height="4" rx="1.5" fill="#582c03" />
      <rect x="13" y="23" width="5" height="4" rx="1.5" fill="#582c03" />
    </svg>
  );
}
