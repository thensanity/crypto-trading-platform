async function globalTeardown(config) {
  console.log('Cleaning up global test environment...');
  
  // Perform any global cleanup tasks
  // For example, clean up test data, close connections, etc.
  
  console.log('Global teardown completed');
}

module.exports = globalTeardown;


