from playwright.sync_api import sync_playwright, Page, expect

def run_verification(page: Page):
    """
    This script verifies that the encounter modal appears correctly for any room type.
    """
    page.goto("http://localhost:5173/")

    # 1. Start a new game
    new_game_button = page.get_by_role("button", name="New Hire")
    expect(new_game_button).to_be_visible(timeout=60000)
    new_game_button.click()

    # 2. Trigger an encounter by selecting the first available room
    first_room_card = page.locator(".choice-panel-card").first
    expect(first_room_card).to_be_visible(timeout=10000)
    first_room_card.click()

    descend_button = page.get_by_role("button", name="Descend")
    expect(descend_button).to_be_visible()
    descend_button.click()

    # 3. Verify the room reveal in the modal
    encounter_modal = page.locator("encounter-modal")
    expect(encounter_modal).to_be_visible(timeout=5000)

    # Take a screenshot of the initial room reveal
    page.screenshot(path="jules-scratch/verification/verification_reveal.png")

    # 4. Continue to the next step
    continue_button_1 = encounter_modal.get_by_role("button", name="Continue")
    expect(continue_button_1).to_be_visible()
    continue_button_1.click()

    # Give the UI time to update
    page.wait_for_timeout(1500)

    # 5. Check if we are in a battle or if the modal has updated for trap/healing
    progress_bar = encounter_modal.locator(".progress-bar")

    try:
        # Flow 1: Battle
        expect(progress_bar).to_be_visible(timeout=1000)
        expect(encounter_modal.locator(".status-bar")).to_be_visible()
        page.screenshot(path="jules-scratch/verification/verification_battle.png")
    except Exception:
        # Flow 2: Trap/Healing
        continue_button_2 = encounter_modal.get_by_role("button", name="Continue")
        expect(continue_button_2).to_be_visible()
        continue_button_2.click()
        expect(encounter_modal).not_to_be_visible(timeout=5000)

def main():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        run_verification(page)
        browser.close()

if __name__ == "__main__":
    main()