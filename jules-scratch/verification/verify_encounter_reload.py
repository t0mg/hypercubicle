from playwright.sync_api import sync_playwright, expect

def run_verification(playwright):
    browser = playwright.chromium.launch(headless=True)
    context = browser.new_context()
    page = context.new_page()

    try:
        # 1. Start a new game
        page.goto("http://localhost:5173/")
        new_game_button = page.get_by_role("button", name="New Game")
        expect(new_game_button).to_be_visible(timeout=60000)
        new_game_button.click()

        # 2. Trigger an encounter
        # This is a bit tricky since we can't directly control the game state.
        # We'll click the 'Choose for me' button until an encounter starts.
        # The encounter modal has a very specific structure we can wait for.
        page.get_by_role("button", name="Choose for me").click()
        page.get_by_role("button", name="Confirm").click()

        # Wait for the encounter modal to appear
        expect(page.locator("encounter-modal")).to_be_visible()

        # 3. Reload the page
        page.reload()

        # 4. Verify that the encounter modal is still visible
        # After the reload, the bug fix should ensure the modal is re-rendered.
        expect(page.locator("encounter-modal")).to_be_visible()

        # 5. Take a screenshot
        page.screenshot(path="jules-scratch/verification/verification.png")

    finally:
        browser.close()

with sync_playwright() as p:
    run_verification(p)