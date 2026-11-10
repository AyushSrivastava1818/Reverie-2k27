import Phaser from 'phaser';
import { Player } from '../entities/Player';
import { WarpPipe } from '../entities/WarpPipe';
import { EventPortal } from '../entities/EventPortal';
import { Collectible } from '../entities/Collectible';
import { NPC } from '../entities/NPC';
import { eventBus } from '../EventBus';
import { soundEngine } from '../systems/SoundEngine';
import { achievementSystem } from '../systems/AchievementSystem';

export class BaseKingdomScene extends Phaser.Scene {
  constructor(key) {
    super(key);
    this.sceneKey = key;
    this.worldWidth = 3200;
    this.worldHeight = 720;
    this.groundY = 560;
    this.blockSize = 48;
    this.pipes = [];
    this.eventPortals = [];
    this.collectibles = [];
    this.npcs = [];
    this.props = [];
    this.isTransitioning = false;
  }

  init(data) {
    this.spawnData = data || {};
    this.isTransitioning = false;
    this.pipes = [];
    this.eventPortals = [];
    this.collectibles = [];
    this.npcs = [];
    this.props = [];
  }

  createBaseWorld(theme = 'grass', zoneName = 'ZONE') {
    // Set physics world bounds
    this.physics.world.setBounds(0, 0, this.worldWidth, this.worldHeight);

    // Parallax Backgrounds
    this.createParallaxBackgrounds(theme);

    // Platform static group
    this.platforms = this.physics.add.staticGroup();

    // Create ground across world width using chunky 48x48 blocks
    this.createGround(theme);

    // Create Keyboard controls
    this.cursors = this.input.keyboard.createCursorKeys();
    this.keys = this.input.keyboard.addKeys({
      W: Phaser.Input.Keyboard.KeyCodes.W,
      A: Phaser.Input.Keyboard.KeyCodes.A,
      S: Phaser.Input.Keyboard.KeyCodes.S,
      D: Phaser.Input.Keyboard.KeyCodes.D,
      E: Phaser.Input.Keyboard.KeyCodes.E,
      SPACE: Phaser.Input.Keyboard.KeyCodes.SPACE
    });

    // Spawn player
    const spawnX = this.spawnData.spawnPoint ? this.spawnData.spawnPoint.x : 140;
    const spawnY = this.spawnData.spawnPoint ? this.spawnData.spawnPoint.y : this.groundY - 60;

    this.player = new Player(this, spawnX, spawnY);
    this.physics.add.collider(this.player, this.platforms);

    // If entering from pipe, play exit animation
    if (this.spawnData.fromPipe) {
      this.player.exitPipe(spawnX, spawnY);
    }

    // Camera setup - Wide, chunky, edge-to-edge
    this.setupCamera();

    // Listen to resize
    this.scale.on('resize', this.handleResize, this);

    // Proximity check timer
    this.time.addEvent({
      delay: 100,
      callback: this.checkProximities,
      callbackScope: this,
      loop: true
    });

    // Key E interaction listener
    this.keys.E.on('down', () => this.handleInteraction());

    // Mobile interact listener
    this.unbindMobileInteract = eventBus.on('mobile-interact', () => {
      this.handleInteraction();
    });

    // Direct scene switch request (from fast travel navigation)
    this.unbindSwitchZone = eventBus.on('switch-zone', (zoneKey) => {
      if (zoneKey !== this.sceneKey && !this.isTransitioning) {
        this.isTransitioning = true;
        this.cameras.main.fade(300, 10, 6, 20, false, (cam, progress) => {
          if (progress === 1) {
            this.scene.start(zoneKey, {
              fromPipe: false,
              spawnPoint: { x: 140, y: this.groundY - 60 }
            });
          }
        });
      }
    });

    // Pause / Resume listener when dialogue / modals are open
    this.isGamePaused = false;
    this.unbindGamePaused = eventBus.on('game-paused', (paused) => {
      this.isGamePaused = !!paused;
      if (this.player && this.player.body && paused) {
        this.player.setVelocityX(0);
        if (this.player.anims) this.player.anims.play(`${this.player.currentSkin}-idle`, true);
      }
    });

    // Atmospheric Ambient Glowing Floating Particles
    this.createAmbientEffects(theme);

    // Record zone visited in Quest System
    this.zoneName = zoneName;
    achievementSystem.recordZone(this.sceneKey);

    // Notify React of current zone
    eventBus.emit('zone-entered', {
      zoneKey: this.sceneKey,
      zoneName: zoneName
    });
  }

