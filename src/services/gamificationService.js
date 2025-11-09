// Gamification service for trading platform
export class GamificationService {
  constructor() {
    this.achievements = new Map();
    this.leaderboards = new Map();
    this.quests = new Map();
    this.rewards = new Map();
    this.userStats = new Map();
    this.initializeAchievements();
    this.initializeQuests();
    this.initializeRewards();
  }

  // Initialize achievements
  initializeAchievements() {
    const achievements = [
      {
        id: 'first_trade',
        name: 'First Steps',
        description: 'Complete your first trade',
        icon: '🎯',
        points: 100,
        rarity: 'common',
        category: 'trading',
        requirement: { trades: 1 },
      },
      {
        id: 'profit_maker',
        name: 'Profit Maker',
        description: 'Make your first profit',
        icon: '💰',
        points: 200,
        rarity: 'common',
        category: 'trading',
        requirement: { profit: 1 },
      },
      {
        id: 'risk_taker',
        name: 'Risk Taker',
        description: 'Make 10 high-risk trades',
        icon: '🎲',
        points: 500,
        rarity: 'rare',
        category: 'trading',
        requirement: { highRiskTrades: 10 },
      },
      {
        id: 'diamond_hands',
        name: 'Diamond Hands',
        description: 'Hold a position for 30+ days',
        icon: '💎',
        points: 1000,
        rarity: 'epic',
        category: 'trading',
        requirement: { holdDays: 30 },
      },
      {
        id: 'social_trader',
        name: 'Social Trader',
        description: 'Follow 10 traders',
        icon: '👥',
        points: 300,
        rarity: 'common',
        category: 'social',
        requirement: { follows: 10 },
      },
      {
        id: 'copy_master',
        name: 'Copy Master',
        description: 'Copy 50 successful trades',
        icon: '📋',
        points: 800,
        rarity: 'rare',
        category: 'social',
        requirement: { copiedTrades: 50 },
      },
      {
        id: 'portfolio_diversifier',
        name: 'Portfolio Diversifier',
        description: 'Hold 10 different cryptocurrencies',
        icon: '🌐',
        points: 600,
        rarity: 'rare',
        category: 'portfolio',
        requirement: { uniqueCoins: 10 },
      },
      {
        id: 'ai_enthusiast',
        name: 'AI Enthusiast',
        description: 'Use AI predictions 100 times',
        icon: '🤖',
        points: 700,
        rarity: 'rare',
        category: 'ai',
        requirement: { aiPredictions: 100 },
      },
      {
        id: 'market_wizard',
        name: 'Market Wizard',
        description: 'Achieve 90% win rate over 100 trades',
        icon: '🧙‍♂️',
        points: 2000,
        rarity: 'legendary',
        category: 'trading',
        requirement: { winRate: 90, trades: 100 },
      },
      {
        id: 'crypto_whale',
        name: 'Crypto Whale',
        description: 'Reach $1M portfolio value',
        icon: '🐋',
        points: 5000,
        rarity: 'legendary',
        category: 'portfolio',
        requirement: { portfolioValue: 1000000 },
      },
    ];

    achievements.forEach(achievement => {
      this.achievements.set(achievement.id, achievement);
    });
  }

  // Initialize quests
  initializeQuests() {
    const quests = [
      {
        id: 'daily_trader',
        name: 'Daily Trader',
        description: 'Make 3 trades today',
        icon: '📅',
        points: 150,
        type: 'daily',
        requirement: { trades: 3 },
        deadline: 24 * 60 * 60 * 1000, // 24 hours
        reward: { points: 150, bonus: 0.1 },
      },
      {
        id: 'weekly_profits',
        name: 'Weekly Profits',
        description: 'Make $1000 profit this week',
        icon: '💵',
        points: 500,
        type: 'weekly',
        requirement: { profit: 1000 },
        deadline: 7 * 24 * 60 * 60 * 1000, // 7 days
        reward: { points: 500, bonus: 0.2 },
      },
      {
        id: 'social_butterfly',
        name: 'Social Butterfly',
        description: 'Follow 5 new traders this week',
        icon: '🦋',
        points: 300,
        type: 'weekly',
        requirement: { newFollows: 5 },
        deadline: 7 * 24 * 60 * 60 * 1000,
        reward: { points: 300, bonus: 0.15 },
      },
      {
        id: 'ai_explorer',
        name: 'AI Explorer',
        description: 'Use AI predictions 20 times this week',
        icon: '🔮',
        points: 400,
        type: 'weekly',
        requirement: { aiPredictions: 20 },
        deadline: 7 * 24 * 60 * 60 * 1000,
        reward: { points: 400, bonus: 0.18 },
      },
    ];

    quests.forEach(quest => {
      this.quests.set(quest.id, quest);
    });
  }

