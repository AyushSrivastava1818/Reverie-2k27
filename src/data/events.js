export const eventsData = [
  // --- FLAGSHIP EVENTS (4) ---
  {
    id: 'hackthechain',
    image: '/assets/events/hackthechain.jpg',
    title: 'HACKTHECHAIN',
    category: 'flagship',
    zone: 'flagship',
    pipeColor: 'purple',
    tagline: 'INNOVATE. BUILD. IGNITE THE FUTURE.',
    shortDesc: 'The biggest hackathon in Kota city, presented by the TechKnow Council with Round 1 code submission & Round 2 final showcase.',
    description: 'The biggest hackathon in Kota city, presented by the TechKnow Council. This hackathon took place during the techno-management fest of IIIT Kota where it unfolded into two rounds: Round-1 (Code Submission) and Round-2 (Final Project Showcase), presenting their revolutionary ideas to a panel of judges. Innovation ignites future possibilities.',
    venue: 'Main Auditorium & CS Labs',
    teamSize: '2 - 4 Members',
    eligibility: 'Open to undergraduate and postgraduate students from all recognized colleges.',
    prizePool: '₹50,000+ & Developer Grants',
    rules: [
      'Round 1: Online submission of idea abstracts, repository links, and architecture decks.',
      'Round 2: Top shortlisted teams present offline live demos to industry judges.',
      'Plagiarism or pre-built complete solutions will lead to immediate disqualification.',
      'All code must be version controlled on GitHub with clear commit history.'
    ],
    coordinators: [
      { name: 'Shivang Singh', phone: '82798 16830' },
      { name: 'TechKnow Council Leads', role: 'Hackathon Organizing Team' }
    ],
    registrationLink: 'https://unstop.com/hackathons/hackthechain',
    status: 'Registration Open'
  },
  {
    id: 'carnival',
    image: '/assets/events/carnival.jpg',
    title: 'CARNIVAL',
    category: 'flagship',
    zone: 'flagship',
    pipeColor: 'purple',
    tagline: 'COME FOR THE GAMES. LEAVE WITH MEMORIES!',
    shortDesc: 'An energetic festival space packed with arcade games, student stalls, interactive challenges and fun surprises.',
    description: 'Carnival is an energetic space where students can play, challenge themselves, cheer for their friends, and simply enjoy the moment. With an atmosphere full of laughter, excitement, and surprises, it is all about coming together and making the most of the day. Whether you are here to compete or just have a great time, Carnival has something to keep everyone entertained.',
    venue: 'Central Fest Lawns & Arcade Arena',
    teamSize: 'Solo or Group',
    eligibility: 'All festival attendees with valid Reverie Pass.',
    prizePool: 'Arcade Goodies, Mystery Hampers & Tokens',
    rules: [
      'Collect carnival tokens at entry booths to play interactive mini-games.',
      'Fair play is mandatory across all arcade stalls and carnival challenges.',
      'Special grand mystery prize awarded to top token high-scorers.'
    ],
    coordinators: [
      { name: 'Virag Jain', phone: '6376 069 193' },
      { name: 'Carnival Operations Team', role: 'Student Council' }
    ],
    registrationLink: 'https://techknowcouncil.com/carnival',
    status: 'Open Stalls'
  },
  {
    id: 'pronite',
    image: '/assets/events/pronite.jpg',
    title: 'PRONITE',
    category: 'flagship',
    zone: 'flagship',
    pipeColor: 'purple',
    tagline: 'FEEL THE MUSIC. LIVE THE ENERGY. CELEBRATE THE NIGHT.',
    shortDesc: 'The high-energy grand finale featuring professional DJ setup, high-octane sound systems, and immersive lighting.',
    description: 'Pronite is the high-energy grand finale of the summit, designed to transform the campus into a vibrant festival of music and dance. Featuring a professional DJ setup, high-octane sound systems, and immersive lighting, the event offers students the ultimate space to unwind and celebrate. A night of pure joy awaits all present there. Music, lights, magic.',
    venue: 'Main Open Air Stadium, IIIT Kota',
    teamSize: 'Open Admission',
    eligibility: 'Reverie 2K27 Registered Attendees & Delegates with Student ID.',
    prizePool: 'Grand Cultural Night Experience',
    rules: [
      'Official festival wristbands and college ID cards mandatory at gates.',
      'Gates close 30 minutes before the headlining artist set.',
      'Prohibited items include alcohol, sharp objects, and unauthorized recording gear.'
    ],
    coordinators: [
      { name: 'Avinash Galam', phone: '89518 17574' },
      { name: 'Pronite Hospitality Team', role: 'TechKnow PR' }
    ],
    registrationLink: 'https://techknowcouncil.com/pronite-pass',
    status: 'Passes Live'
  },
  {
    id: 'faculty-fumble',
    image: '/assets/events/faculty-fumble.jpg',
    title: 'FACULTY FUMBLE',
    category: 'flagship',
    zone: 'flagship',
    pipeColor: 'purple',
    tagline: 'FUMBLE THE MOVE. OWN THE GAME',
    shortDesc: 'Exciting faculty-focused showdown combining fun, teamwork, coordination, and playful twists.',
    description: 'Faculty Fumble brings together fun, teamwork, coordination, and quick reflexes as faculty members step into an exciting challenge filled with laughter and unexpected twists. Get ready to fumble, compete, and enjoy every moment as our faculty members showcase their playful side. Every move brings a surprise, every round adds excitement, and only the most skillful will claim the victory!',
    venue: 'Indoor Sports Complex',
    teamSize: 'Faculty Teams & Student Cheers',
    eligibility: 'IIIT Kota Professors, Lecturers and Staff Members.',
    prizePool: 'Faculty Trophy of Champions & Memorabilia',
    rules: [
      'Multi-stage obstacle and coordination relay games.',
      'Points awarded for agility, sportsmanship, and creative solutions.',
      'Strictly good vibes, laughs, and lighthearted campus fun.'
    ],
    coordinators: [
      { name: 'Vinayak Pokhariya', phone: '79768 66911' },
      { name: 'Faculty Relations Committee', role: 'TechKnow Council' }
    ],
    registrationLink: 'https://techknowcouncil.com/faculty-fumble',
    status: 'Invitational'
  },

  // --- TECHNICAL EVENTS (7) ---
  {
    id: 'endeavour',
    image: '/assets/events/endeavour.jpg',
    title: 'ENDEAVOUR',
    category: 'technical',
    zone: 'tech',
    pipeColor: 'green',
    tagline: 'CODE FAST. THINK SMART. RISE ON THE LEADERBOARD.',
    shortDesc: 'Premier competitive programming contest driven by logic, speed, and real-time live scoreboard adrenaline.',
    description: 'Endeavour is more than just a programming contest — it is a thrilling journey of logic, creativity, and speed. With a live leaderboard keeping the excitement high, participants push boundaries while cheering each other on. It becomes a space where pressure turns into passion, and every challenge is a step toward programming excellence.',
    venue: 'Computer Center Lab 1 & 2',
    teamSize: 'Individual / Duo',
    eligibility: 'Undergraduate engineering students.',
    prizePool: '₹20,000 + Tech Goodies',
    rules: [
      'Contest hosted on platform with automated test-case evaluation.',
      'Penalty applied for wrong submissions on time-tied ranks.',
      'Languages permitted: C++, Java, Python 3.'
    ],
    coordinators: [
      { name: 'Shivang Singh', phone: '82798 16830' },
      { name: 'Coding Club Leads', role: 'Technical Society' }
    ],
    registrationLink: 'https://unstop.com/competitions/endeavour-iiitkota',
    status: 'Registration Open'
  },
  {
    id: 'byte-break',
    image: '/assets/events/byte-break.jpg',
    title: 'BYTE-BREAK',
    category: 'technical',
    zone: 'tech',
    pipeColor: 'green',
    tagline: 'WHERE LOGIC, PUZZLES, AND CODE COLLIDE.',
    shortDesc: 'A high-energy, tech-themed escape room challenge where participants must debug their way out of a locked lab.',
    description: 'Byte Break is a high-energy, tech-themed escape room challenge where participants must "debug" their way out of a locked environment. It blends traditional escape room mechanics with programming riddles, hardware hacks, cryptography, and logical puzzles. Each solved riddle unlocks the next physical or digital clue.',
    venue: 'IoT & Hardware Laboratory',
    teamSize: '3 - 4 Members',
    eligibility: 'Open to all registered fest participants.',
    prizePool: '₹15,000 + Cyber Merch',
    rules: [
      'Each team has exactly 45 minutes to solve all puzzle terminals.',
      'Physical items in the room must not be dismantled by force.',
      'Hints incur a 3-minute time deduction on final clearance time.'
    ],
    coordinators: [
      { name: 'Virag Jain', phone: '6376 069 193' },
      { name: 'Hardware & IoT Club', role: 'Event Team' }
    ],
    registrationLink: 'https://unstop.com/competitions/byte-break-iiitk',
    status: 'Slot Booking'
  },
  {
    id: 'dsa-sprint',
    image: '/assets/events/dsa-sprint.png',
    title: 'DSA SPRINT',
    category: 'technical',
    zone: 'tech',
    pipeColor: 'green',
    tagline: 'A HIGH-INTENSITY CHALLENGE IN DATA STRUCTURES AND ALGORITHMS.',
    shortDesc: 'Fast-paced competitive algorithmic sprint with escalating difficulty under strict time limits.',
    description: 'DSA Sprint is a fast-paced competitive programming event focused on data structures and algorithms. Participants will face a series of progressively difficult coding challenges designed to test their problem-solving speed, optimization skills, and algorithmic thinking under time pressure.',
    venue: 'Online & Lab Arena',
    teamSize: 'Solo Only',
    eligibility: 'All college coders.',
    prizePool: '₹15,000 + Certificate of Merit',
    rules: [
      'Sprint duration: 90 minutes with 6 progressive algorithmic problems.',
      'Partial scoring enabled for sub-tasks.',
      'Strict anti-cheat plagiarism analysis across all submitted solutions.'
    ],
    coordinators: [
      { name: 'Shivang Singh', phone: '82798 16830' }
    ],
    registrationLink: 'https://unstop.com/hackathons/dsa-sprint',
    status: 'Registration Open'
  },
  {
    id: 'tradex',
    image: '/assets/events/tradex.png',
    title: 'TRADEX',
    category: 'technical',
    zone: 'tech',
    pipeColor: 'green',
    tagline: 'LEARN THE MARKET. TRADE SMART. COMPETE LIVE.',
    shortDesc: 'Market fundamentals, price action, risk management workshop and real-time paper trading simulation.',
    description: 'TradeX delivers a focused deep dive into market fundamentals, price action, and risk management. Designed for beginners, this session clarifies how markets operate and introduces essential charting tools and trading principles, culminating in an exhilarating live trading simulation.',
    venue: 'Seminar Hall B',
    teamSize: 'Solo / Duo',
    eligibility: 'All students interested in finance, fintech, and trading.',
    prizePool: '₹12,000 + Trading Subscriptions',
    rules: [
      'Virtual starting capital allocated to each participant portfolio.',
      'Real-time market volatility triggers and news shocks introduced live.',
      'Highest risk-adjusted portfolio return wins the crown.'
    ],
    coordinators: [
      { name: 'Avinash Galam', phone: '89518 17574' }
    ],
    registrationLink: 'https://unstop.com/competitions/tradex-simulation',
    status: 'Registration Open'
  },
  {
    id: 'summit-league',
    image: '/assets/events/summit-league.jpg',
    title: 'SUMMIT LEAGUE',
    category: 'technical',
    zone: 'tech',
    pipeColor: 'green',
    tagline: 'BATTLE LIVE. FEEL THE CROWD. CLAIM ESPORTS GLORY.',
    shortDesc: 'Premier offline esports tournament featuring titles including BGMI, Free Fire and Valorant.',
    description: 'Summit League is a premier offline esports tournament where the digital battlefield meets the roar of a live crowd. Bringing together top collegiate teams in competitive titles including BGMI, Free Fire, and Valorant, it celebrates precision reflexes, tactical synergy, and esports passion.',
    venue: 'Esports Arena & LAN Zone',
    teamSize: '4 - 5 Players per Team',
    eligibility: 'Collegiate esports rosters.',
    prizePool: '₹25,000 + Gaming Gear',
    rules: [
      'Tournament follows standard competitive esports rulesets and map pools.',
      'Players must bring their own peripherals (mouse, keyboard, headset) or mobile devices.',
      'Emulators or unauthorized scripts will result in instant forfeit.'
    ],
    coordinators: [
      { name: 'Virag Jain', phone: '6376 069 193' }
    ],
    registrationLink: 'https://unstop.com/competitions/summit-league-esports',
    status: 'Brackets Filling'
  },
  {
    id: 'designx',
    image: '/assets/events/designx.png',
    title: 'DESIGNX',
    category: 'technical',
    zone: 'tech',
    pipeColor: 'green',
    tagline: 'LEARN DESIGN. CREATE BOLDLY. COMPETE TO WIN.',
    shortDesc: 'Design workshop exploring typography, color theory, layout composition followed by a live UI/UX design battle.',
    description: 'DesignX is an immersive workshop exploring the core pillars of visual communication. Master the essentials of typography, color theory, and layout composition, followed by a fast-paced creative design contest where participants solve real product design problems under time constraints.',
    venue: 'Design Studio Lab',
    teamSize: 'Solo or Duo',
    eligibility: 'Designers, artists, and UI/UX enthusiasts.',
    prizePool: '₹12,000 + Design Assets Bundle',
    rules: [
      'Workshop session commences with interactive design critique.',
      'Live sprint prompt revealed on the spot (Figma/Adobe Illustrator permitted).',
      'Evaluation criteria: visual hierarchy, originality, responsiveness, and usability.'
    ],
    coordinators: [
      { name: 'Vinayak Pokhariya', phone: '79768 66911' }
    ],
    registrationLink: 'https://unstop.com/workshops/designx-iiitk',
    status: 'Registration Open'
  },
  {
    id: 'robo-soccer',
    image: '/assets/events/robo-soccer.jpg',
    title: 'ROBO SOCCER',
    category: 'technical',
    zone: 'tech',
    pipeColor: 'green',
    tagline: 'TAKE CONTROL. TAKE THE SHOT. OWN THE FIELD.',
    shortDesc: 'Robot-controlled football competition involving strategy, precise remote handling, and lightning reflexes.',
    description: 'Robo Soccer brings together skill, control, strategy, and quick reflexes as students take charge of their robotic players and compete on the field. Control your robo, outplay your opponents, and aim for the ultimate goal. Every move matters, every goal counts, and only the best-controlled bot will reign supreme!',
    venue: 'Robotics Arena, Student Activity Center',
    teamSize: '2 - 4 Members per Bot',
    eligibility: 'Open to all robotics builders and robotics clubs.',
    prizePool: '₹20,000 + Robotics Kit Vouchers',
    rules: [
      'Bot specifications: max weight 5kg, max dimensions 30cm x 30cm.',
      'Wired or wireless control with designated radio frequencies.',
      'Matches consist of two 4-minute halves of intense goal-scoring action.'
    ],
    coordinators: [
      { name: 'Shivang Singh', phone: '82798 16830' }
    ],
    registrationLink: 'https://unstop.com/competitions/robo-soccer-iiitk',
    status: 'Registration Open'
  },

  // --- CULTURAL EVENTS (7) ---
  {
    id: 'botanical-bid',
    image: '/assets/events/botanical-bid.jpg',
    title: 'BOTANICAL BID',
    category: 'cultural',
    zone: 'culture',
    pipeColor: 'pink',
    tagline: 'A STRATEGIC AND ENGAGING EVENT.',
    shortDesc: 'Strategic team-based competition blending botanical knowledge, auction mechanics, and resource bidding.',
    description: 'Botanical Bid is an engaging and competitive team-based event that brings together strategy, knowledge, teamwork, and quick decision-making. Participants will need to think wisely, plan their bids, and manage their allocated tokens to assemble high-value botanical collections while outsmarting rival teams.',
    venue: 'Campus Open Amphitheatre',
    teamSize: '3 - 4 Members',
    eligibility: 'All students with a knack for strategy and auctions.',
    prizePool: '₹10,000 + Eco Trophies',
    rules: [
      'Teams are allotted fixed auction currency points.',
      'Timed bidding rounds with secret multipliers and penalty rounds.',
      'Highest portfolio valuation at close wins.'
    ],
    coordinators: [
      { name: 'Vinayak Pokhariya', phone: '79768 66911' }
    ],
    registrationLink: 'https://techknowcouncil.com/botanical-bid',
    status: 'Registration Open'
  },
  {
    id: 'among-us',
    image: '/assets/events/among-us.jpg',
    title: 'AMONG US',
    category: 'cultural',
    zone: 'culture',
    pipeColor: 'pink',
    tagline: 'TRUST NO ONE. THINK FAST. SURVIVE.',
    shortDesc: 'Real-world live social deduction experience with crewmates, impostors, physical mini-tasks, and emergency meetings.',
    description: 'Among Us brought a thrilling twist of social deduction to the tech summit, challenging participants to balance technical tasks with the art of deception. While crewmates scramble to complete physical and digital objectives across the hall, impostors lurk in the shadows attempting sabotage without getting caught during emergency discussions.',
    venue: 'Academic Block Floor 2',
    teamSize: 'Solo (Assigned into 10-player lobbies)',
    eligibility: 'All registered participants.',
    prizePool: '₹10,000 + Among Us Collectibles',
    rules: [
      'Crewmates complete designated checkpoint tasks to fill the group bar.',
      'Impostors perform silent tags and invoke room lockdowns.',
      'Emergency meetings called at the central round table with strict 2-minute voting.'
    ],
    coordinators: [
      { name: 'Virag Jain', phone: '6376 069 193' }
    ],
    registrationLink: 'https://techknowcouncil.com/among-us-live',
    status: 'Registration Open'
  },
  {
    id: 'band-night',
    image: '/assets/events/band-night.jpg',
    title: 'BAND NIGHT',
    category: 'cultural',
    zone: 'culture',
    pipeColor: 'pink',
    tagline: 'FEEL THE MUSIC. LIVE THE ENERGY. CELEBRATE THE NIGHT.',
    shortDesc: 'Raw live band battle and acoustic rock performances celebrating original compositions and crowd anthems.',
    description: 'Band Night brings the raw energy of live music to the tech summit. Featuring performances by talented collegiate and guest live bands, this event creates an electrifying atmosphere of rhythm, guitar riffs, drum crescendos, and soulful vocals that light up the festival night.',
    venue: 'Open Air Theatre (OAT)',
    teamSize: '3 - 8 Musicians per Band',
    eligibility: 'Collegiate rock, indie, and fusion bands.',
    prizePool: '₹25,000 + Recording Studio Credits',
    rules: [
      'Each band gets 15 minutes stage time including 3 minutes soundcheck.',
      'At least one original composition or creative adaptation required.',
      'Judged on musical tight-knit harmony, stage presence, and crowd resonance.'
    ],
    coordinators: [
      { name: 'Avinash Galam', phone: '89518 17574' }
    ],
    registrationLink: 'https://unstop.com/competitions/band-night-reverie',
    status: 'Shortlisting Bands'
  },
  {
    id: 'squid-game',
    image: '/assets/events/squid-game.jpg',
    title: 'SQUID GAME',
    category: 'cultural',
    zone: 'culture',
    pipeColor: 'pink',
    tagline: 'SURVIVE THE PRESSURE. PLAY SMART. BE THE LAST STANDING',
    shortDesc: 'High-stakes physical and mental elimination challenges inspired by iconic playground games.',
    description: 'Squid Game brought the high-stakes tension of the global phenomenon to life, testing participants nerves, patience, and physical precision. In this real-life adaptation, players faced a series of intense elimination challenges where a single lapse in focus meant instant knockout. It forced participants to strategize under pressure and prove they had the grit to be the last one standing.',
    venue: 'Main Sports Complex Lawn',
    teamSize: 'Solo (Battling through rounds)',
    eligibility: 'All students with a desire to test their reflexes and stamina.',
    prizePool: '₹15,000 Winner Takes All',
    rules: [
      'Games include Red Light Green Light, Dalgona precision, Tug-of-War strategy, and Marble tactics.',
      'Infractions or motion during freeze calls trigger immediate elimination.',
      'Referee decisions are final and undisputed.'
    ],
    coordinators: [
      { name: 'Shivang Singh', phone: '82798 16830' }
    ],
    registrationLink: 'https://techknowcouncil.com/squid-game-reverie',
    status: 'Registration Open'
  },
  {
    id: 'concert-night',
    image: '/assets/events/concert-night.jpg',
    title: 'CONCERT NIGHT',
    category: 'cultural',
    zone: 'culture',
    pipeColor: 'pink',
    tagline: 'WHERE INNOVATION MEETS RHYTHM IN AN ELECTRIFYING LIVE EXPERIENCE.',
    shortDesc: 'Premier festival musical showcase featuring prominent headline vocalists and musical artists.',
    description: 'Concert Night is the premier musical highlight of the tech summit, delivering an electrifying live performance that transforms the venue into a high-energy arena. This event provides an unparalleled platform uniting students, innovation, and musical entertainment seamlessly under the starlit sky.',
    venue: 'Main Fest Concert Grounds',
    teamSize: 'Festival Crowd',
    eligibility: 'All festival passholders.',
    prizePool: 'Grand Live Entertainment',
    rules: [
      'Entry strictly upon presentation of digital barcode fest pass.',
      'Security checkpoint protocols apply at all access gates.',
      'Designated areas for VIP passholders, faculty, and general student body.'
    ],
    coordinators: [
      { name: 'Avinash Galam', phone: '89518 17574' },
      { name: 'Cultural Council Organizers', role: 'Event Leads' }
    ],
    registrationLink: 'https://techknowcouncil.com/concert-night',
    status: 'Lineup Confirmed'
  },
  {
    id: 'fashion-show',
    image: '/assets/events/fashion-show.jpg',
    title: 'FASHION SHOW',
    category: 'cultural',
    zone: 'culture',
    pipeColor: 'pink',
    tagline: 'A STAGE WHERE YOUR STYLE SPEAKS LOUDER THAN WORDS',
    shortDesc: 'Glamorous runway celebration showcasing cutting-edge student styling, theme walks, and stage poise.',
    description: 'Fashion Show is one of the most glamorous highlights of the tech summit, celebrating creativity, style, and self-expression. It provides participants with an exciting platform to showcase their fashion sense, confidence, and individuality on the runway. The event brings together students, fashion enthusiasts, and audiences for an unforgettable visual spectacle.',
    venue: 'Grand Indoor Auditorium Stage',
    teamSize: 'Teams of 8 - 14 Models & Stylists',
    eligibility: 'College fashion societies and independent student troupes.',
    prizePool: '₹25,000 + Best Model / Best Theme Accolades',
    rules: [
      'Themes may explore Cyberpunk Retro, Indo-Futurism, or Sustainable Haute Couture.',
      'Total runway showcase limit: 12 minutes per team including background score.',
      'Judged on choreography, theme interpretation, garment aesthetics, and ramp walk.'
    ],
    coordinators: [
      { name: 'Vinayak Pokhariya', phone: '79768 66911' }
    ],
    registrationLink: 'https://unstop.com/competitions/reverie-fashion-show',
    status: 'Team Submissions'
  },
  {
    id: 'dance-battle',
    image: '/assets/events/dance-battle.jpg',
    title: 'DANCE BATTLE',
    category: 'cultural',
    zone: 'culture',
    pipeColor: 'pink',
    tagline: 'A STAGE WHERE RHYTHM MEETS PASSION AND EVERY MOVE TELLS A STORY',
    shortDesc: 'High-energy crew battles and solo freestyle face-offs across hip-hop, street, popping and contemporary.',
    description: 'The Dance Battle is the ultimate celebration of rhythm, creativity, and self-expression, bringing together passionate dancers for an electrifying showcase of talent. This high-energy event transforms the stage into a vibrant arena where moves speak louder than words and every beat fuels the competition.',
    venue: 'OAT Dance Arena',
    teamSize: 'Solo (1v1) or Crew (6 - 12)',
    eligibility: 'Dancers from all institutions.',
    prizePool: '₹20,000 + Dance Champion Belts',
    rules: [
      'Solo 1v1 cypher preliminary round followed by top 8 knockouts to random DJ beats.',
      'Crew category features a 6-minute thematic routine followed by a 2-minute sudden death clash.',
      'No physical contact or unsportsmanlike behavior permitted during battles.'
    ],
    coordinators: [
      { name: 'Virag Jain', phone: '6376 069 193' }
    ],
    registrationLink: 'https://unstop.com/competitions/dance-battle-iiitk',
    status: 'Registration Open'
  }
];

