import { createTheme } from '@mui/material/styles';

// Modern crypto trading platform color palette
const colors = {
  // Primary colors - Professional green
  primary: {
    50: '#e8f5e8',
    100: '#c8e6c9',
    200: '#a5d6a7',
    300: '#81c784',
    400: '#66bb6a',
    500: '#4caf50',
    600: '#43a047',
    700: '#388e3c',
    800: '#2e7d32',
    900: '#1b5e20',
  },
  // Secondary colors - Professional blue
  secondary: {
    50: '#e3f2fd',
    100: '#bbdefb',
    200: '#90caf9',
    300: '#64b5f6',
    400: '#42a5f5',
    500: '#2196f3',
    600: '#1e88e5',
    700: '#1976d2',
    800: '#1565c0',
    900: '#0d47a1',
  },
  // Success colors - Green for profits
  success: {
    50: '#e8f5e8',
    100: '#c8e6c9',
    200: '#a5d6a7',
    300: '#81c784',
    400: '#66bb6a',
    500: '#4caf50',
    600: '#43a047',
    700: '#388e3c',
    800: '#2e7d32',
    900: '#1b5e20',
  },
  // Error colors - Red for losses
  error: {
    50: '#ffebee',
    100: '#ffcdd2',
    200: '#ef9a9a',
    300: '#e57373',
    400: '#ef5350',
    500: '#f44336',
    600: '#e53935',
    700: '#d32f2f',
    800: '#c62828',
    900: '#b71c1c',
  },
  // Warning colors - Orange for alerts
  warning: {
    50: '#fff3e0',
    100: '#ffe0b2',
    200: '#ffcc80',
    300: '#ffb74d',
    400: '#ffa726',
    500: '#ff9800',
    600: '#fb8c00',
    700: '#f57c00',
    800: '#ef6c00',
    900: '#e65100',
  },
  // Info colors - Blue for information
  info: {
    50: '#e3f2fd',
    100: '#bbdefb',
    200: '#90caf9',
    300: '#64b5f6',
    400: '#42a5f5',
    500: '#2196f3',
    600: '#1e88e5',
    700: '#1976d2',
    800: '#1565c0',
    900: '#0d47a1',
  },
  // Dark theme colors
  dark: {
    background: {
      default: '#0a0a0a',
      paper: '#1a1a1a',
      elevated: '#2a2a2a',
      surface: '#1e1e1e',
    },
    text: {
      primary: '#ffffff',
      secondary: '#b0b0b0',
      disabled: '#666666',
    },
    border: {
      light: '#333333',
      medium: '#444444',
      dark: '#222222',
    },
  },
};

// Create the theme
const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: colors.primary[500],
      light: colors.primary[300],
      dark: colors.primary[700],
      contrastText: '#ffffff',
    },
    secondary: {
      main: colors.secondary[500],
      light: colors.secondary[300],
      dark: colors.secondary[700],
      contrastText: '#ffffff',
    },
    success: {
      main: colors.success[500],
      light: colors.success[300],
      dark: colors.success[700],
      contrastText: '#ffffff',
    },
    error: {
      main: colors.error[500],
      light: colors.error[300],
      dark: colors.error[700],
      contrastText: '#ffffff',
    },
    warning: {
      main: colors.warning[500],
      light: colors.warning[300],
      dark: colors.warning[700],
      contrastText: '#ffffff',
    },
    info: {
      main: colors.info[500],
      light: colors.info[300],
      dark: colors.info[700],
      contrastText: '#ffffff',
    },
    background: {
      default: colors.dark.background.default,
      paper: colors.dark.background.paper,
    },
    text: {
      primary: colors.dark.text.primary,
      secondary: colors.dark.text.secondary,
      disabled: colors.dark.text.disabled,
    },
    divider: colors.dark.border.light,
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 700,
      lineHeight: 1.2,
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 600,
      lineHeight: 1.3,
    },
    h3: {
      fontSize: '1.75rem',
      fontWeight: 600,
      lineHeight: 1.4,
    },
    h4: {
      fontSize: '1.5rem',
      fontWeight: 600,
      lineHeight: 1.4,
    },
    h5: {
      fontSize: '1.25rem',
      fontWeight: 600,
      lineHeight: 1.5,
    },
    h6: {
      fontSize: '1.125rem',
      fontWeight: 600,
      lineHeight: 1.5,
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.6,
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.6,
    },
    caption: {
      fontSize: '0.75rem',
      lineHeight: 1.5,
    },
    button: {
      fontSize: '0.875rem',
      fontWeight: 600,
      textTransform: 'none',
    },
  },
  shape: {
    borderRadius: 12,
  },
  spacing: 8,
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 8,
          fontWeight: 600,
          padding: '8px 16px',
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
          },
        },
        contained: {
          background: 'linear-gradient(135deg, #4caf50 0%, #45a049 100%)',
          '&:hover': {
            background: 'linear-gradient(135deg, #45a049 0%, #3d8b40 100%)',
          },
        },
        outlined: {
          borderColor: colors.dark.border.medium,
          '&:hover': {
            borderColor: colors.primary[500],
            backgroundColor: 'rgba(76, 175, 80, 0.1)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          backgroundImage: 'none',
          backgroundColor: colors.dark.background.paper,
          border: `1px solid ${colors.dark.border.light}`,
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
          '&:hover': {
            boxShadow: '0 8px 30px rgba(0, 0, 0, 0.4)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          backgroundColor: colors.dark.background.paper,
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          backgroundColor: colors.dark.background.paper,
          borderBottom: `1px solid ${colors.dark.border.light}`,
          boxShadow: '0 2px 10px rgba(0, 0, 0, 0.3)',
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: colors.dark.background.paper,
          borderRight: `1px solid ${colors.dark.border.light}`,
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
            backgroundColor: colors.dark.background.surface,
            '&:hover': {
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: colors.primary[500],
              },
            },
            '&.Mui-focused': {
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: colors.primary[500],
                borderWidth: 2,
              },
            },
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 6,
          fontWeight: 600,
        },
      },
    },
    MuiTable: {
      styleOverrides: {
        root: {
          '& .MuiTableCell-root': {
            borderBottom: `1px solid ${colors.dark.border.light}`,
          },
        },
      },
    },
    MuiLinearProgress: {
      styleOverrides: {
        root: {
          borderRadius: 4,
          backgroundColor: colors.dark.background.surface,
        },
      },
    },
  },
});

export default theme;

