import { BaseKingdomScene } from './BaseKingdomScene';
import { eventsData } from '../../data/events';
import Phaser from 'phaser';

export class CultureKingdomScene extends BaseKingdomScene {
  constructor() {
    super('CultureKingdomScene');
  }

  create() {
    // 1. Initialize Base World with 'culture' theme & 3200px width
    this.createBaseWorld('culture', 'CULTURE KINGDOM');

    // 2. Grand Sky Concert Marquee Banner (Placed high at y: 140)
    const bannerX = 540;
    const bannerY = 140;
    const banner = this.add.rectangle(bannerX, bannerY, 620, 56, 0x1f0638, 0.95);
    banner.setStrokeStyle(2.5, 0xec4899);
    banner.setDepth(-2);

    this.add.text(bannerX, bannerY - 12, '✨ ZONE C: CULTURE KINGDOM & CONCERT DISTRICT ✨', {
      fontFamily: '"Oxanium", sans-serif',
      fontSize: '16px',
      color: '#f472b6',
      fontStyle: 'bold'
    }).setOrigin(0.5).setDepth(-1);

    this.add.text(bannerX, bannerY + 12, '7 LIVE SHOWS • RUNWAYS • BATTLES • HEADLINE CONCERTS', {
      fontFamily: '"Rajdhani", sans-serif',
      fontSize: '13px',
      color: '#fbcfe8',
      fontStyle: '600'
    }).setOrigin(0.5).setDepth(-1);

    // =========================================================================
    // 3. RETURN PIPE (Connects back to Starting Kingdom Hub)
    // =========================================================================
    this.addWarpPipe(140, this.groundY, {
      color: 'yellow',
      targetScene: 'StartingKingdomScene',
      destinationName: 'STARTING HUB',
      spawnPoint: { x: 2440, y: this.groundY - 60 }
    });

    // =========================================================================
    // 4. CULTURAL GUIDE NPC: DISCO BOT AT DJ BOOTH
    // =========================================================================
    this.createDjBooth(280, this.groundY);
    this.addNPC(280, this.groundY, 'DISCO BOT', 'Welcome to Culture Kingdom! Walk up to the concert stages and arenas to explore events and register!');

    // Animated Pixel Crowd in Foreground/Midground
    this.createCrowdSilhouettes(360, 420);

    const cultEvents = eventsData.filter(e => e.category === 'cultural');

    // =========================================================================
    // 5. EVENT 1: BOTANICAL BID (Illuminated Greenhouse Pavilion)
    // =========================================================================
    const botanicalBid = cultEvents.find(e => e.id === 'botanical-bid');
    this.createBotanicalGreenhouse(540, this.groundY);
    if (botanicalBid) {
      this.addEventPortal(540, this.groundY, botanicalBid);
    }

    // Elevated Stage Terrace 1
    this.createElevatedPlatform(680, 430, 6, 'culture');
    this.addCoinsInRow(700, 370, 5, 46);

    // =========================================================================
    // 6. EVENT 2: AMONG US (Futuristic Spaceship Air-Lock & Meeting Pod)
    // =========================================================================
    const amongUs = cultEvents.find(e => e.id === 'among-us');
    this.createSpaceshipAirlock(820, 430);
    if (amongUs) {
      this.addEventPortal(820, 430, amongUs);
    }

    // Symmetrical Speaker Tower Left of Mainstage
    this.createSpeakerTower(1000, this.groundY);

    // =========================================================================
    // 7. EVENT 3: BAND NIGHT (Live Rock Concert Stage & Truss Rig)
    // =========================================================================
    const bandNight = cultEvents.find(e => e.id === 'band-night');
    this.createLiveBandStage(1200, this.groundY);
    if (bandNight) {
      this.addEventPortal(1200, this.groundY, bandNight);
    }

    // Animated Crowd behind main stage
    this.createCrowdSilhouettes(1060, 380);

    // Symmetrical Speaker Tower Right of Mainstage
    this.createSpeakerTower(1400, this.groundY);

    // Elevated Stage Terrace 2
    this.createElevatedPlatform(1520, 410, 6, 'culture');
    this.addCoinsInRow(1540, 350, 5, 46);

    // =========================================================================
    // 8. EVENT 4: SQUID GAME (Elimination Arena with ○ △ □ Shapes)
    // =========================================================================
    const squidGame = cultEvents.find(e => e.id === 'squid-game');
    this.createSquidArena(1660, 410);
    if (squidGame) {
      this.addEventPortal(1660, 410, squidGame);
    }

    // =========================================================================
    // 9. EVENT 5: CONCERT NIGHT (Grand Headline Festival Amphitheater)
    // =========================================================================
    const concertNight = cultEvents.find(e => e.id === 'concert-night');
    this.createConcertMainstage(1960, this.groundY);
    if (concertNight) {
      this.addEventPortal(1960, this.groundY, concertNight);
    }

    // Elevated Catwalk Platform 3
    this.createElevatedPlatform(2160, 430, 6, 'culture');
    this.addCoinsInRow(2180, 370, 5, 46);

    // =========================================================================
    // 10. EVENT 6: FASHION SHOW (LED Runway Catwalk)
    // =========================================================================
    const fashionShow = cultEvents.find(e => e.id === 'fashion-show');
    this.createFashionRunway(2300, 430);
    if (fashionShow) {
      this.addEventPortal(2300, 430, fashionShow);
    }

    // =========================================================================
    // 11. EVENT 7: DANCE BATTLE (Neon Street Battle Arena)
    // =========================================================================
    const danceBattle = cultEvents.find(e => e.id === 'dance-battle');
    this.createDanceBattleArena(2580, this.groundY);
    if (danceBattle) {
      this.addEventPortal(2580, this.groundY, danceBattle);
    }

    // =========================================================================
    // 12. FORWARD WARP PIPE TO ARCADE
    // =========================================================================
    this.addWarpPipe(2860, this.groundY, {
      color: 'yellow',
      targetScene: 'arcade',
      isArcade: true,
      destinationName: 'ARCADE',
      spawnPoint: { x: 160, y: this.groundY - 60 }
    });

    // Festival Flag at boundary
    this.add.image(3080, this.groundY, 'flag').setOrigin(0.5, 1);
  }

