import React, { useState, useEffect } from 'react';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Avatar,
  Button,
  Chip,
  LinearProgress,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Divider,
  Tabs,
  Tab,
  IconButton,
  Tooltip,
  Badge,
  Paper,
  InputBase,
  Fab,
  SpeedDial,
  SpeedDialAction,
  SpeedDialIcon,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  FormControlLabel,
  Slider,
  Rating,
  Alert,
  Snackbar,
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  Star,
  Group,
  CopyAll,
  Share,
  Bookmark,
  Notifications,
  FilterList,
  Search,
  Sort,
  MoreVert,
  AutoAwesome,
  Psychology,
  Speed,
  Security,
  EmojiEvents,
  Timeline,
  AccountBalance,
  AttachMoney,
  ShowChart,
  People,
  Chat,
  ThumbUp,
  ThumbDown,
  Flag,
  Report,
  Verified,
  Diamond,
  Rocket,
  Lightbulb,
  Analytics,
  Timeline as TimelineIcon,
  Psychology as PsychologyIcon,
  AutoAwesome as AutoAwesomeIcon,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Area, AreaChart, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { socialTradingService } from '../../services/socialTradingService';
import { gamificationService } from '../../services/gamificationService';
import { aiPredictionService } from '../../services/aiPredictionService';

// Animation variants
const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

