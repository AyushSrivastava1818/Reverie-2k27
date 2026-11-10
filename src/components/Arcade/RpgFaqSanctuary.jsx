import React, { useState, useEffect } from 'react';
import { soundEngine } from '../../game/systems/SoundEngine';

const RPG_FAQS = [
  {
    id: 1,
    question: "WHAT IS REVERIE 2K27?",
    answer: "REVERIE 2K27 is the annual flagship techno-cultural festival of IIIT Kota! An immersive convergence of 18 premier competitions, national hackathons, robotic wars, cultural spectacles and star pronites uniting collegiate innovators nationwide."
  },
  {
    id: 2,
    question: "HOW DO I REGISTER?",
    answer: "Direct your parchment to Unstop! All flagship hackathons, coding contests, robo wars, and quizzes have active portals on Unstop. Simply select any event card in the Pixelverse to open its registration portal."
  },
  {
    id: 3,
    question: "IS THERE A TICKET?",
    answer: "General campus entry to festival exhibitions and spectator zones is 100% FREE for all verified students with valid college ID. Specific tournament slots (such as HackTheChain) have team registration allocations on Unstop."
  },
  {
    id: 4,
    question: "WHERE IS THE VENUE?",
    answer: "The mystical festival grounds are located at Indian Institute of Information Technology Kota (IIIT Kota Permanent Campus), Ranpur, Kota, Rajasthan - 325003. Transit assistance is coordinated from Kota Junction Railway Station."
  },
  {
    id: 5,
    question: "WHAT ARE THE CASH PRIZES?",
    answer: "A treasure hoard exceeding ₹2,50,000+ in cash bounties, developer grants, trophy shields, certificates of excellence, and sponsor swag awaits champions across all 5 living kingdoms!"
  }
];

