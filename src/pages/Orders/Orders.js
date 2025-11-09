import React, { useState } from 'react';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  Button,
  Tabs,
  Tab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Tooltip,
  Menu,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import {
  MoreVert,
  Edit,
  Cancel,
  Refresh,
  FilterList,
  Download,
  TrendingUp,
  TrendingDown,
  Schedule,
  CheckCircle,
  Error,
  Warning,
  Visibility,
} from '@mui/icons-material';

// Mock orders data
const activeOrders = [
  {
    id: 1,
    pair: 'BTC/USDT',
    type: 'Buy',
    orderType: 'Limit',
    amount: 0.5,
    price: 43000,
    filled: 0.2,
    remaining: 0.3,
    status: 'open',
    time: '2024-01-15 14:30:25',
    value: 21500,
  },
  {
    id: 2,
    pair: 'ETH/USDT',
    type: 'Sell',
    orderType: 'Stop',
    amount: 2.0,
    price: 2700,
    filled: 0,
    remaining: 2.0,
    status: 'open',
    time: '2024-01-15 12:15:10',
    value: 5400,
  },
  {
    id: 3,
    pair: 'ADA/USDT',
    type: 'Buy',
    orderType: 'Market',
    amount: 1000,
    price: 0.485,
    filled: 1000,
    remaining: 0,
    status: 'filled',
    time: '2024-01-15 10:45:30',
    value: 485,
  },
];

const orderHistory = [
  {
    id: 1,
    pair: 'BTC/USDT',
    type: 'Buy',
    orderType: 'Limit',
    amount: 0.1,
    price: 42000,
    filled: 0.1,
    remaining: 0,
    status: 'filled',
    time: '2024-01-14 16:20:15',
    value: 4200,
    fee: 4.2,
  },
  {
    id: 2,
    pair: 'ETH/USDT',
    type: 'Sell',
    orderType: 'Market',
    amount: 1.5,
    price: 2600,
    filled: 1.5,
    remaining: 0,
    status: 'filled',
    time: '2024-01-14 14:30:25',
    value: 3900,
    fee: 3.9,
  },
  {
    id: 3,
    pair: 'SOL/USDT',
    type: 'Buy',
    orderType: 'Limit',
    amount: 10,
    price: 95,
    filled: 0,
    remaining: 10,
    status: 'cancelled',
    time: '2024-01-14 12:15:10',
    value: 950,
    fee: 0,
  },
  {
    id: 4,
    pair: 'BNB/USDT',
    type: 'Sell',
    orderType: 'Stop',
    amount: 5,
    price: 300,
    filled: 5,
    remaining: 0,
    status: 'filled',
    time: '2024-01-14 10:45:30',
    value: 1500,
    fee: 1.5,
  },
];

