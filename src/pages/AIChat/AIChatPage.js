import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Paper,
  TextField,
  IconButton,
  Typography,
  Avatar,
  Chip,
  Button,
  Divider,
  Grid,
  Card,
  CardContent,
  CircularProgress,
  Tooltip,
  Badge,
  Menu,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Switch,
  FormControlLabel,
  Alert,
  Snackbar,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  ListItemIcon,
} from '@mui/material';
import {
  Send,
  Psychology,
  AutoAwesome,
  TrendingUp,
  TrendingDown,
  ShowChart,
  AccountBalance,
  Security,
  Lightbulb,
  Speed,
  Analytics,
  Timeline,
  People,
  EmojiEvents,
  AttachMoney,
  Star,
  ThumbUp,
  ThumbDown,
  Share,
  Bookmark,
  MoreVert,
  SmartToy,
  Chat,
  Settings,
  Clear,
  Download,
  Upload,
  Refresh,
  History,
  Favorite,
  TrendingUp as TrendingUpIcon,
  ShowChart as ShowChartIcon,
  AccountBalance as AccountBalanceIcon,
  Security as SecurityIcon,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { aiChatService } from '../../services/aiChatService';

// Animation variants
const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
};

const slideIn = {
  initial: { opacity: 0, x: -20 },
  animate: { opacity: 1, x: 0 },
  transition: { duration: 0.3 }
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

function AIChatPage() {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [activeTab, setActiveTab] = useState(0);
  const [userPreferences, setUserPreferences] = useState({
    riskTolerance: 'medium',
    tradingStyle: 'swing',
    experience: 'intermediate',
  });
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Quick suggestions by category
  const quickSuggestions = {
    trading: [
      { text: "What's the current price of BTC?", icon: <TrendingUp />, type: 'price' },
      { text: "Should I buy ETH now?", icon: <Lightbulb />, type: 'trading' },
      { text: "Get trading suggestions", icon: <AutoAwesome />, type: 'suggestions' },
      { text: "Analyze my portfolio", icon: <AccountBalance />, type: 'portfolio' },
    ],
    analysis: [
      { text: "Analyze the market trend", icon: <ShowChart />, type: 'analysis' },
      { text: "What's the market sentiment?", icon: <People />, type: 'sentiment' },
      { text: "Technical analysis for BTC", icon: <Timeline />, type: 'technical' },
      { text: "Risk assessment for my holdings", icon: <Security />, type: 'risk' },
    ],
    portfolio: [
      { text: "Optimize my portfolio", icon: <AccountBalance />, type: 'optimization' },
      { text: "Diversification advice", icon: <ShowChart />, type: 'diversification' },
      { text: "Rebalancing strategy", icon: <Timeline />, type: 'rebalancing' },
      { text: "Risk management tips", icon: <Security />, type: 'risk' },
    ],
  };

  // Chat categories
  const chatCategories = [
    { value: 'trading', label: 'Trading Assistant', icon: <TrendingUpIcon />, color: '#667eea' },
    { value: 'analysis', label: 'Market Analysis', icon: <ShowChartIcon />, color: '#f093fb' },
    { value: 'portfolio', label: 'Portfolio Advisor', icon: <AccountBalanceIcon />, color: '#4facfe' },
    { value: 'risk', label: 'Risk Assessment', icon: <SecurityIcon />, color: '#43e97b' },
  ];

  useEffect(() => {
    // Initialize with welcome message
    if (messages.length === 0) {
      setMessages([{
        id: 1,
        role: 'assistant',
        content: "🤖 Welcome to your AI Trading Assistant!\n\nI'm here to help you with:\n\n• 📊 Real-time price analysis\n• 💡 Trading suggestions\n• 📈 Market trend analysis\n• 🛡️ Risk assessment\n• 💼 Portfolio optimization\n• 📰 News sentiment analysis\n\nWhat would you like to know?",
        timestamp: Date.now(),
        suggestions: ['Check BTC price', 'Get trading advice', 'Analyze market trends'],
      }]);
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage = {
      id: Date.now(),
      role: 'user',
      content: inputMessage,
      timestamp: Date.now(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await aiChatService.chat(inputMessage);
      
      const aiMessage = {
        id: Date.now() + 1,
        role: 'assistant',
        content: response.message,
        timestamp: Date.now(),
        intent: response.intent,
        confidence: response.confidence,
        suggestions: response.suggestions,
      };

      setMessages(prev => [...prev, aiMessage]);
      setSuggestions(response.suggestions || []);
    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage = {
        id: Date.now() + 1,
        role: 'assistant',
        content: "I apologize, but I'm having trouble processing your request. Please try again.",
        timestamp: Date.now(),
        intent: 'error',
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickSuggestion = (suggestion) => {
    setInputMessage(suggestion.text);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSendMessage();
    }
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const clearChat = () => {
    setMessages([]);
    aiChatService.clearHistory();
    setSnackbar({ open: true, message: 'Chat cleared!', severity: 'info' });
  };

  const exportChat = () => {
    const chatData = {
      messages,
      timestamp: Date.now(),
      userPreferences,
    };
    
    const blob = new Blob([JSON.stringify(chatData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ai-chat-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    
    setSnackbar({ open: true, message: 'Chat exported!', severity: 'success' });
  };

  // Message component
  const MessageBubble = ({ message, index }) => (
    <motion.div
      {...fadeInUp}
      transition={{ delay: index * 0.1 }}
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: message.role === 'user' ? 'flex-end' : 'flex-start',
          mb: 3,
        }}
      >
        <Box
          sx={{
            maxWidth: '70%',
            display: 'flex',
            flexDirection: message.role === 'user' ? 'row-reverse' : 'row',
            alignItems: 'flex-start',
            gap: 2,
          }}
        >
          {message.role === 'assistant' && (
            <Avatar sx={{ bgcolor: 'primary.main', width: 40, height: 40 }}>
              <Psychology />
            </Avatar>
          )}
          
          <Paper
            sx={{
              p: 3,
              borderRadius: 3,
              background: message.role === 'user' 
                ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                : 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
              color: 'white',
              position: 'relative',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: '0 8px 25px rgba(0,0,0,0.3)',
              },
              transition: 'all 0.3s ease',
            }}
          >
            <Typography
              variant="body1"
              sx={{
                whiteSpace: 'pre-wrap',
                lineHeight: 1.6,
                '& strong': { fontWeight: 'bold' },
                '& em': { fontStyle: 'italic' },
              }}
            >
              {message.content}
            </Typography>
            
            {message.intent && message.intent !== 'error' && (
              <Chip
                label={message.intent.replace('_', ' ')}
                size="small"
                sx={{ 
                  mt: 2, 
                  bgcolor: 'rgba(255,255,255,0.2)',
                  color: 'white',
                  fontSize: '0.7rem',
                }}
              />
            )}
            
            {message.confidence && (
              <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
                <Typography variant="caption" sx={{ opacity: 0.8, mr: 1 }}>
                  Confidence: {message.confidence.toFixed(1)}%
                </Typography>
                <Box sx={{ width: 80, height: 4, bgcolor: 'rgba(255,255,255,0.3)', borderRadius: 2, overflow: 'hidden' }}>
                  <Box
                    sx={{
                      width: `${message.confidence}%`,
                      height: '100%',
                      bgcolor: 'white',
                      borderRadius: 2,
                    }}
                  />
                </Box>
              </Box>
            )}
            
            <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
              <Tooltip title="Like">
                <IconButton size="small" onClick={() => setSnackbar({ open: true, message: 'Thanks for your feedback!', severity: 'success' })}>
                  <ThumbUp sx={{ fontSize: 16, color: 'white' }} />
                </IconButton>
              </Tooltip>
              <Tooltip title="Dislike">
                <IconButton size="small" onClick={() => setSnackbar({ open: true, message: 'I\'ll improve my responses!', severity: 'info' })}>
                  <ThumbDown sx={{ fontSize: 16, color: 'white' }} />
                </IconButton>
              </Tooltip>
              <Tooltip title="Share">
                <IconButton size="small" onClick={() => setSnackbar({ open: true, message: 'Message shared!', severity: 'success' })}>
                  <Share sx={{ fontSize: 16, color: 'white' }} />
                </IconButton>
              </Tooltip>
              <Tooltip title="Bookmark">
                <IconButton size="small" onClick={() => setSnackbar({ open: true, message: 'Message bookmarked!', severity: 'success' })}>
                  <Bookmark sx={{ fontSize: 16, color: 'white' }} />
                </IconButton>
              </Tooltip>
            </Box>
          </Paper>
          
          {message.role === 'user' && (
            <Avatar sx={{ bgcolor: 'secondary.main', width: 40, height: 40 }}>
              U
            </Avatar>
          )}
        </Box>
      </Box>
    </motion.div>
  );

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
              🤖 AI Trading Assistant
            </Typography>
            <Typography variant="h6" sx={{ color: 'rgba(255,255,255,0.8)' }}>
              Get real-time trading advice, market analysis, and portfolio optimization
            </Typography>
          </Box>
        </motion.div>

        <Grid container spacing={3}>
          {/* Chat Interface */}
          <Grid item xs={12} md={8}>
            <motion.div {...fadeInUp}>
              <Paper sx={{ 
                borderRadius: 3, 
                overflow: 'hidden',
                background: 'rgba(255,255,255,0.1)',
                backdropFilter: 'blur(10px)',
              }}>
                {/* Chat Header */}
                <Box sx={{ p: 2, background: 'rgba(255,255,255,0.1)', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Avatar sx={{ bgcolor: 'primary.main' }}>
                        <Psychology />
                      </Avatar>
                      <Box>
                        <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'white' }}>
                          AI Trading Assistant
                        </Typography>
                        <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                          Powered by AI • Real-time analysis
                        </Typography>
                      </Box>
                    </Box>
                    
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Tooltip title="Clear Chat">
                        <IconButton onClick={clearChat} sx={{ color: 'white' }}>
                          <Clear />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Export Chat">
                        <IconButton onClick={exportChat} sx={{ color: 'white' }}>
                          <Download />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </Box>
                </Box>

                {/* Messages */}
                <Box
                  sx={{
                    height: 500,
                    overflowY: 'auto',
                    p: 2,
                    '&::-webkit-scrollbar': { width: 6 },
                    '&::-webkit-scrollbar-track': { background: 'rgba(255,255,255,0.1)' },
                    '&::-webkit-scrollbar-thumb': { background: 'rgba(255,255,255,0.3)', borderRadius: 3 },
                  }}
                >
                  <AnimatePresence>
                    {messages.map((message, index) => (
                      <MessageBubble key={message.id} message={message} index={index} />
                    ))}
                  </AnimatePresence>
                  
                  {isLoading && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                      <Avatar sx={{ bgcolor: 'primary.main' }}>
                        <Psychology />
                      </Avatar>
                      <Paper sx={{ p: 2, borderRadius: 3, background: 'rgba(255,255,255,0.1)' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <CircularProgress size={16} sx={{ color: 'white' }} />
                          <Typography variant="body2" sx={{ opacity: 0.8 }}>
                            AI is thinking...
                          </Typography>
                        </Box>
                      </Paper>
                    </Box>
                  )}
                  
                  <div ref={messagesEndRef} />
                </Box>

                {/* Quick Suggestions */}
                {suggestions.length > 0 && (
                  <Box sx={{ p: 2, background: 'rgba(255,255,255,0.05)', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                    <Typography variant="caption" sx={{ opacity: 0.8, mb: 1, display: 'block' }}>
                      Suggested follow-ups:
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                      {suggestions.map((suggestion, index) => (
                        <Chip
                          key={index}
                          label={suggestion}
                          size="small"
                          onClick={() => setInputMessage(suggestion)}
                          sx={{
                            bgcolor: 'rgba(255,255,255,0.2)',
                            color: 'white',
                            '&:hover': { bgcolor: 'rgba(255,255,255,0.3)' },
                          }}
                        />
                      ))}
                    </Box>
                  </Box>
                )}

                {/* Input */}
                <Box sx={{ p: 2, background: 'rgba(255,255,255,0.1)' }}>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <TextField
                      ref={inputRef}
                      fullWidth
                      placeholder="Ask me anything about crypto trading..."
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      onKeyPress={handleKeyPress}
                      disabled={isLoading}
                      multiline
                      maxRows={3}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          color: 'white',
                          '& fieldset': { borderColor: 'rgba(255,255,255,0.3)' },
                          '&:hover fieldset': { borderColor: 'white' },
                          '&.Mui-focused fieldset': { borderColor: 'white' },
                        },
                        '& .MuiInputBase-input::placeholder': { color: 'rgba(255,255,255,0.7)' },
                      }}
                    />
                    <IconButton
                      onClick={handleSendMessage}
                      disabled={!inputMessage.trim() || isLoading}
                      sx={{
                        bgcolor: 'rgba(255,255,255,0.2)',
                        color: 'white',
                        '&:hover': { bgcolor: 'rgba(255,255,255,0.3)' },
                        '&:disabled': { opacity: 0.5 },
                      }}
                    >
                      <Send />
                    </IconButton>
                  </Box>
                </Box>
              </Paper>
            </motion.div>
          </Grid>

          {/* Sidebar */}
          <Grid item xs={12} md={4}>
            <motion.div {...fadeInUp}>
              {/* Quick Actions */}
              <Paper sx={{ 
                p: 3, 
                mb: 3, 
                borderRadius: 3,
                background: 'rgba(255,255,255,0.1)',
                backdropFilter: 'blur(10px)',
              }}>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold', color: 'white' }}>
                  🚀 Quick Actions
                </Typography>
                
                <Tabs
                  value={activeTab}
                  onChange={handleTabChange}
                  sx={{
                    '& .MuiTab-root': { color: 'rgba(255,255,255,0.7)' },
                    '& .Mui-selected': { color: 'white' },
                    '& .MuiTabs-indicator': { backgroundColor: 'white' },
                  }}
                >
                  {chatCategories.map((category) => (
                    <Tab key={category.value} label={category.label} />
                  ))}
                </Tabs>
                
                <Box sx={{ mt: 2 }}>
                  {Object.entries(quickSuggestions).map(([category, suggestions]) => (
                    <Box key={category} sx={{ display: activeTab === Object.keys(quickSuggestions).indexOf(category) ? 'block' : 'none' }}>
                      {suggestions.map((suggestion, index) => (
                        <Button
                          key={index}
                          fullWidth
                          startIcon={suggestion.icon}
                          onClick={() => handleQuickSuggestion(suggestion)}
                          sx={{
                            mb: 1,
                            color: 'white',
                            borderColor: 'rgba(255,255,255,0.3)',
                            '&:hover': { borderColor: 'white' },
                          }}
                          variant="outlined"
                        >
                          {suggestion.text}
                        </Button>
                      ))}
                    </Box>
                  ))}
                </Box>
              </Paper>

              {/* User Preferences */}
              <Paper sx={{ 
                p: 3, 
                borderRadius: 3,
                background: 'rgba(255,255,255,0.1)',
                backdropFilter: 'blur(10px)',
              }}>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold', color: 'white' }}>
                  ⚙️ Preferences
                </Typography>
                
                <FormControl fullWidth size="small" sx={{ mb: 2 }}>
                  <InputLabel sx={{ color: 'white' }}>Risk Tolerance</InputLabel>
                  <Select
                    value={userPreferences.riskTolerance}
                    onChange={(e) => setUserPreferences({ ...userPreferences, riskTolerance: e.target.value })}
                    sx={{ color: 'white' }}
                  >
                    <MenuItem value="low">Low</MenuItem>
                    <MenuItem value="medium">Medium</MenuItem>
                    <MenuItem value="high">High</MenuItem>
                  </Select>
                </FormControl>
                
                <FormControl fullWidth size="small" sx={{ mb: 2 }}>
                  <InputLabel sx={{ color: 'white' }}>Trading Style</InputLabel>
                  <Select
                    value={userPreferences.tradingStyle}
                    onChange={(e) => setUserPreferences({ ...userPreferences, tradingStyle: e.target.value })}
                    sx={{ color: 'white' }}
                  >
                    <MenuItem value="day">Day Trading</MenuItem>
                    <MenuItem value="swing">Swing Trading</MenuItem>
                    <MenuItem value="long">Long Term</MenuItem>
                  </Select>
                </FormControl>
              </Paper>
            </motion.div>
          </Grid>
        </Grid>

        {/* Snackbar */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={3000}
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

export default AIChatPage;