  createAmbientEffects(theme) {
    const particleColors = {
      grass: [0xa855f7, 0xf472b6, 0xfef08a],
      tech: [0x06b6d4, 0x3b82f6, 0x22d3ee],
      culture: [0xec4899, 0xa855f7, 0xf43f5e],
      flagship: [0xfbbf24, 0xf59e0b, 0xa855f7],
      plaza: [0xfbbf24, 0x06b6d4, 0xec4899, 0x10b981]
    };
    const colors = particleColors[theme] || particleColors.grass;

    for (let i = 0; i < 45; i++) {
      const px = Phaser.Math.Between(0, this.worldWidth);
      const py = Phaser.Math.Between(100, this.groundY);
      const col = Phaser.Utils.Array.GetRandom(colors);
      const dot = this.add.circle(px, py, Phaser.Math.Between(1.5, 3), col, 0.75);
      dot.setDepth(-2);

      this.tweens.add({
        targets: dot,
        y: py - Phaser.Math.Between(30, 80),
        x: px + Phaser.Math.Between(-30, 30),
        alpha: { from: 0.85, to: 0.15 },
        duration: Phaser.Math.Between(2400, 4200),
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut',
        delay: Phaser.Math.Between(0, 2000)
      });
    }

    // Periodic Shooting Stars across the upper atmosphere
    this.time.addEvent({
      delay: 5500,
      callback: () => {
        if (!this.cameras || !this.cameras.main) return;
        const camX = this.cameras.main.scrollX;
        const startX = camX + Phaser.Math.Between(100, 700);
        const startY = Phaser.Math.Between(30, 110);
        const star = this.add.circle(startX, startY, 2.5, 0xffffff, 1);
        star.setDepth(-10);

        const trail = this.add.line(0, 0, startX, startY, startX - 35, startY - 18, 0x38bdf8, 0.8);
        trail.setLineWidth(1.5).setDepth(-10);

        this.tweens.add({
          targets: [star, trail],
          x: '+=240',
          y: '+=120',
          alpha: 0,
          duration: 480,
          ease: 'Cubic.easeOut',
          onComplete: () => {
            star.destroy();
            trail.destroy();
          }
        });
      },
      loop: true
    });
  }

  setupCamera() {
    const isMobile = window.innerWidth < 768;
    const height = this.scale.height || window.innerHeight;
    const targetZoom = isMobile 
      ? Math.min(1.15, Math.max(0.85, height / 580)) 
      : Math.min(1.25, Math.max(0.95, height / 560));

    this.cameras.main.setBounds(0, 0, this.worldWidth, this.worldHeight);
    this.cameras.main.setZoom(targetZoom);
    // Vertical offset (65px) anchors player in lower third, giving full headroom to upper platforms & question blocks!
    this.cameras.main.startFollow(this.player, true, 0.08, 0.08, 0, 65);
    this.cameras.main.fadeIn(400, 10, 6, 20);
  }

  handleResize(gameSize) {
    if (this.cameras && this.cameras.main) {
      const height = gameSize ? gameSize.height : this.scale.height;
      const isMobile = window.innerWidth < 768;
      const targetZoom = isMobile 
        ? Math.min(1.15, Math.max(0.85, height / 580)) 
        : Math.min(1.25, Math.max(0.95, height / 560));
      this.cameras.main.setZoom(targetZoom);
    }
  }

