import Phaser from 'phaser';
import { BootScene } from './scenes/BootScene';
import { PreloadScene } from './scenes/PreloadScene';
import { StartingKingdomScene } from './scenes/StartingKingdomScene';
import { TechKingdomScene } from './scenes/TechKingdomScene';
import { CultureKingdomScene } from './scenes/CultureKingdomScene';
import { FlagshipScene } from './scenes/FlagshipScene';
import { FestivalPlazaScene } from './scenes/FestivalPlazaScene';
import { SecretBonusRoomScene } from './scenes/SecretBonusRoomScene';

export function createGameConfig(parentContainer) {
  return {
    type: Phaser.AUTO,
    parent: parentContainer,
    width: window.innerWidth,
    height: window.innerHeight,
    backgroundColor: '#0a0614',
    pixelArt: true,
    roundPixels: true,
    physics: {
      default: 'arcade',
      arcade: {
        gravity: { y: 1200 },
        debug: false
      }
    },
    scale: {
      mode: Phaser.Scale.RESIZE,
      width: '100%',
      height: '100%'
    },
    scene: [
      BootScene,
      PreloadScene,
      StartingKingdomScene,
      TechKingdomScene,
      CultureKingdomScene,
      FlagshipScene,
      FestivalPlazaScene,
      SecretBonusRoomScene
    ]
  };
}
