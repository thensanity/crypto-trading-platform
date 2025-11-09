const { test, expect } = require('@playwright/test');

test.describe('Trading Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/trading');
  });

  test('should display trading page title', async ({ page }) => {
    await expect(page.getByText('Advanced Trading')).toBeVisible();
  });

  test('should display price chart', async ({ page }) => {
    await expect(page.getByText('BTC/USDT')).toBeVisible();
    await expect(page.getByText('$43,250')).toBeVisible();
  });

  test('should display trading panel', async ({ page }) => {
    await expect(page.getByText('Place Order')).toBeVisible();
    await expect(page.getByText('Spot')).toBeVisible();
    await expect(page.getByText('Futures')).toBeVisible();
  });

  test('should display buy and sell buttons', async ({ page }) => {
    await expect(page.getByRole('button', { name: 'Buy' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Sell' })).toBeVisible();
  });

  test('should display order type selector', async ({ page }) => {
    await expect(page.getByText('Order Type')).toBeVisible();
    await expect(page.getByText('Market')).toBeVisible();
    await expect(page.getByText('Limit')).toBeVisible();
    await expect(page.getByText('Stop')).toBeVisible();
    await expect(page.getByText('Stop Limit')).toBeVisible();
  });

  test('should display amount input', async ({ page }) => {
    await expect(page.getByLabel('Amount')).toBeVisible();
  });

  test('should display price input for limit orders', async ({ page }) => {
    // Select limit order type
    await page.getByText('Order Type').click();
    await page.getByText('Limit').click();
    
    await expect(page.getByLabel('Price')).toBeVisible();
  });

  test('should display stop loss and take profit inputs', async ({ page }) => {
    await expect(page.getByLabel('Stop Loss')).toBeVisible();
    await expect(page.getByLabel('Take Profit')).toBeVisible();
  });

  test('should display post only switch', async ({ page }) => {
    await expect(page.getByText('Post Only')).toBeVisible();
  });

  test('should display order book', async ({ page }) => {
    await expect(page.getByText('Order Book')).toBeVisible();
    await expect(page.getByText('Price')).toBeVisible();
    await expect(page.getByText('Amount')).toBeVisible();
    await expect(page.getByText('Total')).toBeVisible();
  });

  test('should display recent trades', async ({ page }) => {
    await expect(page.getByText('Recent Trades')).toBeVisible();
    await expect(page.getByText('Time')).toBeVisible();
    await expect(page.getByText('Price')).toBeVisible();
    await expect(page.getByText('Amount')).toBeVisible();
  });

  test('should switch between spot and futures tabs', async ({ page }) => {
    await page.getByText('Futures').click();
    await expect(page.getByText('Leverage')).toBeVisible();
  });

  test('should toggle between buy and sell', async ({ page }) => {
    const buyButton = page.getByRole('button', { name: 'Buy' });
    const sellButton = page.getByRole('button', { name: 'Sell' });
    
    await expect(buyButton).toHaveClass(/MuiButton-contained/);
    await expect(sellButton).toHaveClass(/MuiButton-outlined/);
    
    await sellButton.click();
    await expect(sellButton).toHaveClass(/MuiButton-contained/);
    await expect(buyButton).toHaveClass(/MuiButton-outlined/);
  });

  test('should place a market order', async ({ page }) => {
    // Fill in amount
    await page.getByLabel('Amount').fill('0.1');
    
    // Click buy button
    await page.getByRole('button', { name: 'Buy BTC' }).click();
    
    // Should show success message
    await expect(page.getByText('Order placed successfully!')).toBeVisible();
  });

  test('should place a limit order', async ({ page }) => {
    // Select limit order type
    await page.getByText('Order Type').click();
    await page.getByText('Limit').click();
    
    // Fill in amount and price
    await page.getByLabel('Amount').fill('0.1');
    await page.getByLabel('Price').fill('40000');
    
    // Click buy button
    await page.getByRole('button', { name: 'Buy BTC' }).click();
    
    // Should show success message
    await expect(page.getByText('Order placed successfully!')).toBeVisible();
  });

  test('should show leverage input for futures', async ({ page }) => {
    await page.getByText('Futures').click();
    await expect(page.getByLabel('Leverage')).toBeVisible();
  });

  test('should display price change indicators', async ({ page }) => {
    await expect(page.getByText('+2.50%')).toBeVisible();
  });

  test('should refresh order book', async ({ page }) => {
    const refreshButton = page.getByRole('button').first();
    await refreshButton.click();
  });

  test('should refresh recent trades', async ({ page }) => {
    const refreshButtons = page.getByRole('button');
    const tradesRefreshButton = refreshButtons.nth(1);
    await tradesRefreshButton.click();
  });

  test('should display current price in order book', async ({ page }) => {
    await expect(page.getByText('$43,250')).toBeVisible();
  });

  test('should show order book with asks and bids', async ({ page }) => {
    // Check that order book has data
    const priceCells = page.locator('td').filter({ hasText: '$' });
    await expect(priceCells.first()).toBeVisible();
  });

  test('should show recent trades with buy/sell indicators', async ({ page }) => {
    // Check that recent trades have data
    const timeCells = page.locator('td').filter({ hasText: ':' });
    await expect(timeCells.first()).toBeVisible();
  });

  test('should validate required fields for market order', async ({ page }) => {
    // Try to submit without amount
    await page.getByRole('button', { name: 'Buy BTC' }).click();
    
    // Should show validation error
    await expect(page.getByText('Please fill in all required fields')).toBeVisible();
  });

  test('should validate required fields for limit order', async ({ page }) => {
    // Select limit order type
    await page.getByText('Order Type').click();
    await page.getByText('Limit').click();
    
    // Fill only amount, not price
    await page.getByLabel('Amount').fill('0.1');
    
    // Try to submit
    await page.getByRole('button', { name: 'Buy BTC' }).click();
    
    // Should show validation error
    await expect(page.getByText('Please fill in all required fields')).toBeVisible();
  });
});


