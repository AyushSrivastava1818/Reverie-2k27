import Phaser from 'phaser';

export class BootScene extends Phaser.Scene {
  constructor() {
    super('BootScene');
  }

  preload() {
    // Bare minimum loading indicator or logo if needed
  }

  create() {
    this.scene.start('PreloadScene');
  }
}

