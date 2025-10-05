import json
from playwright.sync_api import sync_playwright, Page, expect

def run(page: Page):
    page.goto("http://localhost:5173/")

    # Start a new game
    page.locator("#new-game-button").click()

    # Wait for the main game UI to load by waiting for the adventurer status component
    adventurer_status = page.locator('adventurer-status')
    expect(adventurer_status).to_be_visible()

    # Take a screenshot of the initial state
    adventurer_status.screenshot(path="jules-scratch/verification/pulse-before.png")

    # Select the first three available room cards to enable the encounter button.
    cards = page.locator("#loot-card-container choice-card")
    expect(cards.first).to_be_visible()
    for i in range(min(3, cards.count())):
        cards.nth(i).click()

    # Click the button to begin the encounter
    page.locator("#present-offer-button").click()

    # Wait for the health and other stats to update after the encounter
    # We can assert that the health text has changed from the initial 100/100
    expect(adventurer_status.locator('#hp-text')).not_to_have_text('100 / 100')

    # Wait a moment for the pulse animation to be visually apparent
    page.wait_for_timeout(500)

    # Take a screenshot of the final state to show the updated values
    adventurer_status.screenshot(path="jules-scratch/verification/pulse-after.png")

def main():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        run(page)
        browser.close()

if __name__ == "__main__":
    main()