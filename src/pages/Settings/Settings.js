import React, { useState } from 'react';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Switch,
  FormControlLabel,
  TextField,
  Button,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  Security,
  Notifications,
  Language,
  Palette,
  Api,
  Shield,
  Key,
  QrCode,
  Download,
  Delete,
  Add,
  Edit,
  Visibility,
  VisibilityOff,
} from '@mui/icons-material';

// Mock settings data
const securitySettings = {
  twoFactorEnabled: true,
  emailVerification: true,
  smsVerification: false,
  loginAlerts: true,
  withdrawalConfirmation: true,
  apiAccess: false,
  whitelistAddresses: true,
};

const notificationSettings = {
  email: {
    trading: true,
    security: true,
    marketing: false,
    news: true,
  },
  push: {
    trading: true,
    security: true,
    price: false,
    news: false,
  },
  sms: {
    security: true,
    trading: false,
  },
};

const apiKeys = [
  {
    id: 1,
    name: 'Trading Bot',
    key: 'sk-1234567890abcdef',
    permissions: ['read', 'trade'],
    created: '2024-01-10',
    lastUsed: '2024-01-15',
    status: 'active',
  },
  {
    id: 2,
    name: 'Portfolio Tracker',
    key: 'sk-abcdef1234567890',
    permissions: ['read'],
    created: '2024-01-05',
    lastUsed: '2024-01-14',
    status: 'active',
  },
];

