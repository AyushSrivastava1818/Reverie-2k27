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
    // 1. Stars (Fixed, slow scroll)
    for (let x = 0; x < this.worldWidth; x += 800) {
      const stars = this.add.image(x, 0, 'bg_stars').setOrigin(0, 0);
      stars.setScrollFactor(0.04, 0.04);
      stars.setDepth(-12);
    }

    // 2. Theme-Specific Distinct Backgrounds (Full visual world distinction!)
    if (theme === 'grass') {
      // Classic UniMaker / Mario Purple Fantasy Kingdom
      for (let x = 0; x < this.worldWidth; x += 800) {
        const hills = this.add.image(x, 80, 'bg_mario_hills').setOrigin(0, 0);
        hills.setScrollFactor(0.18, 0.18);
        hills.setDepth(-6);
      }
    } else if (theme === 'tech') {
      // Cyberpunk Neon Metropolis (Towering skyscrapers with glowing windows)
      for (let x = 0; x < this.worldWidth; x += 800) {
        const city = this.add.image(x, 80, 'bg_cyber_city').setOrigin(0, 0);
        city.setScrollFactor(0.24, 0.24);
        city.setDepth(-6);
      }
    } else if (theme === 'culture') {
      // Concert Stage & Beams
      for (let x = 0; x < this.worldWidth; x += 800) {
        const stage = this.add.image(x, 80, 'bg_culture').setOrigin(0, 0);
        stage.setScrollFactor(0.22, 0.22);
        stage.setDepth(-6);
      }
    } else if (theme === 'flagship') {
      // Neon Retro Arcade Hall
      for (let x = 0; x < this.worldWidth; x += 800) {
        const arcade = this.add.image(x, 80, 'bg_arcade_hall').setOrigin(0, 0);
        arcade.setScrollFactor(0.20, 0.20);
        arcade.setDepth(-6);
      }
    } else if (theme === 'plaza') {
      // Festival Plaza with campus silhouette & fireworks
      for (let x = 0; x < this.worldWidth; x += 800) {
        const plaza = this.add.image(x, 80, 'bg_festival_plaza').setOrigin(0, 0);
        plaza.setScrollFactor(0.18, 0.18);
        plaza.setDepth(-6);
      }
    }

    // 3. Drifting Living Pixel Clouds
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
