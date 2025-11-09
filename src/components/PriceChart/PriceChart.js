import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  IconButton,
  Chip,
  useTheme,
} from '@mui/material';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from 'recharts';
import {
  TrendingUp,
  TrendingDown,
  Refresh,
  Fullscreen,
} from '@mui/icons-material';
import { motion } from 'framer-motion';

const PriceChart = ({
  title,
  data,
  dataKey = 'value',
  xAxisKey = 'name',
  height = 300,
  showGradient = true,
  color = '#4caf50',
  isLoading = false,
  onRefresh,
  onFullscreen,
  currentPrice,
  priceChange,
  timeframe,
  ...props
}) => {
  const theme = useTheme();

  const formatPrice = (value) => {
    if (value >= 1000000) {
      return `$${(value / 1000000).toFixed(1)}M`;
    } else if (value >= 1000) {
      return `$${(value / 1000).toFixed(1)}K`;
    }
    return `$${value.toLocaleString()}`;
  };

  const formatChange = (change) => {
    return `${change >= 0 ? '+' : ''}${change.toFixed(2)}%`;
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <Box
          sx={{
            backgroundColor: 'background.paper',
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: 2,
            p: 2,
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
          }}
        >
          <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1 }}>
            {label}
          </Typography>
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
            {formatPrice(payload[0].value)}
          </Typography>
        </Box>
      );
    }
    return null;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card
        sx={{
          height: '100%',
          background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.1) 0%, rgba(0, 0, 0, 0.05) 100%)',
          border: '1px solid',
          borderColor: 'divider',
        }}
        {...props}
      >
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                {title}
              </Typography>
              {currentPrice && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                    {formatPrice(currentPrice)}
                  </Typography>
                  {priceChange !== undefined && (
                    <Chip
                      icon={priceChange >= 0 ? <TrendingUp /> : <TrendingDown />}
                      label={formatChange(priceChange)}
                      color={priceChange >= 0 ? 'success' : 'error'}
                      size="small"
                    />
                  )}
                  {timeframe && (
                    <Chip
                      label={timeframe}
                      variant="outlined"
                      size="small"
                    />
                  )}
                </Box>
              )}
            </Box>
            <Box sx={{ display: 'flex', gap: 1 }}>
              {onRefresh && (
                <IconButton onClick={onRefresh} size="small">
                  <Refresh />
                </IconButton>
              )}
              {onFullscreen && (
                <IconButton onClick={onFullscreen} size="small">
                  <Fullscreen />
                </IconButton>
              )}
            </Box>
          </Box>

          <Box sx={{ height }}>
            {isLoading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  Loading chart data...
                </Typography>
              </Box>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                {showGradient ? (
                  <AreaChart data={data}>
                    <defs>
                      <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={color} stopOpacity={0.3} />
                        <stop offset="95%" stopColor={color} stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} />
                    <XAxis 
                      dataKey={xAxisKey} 
                      stroke={theme.palette.text.secondary}
                      fontSize={12}
                    />
                    <YAxis 
                      stroke={theme.palette.text.secondary}
                      fontSize={12}
                      tickFormatter={(value) => formatPrice(value)}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Area
                      type="monotone"
                      dataKey={dataKey}
                      stroke={color}
                      fill="url(#colorGradient)"
                      strokeWidth={2}
                    />
                  </AreaChart>
                ) : (
                  <LineChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} />
                    <XAxis 
                      dataKey={xAxisKey} 
                      stroke={theme.palette.text.secondary}
                      fontSize={12}
                    />
                    <YAxis 
                      stroke={theme.palette.text.secondary}
                      fontSize={12}
                      tickFormatter={(value) => formatPrice(value)}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Line
                      type="monotone"
                      dataKey={dataKey}
                      stroke={color}
                      strokeWidth={2}
                      dot={false}
                    />
                  </LineChart>
                )}
              </ResponsiveContainer>
            )}
          </Box>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default PriceChart;

