import React, { useState, useEffect } from 'react';
import { Sparkles, MessageSquare, ChevronRight, Award, HelpCircle, CheckCircle2 } from 'lucide-react';
import { soundEngine } from '../../game/systems/SoundEngine';
import { achievementSystem } from '../../game/systems/AchievementSystem';

const FAQ_ITEMS = [
  {
    id: 1,
    question: 'WHAT IS REVERIE 2K27?',
    answer: 'Greetings Traveler! REVERIE 2K27 is the annual flagship techno-cultural festival of IIIT Kota. It is an immersive 3-day convergence of 18 premier competitions, national hackathons, robotic wars, cultural spectacles, and star pronites uniting 3,000+ collegiate innovators.'
  },
  {
    id: 2,
    question: 'HOW DO I REGISTER FOR EVENTS?',
    answer: 'Direct your parchment to Unstop! All flagship hackathons, coding contests, robo wars, and quizzes have active portals on Unstop. Simply select an event card in the Pixelverse or Event Directory to launch the direct registration link.'
  },
  {
    id: 3,
    question: 'IS THERE AN ENTRY TICKET OR REGISTRATION FEE?',
    answer: 'General campus entry to the festival zones and spectator exhibitions is FREE for verified students with valid college ID. Specific competitive tournaments (like HackTheChain or Esports) have dedicated team slot allocations on Unstop.'
  },
  {
    id: 4,
    question: 'WHERE IS THE VENUE & HOW TO REACH?',
    answer: 'The mystical grounds are located at Indian Institute of Information Technology Kota (IIIT Kota Permanent Campus), Ranpur, Kota, Rajasthan - 325003. Shuttle connections and transit assistance run from Kota Junction Railway Station.'
  },
  {
    id: 5,
    question: 'CAN STUDENTS FROM ANY COLLEGE PARTICIPATE?',
    answer: 'Aye! Reverie welcomes undergraduate and postgraduate students from all recognized universities, colleges, and technical institutes across India. Inter-college teams are permitted for select hackathons and esports tournaments.'
  },
  {
    id: 6,
    question: 'WHAT ARE THE TOTAL CASH PRIZES & REWARDS?',
    answer: 'A treasure hoard exceeding ₹2,50,000+ in hard cash bounties, developer grants, trophy shields, official certificates of excellence, and sponsor swag awaits the champions of the 5 kingdoms!'
  },
  {
    id: 7,
    question: 'HOW DO I CONTACT THE ORGANIZING COMMITTEE?',
    answer: 'Reach out to the TechKnow Council and Reverie Secretariat! Connect with Student Convenor Shivang Singh (82798 16830), Virag Jain (63760 69193), or dispatch an electronic raven to reverie@iiitkota.ac.in.'
  }
];

