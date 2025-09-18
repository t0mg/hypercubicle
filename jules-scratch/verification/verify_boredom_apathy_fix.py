from playwright.sync_api import sync_playwright, Page, expect

def run_test(page: Page):
    page.goto("http://localhost:5173/")

    # Start a new game
    new_game_button = page.get_by_role("button", name="New Game")
    if new_game_button.is_visible():
        new_game_button.click()
    else:
        page.get_by_role("button", name="Continue").click()


    # Loop until the run is over
    for i in range(15):
        print(f"Loop {i+1}")

        # Check if the run is over
        run_over_locator = page.locator("h2.font-title")
        if run_over_locator.is_visible() and "run is over" in run_over_locator.text_content().lower():
            print("Run is over.")
            break

        # Room selection phase
        begin_encounter_button = page.get_by_role("button", name="Begin Encounter")
        if begin_encounter_button.is_visible():
            print("Room selection phase")
            room_cards = page.locator("choice-card").all()

            # Prioritize healing rooms
            healing_rooms = [card for card in room_cards if "Healing" in card.text_content()]

            selected_rooms = []
            if len(healing_rooms) > 0:
                selected_rooms.extend(healing_rooms[:3])

            # Fill the rest with the easiest rooms
            if len(selected_rooms) < 3:
                non_healing_rooms = [card for card in room_cards if card not in healing_rooms]
                # A simple heuristic for 'easy': lower power level, if available in the text
                non_healing_rooms.sort(key=lambda card: int(card.text_content().split("Pwr:")[1].split()[0]) if "Pwr:" in card.text_content() else 999)
                selected_rooms.extend(non_healing_rooms[:3 - len(selected_rooms)])

            for room in selected_rooms:
                room.click()

            begin_encounter_button.click()
            continue

        # Loot selection phase
        present_offer_button = page.get_by_role("button", name="Present Offer")
        if present_offer_button.is_visible():
            print("Loot selection phase")
            loot_cards = page.locator("choice-card")
            expect(loot_cards.first).to_be_visible()
            for j in range(2):
                loot_cards.nth(j).click()
            present_offer_button.click()
            continue

    # Take a screenshot before the final assertion to debug
    page.screenshot(path="jules-scratch/verification/debug_screenshot.png")

    # Take a screenshot before the final assertion to debug
    page.screenshot(path="jules-scratch/verification/debug_screenshot.png")

    # Verify that the retirement message is shown immediately
    expect(page.locator("h3:has-text('\"I have seen enough.\"')")).to_be_visible(timeout=10000)

    # Take a screenshot
    page.screenshot(path="jules-scratch/verification/verification.png")

def main():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        run_test(page)
        browser.close()

if __name__ == "__main__":
    main()
