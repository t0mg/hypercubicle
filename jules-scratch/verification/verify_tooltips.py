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
        await page.tap('[data-tooltip-key="adventurer_health"]')
        await page.wait_for_timeout(500) # allow for animation
        await expect(page.locator("tooltip-box")).to_be_visible()
        await page.screenshot(path="jules-scratch/verification/mobile.png")
        await browser.close()

if __name__ == "__main__":
    asyncio.run(main())
