import { test, expect } from '@playwright/test';

test('run game and open dungeon chart', async ({ page }) => {
  await page.goto('http://localhost:5173/');

  // Wait for the menu-screen component to be present
  await page.waitForSelector('menu-screen');

  // Click the "New Game" button
  await page.click('#new-game-button');

  // Wait for the choice panel to be visible
  await page.waitForSelector('choice-panel');

  // Select the first three room cards
  await page.click('#loot-card-container choice-card:nth-child(1)');
  await page.click('#loot-card-container choice-card:nth-child(2)');
  await page.click('#loot-card-container choice-card:nth-child(3)');

  // Click the "Begin Encounter" button
  await page.click('button:has-text("Begin Encounter")');

  // Wait for the encounter modal to appear and skip it
  await page.waitForSelector('encounter-modal');
  await page.click('#skip-button');
  await page.waitForSelector('encounter-modal', { state: 'detached' });

  // Wait for the game-stats component to be present
  await page.waitForSelector('game-stats');

  // Click the "Dungeon Chart" button
  await page.click('button:has-text("Dungeon Chart")');

  // Wait for the info-modal to be visible
  await page.waitForSelector('info-modal[data-testid="info-modal-overlay"]:not([style*="display: none"])');

  // Wait for the dungeon-chart to be present inside the modal
  await page.waitForSelector('info-modal dungeon-chart');

  // Take a screenshot of the dungeon chart modal
  await page.screenshot({ path: 'dungeon-chart.png' });

  // Expect the modal to be visible
  const modal = await page.locator('info-modal[data-testid="info-modal-overlay"]');
  await expect(modal).toBeVisible();
});
