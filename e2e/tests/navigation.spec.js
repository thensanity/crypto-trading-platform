const { test, expect } = require('@playwright/test');

test.describe('Navigation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display logo and title', async ({ page }) => {
    await expect(page.getByText('CryptoTrader Pro')).toBeVisible();
  });

  test('should display sidebar navigation', async ({ page }) => {
    await expect(page.getByText('Dashboard')).toBeVisible();
    await expect(page.getByText('AI Dashboard')).toBeVisible();
    await expect(page.getByText('AI Chat')).toBeVisible();
    await expect(page.getByText('Trading')).toBeVisible();
    await expect(page.getByText('Social Trading')).toBeVisible();
    await expect(page.getByText('Market')).toBeVisible();
    await expect(page.getByText('Advanced Chart')).toBeVisible();
    await expect(page.getByText('Portfolio')).toBeVisible();
    await expect(page.getByText('Orders')).toBeVisible();
    await expect(page.getByText('Wallet')).toBeVisible();
    await expect(page.getByText('Profile')).toBeVisible();
    await expect(page.getByText('Settings')).toBeVisible();
  });

  test('should display navigation categories', async ({ page }) => {
    await expect(page.getByText('Main')).toBeVisible();
    await expect(page.getByText('AI Features')).toBeVisible();
    await expect(page.getByText('Trading')).toBeVisible();
    await expect(page.getByText('Portfolio')).toBeVisible();
    await expect(page.getByText('Account')).toBeVisible();
  });

  test('should display badges for special items', async ({ page }) => {
    await expect(page.getByText('NEW')).toBeVisible();
    await expect(page.getByText('AI')).toBeVisible();
    await expect(page.getByText('HOT')).toBeVisible();
    await expect(page.getByText('PRO')).toBeVisible();
  });

  test('should navigate to trading page', async ({ page }) => {
    await page.getByText('Trading').click();
    await expect(page.getByText('Advanced Trading')).toBeVisible();
    await expect(page.url()).toContain('/trading');
  });

  test('should navigate to market page', async ({ page }) => {
    await page.getByText('Market').click();
    await expect(page.url()).toContain('/market');
  });

  test('should navigate to portfolio page', async ({ page }) => {
    await page.getByText('Portfolio').click();
    await expect(page.url()).toContain('/portfolio');
  });

  test('should navigate to wallet page', async ({ page }) => {
    await page.getByText('Wallet').click();
    await expect(page.url()).toContain('/wallet');
  });

  test('should navigate to orders page', async ({ page }) => {
    await page.getByText('Orders').click();
    await expect(page.url()).toContain('/orders');
  });

  test('should navigate to profile page', async ({ page }) => {
    await page.getByText('Profile').click();
    await expect(page.url()).toContain('/profile');
  });

  test('should navigate to settings page', async ({ page }) => {
    await page.getByText('Settings').click();
    await expect(page.url()).toContain('/settings');
  });

  test('should navigate to AI dashboard', async ({ page }) => {
    await page.getByText('AI Dashboard').click();
    await expect(page.url()).toContain('/ai-dashboard');
  });

  test('should navigate to AI chat', async ({ page }) => {
    await page.getByText('AI Chat').click();
    await expect(page.url()).toContain('/ai-chat');
  });

  test('should navigate to social trading', async ({ page }) => {
    await page.getByText('Social Trading').click();
    await expect(page.url()).toContain('/social-trading');
  });

  test('should navigate to advanced chart', async ({ page }) => {
    await page.getByText('Advanced Chart').click();
    await expect(page.url()).toContain('/advanced-chart');
  });

  test('should display header with market data', async ({ page }) => {
    await expect(page.getByText('BTC:')).toBeVisible();
    await expect(page.getByText('ETH:')).toBeVisible();
    await expect(page.getByText('Market Open')).toBeVisible();
  });

  test('should display portfolio value in header', async ({ page }) => {
    await expect(page.getByText('Portfolio')).toBeVisible();
    await expect(page.getByText('$50,000')).toBeVisible();
  });

  test('should display notifications', async ({ page }) => {
    const notificationButton = page.getByRole('button').filter({ hasText: '' }).first();
    await expect(notificationButton).toBeVisible();
  });

  test('should display AI assistant button', async ({ page }) => {
    const aiButton = page.getByRole('button').filter({ hasText: '' }).nth(1);
    await expect(aiButton).toBeVisible();
  });

  test('should display user avatar', async ({ page }) => {
    const avatarButton = page.getByRole('button').filter({ hasText: '' }).last();
    await expect(avatarButton).toBeVisible();
  });

  test('should open user menu when avatar is clicked', async ({ page }) => {
    const avatarButton = page.getByRole('button').filter({ hasText: '' }).last();
    await avatarButton.click();
    
    await expect(page.getByText('Profile')).toBeVisible();
    await expect(page.getByText('Settings')).toBeVisible();
    await expect(page.getByText('Logout')).toBeVisible();
  });

  test('should navigate to profile from user menu', async ({ page }) => {
    const avatarButton = page.getByRole('button').filter({ hasText: '' }).last();
    await avatarButton.click();
    
    await page.getByText('Profile').click();
    await expect(page.url()).toContain('/profile');
  });

  test('should navigate to settings from user menu', async ({ page }) => {
    const avatarButton = page.getByRole('button').filter({ hasText: '' }).last();
    await avatarButton.click();
    
    await page.getByText('Settings').click();
    await expect(page.url()).toContain('/settings');
  });

  test('should display AI assistant section in sidebar footer', async ({ page }) => {
    await expect(page.getByText('AI Assistant')).toBeVisible();
    await expect(page.getByText('Always available')).toBeVisible();
  });

  test('should display trader level in sidebar footer', async ({ page }) => {
    await expect(page.getByText('Level 5 Trader')).toBeVisible();
  });

  test('should highlight active route', async ({ page }) => {
    // Dashboard should be highlighted by default
    const dashboardItem = page.getByText('Dashboard');
    await expect(dashboardItem).toHaveClass(/Mui-selected/);
  });

  test('should toggle category expansion', async ({ page }) => {
    const mainCategory = page.getByText('Main');
    await mainCategory.click();
    
    // Dashboard should still be visible (expanded by default)
    await expect(page.getByText('Dashboard')).toBeVisible();
  });

  test('should work on mobile viewport', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Mobile menu button should be visible
    const menuButton = page.getByLabelText('open drawer');
    await expect(menuButton).toBeVisible();
    
    // Click mobile menu
    await menuButton.click();
    
    // Sidebar should be visible
    await expect(page.getByText('Dashboard')).toBeVisible();
  });

  test('should close mobile menu when item is clicked', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Open mobile menu
    const menuButton = page.getByLabelText('open drawer');
    await menuButton.click();
    
    // Click on trading
    await page.getByText('Trading').click();
    
    // Should navigate to trading page
    await expect(page.url()).toContain('/trading');
  });
});


