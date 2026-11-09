import Phaser from 'phaser';
import { soundEngine } from '../systems/SoundEngine';
import { eventBus } from '../EventBus';

export class Collectible extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, 'coin', 0);

    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.body.setAllowGravity(false);
    this.body.setCircle(12);
    this.body.setOffset(0, 0);

    if (!scene.anims.exists('coin-spin')) {
      scene.anims.create({
        key: 'coin-spin',
        frames: scene.anims.generateFrameNumbers('coin', { start: 0, end: 3 }),
        frameRate: 6,
        repeat: -1
      });
    }

    this.anims.play('coin-spin');

    // Bobbing tween
    scene.tweens.add({
      targets: this,
      y: y - 8,
      duration: 1000 + Math.random() * 400,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });
  }

  collect() {
    if (this.isCollected) return;
    this.isCollected = true;

    soundEngine.playCoin();
    eventBus.emit('coin-collected', { points: 10 });

    // Collection bounce and fade
    this.scene.tweens.add({
      targets: this,
      y: this.y - 35,
      scaleX: 1.5,
      scaleY: 1.5,
      alpha: 0,
      duration: 350,
      ease: 'Back.easeOut',
      onComplete: () => {
        this.destroy();
      }
    });
  }
}