  // Initialize rewards
  initializeRewards() {
    const rewards = [
      {
        id: 'trading_fee_discount',
        name: 'Trading Fee Discount',
        description: '10% discount on trading fees for 7 days',
        icon: '💳',
        type: 'discount',
        value: 0.1,
        duration: 7 * 24 * 60 * 60 * 1000,
        cost: 1000,
      },
      {
        id: 'premium_ai_access',
        name: 'Premium AI Access',
        description: 'Access to advanced AI predictions for 30 days',
        icon: '🤖',
        type: 'premium',
        value: 1,
        duration: 30 * 24 * 60 * 60 * 1000,
        cost: 2000,
      },
      {
        id: 'exclusive_badge',
        name: 'Exclusive Badge',
        description: 'Special badge for your profile',
        icon: '🏆',
        type: 'cosmetic',
        value: 1,
        duration: null,
        cost: 500,
      },
      {
        id: 'portfolio_analysis',
        name: 'Portfolio Analysis',
        description: 'Detailed AI analysis of your portfolio',
        icon: '📊',
        type: 'service',
        value: 1,
        duration: null,
        cost: 800,
      },
    ];

    rewards.forEach(reward => {
      this.rewards.set(reward.id, reward);
    });
  }

  // Get user achievements
  getUserAchievements(userId) {
    const userStats = this.userStats.get(userId) || this.createUserStats(userId);
    const unlockedAchievements = [];

    for (const [achievementId, achievement] of this.achievements) {
      if (this.checkAchievementRequirement(userStats, achievement.requirement)) {
        unlockedAchievements.push({
          ...achievement,
          unlockedAt: Date.now(),
          progress: this.calculateProgress(userStats, achievement.requirement),
        });
      }
    }

    return unlockedAchievements;
  }

  // Get available quests
  getAvailableQuests(userId) {
    const userStats = this.userStats.get(userId) || this.createUserStats(userId);
    const availableQuests = [];

    for (const [questId, quest] of this.quests) {
      if (!userStats.completedQuests?.includes(questId)) {
        availableQuests.push({
          ...quest,
          progress: this.calculateProgress(userStats, quest.requirement),
          timeRemaining: quest.deadline,
        });
      }
    }

    return availableQuests;
  }

  // Complete a quest
  async completeQuest(userId, questId) {
    const quest = this.quests.get(questId);
    if (!quest) throw new Error('Quest not found');

    const userStats = this.userStats.get(userId) || this.createUserStats(userId);
    
    if (this.checkAchievementRequirement(userStats, quest.requirement)) {
      userStats.points += quest.points;
      userStats.completedQuests = userStats.completedQuests || [];
      userStats.completedQuests.push(questId);
      
      // Apply bonus
      if (quest.reward.bonus) {
        userStats.bonusMultiplier = (userStats.bonusMultiplier || 1) + quest.reward.bonus;
      }
      
      this.userStats.set(userId, userStats);
      return { success: true, points: quest.points, bonus: quest.reward.bonus };
    }
    
    return { success: false, message: 'Quest requirements not met' };
  }

  // Get leaderboard
  getLeaderboard(category = 'points', limit = 10) {
    const users = Array.from(this.userStats.entries())
      .map(([userId, stats]) => ({
        userId,
        ...stats,
        rank: 0, // Will be set after sorting
      }))
      .sort((a, b) => b[category] - a[category])
      .slice(0, limit);

    users.forEach((user, index) => {
      user.rank = index + 1;
    });

    return users;
  }

