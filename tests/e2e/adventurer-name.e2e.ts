import { test, expect } from '@playwright/test';

test('adventurer name is displayed correctly', async ({ page }) => {
  await page.goto('http://localhost:5173/');

  // Start a new game
  await page.click('button:has-text("New Hire")');

  // Expect the adventurer status to be visible
  const adventurerStatus = await page.locator('adventurer-status');
  await expect(adventurerStatus).toBeVisible();

  // Expect the adventurer name to be one of the possible names
  const adventurerName = await adventurerStatus.locator('.font-bold').innerText();
  const possibleNames = ['Chad', 'Brad', 'Kyle'];
  expect(possibleNames).toContain(adventurerName);
});
