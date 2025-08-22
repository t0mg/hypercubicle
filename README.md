# Rogsimum (working title)

A reverse roguelike game where you act as a dungeon designer for an AI adventurer. Your goal is not to kill the adventurer, but to create a compelling, challenging, and rewarding experience that keeps them engaged.

## How to Play

Each turn, you will be presented with a selection of potential loot. You must choose up to three items to offer the adventurer. The AI adventurer, with its own hidden personality and goals, will then choose one of your offerings before proceeding to the next floor of the dungeon.

- If the dungeon is too easy, the adventurer will grow bored.
- If it's too difficult or the rewards don't match their playstyle, they will become frustrated.

Your score is based on how many floors the adventurer clears before they either fall in battle or lose interest and quit. After each run, you can enter the Workshop to spend Balance Points (BP) on unlocking new, more powerful items for future runs.

## Project Structure

This project is a single-page web application built with React, TypeScript, and Tailwind CSS.

-   `index.html`: The main HTML file and entry point for the application. It includes the setup for Tailwind CSS and the root element for the React app.
-   `index.tsx`: The script that mounts the main React `App` component to the DOM.
-   `App.tsx`: The root React component. It manages the overall application flow, state, and renders different views based on the current `gamePhase`.
-   `types.ts`: Contains all the core TypeScript type and interface definitions used across the application (e.g., `GameState`, `Adventurer`, `LootChoice`).
-   `metadata.json`: Provides metadata about the application for the hosting environment.

### `components/`

This directory contains all the reusable React components that make up the UI.

-   `AdventurerStatus.tsx`: Displays the adventurer's current stats, including HP, interest, power, and inventory.
-   `DebugEncounterPanel.tsx`: A development tool that replaces the standard difficulty selection. It allows for manually setting encounter parameters like base damage and difficulty factor to test game balance.
-   `DebugLog.tsx`: A panel that shows a running log of game events and the adventurer's decision-making process, along with their personality traits.
-   `FeedbackPanel.tsx`: A simple component to display messages and feedback from the adventurer.
-   `GameOverScreen.tsx`: A modal screen that appears when a run ends.
-   `GameStats.tsx`: Displays high-level game information like current BP, run number, and floor number.
-   `LoadingIndicator.tsx`: A spinner used during asynchronous operations, like when the AI is "thinking".
-   `LootCard.tsx`: Renders a single piece of loot, showing its stats and rarity.
-   `LootChoicePanel.tsx`: The main interface for the player to select which loot items to offer to the adventurer.
-   `Workshop.tsx`: The screen shown between runs where the player can spend BP to unlock new items.

### `hooks/`

This directory contains custom React hooks that encapsulate business logic.

-   `useGameEngine.ts`: The heart of the game. This massive hook manages the entire `GameState`, including all core game logic: starting new runs, processing loot offers, simulating adventurer choices, running encounters, and handling the game over state.

### `game/`

This directory holds static game data files.

-   `items.json`: A JSON file containing the definitions for all loot items available in the game, including their stats, rarity, and cost.
