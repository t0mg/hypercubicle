import asyncio
from playwright.async_api import async_playwright, expect

async def main():
    async with async_playwright() as p:
        # Desktop
        browser = await p.chromium.launch()
        page = await browser.new_page()
        await page.goto("http://localhost:5173")
        await page.get_by_role("button", name="New Game").click()
        await expect(page.locator("adventurer-status")).to_be_visible()
        await page.hover('[data-tooltip-key="adventurer_health"]')
        await page.wait_for_timeout(500) # allow for animation
        await expect(page.locator("tooltip-box")).to_be_visible()
        await page.screenshot(path="jules-scratch/verification/desktop.png")
        await browser.close()

        # Mobile
        browser = await p.chromium.launch()
        page = await browser.new_page(**p.devices["Pixel 5"])
        await page.goto("http://localhost:5173")
        await page.get_by_role("button", name="New Game").click()
        await expect(page.locator("adventurer-status")).to_be_visible()

        health_element = page.locator('[data-tooltip-key="adventurer_health"]')
        tooltip_icon = health_element.locator('.tooltip-icon')

        # Test opening the tooltip
        await expect(tooltip_icon).to_be_visible()
        await tooltip_icon.click()

        await page.wait_for_timeout(500) # allow for animation
        tooltip_box = page.locator("tooltip-box")
        await expect(tooltip_box).to_be_visible()
        await expect(tooltip_box).to_have_class("show")
        await page.screenshot(path="jules-scratch/verification/mobile.png")

        # Test closing the tooltip via close button
        # Playwright pierces shadow DOM by default, so we can locate the button this way
        close_button = tooltip_box.locator(".close-button")
        await close_button.click()
        await page.wait_for_timeout(500) # allow for animation
        await expect(tooltip_box).not_to_be_visible()

        # Re-open to test closing by clicking the backdrop
        await tooltip_icon.click()
        await page.wait_for_timeout(500)
        await expect(tooltip_box).to_be_visible()

        # Click on the backdrop (the tooltip-box host element itself)
        # We click at a corner to ensure we're not clicking the content container
        await tooltip_box.click(position={'x': 5, 'y': 5})
        await page.wait_for_timeout(500)
        await expect(tooltip_box).not_to_be_visible()

        await browser.close()

if __name__ == "__main__":
    asyncio.run(main())