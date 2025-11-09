import React, { useEffect, useState } from 'react';
import {
  Grid,
  Typography,
  Box,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Divider,
  Chip,
  IconButton,
  useTheme,
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  AccountBalance,
  ShowChart,
  Security,
  AttachMoney,
  Speed,
  Psychology,
  AutoAwesome,
  Refresh,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import StatsCard from '../../components/StatsCard/StatsCard';
import PriceChart from '../../components/PriceChart/PriceChart';
import useStore from '../../store/useStore';
import useRealTimeData from '../../hooks/useRealTimeData';

const DashboardModern = () => {
  const theme = useTheme();
  const {
    portfolio,
    fetchPortfolio,
    fetchMarketData,
    marketData,
    isLoading,
    error,
  } = useStore();

  const { marketData: realTimeData } = useRealTimeData();

  const [topCryptos, setTopCryptos] = useState([]);
  const [recentTrades, setRecentTrades] = useState([]);
  const [portfolioData, setPortfolioData] = useState([]);

  useEffect(() => {
    fetchPortfolio();
    fetchMarketData();
  }, []);

  // Process market data
  useEffect(() => {
    if (marketData) {
      const cryptos = Object.entries(marketData)
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
      
      setTopCryptos(cryptos);
    }
  }, [marketData]);

  // Generate portfolio performance data
  useEffect(() => {
    const data = [
      { name: 'Jan', value: (portfolio?.totalValue || 50000) * 0.8 },
      { name: 'Feb', value: (portfolio?.totalValue || 50000) * 0.85 },
      { name: 'Mar', value: (portfolio?.totalValue || 50000) * 0.9 },
      { name: 'Apr', value: (portfolio?.totalValue || 50000) * 0.95 },
      { name: 'May', value: (portfolio?.totalValue || 50000) * 1.0 },
      { name: 'Jun', value: portfolio?.totalValue || 50000 },
    ];
    setPortfolioData(data);
  }, [portfolio]);

  // Generate recent trades
  useEffect(() => {
    const trades = [
      { 
        pair: 'BTC/USDT', 
        type: 'Buy', 
        amount: '0.5 BTC', 
        price: `$${(marketData?.bitcoin?.usd || 43250).toLocaleString()}`, 
        time: '2 min ago',
        change: 2.5,
      },
      { 
        pair: 'ETH/USDT', 
        type: 'Sell', 
        amount: '2.0 ETH', 
        price: `$${(marketData?.ethereum?.usd || 2650).toLocaleString()}`, 
        time: '15 min ago',
        change: -1.2,
      },
      { 
        pair: 'ADA/USDT', 
        type: 'Buy', 
        amount: '1000 ADA', 
        price: `$${(marketData?.cardano?.usd || 0.485).toFixed(3)}`, 
        time: '1 hour ago',
        change: 0.8,
      },
    ];
    setRecentTrades(trades);
  }, [marketData]);

  const totalPortfolioValue = portfolio?.totalValue || 50000;
  const totalPnl = portfolio?.totalPnl || 5000;
  const pnlPercentage = totalPortfolioValue > 0 ? (totalPnl / (totalPortfolioValue - totalPnl)) * 100 : 0;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <Box>
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
            Welcome back, Trader! 👋
          </Typography>
          <Typography variant="body1" sx={{ color: 'text.secondary' }}>
            Here's what's happening with your portfolio today
          </Typography>
        </Box>

        {/* Key Metrics */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <StatsCard
              title="Total Portfolio"
              value={totalPortfolioValue}
              change={pnlPercentage}
              icon={<AccountBalance />}
              color="primary"
              subtitle={`+$${totalPnl.toLocaleString()} profit`}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatsCard
              title="24h Volume"
              value={2400000}
              change={12.5}
              icon={<ShowChart />}
              color="secondary"
              subtitle="+$300K from yesterday"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatsCard
              title="Security Score"
              value={95}
              change={5}
              icon={<Security />}
              color="success"
              progress={95}
              subtitle="Excellent security"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatsCard
              title="AI Predictions"
              value={87}
              change={3.2}
              icon={<Psychology />}
              color="info"
              subtitle="87% accuracy rate"
            />
          </Grid>
        </Grid>

        <Grid container spacing={3}>
          {/* Portfolio Performance Chart */}
          <Grid item xs={12} lg={8}>
            <motion.div variants={itemVariants}>
              <PriceChart
                title="Portfolio Performance"
                data={portfolioData}
                dataKey="value"
                xAxisKey="name"
                height={400}
                currentPrice={totalPortfolioValue}
                priceChange={pnlPercentage}
                timeframe="6M"
                color="#4caf50"
              />
            </motion.div>
          </Grid>

          {/* Quick Actions */}
          <Grid item xs={12} lg={4}>
            <motion.div variants={itemVariants}>
              <Card sx={{ height: '100%' }}>
                <CardContent>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                    Quick Actions
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 2, borderRadius: 2, bgcolor: 'action.hover' }}>
                      <Box sx={{ p: 1, borderRadius: 1, bgcolor: 'primary.main', color: 'white' }}>
                        <TrendingUp />
                      </Box>
                      <Box>
                        <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                          Start Trading
                        </Typography>
                        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                          Buy or sell cryptocurrencies
                        </Typography>
                      </Box>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 2, borderRadius: 2, bgcolor: 'action.hover' }}>
                      <Box sx={{ p: 1, borderRadius: 1, bgcolor: 'secondary.main', color: 'white' }}>
                        <Psychology />
                      </Box>
                      <Box>
                        <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                          AI Analysis
                        </Typography>
                        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                          Get AI-powered insights
                        </Typography>
                      </Box>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 2, borderRadius: 2, bgcolor: 'action.hover' }}>
                      <Box sx={{ p: 1, borderRadius: 1, bgcolor: 'success.main', color: 'white' }}>
                        <AutoAwesome />
                      </Box>
                      <Box>
                        <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                          Auto Trading
                        </Typography>
                        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                          Enable automated strategies
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>

          {/* Top Cryptocurrencies */}
          <Grid item xs={12} md={6}>
            <motion.div variants={itemVariants}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      Top Cryptocurrencies
                    </Typography>
                    <IconButton size="small">
                      <Refresh />
                    </IconButton>
                  </Box>
                  <List>
                    {topCryptos.map((crypto, index) => (
                      <React.Fragment key={crypto.symbol}>
                        <ListItem sx={{ px: 0 }}>
                          <ListItemAvatar>
                            <Avatar sx={{ bgcolor: 'primary.main', width: 40, height: 40 }}>
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
            </motion.div>
          </Grid>

          {/* Recent Trades */}
          <Grid item xs={12} md={6}>
            <motion.div variants={itemVariants}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      Recent Trades
                    </Typography>
                    <IconButton size="small">
                      <Refresh />
                    </IconButton>
                  </Box>
                  <List>
                    {recentTrades.map((trade, index) => (
                      <React.Fragment key={index}>
                        <ListItem sx={{ px: 0 }}>
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
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                  <Chip
                                    label={`${trade.change > 0 ? '+' : ''}${trade.change}%`}
                                    color={trade.change > 0 ? 'success' : 'error'}
                                    size="small"
                                  />
                                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                    {trade.time}
                                  </Typography>
                                </Box>
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
            </motion.div>
          </Grid>
        </Grid>
      </Box>
    </motion.div>
  );
};

export default DashboardModern;

