import { BaseKingdomScene } from './BaseKingdomScene';
import { eventsData } from '../../data/events';
import Phaser from 'phaser';

/**
 * FlagshipKingdomScene — The Carnival & Festival Attraction District
 * Features:
 * - Grand carnival entrance archway with festive neon lightbulbs & flags
 * - Animated rotating pixel Ferris wheel with glowing gondolas in midground
 * - Dynamic sky fireworks bursting periodically
 * - 4 DISTINCT, High-Contrast Thematic Event Landmarks:
 *   1. HackTheChain: Cyber tech dome with glowing circuitry & server racks
 *   2. Carnival: Grand striped big-top pavilion marquee with balloon clusters
 *   3. ProNite: High-voltage DJ concert pavilion with speaker towers & laser beams
 *   4. Faculty Fumble: Retro arcade arena with stadium scoreboard
 * - Symmetrical coin routes, spring mushroom platform, and warp pipes
 */
export class FlagshipScene extends BaseKingdomScene {
  constructor() {
    super('FlagshipScene');
  }

  create() {
    // 1. World Base & Theme Background
    this.createBaseWorld('flagship', 'FLAGSHIP KINGDOM');

    // -------------------------------------------------------------------------
    // 2. GRAND CARNIVAL MARQUEE ENTRANCE ARCHWAY (x = 380)
    // -------------------------------------------------------------------------
    const entranceX = 380;
    const archY = 220;

    // Glowing Neon Banner
    const marqueeBg = this.add.rectangle(entranceX, archY, 540, 68, 0x140728, 0.95);
    marqueeBg.setStrokeStyle(3, 0xf59e0b).setDepth(-2);

    const innerMarquee = this.add.rectangle(entranceX, archY, 520, 50, 0x220b42, 0.9);
    innerMarquee.setStrokeStyle(1.5, 0xec4899).setDepth(-2);

    this.add.text(entranceX, archY - 12, '🎪 REVERIE CARNIVAL & ARENA 🎪', {
      fontFamily: '"Oxanium", sans-serif',
      fontSize: '17px',
      color: '#fbbf24',
      fontStyle: '900',
      letterSpacing: 2
    }).setOrigin(0.5).setDepth(-1);

    this.add.text(entranceX, archY + 14, 'HACKTHECHAIN • PRONITE • CARNIVAL • FACULTY FUMBLE', {
      fontFamily: '"Rajdhani", sans-serif',
      fontSize: '12px',
      color: '#fbcfe8',
      fontStyle: '700',
      letterSpacing: 1.5
    }).setOrigin(0.5).setDepth(-1);

    // Lightbulbs along the marquee
    for (let i = -6; i <= 6; i++) {
      const bulb = this.add.circle(entranceX + i * 40, archY - 32, 4, 0xfde047, 0.9).setDepth(-1);
      this.tweens.add({
        targets: bulb,
        alpha: 0.3,
        duration: 400 + Math.abs(i) * 60,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut'
      });
    }

    // Festive Carnival Pennant Flags atop Pillars
    this.add.image(entranceX - 260, this.groundY, 'flag').setOrigin(0.5, 1).setDepth(-2);
    this.add.image(entranceX + 260, this.groundY, 'flag').setOrigin(0.5, 1).setDepth(-2);

    // -------------------------------------------------------------------------
    // 3. ANIMATED ROTATING FERRIS WHEEL (Midground, x = 900, y = 240)
    // -------------------------------------------------------------------------
    const wheelX = 900;
    const wheelY = 240;
    const wheelRadius = 110;

    // Wheel support A-frame legs
    const leftLeg = this.add.line(0, 0, wheelX, wheelY, wheelX - 70, this.groundY, 0x581c87).setOrigin(0).setLineWidth(4).setDepth(-5);
    const rightLeg = this.add.line(0, 0, wheelX, wheelY, wheelX + 70, this.groundY, 0x581c87).setOrigin(0).setLineWidth(4).setDepth(-5);
    this.add.circle(wheelX, wheelY, 14, 0xfbbf24).setDepth(-4);

    // Rotating Wheel Spokes Container
    const wheelContainer = this.add.container(wheelX, wheelY);
    wheelContainer.setDepth(-5);

    const rim = this.add.circle(0, 0, wheelRadius, 0x000000, 0).setStrokeStyle(3, 0xa855f7, 0.7);
    const innerRim = this.add.circle(0, 0, wheelRadius * 0.55, 0x000000, 0).setStrokeStyle(2, 0xec4899, 0.6);
    wheelContainer.add([rim, innerRim]);

    // 8 Gondolas
    const gondolaColors = [0xec4899, 0x06b6d4, 0xfbbf24, 0x10b981, 0xa855f7, 0xf43f5e, 0x38bdf8, 0xfacc15];
    const gondolas = [];

    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * Math.PI * 2;
      const gx = Math.cos(angle) * wheelRadius;
      const gy = Math.sin(angle) * wheelRadius;

      // Spoke line
      const spoke = this.add.line(0, 0, 0, 0, gx, gy, 0x7c3aed, 0.6).setOrigin(0).setLineWidth(2);
      wheelContainer.add(spoke);

      // Gondola cabin
      const gondola = this.add.rectangle(gx, gy, 20, 16, gondolaColors[i], 0.95);
      gondola.setStrokeStyle(1.5, 0xffffff);
      wheelContainer.add(gondola);
      gondolas.push(gondola);
    }

