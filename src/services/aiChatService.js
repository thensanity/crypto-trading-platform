// AI Chat Service for crypto trading assistance
import { realCryptoApi } from './realCryptoApi';
import { aiPredictionService } from './aiPredictionService';
import { socialTradingService } from './socialTradingService';

export class AIChatService {
  constructor() {
    this.conversationHistory = [];
    this.userPreferences = {
      riskTolerance: 'medium',
      tradingStyle: 'swing',
      favoriteCoins: ['BTC', 'ETH'],
      experience: 'intermediate',
    };
    this.analysisCache = new Map();
  }

  // Main chat function
  async chat(message, userId = 'user_001') {
    try {
      console.log('AI Chat: Processing message:', message);
      
      // Add user message to history
      this.conversationHistory.push({
        role: 'user',
        content: message,
        timestamp: Date.now(),
      });

      // Analyze the message and determine intent
      const intent = await this.analyzeIntent(message);
      console.log('AI Chat: Detected intent:', intent);

      // Generate appropriate response based on intent
      let response;
      switch (intent.type) {
        case 'price_inquiry':
          response = await this.handlePriceInquiry(intent.coins);
          break;
        case 'trading_suggestion':
          response = await this.handleTradingSuggestion(intent);
          break;
        case 'market_analysis':
          response = await this.handleMarketAnalysis();
          break;
        case 'portfolio_advice':
          response = await this.handlePortfolioAdvice();
          break;
        case 'technical_analysis':
          response = await this.handleTechnicalAnalysis(intent.coin);
          break;
        case 'news_sentiment':
          response = await this.handleNewsSentiment();
          break;
        case 'risk_assessment':
          response = await this.handleRiskAssessment(intent);
          break;
        case 'general_question':
          response = await this.handleGeneralQuestion(message);
          break;
        default:
          response = await this.handleGeneralQuestion(message);
      }

      // Add AI response to history
      this.conversationHistory.push({
        role: 'assistant',
        content: response,
        timestamp: Date.now(),
        intent: intent.type,
      });

      return {
        message: response,
        intent: intent.type,
        confidence: intent.confidence,
        suggestions: this.generateSuggestions(intent.type),
        timestamp: Date.now(),
      };
    } catch (error) {
      console.error('AI Chat Error:', error);
      return {
        message: "I apologize, but I'm having trouble processing your request right now. Please try again in a moment.",
        intent: 'error',
        confidence: 0,
        suggestions: ['Try asking about current prices', 'Ask for trading suggestions', 'Request market analysis'],
        timestamp: Date.now(),
      };
    }
  }

  // Analyze user intent using NLP simulation
  async analyzeIntent(message) {
    const lowerMessage = message.toLowerCase();
    
    // Price inquiry patterns
    if (this.matchesPattern(lowerMessage, ['price', 'cost', 'value', 'how much', 'current price'])) {
      const coins = this.extractCoins(message);
      return {
        type: 'price_inquiry',
        coins: coins.length > 0 ? coins : ['BTC', 'ETH'],
        confidence: 0.9,
      };
    }

    // Trading suggestion patterns
    if (this.matchesPattern(lowerMessage, ['should i buy', 'should i sell', 'trading advice', 'what to trade', 'recommend', 'suggestion'])) {
      const coins = this.extractCoins(message);
      return {
        type: 'trading_suggestion',
        coins: coins.length > 0 ? coins : ['BTC', 'ETH'],
        confidence: 0.85,
      };
    }

    // Market analysis patterns
    if (this.matchesPattern(lowerMessage, ['market', 'analysis', 'trend', 'outlook', 'forecast'])) {
      return {
        type: 'market_analysis',
        confidence: 0.8,
      };
    }

    // Portfolio advice patterns
    if (this.matchesPattern(lowerMessage, ['portfolio', 'diversify', 'allocation', 'balance', 'holdings'])) {
      return {
        type: 'portfolio_advice',
        confidence: 0.8,
      };
    }

    // Technical analysis patterns
    if (this.matchesPattern(lowerMessage, ['technical', 'chart', 'indicator', 'rsi', 'macd', 'support', 'resistance'])) {
      const coins = this.extractCoins(message);
      return {
        type: 'technical_analysis',
        coin: coins.length > 0 ? coins[0] : 'BTC',
        confidence: 0.85,
      };
    }

    // News sentiment patterns
    if (this.matchesPattern(lowerMessage, ['news', 'sentiment', 'social', 'twitter', 'reddit', 'community'])) {
      return {
        type: 'news_sentiment',
        confidence: 0.8,
      };
    }

    // Risk assessment patterns
    if (this.matchesPattern(lowerMessage, ['risk', 'safe', 'dangerous', 'volatile', 'stability'])) {
      return {
        type: 'risk_assessment',
        confidence: 0.8,
      };
    }

    // Default to general question
    return {
      type: 'general_question',
      confidence: 0.6,
    };
  }

