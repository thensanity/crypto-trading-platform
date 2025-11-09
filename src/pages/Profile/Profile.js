import React, { useState } from 'react';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Avatar,
  Button,
  TextField,
  Switch,
  FormControlLabel,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  LinearProgress,
} from '@mui/material';
import {
  Person,
  Email,
  Phone,
  LocationOn,
  Security,
  Notifications,
  Language,
  Currency,
  DarkMode,
  Edit,
  Save,
  Cancel,
  Verified,
  Warning,
  CheckCircle,
} from '@mui/icons-material';

// Mock user data
const userProfile = {
  name: 'John Doe',
  email: 'john.doe@example.com',
  phone: '+1 (555) 123-4567',
  location: 'New York, USA',
  avatar: null,
  verified: true,
  kycStatus: 'completed',
  twoFactorEnabled: true,
  notifications: {
    email: true,
    sms: false,
    push: true,
    trading: true,
    security: true,
  },
  preferences: {
    language: 'en',
    currency: 'USD',
    timezone: 'UTC-5',
    darkMode: true,
  },
};

const kycSteps = [
  { step: 'Identity Verification', status: 'completed', description: 'Upload government ID' },
  { step: 'Address Verification', status: 'completed', description: 'Upload utility bill' },
  { step: 'Bank Account Verification', status: 'pending', description: 'Link bank account' },
  { step: 'Enhanced Due Diligence', status: 'not_started', description: 'Additional verification' },
];

const securityEvents = [
  { action: 'Password Changed', time: '2 hours ago', ip: '192.168.1.1', status: 'success' },
  { action: 'Login from New Device', time: '1 day ago', ip: '10.0.0.1', status: 'warning' },
  { action: 'Two-Factor Enabled', time: '3 days ago', ip: '192.168.1.1', status: 'success' },
  { action: 'API Key Generated', time: '1 week ago', ip: '192.168.1.1', status: 'info' },
];

