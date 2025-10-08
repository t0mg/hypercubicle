from playwright.sync_api import sync_playwright, expect, Page

def run_verification(page: Page):
    """
    This script verifies the new Windows XP theme by taking screenshots
    of the main menu and the in-game UI.
    """
    # 1. Navigate to the application
    page.goto("http://localhost:5173")

    # 2. Verify the main menu
    # Wait for the menu-screen component to be visible
    expect(page.locator("menu-screen .window")).to_be_visible()
    # Take a screenshot of the main menu
    page.screenshot(path="jules-scratch/verification/main_menu.png")

    # 3. Start a new game
    # Find and click the "New Game" button using its ID for reliability
    page.locator("#new-game-button").click()

    # 4. Verify the in-game UI
    # Wait for the main game interface elements to be visible, using specific selectors
    expect(page.locator("adventurer-status > fieldset")).to_be_visible()
    expect(page.locator("choice-panel > fieldset")).to_be_visible()
    expect(page.locator("log-panel > fieldset")).to_be_visible()
    expect(page.locator("game-stats .status-bar")).to_be_visible()

    # Give a little time for rendering
    page.wait_for_timeout(500)

    # Take a screenshot of the in-game UI
    page.screenshot(path="jules-scratch/verification/in_game_ui.png")

def main():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        run_verification(page)
        browser.close()

if __name__ == "__main__":
    main()