  // Handle price inquiries
  async handlePriceInquiry(coins) {
    try {
      const prices = await realCryptoApi.getRealTimePrices();
      const coinData = [];
      
      for (const coin of coins) {
        const coinId = coin.toLowerCase();
        if (prices[coinId]) {
          const price = prices[coinId].usd;
          const change = prices[coinId].usd_24h_change;
          coinData.push({
            symbol: coin,
            price: price,
            change: change,
            changePercent: change,
          });
        }
      }

      if (coinData.length === 0) {
        return "I couldn't find current price data for those cryptocurrencies. Please try asking about BTC, ETH, ADA, SOL, or BNB.";
      }

      let response = "Here are the current prices:\n\n";
      coinData.forEach(coin => {
        const changeIcon = coin.change >= 0 ? "📈" : "📉";
        const changeColor = coin.change >= 0 ? "green" : "red";
        response += `${changeIcon} **${coin.symbol}**: $${coin.price.toLocaleString()} (${coin.change >= 0 ? '+' : ''}${coin.change.toFixed(2)}%)\n`;
      });

      return response;
    } catch (error) {
      console.error('Error fetching prices:', error);
      return "I'm having trouble fetching current price data. Please try again in a moment.";
    }
  }

  // Handle trading suggestions
  async handleTradingSuggestion(intent) {
    try {
      const coins = intent.coins || ['BTC', 'ETH'];
      const suggestions = [];

      for (const coin of coins) {
        // Get AI prediction
        const prediction = await aiPredictionService.predictPrice(coin.toLowerCase(), '1h');
        
        // Get market sentiment
        const sentiment = await socialTradingService.getMarketSentiment();
        
        // Get technical analysis
        const trend = await aiPredictionService.analyzeTrend(coin.toLowerCase());
        
        // Generate suggestion
        const suggestion = this.generateTradingSuggestion(coin, prediction, sentiment, trend);
        suggestions.push(suggestion);
      }

      let response = "🤖 **AI Trading Suggestions:**\n\n";
      suggestions.forEach((suggestion, index) => {
        response += `**${suggestion.coin} Analysis:**\n`;
        response += `📊 **Prediction**: ${suggestion.prediction}\n`;
        response += `📈 **Trend**: ${suggestion.trend}\n`;
        response += `💡 **Recommendation**: ${suggestion.recommendation}\n`;
        response += `⚠️ **Risk Level**: ${suggestion.riskLevel}\n`;
        response += `🎯 **Confidence**: ${suggestion.confidence}%\n\n`;
      });

      return response;
    } catch (error) {
      console.error('Error generating trading suggestions:', error);
      return "I'm having trouble analyzing the market right now. Please try again in a moment.";
    }
  }

