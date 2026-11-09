import Phaser from 'phaser';
import { soundEngine } from '../systems/SoundEngine';
import { eventBus } from '../EventBus';

export class NPC extends Phaser.GameObjects.Container {
  constructor(scene, x, y, name, dialogue) {
    super(scene, x, y);

    this.scene = scene;
    this.name = name || 'KOTA BOT';
    this.dialogue = dialogue || 'Greetings Explorer! Press [E] or tap me to talk with your AI Guide!';

    // Robot Mascot sprite
    this.npcSprite = scene.add.image(0, 0, 'mascot_npc');
    this.npcSprite.setOrigin(0.5, 1);
    this.npcSprite.setInteractive({ useHandCursor: true });
    this.npcSprite.on('pointerdown', () => this.interact());
    this.add(this.npcSprite);

    // Floating name tag
    this.tagBg = scene.add.rectangle(0, -38, 96, 18, 0x1e1b4b, 0.9);
    this.tagBg.setStrokeStyle(1.5, 0x818cf8);
    this.tagText = scene.add.text(0, -38, this.name, {
      fontFamily: '"Press Start 2P", monospace',
      fontSize: '7px',
      color: '#c7d2fe'
    }).setOrigin(0.5);
    this.add([this.tagBg, this.tagText]);

    // Floating Interaction Prompt Badge [E] TALK
    this.promptContainer = scene.add.container(0, -60);
    this.promptBg = scene.add.rectangle(0, 0, 110, 20, 0xec4899, 0.95);
    this.promptBg.setStrokeStyle(1.5, 0xffffff);
    this.promptText = scene.add.text(0, 0, '⚡ [E] TALK', {
      fontFamily: '"Press Start 2P", monospace',
      fontSize: '7px',
      color: '#ffffff'
    }).setOrigin(0.5);
    this.promptContainer.add([this.promptBg, this.promptText]);
    this.promptContainer.setAlpha(0);
    this.add(this.promptContainer);

    // Speech bubble container
    this.bubbleContainer = scene.add.container(0, -88);
    this.bubbleBg = scene.add.rectangle(0, 0, 170, 38, 0x0f172a, 0.95);
    this.bubbleBg.setStrokeStyle(1.5, 0x38bdf8);
    this.bubbleText = scene.add.text(0, 0, this.dialogue, {
      fontFamily: 'system-ui, sans-serif',
      fontSize: '11px',
      color: '#f8fafc',
      wordWrap: { width: 155 },
      align: 'center'
    }).setOrigin(0.5);
    this.bubbleContainer.add([this.bubbleBg, this.bubbleText]);
    this.bubbleContainer.setAlpha(0);
    this.add(this.bubbleContainer);

    // Hover idle animation
    scene.tweens.add({
      targets: this.npcSprite,
      y: -5,
      duration: 1000,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });

    // Glowing prompt pulse
    scene.tweens.add({
      targets: this.promptBg,
      scaleX: 1.05,
      scaleY: 1.05,
      duration: 600,
      yoyo: true,
      repeat: -1,
      ease: 'Quad.easeInOut'
    });

    scene.add.existing(this);
    scene.physics.world.enable(this);
    this.body.setSize(36, 36);
    this.body.setOffset(-18, -36);
    this.body.setImmovable(true);
    this.body.setAllowGravity(false);

    this.isNear = false;
  }

  checkProximity(player) {
    const dist = Phaser.Math.Distance.Between(this.x, this.y - 16, player.x, player.y);
    const wasNear = this.isNear;
    this.isNear = dist < 75;

    if (this.isNear && !wasNear) {
      soundEngine.playBlip();
      eventBus.emit('npc-near', { near: true });
      this.scene.tweens.add({
        targets: [this.bubbleContainer, this.promptContainer],
        alpha: 1,
        duration: 200,
        ease: 'Back.easeOut'
      });
    } else if (!this.isNear && wasNear) {
      eventBus.emit('npc-near', { near: false });
      this.scene.tweens.add({
        targets: [this.bubbleContainer, this.promptContainer],
        alpha: 0,
        duration: 150
      });
    }

    return this.isNear;
  }

  interact() {
    soundEngine.playSelect();
    eventBus.emit('open-kota-dialogue', {
      zone: this.scene.sceneKey,
      sceneName: this.scene.zoneName || this.scene.sceneKey
    });
  }
}
