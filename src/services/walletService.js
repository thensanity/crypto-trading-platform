import { tradingService } from './tradingService';

// Wallet service that manages real wallet operations
export class WalletService {
  constructor() {
    this.transactions = [];
    this.addresses = {};
    this.transactionIdCounter = 1;
  }

  // Get wallet balance
  getBalance() {
    return tradingService.getBalance();
  }

  // Get transaction history
  getTransactionHistory(limit = 50) {
    return this.transactions.slice(0, limit);
  }

  // Generate deposit address
  generateDepositAddress(currency) {
    const address = this.generateMockAddress(currency);
    this.addresses[currency] = address;
    
    console.log(`Generated deposit address for ${currency}: ${address}`);
    return address;
  }

  // Get deposit address
  getDepositAddress(currency) {
    return this.addresses[currency] || this.generateDepositAddress(currency);
  }

  // Simulate deposit
  async deposit(currency, amount, address = null) {
    console.log(`Processing deposit: ${amount} ${currency}`);
    
    // Simulate deposit processing time
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Add to balance
    const newBalance = tradingService.deposit(currency, amount);
    
    // Create transaction record
    const transaction = {
      id: this.transactionIdCounter++,
      type: 'deposit',
      currency,
      amount,
      address: address || this.getDepositAddress(currency),
      status: 'completed',
      timestamp: new Date().toISOString(),
      hash: this.generateMockHash(),
    };
    
    this.transactions.unshift(transaction);
    
    console.log(`Deposit completed: ${amount} ${currency}`);
    return transaction;
  }

  // Simulate withdrawal
  async withdraw(currency, amount, address) {
    console.log(`Processing withdrawal: ${amount} ${currency} to ${address}`);
    
    try {
      // Check balance
      const balance = tradingService.getBalance();
      if (balance[currency] < amount) {
        throw new Error(`Insufficient ${currency} balance`);
      }
      
      // Simulate withdrawal processing time
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Deduct from balance
      const newBalance = tradingService.withdraw(currency, amount);
      
      // Create transaction record
      const transaction = {
        id: this.transactionIdCounter++,
        type: 'withdrawal',
        currency,
        amount,
        address,
        status: 'completed',
        timestamp: new Date().toISOString(),
        hash: this.generateMockHash(),
      };
      
      this.transactions.unshift(transaction);
      
      console.log(`Withdrawal completed: ${amount} ${currency}`);
      return transaction;
    } catch (error) {
      console.error('Withdrawal failed:', error);
      throw error;
    }
  }

  // Get transaction by ID
  getTransaction(transactionId) {
    return this.transactions.find(t => t.id === transactionId);
  }

  // Get transactions by type
  getTransactionsByType(type) {
    return this.transactions.filter(t => t.type === type);
  }

  // Get transactions by currency
  getTransactionsByCurrency(currency) {
    return this.transactions.filter(t => t.currency === currency);
  }

  // Generate mock address
  generateMockAddress(currency) {
    const prefixes = {
      BTC: '1',
      ETH: '0x',
      ADA: 'addr1',
      SOL: '',
      BNB: 'bnb',
      USDT: '0x',
    };
    
    const prefix = prefixes[currency] || '';
    const randomPart = Math.random().toString(36).substring(2, 15);
    return `${prefix}${randomPart}${Math.random().toString(36).substring(2, 10)}`;
  }

  // Generate mock transaction hash
  generateMockHash() {
    return '0x' + Math.random().toString(16).substring(2, 66);
  }

  // Get wallet statistics
  getWalletStats() {
    const balance = this.getBalance();
    const transactions = this.getTransactionHistory();
    
    const totalDeposits = transactions
      .filter(t => t.type === 'deposit')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const totalWithdrawals = transactions
      .filter(t => t.type === 'withdrawal')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const totalTransactions = transactions.length;
    
    return {
      totalDeposits,
      totalWithdrawals,
      totalTransactions,
      balance,
      lastTransaction: transactions[0] || null,
    };
  }

  // Get supported currencies
  getSupportedCurrencies() {
    return [
      { symbol: 'BTC', name: 'Bitcoin', decimals: 8 },
      { symbol: 'ETH', name: 'Ethereum', decimals: 18 },
      { symbol: 'ADA', name: 'Cardano', decimals: 6 },
      { symbol: 'SOL', name: 'Solana', decimals: 9 },
      { symbol: 'BNB', name: 'Binance Coin', decimals: 18 },
      { symbol: 'USDT', name: 'Tether', decimals: 6 },
    ];
  }

  // Validate address
  validateAddress(currency, address) {
    const patterns = {
      BTC: /^[13][a-km-zA-HJ-NP-Z1-9]{25,34}$/,
      ETH: /^0x[a-fA-F0-9]{40}$/,
      ADA: /^addr1[a-z0-9]{98}$/,
      SOL: /^[1-9A-HJ-NP-Za-km-z]{32,44}$/,
      BNB: /^bnb[a-z0-9]{39}$/,
      USDT: /^0x[a-fA-F0-9]{40}$/,
    };
    
    const pattern = patterns[currency];
    return pattern ? pattern.test(address) : true;
  }

  // Get transaction status
  getTransactionStatus(transactionId) {
    const transaction = this.getTransaction(transactionId);
    return transaction ? transaction.status : 'not_found';
  }

  // Update transaction status
  updateTransactionStatus(transactionId, status) {
    const transaction = this.getTransaction(transactionId);
    if (transaction) {
      transaction.status = status;
      transaction.updatedAt = new Date().toISOString();
    }
  }
}

// Create singleton instance
export const walletService = new WalletService();

export default walletService;

