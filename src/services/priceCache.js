// Price cache to reduce API calls
class PriceCache {
  constructor() {
    this.cache = new Map();
    this.cacheTimeout = 30000; // 30 seconds
  }

  // Get cached price
  getPrice(symbol) {
    const cached = this.cache.get(symbol);
    if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
      return cached.price;
    }
    return null;
  }

  // Set cached price
  setPrice(symbol, price) {
    this.cache.set(symbol, {
      price,
      timestamp: Date.now(),
    });
  }

  // Clear cache
  clear() {
    this.cache.clear();
  }

  // Get all cached prices
  getAllPrices() {
    const prices = {};
    for (const [symbol, data] of this.cache.entries()) {
      if (Date.now() - data.timestamp < this.cacheTimeout) {
        prices[symbol] = data.price;
      }
    }
    return prices;
  }
}

// Create singleton instance
export const priceCache = new PriceCache();

export default priceCache;