    // Rotate Ferris Wheel continuously
    this.tweens.add({
      targets: wheelContainer,
      angle: 360,
      duration: 22000,
      repeat: -1,
      ease: 'Linear'
    });

    // -------------------------------------------------------------------------
    // 4. PERIODIC CELEBRATORY SKY FIREWORKS
    // -------------------------------------------------------------------------
    this.time.addEvent({
      delay: 3800,
      callback: () => {
        if (!this.cameras || !this.cameras.main) return;
        const camX = this.cameras.main.scrollX;
        const fx = camX + Phaser.Math.Between(150, 750);
        const fy = Phaser.Math.Between(70, 180);
        const fwColors = [0xfbbf24, 0xec4899, 0x06b6d4, 0xa855f7, 0x10b981];
        const chosenColor = Phaser.Utils.Array.GetRandom(fwColors);

        // Flash burst
        const flash = this.add.circle(fx, fy, 8, 0xffffff, 1).setDepth(-7);
        this.tweens.add({
          targets: flash,
          scale: 3,
          alpha: 0,
          duration: 350,
          onComplete: () => flash.destroy()
        });

        // 16 radiating sparks
        for (let s = 0; s < 16; s++) {
          const sparkAngle = (s / 16) * Math.PI * 2;
          const dist = Phaser.Math.Between(25, 60);
          const spark = this.add.circle(fx, fy, 2.5, chosenColor, 1).setDepth(-7);

          this.tweens.add({
            targets: spark,
            x: fx + Math.cos(sparkAngle) * dist,
            y: fy + Math.sin(sparkAngle) * dist + 15,
            alpha: 0,
            scale: 0.2,
            duration: Phaser.Math.Between(600, 950),
            ease: 'Quad.easeOut',
            onComplete: () => spark.destroy()
          });
        }
      },
      loop: true
    });

    // -------------------------------------------------------------------------
    // 5. RETURN PIPE & CHAMP BOT NPC
    // -------------------------------------------------------------------------
    this.addWarpPipe(130, this.groundY, {
      color: 'yellow',
      targetScene: 'StartingKingdomScene',
      destinationName: '◀ RETURN TO START HUB',
      spawnPoint: { x: 2740, y: this.groundY - 60 }
    });

    this.addNPC(260, this.groundY, 'CHAMP BOT', 'Welcome to Flagship Kingdom! Step up to HackTheChain, Carnival, ProNite and Faculty Fumble!');

    // Interactive In-World Retro Arcade Cabinet in Carnival Entrance
    const arcadeKioskData = {
      id: 'carnival-arcade',
      title: 'ARCADE CABINET',
      category: 'flagship',
      tagline: '5 RETRO MINI-GAMES • SPONSOR SHOOTER • RUNNER • SNAKE',
      shortDesc: 'Step up to the retro arcade machine to play 90s classics, set high scores, and earn coins for the Rewards Shop.',
      description: 'Step up to the retro arcade machine to play 90s classics, set high scores, and earn coins for the Rewards Shop.',
      customModal: 'arcade'
    };
    this.addEventPortal(450, this.groundY, arcadeKioskData);

