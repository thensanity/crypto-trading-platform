import axios from 'axios';

// Free crypto APIs
const COINGECKO_API = 'https://api.coingecko.com/api/v3';
const BINANCE_API = 'https://api.binance.com/api/v3';

// Create axios instances
const coinGeckoClient = axios.create({
  baseURL: COINGECKO_API,
  timeout: 10000,
});

const binanceClient = axios.create({
  baseURL: BINANCE_API,
  timeout: 10000,
});

// Rate limiting helper
const rateLimit = (func, delay) => {
  let lastCall = 0;
  return (...args) => {
    const now = Date.now();
    if (now - lastCall < delay) {
      return new Promise(resolve => setTimeout(() => resolve(func(...args)), delay - (now - lastCall)));
    }
    lastCall = now;
    return func(...args);
  };
};

// Crypto API Service
export const cryptoApi = {
  // Get current prices for multiple cryptocurrencies
  getPrices: rateLimit(async (coinIds = ['bitcoin', 'ethereum', 'cardano', 'solana', 'binancecoin']) => {
    try {
      const response = await coinGeckoClient.get('/simple/price', {
        params: {
          ids: coinIds.join(','),
          vs_currencies: 'usd',
          include_24hr_change: true,
          include_24hr_vol: true,
          include_market_cap: true,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching prices:', error);
      // Fallback to mock data
      return {
        bitcoin: { usd: 43250.50, usd_24h_change: 2.45, usd_24h_vol: 2100000000, usd_market_cap: 850000000000 },
        ethereum: { usd: 2650.30, usd_24h_change: -1.23, usd_24h_vol: 1800000000, usd_market_cap: 320000000000 },
        cardano: { usd: 0.485, usd_24h_change: 5.12, usd_24h_vol: 320000000, usd_market_cap: 17000000000 },
        solana: { usd: 98.75, usd_24h_change: -2.34, usd_24h_vol: 280000000, usd_market_cap: 42000000000 },
        binancecoin: { usd: 315.20, usd_24h_change: 3.67, usd_24h_vol: 450000000, usd_market_cap: 48000000000 },
      };
    }
  }, 1000),

  // Get historical price data
  getHistoricalData: rateLimit(async (coinId, days = 1) => {
    try {
      const response = await coinGeckoClient.get(`/coins/${coinId}/market_chart`, {
        params: {
          vs_currency: 'usd',
          days: days,
          interval: days <= 1 ? 'hourly' : days <= 30 ? 'daily' : 'daily',
        },
      });
      
      return response.data.prices.map(([timestamp, price]) => ({
        timestamp,
        price,
        volume: response.data.total_volumes.find(([t]) => t === timestamp)?.[1] || 0,
      }));
    } catch (error) {
      console.error('Error fetching historical data:', error);
      // Fallback to mock data
      return generateMockHistoricalData(coinId, days);
    }
  }, 1000),

  // Get market data for a specific coin
  getCoinData: rateLimit(async (coinId) => {
    try {
      const response = await coinGeckoClient.get(`/coins/${coinId}`, {
        params: {
          localization: false,
          tickers: false,
          market_data: true,
          community_data: false,
          developer_data: false,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching coin data:', error);
      return null;
    }
  }, 1000),

  // Get trending cryptocurrencies
  getTrending: rateLimit(async () => {
    try {
      const response = await coinGeckoClient.get('/search/trending');
      return response.data.coins.map(coin => coin.item);
    } catch (error) {
      console.error('Error fetching trending coins:', error);
      return [];
    }
  }, 1000),

  // Get market statistics
  getGlobalStats: rateLimit(async () => {
    try {
      const response = await coinGeckoClient.get('/global');
      return response.data.data;
    } catch (error) {
      console.error('Error fetching global stats:', error);
      return {
        total_market_cap: { usd: 2100000000000 },
        total_volume: { usd: 45000000000 },
        market_cap_percentage: { btc: 42.5, eth: 18.2 },
        active_cryptocurrencies: 8945,
      };
    }
  }, 1000),
};

// Generate mock historical data as fallback
const generateMockHistoricalData = (coinId, days) => {
  const now = Date.now();
  const interval = days <= 1 ? 60 * 60 * 1000 : days <= 30 ? 24 * 60 * 60 * 1000 : 24 * 60 * 60 * 1000;
  const points = days <= 1 ? 24 : days <= 30 ? days : Math.min(days, 365);
  
  const basePrice = {
    bitcoin: 43000,
    ethereum: 2600,
    cardano: 0.45,
    solana: 95,
    binancecoin: 310,
  }[coinId] || 100;
  
  return Array.from({ length: points }, (_, i) => {
    const timestamp = now - (points - i) * interval;
    const variation = (Math.random() - 0.5) * 0.1; // ±5% variation
    const price = basePrice * (1 + variation);
    
    return {
      timestamp,
      price,
      volume: Math.random() * 1000000,
    };
  });
};

// WebSocket service for real-time updates
export class CryptoWebSocket {
  constructor() {
    this.ws = null;
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
    this.reconnectDelay = 1000;
  }

  connect(onMessage) {
    try {
      // Using a mock WebSocket for demonstration
      // In production, you would use a real WebSocket service
      this.ws = {
        send: (data) => console.log('Mock WS send:', data),
        close: () => console.log('Mock WS close'),
        readyState: 1,
      };
      
      // Simulate real-time updates
      this.updateInterval = setInterval(() => {
        const mockUpdate = {
          type: 'price_update',
          data: {
            bitcoin: { price: 43250.50 + (Math.random() - 0.5) * 100, change: 2.45 + (Math.random() - 0.5) * 2 },
            ethereum: { price: 2650.30 + (Math.random() - 0.5) * 50, change: -1.23 + (Math.random() - 0.5) * 2 },
            cardano: { price: 0.485 + (Math.random() - 0.5) * 0.01, change: 5.12 + (Math.random() - 0.5) * 2 },
            solana: { price: 98.75 + (Math.random() - 0.5) * 5, change: -2.34 + (Math.random() - 0.5) * 2 },
            binancecoin: { price: 315.20 + (Math.random() - 0.5) * 10, change: 3.67 + (Math.random() - 0.5) * 2 },
          },
          timestamp: Date.now(),
        };
        onMessage(mockUpdate);
      }, 2000); // Update every 2 seconds
      
    } catch (error) {
      console.error('WebSocket connection error:', error);
      this.handleReconnect(onMessage);
    }
  }

  handleReconnect(onMessage) {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      setTimeout(() => {
        console.log(`Reconnecting... attempt ${this.reconnectAttempts}`);
        this.connect(onMessage);
      }, this.reconnectDelay * this.reconnectAttempts);
    }
  }

  disconnect() {
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
    }
    if (this.ws) {
      this.ws.close();
    }
  }

  subscribe(symbols) {
    if (this.ws && this.ws.readyState === 1) {
      this.ws.send(JSON.stringify({
        method: 'SUBSCRIBE',
        params: symbols.map(symbol => `${symbol.toLowerCase()}usdt@ticker`),
        id: 1,
      }));
    }
  }
}

export default cryptoApi;
