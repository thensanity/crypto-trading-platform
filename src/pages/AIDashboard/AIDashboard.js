import React, { useState, useEffect } from 'react';
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
  Button,
  IconButton,
  Tooltip,
  Badge,
  Paper,
  Fade,
  Zoom,
  Slide,
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  Psychology,
  AutoAwesome,
  Timeline,
  Insights,
  Speed,
  Security,
  Group,
  EmojiEvents,
  Star,
  Rocket,
  Lightbulb,
  Analytics,
  ShowChart,
  AccountBalance,
  AttachMoney,
  Timeline as TimelineIcon,
  Psychology as PsychologyIcon,
  AutoAwesome as AutoAwesomeIcon,
} from '@mui/icons-material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Area, AreaChart, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';
import { aiPredictionService } from '../../services/aiPredictionService';
import { socialTradingService } from '../../services/socialTradingService';
import { gamificationService } from '../../services/gamificationService';

// Color scheme for modern crypto trading
const colors = {
  primary: '#6366f1',
  secondary: '#8b5cf6',
  success: '#10b981',
  warning: '#f59e0b',
  error: '#ef4444',
  info: '#3b82f6',
  background: '#0f172a',
  surface: '#1e293b',
  text: '#f8fafc',
};

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

function AIDashboard() {
  const [aiPredictions, setAiPredictions] = useState([]);
  const [marketSentiment, setMarketSentiment] = useState(null);
  const [topTraders, setTopTraders] = useState([]);
  const [userStats, setUserStats] = useState(null);
  const [achievements, setAchievements] = useState([]);
  const [socialFeed, setSocialFeed] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadAIData();
  }, []);

  const loadAIData = async () => {
    setIsLoading(true);
    try {
      // Load AI predictions
      const predictions = await Promise.all([
        aiPredictionService.predictPrice('bitcoin', '1h'),
        aiPredictionService.predictPrice('ethereum', '1h'),
        aiPredictionService.predictPrice('cardano', '1h'),
      ]);
      setAiPredictions(predictions);

      // Load market sentiment
      const sentiment = await socialTradingService.getMarketSentiment();
      setMarketSentiment(sentiment);

      // Load top traders
      const traders = socialTradingService.getTopTraders(5);
      setTopTraders(traders);

      // Load user stats
      const stats = gamificationService.getUserStats('user_001');
      setUserStats(stats);

      // Load achievements
      const userAchievements = gamificationService.getUserAchievements('user_001');
      setAchievements(userAchievements);

      // Load social feed
      const feed = socialTradingService.getSocialFeed(10);
      setSocialFeed(feed);
    } catch (error) {
      console.error('Error loading AI data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // AI Prediction Card
  const AIPredictionCard = ({ prediction }) => (
    <motion.div {...fadeInUp}>
      <Card sx={{ 
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        borderRadius: 3,
        overflow: 'hidden',
        position: 'relative',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(255,255,255,0.1)',
          backdropFilter: 'blur(10px)',
        }
      }}>
        <CardContent sx={{ position: 'relative', zIndex: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Psychology sx={{ mr: 1, fontSize: 24 }} />
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
              AI Prediction
            </Typography>
            <Chip 
              label={`${(prediction.confidence * 100).toFixed(0)}% confidence`}
              size="small"
              sx={{ ml: 'auto', bgcolor: 'rgba(255,255,255,0.2)' }}
            />
          </Box>
          
          <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
            {prediction.coinId.toUpperCase()}
          </Typography>
          
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Typography variant="h5" sx={{ mr: 1 }}>
              ${prediction.currentPrice.toLocaleString()}
            </Typography>
            <Chip
              icon={prediction.direction === 'bullish' ? <TrendingUp /> : <TrendingDown />}
              label={prediction.direction}
              color={prediction.direction === 'bullish' ? 'success' : 'error'}
              size="small"
            />
          </Box>
          
          <Typography variant="body2" sx={{ opacity: 0.9 }}>
            Predicted: ${prediction.predictedPrice.toLocaleString()}
          </Typography>
          
          <LinearProgress
            variant="determinate"
            value={prediction.confidence * 100}
            sx={{ 
              mt: 2, 
              bgcolor: 'rgba(255,255,255,0.2)',
              '& .MuiLinearProgress-bar': { bgcolor: 'white' }
            }}
          />
        </CardContent>
      </Card>
    </motion.div>
  );

  // Social Trading Card
  const SocialTradingCard = ({ trader }) => (
    <motion.div {...fadeInUp}>
      <Card sx={{ 
        background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
        color: 'white',
        borderRadius: 3,
        overflow: 'hidden',
        position: 'relative',
      }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Avatar sx={{ mr: 2, bgcolor: 'rgba(255,255,255,0.2)' }}>
              {trader.avatar}
            </Avatar>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                {trader.name}
                {trader.verified && <Star sx={{ ml: 1, fontSize: 16, color: '#ffd700' }} />}
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.8 }}>
                {trader.followers.toLocaleString()} followers
              </Typography>
            </Box>
          </Box>
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
            <Box>
              <Typography variant="body2" sx={{ opacity: 0.8 }}>Total Return</Typography>
              <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#10b981' }}>
                +{trader.totalReturn.toFixed(1)}%
              </Typography>
            </Box>
            <Box>
              <Typography variant="body2" sx={{ opacity: 0.8 }}>Win Rate</Typography>
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                {trader.winRate.toFixed(1)}%
              </Typography>
            </Box>
          </Box>
          
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
            {trader.badges.slice(0, 3).map((badge, index) => (
              <Chip
                key={index}
                label={badge}
                size="small"
                sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white' }}
              />
            ))}
          </Box>
        </CardContent>
      </Card>
    </motion.div>
  );

  // Gamification Card
  const GamificationCard = ({ achievement }) => (
    <motion.div {...fadeInUp}>
      <Card sx={{ 
        background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
        color: 'white',
        borderRadius: 3,
        overflow: 'hidden',
        position: 'relative',
      }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Typography sx={{ fontSize: 32, mr: 2 }}>
              {achievement.icon}
            </Typography>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                {achievement.name}
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.8 }}>
                {achievement.description}
              </Typography>
            </Box>
          </Box>
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Chip
              label={`${achievement.points} points`}
              size="small"
              sx={{ bgcolor: 'rgba(255,255,255,0.2)' }}
            />
            <Chip
              label={achievement.rarity}
              size="small"
              color={achievement.rarity === 'legendary' ? 'warning' : 'primary'}
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
              Market Sentiment
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

  // Social Feed Item
  const SocialFeedItem = ({ item }) => (
    <motion.div {...fadeInUp}>
      <Card sx={{ mb: 2, borderRadius: 3, overflow: 'hidden' }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Avatar sx={{ mr: 2, bgcolor: 'primary.main' }}>
              {item.traderAvatar}
            </Avatar>
            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                {item.traderName}
                {item.verified && <Star sx={{ ml: 1, fontSize: 16, color: '#ffd700' }} />}
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                {new Date(item.timestamp).toLocaleString()}
              </Typography>
            </Box>
          </Box>
          
          <Typography variant="body1" sx={{ mb: 2 }}>
            {item.action === 'opened_position' ? 'Opened a new position' : 'Closed a position'} in {item.trade.pair}
          </Typography>
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button size="small" startIcon={<TrendingUp />}>
                {item.likes}
              </Button>
              <Button size="small" startIcon={<Group />}>
                {item.comments}
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

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        >
          <AutoAwesome sx={{ fontSize: 48, color: 'primary.main' }} />
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
              AI-Powered Trading Dashboard
            </Typography>
            <Typography variant="h6" sx={{ color: 'rgba(255,255,255,0.8)' }}>
              Next-generation crypto trading with AI insights, social trading, and gamification
            </Typography>
          </Box>
        </motion.div>

        <Grid container spacing={3}>
          {/* AI Predictions */}
          <Grid item xs={12} md={6} lg={4}>
            <motion.div {...fadeInUp}>
              <Typography variant="h5" sx={{ mb: 2, color: 'white', fontWeight: 'bold' }}>
                🤖 AI Predictions
              </Typography>
            </motion.div>
            {aiPredictions.map((prediction, index) => (
              <Box key={index} sx={{ mb: 2 }}>
                <AIPredictionCard prediction={prediction} />
              </Box>
            ))}
          </Grid>

          {/* Social Trading */}
          <Grid item xs={12} md={6} lg={4}>
            <motion.div {...fadeInUp}>
              <Typography variant="h5" sx={{ mb: 2, color: 'white', fontWeight: 'bold' }}>
                👥 Top Traders
              </Typography>
            </motion.div>
            {topTraders.map((trader, index) => (
              <Box key={index} sx={{ mb: 2 }}>
                <SocialTradingCard trader={trader} />
              </Box>
            ))}
          </Grid>

          {/* Gamification */}
          <Grid item xs={12} md={6} lg={4}>
            <motion.div {...fadeInUp}>
              <Typography variant="h5" sx={{ mb: 2, color: 'white', fontWeight: 'bold' }}>
                🏆 Achievements
              </Typography>
            </motion.div>
            {achievements.slice(0, 3).map((achievement, index) => (
              <Box key={index} sx={{ mb: 2 }}>
                <GamificationCard achievement={achievement} />
              </Box>
            ))}
          </Grid>

          {/* Market Sentiment */}
          <Grid item xs={12} md={6}>
            <MarketSentimentChart />
          </Grid>

          {/* User Stats */}
          <Grid item xs={12} md={6}>
            <motion.div {...fadeInUp}>
              <Card sx={{ borderRadius: 3, overflow: 'hidden' }}>
                <CardContent>
                  <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
                    📊 Your Stats
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
            </motion.div>
          </Grid>

          {/* Social Feed */}
          <Grid item xs={12}>
            <motion.div {...fadeInUp}>
              <Typography variant="h5" sx={{ mb: 2, color: 'white', fontWeight: 'bold' }}>
                📱 Social Feed
              </Typography>
            </motion.div>
            {socialFeed.slice(0, 5).map((item, index) => (
              <SocialFeedItem key={index} item={item} />
            ))}
          </Grid>
        </Grid>
      </motion.div>
    </Box>
  );
}

export default AIDashboard;




