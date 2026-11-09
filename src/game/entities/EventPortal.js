import Phaser from 'phaser';
import { soundEngine } from '../systems/SoundEngine';
import { eventBus } from '../EventBus';

export class EventPortal extends Phaser.GameObjects.Container {
  constructor(scene, x, y, eventData) {
    super(scene, x, y);

    this.scene = scene;
    this.eventData = eventData;

    const isArcade = eventData.category === 'flagship';
    this.kioskSprite = scene.add.image(0, 0, isArcade ? 'arcade_cabinet' : 'qblock');
    this.kioskSprite.setOrigin(0.5, 1);
    this.add(this.kioskSprite);

    // Floating bounce tween
    scene.tweens.add({
      targets: this.kioskSprite,
      y: isArcade ? 0 : -6,
      duration: 1100,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });

    // Event title banner above
    const bannerY = isArcade ? -82 : -50;
    const bannerWidth = Math.max(140, eventData.title.length * 10 + 24);
    this.bannerBg = scene.add.rectangle(0, bannerY, bannerWidth, 26, 0x0a0614, 0.95);
    
    const strokeColor = eventData.category === 'flagship' 
      ? 0xa855f7 
      : (eventData.category === 'technical' ? 0x06b6d4 : 0xec4899);
    this.bannerBg.setStrokeStyle(2, strokeColor);
    this.add(this.bannerBg);

    this.bannerText = scene.add.text(0, bannerY, eventData.title, {
      fontFamily: '"Press Start 2P", monospace',
      fontSize: '8.5px',
      color: '#ffffff',
      align: 'center'
    }).setOrigin(0.5);
    this.add(this.bannerText);

    // Floating Interaction Prompt
    this.promptContainer = scene.add.container(0, bannerY - 30);
    this.promptBg = scene.add.rectangle(0, 0, 120, 24, 0xfbbf24, 0.95);
    this.promptBg.setStrokeStyle(1.5, 0xffffff);
    this.promptText = scene.add.text(0, 0, '★ [E] DETAILS', {
      fontFamily: '"Press Start 2P", monospace',
      fontSize: '8px',
      color: '#0f172a'
    }).setOrigin(0.5);
    this.promptContainer.add([this.promptBg, this.promptText]);
    this.promptContainer.setAlpha(0);
    this.add(this.promptContainer);

    scene.add.existing(this);
    scene.physics.world.enable(this);
    this.body.setSize(isArcade ? 48 : 36, isArcade ? 72 : 36);
    this.body.setOffset(isArcade ? -24 : -18, isArcade ? -72 : -36);
    this.body.setImmovable(true);
    this.body.setAllowGravity(false);

    this.isNear = false;
  }

  checkProximity(player) {
    const dist = Phaser.Math.Distance.Between(this.x, this.y - 25, player.x, player.y);
    const wasNear = this.isNear;
    this.isNear = dist < 85;

    if (this.isNear && !wasNear) {
      this.scene.tweens.add({
        targets: this.promptContainer,
        alpha: 1,
        y: this.bannerBg.y - 34,
        duration: 180,
        ease: 'Back.easeOut'
      });
      eventBus.emit('event-portal-near', {
        near: true,
        event: this.eventData,
        portal: this
      });
    } else if (!this.isNear && wasNear) {
      this.scene.tweens.add({
        targets: this.promptContainer,
        alpha: 0,
        y: this.bannerBg.y - 30,
        duration: 120
      });
      eventBus.emit('event-portal-near', { near: false });
    }

    return this.isNear;
  }

  interact() {
    soundEngine.playBlip();
    eventBus.emit('open-event-modal', this.eventData);
  }
}
