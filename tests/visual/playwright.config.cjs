const { defineConfig } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './',
  use: {
    baseURL: 'http://127.0.0.1:4200',
    viewport: { width: 1280, height: 960 },
    colorScheme: 'dark'
  },
  webServer: {
    command: 'yarn start -- --host 127.0.0.1 --port 4200',
    url: 'http://127.0.0.1:4200',
    reuseExistingServer: true,
    timeout: 300000
  }
});
