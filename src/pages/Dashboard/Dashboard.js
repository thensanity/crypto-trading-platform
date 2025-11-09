import React from 'react';
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
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  AccountBalance,
  ShowChart,
  AttachMoney,
  Security,
} from '@mui/icons-material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// Mock data for demonstration
const portfolioData = [
  { name: 'Jan', value: 10000 },
  { name: 'Feb', value: 12000 },
  { name: 'Mar', value: 15000 },
  { name: 'Apr', value: 18000 },
  { name: 'May', value: 22000 },
  { name: 'Jun', value: 25000 },
];

const topCryptos = [
  { name: 'Bitcoin', symbol: 'BTC', price: 43250.50, change: 2.45, volume: '2.1B' },
  { name: 'Ethereum', symbol: 'ETH', price: 2650.30, change: -1.23, volume: '1.8B' },
  { name: 'Binance Coin', symbol: 'BNB', price: 315.20, change: 3.67, volume: '450M' },
  { name: 'Cardano', symbol: 'ADA', price: 0.485, change: 5.12, volume: '320M' },
  { name: 'Solana', symbol: 'SOL', price: 98.75, change: -2.34, volume: '280M' },
];

const recentTrades = [
  { pair: 'BTC/USDT', type: 'Buy', amount: '0.5 BTC', price: '$43,250', time: '2 min ago' },
  { pair: 'ETH/USDT', type: 'Sell', amount: '2.0 ETH', price: '$2,650', time: '15 min ago' },
  { pair: 'ADA/USDT', type: 'Buy', amount: '1000 ADA', price: '$0.485', time: '1 hour ago' },
];

function Dashboard() {
  const totalPortfolioValue = 25000;
  const totalPnl = 5000;
  const pnlPercentage = (totalPnl / (totalPortfolioValue - totalPnl)) * 100;

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
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={portfolioData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                    <XAxis dataKey="name" stroke="#b0b0b0" />
                    <YAxis stroke="#b0b0b0" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#1a1a1a',
                        border: '1px solid #333',
                        borderRadius: '8px',
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="value"
                      stroke="#00d4aa"
                      strokeWidth={2}
                      dot={{ fill: '#00d4aa', strokeWidth: 2, r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
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
                              ${crypto.price.toLocaleString()}
                            </Typography>
                          </Box>
                        }
                        secondary={
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                              Vol: {crypto.volume}
                            </Typography>
                            <Chip
                              icon={crypto.change > 0 ? <TrendingUp /> : <TrendingDown />}
                              label={`${crypto.change > 0 ? '+' : ''}${crypto.change}%`}
                              color={crypto.change > 0 ? 'success' : 'error'}
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

export default Dashboard;
