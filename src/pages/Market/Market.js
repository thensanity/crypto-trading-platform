import React, { useState } from 'react';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  TextField,
  InputAdornment,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  Tabs,
  Tab,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Avatar,
  LinearProgress,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';
import {
  Search,
  TrendingUp,
  TrendingDown,
  Star,
  StarBorder,
  FilterList,
  Refresh,
  ShowChart,
  BarChart,
  PieChart,
} from '@mui/icons-material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart, BarChart as RechartsBarChart, Bar } from 'recharts';

// Mock market data
const marketData = [
  {
    rank: 1,
    name: 'Bitcoin',
    symbol: 'BTC',
    price: 43250.50,
    change24h: 2.45,
    volume24h: 2100000000,
    marketCap: 850000000000,
    supply: 19650000,
    isFavorite: true,
  },
  {
    rank: 2,
    name: 'Ethereum',
    symbol: 'ETH',
    price: 2650.30,
    change24h: -1.23,
    volume24h: 1800000000,
    marketCap: 320000000000,
    supply: 120000000,
    isFavorite: true,
  },
  {
    rank: 3,
    name: 'Tether',
    symbol: 'USDT',
    price: 1.00,
    change24h: 0.01,
    volume24h: 4500000000,
    marketCap: 95000000000,
    supply: 95000000000,
    isFavorite: false,
  },
  {
    rank: 4,
    name: 'Binance Coin',
    symbol: 'BNB',
    price: 315.20,
    change24h: 3.67,
    volume24h: 450000000,
    marketCap: 48000000000,
    supply: 152000000,
    isFavorite: false,
  },
  {
    rank: 5,
    name: 'Cardano',
    symbol: 'ADA',
    price: 0.485,
    change24h: 5.12,
    volume24h: 320000000,
    marketCap: 17000000000,
    supply: 35000000000,
    isFavorite: true,
  },
  {
    rank: 6,
    name: 'Solana',
    symbol: 'SOL',
    price: 98.75,
    change24h: -2.34,
    volume24h: 280000000,
    marketCap: 42000000000,
    supply: 425000000,
    isFavorite: false,
  },
  {
    rank: 7,
    name: 'XRP',
    symbol: 'XRP',
    price: 0.62,
    change24h: 1.85,
    volume24h: 380000000,
    marketCap: 35000000000,
    supply: 56000000000,
    isFavorite: false,
  },
  {
    rank: 8,
    name: 'Polkadot',
    symbol: 'DOT',
    price: 7.25,
    change24h: -0.45,
    volume24h: 150000000,
    marketCap: 9000000000,
    supply: 1240000000,
    isFavorite: false,
  },
];

const chartData = [
  { time: '00:00', btc: 43000, eth: 2600, bnb: 310 },
  { time: '04:00', btc: 43200, eth: 2620, bnb: 312 },
  { time: '08:00', btc: 42800, eth: 2580, bnb: 308 },
  { time: '12:00', btc: 43500, eth: 2680, bnb: 318 },
  { time: '16:00', btc: 43100, eth: 2640, bnb: 314 },
  { time: '20:00', btc: 43300, eth: 2660, bnb: 316 },
  { time: '24:00', btc: 43250, eth: 2650, bnb: 315 },
];

const marketStats = [
  { label: 'Total Market Cap', value: '$2.1T', change: '+2.5%' },
  { label: '24h Volume', value: '$45.2B', change: '+12.3%' },
  { label: 'Bitcoin Dominance', value: '42.5%', change: '-0.8%' },
  { label: 'Active Cryptocurrencies', value: '8,945', change: '+23' },
];

