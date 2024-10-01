import { test, expect, Page } from '@playwright/test';

// Helper function to mock wallet connection
async function mockWalletConnection(page: Page, walletAddress: string) {
  await page.evaluate((address) => {
    localStorage.setItem('walletAddress', address);
    // Dispatch an event to simulate wallet connection
    window.dispatchEvent(new Event('walletConnected'));
  }, walletAddress);
}

// Helper function to mock Lichess authentication
async function mockLichessAuth(page: Page) {
  await page.evaluate(() => {
    localStorage.setItem('lichessToken', 'mock-lichess-token');
    // Dispatch an event to simulate Lichess authentication
    window.dispatchEvent(new Event('lichessAuthenticated'));
  });
}

test.describe('Seek Game Flow', () => {
  test('Two users can seek and match a game', async ({ browser }) => {
    // Create two browser contexts for two users
    const userContext1 = await browser.newContext();
    const userContext2 = await browser.newContext();

    const page1 = await userContext1.newPage();
    const page2 = await userContext2.newPage();

    // Mock wallet connection and Lichess auth for both users
    await mockWalletConnection(page1, '0xUser1WalletAddress');
    await mockLichessAuth(page1);
    await mockWalletConnection(page2, '0xUser2WalletAddress');
    await mockLichessAuth(page2);

    // Navigate both users to the seek game page
    await page1.goto('/seek-game');
    await page2.goto('/seek-game');

    // User 1 seeks a game
    await page1.click('button:text("Seek Game")');
    await expect(page1.locator('text=Waiting for opponent')).toBeVisible();

    // User 2 seeks a game
    await page2.click('button:text("Seek Game")');

    // Check that both users are matched
    await expect(page1.locator('text=Game started')).toBeVisible();
    await expect(page2.locator('text=Game started')).toBeVisible();

    // You can add more assertions here to check game state, player information, etc.

    // Close the browser contexts
    await userContext1.close();
    await userContext2.close();
  });
});
