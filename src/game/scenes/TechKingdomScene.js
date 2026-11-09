import { BaseKingdomScene } from './BaseKingdomScene';
import { eventsData } from '../../data/events';

export class TechKingdomScene extends BaseKingdomScene {
  constructor() {
    super('TechKingdomScene');
  }

  create() {
    // Theme 'tech' -> renders bg_stars + bg_cyber_city (Towering neon skyscrapers & lit windows!)
    this.createBaseWorld('tech', 'TECH KINGDOM');

    // Cyber Title Banner placed high in sky layer (y: 150)
    const bannerX = 460;
    const bannerY = 150;
    const banner = this.add.rectangle(bannerX, bannerY, 520, 52, 0x090518, 0.95);
    banner.setStrokeStyle(2, 0x06b6d4);
    banner.setDepth(-2);

    this.add.text(bannerX, bannerY - 10, '⚡ ZONE B: TECH KINGDOM ⚡', {
      fontFamily: '"Oxanium", sans-serif',
      fontSize: '15px',
      color: '#22d3ee',
      fontStyle: 'bold'
    }).setOrigin(0.5).setDepth(-1);

    this.add.text(bannerX, bannerY + 12, '7 TECHNICAL SHOWDOWNS & HACK CHALLENGES', {
      fontFamily: '"Rajdhani", sans-serif',
      fontSize: '13px',
      color: '#94a3b8',
      fontStyle: '600'
    }).setOrigin(0.5).setDepth(-1);

    // Return Pipe to Start Hub
    this.addWarpPipe(140, this.groundY, {
      color: 'yellow',
      targetScene: 'StartingKingdomScene',
      destinationName: '◀ RETURN TO START HUB',
      spawnPoint: { x: 2140, y: this.groundY - 60 }
    });

    // Tech Guide NPC
    this.addNPC(280, this.groundY, 'CYBER BOT', 'Welcome to Tech Kingdom! Inspect any cyber terminal to check rules, test runners, and register!');

    const techEvents = eventsData.filter(e => e.category === 'technical');

    // =========================================================================
    // LAYERED ARCHITECTURAL BUILDINGS FOR EACH TECHNICAL EVENT
    // =========================================================================

    // 1. ENDEAVOUR: CODE LAB ALPHA
    this.addCyberBuilding(520, 160, 260, 0x064e3b, 'CODE LAB ALPHA', '01');
    const endeavour = techEvents.find(e => e.id === 'endeavour');
    if (endeavour) this.addEventPortal(520, this.groundY, endeavour);

    // Elevated platform 1 (Byte-Break)
    this.createElevatedPlatform(740, 430, 5, 'tech');
    this.addCoinsInRow(760, 370, 4, 46);

    // 2. BYTE-BREAK: CRYPTO DEBUG VAULT
    this.addCyberBuilding(880, 150, 310, 0x1e1b4b, 'DEBUG VAULT', '02');
    const byteBreak = techEvents.find(e => e.id === 'byte-break');
    if (byteBreak) this.addEventPortal(880, 430, byteBreak);

    // 3. DSA SPRINT: ALGORITHM TOWER
    this.addCyberBuilding(1180, 170, 340, 0x164e63, 'ALGO TOWER', '03');
    const dsaSprint = techEvents.find(e => e.id === 'dsa-sprint');
    if (dsaSprint) this.addEventPortal(1180, this.groundY, dsaSprint);

    // Elevated platform 2 (TradeX)
    this.createElevatedPlatform(1360, 410, 5, 'tech');
    this.addCoinsInRow(1380, 350, 4, 46);

    // 4. TRADEX: EXCHANGE TRADING ARENA
    this.addCyberBuilding(1480, 160, 280, 0x065f46, 'TRADEX FLOOR', '04');
    const tradex = techEvents.find(e => e.id === 'tradex');
    if (tradex) this.addEventPortal(1480, 410, tradex);

    // 5. SUMMIT LEAGUE: ESPORTS COLISEUM
    this.addCyberBuilding(1800, 180, 320, 0x4c1d95, 'ESPORTS COLISEUM', '05');
    const summitLeague = techEvents.find(e => e.id === 'summit-league');
    if (summitLeague) this.addEventPortal(1800, this.groundY, summitLeague);

    // Elevated platform 3 (DesignX)
    this.createElevatedPlatform(2020, 430, 5, 'tech');
    this.addCoinsInRow(2040, 370, 4, 46);

    // 6. DESIGNX: CREATIVE DESIGN STUDIO
    this.addCyberBuilding(2140, 150, 290, 0x701a75, 'STUDIO X', '06');
    const designx = techEvents.find(e => e.id === 'designx');
    if (designx) this.addEventPortal(2140, 430, designx);

    // 7. ROBO SOCCER: HIGH-TORQUE ARENA
    this.addCyberBuilding(2480, 180, 280, 0x1e293b, 'ROBO STADIUM', '07');
    const roboSoccer = techEvents.find(e => e.id === 'robo-soccer');
    if (roboSoccer) this.addEventPortal(2480, this.groundY, roboSoccer);

    // Question block between arenas
    this.addQuestionBlock(2310, 420);
    this.addCoin(2310, 360);

    // Forward Warp Pipe to Culture Kingdom
    this.addWarpPipe(2800, this.groundY, {
      color: 'pink',
      targetScene: 'CultureKingdomScene',
      destinationName: 'WARP TO CULTURE KINGDOM ▶',
      spawnPoint: { x: 160, y: this.groundY - 60 }
    });

    this.add.image(3020, this.groundY, 'flag').setOrigin(0.5, 1);
  }

