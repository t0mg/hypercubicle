from playwright.sync_api import sync_playwright, expect

def run_verification():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        # Navigate to the application
        page.goto("http://localhost:5173/")

        # Start a new game
        page.get_by_role("button", name="New Game").click()

        # Wait for the game stats to be visible
        game_stats = page.locator('game-stats')
        expect(game_stats).to_be_visible()

        # Find the specific div that contains the "Rooms" label, then find the <p> tag within it
        # The 'div > div' selects the stat containers, and the filter narrows it to the one with "Rooms"
        rooms_stat_container = game_stats.locator("div > div").filter(has_text="Rooms")
        room_deck_size_element = rooms_stat_container.locator("p")
        expect(room_deck_size_element).to_have_text("10")

        # Take a screenshot for visual confirmation
        page.screenshot(path="jules-scratch/verification/verification.png")

        browser.close()

if __name__ == "__main__":
    run_verification()