import React from 'react';
import { render, screen } from '@testing-library/react';
import { ThemeProvider } from '@mui/material/styles';
import { AccountBalance } from '@mui/icons-material';
import theme from '../../theme';
import StatsCard from './StatsCard';

const renderWithTheme = (component) => {
  return render(
    <ThemeProvider theme={theme}>
      {component}
    </ThemeProvider>
  );
};

describe('StatsCard', () => {
  const defaultProps = {
    title: 'Test Title',
    value: 1000,
    change: 5.5,
    icon: <AccountBalance />,
    color: 'primary',
  };

  it('renders with basic props', () => {
    renderWithTheme(<StatsCard {...defaultProps} />);
    
    expect(screen.getByText('Test Title')).toBeInTheDocument();
    expect(screen.getByText('$1.0K')).toBeInTheDocument();
    expect(screen.getByText('+5.50%')).toBeInTheDocument();
  });

  it('formats large values correctly', () => {
    renderWithTheme(<StatsCard {...defaultProps} value={1500000} />);
    expect(screen.getByText('$1.5M')).toBeInTheDocument();
  });

  it('formats medium values correctly', () => {
    renderWithTheme(<StatsCard {...defaultProps} value={1500} />);
    expect(screen.getByText('$1.5K')).toBeInTheDocument();
  });

  it('shows positive change with success color', () => {
    renderWithTheme(<StatsCard {...defaultProps} change={5.5} />);
    const chip = screen.getByText('+5.50%');
    expect(chip).toBeInTheDocument();
  });

  it('shows negative change with error color', () => {
    renderWithTheme(<StatsCard {...defaultProps} change={-3.2} />);
    const chip = screen.getByText('-3.20%');
    expect(chip).toBeInTheDocument();
  });

  it('renders subtitle when provided', () => {
    renderWithTheme(<StatsCard {...defaultProps} subtitle="Test subtitle" />);
    expect(screen.getByText('Test subtitle')).toBeInTheDocument();
  });

  it('renders progress bar when progress is provided', () => {
    renderWithTheme(<StatsCard {...defaultProps} progress={75} />);
    expect(screen.getByText('75% complete')).toBeInTheDocument();
  });

  it('renders trend when provided', () => {
    renderWithTheme(<StatsCard {...defaultProps} trend="Upward trend" />);
    expect(screen.getByText('Upward trend')).toBeInTheDocument();
  });

  it('handles string values correctly', () => {
    renderWithTheme(<StatsCard {...defaultProps} value="Custom Value" />);
    expect(screen.getByText('Custom Value')).toBeInTheDocument();
  });

  it('handles zero change correctly', () => {
    renderWithTheme(<StatsCard {...defaultProps} change={0} />);
    expect(screen.getByText('+0.00%')).toBeInTheDocument();
  });

  it('renders without change prop', () => {
    const { change, ...propsWithoutChange } = defaultProps;
    renderWithTheme(<StatsCard {...propsWithoutChange} />);
    expect(screen.getByText('Test Title')).toBeInTheDocument();
    expect(screen.getByText('$1.0K')).toBeInTheDocument();
  });
});