  // ===========================================================================
  // DISTINCT EVENT ARCHITECTURAL LANDMARKS
  // ===========================================================================

  createBotanicalGreenhouse(x, y) {
    // Illuminated greenhouse pavilion with translucent glass allowing concert backdrop to shine through
    const glass = this.add.rectangle(x, y - 55, 96, 110, 0x064e3b, 0.45);
    glass.setStrokeStyle(2, 0x10b981).setDepth(-3);

    // Glass roof gable
    const roof = this.add.triangle(x, y - 120, 0, -22, -48, 14, 48, 14, 0x047857, 0.6);
    roof.setStrokeStyle(2, 0x34d399).setDepth(-3);

    // Interior floral glow
    const floral = this.add.circle(x, y - 48, 18, 0x10b981, 0.4);
    floral.setDepth(-2);
    this.tweens.add({
      targets: floral,
      alpha: { from: 0.25, to: 0.6 },
      duration: 1800,
      yoyo: true,
      repeat: -1
    });
  }

  createSpaceshipAirlock(x, y) {
    // Futuristic Among Us space pod with glowing inspection portal
    const pod = this.add.rectangle(x, y - 50, 92, 100, 0x1e1b4b, 0.55);
    pod.setStrokeStyle(2.5, 0xef4444).setDepth(-3);

    // Oval inspection window
    const windowGlass = this.add.ellipse(x, y - 62, 52, 28, 0x06b6d4, 0.85);
    windowGlass.setStrokeStyle(2, 0xffffff).setDepth(-2);

    // Emergency red siren on roof
    const siren = this.add.circle(x, y - 106, 6, 0xef4444, 0.95);
    siren.setDepth(-2);
    this.tweens.add({
      targets: siren,
      alpha: { from: 0.3, to: 1 },
      scale: { from: 0.8, to: 1.3 },
      duration: 600,
      yoyo: true,
      repeat: -1
    });
  }

  createLiveBandStage(x, y) {
    // Stage truss background
    const truss = this.add.rectangle(x, y - 80, 150, 160, 0x18052e, 0.9);
    truss.setStrokeStyle(2.5, 0xec4899).setDepth(-4);

    // LED Equalizer display on stage backdrop
    this.createAnimatedEqualizer(x, y - 100, 110, 48);

    // Drum kit & guitar silhouette hint
    const ampL = this.add.rectangle(x - 48, y - 28, 24, 44, 0x0f172a);
    ampL.setStrokeStyle(1.5, 0xf472b6).setDepth(-2);

    const ampR = this.add.rectangle(x + 48, y - 28, 24, 44, 0x0f172a);
    ampR.setStrokeStyle(1.5, 0xf472b6).setDepth(-2);
  }

  createSquidArena(x, y) {
    // Arena marquee with ○ △ □ shapes
    const arena = this.add.rectangle(x, y - 52, 110, 104, 0x1f0827, 0.9);
    arena.setStrokeStyle(2.5, 0xf43f5e).setDepth(-3);

    // Retro Shapes: Circle, Triangle, Square
    this.add.circle(x - 28, y - 68, 8, 0xf43f5e).setStrokeStyle(1.5, 0xffffff).setDepth(-2);
    this.add.triangle(x, y - 68, 0, -10, -9, 8, 9, 8, 0xf43f5e).setStrokeStyle(1.5, 0xffffff).setDepth(-2);
    this.add.rectangle(x + 28, y - 68, 16, 16, 0xf43f5e).setStrokeStyle(1.5, 0xffffff).setDepth(-2);
  }

