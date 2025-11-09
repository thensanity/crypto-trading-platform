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
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  CircularProgress,
  Fade,
  Slide,
  Tooltip,
  Badge,
  Menu,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Switch,
  FormControlLabel,
  Card,
  CardContent,
  Grid,
  Alert,
  Snackbar,
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
  Close,
  Minimize,
  Maximize,
  Settings,
  Clear,
  Download,
  Upload,
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

function AIChat({ isOpen, onClose, onMinimize }) {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [chatMode, setChatMode] = useState('trading');
  const [userPreferences, setUserPreferences] = useState({
    riskTolerance: 'medium',
    tradingStyle: 'swing',
    experience: 'intermediate',
  });
  const [showSettings, setShowSettings] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Quick suggestions
  const quickSuggestions = [
    { text: "What's the current price of BTC?", icon: <TrendingUp />, type: 'price' },
    { text: "Should I buy ETH now?", icon: <Lightbulb />, type: 'trading' },
    { text: "Analyze the market trend", icon: <ShowChart />, type: 'analysis' },
    { text: "Check my portfolio risk", icon: <Security />, type: 'risk' },
    { text: "Get trading suggestions", icon: <AutoAwesome />, type: 'suggestions' },
    { text: "What's the market sentiment?", icon: <People />, type: 'sentiment' },
  ];

  // Chat modes
  const chatModes = [
    { value: 'trading', label: 'Trading Assistant', icon: <TrendingUp /> },
    { value: 'analysis', label: 'Market Analysis', icon: <ShowChart /> },
    { value: 'portfolio', label: 'Portfolio Advisor', icon: <AccountBalance /> },
    { value: 'risk', label: 'Risk Assessment', icon: <Security /> },
  ];

  useEffect(() => {
    if (isOpen) {
      // Initialize with welcome message
      if (messages.length === 0) {
        setMessages([{
          id: 1,
          role: 'assistant',
          content: "🤖 Hello! I'm your AI trading assistant. I can help you with:\n\n• 📊 Real-time price analysis\n• 💡 Trading suggestions\n• 📈 Market trend analysis\n• 🛡️ Risk assessment\n• 💼 Portfolio optimization\n• 📰 News sentiment analysis\n\nWhat would you like to know?",
          timestamp: Date.now(),
          suggestions: ['Check BTC price', 'Get trading advice', 'Analyze market trends'],
        }]);
      }
    }
  }, [isOpen]);

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

  const handleLike = (messageId) => {
    setSnackbar({ open: true, message: 'Thanks for your feedback!', severity: 'success' });
  };

  const handleDislike = (messageId) => {
    setSnackbar({ open: true, message: 'I\'ll improve my responses!', severity: 'info' });
  };

  const handleShare = (messageId) => {
    setSnackbar({ open: true, message: 'Message shared!', severity: 'success' });
  };

  const handleBookmark = (messageId) => {
    setSnackbar({ open: true, message: 'Message bookmarked!', severity: 'success' });
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
          mb: 2,
        }}
      >
        <Box
          sx={{
            maxWidth: '80%',
            display: 'flex',
            flexDirection: message.role === 'user' ? 'row-reverse' : 'row',
            alignItems: 'flex-start',
            gap: 1,
          }}
        >
          {message.role === 'assistant' && (
            <Avatar sx={{ bgcolor: 'primary.main', width: 32, height: 32 }}>
              <Psychology />
            </Avatar>
          )}
          
          <Paper
            sx={{
              p: 2,
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
                  mt: 1, 
                  bgcolor: 'rgba(255,255,255,0.2)',
                  color: 'white',
                  fontSize: '0.7rem',
                }}
              />
            )}
            
            {message.confidence && (
              <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                <Typography variant="caption" sx={{ opacity: 0.8, mr: 1 }}>
                  Confidence: {message.confidence.toFixed(1)}%
                </Typography>
                <Box sx={{ width: 60, height: 4, bgcolor: 'rgba(255,255,255,0.3)', borderRadius: 2, overflow: 'hidden' }}>
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
            
            <Box sx={{ display: 'flex', gap: 0.5, mt: 1 }}>
              <Tooltip title="Like">
                <IconButton size="small" onClick={() => handleLike(message.id)}>
                  <ThumbUp sx={{ fontSize: 16, color: 'white' }} />
                </IconButton>
              </Tooltip>
              <Tooltip title="Dislike">
                <IconButton size="small" onClick={() => handleDislike(message.id)}>
                  <ThumbDown sx={{ fontSize: 16, color: 'white' }} />
                </IconButton>
              </Tooltip>
              <Tooltip title="Share">
                <IconButton size="small" onClick={() => handleShare(message.id)}>
                  <Share sx={{ fontSize: 16, color: 'white' }} />
                </IconButton>
              </Tooltip>
              <Tooltip title="Bookmark">
                <IconButton size="small" onClick={() => handleBookmark(message.id)}>
                  <Bookmark sx={{ fontSize: 16, color: 'white' }} />
                </IconButton>
              </Tooltip>
            </Box>
          </Paper>
          
          {message.role === 'user' && (
            <Avatar sx={{ bgcolor: 'secondary.main', width: 32, height: 32 }}>
              U
            </Avatar>
          )}
        </Box>
      </Box>
    </motion.div>
  );

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.3 }}
    >
      <Paper
        sx={{
          position: 'fixed',
          bottom: 20,
          right: 20,
          width: 400,
          height: 600,
          borderRadius: 3,
          overflow: 'hidden',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
          zIndex: 1000,
        }}
      >
        {/* Header */}
        <Box
          sx={{
            p: 2,
            background: 'rgba(255,255,255,0.1)',
            backdropFilter: 'blur(10px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Avatar sx={{ bgcolor: 'primary.main', width: 32, height: 32 }}>
              <Psychology />
            </Avatar>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                AI Trading Assistant
              </Typography>
              <Typography variant="caption" sx={{ opacity: 0.8 }}>
                Powered by AI • Real-time analysis
              </Typography>
            </Box>
          </Box>
          
          <Box sx={{ display: 'flex', gap: 0.5 }}>
            <Tooltip title="Settings">
              <IconButton size="small" onClick={() => setShowSettings(!showSettings)}>
                <Settings sx={{ color: 'white' }} />
              </IconButton>
            </Tooltip>
            <Tooltip title="Minimize">
              <IconButton size="small" onClick={onMinimize}>
                <Minimize sx={{ color: 'white' }} />
              </IconButton>
            </Tooltip>
            <Tooltip title="Close">
              <IconButton size="small" onClick={onClose}>
                <Close sx={{ color: 'white' }} />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>

        {/* Chat Mode Selector */}
        <Box sx={{ p: 1, background: 'rgba(255,255,255,0.05)' }}>
          <FormControl size="small" fullWidth>
            <Select
              value={chatMode}
              onChange={(e) => setChatMode(e.target.value)}
              sx={{ 
                color: 'white',
                '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.3)' },
                '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'white' },
              }}
            >
              {chatModes.map((mode) => (
                <MenuItem key={mode.value} value={mode.value}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {mode.icon}
                    {mode.label}
                  </Box>
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        {/* Messages */}
        <Box
          sx={{
            height: 400,
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
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <Avatar sx={{ bgcolor: 'primary.main', width: 32, height: 32 }}>
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
          <Box sx={{ p: 1, background: 'rgba(255,255,255,0.05)' }}>
            <Typography variant="caption" sx={{ opacity: 0.8, mb: 1, display: 'block' }}>
              Suggested follow-ups:
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
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

        {/* Quick Actions */}
        <Box sx={{ p: 1, background: 'rgba(255,255,255,0.05)' }}>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 1 }}>
            {quickSuggestions.map((suggestion, index) => (
              <Chip
                key={index}
                label={suggestion.text}
                icon={suggestion.icon}
                size="small"
                onClick={() => handleQuickSuggestion(suggestion)}
                sx={{
                  bgcolor: 'rgba(255,255,255,0.1)',
                  color: 'white',
                  '&:hover': { bgcolor: 'rgba(255,255,255,0.2)' },
                }}
              />
            ))}
          </Box>
        </Box>

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

        {/* Settings Panel */}
        {showSettings && (
          <Box sx={{ p: 2, background: 'rgba(0,0,0,0.2)' }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
              Settings
            </Typography>
            
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <FormControl fullWidth size="small">
                  <InputLabel>Risk Tolerance</InputLabel>
                  <Select
                    value={userPreferences.riskTolerance}
                    onChange={(e) => setUserPreferences({ ...userPreferences, riskTolerance: e.target.value })}
                  >
                    <MenuItem value="low">Low</MenuItem>
                    <MenuItem value="medium">Medium</MenuItem>
                    <MenuItem value="high">High</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12}>
                <FormControl fullWidth size="small">
                  <InputLabel>Trading Style</InputLabel>
                  <Select
                    value={userPreferences.tradingStyle}
                    onChange={(e) => setUserPreferences({ ...userPreferences, tradingStyle: e.target.value })}
                  >
                    <MenuItem value="day">Day Trading</MenuItem>
                    <MenuItem value="swing">Swing Trading</MenuItem>
                    <MenuItem value="long">Long Term</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
            
            <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
              <Button
                variant="outlined"
                size="small"
                onClick={clearChat}
                startIcon={<Clear />}
                sx={{ color: 'white', borderColor: 'rgba(255,255,255,0.3)' }}
              >
                Clear Chat
              </Button>
              <Button
                variant="outlined"
                size="small"
                onClick={exportChat}
                startIcon={<Download />}
                sx={{ color: 'white', borderColor: 'rgba(255,255,255,0.3)' }}
              >
                Export
              </Button>
            </Box>
          </Box>
        )}

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
      </Paper>
    </motion.div>
  );
}

export default AIChat;