  createParallaxBackgrounds(theme) {
    // -------------------------------------------------------------------------
    // 1. FULL-SCREEN PROCEDURAL SKY GRADIENT (Distinct atmospheric color per realm!)
    // -------------------------------------------------------------------------
    const skyG = this.add.graphics();
    skyG.setDepth(-20);
    skyG.setScrollFactor(0);

    const camH = 720;
    const camW = 1280;

    const skyThemes = {
      grass: { top: 0x090317, bot: 0x2e1065 },     // Twilight Violet Fantasy
      tech: { top: 0x020617, bot: 0x082f49 },      // Electric Cyber Navy to Teal
      culture: { top: 0x15021e, bot: 0x58085c },   // Hot Magenta & Concert Velvet
      flagship: { top: 0x180521, bot: 0x831843 },  // Synthwave Sunset Horizon
      plaza: { top: 0x090d21, bot: 0x251e56 }      // Grand Expo Night Sky
    };
    const currentSky = skyThemes[theme] || skyThemes.grass;
    skyG.fillGradientStyle(currentSky.top, currentSky.top, currentSky.bot, currentSky.bot, 1);
    skyG.fillRect(0, 0, camW * 1.5, camH * 1.5);

    // -------------------------------------------------------------------------
    // 2. THEME-SPECIFIC DISTINCT SKY & HORIZON VISUAL ELEMENTS
    // -------------------------------------------------------------------------
    if (theme === 'tech') {
      // ═══════════════════════════════════════════════════════════════════════
      // TECH REALM: TRON MATRIX GRID + TOWERING SKYSCRAPERS + CODE RAIN
      // ═══════════════════════════════════════════════════════════════════════
      
      // Cyber Perspective Grid on the Horizon
      const gridG = this.add.graphics();
      gridG.setDepth(-16);
      gridG.setScrollFactor(0.12, 0);
      gridG.lineStyle(1.5, 0x06b6d4, 0.45);
      for (let gy = 360; gy <= this.groundY; gy += 18) {
        gridG.lineBetween(0, gy, this.worldWidth, gy);
      }
      for (let gx = 0; gx < this.worldWidth; gx += 50) {
        gridG.lineBetween(gx, 360, gx, this.groundY);
      }

      // Parallax Skyscraper Silhouettes with Lit Windows
      const cityG = this.add.graphics();
      cityG.setDepth(-14);
      cityG.setScrollFactor(0.18, 0.08);

      const buildingColors = [0x071526, 0x0c2138, 0x051b2e];
      const windowColors = [0x38bdf8, 0x22d3ee, 0xf43f5e, 0xfacc15, 0x10b981];

      for (let bx = 0; bx < this.worldWidth; bx += Phaser.Math.Between(70, 130)) {
        const bWidth = Phaser.Math.Between(55, 110);
        const bHeight = Phaser.Math.Between(260, 480);
        const bY = this.groundY - bHeight;

        // Building Body
        cityG.fillStyle(Phaser.Utils.Array.GetRandom(buildingColors), 0.95);
        cityG.fillRect(bx, bY, bWidth, bHeight);

        // Neon Rooftop Accent Line
        cityG.lineStyle(2, 0x06b6d4, 0.8);
        cityG.lineBetween(bx, bY, bx + bWidth, bY);

        // Antenna with blinking beacon
        if (bx % 3 === 0) {
          cityG.lineStyle(1.5, 0x38bdf8, 0.7);
          cityG.lineBetween(bx + bWidth / 2, bY, bx + bWidth / 2, bY - 35);
          cityG.fillStyle(0xef4444, 1);
          cityG.fillCircle(bx + bWidth / 2, bY - 35, 2.5);
        }

        // Glowing Windows Grid
        for (let wy = bY + 20; wy < this.groundY - 30; wy += 22) {
          for (let wx = bx + 8; wx < bx + bWidth - 8; wx += 16) {
            if (Math.random() > 0.35) {
              const winCol = Phaser.Utils.Array.GetRandom(windowColors);
              cityG.fillStyle(winCol, Math.random() > 0.5 ? 0.9 : 0.45);
              cityG.fillRect(wx, wy, 8, 12);
            }
          }
        }
      }

      // Animated Falling Matrix Code Rain / Data Streams
      for (let i = 0; i < 28; i++) {
        const streamX = Phaser.Math.Between(50, this.worldWidth - 50);
        const stream = this.add.graphics();
        stream.setDepth(-10);
        stream.setScrollFactor(0.25, 0);

        const col = i % 2 === 0 ? 0x06b6d4 : 0x10b981;
        stream.fillStyle(col, 0.75);
        const len = Phaser.Math.Between(25, 70);
        stream.fillRect(streamX, -100, 2, len);

        this.tweens.add({
          targets: stream,
          y: this.groundY + 200,
          duration: Phaser.Math.Between(2200, 4500),
          repeat: -1,
          delay: Phaser.Math.Between(0, 3000)
        });
      }

      // Neon Cyber Signboards floating on horizon
      for (let sx = 400; sx < this.worldWidth; sx += 700) {
        const signText = Phaser.Utils.Array.GetRandom([
          '⚡ TECH REALM // IIIT KOTA',
          '◈ CYBER MATRIX TERMINAL',
          '★ HACKTHECHAIN 24H',
          '▲ AI & ROBOTICS LAB'
        ]);
        const sign = this.add.text(sx, 220, signText, {
          fontFamily: '"Press Start 2P", monospace',
          fontSize: '9px',
          color: '#38bdf8'
        }).setOrigin(0.5).setDepth(-12).setScrollFactor(0.18, 0.08);

        this.tweens.add({
          targets: sign,
          alpha: { from: 0.9, to: 0.35 },
          duration: 900,
          yoyo: true,
          repeat: -1,
          ease: 'Sine.easeInOut'
        });
      }

    } else if (theme === 'culture') {
      // ═══════════════════════════════════════════════════════════════════════
      // CULTURE REALM: EDM CONCERT SEARCHLIGHTS + TRUSS RIG + LASER BEAMS
      // ═══════════════════════════════════════════════════════════════════════
      
      // Sweeping Dynamic Concert Searchlights cutting through the night
      const spotlightColors = [0xec4899, 0xa855f7, 0x06b6d4, 0xfacc15];
      for (let i = 0; i < 6; i++) {
        const lx = 300 + i * 500;
        const beam = this.add.graphics();
        beam.setDepth(-15);
        beam.setScrollFactor(0.12, 0);

        const bColor = spotlightColors[i % spotlightColors.length];
        beam.fillGradientStyle(bColor, bColor, 0x000000, 0x000000, 0.45);
        // Cone beam from ground to sky
        beam.fillTriangle(lx, this.groundY, lx - 70, 40, lx + 70, 40);

        // Sweep animation
        this.tweens.add({
          targets: beam,
          angle: { from: -24, to: 24 },
          duration: 3200 + i * 400,
          yoyo: true,
          repeat: -1,
          ease: 'Sine.easeInOut'
        });
      }

      // Stadium Concert Truss Rigging Overhead
      const trussG = this.add.graphics();
      trussG.setDepth(-8);
      trussG.setScrollFactor(0.15, 0);
      trussG.lineStyle(3, 0x334155, 0.9);
      trussG.lineBetween(0, 95, this.worldWidth, 95);
      trussG.lineBetween(0, 115, this.worldWidth, 115);

      // Truss cross bracing & colored PAR can stage lights
      const parColors = [0xef4444, 0x3b82f6, 0xfacc15, 0x10b981, 0xec4899];
      for (let tx = 30; tx < this.worldWidth; tx += 40) {
        trussG.lineStyle(1.5, 0x475569, 0.75);
        trussG.lineBetween(tx, 95, tx + 20, 115);
        trussG.lineBetween(tx + 20, 95, tx, 115);

        // Hanging PAR can light
        const parCol = Phaser.Utils.Array.GetRandom(parColors);
        const par = this.add.circle(tx + 10, 122, 5, parCol, 0.95);
        par.setDepth(-7).setScrollFactor(0.15, 0);

        this.tweens.add({
          targets: par,
          alpha: { from: 1, to: 0.2 },
          duration: Phaser.Math.Between(300, 800),
          yoyo: true,
          repeat: -1
        });
      }

      // Huge Stadium Sound Towers on Horizon
      for (let spx = 220; spx < this.worldWidth; spx += 520) {
        const spG = this.add.graphics();
        spG.setDepth(-12);
        spG.setScrollFactor(0.2, 0.05);

        // Speaker Cabinet
        spG.fillStyle(0x0f172a, 0.95);
        spG.fillRect(spx, this.groundY - 240, 60, 240);
        spG.lineStyle(2, 0xa855f7, 0.6);
        spG.strokeRect(spx, this.groundY - 240, 60, 240);

        // Speaker Cones with glowing rings
        for (let scy = this.groundY - 210; scy < this.groundY - 20; scy += 50) {
          spG.fillStyle(0x1e1b4b, 1);
          spG.fillCircle(spx + 30, scy, 18);
          spG.lineStyle(2, 0xec4899, 0.8);
          spG.strokeCircle(spx + 30, scy, 18);
          spG.fillStyle(0xf472b6, 0.9);
          spG.fillCircle(spx + 30, scy, 6);
        }
      }

      // Floating Concert Confetti / Glitter
      for (let c = 0; c < 50; c++) {
        const cx = Phaser.Math.Between(0, this.worldWidth);
        const cy = Phaser.Math.Between(100, this.groundY);
        const col = Phaser.Utils.Array.GetRandom([0xec4899, 0xfacc15, 0x06b6d4, 0xffffff, 0xa855f7]);
        const rect = this.add.rectangle(cx, cy, 4, 3, col, 0.85);
        rect.setDepth(-5);

        this.tweens.add({
          targets: rect,
          y: cy + Phaser.Math.Between(40, 100),
          x: cx + Phaser.Math.Between(-40, 40),
          angle: Phaser.Math.Between(0, 360),
          duration: Phaser.Math.Between(2500, 5000),
          yoyo: true,
          repeat: -1
        });
      }

    } else if (theme === 'flagship') {
      // ═══════════════════════════════════════════════════════════════════════
      // FLAGSHIP REALM: SYNTHWAVE SUN + RETRO WIREFRAME HORIZON + CARNIVAL
      // ═══════════════════════════════════════════════════════════════════════
      
      // Giant Synthwave Glowing Sun on Horizon
      for (let sx = 600; sx < this.worldWidth; sx += 1400) {
        const sun = this.add.graphics();
        sun.setDepth(-18);
        sun.setScrollFactor(0.04, 0);

        // Glowing outer aura
        sun.fillStyle(0xfb7185, 0.35);
        sun.fillCircle(sx, 220, 105);

        // Sun disc with horizontal raster stripes
        sun.fillGradientStyle(0xfacc15, 0xfacc15, 0xe11d48, 0xe11d48, 1);
        sun.fillCircle(sx, 220, 85);

        // Raster gap lines across lower sun half
        sun.fillStyle(0x180521, 1);
        for (let ry = 220; ry <= 295; ry += 12) {
          const thickness = 2 + (ry - 220) * 0.08;
          sun.fillRect(sx - 90, ry, 180, thickness);
        }
      }

      // Retro 3D Perspective Synthwave Horizon Grid
      const synthGrid = this.add.graphics();
      synthGrid.setDepth(-15);
      synthGrid.setScrollFactor(0.1, 0);
      synthGrid.lineStyle(1.5, 0xec4899, 0.5);
      for (let sy = 340; sy <= this.groundY; sy += 20) {
        synthGrid.lineBetween(0, sy, this.worldWidth, sy);
      }
      for (let sx = 0; sx < this.worldWidth; sx += 60) {
        synthGrid.lineBetween(sx, 340, sx, this.groundY);
      }

      // Neon Synthwave Mountain Peaks
      const mtnG = this.add.graphics();
      mtnG.setDepth(-16);
      mtnG.setScrollFactor(0.08, 0);
      mtnG.fillStyle(0x2e0854, 0.9);
      for (let mx = 0; mx < this.worldWidth; mx += 340) {
        mtnG.beginPath();
        mtnG.moveTo(mx, this.groundY);
        mtnG.lineTo(mx + 170, 240);
        mtnG.lineTo(mx + 340, this.groundY);
        mtnG.closePath();
        mtnG.fillPath();

        // Neon Mountain Ridge Line
        mtnG.lineStyle(2, 0xf43f5e, 0.85);
        mtnG.lineBetween(mx, this.groundY, mx + 170, 240);
        mtnG.lineBetween(mx + 170, 240, mx + 340, this.groundY);
      }

    } else if (theme === 'plaza') {
      // ═══════════════════════════════════════════════════════════════════════
      // FESTIVAL PLAZA: FESTIVE FIREWORKS + CAMPUS PAVILIONS + EXPO BANNERS
      // ═══════════════════════════════════════════════════════════════════════
      
      // Campus Expo Pavilion Domes in Background
      const pavG = this.add.graphics();
      pavG.setDepth(-15);
      pavG.setScrollFactor(0.12, 0);
      pavG.fillStyle(0x131a38, 0.95);
      for (let px = 200; px < this.worldWidth; px += 650) {
        // Pavilion Grand Dome
        pavG.fillCircle(px + 120, this.groundY - 140, 110);
        pavG.fillRect(px, this.groundY - 140, 240, 140);
        pavG.lineStyle(2.5, 0x38bdf8, 0.7);
        pavG.strokeRect(px, this.groundY - 140, 240, 140);
      }

      // Recurring Celebratory Fireworks Launcher
      this.time.addEvent({
        delay: 2400,
        callback: () => {
          if (!this.cameras?.main) return;
          const camX = this.cameras.main.scrollX;
          const fxX = camX + Phaser.Math.Between(80, 1000);
          const fxY = Phaser.Math.Between(90, 240);

          const fireworkCols = [0xfacc15, 0xec4899, 0x06b6d4, 0x10b981, 0xf97316, 0xffffff];
          const chosenCol = Phaser.Utils.Array.GetRandom(fireworkCols);

          for (let p = 0; p < 24; p++) {
            const angle = (p / 24) * Math.PI * 2;
            const spd = Phaser.Math.Between(40, 110);
            const spark = this.add.circle(fxX, fxY, 2.5, chosenCol, 1);
            spark.setDepth(-12);

            this.tweens.add({
              targets: spark,
              x: fxX + Math.cos(angle) * spd,
              y: fxY + Math.sin(angle) * spd + 20,
              alpha: 0,
              scale: 0.2,
              duration: Phaser.Math.Between(600, 1000),
              ease: 'Quad.easeOut',
              onComplete: () => spark.destroy()
            });
          }
        },
        loop: true
      });

    } else {
      // ═══════════════════════════════════════════════════════════════════════
      // GRASS / STARTING KINGDOM: TWILIGHT MARIO MOON + ROLLING HILLS
      // ═══════════════════════════════════════════════════════════════════════
      
      // Giant Glowing Moon
      for (let mx = 400; mx < this.worldWidth; mx += 1600) {
        const moonG = this.add.graphics();
        moonG.setDepth(-18);
        moonG.setScrollFactor(0.03, 0);

        moonG.fillStyle(0xfde047, 0.25);
        moonG.fillCircle(mx, 120, 65);
        moonG.fillStyle(0xfef08a, 0.95);
        moonG.fillCircle(mx, 120, 48);

        // Moon craters
        moonG.fillStyle(0xfacc15, 0.8);
        moonG.fillCircle(mx - 12, 110, 8);
        moonG.fillCircle(mx + 14, 130, 12);
        moonG.fillCircle(mx + 6, 104, 6);
      }

      // Rolling Fantasy Mario Hills (2 Layers)
      const hillG = this.add.graphics();
      hillG.setDepth(-15);
      hillG.setScrollFactor(0.12, 0);
      hillG.fillStyle(0x1a0d33, 0.95);
      for (let hx = 0; hx < this.worldWidth; hx += 380) {
        hillG.fillCircle(hx + 190, this.groundY - 40, 220);
      }

      const nearHillG = this.add.graphics();
      nearHillG.setDepth(-13);
      nearHillG.setScrollFactor(0.2, 0);
      nearHillG.fillStyle(0x271249, 0.95);
      for (let nhx = 80; nhx < this.worldWidth; nhx += 320) {
        nearHillG.fillCircle(nhx + 160, this.groundY - 10, 170);
      }
    }

    // -------------------------------------------------------------------------
    // 3. Ambient Cosmic Starfield (Shared subtle stars)
    // -------------------------------------------------------------------------
    for (let x = 0; x < this.worldWidth; x += 800) {
      const stars = this.add.image(x, 0, 'bg_stars').setOrigin(0, 0);
      stars.setScrollFactor(0.04, 0.04);
      stars.setDepth(-19);
      stars.setAlpha(0.65);
    }

    // -------------------------------------------------------------------------
    // 4. Drifting Living Pixel Clouds
    // -------------------------------------------------------------------------
    this.clouds = [];
    for (let i = 0; i < 8; i++) {
      const cx = (i * 420) + Phaser.Math.Between(0, 80);
      const cy = Phaser.Math.Between(35, 160);
      const cloud = this.add.image(cx, cy, 'cloud_pixel');
      cloud.setOrigin(0.5, 0.5);
      cloud.setScrollFactor(0.12, 0.12);
      cloud.setDepth(-8);
      cloud.setAlpha(0.7);
      cloud.speed = 0.2 + (i % 3) * 0.12;
      this.clouds.push(cloud);
    }
  }

