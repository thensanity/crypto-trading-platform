import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Toaster } from 'react-hot-toast';

// Theme
import theme from './theme';

// Components
import Layout from './components/Layout/Layout';
import DashboardModern from './pages/Dashboard/DashboardModern';
import TradingModern from './pages/Trading/TradingModern';
import Wallet from './pages/Wallet/Wallet';
import MarketEnhanced from './pages/Market/MarketEnhanced';
import Profile from './pages/Profile/Profile';
import Portfolio from './pages/Portfolio/Portfolio';
import Orders from './pages/Orders/Orders';
import Settings from './pages/Settings/Settings';
import AIDashboard from './pages/AIDashboard/AIDashboard';
import SocialTrading from './pages/SocialTrading/SocialTrading';
import AdvancedChart from './components/AdvancedChart/AdvancedChart';
import AIChatButton from './components/AIChatButton/AIChatButton';
import AIChatPage from './pages/AIChat/AIChatPage';

// Create query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          <Layout>
            <Routes>
              <Route path="/" element={<DashboardModern />} />
              <Route path="/trading" element={<TradingModern />} />
              <Route path="/wallet" element={<Wallet />} />
              <Route path="/market" element={<MarketEnhanced />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/portfolio" element={<Portfolio />} />
              <Route path="/orders" element={<Orders />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/ai-dashboard" element={<AIDashboard />} />
              <Route path="/social-trading" element={<SocialTrading />} />
              <Route path="/advanced-chart" element={<AdvancedChart />} />
              <Route path="/ai-chat" element={<AIChatPage />} />
            </Routes>
          </Layout>
        </Router>
        
        {/* AI Chat Button - Available on all pages */}
        <AIChatButton />
        
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#1a1a1a',
              color: '#fff',
              border: '1px solid #333',
            },
          }}
        />
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;