    const flagEvents = eventsData.filter(e => e.category === 'flagship');

    // -------------------------------------------------------------------------
    // 6. LANDMARK 1: HACKTHECHAIN (x = 640) — CYBER TECH ARENA
    // -------------------------------------------------------------------------
    const hackX = 640;
    // Cyber arena building facade
    const cyberBase = this.add.rectangle(hackX, this.groundY - 65, 140, 130, 0x090518, 0.98);
    cyberBase.setStrokeStyle(3, 0x06b6d4).setDepth(-3);

    // Server rack glowing status panels
    for (let r = 0; r < 3; r++) {
      const rack = this.add.rectangle(hackX - 45 + r * 45, this.groundY - 65, 26, 90, 0x0c152e, 0.9);
      rack.setStrokeStyle(1.5, 0x38bdf8).setDepth(-3);
      // Blinking LEDs
      for (let l = 0; l < 4; l++) {
        const led = this.add.circle(hackX - 45 + r * 45, this.groundY - 95 + l * 18, 2.5, l % 2 === 0 ? 0x22d3ee : 0xec4899);
        led.setDepth(-2);
        this.tweens.add({
          targets: led,
          alpha: 0.2,
          duration: 300 + l * 150,
          yoyo: true,
          repeat: -1
        });
      }
    }

    // Cyber Arena Marquee
    const hackMarquee = this.add.rectangle(hackX, this.groundY - 140, 130, 26, 0x082f49);
    hackMarquee.setStrokeStyle(2, 0x38bdf8).setDepth(-2);
    this.add.text(hackX, this.groundY - 140, '⚡ HACK ARENA ⚡', {
      fontFamily: '"Oxanium", sans-serif',
      fontSize: '11px',
      color: '#38bdf8',
      fontStyle: 'bold'
    }).setOrigin(0.5).setDepth(-2);

    const hack = flagEvents.find(e => e.id === 'hackthechain');
    if (hack) this.addEventPortal(hackX, this.groundY, hack);

    // Jumpable Mushroom Spring
    this.addMushroomPlatform(820, this.groundY);
    this.addCoin(820, 420);

    // -------------------------------------------------------------------------
    // 7. LANDMARK 2: CARNIVAL BIG-TOP PAVILION (x = 1140)
    // -------------------------------------------------------------------------
    const carnX = 1140;

    // Red & Gold Carnival Tent Pavilion
    const tentRoof = this.add.triangle(carnX, this.groundY - 150, 0, 0, -80, 70, 80, 70, 0xbe123c);
    tentRoof.setStrokeStyle(2.5, 0xfbbf24).setDepth(-3);

    const tentBase = this.add.rectangle(carnX, this.groundY - 50, 150, 100, 0x180824, 0.95);
    tentBase.setStrokeStyle(3, 0xf59e0b).setDepth(-3);

    // Striped awning
    for (let st = -2; st <= 2; st++) {
      const stripe = this.add.rectangle(carnX + st * 26, this.groundY - 80, 14, 20, st % 2 === 0 ? 0xfbbf24 : 0xe11d48);
      stripe.setDepth(-2);
    }

    // Balloon Cluster floating above Carnival
    const balloonColors = [0xec4899, 0xfbbf24, 0x06b6d4];
    balloonColors.forEach((bColor, bi) => {
      const bx = carnX - 25 + bi * 25;
      const by = this.groundY - 195 - (bi % 2) * 12;
      const bCircle = this.add.circle(bx, by, 9, bColor, 0.95).setDepth(-2);
      this.add.line(0, 0, bx, by + 9, bx, by + 28, 0xffffff, 0.4).setOrigin(0).setLineWidth(1).setDepth(-2);
      this.tweens.add({
        targets: bCircle,
        y: by - 8,
        duration: 1400 + bi * 200,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut'
      });
    });

    const carnival = flagEvents.find(e => e.id === 'carnival');
    if (carnival) this.addEventPortal(carnX, this.groundY, carnival);

    // Elevated Platform with Coins
    this.createElevatedPlatform(1340, 420, 6, 'grass');
    this.addCoinsInRow(1360, 360, 5, 46);
    this.addQuestionBlock(1460, 310);

