import 'dotenv/config';
import { defineConfig, devices } from '@playwright/test';
import { defineBddConfig } from 'playwright-bdd';
import { getRuntimeContext, readEnvConfig } from './src/core/runtime';

const { browserLocale } = getRuntimeContext();
const { baseURL } = readEnvConfig();

const testDir = defineBddConfig({
  features: 'tests/features/**/*.feature',
  // the fixtures file must be listed so playwright-bdd can detect the custom `test` instance
  steps: ['tests/steps/**/*.ts', 'src/fixtures/index.ts'],
});

export default defineConfig({
  testDir,
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 4 : undefined,
  reporter: [['html', { open: 'never' }], ['junit', { outputFile: 'junit.xml' }]],
  use: {
    baseURL,
    locale: browserLocale, // same LOCALE value that picks the label file
    trace: 'on',
    screenshot: 'only-on-failure',
    "video":"on"
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
});