  createGround(theme) {
    const blockKey = theme === 'tech' ? 'block_tech' : (theme === 'culture' ? 'block_stage' : 'block_grass');

    // Build solid tiled ground using 48x48 blocks
    for (let x = 0; x < this.worldWidth; x += this.blockSize) {
      const block = this.platforms.create(x + this.blockSize / 2, this.groundY + this.blockSize / 2, blockKey);
      block.setOrigin(0.5, 0.5);
      block.refreshBody();

      // Lower ground bedrock filler
      for (let y = this.groundY + this.blockSize * 1.5; y < this.worldHeight + this.blockSize; y += this.blockSize) {
        const under = this.add.image(x + this.blockSize / 2, y, blockKey);
        under.setTint(0x334155);
      }
    }
  }

  createElevatedPlatform(x, y, widthInBlocks, theme = 'grass') {
    const blockKey = theme === 'tech' ? 'block_tech' : (theme === 'culture' ? 'block_stage' : 'block_grass');
    for (let i = 0; i < widthInBlocks; i++) {
      const block = this.platforms.create(x + i * this.blockSize + this.blockSize / 2, y, blockKey);
      block.setOrigin(0.5, 0.5);
      block.refreshBody();
    }
  }

  addWarpPipe(x, y, options) {
    const pipe = new WarpPipe(this, x, y, options);
    this.pipes.push(pipe);
    this.physics.add.collider(this.player, pipe);
    return pipe;
  }

