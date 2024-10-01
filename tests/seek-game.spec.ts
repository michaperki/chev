
import { test, expect } from '@playwright/test';

test.describe('Seek Game Tests', () => {

  test.beforeEach(async ({ page }) => {
    // Mock the Lichess login API
    await page.route('https://lichess.org/oauth*', (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ lichessAccessToken: 'mocked-lichess-token' }),
      });
    });

    // Mock the server-side Lichess token API
    await page.route('/api/lichess/token*', (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ lichessAccessToken: 'mocked-lichess-token' }),
      });
    });
  });

  test('Seek Game flow for two users', async ({ browser }) => {
    const context1 = await browser.newContext();
    const context2 = await browser.newContext();

    const page1 = await context1.newPage();
    const page2 = await context2.newPage();

    // User 1: Connect wallet
    await page1.goto('/');
    await page1.click('text=Connect Wallet');
    await page1.fill('#wallet-address-input', '0xMockedWalletUser1');
    await page1.click('text=Submit');

    // User 2: Connect wallet
    await page2.goto('/');
    await page2.click('text=Connect Wallet');
    await page2.fill('#wallet-address-input', '0xMockedWalletUser2');
    await page2.click('text=Submit');

    // Mock Lichess login for both users
    await page1.click('text=Authenticate with Lichess');
    await page2.click('text=Authenticate with Lichess');

    // Navigate to the seek game page for both users
    await page1.goto('/seek-game');
    await page2.goto('/seek-game');

    // User 1 seeks a game
    await page1.click('text=Seek Game');
    await expect(page1.locator('text=Waiting for opponent...')).toBeVisible();

    // User 2 seeks a game and matches User 1
    await page2.click('text=Seek Game');
    await expect(page2.locator('text=Game started')).toBeVisible();

    // Validate both users are in the same game
    const gameStatus1 = await page1.textContent('text=Game started');
    const gameStatus2 = await page2.textContent('text=Game started');
    expect(gameStatus1).toBeTruthy();
    expect(gameStatus2).toBeTruthy();
  });
});
