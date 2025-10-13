from playwright.sync_api import sync_playwright, Page, expect

def run_verification(page: Page):
    """
    This script verifies that the encounter modal appears correctly.
    """
    page.goto("http://localhost:5173/")

    # Wait for the "New Game" button to be visible, with a long timeout
    new_game_button = page.get_by_role("button", name="New Game")
    expect(new_game_button).to_be_visible(timeout=60000)
    new_game_button.click()

    # Get into a state where we can trigger an encounter
    # The ChoicePanel for loot should now be visible
    page.locator('.choice-panel-card').first.click()
    page.get_by_role("button", name="Present Offer").click()

    # The ChoicePanel for rooms should now be visible.
    # We need to select a room to trigger the encounter.
    # Let's just click the first one.
    page.locator('.choice-panel-card').first.click()
    page.get_by_role("button", name="Descend").click()

    # Give the modal time to appear
    page.wait_for_timeout(2000)

    # The encounter modal should now be visible
    expect(page.locator("encounter-modal")).to_be_visible()

    # Take a screenshot
    page.screenshot(path="jules-scratch/verification/verification.png")

def main():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        run_verification(page)
        browser.close()

if __name__ == "__main__":
    main()