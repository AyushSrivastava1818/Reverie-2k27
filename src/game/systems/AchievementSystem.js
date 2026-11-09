import { eventBus } from '../EventBus';
import { soundEngine } from './SoundEngine';
import { achievementsList } from '../../data/achievements';

const STORAGE_KEY = 'reverie_2k27_achievements_v2';

class AchievementSystem {
  constructor() {
    this.state = this.loadState();
  }

  loadState() {
    const defaultState = {
      visitedZones: ['StartingKingdomScene'],
      viewedEvents: [],
      coinsCollected: 0,
      viewedPages: [],
      secretFound: false,
      unlockedIds: [],
      claimedIds: [],
      coinsSpent: 0,
      redeemedRewards: []
    };

    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          ...defaultState,
          ...parsed,
          visitedZones: Array.isArray(parsed?.visitedZones) && parsed.visitedZones.length > 0 ? parsed.visitedZones : ['StartingKingdomScene'],
          viewedEvents: Array.isArray(parsed?.viewedEvents) ? parsed.viewedEvents : [],
          unlockedIds: Array.isArray(parsed?.unlockedIds) ? parsed.unlockedIds : [],
          claimedIds: Array.isArray(parsed?.claimedIds) ? parsed.claimedIds : [],
          viewedPages: Array.isArray(parsed?.viewedPages) ? parsed.viewedPages : [],
          coinsCollected: typeof parsed?.coinsCollected === 'number' ? parsed.coinsCollected : 0,
          coinsSpent: typeof parsed?.coinsSpent === 'number' ? parsed.coinsSpent : 0,
          redeemedRewards: Array.isArray(parsed?.redeemedRewards) ? parsed.redeemedRewards : []
        };
      }
    } catch (e) {
      console.warn('Could not read achievements from localStorage', e);
    }

    return defaultState;
  }

  saveState() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
    } catch (e) {
      console.warn('Could not save achievements to localStorage', e);
    }
  }

  checkAchievements() {
    achievementsList.forEach(ach => {
      if (this.state.unlockedIds.includes(ach.id)) return;

      let current = 0;
      let target = ach.target;

      switch (ach.id) {
        case 'explorer':
        case 'kingdom_master':
          current = this.state.visitedZones.length;
          break;
        case 'event_hunter':
          current = this.state.viewedEvents.length;
          break;
        case 'coin_collector':
          current = this.state.coinsCollected;
          break;
        case 'festival_explorer':
          current = this.state.viewedPages.length;
          break;
        case 'secret_finder':
          current = this.state.secretFound ? 1 : 0;
          break;
        default:
          break;
      }

      if (current >= target) {
        this.unlock(ach);
      }
    });
  }

  unlock(achievement) {
    if (this.state.unlockedIds.includes(achievement.id)) return;
    this.state.unlockedIds.push(achievement.id);
    this.saveState();

    soundEngine.playFanfare();
    eventBus.emit('achievement-unlocked', achievement);
  }

  recordZone(zoneKey) {
    if (!this.state.visitedZones.includes(zoneKey)) {
      this.state.visitedZones.push(zoneKey);
      this.saveState();
      this.checkAchievements();
    }
  }

  recordEvent(eventId) {
    if (!this.state.viewedEvents.includes(eventId)) {
      this.state.viewedEvents.push(eventId);
      this.saveState();
      this.checkAchievements();
    }
  }

  recordCoin() {
    this.state.coinsCollected += 1;
    this.saveState();
    this.checkAchievements();
    eventBus.emit('coin-balance-updated', this.getBalance());
  }

  addBonusCoins(amount = 10) {
    if (typeof amount !== 'number' || amount <= 0) return;
    const now = Date.now();
    // Anti-grind validation: prevent rapid-fire injection loops (< 400ms threshold)
    if (this._lastBonusTime && now - this._lastBonusTime < 400) {
      return;
    }
    this._lastBonusTime = now;
    const validatedAmount = Math.min(50, Math.floor(amount));
    this.state.coinsCollected = (this.state.coinsCollected || 0) + validatedAmount;
    this.saveState();
    this.checkAchievements();
    eventBus.emit('coin-balance-updated', this.getBalance());
  }

  getBalance() {
    const collected = typeof this.state.coinsCollected === 'number' ? this.state.coinsCollected : 0;
    const spent = typeof this.state.coinsSpent === 'number' ? this.state.coinsSpent : 0;
    return Math.max(0, collected - spent);
  }

  getTotalEarned() {
    return typeof this.state.coinsCollected === 'number' ? this.state.coinsCollected : 0;
  }

  canAfford(cost) {
    return this.getBalance() >= cost;
  }

  redeemShopReward(reward) {
    if (!reward || typeof reward.cost !== 'number') return { success: false, reason: 'Invalid reward item' };
    if (!this.canAfford(reward.cost)) {
      return { success: false, reason: 'Insufficient coin balance' };
    }

    if (!Array.isArray(this.state.redeemedRewards)) {
      this.state.redeemedRewards = [];
    }

    // Check if single-claim limit applies
    if (reward.singleClaim && this.isRewardRedeemed(reward.id)) {
      return { success: false, reason: 'Reward already claimed' };
    }

    const redemptionCode = `REV27-${reward.tier || 'CLAIM'}-${Math.floor(1000 + Math.random() * 9000)}`;
    const record = {
      id: reward.id,
      title: reward.title,
      tier: reward.tier,
      cost: reward.cost,
      code: redemptionCode,
      claimedAt: new Date().toISOString(),
      disclaimer: reward.disclaimer || 'Present student ID at Festival Helpdesk / Honor Pavilion for organizer verification.'
    };

    this.state.coinsSpent = (this.state.coinsSpent || 0) + reward.cost;
    this.state.redeemedRewards.push(record);
    this.saveState();

    soundEngine.playFanfare();
    eventBus.emit('coin-balance-updated', this.getBalance());
    eventBus.emit('reward-redeemed', record);

    return { success: true, record };
  }

  isRewardRedeemed(rewardId) {
    if (!Array.isArray(this.state.redeemedRewards)) return false;
    return this.state.redeemedRewards.some(r => r.id === rewardId);
  }

  getRedeemedRewards() {
    return Array.isArray(this.state.redeemedRewards) ? [...this.state.redeemedRewards] : [];
  }

  recordPage(pageId) {
    if (!this.state.viewedPages.includes(pageId)) {
      this.state.viewedPages.push(pageId);
      this.saveState();
      this.checkAchievements();
    }
  }

  recordFestivalInfo(id = 'plaza') {
    this.recordPage(id);
  }

  claimReward(questId) {
    if (!this.state.claimedIds) this.state.claimedIds = [];
    if (!this.state.claimedIds.includes(questId)) {
      this.state.claimedIds.push(questId);
      this.saveState();
      soundEngine.playAchievement();
      return true;
    }
    return false;
  }

  isClaimed(questId) {
    if (!this.state.claimedIds) return false;
    return this.state.claimedIds.includes(questId);
  }

  recordSecret() {
    if (!this.state.secretFound) {
      this.state.secretFound = true;
      this.saveState();
      this.checkAchievements();
    }
  }

  isUnlocked(id) {
    if (!this.state || !Array.isArray(this.state.unlockedIds)) return false;
    return this.state.unlockedIds.includes(id);
  }

  getProgress(id) {
    const ach = achievementsList.find(a => a.id === id);
    if (!ach) return { current: 0, target: 1, percent: 0, unlocked: false };

    let current = 0;
    switch (id) {
      case 'explorer':
      case 'kingdom_master':
        current = Math.min(this.state.visitedZones.length, ach.target);
        break;
      case 'event_hunter':
        current = Math.min(this.state.viewedEvents.length, ach.target);
        break;
      case 'coin_collector':
        current = Math.min(this.state.coinsCollected, ach.target);
        break;
      case 'festival_explorer':
        current = Math.min(this.state.viewedPages.length, ach.target);
        break;
      case 'secret_finder':
        current = this.state.secretFound ? 1 : 0;
        break;
      default:
        break;
    }

    const percent = Math.min(100, Math.round((current / ach.target) * 100));
    return {
      current,
      target: ach.target,
      percent,
      unlocked: this.isUnlocked(id)
    };
  }

  getUnlockedCount() {
    if (!this.state || !Array.isArray(this.state.unlockedIds)) return 0;
    return this.state.unlockedIds.length;
  }
}

export const achievementSystem = new AchievementSystem();