  addEventPortal(x, y, eventData) {
    const portal = new EventPortal(this, x, y, eventData);
    this.eventPortals.push(portal);
    this.physics.add.collider(this.player, portal);
    return portal;
  }

  addCoin(x, y) {
    const coin = new Collectible(this, x, y);
    this.collectibles.push(coin);
    this.physics.add.overlap(this.player, coin, (player, c) => {
      c.collect();
      achievementSystem.recordCoin();
    });
    return coin;
  }

  addCoinsInRow(startX, y, count, spacing = 44) {
    for (let i = 0; i < count; i++) {
      this.addCoin(startX + i * spacing, y);
    }
  }

  addNPC(x, y, name, dialogue) {
    const npc = new NPC(this, x, y, name, dialogue);
    this.npcs.push(npc);
    this.physics.add.collider(this.player, npc);
    return npc;
  }

  addMushroom(x, y) {
    const mush = this.add.image(x, y, 'mushroom_purple').setOrigin(0.5, 1);
    this.props.push(mush);
    return mush;
  }

  // Mario UniMaker Style Jumpable Mushroom Platform with Cap Collision
  addMushroomPlatform(x, y) {
    const mush = this.add.image(x, y, 'mushroom_platform').setOrigin(0.5, 1);
    mush.setDepth(-1);
    this.props.push(mush);

    // Platform hitbox directly on the rounded mushroom cap
    const capWidth = 84;
    const capHeight = 20;
    const capY = y - 66;

    const capPlatform = this.platforms.create(x, capY);
    capPlatform.setSize(capWidth, capHeight);
    capPlatform.setVisible(false); // Mushroom sprite shows visual
    capPlatform.refreshBody();

    // Bouncy feel when player lands on mushroom
    this.physics.add.collider(this.player, capPlatform, (player, plat) => {
      if (player.body.touching.down && (this.keys.W.isDown || this.keys.SPACE.isDown || player.mobileInput.jump)) {
        player.setVelocityY(-660); // Spring jump!
        soundEngine.playJump();
        // Visual squish bounce animation
        this.tweens.add({
          targets: mush,
          scaleY: 0.85,
          scaleX: 1.15,
          yoyo: true,
          duration: 120,
          ease: 'Quad.easeInOut'
        });
      }
    });

    return mush;
  }

