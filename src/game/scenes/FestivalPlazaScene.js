import { BaseKingdomScene } from './BaseKingdomScene';
import { eventBus } from '../EventBus';
import { soundEngine } from '../systems/SoundEngine';
import Phaser from 'phaser';

export class FestivalPlazaScene extends BaseKingdomScene {
  constructor() {
    super('FestivalPlazaScene');
  }

  create() {
    // 1. Initialize Base World with 'plaza' theme & 3200px width
    this.createBaseWorld('plaza', 'FESTIVAL PLAZA');

    // 2. Grand Sky Banner
    const bannerX = 540;
    const bannerY = 140;
    const banner = this.add.rectangle(bannerX, bannerY, 620, 56, 0x0f0724, 0.95);
    banner.setStrokeStyle(2.5, 0x10b981);
    banner.setDepth(-2);

    this.add.text(bannerX, bannerY - 12, '🏛️ ZONE E: FESTIVAL PLAZA & HONORS PAVILION 🏛️', {
      fontFamily: '"Oxanium", sans-serif',
      fontSize: '16px',
      color: '#34d399',
      fontStyle: 'bold'
    }).setOrigin(0.5).setDepth(-1);

    this.add.text(bannerX, bannerY + 12, 'CENTRAL FOUNTAIN • SPONSORS • ARCHIVES • STATS • HONOR PAVILION', {
      fontFamily: '"Rajdhani", sans-serif',
      fontSize: '13px',
      color: '#a7f3d0',
      fontStyle: '600'
    }).setOrigin(0.5).setDepth(-1);

    // =========================================================================
    // 3. RETURN PIPE (Connects back to Starting Kingdom Hub)
    // =========================================================================
    this.addWarpPipe(140, this.groundY, {
      color: 'yellow',
      targetScene: 'StartingKingdomScene',
      destinationName: 'STARTING HUB',
      spawnPoint: { x: 3040, y: this.groundY - 60 }
    });

    // =========================================================================
    // 4. PLAZA GUIDE KOTA BOT NPC
    // =========================================================================
    this.addNPC(280, this.groundY, 'KOTA BOT', 'Welcome to the Festival Plaza! Inspect kiosks for ₹1.5L+ Prizes, Sponsor Perks, Photo Gallery and Secretariat!');

    // Decorative golden garden lamp post
    this.createLampPost(380, this.groundY);

    // =========================================================================
    // 5. DESTINATION 1: IMPACT STATISTICS & RECORD ARCHIVES
    // =========================================================================
    const impactData = {
      id: 'plaza-stats',
      title: 'IMPACT STATS',
      category: 'flagship',
      tagline: '6K+ FOOTFALL • ₹1.5L+ PRIZES • 20+ COLLEGES',
      shortDesc: 'Official festival attendance statistics, competition analytics, college reach, and digital web impressions.',
      description: 'Official festival attendance statistics, competition analytics, college reach, and digital web impressions.',
      customModal: 'stats'
    };
    this.addEventPortal(520, this.groundY, impactData);

    // Elevated Garden Terrace 1
    this.createElevatedPlatform(660, 420, 6, 'grass');
    this.addCoinsInRow(680, 360, 5, 46);
    this.createPixelTree(660, 420);
    this.createPixelTree(940, 420);

    // =========================================================================
    // 6. DESTINATION 2: PAST GLIMPSES & BROCHURE ARCHIVES
    // =========================================================================
    const galleryData = {
      id: 'plaza-gallery',
      title: 'PAST GLIMPSES',
      category: 'cultural',
      tagline: 'RETRO PHOTO JOURNEY & OFFICIAL FESTIVAL BROCHURE',
      shortDesc: 'High-voltage concerts, fierce robotics clashes, esports arenas, and campus celebrations from previous REVERIE editions.',
      description: 'High-voltage concerts, fierce robotics clashes, esports arenas, and campus celebrations from previous REVERIE editions.',
      customModal: 'gallery'
    };
    this.addEventPortal(800, 420, galleryData);

    // =========================================================================
    // 7. CENTRAL ILLUMINATED WATER FOUNTAIN (Centerpiece Landmark at x = 1140)
    // =========================================================================
    this.createCentralFountain(1140, this.groundY);

    // Monumental REVERIE 2K27 Stone Archway behind the fountain
    this.createGrandPlazaArch(1140, this.groundY);

    // Interactive High Score Boulevard Leaderboard Kiosk beside fountain
    const leaderboardData = {
      id: 'plaza-leaderboard',
      title: 'HIGH SCORES',
      category: 'flagship',
      tagline: 'HIGH SCORE BOULEVARD • TOP FESTIVAL CHAMPIONS',
      shortDesc: 'Inspect campus rankings, top coin collectors, quest champions and mini-game records.',
      description: 'Inspect campus rankings, top coin collectors, quest champions and mini-game records.',
      customModal: 'leaderboard'
    };
    this.addEventPortal(980, this.groundY, leaderboardData);

    // Decorative Golden Lamp Posts flanking fountain
    this.createLampPost(1300, this.groundY);

    // =========================================================================
    // 8. DESTINATION 3: SPONSORSHIP GALLERY & PERKS MATRIX
    // =========================================================================
    const sponsorData = {
      id: 'plaza-sponsors',
      title: 'SPONSOR GALLERY',
      category: 'technical',
      tagline: '30+ PARTNER BRANDS • RECRUITMENT • PERKS MATRIX',
      shortDesc: 'Explore national partner brands supporting REVERIE 2K27, internship pipelines, and official sponsorship benefits.',
      description: 'Explore national partner brands supporting REVERIE 2K27, internship pipelines, and official sponsorship benefits.',
      customModal: 'sponsors'
    };
    this.addEventPortal(1480, this.groundY, sponsorData);

    // Elevated Garden Terrace 2
    this.createElevatedPlatform(1640, 410, 7, 'grass');
    this.addCoinsInRow(1660, 350, 6, 46);
    this.createPixelTree(1640, 410);
    this.createPixelTree(1960, 410);

    // =========================================================================
    // 9. DESTINATION 4: HONOR PAVILION (Prize Pool & Hall of Fame)
    // =========================================================================
    const honorData = {
      id: 'plaza-honors',
      title: 'HONOR PAVILION',
      category: 'flagship',
      tagline: '₹1,50,000+ CASH POOL • TROPHIES • REVERIE HALL OF FAME',
      shortDesc: 'Complete prize distribution matrix, official trophies, developer grants, and certificates awarded across all 18 events.',
      description: 'Complete prize distribution matrix, official trophies, developer grants, and certificates awarded across all 18 events.',
      customModal: 'stats'
    };
    this.addEventPortal(1800, 410, honorData);

    // Decorative golden garden lamp post
    this.createLampPost(2080, this.groundY);

    // =========================================================================
    // 10. DESTINATION 5: SECRETARIAT & CAMPUS CONNECT
    // =========================================================================
    const contactData = {
      id: 'plaza-contacts',
      title: 'SECRETARIAT',
      category: 'flagship',
      tagline: 'STUDENT ACTIVITY COUNCIL & CHIEF COORDINATORS',
      shortDesc: 'Direct campus lines, PR coordinators, festival helpline, hospitality details, and Ranpur Kota campus map.',
      description: 'Direct campus lines, PR coordinators, festival helpline, hospitality details, and Ranpur Kota campus map.',
      customModal: 'contacts'
    };
    this.addEventPortal(2240, this.groundY, contactData);

    // Plaza Oracle Bot (Second NPC near Secretariat)
    this.addNPC(2440, this.groundY, 'ORACLE BOT', 'You have visited the grand centers of REVERIE! Step into the white pipe to warp directly to Tech Kingdom!');

    // =========================================================================
    // 11. FORWARD WARP PIPES
    // =========================================================================
    // Warp Pipe to Tech Kingdom
    this.addWarpPipe(2640, this.groundY, {
      color: 'cyan',
      targetScene: 'TechKingdomScene',
      destinationName: 'TECH REALM',
      spawnPoint: { x: 160, y: this.groundY - 60 }
    });

    // Warp Pipe to Arcade Universe (Replaced Flagship)
    this.addWarpPipe(2880, this.groundY, {
      color: 'yellow',
      targetScene: 'arcade',
      isArcade: true,
      destinationName: 'ARCADE',
      spawnPoint: { x: 160, y: this.groundY - 60 }
    });

    // Finish Flag at world boundary
    this.add.image(3080, this.groundY, 'flag').setOrigin(0.5, 1);
  }