  createConcertMainstage(x, y) {
    // Giant Festival Mainstage Arch
    const stageWidth = 200;
    const stageHeight = 180;
    const arch = this.add.rectangle(x, y - stageHeight / 2, stageWidth, stageHeight, 0x150326, 0.95);
    arch.setStrokeStyle(3, 0xa855f7).setDepth(-4);

    // Sweeping Stage Spotlights (Non-occluding, low alpha)
    const beamL = this.add.triangle(x - 70, y - 140, 0, 0, -35, -280, 35, -280, 0xec4899, 0.15);
    beamL.setDepth(-5);
    this.tweens.add({
      targets: beamL,
      angle: { from: -18, to: 18 },
      duration: 3400,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });

    const beamR = this.add.triangle(x + 70, y - 140, 0, 0, -35, -280, 35, -280, 0x06b6d4, 0.15);
    beamR.setDepth(-5);
    this.tweens.add({
      targets: beamR,
      angle: { from: 18, to: -18 },
      duration: 3800,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });

    // Mainstage Equalizer Wall
    this.createAnimatedEqualizer(x, y - 110, 140, 60);
  }

  createFashionRunway(x, y) {
    // Catwalk LED platform
    const runway = this.add.rectangle(x, y - 48, 110, 96, 0x1e082f, 0.9);
    runway.setStrokeStyle(2.5, 0xec4899).setDepth(-3);

    // Runway floodlight bulbs
    for (let i = -40; i <= 40; i += 20) {
      const bulb = this.add.circle(x + i, y - 88, 3.5, 0xfde047, 0.9);
      bulb.setDepth(-2);
    }
  }

  createDanceBattleArena(x, y) {
    // Street Dance Cypher Ring
    const cypher = this.add.rectangle(x, y - 50, 116, 100, 0x1b0a38, 0.9);
    cypher.setStrokeStyle(2.5, 0x8b5cf6).setDepth(-3);

    this.add.text(x, y - 68, 'CYPHER ARENA', {
      fontFamily: '"Oxanium", sans-serif',
      fontSize: '9px',
      color: '#c084fc',
      fontStyle: 'bold'
    }).setOrigin(0.5).setDepth(-2);
  }

  createDjBooth(x, y) {
    // DJ table with turntable decks
    const table = this.add.rectangle(x, y - 24, 76, 44, 0x110826);
    table.setStrokeStyle(2, 0xec4899).setDepth(-1);

    const deckL = this.add.circle(x - 18, y - 36, 10, 0x1e293b).setStrokeStyle(1.5, 0x06b6d4).setDepth(-1);
    const deckR = this.add.circle(x + 18, y - 36, 10, 0x1e293b).setStrokeStyle(1.5, 0xec4899).setDepth(-1);
  }

  createSpeakerTower(x, y) {
    // Concert Speaker Tower with pulsing subwoofers
    const tower = this.add.rectangle(x, y - 75, 44, 150, 0x0f172a);
    tower.setStrokeStyle(2, 0x334155).setDepth(-3);

    // 4 Speaker Cones
    for (let dy = -120; dy <= -30; dy += 30) {
      const cone = this.add.circle(x, y + dy, 10, 0x1e293b);
      cone.setStrokeStyle(1.5, 0xec4899).setDepth(-2);
      this.tweens.add({
        targets: cone,
        scale: { from: 1, to: 1.15 },
        duration: 480,
        yoyo: true,
        repeat: -1,
        ease: 'Cubic.easeInOut',
        delay: Math.abs(dy) * 4
      });
    }
  }

  createCrowdSilhouettes(startX, width) {
    // Layered pixel-art crowd heads bobbing to the music
    for (let x = startX; x < startX + width; x += 18) {
      const head = this.add.circle(x, this.groundY - 18, Phaser.Math.Between(6, 9), 0x2e104f, 0.85);
      head.setDepth(-2);
      this.tweens.add({
        targets: head,
        y: this.groundY - Phaser.Math.Between(20, 26),
        duration: Phaser.Math.Between(360, 600),
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut'
      });
    }
  }

  createAnimatedEqualizer(x, y, width, height) {
    const barWidth = 6;
    const gap = 3;
    const numBars = Math.floor(width / (barWidth + gap));
    const startX = x - (numBars * (barWidth + gap)) / 2 + barWidth / 2;

    for (let i = 0; i < numBars; i++) {
      const bx = startX + i * (barWidth + gap);
      const initialH = Phaser.Math.Between(8, height);
      const bar = this.add.rectangle(bx, y + height / 2 - initialH / 2, barWidth, initialH, 0xec4899, 0.9);
      bar.setDepth(-3);

      this.tweens.add({
        targets: bar,
        height: { from: 6, to: height },
        y: { from: y + height / 2 - 3, to: y },
        duration: Phaser.Math.Between(220, 480),
        yoyo: true,
        repeat: -1,
        ease: 'Quad.easeInOut',
        delay: i * 35
      });
    }
  }
}