  // Interactive Mario [?] Question Mark Block
  addQuestionBlock(x, y) {
    const block = this.platforms.create(x, y, 'qblock');
    block.setOrigin(0.5, 0.5);
    block.refreshBody();
    block.isSpent = false;

    // Detect bumping from below or landing
    this.physics.add.collider(this.player, block, (player, blk) => {
      if (blk.isSpent) return;

      // When player hits block with head (jumping from underneath)
      if (player.body.touching.up && blk.body.touching.down) {
        blk.isSpent = true;
        blk.setTexture('qblock_empty');
        soundEngine.playCoin();
        eventBus.emit('coin-collected');
        achievementSystem.recordCoin();

        // Block bounce animation
        this.tweens.add({
          targets: blk,
          y: y - 10,
          yoyo: true,
          duration: 100,
          ease: 'Quad.easeOut'
        });

        // Spawn popping coin
        const popCoin = this.add.image(x, y - 28, 'coin');
        popCoin.setScale(1.2);
        this.tweens.add({
          targets: popCoin,
          y: y - 70,
          alpha: { from: 1, to: 0 },
          scale: 1.5,
          duration: 450,
          ease: 'Cubic.easeOut',
          onComplete: () => popCoin.destroy()
        });
      }
    });

    return block;
  }

  addFestivalArch(x, y) {
    const arch = this.add.image(x, y, 'festival_arch').setOrigin(0.5, 1);
    arch.setDepth(-2);
    this.props.push(arch);
    return arch;
  }