  // Handle market analysis
  async handleMarketAnalysis() {
    try {
      const sentiment = await socialTradingService.getMarketSentiment();
      const globalStats = await realCryptoApi.getRealGlobalStats();
      
      let response = "📊 **Market Analysis Report:**\n\n";
      
      // Overall sentiment
      response += `🌍 **Overall Sentiment**: ${sentiment.overall === 'bullish' ? '🟢 Bullish' : '🔴 Bearish'}\n`;
      response += `📈 **Sentiment Score**: ${(sentiment.score * 100).toFixed(1)}%\n\n`;
      
      // Social media breakdown
      response += `📱 **Social Media Sentiment:**\n`;
      response += `• Twitter: ${(sentiment.social.twitter * 100).toFixed(1)}%\n`;
      response += `• Reddit: ${(sentiment.social.reddit * 100).toFixed(1)}%\n`;
      response += `• Discord: ${(sentiment.social.discord * 100).toFixed(1)}%\n`;
      response += `• Telegram: ${(sentiment.social.telegram * 100).toFixed(1)}%\n\n`;
      
      // Trending coins
      response += `🔥 **Trending Coins:**\n`;
      sentiment.trending.forEach(coin => {
        const emoji = coin.sentiment === 'very_bullish' ? '🚀' : 
                     coin.sentiment === 'bullish' ? '📈' : 
                     coin.sentiment === 'bearish' ? '📉' : '➡️';
        response += `${emoji} **${coin.coin}**: ${coin.sentiment} (${coin.mentions} mentions)\n`;
      });

      return response;
    } catch (error) {
      console.error('Error generating market analysis:', error);
      return "I'm having trouble analyzing the market right now. Please try again in a moment.";
    }
  }

  // Handle portfolio advice
  async handlePortfolioAdvice() {
    try {
      const optimization = await aiPredictionService.optimizePortfolio({
        BTC: 0.4,
        ETH: 0.3,
        ADA: 0.2,
        SOL: 0.1,
      });

      let response = "💼 **Portfolio Optimization Advice:**\n\n";
      response += `📊 **Current Allocation**:\n`;
      response += `• BTC: 40%\n`;
      response += `• ETH: 30%\n`;
      response += `• ADA: 20%\n`;
      response += `• SOL: 10%\n\n`;
      
      response += `🎯 **AI Recommended Allocation**:\n`;
      Object.entries(optimization.recommendedAllocation).forEach(([coin, percentage]) => {
        response += `• ${coin}: ${(percentage * 100).toFixed(1)}%\n`;
      });
      
      response += `\n📈 **Expected Return**: ${(optimization.expectedReturn * 100).toFixed(1)}%\n`;
      response += `🛡️ **Risk Reduction**: ${(optimization.riskReduction * 100).toFixed(1)}%\n`;
      response += `🎯 **Confidence**: ${(optimization.confidence * 100).toFixed(1)}%\n\n`;
      
      response += `💡 **Key Recommendations**:\n`;
      response += `• Diversify across different sectors\n`;
      response += `• Consider rebalancing monthly\n`;
      response += `• Monitor correlation with traditional markets\n`;
      response += `• Set stop-loss orders for risk management\n`;

      return response;
    } catch (error) {
      console.error('Error generating portfolio advice:', error);
      return "I'm having trouble analyzing your portfolio right now. Please try again in a moment.";
    }
  }

  // Handle technical analysis
  async handleTechnicalAnalysis(coin) {
    try {
      const trend = await aiPredictionService.analyzeTrend(coin.toLowerCase());
      const risk = await aiPredictionService.assessRisk(coin.toLowerCase());
      
      let response = `📊 **Technical Analysis for ${coin.toUpperCase()}:**\n\n`;
      
      response += `📈 **Trend Analysis**:\n`;
      response += `• Direction: ${trend.trend === 'bullish' ? '🟢 Bullish' : '🔴 Bearish'}\n`;
      response += `• Strength: ${(trend.strength * 100).toFixed(1)}%\n`;
      response += `• Duration: ${trend.duration.toFixed(1)} days\n`;
      response += `• Support: $${trend.support.toFixed(2)}\n`;
      response += `• Resistance: $${trend.resistance.toFixed(2)}\n\n`;
      
      response += `📊 **Technical Indicators**:\n`;
      response += `• RSI: ${trend.indicators.rsi.toFixed(2)}\n`;
      response += `• MACD: ${trend.indicators.macd.toFixed(4)}\n`;
      response += `• Bollinger: ${trend.indicators.bollinger}\n\n`;
      
      response += `⚠️ **Risk Assessment**:\n`;
      response += `• Risk Level: ${risk.riskLevel}\n`;
      response += `• Risk Score: ${risk.score.toFixed(1)}/100\n`;
      response += `• Volatility: ${(risk.factors.volatility * 100).toFixed(1)}%\n`;
      response += `• Liquidity: ${(risk.factors.liquidity * 100).toFixed(1)}%\n\n`;
      
      response += `💡 **Recommendations**:\n`;
      risk.recommendations.forEach(rec => {
        response += `• ${rec}\n`;
      });

      return response;
    } catch (error) {
      console.error('Error generating technical analysis:', error);
      return "I'm having trouble analyzing the technical indicators right now. Please try again in a moment.";
    }
  }

