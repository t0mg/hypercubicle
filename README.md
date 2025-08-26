# Rogulus

A reverse roguelike game where you act as a dungeon designer for an AI adventurer. Your goal is not to kill the adventurer, but to create a compelling, challenging, and rewarding experience that keeps them engaged.

## How to Play

Each turn, you will be presented with a selection of potential loot. You must choose up to three items to offer the adventurer. The AI adventurer, with its own hidden personality and goals, will then choose one of your offerings before proceeding to the next floor of the dungeon.

- If the dungeon is too easy, the adventurer will grow bored.
- If it's too difficult or the rewards don't match their playstyle, they will become frustrated.

Your score is based on how many floors the adventurer clears before they either fall in battle or lose interest and quit. After each run, you can enter the Workshop to spend Balance Points (BP) on unlocking new, more powerful items for future runs.

## Project Structure

This project is a single-page web application built with **TypeScript** and **native Web Components**. It uses **Tailwind CSS** for styling and **Vite** as a build tool.

-   `index.html`: The main HTML file and entry point for the application. It includes the setup for Tailwind CSS and the root element for the app.
-   `main.ts`: The script that initializes the `GameEngine` and manages the overall application flow, state, and renders different components based on the current `gamePhase`.
-   `game/engine.ts`: The heart of the game. This class manages the entire `GameState`, including all core game logic: starting new runs, processing loot offers, simulating adventurer choices, running encounters, and handling the game over state.
-   `types.ts`: Contains all the core TypeScript type and interface definitions used across the application (e.g., `GameState`, `Adventurer`, `LootChoice`).
-   `game/items.json`: A JSON file containing the definitions for all loot items available in the game, including their stats, rarity, and cost.
-   `vite.config.ts`: Configuration file for the Vite development server and build tool.
-   `tsconfig.json`: TypeScript compiler configuration.

### `components/`

This directory contains all the reusable Web Components that make up the UI. Each component is defined in its own file and registered as a custom element.

-   `AdventurerStatus.ts`: Displays the adventurer's current stats, including HP, interest, power, and inventory.
-   `DebugEncounterPanel.ts`: A development tool that allows for manually setting encounter parameters like base damage and difficulty factor to test game balance.
-   `DebugLog.ts`: A panel that shows a running log of game events and the adventurer's decision-making process, along with their personality traits.
-   `FeedbackPanel.ts`: A simple component to display messages and feedback from the adventurer.
-   `GameOverScreen.ts`: A modal screen that appears when a run ends.
-   `GameStats.ts`: Displays high-level game information like current BP, run number, and floor number.
-   `LoadingIndicator.ts`: A spinner used during asynchronous operations, like when the AI is "thinking".
-   `LootCard.ts`: Renders a single piece of loot, showing its stats and rarity.
-   `LootChoicePanel.ts`: The main interface for the player to select which loot items to offer to the adventurer.
-   `Workshop.ts`: The screen shown between runs where the player can spend BP to unlock new items.

## Running the Project

To run the project locally, you need to have Node.js and npm installed.

1.  **Install dependencies:**
    ```bash
    npm install
    ```

2.  **Run the development server:**
    ```bash
    npm run dev
    ```

This will start a Vite development server and open the application in your default browser.