import React, { useState, useEffect } from 'react';
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
  CircularProgress,
  Alert,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
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
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Area, 
  AreaChart,
  BarChart as RechartsBarChart,
  Bar,
  PieChart as RechartsPieChart,
  Cell,
} from 'recharts';
import useStore from '../../store/useStore';
import { cryptoApi } from '../../services/cryptoApi';

const timeframeOptions = [
  { value: '1h', label: '1H' },
  { value: '1d', label: '1D' },
  { value: '1M', label: '1M' },
  { value: '1Y', label: '1Y' },
  { value: 'all', label: 'All' },
];

function MarketEnhanced() {
  const {
    marketData,
    chartData,
    selectedTimeframe,
    selectedCoin,
    isLoading,
    error,
    fetchMarketData,
    fetchChartData,
    setSelectedTimeframe,
    setSelectedCoin,
  } = useStore();

  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('marketCap');
  const [filterBy, setFilterBy] = useState('all');
  const [tabValue, setTabValue] = useState(0);
  const [globalStats, setGlobalStats] = useState(null);
  const [trendingCoins, setTrendingCoins] = useState([]);
  const [favorites, setFavorites] = useState(new Set(['bitcoin', 'ethereum', 'cardano']));

  // Initialize data on component mount
  useEffect(() => {
    fetchMarketData();
    fetchGlobalStats();
    fetchTrendingCoins();
  }, []);

  // Update chart when timeframe or coin changes
  useEffect(() => {
    if (selectedCoin) {
      fetchChartData(selectedCoin, selectedTimeframe);
    }
  }, [selectedCoin, selectedTimeframe]);

  const fetchGlobalStats = async () => {
    try {
      const stats = await cryptoApi.getGlobalStats();
      setGlobalStats(stats);
    } catch (error) {
      console.error('Error fetching global stats:', error);
    }
  };

  const fetchTrendingCoins = async () => {
    try {
      const trending = await cryptoApi.getTrending();
      setTrendingCoins(trending);
    } catch (error) {
      console.error('Error fetching trending coins:', error);
    }
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleCoinSelect = (coinId) => {
    setSelectedCoin(coinId);
  };

  const handleTimeframeChange = (timeframe) => {
    setSelectedTimeframe(timeframe);
  };

  const toggleFavorite = (coinId) => {
    const newFavorites = new Set(favorites);
    if (newFavorites.has(coinId)) {
      newFavorites.delete(coinId);
    } else {
      newFavorites.add(coinId);
    }
    setFavorites(newFavorites);
  };

  const formatNumber = (num) => {
    if (!num || isNaN(num)) return '$0.00';
    if (num >= 1e12) return `$${(num / 1e12).toFixed(2)}T`;
    if (num >= 1e9) return `$${(num / 1e9).toFixed(2)}B`;
    if (num >= 1e6) return `$${(num / 1e6).toFixed(2)}M`;
    if (num >= 1e3) return `$${(num / 1e3).toFixed(2)}K`;
    return `$${num.toFixed(2)}`;
  };

  const formatPrice = (price) => {
    if (!price || isNaN(price)) return '$0.00';
    if (price >= 1) return `$${price.toLocaleString()}`;
    return `$${price.toFixed(4)}`;
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString();
  };

  // Filter and sort market data
  const filteredData = Object.entries(marketData)
    .filter(([coinId, data]) => 
      data && (coinId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      data.name?.toLowerCase().includes(searchTerm.toLowerCase()))
    )
    .map(([coinId, data]) => ({
      id: coinId,
      name: data?.name || coinId.charAt(0).toUpperCase() + coinId.slice(1),
      symbol: coinId.toUpperCase(),
      price: data?.usd || 0,
      change24h: data?.usd_24h_change || 0,
      volume: data?.usd_24h_vol || 0,
      marketCap: data?.usd_market_cap || 0,
      isFavorite: favorites.has(coinId),
    }))
    .sort((a, b) => {
      switch (sortBy) {
        case 'price':
          return (b.price || 0) - (a.price || 0);
        case 'change24h':
          return (b.change24h || 0) - (a.change24h || 0);
        case 'volume':
          return (b.volume || 0) - (a.volume || 0);
        case 'marketCap':
        default:
          return (b.marketCap || 0) - (a.marketCap || 0);
      }
    });

  const currentChartData = chartData[`${selectedCoin}_${selectedTimeframe}`] || [];

  return (
    <Box>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
        Market Overview
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Market Stats */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1 }}>
                Total Market Cap
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
                {globalStats ? formatNumber(globalStats.total_market_cap?.usd || 0) : 'Loading...'}
              </Typography>
              <Chip label="+2.5%" color="success" size="small" />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1 }}>
                24h Volume
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
                {globalStats ? formatNumber(globalStats.total_volume?.usd || 0) : 'Loading...'}
              </Typography>
              <Chip label="+12.3%" color="success" size="small" />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1 }}>
                Bitcoin Dominance
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
                {globalStats ? `${(globalStats.market_cap_percentage?.btc || 0).toFixed(1)}%` : 'Loading...'}
              </Typography>
              <Chip label="-0.8%" color="error" size="small" />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1 }}>
                Active Cryptocurrencies
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
                {globalStats ? (globalStats.active_cryptocurrencies || 0).toLocaleString() : 'Loading...'}
              </Typography>
              <Chip label="+23" color="success" size="small" />
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Charts Section */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">
                  {selectedCoin ? `${selectedCoin.toUpperCase()}/USDT` : 'Select a cryptocurrency'}
                </Typography>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  {timeframeOptions.map((option) => (
                    <Button
                      key={option.value}
                      size="small"
                      variant={selectedTimeframe === option.value ? 'contained' : 'outlined'}
                      onClick={() => handleTimeframeChange(option.value)}
                    >
                      {option.label}
                    </Button>
                  ))}
                </Box>
              </Box>
              
              <Box sx={{ height: 300 }}>
                {isLoading ? (
                  <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                    <CircularProgress />
                  </Box>
                ) : currentChartData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={currentChartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                      <XAxis 
                        dataKey="timestamp" 
                        stroke="#b0b0b0"
                        tickFormatter={(value) => formatTime(value)}
                      />
                      <YAxis stroke="#b0b0b0" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#1a1a1a',
                          border: '1px solid #333',
                          borderRadius: '8px',
                        }}
                        formatter={(value) => [formatPrice(value), 'Price']}
                        labelFormatter={(value) => formatTime(value)}
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
                ) : (
                  <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                    <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                      Select a cryptocurrency to view chart
                    </Typography>
                  </Box>
                )}
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
                {filteredData
                  .filter(coin => (coin.change24h || 0) > 0)
                  .sort((a, b) => (b.change24h || 0) - (a.change24h || 0))
                  .slice(0, 5)
                  .map((coin, index) => (
                    <ListItem key={coin.id} sx={{ px: 0 }}>
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
                              label={`+${(coin.change24h || 0).toFixed(2)}%`}
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
                  <MenuItem value="volume">Volume</MenuItem>
                </Select>
              </FormControl>
              <IconButton onClick={fetchMarketData}>
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
                {filteredData.map((coin, index) => (
                  <TableRow 
                    key={coin.id} 
                    sx={{ 
                      '&:hover': { bgcolor: 'action.hover' },
                      cursor: 'pointer',
                      bgcolor: selectedCoin === coin.id ? 'action.selected' : 'transparent',
                    }}
                    onClick={() => handleCoinSelect(coin.id)}
                  >
                    <TableCell>
                      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        {index + 1}
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
                        <IconButton 
                          size="small" 
                          sx={{ ml: 1 }}
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleFavorite(coin.id);
                          }}
                        >
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
                        icon={(coin.change24h || 0) > 0 ? <TrendingUp /> : <TrendingDown />}
                        label={`${(coin.change24h || 0) > 0 ? '+' : ''}${(coin.change24h || 0).toFixed(2)}%`}
                        color={(coin.change24h || 0) > 0 ? 'success' : 'error'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell align="right">
                      <Typography variant="body2">
                        {formatNumber(coin.volume)}
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

export default MarketEnhanced;
