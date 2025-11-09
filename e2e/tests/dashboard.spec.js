const { test, expect } = require('@playwright/test');

test.describe('Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display welcome message', async ({ page }) => {
    await expect(page.getByText('Welcome back, Trader! 👋')).toBeVisible();
    await expect(page.getByText("Here's what's happening with your portfolio today")).toBeVisible();
  });

  test('should display all stats cards', async ({ page }) => {
    await expect(page.getByText('Total Portfolio')).toBeVisible();
    await expect(page.getByText('24h Volume')).toBeVisible();
    await expect(page.getByText('Security Score')).toBeVisible();
    await expect(page.getByText('AI Predictions')).toBeVisible();
  });

  test('should display portfolio value', async ({ page }) => {
    await expect(page.getByText('$50,000')).toBeVisible();
    await expect(page.getByText('+$5,000 profit')).toBeVisible();
  });

  test('should display portfolio performance chart', async ({ page }) => {
    await expect(page.getByText('Portfolio Performance')).toBeVisible();
  });

  test('should display quick actions', async ({ page }) => {
    await expect(page.getByText('Quick Actions')).toBeVisible();
    await expect(page.getByText('Start Trading')).toBeVisible();
    await expect(page.getByText('AI Analysis')).toBeVisible();
    await expect(page.getByText('Auto Trading')).toBeVisible();
  });

  test('should display top cryptocurrencies', async ({ page }) => {
    await expect(page.getByText('Top Cryptocurrencies')).toBeVisible();
  });

  test('should display recent trades', async ({ page }) => {
    await expect(page.getByText('Recent Trades')).toBeVisible();
  });

  test('should show cryptocurrency data', async ({ page }) => {
    await expect(page.getByText('Bitcoin')).toBeVisible();
    await expect(page.getByText('Ethereum')).toBeVisible();
    await expect(page.getByText('Cardano')).toBeVisible();
  });

  test('should show price changes', async ({ page }) => {
    await expect(page.getByText('+2.50%')).toBeVisible();
    await expect(page.getByText('-1.20%')).toBeVisible();
    await expect(page.getByText('+0.80%')).toBeVisible();
  });

  test('should display recent trades information', async ({ page }) => {
    await expect(page.getByText('BTC/USDT')).toBeVisible();
    await expect(page.getByText('ETH/USDT')).toBeVisible();
    await expect(page.getByText('ADA/USDT')).toBeVisible();
    await expect(page.getByText('0.5 BTC')).toBeVisible();
    await expect(page.getByText('2.0 ETH')).toBeVisible();
    await expect(page.getByText('1000 ADA')).toBeVisible();
  });

  test('should show trade times', async ({ page }) => {
    await expect(page.getByText('2 min ago')).toBeVisible();
    await expect(page.getByText('15 min ago')).toBeVisible();
    await expect(page.getByText('1 hour ago')).toBeVisible();
  });

  test('should display trade prices', async ({ page }) => {
    await expect(page.getByText('$43,250')).toBeVisible();
    await expect(page.getByText('$2,650')).toBeVisible();
    await expect(page.getByText('$0.485')).toBeVisible();
  });

  test('should show trade type indicators', async ({ page }) => {
    await expect(page.getByText('Buy')).toBeVisible();
    await expect(page.getByText('Sell')).toBeVisible();
  });

  test('should display security score with progress', async ({ page }) => {
    await expect(page.getByText('95%')).toBeVisible();
    await expect(page.getByText('95% complete')).toBeVisible();
  });

  test('should show AI predictions accuracy', async ({ page }) => {
    await expect(page.getByText('87%')).toBeVisible();
    await expect(page.getByText('87% accuracy rate')).toBeVisible();
  });
});


