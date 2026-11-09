import React, { useState, useEffect } from 'react';
import { 
  X, Bot, Compass, List, Trophy, Sparkles, HelpCircle, 
  ArrowRight, ShieldCheck, Gamepad2, Zap, Flame, Code 
} from 'lucide-react';
import { soundEngine } from '../../game/systems/SoundEngine';
import { eventBus } from '../../game/EventBus';

export function KotaBotModal({ 
  currentZone = 'Starting Kingdom', 
  onOpenMap, 
  onOpenDirectory, 
  onOpenAchievements, 
  onClose 
}) {
  const [selectedTopic, setSelectedTopic] = useState('welcome');

  // Pause gameplay while dialogue is open; resume upon closing
  useEffect(() => {
    eventBus.emit('game-paused', true);
    return () => {
      eventBus.emit('game-paused', false);
    };
  }, []);

  // Format zone name cleanly
  const safeZone = String(currentZone || 'Starting Kingdom');
  const displayZone = safeZone
    .replace('Scene', '')
    .replace(/([A-Z])/g, ' $1')
    .trim()
    .toUpperCase();

  const topics = [
    {
      id: 'welcome',
      icon: '👋',
      label: 'WELCOME',
      badge: 'CONCIERGE',
      title: `Welcome to ${displayZone}!`,
      content: `Greetings Explorer! I am Kota Bot, your intelligent in-game guide for REVERIE 2K27, the flagship annual techno-cultural festival of Indian Institute of Information Technology Kota.\n\nWhether you're looking for competitive programming challenges, esports tournaments, live band concerts, or secret easter eggs, I'm here to navigate you through the Pixelverse!`,
      actionLabel: 'EXPLORE WORLD MAP',
      actionIcon: Compass,
      onAction: () => {
        onClose();
        if (onOpenMap) onOpenMap();
      }
    },
    {
      id: 'how_to_play',
      icon: '🕹️',
      label: 'HOW DO I PLAY?',
      badge: 'TUTORIAL',
      title: 'Movement & Platforming Guide',
      content: `Here are your core platforming controls:\n\n• RUN: Press [A] & [D] (or Left & Right arrow keys).\n• SUPER-JUMP: Press [W] or [Spacebar]. Hold the key longer for extra height to leap onto elevated platforms!\n• SPRING MUSHROOMS: Jump on top of purple mushroom caps while holding jump to rocket upward!\n• QUESTION BLOCKS [?]: Jump and bump them with your head to pop glowing REVERIE gold coins!\n• WARP PIPES & KIOSKS: Stand near and press [E] to warp to other kingdoms or inspect competitions!`,
      actionLabel: 'TEST CONTROLS IN-WORLD',
      actionIcon: Gamepad2,
      onAction: () => {
        soundEngine.playJump();
        onClose();
      }
    },
    {
      id: 'explore_kingdoms',
      icon: '🗺️',
      label: 'EXPLORE KINGDOMS',
      badge: 'TERRITORIES',
      title: '5 Interconnected Festival Worlds',
      content: `The Pixelverse is divided into five massive thematic kingdoms:\n\n1. STARTING KINGDOM: Campus gateway, IIIT Kota Tower, Avatar Wardrobe, and tutorial hub.\n2. TECH KINGDOM: Cyberpunk neon metropolis hosting 7 technical competitions & hack challenges.\n3. CULTURE KINGDOM: Electric concert amphitheater hosting 7 cultural events & performances.\n4. FLAGSHIP ZONE: Massive arcade hall with HackTheChain, Carnival, Pronite DJ Night & Faculty Fumble.\n5. FESTIVAL PLAZA: Information forum with impact statistics, past sponsors & secretariat.`,
      actionLabel: 'LAUNCH INTERACTIVE MAP',
      actionIcon: Compass,
      onAction: () => {
        onClose();
        if (onOpenMap) onOpenMap();
      }
    },
    {
      id: 'tech_events',
      icon: '💻',
      label: 'TECHNICAL EVENTS',
      badge: '7 EVENTS',
      title: 'Technical Showdowns & Hackathons',
      content: `Looking for engineering & coding competitions? Tech Kingdom features:\n\n• DSA SPRINT: High-intensity data structures & algorithmic speed sprint.\n• BYTE-BREAK: Tech-themed escape room & debugging riddle challenge.\n• ENDEAVOUR: Software development & problem-solving programming contest.\n• TRADEX: Live stock & cryptocurrency market simulation trading arena.\n• SUMMIT LEAGUE: Multi-title esports gaming battle.\n• DESIGNX: UI/UX, product design & digital art designathon.\n• ROBO SOCCER: High-torque wireless robotic football tournament!`,
      actionLabel: 'BROWSE TECH EVENTS (7)',
      actionIcon: Code,
      onAction: () => {
        onClose();
        if (onOpenDirectory) onOpenDirectory('technical');
      }
    },
    {
      id: 'culture_events',
      icon: '🎭',
      label: 'CULTURAL EVENTS',
      badge: '7 EVENTS',
      title: 'Music, Fashion & Showdowns',
      content: `Ready for electrifying cultural stages? Culture Kingdom features:\n\n• AMONG US: Real-life social deduction & sabotage strategy.\n• BAND NIGHT: Battle of the college acoustic and rock musical bands.\n• SQUID GAME: High-stakes survival agility & elimination trials.\n• CONCERT NIGHT: Strobe-lit live band live performance.\n• FASHION SHOW: Runway style & avant-garde costume walk.\n• DANCE BATTLE: Solo & squad street dance showdown.\n• BOTANICAL BID: Live strategic resource auction & bidding game.`,
      actionLabel: 'BROWSE CULTURAL EVENTS (7)',
      actionIcon: Flame,
      onAction: () => {
        onClose();
        if (onOpenDirectory) onOpenDirectory('cultural');
      }
    },
    {
      id: 'how_to_register',
      icon: '📝',
      label: 'HOW DO I REGISTER?',
      badge: 'UNSTOP',
      title: 'Registration & Eligibility Guidelines',
      content: `Registration is open to all enrolled college and university students across India:\n\n1. Open any event page from the in-game terminals or Event Directory.\n2. Click the bright [REGISTER NOW] button to access the official portal on Unstop.\n3. Both solo participants and cross-college teams are permitted.\n4. All registered attendees receive official certificates of participation and access to festival workshops!`,
      actionLabel: 'OPEN REGISTRATION DIRECTORY',
      actionIcon: List,
      onAction: () => {
        onClose();
        if (onOpenDirectory) onOpenDirectory();
      }
    },
    {
      id: 'show_map',
      icon: '⚡',
      label: 'SHOW WORLD MAP',
      badge: 'TELEPORT',
      title: 'Warp Pipe Travel Network',
      content: `Don't want to walk across the whole terrain? Use the Interactive World Map to fast-travel instantly!\n\n• Yellow Pipe: Starting Kingdom\n• Green Pipe: Tech Kingdom\n• Pink Pipe: Culture Kingdom\n• Purple Pipe: Flagship Zone\n• White Pipe: Festival Plaza\n\nYou can also click the MAP button in the top navigation at any time!`,
      actionLabel: 'OPEN WARP NETWORK',
      actionIcon: Zap,
      onAction: () => {
        onClose();
        if (onOpenMap) onOpenMap();
      }
    },
    {
      id: 'quests_info',
      icon: '🏆',
      label: 'QUEST SYSTEM',
      badge: 'REWARDS',
      title: 'Missions & Cosmic Armor Unlock',
      content: `Track your adventure with 6 festival quests:\n\n1. EXPLORER: Visit all 5 kingdoms.\n2. EVENT HUNTER: Inspect 10+ competitions.\n3. COIN COLLECTOR: Collect 25 gold coins.\n4. KINGDOM MASTER: Explore all kingdoms & gather 15 coins.\n5. FESTIVAL EXPLORER: Inspect stats, sponsors & past glimpses.\n6. SECRET FINDER: Discover the hidden golden pipe past the Starting Kingdom flagpole!\n\nCompleting quests unlocks the exclusive REVERIE Special Edition cosmic skin!`,
      actionLabel: 'OPEN QUEST LOG',
      actionIcon: Trophy,
      onAction: () => {
        onClose();
        if (onOpenAchievements) onOpenAchievements();
      }
    }
  ];

  const activeTopic = topics.find(t => t.id === selectedTopic) || topics[0];
  const ActionIcon = activeTopic.actionIcon || ArrowRight;

  const handleSelectTopic = (id) => {
    soundEngine.playTypewriter();
    setSelectedTopic(id);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-fadeIn select-none">
      <div className="relative w-full max-w-4xl max-h-[92vh] flex flex-col bg-[#0b061a] border-2 border-cyan-400 rounded-3xl shadow-2xl shadow-cyan-500/25 overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-purple-900/60 bg-gradient-to-r from-[#140b2e] via-[#0d0720] to-[#140b2e]">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-cyan-950/90 border-2 border-cyan-400 flex items-center justify-center p-1.5 shadow-lg shadow-cyan-500/30">
              <img 
                src="/assets/sprites/mascot_npc.png" 
                alt="Kota Bot" 
                className="w-8 h-8 object-contain image-rendering-pixelated animate-bounce"
                style={{ imageRendering: 'pixelated' }}
              />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="font-display text-lg sm:text-2xl text-cyan-300 font-black tracking-wider uppercase">
                  KOTA BOT COMPANION
                </h2>
                <span className="font-display text-[10px] bg-cyan-400 text-slate-950 font-black px-2.5 py-0.5 rounded-full">
                  AI GUIDE ONLINE
                </span>
              </div>
              <p className="font-body text-xs sm:text-sm text-purple-200 font-semibold tracking-wider uppercase mt-0.5">
                LOCATION: {displayZone} • IIIT KOTA
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

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 flex flex-col md:flex-row gap-5">
          {/* Topic Navigation Sidebar */}
          <div className="flex md:flex-col gap-2 overflow-x-auto md:overflow-visible md:w-64 shrink-0 pb-1 md:pb-0">
            {topics.map(t => {
              const isSelected = selectedTopic === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => handleSelectTopic(t.id)}
                  className={`px-3.5 py-2.5 rounded-xl font-display text-xs text-left shrink-0 transition-all flex items-center justify-between gap-2 cursor-pointer ${
                    isSelected
                      ? 'bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/30 font-black scale-[1.02]'
                      : 'bg-[#150d30] hover:bg-purple-900/60 text-slate-300 border border-purple-800/50'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-base">{t.icon}</span>
                    <span className="truncate">{t.label}</span>
                  </div>
                  <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold ${
                    isSelected ? 'bg-slate-950 text-cyan-300' : 'bg-slate-900 text-slate-400'
                  }`}>
                    {t.badge}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Dialogue Speech Panel with Working Action */}
          <div className="flex-1 flex flex-col justify-between p-5 sm:p-6 rounded-2xl bg-[#100724] border-2 border-cyan-500/40 min-h-[300px] shadow-xl">
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-purple-900/50 pb-3">
                <div className="flex items-center gap-2 text-xs font-display text-yellow-400 font-bold uppercase tracking-wider">
                  <Sparkles size={16} className="text-yellow-400" />
                  <span className="text-sm font-black">{activeTopic.title}</span>
                </div>
                <span className="font-display text-[10px] bg-purple-950 text-purple-300 px-2 py-0.5 rounded border border-purple-800 uppercase font-bold">
                  {activeTopic.badge}
                </span>
              </div>

              <div className="font-body text-sm sm:text-base text-slate-200 font-medium leading-relaxed whitespace-pre-line max-w-2xl">
                {activeTopic.content}
              </div>
            </div>

            {/* Real Working Action Button for Selected Topic */}
            <div className="pt-5 mt-5 border-t border-purple-900/50 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <div className="text-xs text-slate-400 font-body">
                Selected: <span className="text-cyan-300 font-semibold">{activeTopic.label}</span>
              </div>

              <button
                onClick={() => {
                  soundEngine.playSelect();
                  activeTopic.onAction();
                }}
                className="px-5 py-3 rounded-xl bg-gradient-to-r from-cyan-500 via-teal-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-slate-950 font-display text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20 active:scale-95 transition-all cursor-pointer"
              >
                <ActionIcon size={16} />
                <span>{activeTopic.actionLabel}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-purple-900/60 bg-[#0d0720] flex items-center justify-between">
          <span className="font-body text-xs text-purple-300 font-medium hidden sm:inline">
            Press [ESC] or click outside to return to the world at any time.
          </span>
          <button
            onClick={() => {
              soundEngine.playBlip();
              onClose();
            }}
            className="px-6 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-display text-xs font-bold tracking-wider cursor-pointer ml-auto"
          >
            RESUME GAMEPLAY
          </button>
        </div>

      </div>
    </div>
  );
}