  // Handle news sentiment
  async handleNewsSentiment() {
    try {
      const sentiment = await socialTradingService.getMarketSentiment();
      
      let response = "📰 **News & Social Sentiment Analysis:**\n\n";
      
      response += `🌍 **Overall Market Sentiment**: ${sentiment.overall === 'bullish' ? '🟢 Bullish' : '🔴 Bearish'}\n`;
      response += `📊 **Sentiment Score**: ${(sentiment.score * 100).toFixed(1)}%\n\n`;
      
      response += `📱 **Social Media Breakdown**:\n`;
      Object.entries(sentiment.social).forEach(([platform, score]) => {
        const emoji = platform === 'twitter' ? '🐦' : 
                     platform === 'reddit' ? '🤖' : 
                     platform === 'discord' ? '💬' : '📱';
        response += `${emoji} **${platform.charAt(0).toUpperCase() + platform.slice(1)}**: ${(score * 100).toFixed(1)}%\n`;
      });
      
      response += `\n🔥 **Trending Topics**:\n`;
      sentiment.trending.forEach(coin => {
        const emoji = coin.sentiment === 'very_bullish' ? '🚀' : 
                     coin.sentiment === 'bullish' ? '📈' : 
                     coin.sentiment === 'bearish' ? '📉' : '➡️';
        response += `${emoji} **${coin.coin}**: ${coin.sentiment} (${coin.mentions} mentions)\n`;
      });
      
      response += `\n👥 **Key Influencers**:\n`;
      sentiment.influencers.forEach(influencer => {
        response += `• **${influencer.name}**: ${influencer.impact} impact (${influencer.followers} followers)\n`;
      });

      return response;
    } catch (error) {
      console.error('Error generating news sentiment:', error);
      return "I'm having trouble analyzing news sentiment right now. Please try again in a moment.";
    }
  }

  // Handle risk assessment
  async handleRiskAssessment(intent) {
    try {
      const coins = intent.coins || ['BTC', 'ETH'];
      const riskAssessments = [];
      
      for (const coin of coins) {
        const risk = await aiPredictionService.assessRisk(coin.toLowerCase());
        riskAssessments.push({ coin, ...risk });
      }

      let response = "⚠️ **Risk Assessment Report:**\n\n";
      
      riskAssessments.forEach(assessment => {
        const riskEmoji = assessment.riskLevel === 'low' ? '🟢' : 
                         assessment.riskLevel === 'medium' ? '🟡' : '🔴';
        
        response += `${riskEmoji} **${assessment.coin} Risk Analysis**:\n`;
        response += `• Risk Level: ${assessment.riskLevel}\n`;
        response += `• Risk Score: ${assessment.score.toFixed(1)}/100\n`;
        response += `• Volatility: ${(assessment.factors.volatility * 100).toFixed(1)}%\n`;
        response += `• Liquidity: ${(assessment.factors.liquidity * 100).toFixed(1)}%\n`;
        response += `• Correlation: ${(assessment.factors.correlation * 100).toFixed(1)}%\n`;
        response += `• Market Cap: ${(assessment.factors.marketCap * 100).toFixed(1)}%\n\n`;
      });

      return response;
    } catch (error) {
      console.error('Error generating risk assessment:', error);
      return "I'm having trouble assessing risk right now. Please try again in a moment.";
    }
  }

