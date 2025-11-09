import React, { useState, useEffect } from 'react';
import { walletService } from '../../services/walletService';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Tabs,
  Tab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  Add,
  Send,
  Download,
  Upload,
  Visibility,
  VisibilityOff,
  QrCode,
  ContentCopy,
  History,
  Security,
  AccountBalance,
  TrendingUp,
  TrendingDown,
} from '@mui/icons-material';

// Real wallet data will be loaded from walletService

function Wallet() {
  const [tabValue, setTabValue] = useState(0);
  const [showBalances, setShowBalances] = useState(true);
  const [depositDialog, setDepositDialog] = useState(false);
  const [withdrawDialog, setWithdrawDialog] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState('');
  const [amount, setAmount] = useState('');
  const [address, setAddress] = useState('');
  const [withdrawType, setWithdrawType] = useState('crypto');
  const [walletBalances, setWalletBalances] = useState([]);
  const [transactionHistory, setTransactionHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Load wallet data on component mount
  useEffect(() => {
    loadWalletData();
  }, []);

  const loadWalletData = async () => {
    setIsLoading(true);
    try {
      const balance = walletService.getBalance();
      const transactions = walletService.getTransactionHistory();
      
      // Convert balance to array format
      const balances = Object.entries(balance).map(([symbol, amount]) => ({
        asset: symbol,
        symbol,
        balance: amount,
        value: amount, // Will be updated with real prices
        change: 0, // Will be updated with real data
      }));
      
      setWalletBalances(balances);
      setTransactionHistory(transactions);
    } catch (error) {
      console.error('Error loading wallet data:', error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const totalValue = walletBalances.reduce((sum, asset) => sum + asset.value, 0);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleDeposit = () => {
    setDepositDialog(true);
  };

  const handleWithdraw = () => {
    setWithdrawDialog(true);
  };

  const handleDepositSubmit = async () => {
    if (!selectedAsset || !amount) {
      alert('Please select an asset and enter an amount');
      return;
    }

    try {
      setIsLoading(true);
      const transaction = await walletService.deposit(selectedAsset, parseFloat(amount));
      console.log('Deposit successful:', transaction);
      
      // Reload wallet data
      await loadWalletData();
      
      setDepositDialog(false);
      setAmount('');
      setSelectedAsset('');
      
      alert(`Deposit of ${amount} ${selectedAsset} completed successfully!`);
    } catch (error) {
      console.error('Deposit failed:', error);
      alert(`Deposit failed: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleWithdrawSubmit = async () => {
    if (!selectedAsset || !amount || !address) {
      alert('Please fill in all fields');
      return;
    }

    try {
      setIsLoading(true);
      const transaction = await walletService.withdraw(selectedAsset, parseFloat(amount), address);
      console.log('Withdrawal successful:', transaction);
      
      // Reload wallet data
      await loadWalletData();
      
      setWithdrawDialog(false);
      setAmount('');
      setSelectedAsset('');
      setAddress('');
      
      alert(`Withdrawal of ${amount} ${selectedAsset} completed successfully!`);
    } catch (error) {
      console.error('Withdrawal failed:', error);
      alert(`Withdrawal failed: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'success';
      case 'pending':
        return 'warning';
      case 'failed':
        return 'error';
      default:
        return 'default';
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'deposit':
        return <Upload color="success" />;
      case 'withdrawal':
        return <Download color="error" />;
      case 'trade':
        return <TrendingUp color="primary" />;
      default:
        return <History />;
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
        Wallet
      </Typography>

      <Grid container spacing={3}>
        {/* Portfolio Overview */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">Portfolio Overview</Typography>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button
                    variant="outlined"
                    startIcon={<Add />}
                    onClick={handleDeposit}
                  >
                    Deposit
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={<Send />}
                    onClick={handleWithdraw}
                  >
                    Withdraw
                  </Button>
                  <IconButton onClick={() => setShowBalances(!showBalances)}>
                    {showBalances ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </Box>
              </Box>
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                  {showBalances ? `$${totalValue.toLocaleString()}` : '••••••'}
                </Typography>
                <Chip
                  icon={<TrendingUp />}
                  label="+12.5%"
                  color="success"
                  sx={{ fontWeight: 'bold' }}
                />
              </Box>

              <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={tabValue} onChange={handleTabChange}>
                  <Tab label="Balances" />
                  <Tab label="Transactions" />
                  <Tab label="Addresses" />
                </Tabs>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Balances Tab */}
        {tabValue === 0 && (
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <TableContainer component={Paper} sx={{ bgcolor: 'transparent' }}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Asset</TableCell>
                        <TableCell align="right">Balance</TableCell>
                        <TableCell align="right">Value (USD)</TableCell>
                        <TableCell align="right">24h Change</TableCell>
                        <TableCell align="center">Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {walletBalances.map((asset) => (
                        <TableRow key={asset.symbol} sx={{ '&:hover': { bgcolor: 'action.hover' } }}>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <Box
                                sx={{
                                  width: 32,
                                  height: 32,
                                  borderRadius: '50%',
                                  bgcolor: 'primary.main',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  mr: 2,
                                  color: 'white',
                                  fontWeight: 'bold',
                                }}
                              >
                                {asset.symbol.charAt(0)}
                              </Box>
                              <Box>
                                <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                                  {asset.asset}
                                </Typography>
                                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                  {asset.symbol}
                                </Typography>
                              </Box>
                            </Box>
                          </TableCell>
                          <TableCell align="right">
                            <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                              {showBalances ? asset.balance.toLocaleString() : '••••'}
                            </Typography>
                          </TableCell>
                          <TableCell align="right">
                            <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                              {showBalances ? `$${asset.value.toLocaleString()}` : '••••'}
                            </Typography>
                          </TableCell>
                          <TableCell align="right">
                            <Chip
                              icon={asset.change > 0 ? <TrendingUp /> : <TrendingDown />}
                              label={`${asset.change > 0 ? '+' : ''}${asset.change}%`}
                              color={asset.change > 0 ? 'success' : 'error'}
                              size="small"
                            />
                          </TableCell>
                          <TableCell align="center">
                            <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                              <Tooltip title="Deposit">
                                <IconButton size="small" color="success">
                                  <Upload />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Withdraw">
                                <IconButton size="small" color="error">
                                  <Download />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Trade">
                                <IconButton size="small" color="primary">
                                  <TrendingUp />
                                </IconButton>
                              </Tooltip>
                            </Box>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          </Grid>
        )}

        {/* Transactions Tab */}
        {tabValue === 1 && (
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Transaction History
                </Typography>
                <TableContainer component={Paper} sx={{ bgcolor: 'transparent' }}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Type</TableCell>
                        <TableCell>Asset</TableCell>
                        <TableCell align="right">Amount</TableCell>
                        <TableCell align="right">Value</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell>Time</TableCell>
                        <TableCell>Hash</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {transactionHistory.map((tx) => (
                        <TableRow key={tx.id} sx={{ '&:hover': { bgcolor: 'action.hover' } }}>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              {getTypeIcon(tx.type)}
                              <Typography variant="body2" sx={{ ml: 1, textTransform: 'capitalize' }}>
                                {tx.type}
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                              {tx.asset}
                            </Typography>
                          </TableCell>
                          <TableCell align="right">
                            <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                              {tx.amount}
                            </Typography>
                          </TableCell>
                          <TableCell align="right">
                            <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                              ${tx.value.toLocaleString()}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={tx.status}
                              color={getStatusColor(tx.status)}
                              size="small"
                            />
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                              {tx.time}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                                {tx.hash}
                              </Typography>
                              <IconButton size="small" sx={{ ml: 1 }}>
                                <ContentCopy fontSize="small" />
                              </IconButton>
                            </Box>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          </Grid>
        )}

        {/* Addresses Tab */}
        {tabValue === 2 && (
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Deposit Addresses
                </Typography>
                <List>
                  {walletBalances.map((asset) => (
                    <React.Fragment key={asset.symbol}>
                      <ListItem>
                        <ListItemIcon>
                          <Box
                            sx={{
                              width: 40,
                              height: 40,
                              borderRadius: '50%',
                              bgcolor: 'primary.main',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              color: 'white',
                              fontWeight: 'bold',
                            }}
                          >
                            {asset.symbol.charAt(0)}
                          </Box>
                        </ListItemIcon>
                        <ListItemText
                          primary={
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                                {asset.asset} ({asset.symbol})
                              </Typography>
                              <Box sx={{ display: 'flex', gap: 1 }}>
                                <IconButton size="small">
                                  <QrCode />
                                </IconButton>
                                <IconButton size="small">
                                  <ContentCopy />
                                </IconButton>
                              </Box>
                            </Box>
                          }
                          secondary={
                            <Typography variant="body2" sx={{ fontFamily: 'monospace', color: 'text.secondary' }}>
                              1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa
                            </Typography>
                          }
                        />
                      </ListItem>
                      <Divider />
                    </React.Fragment>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Grid>
        )}
      </Grid>

      {/* Deposit Dialog */}
      <Dialog open={depositDialog} onClose={() => setDepositDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Deposit Funds</DialogTitle>
        <DialogContent>
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>Select Asset</InputLabel>
            <Select
              value={selectedAsset}
              label="Select Asset"
              onChange={(e) => setSelectedAsset(e.target.value)}
            >
              {walletBalances.map((asset) => (
                <MenuItem key={asset.symbol} value={asset.symbol}>
                  {asset.asset} ({asset.symbol})
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            fullWidth
            label="Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            sx={{ mt: 2 }}
            type="number"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDepositDialog(false)}>Cancel</Button>
          <Button 
            variant="contained" 
            onClick={handleDepositSubmit}
            disabled={isLoading}
          >
            {isLoading ? 'Processing...' : 'Deposit'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Withdraw Dialog */}
      <Dialog open={withdrawDialog} onClose={() => setWithdrawDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Withdraw Funds</DialogTitle>
        <DialogContent>
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>Withdrawal Type</InputLabel>
            <Select
              value={withdrawType}
              label="Withdrawal Type"
              onChange={(e) => setWithdrawType(e.target.value)}
            >
              <MenuItem value="crypto">Cryptocurrency</MenuItem>
              <MenuItem value="fiat">Fiat Currency</MenuItem>
            </Select>
          </FormControl>
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>Select Asset</InputLabel>
            <Select
              value={selectedAsset}
              label="Select Asset"
              onChange={(e) => setSelectedAsset(e.target.value)}
            >
              {walletBalances.map((asset) => (
                <MenuItem key={asset.symbol} value={asset.symbol}>
                  {asset.asset} ({asset.symbol})
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            fullWidth
            label="Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            sx={{ mt: 2 }}
            type="number"
          />
          <TextField
            fullWidth
            label="Destination Address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            sx={{ mt: 2 }}
            placeholder="Enter wallet address"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setWithdrawDialog(false)}>Cancel</Button>
          <Button 
            variant="contained" 
            onClick={handleWithdrawSubmit}
            disabled={isLoading}
          >
            {isLoading ? 'Processing...' : 'Withdraw'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default Wallet;
