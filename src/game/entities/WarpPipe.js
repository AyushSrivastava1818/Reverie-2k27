import Phaser from 'phaser';
import { eventBus } from '../EventBus';

export class WarpPipe extends Phaser.GameObjects.Container {
  constructor(scene, x, y, options = {}) {
    super(scene, x, y);

    this.scene = scene;
    this.color = options.color || 'green';
    this.targetScene = options.targetScene || 'TechKingdomScene';
    this.destinationName = options.destinationName || 'TECH KINGDOM';
    this.spawnPoint = options.spawnPoint || { x: 140, y: 440 };

    // Big 76x100 Pipe Sprite
    const spriteKey = `pipe_${this.color}`;
    this.pipeSprite = scene.add.image(0, 0, spriteKey);
    this.pipeSprite.setOrigin(0.5, 1);
    this.add(this.pipeSprite);

    // Floating destination sign
    const signWidth = Math.max(160, this.destinationName.length * 9 + 30);
    this.signBg = scene.add.rectangle(0, -118, signWidth, 30, 0x0a0614, 0.95);
    this.signBg.setStrokeStyle(2.5, this.getBorderColor(this.color));
    this.add(this.signBg);

    this.signText = scene.add.text(0, -118, this.destinationName, {
      fontFamily: '"Press Start 2P", monospace',
      fontSize: '8.5px',
      color: '#ffffff',
      align: 'center'
    }).setOrigin(0.5);
    this.add(this.signText);

    // Floating interaction prompt: [E] or Mobile ENTER
    this.promptContainer = scene.add.container(0, -158);
    this.promptBg = scene.add.rectangle(0, 0, 120, 26, 0x10b981, 0.95);
    this.promptBg.setStrokeStyle(1.5, 0xffffff);
    this.promptText = scene.add.text(0, 0, '▼ [E] ENTER', {
      fontFamily: '"Press Start 2P", monospace',
      fontSize: '8.5px',
      color: '#ffffff'
    }).setOrigin(0.5);
    this.promptContainer.add([this.promptBg, this.promptText]);
    this.promptContainer.setAlpha(0);
    this.add(this.promptContainer);

    // Gentle floating bob
    scene.tweens.add({
      targets: [this.signBg, this.signText],
      y: '-=6',
      duration: 1200,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });

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
      case 'white': return 0xf8fafc;
      default: return 0x22c55e;
    }
  }

  checkProximity(player) {
    const dist = Phaser.Math.Distance.Between(this.x, this.y - 45, player.x, player.y);
    const wasNear = this.isNear;
    this.isNear = dist < 90;

    if (this.isNear && !wasNear) {
      this.scene.tweens.add({
        targets: this.promptContainer,
        alpha: 1,
        y: -164,
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
        y: -158,
        duration: 150
      });
      eventBus.emit('pipe-near', { near: false });
    }

    return this.isNear;
  }

  activate(player) {
    if (this.scene.isTransitioning) return;
    this.scene.isTransitioning = true;

    player.enterPipe(this, () => {
      eventBus.emit('scene-change-start', {
        targetScene: this.targetScene,
        destinationName: this.destinationName
      });

      this.scene.cameras.main.fade(400, 10, 6, 20, false, (cam, progress) => {
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