  // ===========================================================================
  // ARCHITECTURAL HELPERS: GRAND FOUNTAIN, ARCHWAY & GARDEN PROPS
  // ===========================================================================
  createCentralFountain(x, y) {
    // Multi-tier stone fountain basin
    const baseWidth = 140;
    const baseHeight = 36;
    
    // Outer stone pool
    const pool = this.add.rectangle(x, y - baseHeight / 2, baseWidth, baseHeight, 0x1e1b4b, 0.95);
    pool.setStrokeStyle(3, 0x38bdf8);
    pool.setDepth(-1);

    // Inner glowing water
    const water = this.add.rectangle(x, y - baseHeight / 2 - 2, baseWidth - 12, baseHeight - 10, 0x0284c7, 0.85);
    water.setDepth(-1);

    // Central marble pillar
    const pillar = this.add.rectangle(x, y - 48, 36, 44, 0x334155);
    pillar.setStrokeStyle(2, 0x38bdf8);
    pillar.setDepth(-1);

    // Top water bowl
    const bowl = this.add.rectangle(x, y - 72, 70, 16, 0x1e293b);
    bowl.setStrokeStyle(2, 0x38bdf8);
    bowl.setDepth(-1);

    // Animated water spray particles (rising cyan/white jets)
    for (let i = 0; i < 18; i++) {
      const drop = this.add.circle(x + Phaser.Math.Between(-24, 24), y - 76, Phaser.Math.Between(1.5, 3), 0x7dd3fc, 0.9);
      drop.setDepth(1);
      
      this.tweens.add({
        targets: drop,
        y: y - Phaser.Math.Between(110, 150),
        x: x + Phaser.Math.Between(-35, 35),
        alpha: { from: 1, to: 0.1 },
        duration: Phaser.Math.Between(700, 1300),
        repeat: -1,
        yoyo: false,
        ease: 'Cubic.easeOut',
        delay: Phaser.Math.Between(0, 1000)
      });
    }

    // Fountain title label
    this.add.text(x, y - 88, '✦ GRAND FOUNTAIN ✦', {
      fontFamily: '"Oxanium", sans-serif',
      fontSize: '11px',
      color: '#38bdf8',
      fontStyle: 'bold'
    }).setOrigin(0.5).setDepth(2);
  }

