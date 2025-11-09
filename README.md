# Crypto Trading Platform

A modern, professional cryptocurrency trading platform built with React, Material-UI, and advanced features including AI-powered insights, real-time data, and comprehensive trading tools.

## 🚀 Features

### Core Trading Features
- **Advanced Trading Interface** - Professional-grade trading interface with real-time charts
- **Multiple Order Types** - Market, Limit, Stop, and Stop-Limit orders
- **Portfolio Management** - Comprehensive portfolio tracking and analytics
- **Real-time Data** - Live cryptocurrency prices and market data
- **Order Book** - Real-time order book visualization
- **Recent Trades** - Live trade feed

### AI-Powered Features
- **AI Dashboard** - AI-driven market insights and predictions
- **AI Chat Assistant** - Intelligent trading assistant
- **Predictive Analytics** - Machine learning-powered market predictions
- **Smart Recommendations** - AI-suggested trading strategies

### User Experience
- **Modern UI/UX** - Professional, responsive design
- **Dark Theme** - Optimized for trading environments
- **Mobile Responsive** - Full mobile support
- **Real-time Updates** - Live data streaming
- **Social Trading** - Follow and copy successful traders

### Security & Performance
- **High Security** - Enterprise-grade security measures
- **Performance Optimized** - Fast loading and smooth interactions
- **Comprehensive Testing** - Unit tests, E2E tests, and integration tests
- **Monitoring** - Built-in performance monitoring

## 🛠️ Technology Stack

- **Frontend**: React 19, Material-UI 7, Framer Motion
- **State Management**: Zustand
- **Data Fetching**: TanStack Query (React Query)
- **Charts**: Recharts, MUI X Charts
- **Testing**: Jest, React Testing Library, Playwright
- **Build Tool**: Create React App
- **Deployment**: Docker, Nginx
- **CI/CD**: GitHub Actions

## 📦 Installation

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Docker (for containerized deployment)

### Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/crypto-trading-platform.git
   cd crypto-trading-platform
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm start
   ```

4. **Open in browser**
   Navigate to `http://localhost:3000`

### Available Scripts

```bash
# Development
npm start          # Start development server
npm run build      # Build for production
npm test           # Run unit tests
npm run test:e2e   # Run E2E tests

# Testing
npm run test:coverage  # Run tests with coverage
npm run test:watch     # Run tests in watch mode
npm run test:ci        # Run tests in CI mode

# Linting
npm run lint       # Run ESLint
npm run lint:fix   # Fix ESLint issues

# Build
npm run build     # Build for production
npm run analyze    # Analyze bundle size
```

## 🧪 Testing

### Unit Tests
```bash
npm test
```

### E2E Tests
```bash
# Install Playwright browsers
npx playwright install

# Run E2E tests
npx playwright test
```

### Test Coverage
```bash
npm run test:coverage
```

## 🚀 Deployment

### Quick Deployment

#### Using Deployment Scripts

**Linux/macOS:**
```bash
# Make script executable
chmod +x deploy.sh

# Deploy to production
./deploy.sh deploy

# Deploy with Docker Compose
./deploy.sh compose
```

**Windows:**
```cmd
# Deploy to production
deploy.bat deploy

# Deploy with Docker Compose
deploy.bat compose
```

#### Manual Deployment

1. **Build the application**
   ```bash
   npm run build
   ```

2. **Build Docker image**
   ```bash
   docker build -t crypto-trading-platform .
   ```

3. **Run container**
   ```bash
   docker run -d -p 3000:80 --name crypto-trading-platform crypto-trading-platform
   ```

### Docker Compose Deployment

1. **Start all services**
   ```bash
   docker-compose up -d
   ```

2. **Access the application**
   - Main app: `http://localhost:3000`
   - Grafana: `http://localhost:3001`
   - Prometheus: `http://localhost:9090`

### Production Deployment

#### Environment Variables
Create a `.env.production` file:
```env
REACT_APP_API_URL=https://api.your-domain.com
REACT_APP_WS_URL=wss://ws.your-domain.com
REACT_APP_ENVIRONMENT=production
```

#### Nginx Configuration
The included `nginx.conf` provides:
- Gzip compression
- Security headers
- Static asset caching
- Client-side routing support
- Health check endpoint

#### Docker Production
```bash
# Build production image
docker build -t crypto-trading-platform:production .

# Run with production settings
docker run -d \
  --name crypto-trading-platform \
  -p 80:80 \
  -p 443:443 \
  --restart unless-stopped \
  -e NODE_ENV=production \
  crypto-trading-platform:production
```

## 🔧 Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `REACT_APP_API_URL` | API base URL | `http://localhost:3001` |
| `REACT_APP_WS_URL` | WebSocket URL | `ws://localhost:3001` |
| `REACT_APP_ENVIRONMENT` | Environment | `development` |

### Theme Customization

The application uses a custom theme system. Modify `src/theme/index.js` to customize:
- Colors
- Typography
- Component styles
- Spacing
- Breakpoints

### API Configuration

Update API endpoints in:
- `src/services/cryptoApi.js`
- `src/services/tradingService.js`
- `src/services/aiChatService.js`

## 📊 Monitoring

### Health Checks
- **Endpoint**: `/health`
- **Response**: `200 OK` with "healthy" message

### Metrics
- Application metrics via Prometheus
- Performance monitoring via Grafana
- Error tracking and logging

### Logging
- Structured logging with timestamps
- Error tracking and monitoring
- Performance metrics

## 🔒 Security

### Security Features
- Content Security Policy (CSP)
- XSS Protection
- CSRF Protection
- Secure headers
- Input validation
- Rate limiting

### Best Practices
- Regular dependency updates
- Security scanning
- Code reviews
- Secure deployment practices

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow the existing code style
- Write tests for new features
- Update documentation
- Ensure all tests pass
- Follow security best practices

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

### Documentation
- [API Documentation](docs/api.md)
- [Component Documentation](docs/components.md)
- [Deployment Guide](docs/deployment.md)

### Getting Help
- Create an issue for bugs
- Use discussions for questions
- Check existing issues first

### Community
- Join our Discord server
- Follow us on Twitter
- Star the repository

## 🗺️ Roadmap

### Upcoming Features
- [ ] Advanced charting tools
- [ ] Mobile app (React Native)
- [ ] More AI features
- [ ] Social trading enhancements
- [ ] API for third-party integrations

### Version History
- **v1.0.0** - Initial release with core trading features
- **v1.1.0** - Added AI features and improved UI
- **v1.2.0** - Enhanced security and performance
- **v1.3.0** - Social trading and advanced analytics

## 🙏 Acknowledgments

- Material-UI team for the excellent component library
- React team for the amazing framework
- TradingView for charting inspiration
- All contributors and users

---

**Built with ❤️ for the crypto trading community**