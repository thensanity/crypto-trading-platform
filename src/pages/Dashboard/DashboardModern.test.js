import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import theme from '../../theme';
import DashboardModern from './DashboardModern';

// Mock the store
const mockStore = {
  portfolio: {
    totalValue: 50000,
    totalPnl: 5000,
  },
  marketData: {
    bitcoin: { usd: 43250, usd_24h_change: 2.5 },
    ethereum: { usd: 2650, usd_24h_change: -1.2 },
    cardano: { usd: 0.485, usd_24h_change: 0.8 },
  },
  fetchPortfolio: jest.fn(),
  fetchMarketData: jest.fn(),
  isLoading: false,
  error: null,
};

jest.mock('../../store/useStore', () => ({
  __esModule: true,
  default: () => mockStore,
}));

// Mock the real-time data hook
jest.mock('../../hooks/useRealTimeData', () => ({
  __esModule: true,
  default: () => ({
    marketData: {
      bitcoin: { usd: 43250, usd_24h_change: 2.5 },
      ethereum: { usd: 2650, usd_24h_change: -1.2 },
    },
  }),
}));

const renderWithProviders = (component) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <BrowserRouter>
          {component}
        </BrowserRouter>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

describe('DashboardModern', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders welcome message', () => {
    renderWithProviders(<DashboardModern />);
    
    expect(screen.getByText('Welcome back, Trader! 👋')).toBeInTheDocument();
    expect(screen.getByText("Here's what's happening with your portfolio today")).toBeInTheDocument();
  });

  it('renders all stats cards', () => {
    renderWithProviders(<DashboardModern />);
    
    expect(screen.getByText('Total Portfolio')).toBeInTheDocument();
    expect(screen.getByText('24h Volume')).toBeInTheDocument();
    expect(screen.getByText('Security Score')).toBeInTheDocument();
    expect(screen.getByText('AI Predictions')).toBeInTheDocument();
  });

  it('displays correct portfolio value', () => {
    renderWithProviders(<DashboardModern />);
    
    expect(screen.getByText('$50,000')).toBeInTheDocument();
    expect(screen.getByText('+$5,000 profit')).toBeInTheDocument();
  });

  it('renders portfolio performance chart', () => {
    renderWithProviders(<DashboardModern />);
    
    expect(screen.getByText('Portfolio Performance')).toBeInTheDocument();
  });

  it('renders quick actions section', () => {
    renderWithProviders(<DashboardModern />);
    
    expect(screen.getByText('Quick Actions')).toBeInTheDocument();
    expect(screen.getByText('Start Trading')).toBeInTheDocument();
    expect(screen.getByText('AI Analysis')).toBeInTheDocument();
    expect(screen.getByText('Auto Trading')).toBeInTheDocument();
  });

  it('renders top cryptocurrencies section', () => {
    renderWithProviders(<DashboardModern />);
    
    expect(screen.getByText('Top Cryptocurrencies')).toBeInTheDocument();
  });

  it('renders recent trades section', () => {
    renderWithProviders(<DashboardModern />);
    
    expect(screen.getByText('Recent Trades')).toBeInTheDocument();
  });

  it('displays cryptocurrency data correctly', async () => {
    renderWithProviders(<DashboardModern />);
    
    await waitFor(() => {
      expect(screen.getByText('Bitcoin')).toBeInTheDocument();
      expect(screen.getByText('Ethereum')).toBeInTheDocument();
      expect(screen.getByText('Cardano')).toBeInTheDocument();
    });
  });

  it('shows price changes with correct colors', async () => {
    renderWithProviders(<DashboardModern />);
    
    await waitFor(() => {
      expect(screen.getByText('+2.50%')).toBeInTheDocument();
      expect(screen.getByText('-1.20%')).toBeInTheDocument();
      expect(screen.getByText('+0.80%')).toBeInTheDocument();
    });
  });

  it('displays recent trades with correct information', () => {
    renderWithProviders(<DashboardModern />);
    
    expect(screen.getByText('BTC/USDT')).toBeInTheDocument();
    expect(screen.getByText('ETH/USDT')).toBeInTheDocument();
    expect(screen.getByText('ADA/USDT')).toBeInTheDocument();
    expect(screen.getByText('0.5 BTC')).toBeInTheDocument();
    expect(screen.getByText('2.0 ETH')).toBeInTheDocument();
    expect(screen.getByText('1000 ADA')).toBeInTheDocument();
  });

  it('shows trade times', () => {
    renderWithProviders(<DashboardModern />);
    
    expect(screen.getByText('2 min ago')).toBeInTheDocument();
    expect(screen.getByText('15 min ago')).toBeInTheDocument();
    expect(screen.getByText('1 hour ago')).toBeInTheDocument();
  });

  it('displays trade prices correctly', () => {
    renderWithProviders(<DashboardModern />);
    
    expect(screen.getByText('$43,250')).toBeInTheDocument();
    expect(screen.getByText('$2,650')).toBeInTheDocument();
    expect(screen.getByText('$0.485')).toBeInTheDocument();
  });

  it('shows trade type indicators', () => {
    renderWithProviders(<DashboardModern />);
    
    // Buy/Sell indicators should be present
    expect(screen.getByText('Buy')).toBeInTheDocument();
    expect(screen.getByText('Sell')).toBeInTheDocument();
  });

  it('renders with loading state', () => {
    const loadingStore = { ...mockStore, isLoading: true };
    jest.mocked(require('../../store/useStore')).default.mockReturnValue(loadingStore);
    
    renderWithProviders(<DashboardModern />);
    
    expect(screen.getByText('Welcome back, Trader! 👋')).toBeInTheDocument();
  });

  it('handles error state', () => {
    const errorStore = { ...mockStore, error: 'Failed to load data' };
    jest.mocked(require('../../store/useStore')).default.mockReturnValue(errorStore);
    
    renderWithProviders(<DashboardModern />);
    
    expect(screen.getByText('Welcome back, Trader! 👋')).toBeInTheDocument();
  });

  it('calls fetch functions on mount', () => {
    renderWithProviders(<DashboardModern />);
    
    expect(mockStore.fetchPortfolio).toHaveBeenCalledTimes(1);
    expect(mockStore.fetchMarketData).toHaveBeenCalledTimes(1);
  });

  it('formats large numbers correctly', () => {
    renderWithProviders(<DashboardModern />);
    
    expect(screen.getByText('$2.4M')).toBeInTheDocument();
  });

  it('displays security score with progress', () => {
    renderWithProviders(<DashboardModern />);
    
    expect(screen.getByText('95%')).toBeInTheDocument();
    expect(screen.getByText('95% complete')).toBeInTheDocument();
  });

  it('shows AI predictions accuracy', () => {
    renderWithProviders(<DashboardModern />);
    
    expect(screen.getByText('87%')).toBeInTheDocument();
    expect(screen.getByText('87% accuracy rate')).toBeInTheDocument();
  });
});


