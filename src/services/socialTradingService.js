// Social trading and copy trading service
export class SocialTradingService {
  constructor() {
    this.traders = new Map();
    this.followers = new Map();
    this.copiedTrades = [];
    this.leaderboard = [];
    this.initializeTopTraders();
  }

  // Initialize top traders
  initializeTopTraders() {
    const topTraders = [
      {
        id: 'crypto_whale_001',
        name: 'CryptoWhale',
        avatar: '🐋',
        totalReturn: 245.67,
        winRate: 87.5,
        followers: 15420,
        trades: 1247,
        riskLevel: 'medium',
        specialties: ['BTC', 'ETH', 'DeFi'],
        verified: true,
        badges: ['Top Performer', 'Risk Manager', 'DeFi Expert'],
      },
      {
        id: 'defi_master_002',
        name: 'DeFiMaster',
        avatar: '🏛️',
        totalReturn: 189.23,
        winRate: 82.1,
        followers: 8930,
        trades: 892,
        riskLevel: 'high',
        specialties: ['DeFi', 'Yield Farming', 'Liquidity'],
        verified: true,
        badges: ['DeFi Pioneer', 'Yield Optimizer', 'Liquidity Expert'],
      },
      {
        id: 'altcoin_hunter_003',
        name: 'AltcoinHunter',
        avatar: '🎯',
        totalReturn: 156.78,
        winRate: 79.3,
        followers: 6780,
        trades: 1567,
        riskLevel: 'high',
        specialties: ['Altcoins', 'Early Stage', 'Meme Coins'],
        verified: false,
        badges: ['Early Adopter', 'Trend Spotter'],
      },
      {
        id: 'swing_trader_004',
        name: 'SwingTrader',
        avatar: '📈',
        totalReturn: 134.45,
        winRate: 85.2,
        followers: 4520,
        trades: 234,
        riskLevel: 'low',
        specialties: ['Swing Trading', 'Technical Analysis', 'Risk Management'],
        verified: true,
        badges: ['Swing Master', 'Risk Manager', 'Technical Expert'],
      },
      {
        id: 'nft_king_005',
        name: 'NFTKing',
        avatar: '👑',
        totalReturn: 298.12,
        winRate: 91.7,
        followers: 12300,
        trades: 456,
        riskLevel: 'medium',
        specialties: ['NFTs', 'Gaming', 'Metaverse'],
        verified: true,
        badges: ['NFT Pioneer', 'Gaming Expert', 'Metaverse Visionary'],
      },
    ];

    topTraders.forEach(trader => {
      this.traders.set(trader.id, trader);
    });

    this.updateLeaderboard();
  }

  // Get top traders
  getTopTraders(limit = 10) {
    return this.leaderboard.slice(0, limit);
  }

  // Get trader details
  getTraderDetails(traderId) {
    return this.traders.get(traderId);
  }

  // Follow a trader
  followTrader(traderId, userId) {
    if (!this.followers.has(traderId)) {
      this.followers.set(traderId, new Set());
    }
    this.followers.get(traderId).add(userId);
    
    // Update follower count
    const trader = this.traders.get(traderId);
    if (trader) {
      trader.followers++;
    }
    
    return { success: true, message: 'Successfully followed trader' };
  }

  // Unfollow a trader
  unfollowTrader(traderId, userId) {
    if (this.followers.has(traderId)) {
      this.followers.get(traderId).delete(userId);
      
      // Update follower count
      const trader = this.traders.get(traderId);
      if (trader) {
        trader.followers--;
      }
    }
    
    return { success: true, message: 'Successfully unfollowed trader' };
  }

  // Copy a trade
  async copyTrade(traderId, tradeId, copyAmount) {
    const trader = this.traders.get(traderId);
    if (!trader) {
      throw new Error('Trader not found');
    }

    // Simulate copy trade processing
    await new Promise(resolve => setTimeout(resolve, 1000));

    const copiedTrade = {
      id: `copy_${Date.now()}`,
      originalTraderId: traderId,
      originalTradeId: tradeId,
      copyAmount,
      timestamp: Date.now(),
      status: 'pending',
      trader: trader.name,
    };

    this.copiedTrades.push(copiedTrade);
    
    return copiedTrade;
  }

  // Get copied trades
  getCopiedTrades(userId) {
    return this.copiedTrades.filter(trade => trade.userId === userId);
  }

  // Get trader's recent trades
  getTraderTrades(traderId, limit = 20) {
    // Simulate recent trades
    const trades = [];
    for (let i = 0; i < limit; i++) {
      trades.push({
        id: `trade_${traderId}_${i}`,
        traderId,
        pair: ['BTC/USDT', 'ETH/USDT', 'ADA/USDT', 'SOL/USDT'][Math.floor(Math.random() * 4)],
        side: Math.random() > 0.5 ? 'buy' : 'sell',
        amount: Math.random() * 10 + 0.1,
        price: Math.random() * 1000 + 100,
        pnl: (Math.random() - 0.5) * 1000,
        timestamp: Date.now() - Math.random() * 86400000 * 7, // Last 7 days
        status: Math.random() > 0.1 ? 'completed' : 'pending',
      });
    }
    
    return trades.sort((a, b) => b.timestamp - a.timestamp);
  }

