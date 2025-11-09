import React, { useState, useEffect } from 'react';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Tabs,
  Tab,
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Switch,
  FormControlLabel,
  Alert,
  CircularProgress,
  IconButton,
  useTheme,
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  AttachMoney,
  Speed,
  Security,
  ShowChart,
  Refresh,
  Fullscreen,
  AutoAwesome,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import PriceChart from '../../components/PriceChart/PriceChart';
import useStore from '../../store/useStore';

const timeframeOptions = [
  { value: '1h', label: '1H' },
  { value: '4h', label: '4H' },
  { value: '1d', label: '1D' },
  { value: '1w', label: '1W' },
  { value: '1M', label: '1M' },
];

const orderTypes = [
  { value: 'market', label: 'Market' },
  { value: 'limit', label: 'Limit' },
  { value: 'stop', label: 'Stop' },
  { value: 'stop_limit', label: 'Stop Limit' },
];

const TradingModern = () => {
  const theme = useTheme();
  const {
    marketData,
    chartData,
    selectedTimeframe,
    selectedCoin,
    isLoading,
    error,
    fetchMarketData,
    fetchChartData,
    placeOrder,
    setSelectedTimeframe,
    setSelectedCoin,
  } = useStore();

  const [tabValue, setTabValue] = useState(0);
  const [orderType, setOrderType] = useState('market');
  const [side, setSide] = useState('buy');
  const [amount, setAmount] = useState('');
  const [price, setPrice] = useState('');
  const [stopLoss, setStopLoss] = useState('');
  const [takeProfit, setTakeProfit] = useState('');
  const [leverage, setLeverage] = useState(1);
  const [postOnly, setPostOnly] = useState(false);
  const [orderBook, setOrderBook] = useState({ asks: [], bids: [] });
  const [recentTrades, setRecentTrades] = useState([]);
  const [orderSuccess, setOrderSuccess] = useState(false);

  // Initialize data on component mount
  useEffect(() => {
    fetchMarketData();
    fetchChartData(selectedCoin, selectedTimeframe);
    generateOrderBook();
    generateRecentTrades();
  }, []);

  // Update chart when timeframe or coin changes
  useEffect(() => {
    fetchChartData(selectedCoin, selectedTimeframe);
  }, [selectedCoin, selectedTimeframe]);

  // Generate mock order book data
  const generateOrderBook = () => {
    const currentPrice = marketData[selectedCoin]?.usd || 43250;
    const asks = [];
    const bids = [];
    
    for (let i = 0; i < 10; i++) {
      const askPrice = currentPrice + (i + 1) * (currentPrice * 0.001);
      const bidPrice = currentPrice - (i + 1) * (currentPrice * 0.001);
      const amount = Math.random() * 2 + 0.1;
      
      asks.push({
        price: askPrice,
        amount: amount,
        total: askPrice * amount,
      });
      
      bids.push({
        price: bidPrice,
        amount: amount,
        total: bidPrice * amount,
      });
    }
    
    setOrderBook({ asks: asks.reverse(), bids });
  };

  // Generate mock recent trades
  const generateRecentTrades = () => {
    const trades = [];
    const currentPrice = marketData[selectedCoin]?.usd || 43250;
    
    for (let i = 0; i < 20; i++) {
      const variation = (Math.random() - 0.5) * currentPrice * 0.01;
      const tradePrice = currentPrice + variation;
      const amount = Math.random() * 1 + 0.1;
      const type = Math.random() > 0.5 ? 'buy' : 'sell';
      
      trades.push({
        time: new Date(Date.now() - i * 60000).toLocaleTimeString(),
        price: tradePrice,
        amount: amount,
        type,
      });
    }
    
    setRecentTrades(trades);
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleOrderSubmit = async () => {
    if (!amount || (orderType !== 'market' && !price)) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      const orderData = {
        pair: `${selectedCoin.toUpperCase()}/USDT`,
        type: orderType,
        side,
        amount: parseFloat(amount),
        price: orderType !== 'market' ? parseFloat(price) : null,
        stopLoss: stopLoss ? parseFloat(stopLoss) : null,
        takeProfit: takeProfit ? parseFloat(takeProfit) : null,
        leverage,
        postOnly,
      };

      const order = await placeOrder(orderData);
      setOrderSuccess(true);
      
      // Reset form
      setAmount('');
      setPrice('');
      setStopLoss('');
      setTakeProfit('');
      
      // Hide success message after 3 seconds
      setTimeout(() => setOrderSuccess(false), 3000);
      
    } catch (error) {
      console.error('Order placement failed:', error);
      alert('Order placement failed. Please try again.');
    }
  };

  const formatPrice = (price) => {
    if (price >= 1) return `$${price.toLocaleString()}`;
    return `$${price.toFixed(4)}`;
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString();
  };

  const currentPrice = marketData[selectedCoin]?.usd || 43250;
  const priceChange = marketData[selectedCoin]?.usd_24h_change || 0;
  const chartDataKey = `${selectedCoin}_${selectedTimeframe}`;
  const currentChartData = chartData[chartDataKey] || [];

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
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
          Advanced Trading
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {orderSuccess && (
          <Alert severity="success" sx={{ mb: 3 }}>
            Order placed successfully!
          </Alert>
        )}

        <Grid container spacing={3}>
          {/* Price Chart */}
          <Grid item xs={12} lg={8}>
            <motion.div variants={itemVariants}>
              <PriceChart
                title={`${selectedCoin.toUpperCase()}/USDT`}
                data={currentChartData}
                dataKey="price"
                xAxisKey="timestamp"
                height={500}
                currentPrice={currentPrice}
                priceChange={priceChange}
                timeframe={selectedTimeframe}
                color="#4caf50"
                isLoading={isLoading}
                onRefresh={() => fetchChartData(selectedCoin, selectedTimeframe)}
                onFullscreen={() => console.log('Fullscreen')}
              />
            </motion.div>
          </Grid>

          {/* Trading Panel */}
          <Grid item xs={12} lg={4}>
            <motion.div variants={itemVariants}>
              <Card sx={{ height: '100%' }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                    Place Order
                  </Typography>
                  
                  <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
                    <Tabs value={tabValue} onChange={handleTabChange}>
                      <Tab label="Spot" />
                      <Tab label="Futures" />
                    </Tabs>
                  </Box>

                  <Grid container spacing={2} sx={{ mb: 2 }}>
                    <Grid item xs={6}>
                      <Button
                        fullWidth
                        variant={side === 'buy' ? 'contained' : 'outlined'}
                        color="success"
                        onClick={() => setSide('buy')}
                        startIcon={<TrendingUp />}
                        sx={{ py: 1.5 }}
                      >
                        Buy
                      </Button>
                    </Grid>
                    <Grid item xs={6}>
                      <Button
                        fullWidth
                        variant={side === 'sell' ? 'contained' : 'outlined'}
                        color="error"
                        onClick={() => setSide('sell')}
                        startIcon={<TrendingDown />}
                        sx={{ py: 1.5 }}
                      >
                        Sell
                      </Button>
                    </Grid>
                  </Grid>

                  <FormControl fullWidth sx={{ mb: 2 }}>
                    <InputLabel>Order Type</InputLabel>
                    <Select
                      value={orderType}
                      label="Order Type"
                      onChange={(e) => setOrderType(e.target.value)}
                    >
                      {orderTypes.map((type) => (
                        <MenuItem key={type.value} value={type.value}>
                          {type.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  <TextField
                    fullWidth
                    label="Amount"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    sx={{ mb: 2 }}
                    type="number"
                    InputProps={{
                      endAdornment: <Typography variant="body2">{selectedCoin.toUpperCase()}</Typography>,
                    }}
                  />

                  {orderType !== 'market' && (
                    <TextField
                      fullWidth
                      label="Price"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      sx={{ mb: 2 }}
                      type="number"
                      InputProps={{
                        endAdornment: <Typography variant="body2">USDT</Typography>,
                      }}
                    />
                  )}

                  {tabValue === 1 && (
                    <TextField
                      fullWidth
                      label="Leverage"
                      value={leverage}
                      onChange={(e) => setLeverage(e.target.value)}
                      sx={{ mb: 2 }}
                      type="number"
                      inputProps={{ min: 1, max: 100 }}
                    />
                  )}

                  <TextField
                    fullWidth
                    label="Stop Loss"
                    value={stopLoss}
                    onChange={(e) => setStopLoss(e.target.value)}
                    sx={{ mb: 2 }}
                    type="number"
                    InputProps={{
                      endAdornment: <Typography variant="body2">USDT</Typography>,
                    }}
                  />

                  <TextField
                    fullWidth
                    label="Take Profit"
                    value={takeProfit}
                    onChange={(e) => setTakeProfit(e.target.value)}
                    sx={{ mb: 2 }}
                    type="number"
                    InputProps={{
                      endAdornment: <Typography variant="body2">USDT</Typography>,
                    }}
                  />

                  <FormControlLabel
                    control={
                      <Switch
                        checked={postOnly}
                        onChange={(e) => setPostOnly(e.target.checked)}
                      />
                    }
                    label="Post Only"
                    sx={{ mb: 2 }}
                  />

                  <Button
                    fullWidth
                    variant="contained"
                    size="large"
                    onClick={handleOrderSubmit}
                    sx={{ 
                      py: 1.5,
                      background: side === 'buy' 
                        ? 'linear-gradient(135deg, #4caf50 0%, #45a049 100%)'
                        : 'linear-gradient(135deg, #f44336 0%, #d32f2f 100%)',
                      '&:hover': {
                        background: side === 'buy' 
                          ? 'linear-gradient(135deg, #45a049 0%, #3d8b40 100%)'
                          : 'linear-gradient(135deg, #d32f2f 0%, #c62828 100%)',
                      }
                    }}
                    startIcon={<AttachMoney />}
                    disabled={isLoading}
                  >
                    {isLoading ? 'Placing Order...' : `${side === 'buy' ? 'Buy' : 'Sell'} ${selectedCoin.toUpperCase()}`}
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>

          {/* Order Book */}
          <Grid item xs={12} md={6}>
            <motion.div variants={itemVariants}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>Order Book</Typography>
                    <IconButton onClick={generateOrderBook} size="small">
                      <Refresh />
                    </IconButton>
                  </Box>
                  <TableContainer component={Paper} sx={{ bgcolor: 'transparent' }}>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell sx={{ color: 'text.secondary' }}>Price</TableCell>
                          <TableCell sx={{ color: 'text.secondary' }}>Amount</TableCell>
                          <TableCell sx={{ color: 'text.secondary' }}>Total</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {orderBook.asks.slice().reverse().map((ask, index) => (
                          <TableRow key={index} sx={{ '&:hover': { bgcolor: 'action.hover' } }}>
                            <TableCell sx={{ color: 'error.main', fontWeight: 'bold' }}>
                              {formatPrice(ask.price)}
                            </TableCell>
                            <TableCell>{ask.amount.toFixed(4)}</TableCell>
                            <TableCell>{formatPrice(ask.total)}</TableCell>
                          </TableRow>
                        ))}
                        <TableRow>
                          <TableCell colSpan={3} sx={{ textAlign: 'center', py: 1 }}>
                            <Typography variant="h6" sx={{ color: 'primary.main', fontWeight: 'bold' }}>
                              {formatPrice(currentPrice)}
                            </Typography>
                          </TableCell>
                        </TableRow>
                        {orderBook.bids.map((bid, index) => (
                          <TableRow key={index} sx={{ '&:hover': { bgcolor: 'action.hover' } }}>
                            <TableCell sx={{ color: 'success.main', fontWeight: 'bold' }}>
                              {formatPrice(bid.price)}
                            </TableCell>
                            <TableCell>{bid.amount.toFixed(4)}</TableCell>
                            <TableCell>{formatPrice(bid.total)}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
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
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>Recent Trades</Typography>
                    <IconButton onClick={generateRecentTrades} size="small">
                      <Refresh />
                    </IconButton>
                  </Box>
                  <TableContainer component={Paper} sx={{ bgcolor: 'transparent' }}>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell sx={{ color: 'text.secondary' }}>Time</TableCell>
                          <TableCell sx={{ color: 'text.secondary' }}>Price</TableCell>
                          <TableCell sx={{ color: 'text.secondary' }}>Amount</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {recentTrades.map((trade, index) => (
                          <TableRow key={index}>
                            <TableCell sx={{ color: 'text.secondary' }}>{trade.time}</TableCell>
                            <TableCell
                              sx={{
                                color: trade.type === 'buy' ? 'success.main' : 'error.main',
                                fontWeight: 'bold',
                              }}
                            >
                              {formatPrice(trade.price)}
                            </TableCell>
                            <TableCell>{trade.amount.toFixed(4)}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
        </Grid>
      </Box>
    </motion.div>
  );
};

export default TradingModern;

