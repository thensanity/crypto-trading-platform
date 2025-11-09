import React, { useState } from 'react';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Avatar,
  LinearProgress,
  Tabs,
  Tab,
  Button,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  PieChart,
  BarChart,
  ShowChart,
  Refresh,
  Download,
  Visibility,
  VisibilityOff,
} from '@mui/icons-material';
import { PieChart as RechartsPieChart, Cell, ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Area, AreaChart } from 'recharts';

// Mock portfolio data
const portfolioData = [
  {
    asset: 'Bitcoin',
    symbol: 'BTC',
    amount: 0.5,
    price: 43250.50,
    value: 21625.25,
    change24h: 2.45,
    changeValue: 1081.25,
    allocation: 43.2,
    avgCost: 40000,
    pnl: 1625.25,
    pnlPercent: 8.13,
  },
  {
    asset: 'Ethereum',
    symbol: 'ETH',
    amount: 10.0,
    price: 2650.30,
    value: 26503.00,
    change24h: -1.23,
    changeValue: -325.00,
    allocation: 52.9,
    avgCost: 2800,
    pnl: -1500.00,
    pnlPercent: -5.36,
  },
  {
    asset: 'Cardano',
    symbol: 'ADA',
    amount: 10000.0,
    price: 0.485,
    value: 4850.00,
    change24h: 5.12,
    changeValue: 248.00,
    allocation: 9.7,
    avgCost: 0.45,
    pnl: 350.00,
    pnlPercent: 7.78,
  },
  {
    asset: 'Solana',
    symbol: 'SOL',
    amount: 50.0,
    price: 98.75,
    value: 4937.50,
    change24h: -2.34,
    changeValue: -115.50,
    allocation: 9.9,
    avgCost: 95.00,
    pnl: 187.50,
    pnlPercent: 3.95,
  },
];

const performanceData = [
  { date: '2024-01-01', value: 45000, benchmark: 42000 },
  { date: '2024-01-02', value: 46000, benchmark: 43000 },
  { date: '2024-01-03', value: 44000, benchmark: 41000 },
  { date: '2024-01-04', value: 47000, benchmark: 44000 },
  { date: '2024-01-05', value: 48000, benchmark: 45000 },
  { date: '2024-01-06', value: 49000, benchmark: 46000 },
  { date: '2024-01-07', value: 50000, benchmark: 47000 },
];

const pieData = portfolioData.map(asset => ({
  name: asset.symbol,
  value: asset.value,
  color: asset.symbol === 'BTC' ? '#f7931a' : asset.symbol === 'ETH' ? '#627eea' : asset.symbol === 'ADA' ? '#0033ad' : '#9945ff',
}));

const COLORS = ['#f7931a', '#627eea', '#0033ad', '#9945ff'];