function Profile() {
  const [editMode, setEditMode] = useState(false);
  const [profile, setProfile] = useState(userProfile);
  const [kycDialog, setKycDialog] = useState(false);
  const [securityDialog, setSecurityDialog] = useState(false);

  const handleSave = () => {
    setEditMode(false);
    // Implement save logic
  };

  const handleCancel = () => {
    setProfile(userProfile);
    setEditMode(false);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'success';
      case 'pending':
        return 'warning';
      case 'not_started':
        return 'default';
      default:
        return 'default';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircle />;
      case 'pending':
        return <Warning />;
      case 'not_started':
        return <Warning />;
      default:
        return <Warning />;
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
        Profile
      </Typography>

      <Grid container spacing={3}>
        {/* Profile Overview */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
                <Avatar
                  sx={{
                    width: 100,
                    height: 100,
                    bgcolor: 'primary.main',
                    fontSize: '2rem',
                    mb: 2,
                  }}
                >
                  {profile.name.charAt(0)}
                </Avatar>
                <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 1 }}>
                  {profile.name}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Chip
                    icon={<Verified />}
                    label={profile.kycStatus === 'completed' ? 'Verified' : 'Unverified'}
                    color={profile.kycStatus === 'completed' ? 'success' : 'warning'}
                    size="small"
                  />
                </Box>
                <Button
                  variant="outlined"
                  startIcon={<Edit />}
                  onClick={() => setEditMode(true)}
                  disabled={editMode}
                >
                  Edit Profile
                </Button>
              </Box>

              <Divider sx={{ my: 2 }} />

              <Typography variant="h6" gutterBottom>
                Account Security
              </Typography>
              <Box sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                  <Typography variant="body2">Two-Factor Authentication</Typography>
                  <Chip
                    label={profile.twoFactorEnabled ? 'Enabled' : 'Disabled'}
                    color={profile.twoFactorEnabled ? 'success' : 'error'}
                    size="small"
                  />
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={profile.twoFactorEnabled ? 100 : 0}
                  sx={{ mb: 2 }}
                />
              </Box>

              <Button
                fullWidth
                variant="outlined"
                startIcon={<Security />}
                onClick={() => setSecurityDialog(true)}
              >
                Security Settings
              </Button>
            </CardContent>
          </Card>
        </Grid>

        {/* Profile Details */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6">Personal Information</Typography>
                {editMode && (
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button
                      size="small"
                      variant="contained"
                      startIcon={<Save />}
                      onClick={handleSave}
                    >
                      Save
                    </Button>
                    <Button
                      size="small"
                      variant="outlined"
                      startIcon={<Cancel />}
                      onClick={handleCancel}
                    >
                      Cancel
                    </Button>
                  </Box>
                )}
              </Box>

              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Full Name"
                    value={profile.name}
                    onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                    disabled={!editMode}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Email"
                    value={profile.email}
                    onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                    disabled={!editMode}
                    type="email"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Phone"
                    value={profile.phone}
                    onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                    disabled={!editMode}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Location"
                    value={profile.location}
                    onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                    disabled={!editMode}
                  />
                </Grid>
              </Grid>

              <Divider sx={{ my: 3 }} />

              <Typography variant="h6" gutterBottom>
                Notification Preferences
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={profile.notifications.email}
                        onChange={(e) =>
                          setProfile({
                            ...profile,
                            notifications: { ...profile.notifications, email: e.target.checked },
                          })
                        }
                        disabled={!editMode}
                      />
                    }
                    label="Email Notifications"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={profile.notifications.sms}
                        onChange={(e) =>
                          setProfile({
                            ...profile,
                            notifications: { ...profile.notifications, sms: e.target.checked },
                          })
                        }
                        disabled={!editMode}
                      />
                    }
                    label="SMS Notifications"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={profile.notifications.push}
                        onChange={(e) =>
                          setProfile({
                            ...profile,
                            notifications: { ...profile.notifications, push: e.target.checked },
                          })
                        }
                        disabled={!editMode}
                      />
                    }
                    label="Push Notifications"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={profile.notifications.trading}
                        onChange={(e) =>
                          setProfile({
                            ...profile,
                            notifications: { ...profile.notifications, trading: e.target.checked },
                          })
                        }
                        disabled={!editMode}
                      />
                    }
                    label="Trading Alerts"
                  />
                </Grid>
              </Grid>

              <Divider sx={{ my: 3 }} />

              <Typography variant="h6" gutterBottom>
                Preferences
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel>Language</InputLabel>
                    <Select
                      value={profile.preferences.language}
                      label="Language"
                      onChange={(e) =>
                        setProfile({
                          ...profile,
                          preferences: { ...profile.preferences, language: e.target.value },
                        })
                      }
                      disabled={!editMode}
                    >
                      <MenuItem value="en">English</MenuItem>
                      <MenuItem value="es">Spanish</MenuItem>
                      <MenuItem value="fr">French</MenuItem>
                      <MenuItem value="de">German</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel>Currency</InputLabel>
                    <Select
                      value={profile.preferences.currency}
                      label="Currency"
                      onChange={(e) =>
                        setProfile({
                          ...profile,
                          preferences: { ...profile.preferences, currency: e.target.value },
                        })
                      }
                      disabled={!editMode}
                    >
                      <MenuItem value="USD">USD</MenuItem>
                      <MenuItem value="EUR">EUR</MenuItem>
                      <MenuItem value="GBP">GBP</MenuItem>
                      <MenuItem value="JPY">JPY</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={profile.preferences.darkMode}
                        onChange={(e) =>
                          setProfile({
                            ...profile,
                            preferences: { ...profile.preferences, darkMode: e.target.checked },
                          })
                        }
                        disabled={!editMode}
                      />
                    }
                    label="Dark Mode"
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* KYC Status */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6">KYC Verification</Typography>
                <Button
                  variant="outlined"
                  onClick={() => setKycDialog(true)}
                >
                  Complete KYC
                </Button>
              </Box>

              <List>
                {kycSteps.map((step, index) => (
                  <ListItem key={index}>
                    <ListItemIcon>
                      {getStatusIcon(step.status)}
                    </ListItemIcon>
                    <ListItemText
                      primary={step.step}
                      secondary={step.description}
                    />
                    <Chip
                      label={step.status.replace('_', ' ')}
                      color={getStatusColor(step.status)}
                      size="small"
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Security Events */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Recent Security Events
              </Typography>
              <List>
                {securityEvents.map((event, index) => (
                  <ListItem key={index}>
                    <ListItemIcon>
                      {getStatusIcon(event.status)}
                    </ListItemIcon>
                    <ListItemText
                      primary={event.action}
                      secondary={`${event.time} • IP: ${event.ip}`}
                    />
                    <Chip
                      label={event.status}
                      color={getStatusColor(event.status)}
                      size="small"
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* KYC Dialog */}
      <Dialog open={kycDialog} onClose={() => setKycDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>Complete KYC Verification</DialogTitle>
        <DialogContent>
          <Alert severity="info" sx={{ mb: 2 }}>
            Please upload the required documents to complete your KYC verification.
          </Alert>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Government ID"
                type="file"
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Address Proof"
                type="file"
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Bank Statement"
                type="file"
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setKycDialog(false)}>Cancel</Button>
          <Button variant="contained">Submit Documents</Button>
        </DialogActions>
      </Dialog>

      {/* Security Dialog */}
      <Dialog open={securityDialog} onClose={() => setSecurityDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Security Settings</DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <FormControlLabel
                control={<Switch checked={profile.twoFactorEnabled} />}
                label="Two-Factor Authentication"
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={<Switch />}
                label="Login Notifications"
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={<Switch />}
                label="API Access"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSecurityDialog(false)}>Cancel</Button>
          <Button variant="contained">Save Changes</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default Profile;
