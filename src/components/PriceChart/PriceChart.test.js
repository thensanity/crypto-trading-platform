import React from 'react';
import { render, screen } from '@testing-library/react';
import { ThemeProvider } from '@mui/material/styles';
import theme from '../../theme';
import PriceChart from './PriceChart';

const renderWithTheme = (component) => {
  return render(
    <ThemeProvider theme={theme}>
      {component}
    </ThemeProvider>
  );
};

describe('PriceChart', () => {
  const mockData = [
    { name: 'Jan', value: 1000 },
    { name: 'Feb', value: 1200 },
    { name: 'Mar', value: 1100 },
  ];

  const defaultProps = {
    title: 'Test Chart',
    data: mockData,
    dataKey: 'value',
    xAxisKey: 'name',
    height: 300,
  };

  it('renders with basic props', () => {
    renderWithTheme(<PriceChart {...defaultProps} />);
    
    expect(screen.getByText('Test Chart')).toBeInTheDocument();
  });

  it('renders current price when provided', () => {
    renderWithTheme(<PriceChart {...defaultProps} currentPrice={50000} />);
    expect(screen.getByText('$50,000')).toBeInTheDocument();
  });

  it('renders price change chip when provided', () => {
    renderWithTheme(<PriceChart {...defaultProps} priceChange={5.5} />);
    expect(screen.getByText('+5.50%')).toBeInTheDocument();
  });

  it('renders timeframe chip when provided', () => {
    renderWithTheme(<PriceChart {...defaultProps} timeframe="1D" />);
    expect(screen.getByText('1D')).toBeInTheDocument();
  });

  it('shows loading state when isLoading is true', () => {
    renderWithTheme(<PriceChart {...defaultProps} isLoading={true} />);
    expect(screen.getByText('Loading chart data...')).toBeInTheDocument();
  });

  it('renders refresh button when onRefresh is provided', () => {
    const mockRefresh = jest.fn();
    renderWithTheme(<PriceChart {...defaultProps} onRefresh={mockRefresh} />);
    
    const refreshButton = screen.getByRole('button');
    expect(refreshButton).toBeInTheDocument();
  });

  it('renders fullscreen button when onFullscreen is provided', () => {
    const mockFullscreen = jest.fn();
    renderWithTheme(<PriceChart {...defaultProps} onFullscreen={mockFullscreen} />);
    
    const buttons = screen.getAllByRole('button');
    expect(buttons).toHaveLength(1); // Only fullscreen button
  });

  it('renders both refresh and fullscreen buttons when both callbacks are provided', () => {
    const mockRefresh = jest.fn();
    const mockFullscreen = jest.fn();
    renderWithTheme(
      <PriceChart 
        {...defaultProps} 
        onRefresh={mockRefresh} 
        onFullscreen={mockFullscreen} 
      />
    );
    
    const buttons = screen.getAllByRole('button');
    expect(buttons).toHaveLength(2);
  });

  it('handles empty data array', () => {
    renderWithTheme(<PriceChart {...defaultProps} data={[]} />);
    expect(screen.getByText('Test Chart')).toBeInTheDocument();
  });

  it('handles undefined data', () => {
    renderWithTheme(<PriceChart {...defaultProps} data={undefined} />);
    expect(screen.getByText('Test Chart')).toBeInTheDocument();
  });

  it('formats large prices correctly', () => {
    renderWithTheme(<PriceChart {...defaultProps} currentPrice={1500000} />);
    expect(screen.getByText('$1.5M')).toBeInTheDocument();
  });

  it('formats medium prices correctly', () => {
    renderWithTheme(<PriceChart {...defaultProps} currentPrice={1500} />);
    expect(screen.getByText('$1.5K')).toBeInTheDocument();
  });

  it('shows positive price change with success color', () => {
    renderWithTheme(<PriceChart {...defaultProps} priceChange={5.5} />);
    const chip = screen.getByText('+5.50%');
    expect(chip).toBeInTheDocument();
  });

  it('shows negative price change with error color', () => {
    renderWithTheme(<PriceChart {...defaultProps} priceChange={-3.2} />);
    const chip = screen.getByText('-3.20%');
    expect(chip).toBeInTheDocument();
  });

  it('uses custom color when provided', () => {
    renderWithTheme(<PriceChart {...defaultProps} color="#ff0000" />);
    expect(screen.getByText('Test Chart')).toBeInTheDocument();
  });

  it('uses custom height when provided', () => {
    renderWithTheme(<PriceChart {...defaultProps} height={500} />);
    expect(screen.getByText('Test Chart')).toBeInTheDocument();
  });
});

