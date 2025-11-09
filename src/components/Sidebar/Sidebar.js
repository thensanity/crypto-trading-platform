import React, { useState } from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Box,
  Divider,
  Badge,
  useTheme,
  useMediaQuery,
  Collapse,
  IconButton,
} from '@mui/material';
import {
  Dashboard,
  TrendingUp,
  AccountBalanceWallet,
  BarChart,
  Person,
  PieChart,
  Receipt,
  Settings,
  Psychology,
  People,
  Timeline,
  Chat,
  ExpandLess,
  ExpandMore,
  AutoAwesome,
  EmojiEvents,
  Analytics,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';

const drawerWidth = 280;

const menuItems = [
  {
    text: 'Dashboard',
    icon: <Dashboard />,
    path: '/',
    category: 'main',
  },
  {
    text: 'AI Dashboard',
    icon: <Psychology />,
    path: '/ai-dashboard',
    badge: 'NEW',
    category: 'ai',
  },
  {
    text: 'AI Chat',
    icon: <Chat />,
    path: '/ai-chat',
    badge: 'AI',
    category: 'ai',
  },
  {
    text: 'Trading',
    icon: <TrendingUp />,
    path: '/trading',
    category: 'trading',
  },
  {
    text: 'Social Trading',
    icon: <People />,
    path: '/social-trading',
    badge: 'HOT',
    category: 'trading',
  },
  {
    text: 'Market',
    icon: <BarChart />,
    path: '/market',
    category: 'trading',
  },
  {
    text: 'Advanced Chart',
    icon: <Timeline />,
    path: '/advanced-chart',
    badge: 'PRO',
    category: 'trading',
  },
  {
    text: 'Portfolio',
    icon: <PieChart />,
    path: '/portfolio',
    category: 'portfolio',
  },
  {
    text: 'Orders',
    icon: <Receipt />,
    path: '/orders',
    category: 'portfolio',
  },
  {
    text: 'Wallet',
    icon: <AccountBalanceWallet />,
    path: '/wallet',
    category: 'portfolio',
  },
  {
    text: 'Profile',
    icon: <Person />,
    path: '/profile',
    category: 'account',
  },
  {
    text: 'Settings',
    icon: <Settings />,
    path: '/settings',
    category: 'account',
  },
];

const categoryLabels = {
  main: 'Main',
  ai: 'AI Features',
  trading: 'Trading',
  portfolio: 'Portfolio',
  account: 'Account',
};

const Sidebar = ({ mobileOpen, handleDrawerToggle }) => {
  const [expandedCategories, setExpandedCategories] = useState({
    main: true,
    ai: true,
    trading: true,
    portfolio: true,
    account: true,
  });

  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleCategoryToggle = (category) => {
    setExpandedCategories(prev => ({
      ...prev,
      [category]: !prev[category],
    }));
  };

  const getCategoryItems = (category) => {
    return menuItems.filter(item => item.category === category);
  };

  const drawer = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Logo Section */}
      <Box sx={{ p: 3, display: 'flex', alignItems: 'center' }}>
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
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
            CryptoTrader
          </Typography>
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            Professional Edition
          </Typography>
        </Box>
      </Box>

      <Divider />

      {/* Navigation Menu */}
      <Box sx={{ flexGrow: 1, overflow: 'auto' }}>
        {Object.keys(categoryLabels).map((category) => {
          const categoryItems = getCategoryItems(category);
          if (categoryItems.length === 0) return null;

          return (
            <Box key={category}>
              <ListItemButton
                onClick={() => handleCategoryToggle(category)}
                sx={{
                  px: 3,
                  py: 1,
                  '&:hover': {
                    backgroundColor: 'action.hover',
                  },
                }}
              >
                <ListItemText
                  primary={
                    <Typography variant="subtitle2" sx={{ fontWeight: 600, color: 'text.secondary' }}>
                      {categoryLabels[category]}
                    </Typography>
                  }
                />
                {expandedCategories[category] ? <ExpandLess /> : <ExpandMore />}
              </ListItemButton>

              <Collapse in={expandedCategories[category]} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                  {categoryItems.map((item) => (
                    <ListItem key={item.text} disablePadding>
                      <ListItemButton
                        selected={location.pathname === item.path}
                        onClick={() => {
                          navigate(item.path);
                          if (isMobile) {
                            handleDrawerToggle();
                          }
                        }}
                        sx={{
                          pl: 4,
                          pr: 2,
                          py: 1,
                          '&.Mui-selected': {
                            backgroundColor: 'primary.main',
                            '&:hover': {
                              backgroundColor: 'primary.dark',
                            },
                            '& .MuiListItemIcon-root': {
                              color: 'white',
                            },
                            '& .MuiListItemText-primary': {
                              color: 'white',
                              fontWeight: 600,
                            },
                          },
                          '&:hover': {
                            backgroundColor: 'action.hover',
                          },
                        }}
                      >
                        <ListItemIcon sx={{ minWidth: 40 }}>
                          {item.icon}
                        </ListItemIcon>
                        <ListItemText 
                          primary={item.text}
                          sx={{
                            '& .MuiListItemText-primary': {
                              fontSize: '0.875rem',
                            },
                          }}
                        />
                        {item.badge && (
                          <Badge
                            badgeContent={item.badge}
                            color={
                              item.badge === 'NEW' 
                                ? 'success' 
                                : item.badge === 'HOT' 
                                ? 'error' 
                                : 'primary'
                            }
                            sx={{ ml: 1 }}
                          />
                        )}
                      </ListItemButton>
                    </ListItem>
                  ))}
                </List>
              </Collapse>
            </Box>
          );
        })}
      </Box>

      {/* Footer */}
      <Box sx={{ p: 2, borderTop: '1px solid', borderColor: 'divider' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Box
            sx={{
              width: 32,
              height: 32,
              borderRadius: 1,
              background: 'linear-gradient(135deg, #2196f3 0%, #1976d2 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mr: 2,
            }}
          >
            <AutoAwesome sx={{ fontSize: 16, color: 'white' }} />
          </Box>
          <Box>
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              AI Assistant
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              Always available
            </Typography>
          </Box>
        </Box>
        
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <EmojiEvents sx={{ fontSize: 16, color: 'warning.main' }} />
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            Level 5 Trader
          </Typography>
        </Box>
      </Box>
    </Box>
  );

  return (
    <Box
      component="nav"
      sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
    >
      {/* Mobile drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: drawerWidth,
            backgroundColor: 'background.paper',
            borderRight: '1px solid',
            borderColor: 'divider',
          },
        }}
      >
        {drawer}
      </Drawer>

      {/* Desktop drawer */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', md: 'block' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: drawerWidth,
            backgroundColor: 'background.paper',
            borderRight: '1px solid',
            borderColor: 'divider',
          },
        }}
        open
      >
        {drawer}
      </Drawer>
    </Box>
  );
};

export default Sidebar;