  addSpeaker(x, y) {
    const spk = this.add.image(x, y, 'speaker_stack').setOrigin(0.5, 1);
    this.props.push(spk);
    return spk;
  }

  checkProximities() {
    if (!this.player || this.player.isEnteringPipe) return;

    this.activePipe = null;
    this.activePortal = null;
    this.activeNPC = null;

    // Check pipes
    for (const pipe of this.pipes) {
      if (pipe.checkProximity(this.player)) {
        this.activePipe = pipe;
      }
    }

    // Check portals
    for (const portal of this.eventPortals) {
      if (portal.checkProximity(this.player)) {
        this.activePortal = portal;
      }
    }

    // Check NPCs
    for (const npc of this.npcs) {
      if (npc.checkProximity(this.player)) {
        this.activeNPC = npc;
      }
    }
  }

  handleInteraction() {
    if (this.isGamePaused) return;
    if (this.activeNPC) {
      this.activeNPC.interact();
    } else if (this.activePipe) {
      this.activePipe.activate(this.player);
    } else if (this.activePortal) {
      this.activePortal.interact();
    }
  }

  update() {
    if (this.isGamePaused) return;
    if (this.player) {
      this.player.update(this.cursors, this.keys);
    }
    // Drift clouds across sky
    if (this.clouds && this.clouds.length > 0) {
      for (const cloud of this.clouds) {
        cloud.x += cloud.speed;
        if (cloud.x > this.worldWidth + 100) {
          cloud.x = -100;
        }
      }
    }
  }

  shutdown() {
    this.scale.off('resize', this.handleResize, this);
    if (this.unbindMobileInteract) this.unbindMobileInteract();
    if (this.unbindSwitchZone) this.unbindSwitchZone();
    if (this.unbindGamePaused) this.unbindGamePaused();
    if (this.player) this.player.destroy();
  }
}