  // Distinct Cyberpunk Architectural Building with Window Lights & Rooftop Antenna
  addCyberBuilding(x, width, height, tintColor, title, numBadge) {
    const bldgY = this.groundY;

    // Main tower block
    const bldg = this.add.rectangle(x, bldgY - height / 2, width, height, tintColor, 0.95);
    bldg.setStrokeStyle(2, 0x38bdf8);
    bldg.setDepth(-4);

    // Rooftop Antenna
    const antenna = this.add.line(0, 0, x, bldgY - height, x, bldgY - height - 36, 0x38bdf8, 1);
    antenna.setLineWidth(2).setDepth(-4);

    // Blinking LED on antenna tip
    const led = this.add.circle(x, bldgY - height - 36, 4, 0xef4444, 0.9).setDepth(-4);
    this.tweens.add({
      targets: led,
      alpha: 0.2,
      duration: 600,
      yoyo: true,
      repeat: -1
    });

    // Grid of illuminated windows
    const cols = Math.floor(width / 28);
    const rows = Math.floor(height / 36);
    const startX = x - (cols * 28) / 2 + 14;
    const startY = bldgY - height + 36;

    for (let c = 0; c < cols; c++) {
      for (let r = 0; r < rows; r++) {
        // Random bright/dim window colors (cyan, amber, violet)
        const isLit = (c + r * 3) % 2 === 0;
        const winColor = isLit ? ((c + r) % 3 === 0 ? 0x22d3ee : 0xfbbf24) : 0x0f172a;
        const win = this.add.rectangle(startX + c * 28, startY + r * 36, 14, 18, winColor, 0.85);
        win.setDepth(-3);
      }
    }

    // Overhead Glowing Neon Signboard
    const signY = bldgY - height - 12;
    const signBg = this.add.rectangle(x, signY, width - 20, 22, 0x090518, 0.95);
    signBg.setStrokeStyle(1.5, 0x22d3ee);
    signBg.setDepth(-3);

    this.add.text(x, signY, `[${numBadge}] ${title}`, {
      fontFamily: '"Press Start 2P", monospace',
      fontSize: '7px',
      color: '#38bdf8',
      align: 'center'
    }).setOrigin(0.5).setDepth(-3);
  }
}
