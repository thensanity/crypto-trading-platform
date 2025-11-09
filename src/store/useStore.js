import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import { realCryptoApi } from '../services/realCryptoApi';
import { tradingService } from '../services/tradingService';

const useStore = create(
  subscribeWithSelector((set, get) => ({
    // Market Data State
    marketData: {},
    chartData: {},
    selectedTimeframe: '1d',
    selectedCoin: 'bitcoin',
    isLoading: false,
    error: null,
    
    // Portfolio State
    portfolio: {
      totalValue: 0,
      totalPnl: 0,
      holdings: [],
    },
    
    // Trading State
    orders: [],
    activeOrders: [],
    orderHistory: [],
    
    // Wallet State
    balances: {},
    transactions: [],
    
    // User State
    user: {
      isAuthenticated: true,
      profile: {
        name: 'John Doe',
        email: 'john.doe@example.com',
        kycStatus: 'completed',
      },
    },
    
    // Actions
    fetchMarketData: async () => {
      set({ isLoading: true, error: null });
      try {
        console.log('Fetching real market data...');
        const data = await realCryptoApi.getRealTimePrices();
        console.log('Market data received:', data);
        set({ marketData: data, isLoading: false });
      } catch (error) {
        console.error('Error fetching market data:', error);
        set({ error: error.message, isLoading: false });
      }
    },
    
    fetchChartData: async (coinId, timeframe) => {
      set({ isLoading: true, error: null });
      try {
        console.log(`Fetching chart data for ${coinId} (${timeframe})...`);
        
        // Convert timeframe to days for API
        const timeframeMap = {
          '1h': 1,
          '1d': 1,
          '1M': 30,
          '1Y': 365,
          'all': 365,
        };
        
        const days = timeframeMap[timeframe] || 1;
        const data = await realCryptoApi.getRealHistoricalData(coinId, days);
        
        console.log(`Chart data received: ${data.length} points`);
        set({ 
          chartData: { ...get().chartData, [`${coinId}_${timeframe}`]: data },
          selectedTimeframe: timeframe,
          selectedCoin: coinId,
          isLoading: false 
        });
      } catch (error) {
        console.error('Error fetching chart data:', error);
        set({ error: error.message, isLoading: false });
      }
    },
    
    fetchPortfolio: async () => {
      set({ isLoading: true, error: null });
      try {
        console.log('Fetching portfolio data...');
        const data = await tradingService.getPortfolioSummary();
        console.log('Portfolio data received:', data);
        set({ portfolio: data, isLoading: false });
      } catch (error) {
        console.error('Error fetching portfolio:', error);
        set({ error: error.message, isLoading: false });
      }
    },
    
    placeOrder: async (orderData) => {
      set({ isLoading: true, error: null });
      try {
        console.log('Placing order:', orderData);
        const order = await tradingService.placeOrder(orderData);
        console.log('Order placed:', order);
        
        set({ 
          orders: [...get().orders, order],
          activeOrders: [...get().activeOrders, order],
          isLoading: false 
        });
        return order;
      } catch (error) {
        console.error('Error placing order:', error);
        set({ error: error.message, isLoading: false });
        throw error;
      }
    },
    
    cancelOrder: async (orderId) => {
      try {
        console.log('Cancelling order:', orderId);
        const order = await tradingService.cancelOrder(orderId);
        
        const { activeOrders, orderHistory } = get();
        set({
          activeOrders: activeOrders.filter(o => o.id !== orderId),
          orderHistory: [...orderHistory, order],
        });
        
        return order;
      } catch (error) {
        console.error('Error cancelling order:', error);
        throw error;
      }
    },
    
    updateOrderStatus: (orderId, status) => {
      const { activeOrders, orderHistory } = get();
      const orderIndex = activeOrders.findIndex(o => o.id === orderId);
      if (orderIndex !== -1) {
        const updatedOrder = { ...activeOrders[orderIndex], status };
        const newActiveOrders = activeOrders.filter(o => o.id !== orderId);
        set({
          activeOrders: newActiveOrders,
          orderHistory: [...orderHistory, updatedOrder],
        });
      }
    },
    
    updateBalance: (symbol, amount) => {
      const { balances } = get();
      set({
        balances: {
          ...balances,
          [symbol]: (balances[symbol] || 0) + amount,
        },
      });
    },
    
    addTransaction: (transaction) => {
      const { transactions } = get();
      set({
        transactions: [transaction, ...transactions],
      });
    },
    
    setSelectedTimeframe: (timeframe) => {
      set({ selectedTimeframe: timeframe });
      get().fetchChartData(get().selectedCoin, timeframe);
    },
    
    setSelectedCoin: (coinId) => {
      set({ selectedCoin: coinId });
      get().fetchChartData(coinId, get().selectedTimeframe);
    },
    
    // Real-time updates simulation
    startRealTimeUpdates: () => {
      const interval = setInterval(() => {
        get().fetchMarketData();
        get().fetchPortfolio();
      }, 5000); // Update every 5 seconds
      
      return () => clearInterval(interval);
    },
  }))
);

export default useStore;
