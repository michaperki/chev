import { test, expect } from '@playwright/test';

// Utility function to simulate login via wallet
async function loginViaWallet(page, walletAddress) {
  // Simulate the wallet login by setting cookies or interacting with the login flow
  await page.addInitScript(({ walletAddress }) => {
    document.cookie = `wallet_address=${walletAddress}; path=/;`;
  }, { walletAddress });
}

// Test scenario: User 1 joins the matchmaking queue
test.describe('Matchmaking Flow', () => {
  test('User 1 joins the matchmaking queue', async ({ page }) => {
    // Log in as User 1 with wallet address
    const user1WalletAddress = '0xUser1Address';
    await loginViaWallet(page, user1WalletAddress);

    // Navigate to the dashboard
    await page.goto('/dashboard');

    // Set wager amount and join queue
    await page.fill('input[placeholder="Enter wager amount"]', '10'); // Set wager
    await page.click('button:has-text("Join Queue")'); // Join queue

    // Expect matchmaking status to be updated
    await expect(page.locator('text=Added to queue, waiting for a match...')).toBeVisible();
  });

  // Test scenario: User 2 joins the matchmaking queue and matches with User 1
  test('User 2 joins the matchmaking queue and matches with User 1', async ({ page }) => {
    // Log in as User 2 with wallet address
    const user2WalletAddress = '0xUser2Address';
    await loginViaWallet(page, user2WalletAddress);

    // Navigate to the dashboard
    await page.goto('/dashboard');

    // Set wager amount and join queue
    await page.fill('input[placeholder="Enter wager amount"]', '10'); // Set wager
    await page.click('button:has-text("Join Queue")'); // Join queue

    // Expect match found and wager confirmation
    await expect(page.locator('text=Match found, awaiting wager confirmation')).toBeVisible();
  });

  // Test scenario: Confirm wager for both users and start the game
  test('Both users confirm wager and game starts', async ({ page }) => {
    // Log in as User 1
    const user1WalletAddress = '0xUser1Address';
    await loginViaWallet(page, user1WalletAddress);

    // Navigate to dashboard and confirm wager
    await page.goto('/dashboard');
    await expect(page.locator('text=Match found, awaiting wager confirmation')).toBeVisible();
    await page.click('button:has-text("Confirm Wager")'); // Confirm wager for User 1

    // Log in as User 2 in a new browser context to simulate a different user session
    const user2Context = await browser.newContext();
    const user2Page = await user2Context.newPage();
    const user2WalletAddress = '0xUser2Address';
    await loginViaWallet(user2Page, user2WalletAddress);
    
    await user2Page.goto('/dashboard');
    await expect(user2Page.locator('text=Match found, awaiting wager confirmation')).toBeVisible();
    await user2Page.click('button:has-text("Confirm Wager")'); // Confirm wager for User 2

    // Expect the game to start after both users confirm the wager
    await expect(page).toHaveURL(/\/game\/\w+/);
    await expect(user2Page).toHaveURL(/\/game\/\w+/);
  });
});

