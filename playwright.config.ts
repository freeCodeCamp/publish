import { defineConfig, devices } from "@playwright/test";

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// require('dotenv').config();

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: "./e2e",
  /* Run tests in a single file in series */
  fullyParallel: false,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: "html",
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL: "http://localhost:3000",

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: "on-first-retry",
  },

  /* Configure projects for major browsers */
  projects: [
    { name: "setup", testMatch: /.*\.setup\.ts/ },
    {
      name: "chromium",
      testIgnore: "e2e/contributor/**",
      use: {
        ...devices["Desktop Chrome"],
        storageState: "playwright/.auth/editor.json",
      },
      dependencies: ["setup"],
    },

    {
      name: "firefox",
      testIgnore: "e2e/contributor/**",
      use: {
        ...devices["Desktop Firefox"],
        storageState: "playwright/.auth/editor.json",
      },
      dependencies: ["setup"],
    },

    {
      name: "webkit",
      testIgnore: "e2e/contributor/**",
      use: {
        ...devices["Desktop Safari"],
        storageState: "playwright/.auth/editor.json",
      },
      dependencies: ["setup"],
    },

    {
      name: "chromium-contributor",
      testDir: "e2e/contributor",
      use: {
        ...devices["Desktop Chrome"],
        storageState: "playwright/.auth/contributor.json",
      },
      dependencies: ["setup"],
    },

    {
      name: "firefox-contributor",
      testDir: "e2e/contributor",
      use: {
        ...devices["Desktop Firefox"],
        storageState: "playwright/.auth/contributor.json",
      },
      dependencies: ["setup"],
    },

    {
      name: "webkit-contributor",
      testDir: "e2e/contributor",
      use: {
        ...devices["Desktop Safari"],
        storageState: "playwright/.auth/contributor.json",
      },
      dependencies: ["setup"],
    },

    /* Test against mobile viewports. */
    // {
    //   name: 'Mobile Chrome',
    //   use: { ...devices['Pixel 5'] },
    // },
    // {
    //   name: 'Mobile Safari',
    //   use: { ...devices['iPhone 12'] },
    // },

    /* Test against branded browsers. */
    // {
    //   name: 'Microsoft Edge',
    //   use: { ...devices['Desktop Edge'], channel: 'msedge' },
    // },
    // {
    //   name: 'Google Chrome',
    //   use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    // },
  ],

  /* Run your local dev server before starting the tests */
  // Using port so that playwright will wait for either 127.0.0.1 or ::1
  webServer: [
    {
      command: "npm run start -- --filter=backend",
      port: 1337,
      reuseExistingServer: !process.env.CI,
    },
    {
      command: "npm run start -- --filter=frontend",
      port: 3000,
      reuseExistingServer: !process.env.CI,
    },
  ],
});
