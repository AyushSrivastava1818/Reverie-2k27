import Phaser from 'phaser';
import { eventBus } from '../EventBus';

export class PreloadScene extends Phaser.Scene {
  constructor() {
    super('PreloadScene');
  }

  preload() {
    // All 5 character skins (48x48) including REVERIE Special Edition
    const skins = ['player', 'player_mario', 'player_neon', 'player_gold', 'player_synth', 'player_special'];
    skins.forEach(s => {
      this.load.spritesheet(s, `/assets/sprites/${s}.png`, {
        frameWidth: 48,
        frameHeight: 48
      });
    });

    // Big 24x24 Coin Spritesheet
    this.load.spritesheet('coin', '/assets/sprites/coin.png', {
      frameWidth: 24,
      frameHeight: 24
    });

    // Big Question Block, Environmental Props & Kiosks
    this.load.image('qblock', '/assets/sprites/qblock.png');
    this.load.image('arcade_cabinet', '/assets/sprites/arcade_cabinet.png');
    this.load.image('mascot_npc', '/assets/sprites/mascot_npc.png');
    this.load.image('flag', '/assets/sprites/flag.png');
    this.load.image('signpost', '/assets/sprites/signpost.png');
    this.load.image('mushroom_purple', '/assets/sprites/mushroom_purple.png');
    this.load.image('speaker_stack', '/assets/sprites/speaker_stack.png');
    this.load.image('cloud_pixel', '/assets/sprites/cloud_pixel.png');
    this.load.image('iiit_building', '/assets/sprites/iiit_building.png');
    this.load.image('arcade_entrance', '/assets/sprites/arcade_entrance.png');

    // Colored Warp Pipes (76x100)
    ['green', 'pink', 'purple', 'yellow', 'cyan', 'white'].forEach(col => {
      this.load.image(`pipe_${col}`, `/assets/sprites/pipe_${col}.png`);
    });

    // 48x48 Platform blocks
    this.load.image('block_grass', '/assets/sprites/block_grass.png');
    this.load.image('block_tech', '/assets/sprites/block_tech.png');
    this.load.image('block_stage', '/assets/sprites/block_stage.png');
    this.load.image('mushroom_platform', '/assets/sprites/mushroom_platform.png');
    this.load.image('qblock_empty', '/assets/sprites/qblock_empty.png');
    this.load.image('festival_arch', '/assets/sprites/festival_arch.png');

    // Branding Logos for In-Game Banners & Gateways
    this.load.image('reverie_logo', '/assets/branding/reverie_logo.png');
    this.load.image('reverie_emblem', '/assets/branding/reverie_emblem.png');

    // Thematic Parallax Backgrounds
    this.load.image('bg_stars', '/assets/backgrounds/bg_stars.png');
    this.load.image('bg_mario_hills', '/assets/backgrounds/bg_mario_hills.png');
    this.load.image('bg_cyber_city', '/assets/backgrounds/bg_cyber_city.png');
    this.load.image('bg_arcade_hall', '/assets/backgrounds/bg_arcade_hall.png');
    this.load.image('bg_mountains', '/assets/backgrounds/bg_mountains.png');
    this.load.image('bg_skyline', '/assets/backgrounds/bg_skyline.png');
    this.load.image('bg_tech', '/assets/backgrounds/bg_tech.png');
    this.load.image('bg_culture', '/assets/backgrounds/bg_culture.png');
    this.load.image('bg_festival_plaza', '/assets/backgrounds/bg_festival_plaza.png');

    this.load.on('progress', (val) => {
      eventBus.emit('game-load-progress', Math.round(val * 100));
    });

    this.load.on('complete', () => {
      eventBus.emit('game-load-complete');
    });
  }

  create() {
    this.scene.start('StartingKingdomScene');
  }
}
