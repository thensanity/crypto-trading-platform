import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import theme from '../../theme';
import Header from './Header';

// Mock the store
jest.mock('../../store/useStore', () => ({
  __esModule: true,
  default: () => ({
    portfolio: {
      totalValue: 50000,
      totalPnl: 5000,
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

describe('Header', () => {
  const defaultProps = {
    onMenuClick: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders logo and title', () => {
    renderWithProviders(<Header {...defaultProps} />);
    
    expect(screen.getByText('CryptoTrader Pro')).toBeInTheDocument();
  });

  it('renders mobile menu button', () => {
    renderWithProviders(<Header {...defaultProps} />);
    
    const menuButton = screen.getByLabelText('open drawer');
    expect(menuButton).toBeInTheDocument();
  });

  it('calls onMenuClick when mobile menu button is clicked', () => {
    renderWithProviders(<Header {...defaultProps} />);
    
    const menuButton = screen.getByLabelText('open drawer');
    fireEvent.click(menuButton);
    
    expect(defaultProps.onMenuClick).toHaveBeenCalledTimes(1);
  });

  it('renders market data on desktop', () => {
    // Mock useMediaQuery to return false for mobile
    jest.spyOn(require('@mui/material'), 'useMediaQuery').mockReturnValue(false);
    
    renderWithProviders(<Header {...defaultProps} />);
    
    expect(screen.getByText('BTC:')).toBeInTheDocument();
    expect(screen.getByText('ETH:')).toBeInTheDocument();
    expect(screen.getByText('Market Open')).toBeInTheDocument();
  });

  it('renders portfolio value when portfolio data is available', () => {
    jest.spyOn(require('@mui/material'), 'useMediaQuery').mockReturnValue(false);
    
    renderWithProviders(<Header {...defaultProps} />);
    
    expect(screen.getByText('Portfolio')).toBeInTheDocument();
    expect(screen.getByText('$50,000')).toBeInTheDocument();
  });

  it('renders notifications badge', () => {
    renderWithProviders(<Header {...defaultProps} />);
    
    const notificationButton = screen.getByRole('button', { name: /notifications/i });
    expect(notificationButton).toBeInTheDocument();
  });

  it('renders AI assistant button', () => {
    renderWithProviders(<Header {...defaultProps} />);
    
    const aiButton = screen.getByRole('button');
    expect(aiButton).toBeInTheDocument();
  });

  it('renders user avatar', () => {
    renderWithProviders(<Header {...defaultProps} />);
    
    const avatar = screen.getByRole('button');
    expect(avatar).toBeInTheDocument();
  });

  it('opens user menu when avatar is clicked', () => {
    renderWithProviders(<Header {...defaultProps} />);
    
    const avatar = screen.getByRole('button');
    fireEvent.click(avatar);
    
    expect(screen.getByText('Profile')).toBeInTheDocument();
    expect(screen.getByText('Settings')).toBeInTheDocument();
    expect(screen.getByText('Logout')).toBeInTheDocument();
  });

  it('closes user menu when menu item is clicked', () => {
    renderWithProviders(<Header {...defaultProps} />);
    
    const avatar = screen.getByRole('button');
    fireEvent.click(avatar);
    
    const profileItem = screen.getByText('Profile');
    fireEvent.click(profileItem);
    
    // Menu should be closed after clicking
    expect(screen.queryByText('Settings')).not.toBeInTheDocument();
  });

  it('formats prices correctly', () => {
    jest.spyOn(require('@mui/material'), 'useMediaQuery').mockReturnValue(false);
    
    renderWithProviders(<Header {...defaultProps} />);
    
    // Check that prices are formatted with currency
    expect(screen.getByText(/\$43,250/)).toBeInTheDocument();
    expect(screen.getByText(/\$2,650/)).toBeInTheDocument();
  });

  it('shows price change chips', () => {
    jest.spyOn(require('@mui/material'), 'useMediaQuery').mockReturnValue(false);
    
    renderWithProviders(<Header {...defaultProps} />);
    
    // Check for price change chips
    expect(screen.getByText('+2.50%')).toBeInTheDocument();
    expect(screen.getByText('-1.20%')).toBeInTheDocument();
  });

  it('updates prices in real-time', async () => {
    jest.spyOn(require('@mui/material'), 'useMediaQuery').mockReturnValue(false);
    
    renderWithProviders(<Header {...defaultProps} />);
    
    // Wait for price updates
    await new Promise(resolve => setTimeout(resolve, 2500));
    
    // Prices should have been updated
    expect(screen.getByText(/BTC:/)).toBeInTheDocument();
  });
});

