import { useEffect, useRef } from 'react';
import useStore from '../store/useStore';
import { RealTimeWebSocket } from '../services/realCryptoApi';
import { priceCache } from '../services/priceCache';

export const useRealTimeData = () => {
  const {
    marketData,
    fetchMarketData,
    fetchPortfolio,
    startRealTimeUpdates,
  } = useStore();
  
  const wsRef = useRef(null);
  const intervalRef = useRef(null);

  useEffect(() => {
    // Start real-time updates
    const cleanup = startRealTimeUpdates();
    
    // Initialize WebSocket connection
    const ws = new RealTimeWebSocket();
    wsRef.current = ws;
    
    ws.connect((update) => {
      if (update.type === 'price_update') {
        // Update market data with real-time prices
        const updatedMarketData = { ...marketData };
        Object.keys(update.data).forEach(coinId => {
          if (updatedMarketData[coinId]) {
            updatedMarketData[coinId] = {
              ...updatedMarketData[coinId],
              usd: update.data[coinId].price,
              usd_24h_change: update.data[coinId].change,
            };
          }
        });
        
        // Update the store with new data
        useStore.setState({ marketData: updatedMarketData });
      }
    });

    // Subscribe to price updates for major cryptocurrencies
    ws.subscribe(['BTC', 'ETH', 'ADA', 'SOL', 'BNB']);

    // Set up interval for portfolio updates (less frequent to reduce API calls)
    intervalRef.current = setInterval(() => {
      fetchPortfolio();
    }, 30000); // Update portfolio every 30 seconds

    return () => {
      cleanup();
      ws.disconnect();
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return {
    marketData,
    isLoading: useStore(state => state.isLoading),
    error: useStore(state => state.error),
  };
};

export default useRealTimeData;
