import Phaser from 'phaser';
import { eventBus } from '../EventBus';
import { soundEngine } from '../systems/SoundEngine';

export class WarpPipe extends Phaser.GameObjects.Container {
  constructor(scene, x, y, options = {}) {
    super(scene, x, y);

    this.scene = scene;
    this.color = options.color || 'green';
    this.targetScene = options.targetScene || 'TechKingdomScene';
    this.destinationName = options.destinationName || 'WARP TUNNEL: TECH REALM';
    this.spawnPoint = options.spawnPoint || { x: 160, y: 440 };
    this.isArcade = !!options.isArcade || this.targetScene === 'arcade';

    // 1. Pipe Sprite (76x100)
    const spriteKey = `pipe_${this.color}`;
    this.pipeSprite = scene.add.image(0, 0, spriteKey);
    this.pipeSprite.setOrigin(0.5, 1);
    this.add(this.pipeSprite);

    // 2. Glowing Energy Rim at Pipe Lip
    const rimColor = this.getBorderColor(this.color);
    this.energyRim = scene.add.ellipse(0, -96, 68, 14, rimColor, 0.45);
    this.add(this.energyRim);

    // Pulsing energy rim animation
    scene.tweens.add({
      targets: this.energyRim,
      scaleX: 1.15,
      scaleY: 1.25,
      alpha: 0.8,
      duration: 800,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });

    // 3. Floating 16-Bit Arcade Marquee Sign
    const signWidth = Math.max(180, this.destinationName.length * 8.5 + 36);
    this.signContainer = scene.add.container(0, -128);

    // Marquee frame with glowing border
    this.signBg = scene.add.rectangle(0, 0, signWidth, 32, 0x090514, 0.95);
    this.signBg.setStrokeStyle(2.5, rimColor);
    this.signContainer.add(this.signBg);

    // Animated Header Tag
    this.signTag = scene.add.text(0, -9, '⚡ WARP TUNNEL ⚡', {
      fontFamily: '"Press Start 2P", monospace',
      fontSize: '7px',
      color: '#facc15'
    }).setOrigin(0.5);
    this.signContainer.add(this.signTag);

    // Destination Name
    this.signText = scene.add.text(0, 5, this.destinationName.replace('WARP TUNNEL: ', ''), {
      fontFamily: '"Press Start 2P", monospace',
      fontSize: '8px',
      color: '#ffffff',
      align: 'center'
    }).setOrigin(0.5);
    this.signContainer.add(this.signText);

    this.add(this.signContainer);

    // Gentle floating bob for marquee
    scene.tweens.add({
      targets: this.signContainer,
      y: '-=6',
      duration: 1200,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });

    // 4. Floating Interaction Prompt: [E] or Mobile TAP
    this.promptContainer = scene.add.container(0, -172);
    this.promptBg = scene.add.rectangle(0, 0, 140, 26, 0x10b981, 0.95);
    this.promptBg.setStrokeStyle(2, 0xffffff);
    this.promptText = scene.add.text(0, 0, '▼ [E] WARP ▼', {
      fontFamily: '"Press Start 2P", monospace',
      fontSize: '8.5px',
      color: '#ffffff',
      fontStyle: 'bold'
    }).setOrigin(0.5);
    this.promptContainer.add([this.promptBg, this.promptText]);
    this.promptContainer.setAlpha(0);
    this.add(this.promptContainer);

    // Physics body
    scene.add.existing(this);
    scene.physics.world.enable(this);
    this.body.setSize(76, 100);
    this.body.setOffset(-38, -100);
    this.body.setImmovable(true);
    this.body.setAllowGravity(false);

    this.isNear = false;
  }

  getBorderColor(color) {
    switch (color) {
      case 'green': return 0x22c55e;
      case 'pink': return 0xec4899;
      case 'purple': return 0xa855f7;
      case 'yellow': return 0xeab308;
      case 'cyan': return 0x06b6d4;
      case 'white': return 0x38bdf8;
      case 'gold': return 0xfbbf24;
      default: return 0x22c55e;
    }
  }

  checkProximity(player) {
    const dist = Phaser.Math.Distance.Between(this.x, this.y - 45, player.x, player.y);
    const wasNear = this.isNear;
    this.isNear = dist < 95;

    if (this.isNear && !wasNear) {
      this.scene.tweens.add({
        targets: this.promptContainer,
        alpha: 1,
        y: -178,
        duration: 200,
        ease: 'Back.easeOut'
      });
      eventBus.emit('pipe-near', {
        near: true,
        destination: this.destinationName,
        pipe: this
      });
    } else if (!this.isNear && wasNear) {
      this.scene.tweens.add({
        targets: this.promptContainer,
        alpha: 0,
        y: -172,
        duration: 150
      });
      eventBus.emit('pipe-near', { near: false });
    }

    return this.isNear;
  }

  activate(player) {
    if (this.scene.isTransitioning) return;
    this.scene.isTransitioning = true;

    // Trigger player duck into pipe
    player.enterPipe(this, () => {
      // If this is the ARCADE WARP TUNNEL, directly open the Arcade Universe!
      if (this.isArcade || this.targetScene === 'arcade') {
        soundEngine.playFanfare();
        eventBus.emit('open-arcade-modal', { stage: 1, view: 'world-map' });
        this.scene.time.delayedCall(800, () => {
          this.scene.isTransitioning = false;
        });
        return;
      }

      // Trigger the spectacular Warp Tunnel Hyperspace Overlay
      eventBus.emit('warp-tunnel-active', {
        active: true,
        destinationName: this.destinationName,
        targetScene: this.targetScene,
        spawnPoint: this.spawnPoint
      });

      // Quick smooth camera fade synchronized with warp overlay
      this.scene.cameras.main.fade(300, 5, 2, 12, false, (cam, progress) => {
        if (progress === 1) {
          this.scene.scene.start(this.targetScene, {
            fromPipe: true,
            spawnPoint: this.spawnPoint
          });
        }
      });
    });
  }
}
