import Phaser from 'phaser';
import { soundEngine } from '../systems/SoundEngine';
import { eventBus } from '../EventBus';

export class Player extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y) {
    const savedSkin = (typeof window !== 'undefined' && window.__currentSkin) 
      || (typeof localStorage !== 'undefined' && localStorage.getItem('reverie_skin')) 
      || 'player_mario';
    super(scene, x, y, savedSkin, 0);

    scene.add.existing(this);
    scene.physics.add.existing(this);

    // Scale up player for bigger, bolder, distinct hero presence
    this.setScale(1.25);

    // Collision box for 48x48 sprite scaled up to 1.25x
    this.setSize(24, 38);
    this.setOffset(12, 10);
    this.setCollideWorldBounds(true);
    this.setBounce(0);

    // Platforming movement parameters - Bigger, soaring super-jump!
    this.walkSpeed = 290;
    this.jumpSpeed = -700; // Big, airy, satisfying Mario super-jump!
    this.isEnteringPipe = false;
    this.facing = 'right';
    this.currentSkin = savedSkin;
    if (typeof window !== 'undefined') {
      window.__currentSkin = savedSkin;
    }

    // Jump feel improvements (Coyote time + Jump buffering)
    this.jumpBuffer = 0;
    this.coyoteCounter = 0;

    // Mobile / External input state
    this.mobileInput = { left: false, right: false, jump: false, interact: false };

    // Register mobile input listener
    this.unbindInput = eventBus.on('mobile-input', (input) => {
      this.mobileInput = { ...this.mobileInput, ...input };
    });

    // Register skin change listener
    this.unbindSkin = eventBus.on('change-skin', (skinKey) => {
      this.setSkin(skinKey);
    });

    this.createAnimations(scene, this.currentSkin);
  }

  setSkin(skinKey) {
    this.currentSkin = skinKey;
    if (typeof window !== 'undefined') {
      window.__currentSkin = skinKey;
    }
    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem('reverie_skin', skinKey);
      }
    } catch (e) {}
    this.setTexture(skinKey);
    this.createAnimations(this.scene, skinKey);
    this.anims.play(`${skinKey}-idle`, true);
    soundEngine.playFanfare();
  }

  createAnimations(scene, skinKey) {
    if (!scene.anims.exists(`${skinKey}-idle`)) {
      scene.anims.create({
        key: `${skinKey}-idle`,
        frames: [{ key: skinKey, frame: 0 }],
        frameRate: 1
      });
    }

    if (!scene.anims.exists(`${skinKey}-walk`)) {
      scene.anims.create({
        key: `${skinKey}-walk`,
        frames: [
          { key: skinKey, frame: 1 },
          { key: skinKey, frame: 2 },
          { key: skinKey, frame: 3 },
          { key: skinKey, frame: 2 }
        ],
        frameRate: 10,
        repeat: -1
      });
    }

    if (!scene.anims.exists(`${skinKey}-jump`)) {
      scene.anims.create({
        key: `${skinKey}-jump`,
        frames: [{ key: skinKey, frame: 4 }],
        frameRate: 1
      });
    }

    if (!scene.anims.exists(`${skinKey}-pipe`)) {
      scene.anims.create({
        key: `${skinKey}-pipe`,
        frames: [{ key: skinKey, frame: 5 }],
        frameRate: 1
      });
    }
  }

  update(cursors, keys) {
    if (this.isEnteringPipe) {
      return;
    }

    const onGround = this.body.blocked.down || this.body.touching.down;

    // Coyote time tracking
    if (onGround) {
      this.coyoteCounter = 8;
    } else if (this.coyoteCounter > 0) {
      this.coyoteCounter--;
    }

    // Input checking (Keyboard + On-screen mobile controls)
    const moveLeft = (cursors && (cursors.left.isDown || keys.A.isDown)) || this.mobileInput.left;
    const moveRight = (cursors && (cursors.right.isDown || keys.D.isDown)) || this.mobileInput.right;
    const jumpPressed = (cursors && (cursors.up.isDown || keys.W.isDown || keys.SPACE.isDown)) || this.mobileInput.jump;

    // Horizontal movement
    if (moveLeft) {
      this.setVelocityX(-this.walkSpeed);
      this.setFlipX(true);
      this.facing = 'left';
      if (onGround) {
        this.anims.play(`${this.currentSkin}-walk`, true);
      }
    } else if (moveRight) {
      this.setVelocityX(this.walkSpeed);
      this.setFlipX(false);
      this.facing = 'right';
      if (onGround) {
        this.anims.play(`${this.currentSkin}-walk`, true);
      }
    } else {
      this.setVelocityX(0);
      if (onGround) {
        this.anims.play(`${this.currentSkin}-idle`, true);
      }
    }

    // Variable Jump (hold for higher jump)
    if (jumpPressed) {
      this.jumpBuffer = 10;
    } else if (this.jumpBuffer > 0) {
      this.jumpBuffer--;
    }

    if (this.jumpBuffer > 0 && this.coyoteCounter > 0) {
      this.setVelocityY(this.jumpSpeed);
      this.jumpBuffer = 0;
      this.coyoteCounter = 0;
      soundEngine.playJump();
      this.anims.play(`${this.currentSkin}-jump`, true);
    }

    // Cut jump height when button is released early (Mario-style variable jump)
    if (!jumpPressed && this.body.velocity.y < -220) {
      this.setVelocityY(this.body.velocity.y * 0.65);
    }

    // Air animation
    if (!onGround) {
      this.anims.play(`${this.currentSkin}-jump`, true);
    }
  }

  enterPipe(pipe, onComplete) {
    if (this.isEnteringPipe) return;
    this.isEnteringPipe = true;
    this.setVelocity(0, 0);
    this.body.setAllowGravity(false);
    this.anims.play(`${this.currentSkin}-pipe`, true);

    soundEngine.playPipe();

    this.x = pipe.x;

    this.scene.tweens.add({
      targets: this,
      y: pipe.y + 30,
      alpha: 0,
      duration: 500,
      ease: 'Quad.easeInOut',
      onComplete: () => {
        if (onComplete) onComplete();
      }
    });
  }

  exitPipe(pipeX, pipeY, onComplete) {
    this.isEnteringPipe = true;
    this.setPosition(pipeX, pipeY + 30);
    this.setAlpha(0);
    this.body.setAllowGravity(false);
    this.anims.play(`${this.currentSkin}-pipe`, true);

    soundEngine.playPipe();

    this.scene.tweens.add({
      targets: this,
      y: pipeY - 32,
      alpha: 1,
      duration: 500,
      ease: 'Quad.easeOut',
      onComplete: () => {
        this.isEnteringPipe = false;
        this.body.setAllowGravity(true);
        this.anims.play(`${this.currentSkin}-idle`, true);
        if (onComplete) onComplete();
      }
    });
  }

  destroy() {
    if (this.unbindInput) this.unbindInput();
    if (this.unbindSkin) this.unbindSkin();
    super.destroy();
  }
}
