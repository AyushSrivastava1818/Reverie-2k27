// REVERIE 2K27 — Live Festival Schedule & Announcements Data
// Easily editable centralized JavaScript file for fest organizers.

export const festivalAnnouncements = [
  {
    id: 'ann-1',
    badge: 'URGENT',
    color: 'rose',
    title: 'HackTheChain 24H Hackathon',
    message: 'Slot allocations closing soon on Unstop. Check team confirmation emails.',
    time: 'Live Update'
  },
  {
    id: 'ann-2',
    badge: 'PRONITE',
    color: 'amber',
    title: 'Star DJ Night Passes',
    message: 'Visitor wristband verification open at Campus Entrance Gate & Festival Plaza.',
    time: 'Announcement'
  },
  {
    id: 'ann-3',
    badge: 'ESPORTS',
    color: 'cyan',
    title: 'Summit League Fixtures',
    message: 'Round 1 brackets published for BGMI & Valorant. Report to Esports Den.',
    time: 'Brackets Live'
  },
  {
    id: 'ann-4',
    badge: 'ROBOTICS',
    color: 'emerald',
    title: 'Robo Soccer Tech Check',
    message: 'Robot weight and frequency spectrum verification begins at 10:00 AM.',
    time: 'Inspection'
  }
];

export const festivalSchedule = [
  // DAY 1
  {
    id: 'd1-1',
    day: 1,
    time: '09:30 AM - 10:30 AM',
    title: 'Grand Festival Inauguration',
    category: 'flagship',
    venue: 'Main Auditorium, IIIT Kota',
    desc: 'Ceremonial lamp lighting, director address, and unveiling of REVERIE 2K27 Pixelverse.',
    registrationLink: 'https://unstop.com'
  },
  {
    id: 'd1-2',
    day: 1,
    time: '11:00 AM - 01:30 PM',
    title: 'DSA Sprint',
    eventId: 'dsa-sprint',
    category: 'technical',
    venue: 'Online & Lab Arena',
    desc: 'Fast-paced algorithmic programming sprint testing speed and optimization under pressure.',
    registrationLink: 'https://unstop.com/competitions/dsa-sprint-iiitk'
  },
  {
    id: 'd1-3',
    day: 1,
    time: '02:00 PM - 04:00 PM',
    title: 'Botanical Bid',
    eventId: 'botanical-bid',
    category: 'cultural',
    venue: 'Room 102 & Academic Hub',
    desc: 'Strategic resource bidding and auction showdown based on economic risk analysis.',
    registrationLink: 'https://unstop.com/competitions/botanical-bid-iiitk'
  },
  {
    id: 'd1-4',
    day: 1,
    time: '04:30 PM - 06:30 PM',
    title: 'Among Us (In-Person)',
    eventId: 'among-us',
    category: 'cultural',
    venue: 'Open Lawn & Campus Arena',
    desc: 'Real-world social deduction game. Complete mini-tasks, spot sabotages and eject impostors.',
    registrationLink: 'https://unstop.com/competitions/among-us-iiitk'
  },
  {
    id: 'd1-5',
    day: 1,
    time: '07:00 PM - 10:00 PM',
    title: 'Band Night (Battle of Bands)',
    eventId: 'band-night',
    category: 'cultural',
    venue: 'Central Amphitheater',
    desc: 'College bands from across Rajasthan perform high-octane rock, fusion, and indie sets.',
    registrationLink: 'https://unstop.com/competitions/band-night-iiitk'
  },

  // DAY 2
  {
    id: 'd2-1',
    day: 2,
    time: '10:00 AM - 10:00 AM (24H)',
    title: 'HackTheChain Hackathon',
    eventId: 'hackthechain',
    category: 'flagship',
    venue: 'Campus Lab Hub (24 Hours)',
    desc: 'Build Web3, AI, and developer tools in a grueling 24-hour non-stop sprint.',
    registrationLink: 'https://unstop.com/hackathons/hackthechain-iiitk'
  },
  {
    id: 'd2-2',
    day: 2,
    time: '11:30 AM - 01:30 PM',
    title: 'Byte-Break Escape Room',
    eventId: 'byte-break',
    category: 'technical',
    venue: 'IoT & Hardware Laboratory',
    desc: 'Debug your way out of a locked high-security computer lab solving hardware riddles.',
    registrationLink: 'https://unstop.com/competitions/byte-break-iiitk'
  },
  {
    id: 'd2-3',
    day: 2,
    time: '02:00 PM - 05:00 PM',
    title: 'Robo Soccer',
    eventId: 'robo-soccer',
    category: 'technical',
    venue: 'Robotics Stadium',
    desc: 'Custom-built wireless bot showdown scoring goals on a specialized turf pitch.',
    registrationLink: 'https://unstop.com/competitions/robo-soccer-iiitk'
  },
  {
    id: 'd2-4',
    day: 2,
    time: '03:30 PM - 06:30 PM',
    title: 'Summit League (Esports)',
    eventId: 'summit-league',
    category: 'technical',
    venue: 'Esports Gaming Arena',
    desc: 'Competitive gaming brackets across BGMI, Valorant, and EA FC.',
    registrationLink: 'https://unstop.com/competitions/summit-league-iiitk'
  },
  {
    id: 'd2-5',
    day: 2,
    time: '07:00 PM - 08:30 PM',
    title: 'Fashion Show (Runway)',
    eventId: 'fashion-show',
    category: 'cultural',
    venue: 'Central Amphitheater Stage',
    desc: 'Thematic designer runway presentation celebrating futuristic and cultural costumes.',
    registrationLink: 'https://unstop.com/competitions/fashion-show-iiitk'
  },
  {
    id: 'd2-6',
    day: 2,
    time: '08:45 PM - 10:30 PM',
    title: 'Concert Night Live',
    eventId: 'concert-night',
    category: 'cultural',
    venue: 'Open Amphitheater',
    desc: 'Headline live vocal and acoustic concert under festival strobe spotlights.',
    registrationLink: 'https://unstop.com/competitions/concert-night-iiitk'
  },

  // DAY 3
  {
    id: 'd3-1',
    day: 3,
    time: '10:00 AM - 01:00 PM',
    title: 'Endeavour Programming Contest',
    eventId: 'endeavour',
    category: 'technical',
    venue: 'Computer Center A & B',
    desc: 'Algorithm design and dynamic programming challenge with complex constraints.',
    registrationLink: 'https://unstop.com/competitions/endeavour-iiitk'
  },
  {
    id: 'd3-2',
    day: 3,
    time: '11:00 AM - 01:00 PM',
    title: 'DesignX (Designathon)',
    eventId: 'designx',
    category: 'technical',
    venue: 'Design & Graphics Lab',
    desc: 'Product design sprint crafting interactive Figma prototypes and brand aesthetics.',
    registrationLink: 'https://unstop.com/competitions/designx-iiitk'
  },
  {
    id: 'd3-3',
    day: 3,
    time: '01:30 PM - 03:30 PM',
    title: 'TradeX (Mock Trading)',
    eventId: 'tradex',
    category: 'technical',
    venue: 'Auditorium Hall B',
    desc: 'Simulated stock market portfolio builder with real-time news shocks and crypto volatility.',
    registrationLink: 'https://unstop.com/competitions/tradex-iiitk'
  },
  {
    id: 'd3-4',
    day: 3,
    time: '03:00 PM - 05:00 PM',
    title: 'Squid Game (Elimination Trials)',
    eventId: 'squid-game',
    category: 'cultural',
    venue: 'Sports Ground',
    desc: 'High-tension physical and mental obstacle course with sudden elimination rules.',
    registrationLink: 'https://unstop.com/competitions/squid-game-iiitk'
  },
  {
    id: 'd3-5',
    day: 3,
    time: '04:00 PM - 06:00 PM',
    title: 'Carnival & Faculty Fumble',
    eventId: 'faculty-fumble',
    category: 'flagship',
    venue: 'Central Plaza',
    desc: 'Student vs Professor fun games, arcade claw machines, and festival stalls.',
    registrationLink: 'https://unstop.com'
  },
  {
    id: 'd3-6',
    day: 3,
    time: '05:00 PM - 06:45 PM',
    title: 'Dance Battle (Street Showdown)',
    eventId: 'dance-battle',
    category: 'cultural',
    venue: 'Stage Arena',
    desc: 'High-voltage freestyle dance competition across hip-hop, contemporary and popping.',
    registrationLink: 'https://unstop.com/competitions/dance-battle-iiitk'
  },
  {
    id: 'd3-7',
    day: 3,
    time: '07:30 PM - 11:00 PM',
    title: 'PRONITE GRAND FINALE',
    eventId: 'pronite',
    category: 'flagship',
    venue: 'Mega Concert Arena (Main Grounds)',
    desc: 'The grand festival closing celebration featuring celebrity DJ artist and laser show.',
    registrationLink: 'https://unstop.com/events/pronite-reverie-iiitk'
  }
];