function Market() {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('marketCap');
  const [filterBy, setFilterBy] = useState('all');
  const [tabValue, setTabValue] = useState(0);

  const filteredData = marketData.filter(coin =>
    coin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    coin.symbol.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatNumber = (num) => {
    if (num >= 1e12) return `$${(num / 1e12).toFixed(2)}T`;
    if (num >= 1e9) return `$${(num / 1e9).toFixed(2)}B`;
    if (num >= 1e6) return `$${(num / 1e6).toFixed(2)}M`;
    if (num >= 1e3) return `$${(num / 1e3).toFixed(2)}K`;
    return `$${num.toFixed(2)}`;
  };

  const formatPrice = (price) => {
    if (price >= 1) return `$${price.toLocaleString()}`;
    return `$${price.toFixed(4)}`;
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
        Market Overview
      </Typography>

      {/* Market Stats */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {marketStats.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card>
              <CardContent>
                <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1 }}>
                  {stat.label}
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
                  {stat.value}
                </Typography>
                <Chip
                  label={stat.change}
                  color={stat.change.startsWith('+') ? 'success' : 'error'}
                  size="small"
                />
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Charts Section */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">Price Charts</Typography>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button size="small" startIcon={<ShowChart />}>Line</Button>
                  <Button size="small" startIcon={<BarChart />}>Bar</Button>
                  <Button size="small" startIcon={<PieChart />}>Pie</Button>
                </Box>
              </Box>
              <Box sx={{ height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData}>
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
                      dataKey="btc"
                      stackId="1"
                      stroke="#f7931a"
                      fill="#f7931a"
                      fillOpacity={0.3}
                    />
                    <Area
                      type="monotone"
                      dataKey="eth"
                      stackId="1"
                      stroke="#627eea"
                      fill="#627eea"
                      fillOpacity={0.3}
                    />
                    <Area
                      type="monotone"
                      dataKey="bnb"
                      stackId="1"
                      stroke="#f3ba2f"
                      fill="#f3ba2f"
                      fillOpacity={0.3}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Top Gainers
              </Typography>
              <List>
                {marketData
                  .filter(coin => coin.change24h > 0)
                  .sort((a, b) => b.change24h - a.change24h)
                  .slice(0, 5)
                  .map((coin, index) => (
                    <ListItem key={coin.symbol} sx={{ px: 0 }}>
                      <Avatar sx={{ bgcolor: 'success.main', width: 32, height: 32, mr: 2 }}>
                        {coin.symbol.charAt(0)}
                      </Avatar>
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                              {coin.symbol}
                            </Typography>
                            <Chip
                              icon={<TrendingUp />}
                              label={`+${coin.change24h}%`}
                              color="success"
                              size="small"
                            />
                          </Box>
                        }
                        secondary={formatPrice(coin.price)}
                      />
                    </ListItem>
                  ))}
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Market Table */}
      <Card>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">Cryptocurrency Prices</Typography>
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
              <TextField
                size="small"
                placeholder="Search cryptocurrencies..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search />
                    </InputAdornment>
                  ),
                }}
              />
              <FormControl size="small" sx={{ minWidth: 120 }}>
                <InputLabel>Sort by</InputLabel>
                <Select
                  value={sortBy}
                  label="Sort by"
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <MenuItem value="marketCap">Market Cap</MenuItem>
                  <MenuItem value="price">Price</MenuItem>
                  <MenuItem value="change24h">24h Change</MenuItem>
                  <MenuItem value="volume24h">Volume</MenuItem>
                </Select>
              </FormControl>
              <IconButton>
                <Refresh />
              </IconButton>
            </Box>
          </Box>

          <TableContainer component={Paper} sx={{ bgcolor: 'transparent' }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>#</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell align="right">Price</TableCell>
                  <TableCell align="right">24h Change</TableCell>
                  <TableCell align="right">24h Volume</TableCell>
                  <TableCell align="right">Market Cap</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredData.map((coin) => (
                  <TableRow key={coin.symbol} sx={{ '&:hover': { bgcolor: 'action.hover' } }}>
                    <TableCell>
                      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        {coin.rank}
                      </Typography>
                    </TableCell>
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
                          {coin.symbol.charAt(0)}
                        </Avatar>
                        <Box>
                          <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                            {coin.name}
                          </Typography>
                          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                            {coin.symbol}
                          </Typography>
                        </Box>
                        <IconButton size="small" sx={{ ml: 1 }}>
                          {coin.isFavorite ? <Star color="warning" /> : <StarBorder />}
                        </IconButton>
                      </Box>
                    </TableCell>
                    <TableCell align="right">
                      <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                        {formatPrice(coin.price)}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Chip
                        icon={coin.change24h > 0 ? <TrendingUp /> : <TrendingDown />}
                        label={`${coin.change24h > 0 ? '+' : ''}${coin.change24h}%`}
                        color={coin.change24h > 0 ? 'success' : 'error'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell align="right">
                      <Typography variant="body2">
                        {formatNumber(coin.volume24h)}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Typography variant="body2">
                        {formatNumber(coin.marketCap)}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                        <Button size="small" variant="outlined">
                          Trade
                        </Button>
                        <Button size="small" variant="outlined">
                          Chart
                        </Button>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    </Box>
  );
}

export default Market;
