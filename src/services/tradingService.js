import { realCryptoApi } from './realCryptoApi';
import { priceCache } from './priceCache';

// Mock trading service that simulates real trading
export class TradingService {
  constructor() {
    this.orders = [];
    this.positions = [];
    this.balance = {
      USDT: 10000, // Starting balance
      BTC: 0,
      ETH: 0,
      ADA: 0,
      SOL: 0,
      BNB: 0,
    };
    this.orderIdCounter = 1;
    this.transactionIdCounter = 1;
  }

  // Get current balance
  getBalance() {
    return { ...this.balance };
  }

  // Get all orders
  getOrders() {
    return [...this.orders];
  }

  // Get active orders
  getActiveOrders() {
    return this.orders.filter(order => order.status === 'open' || order.status === 'pending');
  }

  // Get order history
  getOrderHistory() {
    return this.orders.filter(order => order.status === 'filled' || order.status === 'cancelled');
  }

  // Get positions
  getPositions() {
    return [...this.positions];
  }

  // Place a real order
  async placeOrder(orderData) {
    console.log('Placing order:', orderData);
    
    const order = {
      id: this.orderIdCounter++,
      ...orderData,
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Add to orders
    this.orders.push(order);

    // Simulate order processing
    setTimeout(async () => {
      try {
        await this.processOrder(order);
      } catch (error) {
        console.error('Error processing order:', error);
        this.updateOrderStatus(order.id, 'failed', error.message);
      }
    }, 1000 + Math.random() * 2000); // 1-3 seconds delay

    return order;
  }

  // Process order (simulate real execution)
  async processOrder(order) {
    console.log('Processing order:', order.id);
    
    try {
      // Get current market price
      const marketPrice = await this.getCurrentPrice(order.pair);
      
      if (!marketPrice) {
        throw new Error('Unable to get current market price');
      }

      // Check if order can be executed
      const canExecute = this.canExecuteOrder(order, marketPrice);
      
      if (canExecute) {
        await this.executeOrder(order, marketPrice);
      } else {
        // Keep order open for limit orders
        this.updateOrderStatus(order.id, 'open');
      }
    } catch (error) {
      console.error('Error processing order:', error);
      this.updateOrderStatus(order.id, 'failed', error.message);
    }
  }

  // Check if order can be executed
  canExecuteOrder(order, marketPrice) {
    if (order.type === 'market') {
      return true;
    }
    
    if (order.type === 'limit') {
      if (order.side === 'buy' && marketPrice <= order.price) {
        return true;
      }
      if (order.side === 'sell' && marketPrice >= order.price) {
        return true;
      }
    }
    
    return false;
  }

  // Execute order
  async executeOrder(order, marketPrice) {
    console.log('Executing order:', order.id, 'at price:', marketPrice);
    
    const baseCurrency = order.pair.split('/')[0];
    const quoteCurrency = order.pair.split('/')[1];
    const executedPrice = order.type === 'market' ? marketPrice : order.price;
    const executedAmount = order.amount;
    const totalValue = executedPrice * executedAmount;

    // Check balance
    if (order.side === 'buy') {
      if (this.balance[quoteCurrency] < totalValue) {
        throw new Error(`Insufficient ${quoteCurrency} balance`);
      }
    } else {
      if (this.balance[baseCurrency] < executedAmount) {
        throw new Error(`Insufficient ${baseCurrency} balance`);
      }
    }

    // Execute the trade
    if (order.side === 'buy') {
      this.balance[quoteCurrency] -= totalValue;
      this.balance[baseCurrency] += executedAmount;
    } else {
      this.balance[baseCurrency] -= executedAmount;
      this.balance[quoteCurrency] += totalValue;
    }

    // Update order status
    this.updateOrderStatus(order.id, 'filled', null, {
      executedPrice,
      executedAmount,
      totalValue,
      executedAt: new Date().toISOString(),
    });

    // Create transaction record
    this.createTransaction({
      type: 'trade',
      pair: order.pair,
      side: order.side,
      amount: executedAmount,
      price: executedPrice,
      total: totalValue,
      orderId: order.id,
    });

    // Update positions
    this.updatePositions(baseCurrency, executedAmount, executedPrice, order.side);

    console.log('Order executed successfully:', order.id);
  }

  // Update order status
  updateOrderStatus(orderId, status, error = null, executionData = null) {
    const order = this.orders.find(o => o.id === orderId);
    if (order) {
      order.status = status;
      order.updatedAt = new Date().toISOString();
      
      if (error) {
        order.error = error;
      }
      
      if (executionData) {
        order.execution = executionData;
      }
    }
  }

  // Cancel order
  async cancelOrder(orderId) {
    console.log('Cancelling order:', orderId);
    
    const order = this.orders.find(o => o.id === orderId);
    if (!order) {
      throw new Error('Order not found');
    }
    
    if (order.status === 'filled' || order.status === 'cancelled') {
      throw new Error('Order cannot be cancelled');
    }
    
    this.updateOrderStatus(orderId, 'cancelled');
    return order;
  }

  // Get current market price
  async getCurrentPrice(pair) {
    try {
      const symbol = pair.replace('/', '');
      
      // Check cache first
      const cachedPrice = priceCache.getPrice(symbol);
      if (cachedPrice) {
        console.log(`Using cached price for ${symbol}: ${cachedPrice}`);
        return cachedPrice;
      }
      
      // Fetch from API
      const ticker = await realCryptoApi.getReal24hrTicker(symbol);
      const price = ticker.lastPrice;
      
      // Cache the price
      priceCache.setPrice(symbol, price);
      
      return price;
    } catch (error) {
      console.error('Error getting current price:', error);
      
      // Check cache for any available price
      const symbol = pair.replace('/', '');
      const cachedPrice = priceCache.getPrice(symbol);
      if (cachedPrice) {
        console.log(`Using cached fallback price for ${symbol}: ${cachedPrice}`);
        return cachedPrice;
      }
      
      // Fallback to mock price
      const mockPrices = {
        'BTC/USDT': 43250,
        'ETH/USDT': 2650,
        'ADA/USDT': 0.485,
        'SOL/USDT': 98.75,
        'BNB/USDT': 315.20,
      };
      const fallbackPrice = mockPrices[pair] || 100;
      
      // Cache the fallback price
      priceCache.setPrice(symbol, fallbackPrice);
      
      return fallbackPrice;
    }
  }

  // Create transaction record
  createTransaction(transactionData) {
    const transaction = {
      id: this.transactionIdCounter++,
      ...transactionData,
      timestamp: new Date().toISOString(),
    };
    
    console.log('Transaction created:', transaction);
    return transaction;
  }

  // Update positions
  updatePositions(currency, amount, price, side) {
    let position = this.positions.find(p => p.currency === currency);
    
    if (!position) {
      position = {
        currency,
        amount: 0,
        avgPrice: 0,
        totalValue: 0,
        unrealizedPnl: 0,
      };
      this.positions.push(position);
    }
    
    if (side === 'buy') {
      const newTotalValue = position.totalValue + (amount * price);
      const newAmount = position.amount + amount;
      position.amount = newAmount;
      position.avgPrice = newTotalValue / newAmount;
      position.totalValue = newTotalValue;
    } else {
      position.amount -= amount;
      position.totalValue = position.amount * position.avgPrice;
    }
    
    // Calculate unrealized P&L
    this.calculateUnrealizedPnl(position);
  }

  // Calculate unrealized P&L
  async calculateUnrealizedPnl(position) {
    try {
      // Use cached price or fallback to avoid excessive API calls
      const currentPrice = await this.getCurrentPrice(`${position.currency}/USDT`);
      const currentValue = position.amount * currentPrice;
      position.unrealizedPnl = currentValue - position.totalValue;
    } catch (error) {
      console.error('Error calculating P&L:', error);
      // Set P&L to 0 if calculation fails
      position.unrealizedPnl = 0;
    }
  }

  // Get portfolio summary
  async getPortfolioSummary() {
    const totalValue = Object.keys(this.balance).reduce((sum, currency) => {
      if (currency === 'USDT') {
        return sum + this.balance[currency];
      } else {
        // Calculate value in USDT
        const pair = `${currency}/USDT`;
        const price = this.getCurrentPrice(pair);
        return sum + (this.balance[currency] * price);
      }
    }, 0);

    const totalPnl = this.positions.reduce((sum, position) => {
      return sum + (position.unrealizedPnl || 0);
    }, 0);

    return {
      totalValue,
      totalPnl,
      totalPnlPercent: totalValue > 0 ? (totalPnl / (totalValue - totalPnl)) * 100 : 0,
      holdings: Object.keys(this.balance).map(currency => ({
        currency,
        amount: this.balance[currency],
        value: currency === 'USDT' ? this.balance[currency] : this.balance[currency] * (this.getCurrentPrice(`${currency}/USDT`) || 0),
      })),
    };
  }

  // Deposit funds (simulate)
  deposit(currency, amount) {
    console.log(`Depositing ${amount} ${currency}`);
    this.balance[currency] = (this.balance[currency] || 0) + amount;
    
    this.createTransaction({
      type: 'deposit',
      currency,
      amount,
    });
    
    return this.balance[currency];
  }

  // Withdraw funds (simulate)
  withdraw(currency, amount) {
    console.log(`Withdrawing ${amount} ${currency}`);
    
    if (this.balance[currency] < amount) {
      throw new Error(`Insufficient ${currency} balance`);
    }
    
    this.balance[currency] -= amount;
    
    this.createTransaction({
      type: 'withdrawal',
      currency,
      amount,
    });
    
    return this.balance[currency];
  }
}

// Create singleton instance
export const tradingService = new TradingService();

export default tradingService;
