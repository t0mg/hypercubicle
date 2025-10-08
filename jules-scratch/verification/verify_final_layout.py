from playwright.sync_api import sync_playwright, expect, Page

def run_verification(page: Page):
    """
    This script verifies the final Windows XP theme by taking a screenshot
    of the in-game UI with the three-window layout.
    """
    # 1. Navigate to the application
    page.goto("http://localhost:5173")

    # 2. Start a new game
    expect(page.locator("menu-screen .window")).to_be_visible()
    page.locator("#new-game-button").click()

    # 3. Verify the in-game UI
    # Wait for the main grid container to ensure the game screen is loaded
    expect(page.locator(".grid.grid-cols-1.lg\\:grid-cols-3")).to_be_visible()

    # Verify that the three main windows are present
    expect(page.locator(".window")).to_have_count(3)

    # Give a little time for rendering
    page.wait_for_timeout(1000)

    # Take a screenshot of the in-game UI
    page.screenshot(path="jules-scratch/verification/final_layout.png")

def main():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        run_verification(page)
        browser.close()

if __name__ == "__main__":
    main()