export function RpgFaqSanctuary({ onAdvanceStage, onClose, onBackToMap }) {
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);
  const [displayedAnswer, setDisplayedAnswer] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const currentFaq = RPG_FAQS[activeQuestionIndex] || RPG_FAQS[0];

  useEffect(() => {
    setDisplayedAnswer('');
    setIsTyping(true);
    let index = 0;
    const text = currentFaq.answer;

    const timer = setInterval(() => {
      index++;
      if (index <= text.length) {
        setDisplayedAnswer(text.slice(0, index));
        if (index % 4 === 0) soundEngine.playBlip();
      } else {
        setIsTyping(false);
        clearInterval(timer);
      }
    }, 18);

    return () => clearInterval(timer);
  }, [activeQuestionIndex]);

  const selectQuestion = (index) => {
    soundEngine.playBlip();
    setActiveQuestionIndex(index);
  };

  const handleNextQuestion = () => {
    soundEngine.playBlip();
    setActiveQuestionIndex(i => (i + 1) % RPG_FAQS.length);
  };

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-between p-3 sm:p-6 bg-gradient-to-b from-[#140828] via-[#0d051c] to-[#06020e] font-pixel text-white select-none overflow-y-auto">
      
      {/* ------------------------------------------------------------- */}
      {/* HUGE 3D PIXEL HEADLINE: FAQ (Ref: 22.11.18.jpeg)              */}
      {/* ------------------------------------------------------------- */}
      <div className="flex items-center justify-between w-full max-w-4xl pt-1 pb-2 shrink-0">
        <div>
          {onBackToMap && (
            <button
              onClick={onBackToMap}
              className="px-3 py-1.5 rounded-xl bg-purple-950 border border-purple-400 text-yellow-300 text-[8px] sm:text-[9px] font-black cursor-pointer hover:bg-purple-900"
            >
              ← WORLD MAP
            </button>
          )}
        </div>
        <h1 className="font-pixel text-5xl sm:text-7xl font-black text-[#22d3ee] tracking-widest drop-shadow-[5px_5px_0_#7c3aed]">
          FAQ
        </h1>
        {onClose ? (
          <button
            onClick={onClose}
            className="px-3 py-1.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-[9px] font-black cursor-pointer"
          >
            ✕
          </button>
        ) : <div className="w-10" />}
      </div>

      {/* ------------------------------------------------------------- */}
      {/* ORNATE GOLDEN PIXEL RPG DIALOGUE FRAME (Ref: 22.11.18.jpeg)    */}
      {/* ------------------------------------------------------------- */}
      <div className="relative w-full max-w-4xl bg-[#170a2c] rounded-2xl border-4 border-[#f59e0b] shadow-[0_0_50px_rgba(245,158,11,0.6)] p-5 sm:p-7 flex flex-col justify-between my-auto">
        
        {/* Top Half: Wizard (Left) & Question Menu (Right) */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-center mb-5">
          
          {/* Left: Game Master Pixel Wizard with Glowing Staff */}
          <div className="sm:col-span-5 flex flex-col items-center justify-center p-4 rounded-2xl bg-[#230f42] border-3 border-[#fbbf24] shadow-inner">
            {/* Title Badge: GAME MASTER */}
            <div className="px-4 py-1.5 rounded-md bg-[#2e1065] border-2 border-pink-400 text-pink-300 text-[10px] font-black tracking-widest uppercase mb-3 shadow-[0_0_10px_rgba(244,114,182,0.5)]">
              GAME MASTER
            </div>

            {/* Pixel Wizard Character (Authentic 16-bit RPG Sprite) */}
            <div className="relative w-36 h-40 flex items-center justify-center">
              <svg width="100" height="120" viewBox="0 0 54 66" className="filter drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)]">
                {/* Magic Staff with glowing Cyan Orb */}
                <rect x="7" y="10" width="3" height="52" rx="1.5" fill="#78350f" stroke="#451a03" strokeWidth="0.5" />
                <circle cx="8.5" cy="8" r="6" fill="#22d3ee" className="animate-pulse" />
                <circle cx="8.5" cy="8" r="3" fill="#ffffff" />
                <circle cx="8.5" cy="8" r="9" fill="none" stroke="#67e8f9" strokeWidth="1" strokeDasharray="3,3" className="animate-spin" />

                {/* Sorcerer Pointed Hood */}
                <polygon points="18,22 32,2 42,24" fill="#581c87" stroke="#3b0764" strokeWidth="1" />
                <polygon points="26,6 30,2 34,7" fill="#6b21a8" />
                <path d="M 17 22 Q 30 18 43 22 L 41 26 Q 30 22 19 26 Z" fill="#9333ea" />

                {/* Face & Eyes */}
                <rect x="23" y="22" width="14" height="10" rx="2" fill="#fed7aa" />
                <rect x="25" y="24" width="3" height="2" fill="#1e1b4b" />
                <rect x="32" y="24" width="3" height="2" fill="#1e1b4b" />
                <rect x="29" y="26" width="2" height="3" fill="#fca5a5" />

                {/* Long Flowing White Beard & Mustache */}
                <polygon points="20,28 40,28 35,46 30,50 25,46" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="0.5" />
                <polygon points="22,28 38,28 30,34" fill="#e2e8f0" />

                {/* Royal Robes with Gold Trim */}
                <polygon points="18,34 42,34 48,64 12,64" fill="#4c1d95" stroke="#2e1065" strokeWidth="1" />
                <rect x="28" y="34" width="4" height="30" fill="#facc15" />
                <polygon points="14,36 8,46 16,46" fill="#581c87" />
                <circle cx="10" cy="46" r="3" fill="#fed7aa" />
                <polygon points="44,36 50,46 42,46" fill="#581c87" />
                <circle cx="48" cy="46" r="3" fill="#fed7aa" />
              </svg>
            </div>
          </div>

          {/* Right: Select A Question Menu */}
          <div className="sm:col-span-7 flex flex-col justify-between space-y-2.5">
            <span className="text-xs sm:text-sm text-yellow-300 font-black tracking-wider uppercase mb-1 drop-shadow">
              SELECT A QUESTION:
            </span>

            <div className="space-y-2">
              {RPG_FAQS.map((faq, idx) => {
                const isSelected = activeQuestionIndex === idx;

                return (
                  <div
                    key={faq.id}
                    onClick={() => selectQuestion(idx)}
                    className={`cursor-pointer p-2 rounded-lg transition-all text-[10px] sm:text-[11px] tracking-wider uppercase font-bold flex items-center gap-2 ${
                      isSelected
                        ? 'text-yellow-300 bg-yellow-400/10 border border-yellow-400/60 drop-shadow-[0_0_8px_#facc15]'
                        : 'text-slate-300 hover:text-white hover:translate-x-1'
                    }`}
                  >
                    {isSelected && <span className="text-yellow-400 text-xs">▶</span>}
                    <span className="truncate">{faq.question}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Bottom Half: Typewriter Speech Bubble Box */}
        <div className="relative w-full rounded-xl bg-[#090314] border-3 border-[#fbbf24] p-4 sm:p-5 min-h-[110px] flex flex-col justify-between shadow-inner">
          <p className="text-[11px] sm:text-xs text-slate-100 font-pixel leading-relaxed">
            "{displayedAnswer}"
            {isTyping && <span className="inline-block w-2 h-4 bg-cyan-400 ml-1 animate-pulse" />}
          </p>

          {/* Bouncing down arrow indicator */}
          <div className="self-end text-sm text-yellow-300 animate-bounce mt-2">
            ▼
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* BOTTOM CONSOLE: YELLOW SELECT & PINK NEXT (Ref: 22.11.18.jpeg) */}
      {/* ------------------------------------------------------------- */}
      <div className="flex items-center justify-center gap-5 py-3 shrink-0">
        <button
          onClick={handleNextQuestion}
          className="px-8 py-3 rounded-xl bg-gradient-to-b from-[#facc15] to-[#ca8a04] border-3 border-[#fef08a] text-black font-pixel text-xs sm:text-sm font-black uppercase tracking-widest shadow-[0_5px_0_#78350f] hover:scale-105 active:translate-y-1 active:shadow-none cursor-pointer transition-transform"
        >
          SELECT
        </button>

        <button
          onClick={onAdvanceStage}
          className="px-10 py-3 rounded-xl bg-gradient-to-b from-[#ec4899] to-[#be185d] border-3 border-[#fbcfe8] text-white font-pixel text-xs sm:text-sm font-black uppercase tracking-widest shadow-[0_5px_0_#831843] hover:scale-105 active:translate-y-1 active:shadow-none cursor-pointer transition-transform"
        >
          NEXT
        </button>
      </div>
    </div>
  );
}