    // -------------------------------------------------------------------------
    // 8. LANDMARK 3: PRONITE DJ CONCERT PAVILION (x = 1720)
    // -------------------------------------------------------------------------
    const proX = 1720;

    // Massive Concert Stage Rig
    const stageRoof = this.add.rectangle(proX, this.groundY - 150, 170, 24, 0x2e1065);
    stageRoof.setStrokeStyle(2.5, 0xec4899).setDepth(-3);

    // Symmetrical Dual Speaker Walls
    this.add.image(proX - 70, this.groundY, 'speaker_stack').setOrigin(0.5, 1).setDepth(-3);
    this.add.image(proX + 70, this.groundY, 'speaker_stack').setOrigin(0.5, 1).setDepth(-3);

    // Pulsing Bass Woofer Animation
    const leftWooferGlow = this.add.circle(proX - 70, this.groundY - 45, 18, 0xec4899, 0.4).setDepth(-3);
    const rightWooferGlow = this.add.circle(proX + 70, this.groundY - 45, 18, 0xec4899, 0.4).setDepth(-3);
    this.tweens.add({
      targets: [leftWooferGlow, rightWooferGlow],
      scale: 1.4,
      alpha: 0.1,
      duration: 480,
      yoyo: true,
      repeat: -1
    });

    // Overhead Moving Laser Beams
    const laserLeft = this.add.line(0, 0, proX, this.groundY - 140, proX - 120, 80, 0xec4899, 0.35).setOrigin(0).setLineWidth(3).setDepth(-4);
    const laserRight = this.add.line(0, 0, proX, this.groundY - 140, proX + 120, 80, 0x06b6d4, 0.35).setOrigin(0).setLineWidth(3).setDepth(-4);
    this.tweens.add({
      targets: laserLeft,
      x2: proX - 40,
      duration: 1800,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });
    this.tweens.add({
      targets: laserRight,
      x2: proX + 40,
      duration: 1800,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });

    const pronite = flagEvents.find(e => e.id === 'pronite');
    if (pronite) this.addEventPortal(proX, this.groundY, pronite);

    // Elevated Platform 2
    this.createElevatedPlatform(1940, 410, 5, 'grass');
    this.addCoinsInRow(1960, 350, 4, 46);

    // -------------------------------------------------------------------------
    // 9. LANDMARK 4: FACULTY FUMBLE RETRO ARENA (x = 2300)
    // -------------------------------------------------------------------------
    const facX = 2300;

    // Stadium Scoreboard Arch
    const stadiumArch = this.add.rectangle(facX, this.groundY - 70, 150, 140, 0x0e0622, 0.98);
    stadiumArch.setStrokeStyle(3, 0xfbbf24).setDepth(-3);

    // Illuminated Electronic Scoreboard
    const scoreboard = this.add.rectangle(facX, this.groundY - 150, 160, 40, 0x170b33);
    scoreboard.setStrokeStyle(2, 0xf59e0b).setDepth(-2);

    this.add.text(facX, this.groundY - 160, 'FACULTY vs STUDENTS', {
      fontFamily: '"Oxanium", sans-serif',
      fontSize: '11px',
      color: '#fde047',
      fontStyle: 'bold'
    }).setOrigin(0.5).setDepth(-2);

    this.add.text(facX, this.groundY - 142, 'SCORE: 2027 • FINAL SHOWDOWN', {
      fontFamily: '"Rajdhani", sans-serif',
      fontSize: '10px',
      color: '#a7f3d0',
      fontStyle: 'bold'
    }).setOrigin(0.5).setDepth(-2);

    const faculty = flagEvents.find(e => e.id === 'faculty-fumble');
    if (faculty) this.addEventPortal(facX, this.groundY, faculty);

    // -------------------------------------------------------------------------
    // 10. FORWARD WARP PIPE TO FESTIVAL PLAZA (x = 2580) & FINISH FLAG
    // -------------------------------------------------------------------------
    this.addWarpPipe(2580, this.groundY, {
      color: 'white',
      targetScene: 'FestivalPlazaScene',
      destinationName: 'WARP TO FESTIVAL PLAZA ▶',
      spawnPoint: { x: 160, y: this.groundY - 60 }
    });

    this.add.image(2780, this.groundY, 'flag').setOrigin(0.5, 1);
  }
}
