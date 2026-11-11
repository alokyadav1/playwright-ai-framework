import 'dotenv/config';
import { defineConfig, devices } from '@playwright/test';
import { defineBddConfig } from 'playwright-bdd';
import { getRuntimeContext, readEnvConfig } from './src/core/runtime.js';

const { browserLocale } = getRuntimeContext();
const { baseURL } = readEnvConfig();

const testDir = defineBddConfig({
  features: 'tests/features/**/*.feature',
  // the fixtures file must be listed so playwright-bdd can detect the custom `test` instance
  steps: ['tests/steps/**/*.ts', 'src/fixtures/index.ts'],
});

export default defineConfig({
  testDir,
  fullyParallel: false,
  forbidOnly: true,
  retries: 0,
  workers: 1,
  reporter: [['html', { open: 'never' }], ['junit', { outputFile: 'test-results/junit.xml' }]],
  use: {
    baseURL,
    launchOptions: { executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE },
    locale: browserLocale, // same LOCALE value that picks the label file
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'off',
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
});
