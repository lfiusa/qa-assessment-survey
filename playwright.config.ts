import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  reporter: 'list',
  use: {
    baseURL: 'http://localhost:5173',
    // Adicione esta linha abaixo:
    testIdAttribute: 'data-test-id', 
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