function Orders() {
  const [tabValue, setTabValue] = useState(0);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [cancelDialog, setCancelDialog] = useState(false);
  const [editDialog, setEditDialog] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPair, setFilterPair] = useState('all');

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleMenuOpen = (event, order) => {
    setAnchorEl(event.currentTarget);
    setSelectedOrder(order);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedOrder(null);
  };

  const handleCancelOrder = () => {
    setCancelDialog(true);
    handleMenuClose();
  };

  const handleEditOrder = () => {
    setEditDialog(true);
    handleMenuClose();
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'open':
        return 'warning';
      case 'filled':
        return 'success';
      case 'cancelled':
        return 'error';
      case 'partial':
        return 'info';
      default:
        return 'default';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'open':
        return <Schedule />;
      case 'filled':
        return <CheckCircle />;
      case 'cancelled':
        return <Error />;
      case 'partial':
        return <Warning />;
      default:
        return <Schedule />;
    }
  };

  const getTypeIcon = (type) => {
    return type === 'Buy' ? <TrendingUp color="success" /> : <TrendingDown color="error" />;
  };

  const currentOrders = tabValue === 0 ? activeOrders : orderHistory;

  return (
    <Box>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
        Orders
      </Typography>

      {/* Order Stats */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1 }}>
                Active Orders
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'warning.main' }}>
                {activeOrders.length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1 }}>
                Total Orders
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                {orderHistory.length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1 }}>
                Filled Orders
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'success.main' }}>
                {orderHistory.filter(order => order.status === 'filled').length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1 }}>
                Success Rate
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'success.main' }}>
                85%
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={tabValue} onChange={handleTabChange}>
          <Tab label="Active Orders" />
          <Tab label="Order History" />
        </Tabs>
      </Box>

      {/* Orders Table */}
      <Card>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">
              {tabValue === 0 ? 'Active Orders' : 'Order History'}
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <FormControl size="small" sx={{ minWidth: 120 }}>
                <InputLabel>Status</InputLabel>
                <Select
                  value={filterStatus}
                  label="Status"
                  onChange={(e) => setFilterStatus(e.target.value)}
                >
                  <MenuItem value="all">All</MenuItem>
                  <MenuItem value="open">Open</MenuItem>
                  <MenuItem value="filled">Filled</MenuItem>
                  <MenuItem value="cancelled">Cancelled</MenuItem>
                </Select>
              </FormControl>
              <FormControl size="small" sx={{ minWidth: 120 }}>
                <InputLabel>Pair</InputLabel>
                <Select
                  value={filterPair}
                  label="Pair"
                  onChange={(e) => setFilterPair(e.target.value)}
                >
                  <MenuItem value="all">All</MenuItem>
                  <MenuItem value="BTC/USDT">BTC/USDT</MenuItem>
                  <MenuItem value="ETH/USDT">ETH/USDT</MenuItem>
                  <MenuItem value="ADA/USDT">ADA/USDT</MenuItem>
                </Select>
              </FormControl>
              <IconButton>
                <Refresh />
              </IconButton>
              <IconButton>
                <Download />
              </IconButton>
            </Box>
          </Box>

          <TableContainer component={Paper} sx={{ bgcolor: 'transparent' }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Pair</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>Order Type</TableCell>
                  <TableCell align="right">Amount</TableCell>
                  <TableCell align="right">Price</TableCell>
                  <TableCell align="right">Filled</TableCell>
                  <TableCell align="right">Remaining</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Time</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {currentOrders.map((order) => (
                  <TableRow key={order.id} sx={{ '&:hover': { bgcolor: 'action.hover' } }}>
                    <TableCell>
                      <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                        {order.pair}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        {getTypeIcon(order.type)}
                        <Typography variant="body2" sx={{ ml: 1, fontWeight: 'bold' }}>
                          {order.type}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip label={order.orderType} size="small" variant="outlined" />
                    </TableCell>
                    <TableCell align="right">
                      <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                        {order.amount}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                        ${order.price.toLocaleString()}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                        {order.filled}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                        {order.remaining}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        icon={getStatusIcon(order.status)}
                        label={order.status}
                        color={getStatusColor(order.status)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        {order.time}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <IconButton
                        size="small"
                        onClick={(e) => handleMenuOpen(e, order)}
                      >
                        <MoreVert />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* Actions Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleEditOrder}>
          <ListItemIcon>
            <Edit fontSize="small" />
          </ListItemIcon>
          <ListItemText>Edit Order</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleCancelOrder}>
          <ListItemIcon>
            <Cancel fontSize="small" />
          </ListItemIcon>
          <ListItemText>Cancel Order</ListItemText>
        </MenuItem>
        <MenuItem>
          <ListItemIcon>
            <Visibility fontSize="small" />
          </ListItemIcon>
          <ListItemText>View Details</ListItemText>
        </MenuItem>
      </Menu>

      {/* Cancel Order Dialog */}
      <Dialog open={cancelDialog} onClose={() => setCancelDialog(false)}>
        <DialogTitle>Cancel Order</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to cancel this order? This action cannot be undone.
          </Typography>
          {selectedOrder && (
            <Box sx={{ mt: 2, p: 2, bgcolor: 'background.paper', borderRadius: 1 }}>
              <Typography variant="body2">
                <strong>Pair:</strong> {selectedOrder.pair}
              </Typography>
              <Typography variant="body2">
                <strong>Type:</strong> {selectedOrder.type} {selectedOrder.orderType}
              </Typography>
              <Typography variant="body2">
                <strong>Amount:</strong> {selectedOrder.amount}
              </Typography>
              <Typography variant="body2">
                <strong>Price:</strong> ${selectedOrder.price.toLocaleString()}
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCancelDialog(false)}>Cancel</Button>
          <Button variant="contained" color="error" onClick={() => setCancelDialog(false)}>
            Cancel Order
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Order Dialog */}
      <Dialog open={editDialog} onClose={() => setEditDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Order</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Amount"
                defaultValue={selectedOrder?.amount}
                type="number"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Price"
                defaultValue={selectedOrder?.price}
                type="number"
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Order Type</InputLabel>
                <Select
                  defaultValue={selectedOrder?.orderType}
                  label="Order Type"
                >
                  <MenuItem value="Limit">Limit</MenuItem>
                  <MenuItem value="Market">Market</MenuItem>
                  <MenuItem value="Stop">Stop</MenuItem>
                  <MenuItem value="Stop Limit">Stop Limit</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialog(false)}>Cancel</Button>
          <Button variant="contained" onClick={() => setEditDialog(false)}>
            Update Order
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default Orders;