function Settings() {
  const [settings, setSettings] = useState(securitySettings);
  const [notifications, setNotifications] = useState(notificationSettings);
  const [apiKeysList, setApiKeysList] = useState(apiKeys);
  const [showApiKey, setShowApiKey] = useState({});
  const [apiKeyDialog, setApiKeyDialog] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [selectedApiKey, setSelectedApiKey] = useState(null);

  const handleSecurityChange = (setting) => {
    setSettings({ ...settings, [setting]: !settings[setting] });
  };

  const handleNotificationChange = (type, category) => {
    setNotifications({
      ...notifications,
      [type]: {
        ...notifications[type],
        [category]: !notifications[type][category],
      },
    });
  };

  const handleCreateApiKey = () => {
    setApiKeyDialog(true);
  };

  const handleDeleteApiKey = (apiKey) => {
    setSelectedApiKey(apiKey);
    setDeleteDialog(true);
  };

  const toggleApiKeyVisibility = (id) => {
    setShowApiKey({ ...showApiKey, [id]: !showApiKey[id] });
  };

  const maskApiKey = (key) => {
    return key.substring(0, 8) + '••••••••' + key.substring(key.length - 4);
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
        Settings
      </Typography>

      <Grid container spacing={3}>
        {/* Security Settings */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Security sx={{ mr: 1, color: 'primary.main' }} />
                <Typography variant="h6">Security Settings</Typography>
              </Box>

              <List>
                <ListItem>
                  <ListItemText
                    primary="Two-Factor Authentication"
                    secondary="Add an extra layer of security to your account"
                  />
                  <Switch
                    checked={settings.twoFactorEnabled}
                    onChange={() => handleSecurityChange('twoFactorEnabled')}
                  />
                </ListItem>
                <Divider />
                <ListItem>
                  <ListItemText
                    primary="Email Verification"
                    secondary="Require email verification for sensitive actions"
                  />
                  <Switch
                    checked={settings.emailVerification}
                    onChange={() => handleSecurityChange('emailVerification')}
                  />
                </ListItem>
                <Divider />
                <ListItem>
                  <ListItemText
                    primary="SMS Verification"
                    secondary="Require SMS verification for withdrawals"
                  />
                  <Switch
                    checked={settings.smsVerification}
                    onChange={() => handleSecurityChange('smsVerification')}
                  />
                </ListItem>
                <Divider />
                <ListItem>
                  <ListItemText
                    primary="Login Alerts"
                    secondary="Get notified when someone logs into your account"
                  />
                  <Switch
                    checked={settings.loginAlerts}
                    onChange={() => handleSecurityChange('loginAlerts')}
                  />
                </ListItem>
                <Divider />
                <ListItem>
                  <ListItemText
                    primary="Withdrawal Confirmation"
                    secondary="Require confirmation for all withdrawals"
                  />
                  <Switch
                    checked={settings.withdrawalConfirmation}
                    onChange={() => handleSecurityChange('withdrawalConfirmation')}
                  />
                </ListItem>
                <Divider />
                <ListItem>
                  <ListItemText
                    primary="API Access"
                    secondary="Allow third-party applications to access your account"
                  />
                  <Switch
                    checked={settings.apiAccess}
                    onChange={() => handleSecurityChange('apiAccess')}
                  />
                </ListItem>
                <Divider />
                <ListItem>
                  <ListItemText
                    primary="Address Whitelist"
                    secondary="Only allow withdrawals to whitelisted addresses"
                  />
                  <Switch
                    checked={settings.whitelistAddresses}
                    onChange={() => handleSecurityChange('whitelistAddresses')}
                  />
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Notification Settings */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Notifications sx={{ mr: 1, color: 'primary.main' }} />
                <Typography variant="h6">Notification Settings</Typography>
              </Box>

              <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 2 }}>
                Email Notifications
              </Typography>
              <List>
                <ListItem>
                  <ListItemText primary="Trading Alerts" />
                  <Switch
                    checked={notifications.email.trading}
                    onChange={() => handleNotificationChange('email', 'trading')}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText primary="Security Alerts" />
                  <Switch
                    checked={notifications.email.security}
                    onChange={() => handleNotificationChange('email', 'security')}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText primary="Marketing Emails" />
                  <Switch
                    checked={notifications.email.marketing}
                    onChange={() => handleNotificationChange('email', 'marketing')}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText primary="News & Updates" />
                  <Switch
                    checked={notifications.email.news}
                    onChange={() => handleNotificationChange('email', 'news')}
                  />
                </ListItem>
              </List>

              <Divider sx={{ my: 2 }} />

              <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 2 }}>
                Push Notifications
              </Typography>
              <List>
                <ListItem>
                  <ListItemText primary="Trading Alerts" />
                  <Switch
                    checked={notifications.push.trading}
                    onChange={() => handleNotificationChange('push', 'trading')}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText primary="Security Alerts" />
                  <Switch
                    checked={notifications.push.security}
                    onChange={() => handleNotificationChange('push', 'security')}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText primary="Price Alerts" />
                  <Switch
                    checked={notifications.push.price}
                    onChange={() => handleNotificationChange('push', 'price')}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText primary="News & Updates" />
                  <Switch
                    checked={notifications.push.news}
                    onChange={() => handleNotificationChange('push', 'news')}
                  />
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* API Keys Management */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Api sx={{ mr: 1, color: 'primary.main' }} />
                  <Typography variant="h6">API Keys</Typography>
                </Box>
                <Button
                  variant="contained"
                  startIcon={<Add />}
                  onClick={handleCreateApiKey}
                >
                  Create API Key
                </Button>
              </Box>

              <Alert severity="info" sx={{ mb: 3 }}>
                API keys allow third-party applications to access your account. Keep them secure and never share them.
              </Alert>

              <List>
                {apiKeysList.map((apiKey) => (
                  <ListItem key={apiKey.id} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 1, mb: 2 }}>
                    <ListItemIcon>
                      <Key />
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                            {apiKey.name}
                          </Typography>
                          <Chip
                            label={apiKey.status}
                            color={apiKey.status === 'active' ? 'success' : 'error'}
                            size="small"
                          />
                        </Box>
                      }
                      secondary={
                        <Box>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                            <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                              {showApiKey[apiKey.id] ? apiKey.key : maskApiKey(apiKey.key)}
                            </Typography>
                            <IconButton
                              size="small"
                              onClick={() => toggleApiKeyVisibility(apiKey.id)}
                            >
                              {showApiKey[apiKey.id] ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                          </Box>
                          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                            Permissions: {apiKey.permissions.join(', ')} • Created: {apiKey.created} • Last used: {apiKey.lastUsed}
                          </Typography>
                        </Box>
                      }
                    />
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Tooltip title="Download">
                        <IconButton size="small">
                          <Download />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Edit">
                        <IconButton size="small">
                          <Edit />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => handleDeleteApiKey(apiKey)}
                        >
                          <Delete />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Preferences */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Palette sx={{ mr: 1, color: 'primary.main' }} />
                <Typography variant="h6">Preferences</Typography>
              </Box>

              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel>Language</InputLabel>
                    <Select defaultValue="en" label="Language">
                      <MenuItem value="en">English</MenuItem>
                      <MenuItem value="es">Spanish</MenuItem>
                      <MenuItem value="fr">French</MenuItem>
                      <MenuItem value="de">German</MenuItem>
                      <MenuItem value="zh">Chinese</MenuItem>
                      <MenuItem value="ja">Japanese</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel>Currency</InputLabel>
                    <Select defaultValue="USD" label="Currency">
                      <MenuItem value="USD">USD</MenuItem>
                      <MenuItem value="EUR">EUR</MenuItem>
                      <MenuItem value="GBP">GBP</MenuItem>
                      <MenuItem value="JPY">JPY</MenuItem>
                      <MenuItem value="CAD">CAD</MenuItem>
                      <MenuItem value="AUD">AUD</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel>Timezone</InputLabel>
                    <Select defaultValue="UTC-5" label="Timezone">
                      <MenuItem value="UTC-12">UTC-12</MenuItem>
                      <MenuItem value="UTC-8">UTC-8 (PST)</MenuItem>
                      <MenuItem value="UTC-5">UTC-5 (EST)</MenuItem>
                      <MenuItem value="UTC+0">UTC+0 (GMT)</MenuItem>
                      <MenuItem value="UTC+1">UTC+1 (CET)</MenuItem>
                      <MenuItem value="UTC+8">UTC+8 (CST)</MenuItem>
                      <MenuItem value="UTC+9">UTC+9 (JST)</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <FormControlLabel
                    control={<Switch defaultChecked />}
                    label="Dark Mode"
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormControlLabel
                    control={<Switch />}
                    label="Auto-refresh Data"
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Advanced Settings */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Shield sx={{ mr: 1, color: 'primary.main' }} />
                <Typography variant="h6">Advanced Settings</Typography>
              </Box>

              <List>
                <ListItem>
                  <ListItemText
                    primary="Session Timeout"
                    secondary="Automatically log out after inactivity"
                  />
                  <TextField
                    size="small"
                    defaultValue="30"
                    type="number"
                    sx={{ width: 80 }}
                    InputProps={{ endAdornment: 'minutes' }}
                  />
                </ListItem>
                <Divider />
                <ListItem>
                  <ListItemText
                    primary="Trading Limits"
                    secondary="Set daily trading limits for security"
                  />
                  <Button size="small" variant="outlined">
                    Configure
                  </Button>
                </ListItem>
                <Divider />
                <ListItem>
                  <ListItemText
                    primary="Data Export"
                    secondary="Download your account data"
                  />
                  <Button size="small" variant="outlined" startIcon={<Download />}>
                    Export
                  </Button>
                </ListItem>
                <Divider />
                <ListItem>
                  <ListItemText
                    primary="Account Deletion"
                    secondary="Permanently delete your account"
                  />
                  <Button size="small" variant="outlined" color="error">
                    Delete Account
                  </Button>
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Create API Key Dialog */}
      <Dialog open={apiKeyDialog} onClose={() => setApiKeyDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Create API Key</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Key Name"
                placeholder="Enter a name for this API key"
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Permissions</InputLabel>
                <Select multiple label="Permissions">
                  <MenuItem value="read">Read</MenuItem>
                  <MenuItem value="trade">Trade</MenuItem>
                  <MenuItem value="withdraw">Withdraw</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="IP Whitelist"
                placeholder="Enter IP addresses (optional)"
                helperText="Leave empty to allow from any IP"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setApiKeyDialog(false)}>Cancel</Button>
          <Button variant="contained">Create API Key</Button>
        </DialogActions>
      </Dialog>

      {/* Delete API Key Dialog */}
      <Dialog open={deleteDialog} onClose={() => setDeleteDialog(false)}>
        <DialogTitle>Delete API Key</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete the API key "{selectedApiKey?.name}"? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialog(false)}>Cancel</Button>
          <Button variant="contained" color="error" onClick={() => setDeleteDialog(false)}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default Settings;