function Portfolio() {
  const [tabValue, setTabValue] = useState(0);
  const [showValues, setShowValues] = useState(true);

  const totalValue = portfolioData.reduce((sum, asset) => sum + asset.value, 0);
  const totalPnl = portfolioData.reduce((sum, asset) => sum + asset.pnl, 0);
  const totalPnlPercent = (totalPnl / (totalValue - totalPnl)) * 100;

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(value);
  };

  const formatPercent = (value) => {
    return `${value > 0 ? '+' : ''}${value.toFixed(2)}%`;
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
        Portfolio
      </Typography>

      {/* Portfolio Overview */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1 }}>
                Total Portfolio Value
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'primary.main', mb: 1 }}>
                {showValues ? formatCurrency(totalValue) : '••••••'}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Chip
                  icon={totalPnl > 0 ? <TrendingUp /> : <TrendingDown />}
                  label={formatPercent(totalPnlPercent)}
                  color={totalPnl > 0 ? 'success' : 'error'}
                  size="small"
                />
                <Typography variant="body2" sx={{ ml: 1, color: 'text.secondary' }}>
                  {showValues ? formatCurrency(totalPnl) : '••••'}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1 }}>
                24h Change
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'success.main', mb: 1 }}>
                +2.45%
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                {showValues ? '+$1,225.50' : '••••'}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1 }}>
                Best Performer
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
                ADA
              </Typography>
              <Chip
                icon={<TrendingUp />}
                label="+5.12%"
                color="success"
                size="small"
              />
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1 }}>
                Worst Performer
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
                ETH
              </Typography>
              <Chip
                icon={<TrendingDown />}
                label="-1.23%"
                color="error"
                size="small"
              />
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={tabValue} onChange={handleTabChange}>
          <Tab label="Holdings" />
          <Tab label="Performance" />
          <Tab label="Allocation" />
        </Tabs>
      </Box>

      {/* Holdings Tab */}
      {tabValue === 0 && (
        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">Portfolio Holdings</Typography>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <IconButton onClick={() => setShowValues(!showValues)}>
                  {showValues ? <VisibilityOff /> : <Visibility />}
                </IconButton>
                <IconButton>
                  <Refresh />
                </IconButton>
                <IconButton>
                  <Download />
                </IconButton>
              </Box>
            </Box>

            <TableContainer component={Paper} sx={{ bgcolor: 'transparent' }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Asset</TableCell>
                    <TableCell align="right">Amount</TableCell>
                    <TableCell align="right">Price</TableCell>
                    <TableCell align="right">Value</TableCell>
                    <TableCell align="right">24h Change</TableCell>
                    <TableCell align="right">P&L</TableCell>
                    <TableCell align="right">Allocation</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {portfolioData.map((asset) => (
                    <TableRow key={asset.symbol} sx={{ '&:hover': { bgcolor: 'action.hover' } }}>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Avatar
                            sx={{
                              width: 32,
                              height: 32,
                              bgcolor: 'primary.main',
                              mr: 2,
                              fontSize: '0.875rem',
                            }}
                          >
                            {asset.symbol.charAt(0)}
                          </Avatar>
                          <Box>
                            <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                              {asset.asset}
                            </Typography>
                            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                              {asset.symbol}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell align="right">
                        <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                          {showValues ? asset.amount.toLocaleString() : '••••'}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                          {showValues ? formatCurrency(asset.price) : '••••'}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                          {showValues ? formatCurrency(asset.value) : '••••'}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Chip
                          icon={asset.change24h > 0 ? <TrendingUp /> : <TrendingDown />}
                          label={formatPercent(asset.change24h)}
                          color={asset.change24h > 0 ? 'success' : 'error'}
                          size="small"
                        />
                      </TableCell>
                      <TableCell align="right">
                        <Box>
                          <Typography
                            variant="body2"
                            sx={{
                              fontWeight: 'bold',
                              color: asset.pnl > 0 ? 'success.main' : 'error.main',
                            }}
                          >
                            {showValues ? formatCurrency(asset.pnl) : '••••'}
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{
                              color: asset.pnl > 0 ? 'success.main' : 'error.main',
                            }}
                          >
                            {formatPercent(asset.pnlPercent)}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell align="right">
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <LinearProgress
                            variant="determinate"
                            value={asset.allocation}
                            sx={{ width: 60, mr: 1, bgcolor: 'rgba(0,0,0,0.1)' }}
                          />
                          <Typography variant="body2">
                            {asset.allocation}%
                          </Typography>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      )}

      {/* Performance Tab */}
      {tabValue === 1 && (
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Portfolio Performance
                </Typography>
                <Box sx={{ height: 400 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={performanceData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                      <XAxis dataKey="date" stroke="#b0b0b0" />
                      <YAxis stroke="#b0b0b0" />
                      <RechartsTooltip
                        contentStyle={{
                          backgroundColor: '#1a1a1a',
                          border: '1px solid #333',
                          borderRadius: '8px',
                        }}
                      />
                      <Area
                        type="monotone"
                        dataKey="value"
                        stroke="#00d4aa"
                        fill="url(#colorGradient)"
                        strokeWidth={2}
                      />
                      <Area
                        type="monotone"
                        dataKey="benchmark"
                        stroke="#ff6b6b"
                        fill="url(#benchmarkGradient)"
                        strokeWidth={2}
                        strokeDasharray="5 5"
                      />
                      <defs>
                        <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#00d4aa" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#00d4aa" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="benchmarkGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#ff6b6b" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#ff6b6b" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                    </AreaChart>
                  </ResponsiveContainer>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {/* Allocation Tab */}
      {tabValue === 2 && (
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Asset Allocation
                </Typography>
                <Box sx={{ height: 300 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsPieChart>
                      <RechartsTooltip
                        contentStyle={{
                          backgroundColor: '#1a1a1a',
                          border: '1px solid #333',
                          borderRadius: '8px',
                        }}
                      />
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Allocation Details
                </Typography>
                <Box sx={{ mt: 2 }}>
                  {portfolioData.map((asset, index) => (
                    <Box key={asset.symbol} sx={{ mb: 2 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Box
                            sx={{
                              width: 12,
                              height: 12,
                              borderRadius: '50%',
                              bgcolor: COLORS[index % COLORS.length],
                              mr: 1,
                            }}
                          />
                          <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                            {asset.symbol}
                          </Typography>
                        </Box>
                        <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                          {asset.allocation}%
                        </Typography>
                      </Box>
                      <LinearProgress
                        variant="determinate"
                        value={asset.allocation}
                        sx={{
                          bgcolor: 'rgba(0,0,0,0.1)',
                          '& .MuiLinearProgress-bar': {
                            bgcolor: COLORS[index % COLORS.length],
                          },
                        }}
                      />
                    </Box>
                  ))}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}
    </Box>
  );
}

export default Portfolio;
