const { chromium } = require('@playwright/test');

async function globalSetup(config) {
  console.log('Setting up global test environment...');
  
  // Start browser for setup
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  try {
    // Wait for the application to be ready
    await page.goto('http://localhost:3000');
    await page.waitForLoadState('networkidle');
    
    // Perform any global setup tasks
    console.log('Application is ready for testing');
    
  } catch (error) {
    console.error('Global setup failed:', error);
    throw error;
  } finally {
    await browser.close();
  }
  
  console.log('Global setup completed');
}

module.exports = globalSetup;


