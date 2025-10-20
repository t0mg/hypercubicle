from playwright.sync_api import sync_playwright
import time

def run(playwright):
    browser = playwright.chromium.launch(headless=True)
    page = browser.new_page()
    page.goto("http://localhost:5173")
    page.screenshot(path="jules-scratch/verification/debug.png")
    time.sleep(5) # wait for 5 seconds
    page.click("text=New Game")
    page.click("text=Dungeon Chart")
    page.screenshot(path="jules-scratch/verification/verification.png")
    browser.close()

with sync_playwright() as playwright:
    run(playwright)
