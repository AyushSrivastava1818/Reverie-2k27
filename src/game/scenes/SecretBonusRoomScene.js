import { BaseKingdomScene } from './BaseKingdomScene';
import { achievementSystem } from '../systems/AchievementSystem';
import { soundEngine } from '../systems/SoundEngine';

export class SecretBonusRoomScene extends BaseKingdomScene {
  constructor() {
    super('SecretBonusRoomScene');
    this.worldWidth = 1600;
  }

  create() {
    // Secret Vault uses 'flagship' arcade theme with golden ambient lighting
    this.createBaseWorld('flagship', 'SECRET BONUS VAULT');

    // Unlock secret finder quest!
    achievementSystem.recordSecret();

    // Grand banner
    const bannerX = 500;
    const bannerY = 110;
    const bannerBg = this.add.rectangle(bannerX, bannerY, 520, 64, 0x1e1035, 0.95);
    bannerBg.setStrokeStyle(2.5, 0xfbbf24);
    bannerBg.setDepth(-2);

    this.add.text(bannerX, bannerY - 10, '★ SECRET CREATOR VAULT ★', {
      fontFamily: '"Oxanium", sans-serif',
      fontSize: '20px',
      color: '#fbbf24',
      fontStyle: '800'
    }).setOrigin(0.5).setDepth(-1);

    this.add.text(bannerX, bannerY + 16, 'YOU DISCOVERED THE PIXELVERSE HIDDEN EASTER EGG!', {
      fontFamily: '"Rajdhani", sans-serif',
      fontSize: '13px',
      color: '#f8fafc',
      fontStyle: '600'
    }).setOrigin(0.5).setDepth(-1);

    // Creator Bot NPC
    this.addNPC(
      220,
      this.groundY,
      'CREATOR BOT',
      'Greetings secret hunter! You unlocked the SECRET FINDER achievement & the cosmic REVERIE Special Edition armor skin! Collect all coins in the vault!'
    );

    // Central Trophy Monument
    const trophy = this.add.image(500, this.groundY - 48, 'trophy');
    trophy.setScale(1.6);
    this.tweens.add({
      targets: trophy,
      y: this.groundY - 58,
      duration: 1200,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });

    // Elevated Golden Tiered Platforms
    this.createElevatedPlatform(380, 420, 5, 'tech');
    this.createElevatedPlatform(660, 340, 5, 'culture');
    this.createElevatedPlatform(940, 420, 5, 'tech');

    // Bouncy Mushroom
    this.addMushroomPlatform(280, this.groundY);
    this.addMushroomPlatform(1120, this.groundY);

    // Rich clusters of REVERIE Gold Coins!
    this.addCoinsInRow(390, 360, 5, 40);
    this.addCoinsInRow(670, 280, 5, 40);
    this.addCoinsInRow(950, 360, 5, 40);
    this.addCoinsInRow(300, this.groundY - 30, 8, 48);

    // Lucky [?] Blocks packed with coins
    this.addQuestionBlock(480, 240);
    this.addQuestionBlock(520, 240);
    this.addQuestionBlock(760, 180);

    // Return Pipe (Back to Starting Kingdom)
    this.addWarpPipe(1340, this.groundY, {
      color: 'gold',
      targetScene: 'StartingKingdomScene',
      destinationName: 'STARTING HUB',
      spawnPoint: { x: 3050, y: this.groundY - 60 }
    });
  }
}