function SocialTrading() {
  const [activeTab, setActiveTab] = useState(0);
  const [topTraders, setTopTraders] = useState([]);
  const [socialFeed, setSocialFeed] = useState([]);
  const [marketSentiment, setMarketSentiment] = useState(null);
  const [userStats, setUserStats] = useState(null);
  const [achievements, setAchievements] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterOptions, setFilterOptions] = useState({
    riskLevel: 'all',
    verified: false,
    minReturn: 0,
    maxReturn: 1000,
  });
  const [selectedTrader, setSelectedTrader] = useState(null);
  const [copyDialogOpen, setCopyDialogOpen] = useState(false);
  const [copyAmount, setCopyAmount] = useState(1000);
  const [copySettings, setCopySettings] = useState({
    autoCopy: false,
    riskLevel: 'medium',
    maxTrades: 10,
  });
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadSocialData();
  }, []);

  const loadSocialData = async () => {
    setIsLoading(true);
    try {
      // Load top traders
      const traders = socialTradingService.getTopTraders(20);
      setTopTraders(traders);

      // Load social feed
      const feed = socialTradingService.getSocialFeed(50);
      setSocialFeed(feed);

      // Load market sentiment
      const sentiment = socialTradingService.getMarketSentiment();
      setMarketSentiment(sentiment);

      // Load user stats
      const stats = gamificationService.getUserStats('user_001');
      setUserStats(stats);

      // Load achievements
      const userAchievements = gamificationService.getUserAchievements('user_001');
      setAchievements(userAchievements);
    } catch (error) {
      console.error('Error loading social data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleFollowTrader = async (traderId) => {
    try {
      const result = socialTradingService.followTrader(traderId, 'user_001');
      if (result.success) {
        setSnackbar({ open: true, message: 'Successfully followed trader', severity: 'success' });
        loadSocialData(); // Refresh data
      }
    } catch (error) {
      setSnackbar({ open: true, message: 'Failed to follow trader', severity: 'error' });
    }
  };

  const handleCopyTrade = async (traderId, tradeId) => {
    try {
      const result = await socialTradingService.copyTrade(traderId, tradeId, copyAmount);
      setSnackbar({ open: true, message: 'Trade copied successfully', severity: 'success' });
      setCopyDialogOpen(false);
    } catch (error) {
      setSnackbar({ open: true, message: 'Failed to copy trade', severity: 'error' });
    }
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    // Filter traders based on search query
    const filtered = topTraders.filter(trader => 
      trader.name.toLowerCase().includes(query.toLowerCase()) ||
      trader.specialties.some(specialty => specialty.toLowerCase().includes(query.toLowerCase()))
    );
    setTopTraders(filtered);
  };

  // Trader Card Component
  const TraderCard = ({ trader, index }) => (
    <motion.div
      {...fadeInUp}
      transition={{ delay: index * 0.1 }}
    >
      <Card sx={{ 
        mb: 2, 
        borderRadius: 3, 
        overflow: 'hidden',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        position: 'relative',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
        },
        transition: 'all 0.3s ease',
      }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Avatar sx={{ mr: 2, bgcolor: 'rgba(255,255,255,0.2)', width: 56, height: 56 }}>
              {trader.avatar}
            </Avatar>
            <Box sx={{ flex: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  {trader.name}
                </Typography>
                {trader.verified && <Verified sx={{ ml: 1, color: '#ffd700' }} />}
                <Chip
                  label={`#${index + 1}`}
                  size="small"
                  sx={{ ml: 'auto', bgcolor: 'rgba(255,255,255,0.2)' }}
                />
              </Box>
              <Typography variant="body2" sx={{ opacity: 0.8 }}>
                {trader.followers.toLocaleString()} followers • {trader.trades} trades
              </Typography>
            </Box>
          </Box>

          <Grid container spacing={2} sx={{ mb: 2 }}>
            <Grid item xs={6}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#10b981' }}>
                  +{trader.totalReturn.toFixed(1)}%
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.8 }}>
                  Total Return
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={6}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                  {trader.winRate.toFixed(1)}%
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.8 }}>
                  Win Rate
                </Typography>
              </Box>
            </Grid>
          </Grid>

          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 2 }}>
            {trader.badges.slice(0, 3).map((badge, badgeIndex) => (
              <Chip
                key={badgeIndex}
                label={badge}
                size="small"
                sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white' }}
              />
            ))}
          </Box>

          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              variant="contained"
              startIcon={<Group />}
              onClick={() => handleFollowTrader(trader.id)}
              sx={{ 
                bgcolor: 'rgba(255,255,255,0.2)',
                color: 'white',
                '&:hover': { bgcolor: 'rgba(255,255,255,0.3)' }
              }}
            >
              Follow
            </Button>
            <Button
              variant="outlined"
              startIcon={<CopyAll />}
              onClick={() => {
                setSelectedTrader(trader);
                setCopyDialogOpen(true);
              }}
              sx={{ 
                color: 'white',
                borderColor: 'rgba(255,255,255,0.3)',
                '&:hover': { borderColor: 'white' }
              }}
            >
              Copy
            </Button>
            <IconButton sx={{ color: 'white' }}>
              <Share />
            </IconButton>
          </Box>
        </CardContent>
      </Card>
    </motion.div>
  );

  // Social Feed Item
  const SocialFeedItem = ({ item, index }) => (
    <motion.div
      {...fadeInUp}
      transition={{ delay: index * 0.05 }}
    >
      <Card sx={{ mb: 2, borderRadius: 3, overflow: 'hidden' }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Avatar sx={{ mr: 2, bgcolor: 'primary.main' }}>
              {item.traderAvatar}
            </Avatar>
            <Box sx={{ flex: 1 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                {item.traderName}
                {item.verified && <Verified sx={{ ml: 1, fontSize: 16, color: '#ffd700' }} />}
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                {new Date(item.timestamp).toLocaleString()}
              </Typography>
            </Box>
            <IconButton>
              <MoreVert />
            </IconButton>
          </Box>

          <Typography variant="body1" sx={{ mb: 2 }}>
            {item.action === 'opened_position' ? 'Opened a new position' : 'Closed a position'} in {item.trade.pair}
          </Typography>

          <Box sx={{ 
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            p: 2,
            borderRadius: 2,
            mb: 2,
          }}>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Typography variant="body2" sx={{ opacity: 0.8 }}>Amount</Typography>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  {item.trade.amount} {item.trade.pair.split('/')[0]}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2" sx={{ opacity: 0.8 }}>Price</Typography>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  ${item.trade.price.toLocaleString()}
                </Typography>
              </Grid>
            </Grid>
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button size="small" startIcon={<ThumbUp />}>
                {item.likes}
              </Button>
              <Button size="small" startIcon={<Chat />}>
                {item.comments}
              </Button>
              <Button size="small" startIcon={<Share />}>
                Share
              </Button>
            </Box>
            <Chip
              label={item.trade.side === 'buy' ? 'Buy' : 'Sell'}
              color={item.trade.side === 'buy' ? 'success' : 'error'}
              size="small"
            />
          </Box>
        </CardContent>
      </Card>
    </motion.div>
  );

  // Market Sentiment Chart
  const MarketSentimentChart = () => {
    const data = [
      { name: 'Twitter', value: marketSentiment?.social?.twitter || 0, color: '#1da1f2' },
      { name: 'Reddit', value: marketSentiment?.social?.reddit || 0, color: '#ff4500' },
      { name: 'Discord', value: marketSentiment?.social?.discord || 0, color: '#7289da' },
      { name: 'Telegram', value: marketSentiment?.social?.telegram || 0, color: '#0088cc' },
    ];

    return (
      <motion.div {...fadeInUp}>
        <Card sx={{ borderRadius: 3, overflow: 'hidden' }}>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
              📊 Market Sentiment
            </Typography>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={80}
                  dataKey="value"
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <RechartsTooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </motion.div>
    );
  };

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        >
          <People sx={{ fontSize: 48, color: 'primary.main' }} />
        </motion.div>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', minHeight: '100vh' }}>
      <motion.div
        variants={staggerContainer}
        initial="initial"
        animate="animate"
      >
        {/* Header */}
        <motion.div {...fadeInUp}>
          <Box sx={{ mb: 4, textAlign: 'center' }}>
            <Typography variant="h3" sx={{ fontWeight: 'bold', color: 'white', mb: 2 }}>
              👥 Social Trading Hub
            </Typography>
            <Typography variant="h6" sx={{ color: 'rgba(255,255,255,0.8)' }}>
              Follow top traders, copy successful strategies, and build your network
            </Typography>
          </Box>
        </motion.div>

        {/* Search and Filters */}
        <motion.div {...fadeInUp}>
          <Paper sx={{ p: 2, mb: 3, borderRadius: 3, background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)' }}>
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', flex: 1, minWidth: 300 }}>
                <Search sx={{ mr: 1, color: 'white' }} />
                <InputBase
                  placeholder="Search traders..."
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  sx={{ 
                    color: 'white',
                    '& input::placeholder': { color: 'rgba(255,255,255,0.7)' }
                  }}
                />
              </Box>
              <Button
                variant="outlined"
                startIcon={<FilterList />}
                sx={{ color: 'white', borderColor: 'rgba(255,255,255,0.3)' }}
              >
                Filters
              </Button>
              <Button
                variant="outlined"
                startIcon={<Sort />}
                sx={{ color: 'white', borderColor: 'rgba(255,255,255,0.3)' }}
              >
                Sort
              </Button>
            </Box>
          </Paper>
        </motion.div>

        {/* Tabs */}
        <motion.div {...fadeInUp}>
          <Paper sx={{ mb: 3, borderRadius: 3, background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)' }}>
            <Tabs
              value={activeTab}
              onChange={handleTabChange}
              sx={{
                '& .MuiTab-root': { color: 'rgba(255,255,255,0.7)' },
                '& .Mui-selected': { color: 'white' },
                '& .MuiTabs-indicator': { backgroundColor: 'white' },
              }}
            >
              <Tab label="Top Traders" />
              <Tab label="Social Feed" />
              <Tab label="Market Sentiment" />
              <Tab label="My Network" />
            </Tabs>
          </Paper>
        </motion.div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          {activeTab === 0 && (
            <motion.div
              key="traders"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
            >
              <Grid container spacing={3}>
                {topTraders.map((trader, index) => (
                  <Grid item xs={12} sm={6} md={4} lg={3} key={trader.id}>
                    <TraderCard trader={trader} index={index} />
                  </Grid>
                ))}
              </Grid>
            </motion.div>
          )}

          {activeTab === 1 && (
            <motion.div
              key="feed"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
            >
              <Grid container spacing={3}>
                <Grid item xs={12} md={8}>
                  {socialFeed.map((item, index) => (
                    <SocialFeedItem key={index} item={item} index={index} />
                  ))}
                </Grid>
                <Grid item xs={12} md={4}>
                  <MarketSentimentChart />
                </Grid>
              </Grid>
            </motion.div>
          )}

          {activeTab === 2 && (
            <motion.div
              key="sentiment"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
            >
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <MarketSentimentChart />
                </Grid>
                <Grid item xs={12} md={6}>
                  <Card sx={{ borderRadius: 3, overflow: 'hidden' }}>
                    <CardContent>
                      <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
                        📈 Trending Coins
                      </Typography>
                      {marketSentiment?.trending?.map((coin, index) => (
                        <Box key={index} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                          <Typography variant="body1">{coin.coin}</Typography>
                          <Chip
                            label={coin.sentiment}
                            color={coin.sentiment === 'very_bullish' ? 'success' : coin.sentiment === 'bullish' ? 'primary' : 'default'}
                            size="small"
                          />
                        </Box>
                      ))}
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </motion.div>
          )}

          {activeTab === 3 && (
            <motion.div
              key="network"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
            >
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Card sx={{ borderRadius: 3, overflow: 'hidden' }}>
                    <CardContent>
                      <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
                        🏆 My Achievements
                      </Typography>
                      {achievements.slice(0, 5).map((achievement, index) => (
                        <Box key={index} sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                          <Typography sx={{ fontSize: 24, mr: 2 }}>
                            {achievement.icon}
                          </Typography>
                          <Box>
                            <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                              {achievement.name}
                            </Typography>
                            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                              {achievement.description}
                            </Typography>
                          </Box>
                        </Box>
                      ))}
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Card sx={{ borderRadius: 3, overflow: 'hidden' }}>
                    <CardContent>
                      <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
                        📊 My Stats
                      </Typography>
                      <Grid container spacing={2}>
                        <Grid item xs={6}>
                          <Box sx={{ textAlign: 'center' }}>
                            <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                              {userStats?.level || 1}
                            </Typography>
                            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                              Level
                            </Typography>
                          </Box>
                        </Grid>
                        <Grid item xs={6}>
                          <Box sx={{ textAlign: 'center' }}>
                            <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'success.main' }}>
                              {userStats?.points || 0}
                            </Typography>
                            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                              Points
                            </Typography>
                          </Box>
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Copy Trade Dialog */}
        <Dialog open={copyDialogOpen} onClose={() => setCopyDialogOpen(false)} maxWidth="sm" fullWidth>
          <DialogTitle>Copy Trade</DialogTitle>
          <DialogContent>
            <TextField
              label="Copy Amount (USDT)"
              type="number"
              value={copyAmount}
              onChange={(e) => setCopyAmount(parseFloat(e.target.value))}
              fullWidth
              sx={{ mb: 2 }}
            />
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Risk Level</InputLabel>
              <Select
                value={copySettings.riskLevel}
                onChange={(e) => setCopySettings({ ...copySettings, riskLevel: e.target.value })}
              >
                <MenuItem value="low">Low</MenuItem>
                <MenuItem value="medium">Medium</MenuItem>
                <MenuItem value="high">High</MenuItem>
              </Select>
            </FormControl>
            <FormControlLabel
              control={
                <Switch
                  checked={copySettings.autoCopy}
                  onChange={(e) => setCopySettings({ ...copySettings, autoCopy: e.target.checked })}
                />
              }
              label="Auto-copy future trades"
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setCopyDialogOpen(false)}>Cancel</Button>
            <Button 
              variant="contained" 
              onClick={() => handleCopyTrade(selectedTrader?.id, 'trade_001')}
            >
              Copy Trade
            </Button>
          </DialogActions>
        </Dialog>

        {/* Snackbar */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
        >
          <Alert severity={snackbar.severity} onClose={() => setSnackbar({ ...snackbar, open: false })}>
            {snackbar.message}
          </Alert>
        </Snackbar>
      </motion.div>
    </Box>
  );
}

export default SocialTrading;
