import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  ButtonGroup,
  Chip,
  Tooltip,
  IconButton,
  Menu,
  MenuItem,
  FormControl,
  Select,
  InputLabel,
  Switch,
  FormControlLabel,
  Slider,
  Grid,
  Card,
  CardContent,
  Divider,
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  ShowChart,
  Timeline,
  BarChart,
  CandlestickChart,
  VolumeChart,
  Settings,
  Fullscreen,
  Download,
  Share,
  Bookmark,
  Notifications,
  AutoAwesome,
  Psychology,
  Speed,
  Security,
} from '@mui/icons-material';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  CandlestickChart as RechartsCandlestick,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  BarChart as RechartsBarChart,
  Bar,
  ComposedChart,
  Scatter,
  ScatterChart,
  PieChart,
  Pie,
  Cell,
  Legend,
  ReferenceLine,
  ReferenceArea,
} from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';
import { realCryptoApi } from '../../services/realCryptoApi';

// Technical indicators
const calculateSMA = (data, period) => {
  const result = [];
  for (let i = period - 1; i < data.length; i++) {
    const sum = data.slice(i - period + 1, i + 1).reduce((acc, item) => acc + item.close, 0);
    result.push({ ...data[i], sma: sum / period });
  }
  return result;
};

const calculateEMA = (data, period) => {
  const result = [];
  const multiplier = 2 / (period + 1);
  
  for (let i = 0; i < data.length; i++) {
    if (i === 0) {
      result.push({ ...data[i], ema: data[i].close });
    } else {
      const ema = (data[i].close * multiplier) + (result[i - 1].ema * (1 - multiplier));
      result.push({ ...data[i], ema });
    }
  }
  return result;
};

const calculateRSI = (data, period = 14) => {
  const result = [];
  const gains = [];
  const losses = [];
  
  for (let i = 1; i < data.length; i++) {
    const change = data[i].close - data[i - 1].close;
    gains.push(change > 0 ? change : 0);
    losses.push(change < 0 ? Math.abs(change) : 0);
  }
  
  for (let i = period - 1; i < gains.length; i++) {
    const avgGain = gains.slice(i - period + 1, i + 1).reduce((sum, gain) => sum + gain, 0) / period;
    const avgLoss = losses.slice(i - period + 1, i + 1).reduce((sum, loss) => sum + loss, 0) / period;
    const rs = avgGain / avgLoss;
    const rsi = 100 - (100 / (1 + rs));
    result.push({ ...data[i + 1], rsi });
  }
  
  return result;
};

const calculateMACD = (data) => {
  const ema12 = calculateEMA(data, 12);
  const ema26 = calculateEMA(data, 26);
  const result = [];
  
  for (let i = 0; i < data.length; i++) {
    const macd = ema12[i].ema - ema26[i].ema;
    result.push({ ...data[i], macd });
  }
  
  return result;
};

const calculateBollingerBands = (data, period = 20, stdDev = 2) => {
  const result = [];
  
  for (let i = period - 1; i < data.length; i++) {
    const slice = data.slice(i - period + 1, i + 1);
    const sma = slice.reduce((sum, item) => sum + item.close, 0) / period;
    const variance = slice.reduce((sum, item) => sum + Math.pow(item.close - sma, 2), 0) / period;
    const stdDeviation = Math.sqrt(variance);
    
    result.push({
      ...data[i],
      bbUpper: sma + (stdDeviation * stdDev),
      bbMiddle: sma,
      bbLower: sma - (stdDeviation * stdDev),
    });
  }
  
  return result;
};