export function RpgFaqSanctuary({ onAdvanceStage }) {
  const [activeQuestionId, setActiveQuestionId] = useState(1);
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [exploredIds, setExploredIds] = useState(new Set([1]));

  const currentFaq = FAQ_ITEMS.find(f => f.id === activeQuestionId) || FAQ_ITEMS[0];

  // Typewriter effect
  useEffect(() => {
    setDisplayedText('');
    setIsTyping(true);
    let index = 0;
    const fullText = currentFaq.answer;

    const timer = setInterval(() => {
      index++;
      if (index <= fullText.length) {
        setDisplayedText(fullText.slice(0, index));
        if (index % 5 === 0) {
          soundEngine.playBlip();
        }
      } else {
        setIsTyping(false);
        clearInterval(timer);
      }
    }, 18);

    return () => clearInterval(timer);
  }, [activeQuestionId]);

  const selectQuestion = (id) => {
    soundEngine.playBlip();
    setActiveQuestionId(id);
    setExploredIds(prev => new Set([...prev, id]));
    achievementSystem.recordCoinReward(5);
  };

  const nextQuestion = () => {
    const nextId = activeQuestionId >= FAQ_ITEMS.length ? 1 : activeQuestionId + 1;
    selectQuestion(nextId);
  };

  return (
    <div className="relative w-full h-full flex flex-col justify-between p-2 sm:p-4 bg-gradient-to-b from-[#140828] via-[#0d051d] to-[#070210] text-white select-none overflow-y-auto">
      
      {/* Top Title Bar (Matching Reference 22.11.18.jpeg) */}
      <div className="flex items-center justify-between gap-2 px-3 py-1.5 rounded-xl bg-[#1d0b38] border border-purple-500/60 shadow-md">
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 rounded-md bg-purple-600 text-white font-display text-[10px] font-black tracking-widest">
            STAGE 04
          </span>
          <h2 className="font-display text-xs sm:text-sm font-black text-white tracking-wider">
            SAGE'S SANCTUARY: FESTIVAL FAQS
          </h2>
        </div>

        <div className="flex items-center gap-2">
          <span className="font-mono text-[10px] text-yellow-300 font-bold">
            EXPLORED: {exploredIds.size} / {FAQ_ITEMS.length}
          </span>
        </div>
      </div>

      {/* Main Sanctuary Chamber: Wizard on Left, Questions on Right */}
      <div className="flex-1 my-2 grid grid-cols-1 md:grid-cols-12 gap-3 items-center max-w-4xl mx-auto w-full">
        
        {/* Left Column: Pixel Wizard / Game Master */}
        <div className="md:col-span-5 flex flex-col items-center justify-center p-3 rounded-2xl bg-gradient-to-b from-[#230d45] to-[#120626] border-2 border-purple-400/60 shadow-lg relative overflow-hidden">
          
          {/* Pulsing magic ambient background */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-cyan-500/20 via-transparent to-transparent pointer-events-none animate-pulse" />

          {/* Wizard Graphic & Orb */}
          <div className="relative w-36 h-40 flex items-center justify-center my-1">
            {/* Pulsing Glowing Crystal Orb on Staff */}
            <div className="absolute top-2 right-4 w-7 h-7 rounded-full bg-cyan-400 shadow-[0_0_25px_#22d3ee] animate-ping opacity-75" />
            <div className="absolute top-2 right-4 w-7 h-7 rounded-full bg-cyan-300 shadow-[0_0_20px_#22d3ee] flex items-center justify-center">
              <Sparkles size={14} className="text-white animate-spin" />
            </div>

            {/* Wooden Staff */}
            <div className="absolute top-6 right-7 w-1.5 h-32 bg-amber-800 rounded-sm shadow-md" />

            {/* Wizard Avatar */}
            <div className="text-6xl filter drop-shadow-[0_0_15px_rgba(168,85,247,0.7)] animate-bounce" style={{ animationDuration: '3s' }}>
              🧙‍♂️
            </div>
          </div>

          <div className="text-center mt-1">
            <span className="font-display text-sm font-black text-purple-200 tracking-wider block">
              THE GRAND SAGE
            </span>
            <span className="font-mono text-[9px] text-cyan-300 uppercase font-bold">
              KEEPER OF REVERIE LORE
            </span>
          </div>
        </div>

        {/* Right Column: Question Selection Menu */}
        <div className="md:col-span-7 flex flex-col justify-between space-y-1.5">
          <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-[#1c0b38] border border-purple-500/40">
            <HelpCircle size={14} className="text-yellow-400" />
            <span className="font-display text-[10px] sm:text-xs font-black text-yellow-300 tracking-wider uppercase">
              SELECT A QUESTION TO CONSULT THE SAGE:
            </span>
          </div>

          <div className="space-y-1 max-h-52 overflow-y-auto pr-1">
            {FAQ_ITEMS.map((faq) => {
              const isSelected = activeQuestionId === faq.id;
              const isExplored = exploredIds.has(faq.id);

              return (
                <button
                  key={faq.id}
                  onClick={() => selectQuestion(faq.id)}
                  className={`w-full text-left p-2 rounded-xl transition-all flex items-center justify-between gap-2 cursor-pointer border ${
                    isSelected
                      ? 'bg-gradient-to-r from-purple-800 to-indigo-900 border-cyan-400 text-white shadow-[0_0_15px_rgba(6,182,212,0.4)] scale-101'
                      : 'bg-[#15072c] border-purple-900/60 text-purple-200/90 hover:bg-[#200c3f] hover:border-purple-500'
                  }`}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="font-mono text-[10px] text-cyan-400 font-bold shrink-0">
                      #{faq.id}
                    </span>
                    <span className="font-display text-[10px] sm:text-[11px] font-bold truncate">
                      {faq.question}
                    </span>
                  </div>

                  {isExplored && (
                    <CheckCircle2 size={12} className="text-emerald-400 shrink-0" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Bottom RPG Typewriter Speech Bubble Box (Matching Reference 22.11.18.jpeg) */}
      <div className="relative max-w-4xl w-full mx-auto rounded-2xl bg-gradient-to-b from-[#1c0b38] via-[#120626] to-[#0a0316] border-2 border-purple-400/80 p-3 sm:p-4 shadow-2xl flex flex-col justify-between">
        
        {/* Speaker Name Tag */}
        <div className="flex items-center justify-between border-b border-purple-800 pb-1.5 mb-2">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-pink-950 border border-pink-400 text-pink-300 font-display text-[10px] font-black tracking-widest uppercase">
              SPEECH: GAME MASTER
            </span>
            <span className="font-mono text-[10px] text-yellow-300 font-bold">
              TOPIC #{activeQuestionId}
            </span>
          </div>

          {isTyping && (
            <span className="font-mono text-[9px] text-cyan-300 animate-pulse font-bold">
              ✦ SAGE IS SPEAKING...
            </span>
          )}
        </div>

        {/* Typewriter Text Content */}
        <p className="text-xs sm:text-sm text-slate-100 font-mono leading-relaxed min-h-[48px]">
          "{displayedText}"
          {isTyping && <span className="inline-block w-1.5 h-3 bg-cyan-400 ml-1 animate-pulse" />}
        </p>

        {/* Navigation Action Buttons */}
        <div className="flex items-center justify-between pt-2 border-t border-purple-800/80 mt-2">
          <button
            onClick={nextQuestion}
            className="px-3 py-1.5 rounded-lg bg-purple-900 hover:bg-purple-800 text-purple-200 border border-purple-400 font-display text-xs font-bold tracking-wider uppercase flex items-center gap-1 cursor-pointer"
          >
            <span>NEXT QUESTION</span>
            <ChevronRight size={14} />
          </button>

          <button
            onClick={onAdvanceStage}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-display text-xs font-black tracking-widest uppercase border-2 border-emerald-300 shadow-[0_4px_0_#065f46,0_0_15px_rgba(16,185,129,0.5)] hover:scale-105 active:scale-95 cursor-pointer flex items-center gap-1.5"
          >
            <span>STAGE 05: CLAIM VICTORY 🏰</span>
          </button>
        </div>
      </div>
    </div>
  );
}
