import { BaseKingdomScene } from './BaseKingdomScene';
import { festivalAbout } from '../../data/statistics';

export class StartingKingdomScene extends BaseKingdomScene {
  constructor() {
    super('StartingKingdomScene');
  }

  create() {
    // Set ample world width for generous, spacious landmark layout
    this.worldWidth = 3500;

    // Uses 'grass' theme -> renders bg_stars + bg_mario_hills (UniMaker 1.5-DX purple rolling hills!)
    this.createBaseWorld('grass', 'STARTING KINGDOM');

    // -------------------------------------------------------------------------
    // 1. MASCOT GUIDE NPC NEAR SPAWN (x = 75, giving spawn at 140 clear space)
    // -------------------------------------------------------------------------
    this.addNPC(75, this.groundY, 'KOTA BOT', 'Welcome to REVERIE 2K27! Run through the Grand Entrance Arch ahead, collect coins, and enter warp pipes to explore the festival!');

    // -------------------------------------------------------------------------
    // 2. AVATAR SKINS WARDROBE KIOSK & ARCADE FACADE (x = 240)
    //    Placed completely apart from the monument with > 200px breathing room!
    // -------------------------------------------------------------------------
    const arcadeGate = this.add.image(240, this.groundY, 'arcade_entrance').setOrigin(0.5, 1);
    arcadeGate.setDepth(-3);

    const wardrobeData = {
      id: 'avatar-wardrobe',
      title: 'AVATAR SKINS',
      category: 'flagship',
      tagline: 'CUSTOMIZE YOUR FESTIVAL HERO',
      shortDesc: 'Choose between Classic Mario, Cyber Neon, Golden Champion, Synthwave Punk, or REVERIE Special Edition skins!',
      description: 'Switch between 5 high-definition retro hero skins: Classic Mario, Cyber Neon Explorer, Golden Champion, Synthwave Punk, and the Cosmic REVERIE Special Edition.',
      customModal: 'skins'
    };
    this.addEventPortal(240, this.groundY, wardrobeData);

    // -------------------------------------------------------------------------
    // 3. GRAND REVERIE FESTIVAL ENTRANCE MONUMENT (Center x = 720)
    //    PERFECTLY SYMMETRICAL • ZERO OVERLAPPING • FULL VERTICAL BREATHING ROOM
    // -------------------------------------------------------------------------
    const monumentX = 720;
    const monumentBaseY = this.groundY; // 560
    const boardW = 580;
    const boardH = 160;
    const boardCenterY = 368; // Top is at 288, bottom is at 448 (112px clearance above ground!)

    // Grounded Stone Pedestal Base Slab
    const baseSlab = this.add.rectangle(monumentX, monumentBaseY - 14, 600, 28, 0x180d33);
    baseSlab.setStrokeStyle(2.5, 0x7c3aed);
    baseSlab.setDepth(-3);

    // Left & Right Structural Pillars
    const leftPillarX = monumentX - (boardW / 2) + 12;  // 442
    const rightPillarX = monumentX + (boardW / 2) - 12; // 998

    const leftPillar = this.add.rectangle(leftPillarX, (monumentBaseY + 288) / 2, 40, monumentBaseY - 288, 0x1f1140);
    leftPillar.setStrokeStyle(2.5, 0xa855f7);
    leftPillar.setDepth(-3);

    const rightPillar = this.add.rectangle(rightPillarX, (monumentBaseY + 288) / 2, 40, monumentBaseY - 288, 0x1f1140);
    rightPillar.setStrokeStyle(2.5, 0xa855f7);
    rightPillar.setDepth(-3);

    // Pillar Base Decorative Plinths
    this.add.rectangle(leftPillarX, monumentBaseY - 22, 54, 36, 0x14092b).setStrokeStyle(2, 0x7c3aed).setDepth(-3);
    this.add.rectangle(rightPillarX, monumentBaseY - 22, 54, 36, 0x14092b).setStrokeStyle(2, 0x7c3aed).setDepth(-3);

    // Glowing Neon Beacon Spheres atop Pillars
    this.add.circle(leftPillarX, 276, 12, 0xfbbf24, 0.95).setDepth(-3);
    this.add.circle(rightPillarX, 276, 12, 0xfbbf24, 0.95).setDepth(-3);
    this.add.circle(leftPillarX, 276, 20, 0xf59e0b, 0.25).setDepth(-4);
    this.add.circle(rightPillarX, 276, 20, 0xf59e0b, 0.25).setDepth(-4);

    // Ambient Magenta / Violet Aura behind the Board
    const monumentGlow = this.add.circle(monumentX, boardCenterY, 140, 0xa855f7, 0.35);
    monumentGlow.setDepth(-4);

    // Outer Board Panel (Dark cyber obsidian)
    const archBoard = this.add.rectangle(monumentX, boardCenterY, boardW, boardH, 0x0c061e, 0.98);
    archBoard.setStrokeStyle(3, 0xec4899);
    archBoard.setDepth(-3);

    // Inner Accent Inset Border
    const innerBoard = this.add.rectangle(monumentX, boardCenterY, boardW - 14, boardH - 14, 0x12082b, 0.85);
    innerBoard.setStrokeStyle(1.5, 0x7c3aed);
    innerBoard.setDepth(-3);

    // Symmetrical Cyan Neon Vertical Endcaps
    this.add.rectangle(monumentX - (boardW / 2) + 4, boardCenterY, 4, boardH - 24, 0x06b6d4).setDepth(-2);
    this.add.rectangle(monumentX + (boardW / 2) - 4, boardCenterY, 4, boardH - 24, 0x06b6d4).setDepth(-2);

    // -------------------------------------------------------------------------
    // HORIZONTALLY & VERTICALLY CENTERED CONTENT (ZERO OVERLAPPING!)
    // -------------------------------------------------------------------------
    // 1. REVERIE Official Wordmark Logo — Perfectly centered horizontally at monumentX!
    //    Top half of board (center Y = 336)
    const logoImg = this.add.image(monumentX, 336, 'reverie_logo');
    logoImg.setScale(0.28);
    logoImg.setOrigin(0.5, 0.5);
    logoImg.setDepth(-2);

    // 2. Symmetrical Flanking Gold Stars on Left and Right of Logo
    this.add.text(monumentX - 225, 336, '✦', { fontSize: '20px', color: '#fbbf24' }).setOrigin(0.5).setDepth(-2);
    this.add.text(monumentX + 225, 336, '✦', { fontSize: '20px', color: '#fbbf24' }).setOrigin(0.5).setDepth(-2);

    // 3. Symmetrical Neon Horizontal Divider Line below logo
    this.add.rectangle(monumentX, 380, 460, 2, 0x7c3aed, 0.7).setDepth(-2);
    this.add.text(monumentX, 380, '◆', { fontSize: '12px', color: '#06b6d4' }).setOrigin(0.5).setDepth(-2);

    // 4. Middle Line: "★ 2K27 • THE PIXELVERSE ★" — Centered at Y = 402 with plenty of room!
    this.add.text(monumentX, 402, '★ 2K27 • THE PIXELVERSE ★', {
      fontFamily: '"Oxanium", sans-serif',
      fontSize: '13px',
      color: '#fbbf24',
      fontStyle: '900',
      letterSpacing: 2
    }).setOrigin(0.5, 0.5).setDepth(-2);

    // 5. Bottom Line: "INDIAN INSTITUTE OF INFORMATION TECHNOLOGY KOTA" — Centered at Y = 424
    this.add.text(monumentX, 424, 'INDIAN INSTITUTE OF INFORMATION TECHNOLOGY KOTA', {
      fontFamily: '"Rajdhani", sans-serif',
      fontSize: '11px',
      color: '#e0e7ff',
      fontStyle: '700',
      letterSpacing: 1.5
    }).setOrigin(0.5, 0.5).setDepth(-2);

    // Subtle breathing pulse for the ambient aura
    this.tweens.add({
      targets: monumentGlow,
      scaleX: 1.25,
      scaleY: 1.25,
      alpha: 0.18,
      duration: 1800,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });

    // -------------------------------------------------------------------------
    // 4. PLATFORMING COURSE — PLACED CLEANLY AT x = 1140+ (FAR BEYOND THE ARCH!)
    // -------------------------------------------------------------------------
    this.addQuestionBlock(1140, 410);
    this.addQuestionBlock(1190, 410);
    this.addCoinsInRow(1140, 350, 2, 50);

    // 5. Signature jumpable bouncy mushroom platform (spring jump!)
    this.addMushroomPlatform(1340, this.groundY);
    this.addCoin(1340, 420);

    // 6. Elevated scenic platform with coins
    this.createElevatedPlatform(1540, 420, 4, 'grass');
    this.addCoinsInRow(1560, 360, 3, 48);

    // -------------------------------------------------------------------------
    // 7. FESTIVAL INFORMATIONAL PAVILIONS
    // -------------------------------------------------------------------------
    // About REVERIE Kiosk
    const aboutReverieData = {
      id: 'about-reverie',
      title: 'ABOUT REVERIE',
      category: 'flagship',
      tagline: 'ENTER THE WORLD. EXPLORE THE FEST. UNLOCK THE EXPERIENCE.',
      shortDesc: festivalAbout.festDescription,
      description: festivalAbout.festDescription,
      venue: 'IIIT Kota Ranpur Campus',
      teamSize: 'All Colleges Welcome',
      eligibility: 'Open to All Students',
      prizePool: '₹1.5 Lakhs+',
      rules: ['Experience 18+ events', 'Network with industry leaders', 'Compete across tech and culture'],
      coordinators: [{ name: 'TechKnow Council', phone: 'techknowcouncil.com' }],
      registrationLink: 'https://techknowcouncil.com'
    };
    this.addEventPortal(1840, this.groundY, aboutReverieData);

    // Floating question block between kiosks
    this.addQuestionBlock(2000, 410);
    this.addCoin(2000, 350);

    // IIIT Kota Academic Tower Building Facade & Kiosk
    const kotaBldg = this.add.image(2160, this.groundY, 'iiit_building').setOrigin(0.5, 1);
    kotaBldg.setDepth(-3);

    const aboutKotaData = {
      id: 'about-iiit-kota',
      title: 'ABOUT IIIT KOTA',
      category: 'technical',
      tagline: 'INSTITUTE OF NATIONAL IMPORTANCE',
      shortDesc: festivalAbout.instituteDescription,
      description: festivalAbout.instituteDescription,
      venue: 'Ranpur, Kota, Rajasthan (100+ Acres Campus)',
      teamSize: 'Campus Hub',
      eligibility: 'Ministry of Education & Govt of Rajasthan Joint Venture',
      prizePool: 'Excellence in Technology',
      rules: ['Explore 5 festival kingdoms', 'Interact with faculty & sponsors'],
      coordinators: [{ name: 'IIIT Kota', phone: 'www.iiitkota.ac.in' }],
      registrationLink: 'https://www.iiitkota.ac.in'
    };
    this.addEventPortal(2160, this.groundY, aboutKotaData);

    // -------------------------------------------------------------------------
    // 8. FOUR GRAND WARP PIPES TO FESTIVAL KINGDOMS
    // -------------------------------------------------------------------------
    // 1. GREEN PIPE -> TECH KINGDOM
    this.addWarpPipe(2420, this.groundY, {
      color: 'green',
      targetScene: 'TechKingdomScene',
      destinationName: 'TECH REALM',
      spawnPoint: { x: 160, y: this.groundY - 60 }
    });

    // 2. PINK PIPE -> CULTURE KINGDOM
    this.addWarpPipe(2660, this.groundY, {
      color: 'pink',
      targetScene: 'CultureKingdomScene',
      destinationName: 'CULTURE REALM',
      spawnPoint: { x: 160, y: this.groundY - 60 }
    });

    // 3. GOLD ARCADE PIPE -> RETRO ARCADE UNIVERSE (Replaced Flagship tunnel!)
    this.addWarpPipe(2900, this.groundY, {
      color: 'yellow',
      targetScene: 'arcade',
      isArcade: true,
      destinationName: 'ARCADE',
      spawnPoint: { x: 160, y: this.groundY - 60 }
    });

    // 4. WHITE PIPE -> FESTIVAL PLAZA
    this.addWarpPipe(3140, this.groundY, {
      color: 'white',
      targetScene: 'FestivalPlazaScene',
      destinationName: 'FESTIVAL PLAZA',
      spawnPoint: { x: 160, y: this.groundY - 60 }
    });

    // -------------------------------------------------------------------------
    // 9. LEVEL FINISH & EASTER EGG SECRET PIPE
    // -------------------------------------------------------------------------
    // End-of-level Victory Flagpole
    this.add.image(3300, this.groundY, 'flag').setOrigin(0.5, 1);

    // SECRET BONUS VAULT WARP PIPE (Easter Egg past the flagpole!)
    const secretPipe = this.addWarpPipe(3400, this.groundY, {
      color: 'gold',
      targetScene: 'SecretBonusRoomScene',
      destinationName: '8-BIT SECRET VAULT',
      spawnPoint: { x: 140, y: this.groundY - 60 }
    });

    // Golden glow behind secret pipe
    const secretGlow = this.add.circle(3400, this.groundY - 30, 24, 0xfbbf24, 0.45);
    secretGlow.setDepth(-1);
    this.tweens.add({
      targets: secretGlow,
      scaleX: 1.4,
      scaleY: 1.4,
      alpha: 0.15,
      duration: 1000,
      yoyo: true,
      repeat: -1
    });
  }
}