function AdvancedChart({ coinId = 'bitcoin', initialTimeframe = '1d' }) {
  const [chartData, setChartData] = useState([]);
  const [timeframe, setTimeframe] = useState(initialTimeframe);
  const [chartType, setChartType] = useState('candlestick');
  const [indicators, setIndicators] = useState({
    sma: { enabled: true, period: 20, color: '#ff6b6b' },
    ema: { enabled: true, period: 50, color: '#4ecdc4' },
    rsi: { enabled: true, period: 14, color: '#45b7d1' },
    macd: { enabled: true, color: '#96ceb4' },
    bollinger: { enabled: true, period: 20, color: '#feca57' },
  });
  const [showVolume, setShowVolume] = useState(true);
  const [showGrid, setShowGrid] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [fullscreen, setFullscreen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const chartRef = useRef(null);

  const timeframes = [
    { value: '1m', label: '1 Minute' },
    { value: '5m', label: '5 Minutes' },
    { value: '15m', label: '15 Minutes' },
    { value: '1h', label: '1 Hour' },
    { value: '4h', label: '4 Hours' },
    { value: '1d', label: '1 Day' },
    { value: '1w', label: '1 Week' },
    { value: '1M', label: '1 Month' },
  ];

  const chartTypes = [
    { value: 'candlestick', label: 'Candlestick', icon: <CandlestickChart /> },
    { value: 'line', label: 'Line', icon: <ShowChart /> },
    { value: 'area', label: 'Area', icon: <Timeline /> },
    { value: 'bar', label: 'Bar', icon: <BarChart /> },
  ];

  useEffect(() => {
    loadChartData();
  }, [coinId, timeframe]);

  const loadChartData = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const days = timeframe === '1m' ? 1 : timeframe === '5m' ? 1 : timeframe === '15m' ? 1 : 
                   timeframe === '1h' ? 1 : timeframe === '4h' ? 7 : timeframe === '1d' ? 30 : 
                   timeframe === '1w' ? 365 : 365;
      
      const data = await realCryptoApi.getRealHistoricalData(coinId, days);
      
      // Process data with technical indicators
      let processedData = data;
      
      if (indicators.sma.enabled) {
        processedData = calculateSMA(processedData, indicators.sma.period);
      }
      if (indicators.ema.enabled) {
        processedData = calculateEMA(processedData, indicators.ema.period);
      }
      if (indicators.rsi.enabled) {
        processedData = calculateRSI(processedData, indicators.rsi.period);
      }
      if (indicators.macd.enabled) {
        processedData = calculateMACD(processedData);
      }
      if (indicators.bollinger.enabled) {
        processedData = calculateBollingerBands(processedData, indicators.bollinger.period);
      }
      
      setChartData(processedData);
    } catch (error) {
      console.error('Error loading chart data:', error);
      setError('Failed to load chart data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleTimeframeChange = (newTimeframe) => {
    setTimeframe(newTimeframe);
  };

  const handleChartTypeChange = (newType) => {
    setChartType(newType);
  };

  const handleIndicatorToggle = (indicator) => {
    setIndicators(prev => ({
      ...prev,
      [indicator]: { ...prev[indicator], enabled: !prev[indicator].enabled }
    }));
  };

  const handleIndicatorChange = (indicator, property, value) => {
    setIndicators(prev => ({
      ...prev,
      [indicator]: { ...prev[indicator], [property]: value }
    }));
  };

  const renderChart = () => {
    if (isLoading) {
      return (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 400 }}>
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          >
            <ShowChart sx={{ fontSize: 48, color: 'primary.main' }} />
          </motion.div>
        </Box>
      );
    }

    if (error) {
      return (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 400 }}>
          <Typography variant="h6" color="error">
            {error}
          </Typography>
        </Box>
      );
    }

    return (
      <ResponsiveContainer width="100%" height={400}>
        <ComposedChart data={chartData}>
          {showGrid && <CartesianGrid strokeDasharray="3 3" stroke="#374151" />}
          <XAxis 
            dataKey="timestamp" 
            tickFormatter={(value) => new Date(value).toLocaleDateString()}
            stroke="#9ca3af"
          />
          <YAxis 
            domain={['dataMin - 100', 'dataMax + 100']}
            stroke="#9ca3af"
          />
          <RechartsTooltip 
            contentStyle={{ 
              backgroundColor: '#1f2937', 
              border: '1px solid #374151',
              borderRadius: '8px',
              color: '#f9fafb'
            }}
            formatter={(value, name) => [value?.toFixed(2), name]}
          />
          <Legend />
          
          {/* Bollinger Bands */}
          {indicators.bollinger.enabled && (
            <>
              <Area
                type="monotone"
                dataKey="bbUpper"
                stroke={indicators.bollinger.color}
                fill={indicators.bollinger.color}
                fillOpacity={0.1}
                strokeDasharray="5 5"
              />
              <Line
                type="monotone"
                dataKey="bbMiddle"
                stroke={indicators.bollinger.color}
                strokeDasharray="5 5"
              />
              <Area
                type="monotone"
                dataKey="bbLower"
                stroke={indicators.bollinger.color}
                fill={indicators.bollinger.color}
                fillOpacity={0.1}
                strokeDasharray="5 5"
              />
            </>
          )}
          
          {/* SMA */}
          {indicators.sma.enabled && (
            <Line
              type="monotone"
              dataKey="sma"
              stroke={indicators.sma.color}
              strokeWidth={2}
              dot={false}
            />
          )}
          
          {/* EMA */}
          {indicators.ema.enabled && (
            <Line
              type="monotone"
              dataKey="ema"
              stroke={indicators.ema.color}
              strokeWidth={2}
              dot={false}
            />
          )}
          
          {/* RSI */}
          {indicators.rsi.enabled && (
            <Line
              type="monotone"
              dataKey="rsi"
              stroke={indicators.rsi.color}
              strokeWidth={2}
              dot={false}
            />
          )}
          
          {/* MACD */}
          {indicators.macd.enabled && (
            <Line
              type="monotone"
              dataKey="macd"
              stroke={indicators.macd.color}
              strokeWidth={2}
              dot={false}
            />
          )}
          
          {/* Volume */}
          {showVolume && (
            <Bar dataKey="volume" fill="#6b7280" opacity={0.6} />
          )}
        </ComposedChart>
      </ResponsiveContainer>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Paper 
        sx={{ 
          p: 3, 
          borderRadius: 3, 
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 1 }}>
              📈 Advanced Chart - {coinId.toUpperCase()}
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.8 }}>
              Professional trading charts with technical indicators
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Tooltip title="Settings">
              <IconButton onClick={() => setSettingsOpen(true)} sx={{ color: 'white' }}>
                <Settings />
              </IconButton>
            </Tooltip>
            <Tooltip title="Fullscreen">
              <IconButton onClick={() => setFullscreen(!fullscreen)} sx={{ color: 'white' }}>
                <Fullscreen />
              </IconButton>
            </Tooltip>
            <Tooltip title="Download">
              <IconButton sx={{ color: 'white' }}>
                <Download />
              </IconButton>
            </Tooltip>
            <Tooltip title="Share">
              <IconButton sx={{ color: 'white' }}>
                <Share />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>

        {/* Controls */}
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 3 }}>
          {/* Timeframe Selector */}
          <ButtonGroup variant="outlined" size="small">
            {timeframes.map((tf) => (
              <Button
                key={tf.value}
                onClick={() => handleTimeframeChange(tf.value)}
                variant={timeframe === tf.value ? 'contained' : 'outlined'}
                sx={{ 
                  color: 'white',
                  borderColor: 'rgba(255,255,255,0.3)',
                  '&:hover': { borderColor: 'white' }
                }}
              >
                {tf.label}
              </Button>
            ))}
          </ButtonGroup>

          {/* Chart Type Selector */}
          <ButtonGroup variant="outlined" size="small">
            {chartTypes.map((type) => (
              <Button
                key={type.value}
                onClick={() => handleChartTypeChange(type.value)}
                variant={chartType === type.value ? 'contained' : 'outlined'}
                startIcon={type.icon}
                sx={{ 
                  color: 'white',
                  borderColor: 'rgba(255,255,255,0.3)',
                  '&:hover': { borderColor: 'white' }
                }}
              >
                {type.label}
              </Button>
            ))}
          </ButtonGroup>

          {/* Indicators */}
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            {Object.entries(indicators).map(([key, indicator]) => (
              <Chip
                key={key}
                label={key.toUpperCase()}
                onClick={() => handleIndicatorToggle(key)}
                color={indicator.enabled ? 'primary' : 'default'}
                variant={indicator.enabled ? 'filled' : 'outlined'}
                sx={{ color: 'white' }}
              />
            ))}
          </Box>
        </Box>

        {/* Chart */}
        <Box sx={{ 
          background: 'rgba(0,0,0,0.2)', 
          borderRadius: 2, 
          p: 2,
          backdropFilter: 'blur(10px)',
        }}>
          {renderChart()}
        </Box>

        {/* Technical Analysis Summary */}
        <Box sx={{ mt: 3 }}>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
            🔍 Technical Analysis
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ background: 'rgba(255,255,255,0.1)', color: 'white' }}>
                <CardContent>
                  <Typography variant="body2" sx={{ opacity: 0.8 }}>RSI</Typography>
                  <Typography variant="h6">
                    {chartData.length > 0 ? chartData[chartData.length - 1]?.rsi?.toFixed(2) || 'N/A' : 'N/A'}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ background: 'rgba(255,255,255,0.1)', color: 'white' }}>
                <CardContent>
                  <Typography variant="body2" sx={{ opacity: 0.8 }}>MACD</Typography>
                  <Typography variant="h6">
                    {chartData.length > 0 ? chartData[chartData.length - 1]?.macd?.toFixed(4) || 'N/A' : 'N/A'}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ background: 'rgba(255,255,255,0.1)', color: 'white' }}>
                <CardContent>
                  <Typography variant="body2" sx={{ opacity: 0.8 }}>SMA (20)</Typography>
                  <Typography variant="h6">
                    {chartData.length > 0 ? chartData[chartData.length - 1]?.sma?.toFixed(2) || 'N/A' : 'N/A'}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ background: 'rgba(255,255,255,0.1)', color: 'white' }}>
                <CardContent>
                  <Typography variant="body2" sx={{ opacity: 0.8 }}>EMA (50)</Typography>
                  <Typography variant="h6">
                    {chartData.length > 0 ? chartData[chartData.length - 1]?.ema?.toFixed(2) || 'N/A' : 'N/A'}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>

        {/* Settings Menu */}
        <Menu
          open={settingsOpen}
          onClose={() => setSettingsOpen(false)}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
          <MenuItem>
            <FormControlLabel
              control={
                <Switch
                  checked={showVolume}
                  onChange={(e) => setShowVolume(e.target.checked)}
                />
              }
              label="Show Volume"
            />
          </MenuItem>
          <MenuItem>
            <FormControlLabel
              control={
                <Switch
                  checked={showGrid}
                  onChange={(e) => setShowGrid(e.target.checked)}
                />
              }
              label="Show Grid"
            />
          </MenuItem>
        </Menu>
      </Paper>
    </motion.div>
  );
}

export default AdvancedChart;




