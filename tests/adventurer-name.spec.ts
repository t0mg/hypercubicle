import { test, expect } from '@playwright/test';

test('adventurer name is displayed correctly', async ({ page }) => {
  await page.goto('/');

  // Start a new game
  await page.click('button:has-text("New Hire")');

  // Wait for the adventurer status to be visible
  await page.waitForSelector('adventurer-status');

  // Check if the adventurer's name is displayed in the legend
  const legend = await page.textContent('adventurer-status fieldset legend');
  expect(legend).toMatch(/^(.*) \(Exec\. #\d+\)$/);
});