  createGrandPlazaArch(x, y) {
    // Grand REVERIE 2K27 Landmark Arch behind the central fountain
    const archWidth = 260;
    const archHeight = 170;
    const archY = y - archHeight / 2;

    // Glowing purple arch frame
    const archBg = this.add.rectangle(x, archY - 15, archWidth, archHeight, 0x12082b, 0.9);
    archBg.setStrokeStyle(3, 0xa855f7);
    archBg.setDepth(-4);

    // Arch pillars
    const leftPillar = this.add.rectangle(x - archWidth / 2 + 18, archY - 15, 32, archHeight, 0x1e1040);
    leftPillar.setStrokeStyle(2, 0xc084fc).setDepth(-3);

    const rightPillar = this.add.rectangle(x + archWidth / 2 - 18, archY - 15, 32, archHeight, 0x1e1040);
    rightPillar.setStrokeStyle(2, 0xc084fc).setDepth(-3);

    // Arch Banner Header
    const archHeader = this.add.rectangle(x, y - archHeight - 5, archWidth + 24, 42, 0x24124d);
    archHeader.setStrokeStyle(2.5, 0xfbbf24).setDepth(-3);

    // Official REVERIE Logo
    if (this.textures.exists('reverie_logo')) {
      const logo = this.add.image(x, y - archHeight - 5, 'reverie_logo');
      logo.setScale(0.36);
      logo.setDepth(-2);
    } else {
      this.add.text(x, y - archHeight - 5, 'REVERIE 2K27', {
        fontFamily: '"Oxanium", sans-serif',
        fontSize: '16px',
        color: '#ffffff',
        fontStyle: 'bold'
      }).setOrigin(0.5).setDepth(-2);
    }
  }

  createLampPost(x, y) {
    // Golden ornate pixel lamp post
    const pole = this.add.rectangle(x, y - 32, 6, 64, 0x334155);
    pole.setDepth(-1);

    const lantern = this.add.rectangle(x, y - 68, 18, 22, 0x78350f);
    lantern.setStrokeStyle(1.5, 0xfbbf24).setDepth(-1);

    // Glowing warm bulb
    const bulb = this.add.circle(x, y - 68, 6, 0xfef08a, 0.95);
    bulb.setDepth(-1);

    // Pulsing light halo
    this.tweens.add({
      targets: bulb,
      scale: { from: 1, to: 1.35 },
      alpha: { from: 0.95, to: 0.65 },
      duration: 1600,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });
  }

  createPixelTree(x, y) {
    // Decorative pixel pine/cypress garden tree
    const trunk = this.add.rectangle(x, y - 16, 12, 32, 0x78350f);
    trunk.setDepth(-2);

    const foliage1 = this.add.triangle(x, y - 48, 0, -28, -26, 14, 26, 14, 0x065f46);
    foliage1.setStrokeStyle(1.5, 0x10b981).setDepth(-2);

    const foliage2 = this.add.triangle(x, y - 68, 0, -24, -20, 12, 20, 12, 0x047857);
    foliage2.setStrokeStyle(1.5, 0x34d399).setDepth(-2);
  }
}
