import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  LinearProgress,
  useTheme,
} from '@mui/material';
import { motion } from 'framer-motion';

const StatsCard = ({
  title,
  value,
  change,
  changeType = 'percentage',
  icon,
  color = 'primary',
  progress,
  subtitle,
  trend,
  ...props
}) => {
  const theme = useTheme();

  const formatValue = (val) => {
    if (typeof val === 'number') {
      if (val >= 1000000) {
        return `$${(val / 1000000).toFixed(1)}M`;
      } else if (val >= 1000) {
        return `$${(val / 1000).toFixed(1)}K`;
      }
      return `$${val.toLocaleString()}`;
    }
    return val;
  };

  const formatChange = (change) => {
    if (changeType === 'percentage') {
      return `${change >= 0 ? '+' : ''}${change.toFixed(2)}%`;
    }
    return `${change >= 0 ? '+' : ''}${formatValue(Math.abs(change))}`;
  };

  const getChangeColor = (change) => {
    if (change > 0) return 'success';
    if (change < 0) return 'error';
    return 'default';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -2 }}
    >
      <Card
        sx={{
          height: '100%',
          background: 'linear-gradient(135deg, rgba(76, 175, 80, 0.1) 0%, rgba(76, 175, 80, 0.05) 100%)',
          border: '1px solid',
          borderColor: 'divider',
          '&:hover': {
            boxShadow: '0 8px 30px rgba(0, 0, 0, 0.4)',
            transform: 'translateY(-2px)',
          },
          transition: 'all 0.3s ease',
        }}
        {...props}
      >
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              {icon && (
                <Box
                  sx={{
                    p: 1,
                    borderRadius: 2,
                    backgroundColor: `${color}.main`,
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {icon}
                </Box>
              )}
              <Typography variant="h6" sx={{ fontWeight: 600, color: 'text.secondary' }}>
                {title}
              </Typography>
            </Box>
            {change !== undefined && (
              <Chip
                label={formatChange(change)}
                color={getChangeColor(change)}
                size="small"
                sx={{ fontWeight: 600 }}
              />
            )}
          </Box>

          <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'text.primary', mb: 1 }}>
            {formatValue(value)}
          </Typography>

          {subtitle && (
            <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
              {subtitle}
            </Typography>
          )}

          {progress !== undefined && (
            <Box sx={{ mt: 2 }}>
              <LinearProgress
                variant="determinate"
                value={progress}
                sx={{
                  height: 6,
                  borderRadius: 3,
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  '& .MuiLinearProgress-bar': {
                    backgroundColor: `${color}.main`,
                    borderRadius: 3,
                  },
                }}
              />
              <Typography variant="caption" sx={{ color: 'text.secondary', mt: 1, display: 'block' }}>
                {progress}% complete
              </Typography>
            </Box>
          )}

          {trend && (
            <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                {trend}
              </Typography>
            </Box>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default StatsCard;

