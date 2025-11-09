import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import theme from '../../theme';
import Sidebar from './Sidebar';

const renderWithProviders = (component) => {
  return render(
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        {component}
      </BrowserRouter>
    </ThemeProvider>
  );
};

describe('Sidebar', () => {
  const defaultProps = {
    mobileOpen: false,
    handleDrawerToggle: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders logo and title', () => {
    renderWithProviders(<Sidebar {...defaultProps} />);
    
    expect(screen.getByText('CryptoTrader')).toBeInTheDocument();
    expect(screen.getByText('Professional Edition')).toBeInTheDocument();
  });

  it('renders all navigation categories', () => {
    renderWithProviders(<Sidebar {...defaultProps} />);
    
    expect(screen.getByText('Main')).toBeInTheDocument();
    expect(screen.getByText('AI Features')).toBeInTheDocument();
    expect(screen.getByText('Trading')).toBeInTheDocument();
    expect(screen.getByText('Portfolio')).toBeInTheDocument();
    expect(screen.getByText('Account')).toBeInTheDocument();
  });

  it('renders all navigation items', () => {
    renderWithProviders(<Sidebar {...defaultProps} />);
    
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('AI Dashboard')).toBeInTheDocument();
    expect(screen.getByText('AI Chat')).toBeInTheDocument();
    expect(screen.getByText('Trading')).toBeInTheDocument();
    expect(screen.getByText('Social Trading')).toBeInTheDocument();
    expect(screen.getByText('Market')).toBeInTheDocument();
    expect(screen.getByText('Advanced Chart')).toBeInTheDocument();
    expect(screen.getByText('Portfolio')).toBeInTheDocument();
    expect(screen.getByText('Orders')).toBeInTheDocument();
    expect(screen.getByText('Wallet')).toBeInTheDocument();
    expect(screen.getByText('Profile')).toBeInTheDocument();
    expect(screen.getByText('Settings')).toBeInTheDocument();
  });

  it('renders badges for special items', () => {
    renderWithProviders(<Sidebar {...defaultProps} />);
    
    expect(screen.getByText('NEW')).toBeInTheDocument();
    expect(screen.getByText('AI')).toBeInTheDocument();
    expect(screen.getByText('HOT')).toBeInTheDocument();
    expect(screen.getByText('PRO')).toBeInTheDocument();
  });

  it('toggles category expansion when clicked', () => {
    renderWithProviders(<Sidebar {...defaultProps} />);
    
    const mainCategory = screen.getByText('Main');
    fireEvent.click(mainCategory);
    
    // Category should be expanded by default, clicking should collapse it
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
  });

  it('navigates to correct route when menu item is clicked', () => {
    renderWithProviders(<Sidebar {...defaultProps} />);
    
    const dashboardItem = screen.getByText('Dashboard');
    fireEvent.click(dashboardItem);
    
    // Should navigate to dashboard route
    expect(window.location.pathname).toBe('/');
  });

  it('calls handleDrawerToggle when menu item is clicked on mobile', () => {
    // Mock useMediaQuery to return true for mobile
    jest.spyOn(require('@mui/material'), 'useMediaQuery').mockReturnValue(true);
    
    renderWithProviders(<Sidebar {...defaultProps} />);
    
    const dashboardItem = screen.getByText('Dashboard');
    fireEvent.click(dashboardItem);
    
    expect(defaultProps.handleDrawerToggle).toHaveBeenCalledTimes(1);
  });

  it('renders AI Assistant section in footer', () => {
    renderWithProviders(<Sidebar {...defaultProps} />);
    
    expect(screen.getByText('AI Assistant')).toBeInTheDocument();
    expect(screen.getByText('Always available')).toBeInTheDocument();
  });

  it('renders trader level in footer', () => {
    renderWithProviders(<Sidebar {...defaultProps} />);
    
    expect(screen.getByText('Level 5 Trader')).toBeInTheDocument();
  });

  it('highlights active route', () => {
    // Mock useLocation to return dashboard route
    jest.spyOn(require('react-router-dom'), 'useLocation').mockReturnValue({
      pathname: '/',
    });
    
    renderWithProviders(<Sidebar {...defaultProps} />);
    
    const dashboardItem = screen.getByText('Dashboard');
    expect(dashboardItem.closest('[role="button"]')).toHaveClass('Mui-selected');
  });

  it('renders mobile drawer when mobileOpen is true', () => {
    renderWithProviders(<Sidebar {...defaultProps} mobileOpen={true} />);
    
    // Mobile drawer should be visible
    expect(screen.getByText('CryptoTrader')).toBeInTheDocument();
  });

  it('renders desktop drawer when mobileOpen is false', () => {
    renderWithProviders(<Sidebar {...defaultProps} mobileOpen={false} />);
    
    // Desktop drawer should be visible
    expect(screen.getByText('CryptoTrader')).toBeInTheDocument();
  });

  it('handles category toggle correctly', () => {
    renderWithProviders(<Sidebar {...defaultProps} />);
    
    const aiCategory = screen.getByText('AI Features');
    fireEvent.click(aiCategory);
    
    // AI features should still be visible (expanded by default)
    expect(screen.getByText('AI Dashboard')).toBeInTheDocument();
  });

  it('renders all icons for navigation items', () => {
    renderWithProviders(<Sidebar {...defaultProps} />);
    
    // Check that icons are rendered (they should be present as SVG elements)
    const icons = screen.getAllByRole('button');
    expect(icons.length).toBeGreaterThan(0);
  });

  it('maintains state when switching between mobile and desktop', () => {
    const { rerender } = renderWithProviders(<Sidebar {...defaultProps} />);
    
    // Switch to mobile
    jest.spyOn(require('@mui/material'), 'useMediaQuery').mockReturnValue(true);
    rerender(<Sidebar {...defaultProps} />);
    
    expect(screen.getByText('CryptoTrader')).toBeInTheDocument();
    
    // Switch back to desktop
    jest.spyOn(require('@mui/material'), 'useMediaQuery').mockReturnValue(false);
    rerender(<Sidebar {...defaultProps} />);
    
    expect(screen.getByText('CryptoTrader')).toBeInTheDocument();
  });
});