  // Get trader performance
  getTraderPerformance(traderId, timeframe = '30d') {
    const trader = this.traders.get(traderId);
    if (!trader) return null;

    const performance = {
      traderId,
      timeframe,
      totalReturn: trader.totalReturn,
      winRate: trader.winRate,
      sharpeRatio: Math.random() * 2 + 1, // 1-3
      maxDrawdown: Math.random() * 0.2 + 0.05, // 5-25%
      avgTradeSize: Math.random() * 5000 + 1000, // $1k-$6k
      totalTrades: trader.trades,
      followers: trader.followers,
      riskLevel: trader.riskLevel,
      specialties: trader.specialties,
      badges: trader.badges,
      verified: trader.verified,
    };

    return performance;
  }

  // Get social feed
  getSocialFeed(limit = 20) {
    const feed = [];
    const traders = Array.from(this.traders.values());
    
    for (let i = 0; i < limit; i++) {
      const trader = traders[Math.floor(Math.random() * traders.length)];
      const trade = this.getTraderTrades(trader.id, 1)[0];
      
      feed.push({
        id: `feed_${i}`,
        traderId: trader.id,
        traderName: trader.name,
        traderAvatar: trader.avatar,
        action: Math.random() > 0.5 ? 'opened_position' : 'closed_position',
        trade: trade,
        timestamp: Date.now() - Math.random() * 3600000, // Last hour
        likes: Math.floor(Math.random() * 100),
        comments: Math.floor(Math.random() * 20),
        verified: trader.verified,
      });
    }
    
    return feed.sort((a, b) => b.timestamp - a.timestamp);
  }

  // Get market sentiment
  getMarketSentiment() {
    return {
      overall: Math.random() > 0.5 ? 'bullish' : 'bearish',
      score: (Math.random() - 0.5) * 2, // -1 to 1
      social: {
        twitter: Math.random() * 0.4 + 0.3, // 30-70%
        reddit: Math.random() * 0.4 + 0.3, // 30-70%
        discord: Math.random() * 0.4 + 0.3, // 30-70%
        telegram: Math.random() * 0.4 + 0.3, // 30-70%
      },
      trending: [
        { coin: 'BTC', sentiment: 'very_bullish', mentions: 15420 },
        { coin: 'ETH', sentiment: 'bullish', mentions: 8930 },
        { coin: 'ADA', sentiment: 'neutral', mentions: 4520 },
        { coin: 'SOL', sentiment: 'bearish', mentions: 2340 },
      ],
      influencers: [
        { name: 'CryptoWhale', impact: 'high', followers: 15420 },
        { name: 'DeFiMaster', impact: 'medium', followers: 8930 },
        { name: 'AltcoinHunter', impact: 'medium', followers: 6780 },
      ],
    };
  }

  // Get copy trading statistics
  getCopyTradingStats() {
    return {
      totalCopiedTrades: this.copiedTrades.length,
      successRate: Math.random() * 0.2 + 0.7, // 70-90%
      avgReturn: Math.random() * 0.3 + 0.1, // 10-40%
      topCopiedTraders: this.leaderboard.slice(0, 5),
      totalFollowers: Array.from(this.followers.values()).reduce((sum, set) => sum + set.size, 0),
      activeCopiers: Math.floor(Math.random() * 1000) + 500, // 500-1500
    };
  }

  // Update leaderboard
  updateLeaderboard() {
    this.leaderboard = Array.from(this.traders.values())
      .sort((a, b) => b.totalReturn - a.totalReturn);
  }

  // Get trader rankings
  getTraderRankings(category = 'totalReturn') {
    const rankings = Array.from(this.traders.values())
      .sort((a, b) => b[category] - a[category])
      .map((trader, index) => ({
        ...trader,
        rank: index + 1,
        change: Math.random() > 0.5 ? Math.floor(Math.random() * 5) + 1 : -(Math.floor(Math.random() * 5) + 1),
      }));
    
    return rankings;
  }

  // Get trader analytics
  getTraderAnalytics(traderId) {
    const trader = this.traders.get(traderId);
    if (!trader) return null;

    return {
      traderId,
      performance: {
        totalReturn: trader.totalReturn,
        winRate: trader.winRate,
        sharpeRatio: Math.random() * 2 + 1,
        maxDrawdown: Math.random() * 0.2 + 0.05,
        avgTradeSize: Math.random() * 5000 + 1000,
      },
      followers: {
        total: trader.followers,
        growth: Math.random() * 0.1 + 0.05, // 5-15% growth
        engagement: Math.random() * 0.3 + 0.4, // 40-70% engagement
        retention: Math.random() * 0.2 + 0.7, // 70-90% retention
      },
      trading: {
        totalTrades: trader.trades,
        avgTradeDuration: Math.random() * 7 + 1, // 1-8 days
        riskLevel: trader.riskLevel,
        specialties: trader.specialties,
      },
      social: {
        verified: trader.verified,
        badges: trader.badges,
        influence: Math.random() * 0.4 + 0.6, // 60-100% influence
        credibility: Math.random() * 0.2 + 0.8, // 80-100% credibility
      },
    };
  }
}

// Create singleton instance
export const socialTradingService = new SocialTradingService();

export default socialTradingService;

