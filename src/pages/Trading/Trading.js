import React, { useState } from 'react';
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
  Divider,
  Slider,
  Switch,
  FormControlLabel,
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  AttachMoney,
  Speed,
  Security,
  ShowChart,
} from '@mui/icons-material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';

// Mock data
const priceData = [
  { time: '09:00', price: 43200 },
  { time: '09:30', price: 43350 },
  { time: '10:00', price: 43100 },
  { time: '10:30', price: 43400 },
  { time: '11:00', price: 43250 },
  { time: '11:30', price: 43500 },
  { time: '12:00', price: 43300 },
];

const orderBookData = {
  asks: [
    { price: 43280, amount: 0.5, total: 21640 },
    { price: 43270, amount: 1.2, total: 51924 },
    { price: 43260, amount: 0.8, total: 34608 },
    { price: 43250, amount: 2.1, total: 90825 },
  ],
  bids: [
    { price: 43240, amount: 1.5, total: 64860 },
    { price: 43230, amount: 0.9, total: 38907 },
    { price: 43220, amount: 1.8, total: 77796 },
    { price: 43210, amount: 2.3, total: 99383 },
  ],
};

const recentTrades = [
  { time: '12:34:56', price: 43250, amount: 0.5, type: 'buy' },
  { time: '12:34:52', price: 43245, amount: 1.2, type: 'sell' },
  { time: '12:34:48', price: 43260, amount: 0.8, type: 'buy' },
  { time: '12:34:44', price: 43240, amount: 2.1, type: 'sell' },
  { time: '12:34:40', price: 43255, amount: 1.5, type: 'buy' },
];

function Trading() {
  const [tabValue, setTabValue] = useState(0);
  const [orderType, setOrderType] = useState('market');
  const [side, setSide] = useState('buy');
  const [amount, setAmount] = useState('');
  const [price, setPrice] = useState('');
  const [stopLoss, setStopLoss] = useState('');
  const [takeProfit, setTakeProfit] = useState('');
  const [leverage, setLeverage] = useState(1);
  const [postOnly, setPostOnly] = useState(false);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleOrderSubmit = () => {
    // Implement order submission logic
    console.log('Order submitted:', {
      type: orderType,
      side,
      amount,
      price,
      stopLoss,
      takeProfit,
      leverage,
      postOnly,
    });
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
        Trading
      </Typography>

      <Grid container spacing={3}>
        {/* Price Chart */}
        <Grid item xs={12} lg={8}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">BTC/USDT</Typography>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Chip label="1m" size="small" />
                  <Chip label="5m" size="small" />
                  <Chip label="1h" size="small" />
                  <Chip label="1d" size="small" color="primary" />
                </Box>
              </Box>
              <Box sx={{ height: 400 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={priceData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                    <XAxis dataKey="time" stroke="#b0b0b0" />
                    <YAxis stroke="#b0b0b0" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#1a1a1a',
                        border: '1px solid #333',
                        borderRadius: '8px',
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="price"
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
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Trading Panel */}
        <Grid item xs={12} lg={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Place Order
              </Typography>
              
              <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
                <Tabs value={tabValue} onChange={handleTabChange}>
                  <Tab label="Spot" />
                  <Tab label="Futures" />
                </Tabs>
              </Box>

              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Button
                    fullWidth
                    variant={side === 'buy' ? 'contained' : 'outlined'}
                    color="success"
                    onClick={() => setSide('buy')}
                    startIcon={<TrendingUp />}
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
                  >
                    Sell
                  </Button>
                </Grid>
              </Grid>

              <FormControl fullWidth sx={{ mt: 2 }}>
                <InputLabel>Order Type</InputLabel>
                <Select
                  value={orderType}
                  label="Order Type"
                  onChange={(e) => setOrderType(e.target.value)}
                >
                  <MenuItem value="market">Market</MenuItem>
                  <MenuItem value="limit">Limit</MenuItem>
                  <MenuItem value="stop">Stop</MenuItem>
                  <MenuItem value="stop_limit">Stop Limit</MenuItem>
                </Select>
              </FormControl>

              <TextField
                fullWidth
                label="Amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                sx={{ mt: 2 }}
                InputProps={{
                  endAdornment: <Typography variant="body2">BTC</Typography>,
                }}
              />

              {orderType !== 'market' && (
                <TextField
                  fullWidth
                  label="Price"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  sx={{ mt: 2 }}
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
                  sx={{ mt: 2 }}
                  type="number"
                  inputProps={{ min: 1, max: 100 }}
                />
              )}

              <TextField
                fullWidth
                label="Stop Loss"
                value={stopLoss}
                onChange={(e) => setStopLoss(e.target.value)}
                sx={{ mt: 2 }}
                InputProps={{
                  endAdornment: <Typography variant="body2">USDT</Typography>,
                }}
              />

              <TextField
                fullWidth
                label="Take Profit"
                value={takeProfit}
                onChange={(e) => setTakeProfit(e.target.value)}
                sx={{ mt: 2 }}
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
                sx={{ mt: 2 }}
              />

              <Button
                fullWidth
                variant="contained"
                size="large"
                onClick={handleOrderSubmit}
                sx={{ mt: 3 }}
                startIcon={<AttachMoney />}
              >
                {side === 'buy' ? 'Buy BTC' : 'Sell BTC'}
              </Button>
            </CardContent>
          </Card>
        </Grid>

        {/* Order Book */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Order Book
              </Typography>
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
                    {orderBookData.asks.slice().reverse().map((ask, index) => (
                      <TableRow key={index} sx={{ '&:hover': { bgcolor: 'action.hover' } }}>
                        <TableCell sx={{ color: 'error.main', fontWeight: 'bold' }}>
                          {ask.price.toLocaleString()}
                        </TableCell>
                        <TableCell>{ask.amount}</TableCell>
                        <TableCell>{ask.total.toLocaleString()}</TableCell>
                      </TableRow>
                    ))}
                    <TableRow>
                      <TableCell colSpan={3} sx={{ textAlign: 'center', py: 1 }}>
                        <Typography variant="h6" sx={{ color: 'primary.main', fontWeight: 'bold' }}>
                          43,250.00
                        </Typography>
                      </TableCell>
                    </TableRow>
                    {orderBookData.bids.map((bid, index) => (
                      <TableRow key={index} sx={{ '&:hover': { bgcolor: 'action.hover' } }}>
                        <TableCell sx={{ color: 'success.main', fontWeight: 'bold' }}>
                          {bid.price.toLocaleString()}
                        </TableCell>
                        <TableCell>{bid.amount}</TableCell>
                        <TableCell>{bid.total.toLocaleString()}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
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
                          {trade.price.toLocaleString()}
                        </TableCell>
                        <TableCell>{trade.amount}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}

export default Trading;