  // Handle general questions
  async handleGeneralQuestion(message) {
    const responses = [
      "I'm here to help with your crypto trading! You can ask me about:\n• Current prices\n• Trading suggestions\n• Market analysis\n• Portfolio advice\n• Technical analysis\n• Risk assessment",
      "I can assist you with various crypto trading topics. Try asking about specific coins, market trends, or trading strategies!",
      "Feel free to ask me anything about cryptocurrency trading. I can provide price updates, analysis, and trading recommendations.",
    ];
    
    return responses[Math.floor(Math.random() * responses.length)];
  }

  // Generate trading suggestion based on analysis
  generateTradingSuggestion(coin, prediction, sentiment, trend) {
    const confidence = Math.min(prediction.confidence * 100, 95);
    const riskLevel = prediction.direction === 'bullish' ? 'medium' : 'high';
    
    let recommendation;
    if (prediction.direction === 'bullish' && trend.strength > 0.7) {
      recommendation = `Consider buying ${coin} - strong bullish signals with ${confidence.toFixed(1)}% confidence`;
    } else if (prediction.direction === 'bearish' && trend.strength > 0.7) {
      recommendation = `Consider selling ${coin} - bearish trend detected with ${confidence.toFixed(1)}% confidence`;
    } else {
      recommendation = `Hold ${coin} - mixed signals, wait for clearer direction`;
    }

    return {
      coin,
      prediction: `${prediction.direction} trend expected`,
      trend: `${trend.trend} with ${(trend.strength * 100).toFixed(1)}% strength`,
      recommendation,
      riskLevel,
      confidence: confidence,
    };
  }

  // Generate contextual suggestions
  generateSuggestions(intentType) {
    const suggestions = {
      price_inquiry: ['Ask about price predictions', 'Request technical analysis', 'Get market sentiment'],
      trading_suggestion: ['Check risk assessment', 'View portfolio advice', 'Get market analysis'],
      market_analysis: ['Ask about specific coins', 'Request trading suggestions', 'Get news sentiment'],
      portfolio_advice: ['Check risk assessment', 'Get trading suggestions', 'View market analysis'],
      technical_analysis: ['Ask about other coins', 'Get trading suggestions', 'Check market sentiment'],
      news_sentiment: ['Get market analysis', 'Ask about specific coins', 'Request trading advice'],
      risk_assessment: ['Get portfolio advice', 'Check trading suggestions', 'View market analysis'],
      general_question: ['Ask about prices', 'Get trading suggestions', 'Request market analysis'],
    };
    
    return suggestions[intentType] || suggestions.general_question;
  }

  // Helper methods
  matchesPattern(text, patterns) {
    return patterns.some(pattern => text.includes(pattern));
  }

  extractCoins(message) {
    const coinPatterns = {
      'BTC': ['btc', 'bitcoin'],
      'ETH': ['eth', 'ethereum'],
      'ADA': ['ada', 'cardano'],
      'SOL': ['sol', 'solana'],
      'BNB': ['bnb', 'binance'],
      'DOGE': ['doge', 'dogecoin'],
      'XRP': ['xrp', 'ripple'],
    };
    
    const foundCoins = [];
    Object.entries(coinPatterns).forEach(([coin, patterns]) => {
      if (patterns.some(pattern => message.toLowerCase().includes(pattern))) {
        foundCoins.push(coin);
      }
    });
    
    return foundCoins;
  }

  // Get conversation history
  getConversationHistory() {
    return this.conversationHistory;
  }

  // Clear conversation history
  clearHistory() {
    this.conversationHistory = [];
  }

  // Update user preferences
  updatePreferences(preferences) {
    this.userPreferences = { ...this.userPreferences, ...preferences };
  }
}

// Create singleton instance
export const aiChatService = new AIChatService();

export default aiChatService;

