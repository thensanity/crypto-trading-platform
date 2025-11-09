import React, { useState, useEffect } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Badge,
  Chip,
  useTheme,
  useMediaQuery,
  Divider,
} from '@mui/material';
import {
  Notifications,
  Person,
  Settings,
  Logout,
  TrendingUp,
  TrendingDown,
  AccountBalance,
  Security,
  Psychology,
  Chat,
  Menu as MenuIcon,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import useStore from '../../store/useStore';

const Header = ({ onMenuClick }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [marketStatus, setMarketStatus] = useState('open');
  const [btcPrice, setBtcPrice] = useState(43250);
  const [ethPrice, setEthPrice] = useState(2650);
  const [btcChange, setBtcChange] = useState(2.5);
  const [ethChange, setEthChange] = useState(-1.2);
  
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const { portfolio } = useStore();

  // Simulate real-time price updates
  useEffect(() => {
    const interval = setInterval(() => {
      setBtcPrice(prev => prev + (Math.random() - 0.5) * 100);
      setEthPrice(prev => prev + (Math.random() - 0.5) * 10);
      setBtcChange(prev => prev + (Math.random() - 0.5) * 0.1);
      setEthChange(prev => prev + (Math.random() - 0.5) * 0.1);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    // Implement logout logic
    handleMenuClose();
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const formatChange = (change) => {
    const sign = change >= 0 ? '+' : '';
    return `${sign}${change.toFixed(2)}%`;
  };

  return (
    <AppBar
      position="fixed"
      sx={{
        backgroundColor: 'background.paper',
        color: 'text.primary',
        boxShadow: '0 2px 20px rgba(0, 0, 0, 0.3)',
        borderBottom: '1px solid',
        borderColor: 'divider',
        zIndex: theme.zIndex.drawer + 1,
      }}
    >
      <Toolbar sx={{ minHeight: '64px !important' }}>
        {/* Mobile Menu Button */}
        <IconButton
          color="inherit"
          aria-label="open drawer"
          edge="start"
          onClick={onMenuClick}
          sx={{ mr: 2, display: { md: 'none' } }}
        >
          <MenuIcon />
        </IconButton>

        {/* Logo and Title */}
        <Box sx={{ display: 'flex', alignItems: 'center', mr: 4 }}>
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: 2,
              background: 'linear-gradient(135deg, #4caf50 0%, #45a049 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mr: 2,
            }}
          >
            <Typography variant="h6" sx={{ color: 'white', fontWeight: 'bold' }}>
              C
            </Typography>
          </Box>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 'bold',
              background: 'linear-gradient(135deg, #4caf50 0%, #45a049 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            CryptoTrader Pro
          </Typography>
        </Box>

        {/* Market Data */}
        {!isMobile && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, flexGrow: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                BTC:
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                {formatPrice(btcPrice)}
              </Typography>
              <Chip
                icon={btcChange >= 0 ? <TrendingUp /> : <TrendingDown />}
                label={formatChange(btcChange)}
                color={btcChange >= 0 ? 'success' : 'error'}
                size="small"
                sx={{ ml: 1 }}
              />
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                ETH:
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                {formatPrice(ethPrice)}
              </Typography>
              <Chip
                icon={ethChange >= 0 ? <TrendingUp /> : <TrendingDown />}
                label={formatChange(ethChange)}
                color={ethChange >= 0 ? 'success' : 'error'}
                size="small"
                sx={{ ml: 1 }}
              />
            </Box>

            <Chip
              label="Market Open"
              color="success"
              size="small"
              sx={{ ml: 2 }}
            />
          </Box>
        )}

        {/* Portfolio Value */}
        {!isMobile && portfolio && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mr: 3 }}>
            <AccountBalance sx={{ color: 'primary.main' }} />
            <Box>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                Portfolio
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                ${(portfolio.totalValue || 50000).toLocaleString()}
              </Typography>
            </Box>
          </Box>
        )}

        {/* Right Side Actions */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {/* Notifications */}
          <IconButton color="inherit" sx={{ position: 'relative' }}>
            <Badge badgeContent={3} color="error">
              <Notifications />
            </Badge>
          </IconButton>

          {/* AI Assistant */}
          <IconButton 
            color="inherit" 
            onClick={() => navigate('/ai-chat')}
            sx={{ 
              background: 'linear-gradient(135deg, #2196f3 0%, #1976d2 100%)',
              '&:hover': {
                background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
              }
            }}
          >
            <Psychology />
          </IconButton>

          {/* User Menu */}
          <IconButton onClick={handleMenuOpen} color="inherit">
            <Avatar 
              sx={{ 
                width: 36, 
                height: 36, 
                background: 'linear-gradient(135deg, #4caf50 0%, #45a049 100%)',
                fontWeight: 'bold',
              }}
            >
              U
            </Avatar>
          </IconButton>

          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            PaperProps={{
              sx: {
                backgroundColor: 'background.paper',
                border: '1px solid',
                borderColor: 'divider',
                minWidth: 200,
              },
            }}
          >
            <MenuItem onClick={() => { navigate('/profile'); handleMenuClose(); }}>
              <ListItemIcon>
                <Person fontSize="small" />
              </ListItemIcon>
              <ListItemText>Profile</ListItemText>
            </MenuItem>
            <MenuItem onClick={() => { navigate('/settings'); handleMenuClose(); }}>
              <ListItemIcon>
                <Settings fontSize="small" />
              </ListItemIcon>
              <ListItemText>Settings</ListItemText>
            </MenuItem>
            <Divider />
            <MenuItem onClick={handleLogout}>
              <ListItemIcon>
                <Logout fontSize="small" />
              </ListItemIcon>
              <ListItemText>Logout</ListItemText>
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
