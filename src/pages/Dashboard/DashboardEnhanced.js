import React, { useEffect } from 'react';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  LinearProgress,
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Divider,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  AccountBalance,
  ShowChart,
  AttachMoney,
  Security,
} from '@mui/icons-material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import useStore from '../../store/useStore';
import useRealTimeData from '../../hooks/useRealTimeData';

function DashboardEnhanced() {
  const {
    portfolio,
    fetchPortfolio,
    fetchMarketData,
    marketData,
    isLoading,
    error,
  } = useStore();

  const { marketData: realTimeData } = useRealTimeData();

  useEffect(() => {
    fetchPortfolio();
    fetchMarketData();
  }, []);

  // Get top cryptocurrencies from market data
  const topCryptos = Object.entries(marketData || {})
    .filter(([coinId, data]) => data && data.usd)
    .map(([coinId, data]) => ({
      name: coinId.charAt(0).toUpperCase() + coinId.slice(1),
      symbol: coinId.toUpperCase(),
      price: data?.usd || 0,
      change: data?.usd_24h_change || 0,
      volume: data?.usd_24h_vol || 0,
    }))
    .sort((a, b) => (b.volume || 0) - (a.volume || 0))
    .slice(0, 5);

  // Generate portfolio performance data
  const portfolioData = [
    { name: 'Jan', value: (portfolio?.totalValue || 50000) * 0.8 },
    { name: 'Feb', value: (portfolio?.totalValue || 50000) * 0.85 },
    { name: 'Mar', value: (portfolio?.totalValue || 50000) * 0.9 },
    { name: 'Apr', value: (portfolio?.totalValue || 50000) * 0.95 },
    { name: 'May', value: (portfolio?.totalValue || 50000) * 1.0 },
    { name: 'Jun', value: portfolio?.totalValue || 50000 },
  ];

  const recentTrades = [
    { 
      pair: 'BTC/USDT', 
      type: 'Buy', 
      amount: '0.5 BTC', 
      price: `$${(marketData?.bitcoin?.usd || 43250).toLocaleString()}`, 
      time: '2 min ago' 
    },
    { 
      pair: 'ETH/USDT', 
      type: 'Sell', 
      amount: '2.0 ETH', 
      price: `$${(marketData?.ethereum?.usd || 2650).toLocaleString()}`, 
      time: '15 min ago' 
    },
    { 
      pair: 'ADA/USDT', 
      type: 'Buy', 
      amount: '1000 ADA', 
      price: `$${(marketData?.cardano?.usd || 0.485).toFixed(3)}`, 
      time: '1 hour ago' 
    },
  ];

  const totalPortfolioValue = portfolio?.totalValue || 50000;
  const totalPnl = portfolio?.totalPnl || 5000;
  const pnlPercentage = totalPortfolioValue > 0 ? (totalPnl / (totalPortfolioValue - totalPnl)) * 100 : 0;

  if (error) {
    return (
      <Box>
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
        Dashboard
      </Typography>

      <Grid container spacing={3}>
        {/* Portfolio Overview */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Portfolio Performance
              </Typography>
              <Box sx={{ height: 300, mt: 2 }}>
                {isLoading ? (
                  <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                    <CircularProgress />
                  </Box>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={portfolioData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                      <XAxis dataKey="name" stroke="#b0b0b0" />
                      <YAxis stroke="#b0b0b0" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#1a1a1a',
                          border: '1px solid #333',
                          borderRadius: '8px',
                        }}
                        formatter={(value) => [`$${value.toLocaleString()}`, 'Portfolio Value']}
                      />
                      <Area
                        type="monotone"
                        dataKey="value"
                        stroke="#00d4aa"
                        fill="url(#colorGradient)"
                        strokeWidth={2}
                      />
                      <defs>
                        <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#00d4aa" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#00d4aa" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                    </AreaChart>
                  </ResponsiveContainer>
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Key Metrics */}
        <Grid item xs={12} md={4}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <AccountBalance sx={{ mr: 1, color: 'primary.main' }} />
                    <Typography variant="h6">Total Portfolio</Typography>
                  </Box>
                  <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                    ${totalPortfolioValue.toLocaleString()}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                    <Chip
                      icon={<TrendingUp />}
                      label={`+${pnlPercentage.toFixed(2)}%`}
                      color="success"
                      size="small"
                    />
                    <Typography variant="body2" sx={{ ml: 1, color: 'text.secondary' }}>
                      +${totalPnl.toLocaleString()}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <ShowChart sx={{ mr: 1, color: 'secondary.main' }} />
                    <Typography variant="h6">24h Volume</Typography>
                  </Box>
                  <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                    $2.4M
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    +12.5% from yesterday
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Security sx={{ mr: 1, color: 'success.main' }} />
                    <Typography variant="h6">Security Score</Typography>
                  </Box>
                  <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'success.main' }}>
                    95%
                  </Typography>
                  <LinearProgress
                    variant="determinate"
                    value={95}
                    sx={{ mt: 1, bgcolor: 'rgba(0,0,0,0.1)', '& .MuiLinearProgress-bar': { bgcolor: 'success.main' } }}
                  />
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Grid>

        {/* Top Cryptocurrencies */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Top Cryptocurrencies
              </Typography>
              <List>
                {topCryptos.map((crypto, index) => (
                  <React.Fragment key={crypto.symbol}>
                    <ListItem>
                      <ListItemAvatar>
                        <Avatar sx={{ bgcolor: 'primary.main', width: 32, height: 32 }}>
                          {crypto.symbol.charAt(0)}
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                              {crypto.name}
                            </Typography>
                            <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                              ${(crypto.price || 0).toLocaleString()}
                            </Typography>
                          </Box>
                        }
                        secondary={
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                              Vol: ${((crypto.volume || 0) / 1e6).toFixed(1)}M
                            </Typography>
                            <Chip
                              icon={(crypto.change || 0) > 0 ? <TrendingUp /> : <TrendingDown />}
                              label={`${(crypto.change || 0) > 0 ? '+' : ''}${(crypto.change || 0).toFixed(2)}%`}
                              color={(crypto.change || 0) > 0 ? 'success' : 'error'}
                              size="small"
                            />
                          </Box>
                        }
                      />
                    </ListItem>
                    {index < topCryptos.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Recent Trades */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Recent Trades
              </Typography>
              <List>
                {recentTrades.map((trade, index) => (
                  <React.Fragment key={index}>
                    <ListItem>
                      <ListItemAvatar>
                        <Avatar sx={{ bgcolor: trade.type === 'Buy' ? 'success.main' : 'error.main' }}>
                          {trade.type === 'Buy' ? <TrendingUp /> : <TrendingDown />}
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                              {trade.pair}
                            </Typography>
                            <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                              {trade.amount}
                            </Typography>
                          </Box>
                        }
                        secondary={
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                              {trade.price}
                            </Typography>
                            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                              {trade.time}
                            </Typography>
                          </Box>
                        }
                      />
                    </ListItem>
                    {index < recentTrades.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}

export default DashboardEnhanced;