  // Get user stats
  getUserStats(userId) {
    return this.userStats.get(userId) || this.createUserStats(userId);
  }

  // Update user stats
  updateUserStats(userId, updates) {
    const userStats = this.userStats.get(userId) || this.createUserStats(userId);
    Object.assign(userStats, updates);
    this.userStats.set(userId, userStats);
    
    // Check for new achievements
    this.checkNewAchievements(userId);
  }

  // Get available rewards
  getAvailableRewards() {
    return Array.from(this.rewards.values());
  }

  // Purchase reward
  purchaseReward(userId, rewardId) {
    const reward = this.rewards.get(rewardId);
    const userStats = this.userStats.get(userId);
    
    if (!reward || !userStats) return { success: false, message: 'Invalid reward or user' };
    
    if (userStats.points < reward.cost) {
      return { success: false, message: 'Insufficient points' };
    }
    
    userStats.points -= reward.cost;
    userStats.activeRewards = userStats.activeRewards || [];
    userStats.activeRewards.push({
      ...reward,
      purchasedAt: Date.now(),
      expiresAt: reward.duration ? Date.now() + reward.duration : null,
    });
    
    this.userStats.set(userId, userStats);
    return { success: true, message: 'Reward purchased successfully' };
  }

  // Get user level
  getUserLevel(userId) {
    const userStats = this.userStats.get(userId);
    if (!userStats) return 1;
    
    const points = userStats.points || 0;
    return Math.floor(points / 1000) + 1; // 1000 points per level
  }

  // Get user badges
  getUserBadges(userId) {
    const userStats = this.userStats.get(userId);
    if (!userStats) return [];
    
    const badges = [];
    const level = this.getUserLevel(userId);
    
    if (level >= 5) badges.push({ name: 'Rising Star', icon: '⭐' });
    if (level >= 10) badges.push({ name: 'Expert Trader', icon: '🏆' });
    if (level >= 20) badges.push({ name: 'Trading Legend', icon: '👑' });
    
    if (userStats.winRate >= 80) badges.push({ name: 'High Accuracy', icon: '🎯' });
    if (userStats.totalTrades >= 1000) badges.push({ name: 'Veteran', icon: '🛡️' });
    if (userStats.socialScore >= 1000) badges.push({ name: 'Social Influencer', icon: '📢' });
    
    return badges;
  }

  // Helper methods
  createUserStats(userId) {
    const stats = {
      userId,
      points: 0,
      level: 1,
      totalTrades: 0,
      winRate: 0,
      totalProfit: 0,
      socialScore: 0,
      aiPredictions: 0,
      completedQuests: [],
      activeRewards: [],
      bonusMultiplier: 1,
      achievements: [],
      badges: [],
    };
    
    this.userStats.set(userId, stats);
    return stats;
  }

  checkAchievementRequirement(userStats, requirement) {
    for (const [key, value] of Object.entries(requirement)) {
      if ((userStats[key] || 0) < value) {
        return false;
      }
    }
    return true;
  }

  calculateProgress(userStats, requirement) {
    const progress = {};
    for (const [key, value] of Object.entries(requirement)) {
      progress[key] = {
        current: userStats[key] || 0,
        required: value,
        percentage: Math.min(((userStats[key] || 0) / value) * 100, 100),
      };
    }
    return progress;
  }

  checkNewAchievements(userId) {
    const userStats = this.userStats.get(userId);
    if (!userStats) return;
    
    const unlockedAchievements = this.getUserAchievements(userId);
    const newAchievements = unlockedAchievements.filter(
      achievement => !userStats.achievements.includes(achievement.id)
    );
    
    if (newAchievements.length > 0) {
      userStats.achievements.push(...newAchievements.map(a => a.id));
      userStats.points += newAchievements.reduce((sum, a) => sum + a.points, 0);
      this.userStats.set(userId, userStats);
    }
  }
}

// Create singleton instance
export const gamificationService = new GamificationService();

export default gamificationService;




