# Rogue Steward

[![Deploy to GitHub Pages](https://github.com/t0mg/rogue-steward/actions/workflows/deploy.yml/badge.svg)](https://github.com/t0mg/rogue-steward/actions/workflows/deploy.yml)

A reverse roguelike game where you act as a dungeon designer for an AI adventurer. Your goal is not to kill the adventurer, but to create a compelling, challenging, and rewarding experience that keeps them engaged.

## How to Play

Each turn, you will be presented with a selection of potential loot. You must choose up to three items to offer the adventurer. The AI adventurer, with its own hidden traits and ever-changing flow state, will then choose one of your offerings before proceeding to the next room of the dungeon.

- If the dungeon is too easy, the adventurer will grow bored.
- If it's too difficult or the rewards don't match their playstyle, they will become frustrated and may quit.

Your goal is to keep the adventurer engaged for as long as possible. Reaching higher runs, and perhaps even winning, will unlock new, more powerful items and rooms for future runs, expanding your strategic options.

## Project Structure

This project is a single-page web application built with **TypeScript** and **native Web Components**. It uses **Tailwind CSS** for styling and **Vite** as a build tool.

-   `index.html`: The main HTML file and entry point for the application. It includes the setup for Tailwind CSS and the root element for the app.
-   `main.ts`: The script that initializes the `GameEngine` and manages the overall application flow, state, and renders different components based on the current `gamePhase`.
-   `types.ts`: Contains all the core TypeScript type and interface definitions used across the application (e.g., `GameState`, `Adventurer`, `LootChoice`).
-   `vite.config.ts`: Configuration file for the Vite development server and build tool.
-   `tsconfig.json`: TypeScript compiler configuration.

### `game/`

This directory contains the core game logic and state management.

-   `engine.ts`: The heart of the game. This class manages the entire `GameState`, including all core game logic: starting new runs, processing loot offers, simulating adventurer choices, running encounters, and handling the game over state.
-   `adventurer.ts`: Defines the `Adventurer` class, which represents the AI-controlled hero, including their stats, traits, inventory, and state.
-   `ai.ts`: Contains the logic that governs the adventurer's decision-making process, such as choosing which loot to take or how to act in battle.
-   `meta.ts`: Manages meta-progression, such as unlocking new features and tracking statistics across multiple runs.
-   `storage.ts`: Handles saving and loading game data to and from the browser's local storage.

### `public/`

This directory contains static assets that are served directly to the browser.

-   `public/game/items.json`: A JSON file containing the definitions for all loot items available in the game.
-   `public/game/rooms.json`: A JSON file containing the definitions for all rooms (e.g., encounters, traps, healing rooms) that can appear in the dungeon.

### `components/`

This directory contains all the reusable Web Components that make up the UI. Each component is defined in its own file and registered as a custom element.

-   `AdventurerStatus.ts`: Displays the adventurer's current stats, including HP, interest, power, and inventory.
-   `FeedbackPanel.ts`: A simple component to display messages and feedback from the adventurer.
-   `RunEndedScreen.ts`: A modal screen that appears when a run ends.
-   `GameStats.ts`: Displays high-level game information like current BP, run number, and room number.
-   `LoadingIndicator.ts`: A spinner used during asynchronous operations, like when the AI is "thinking".
-   `Card.ts`: Renders a single card (item or room).
-   `ChoicePanel.ts`: The main interface for the player to select which items or rooms to offer to the adventurer.
-   `Workshop.ts`: The screen shown between runs where the player can spend BP to unlock new items.
-   `MenuScreen.ts`: The main menu screen.
-   `LogPanel.ts`: A panel that shows a running log of game events.

### `tools/`

This directory contains command-line tools for development and analysis.

-   `simulate.ts`: A script to run the game in a headless mode for a specified number of runs. This is useful for game balancing and tuning.
-   `metrics.ts`: A helper module for the simulation tool that collects and reports various metrics about the simulation runs.

## Testing

This project uses [Vitest](https://vitest.dev/) for unit and integration testing.

To run the tests, use the following command:

```bash
npm test
```

## Simulation Tool

This project includes a command-line simulation tool to help with game balancing and tuning. The tool runs the game in a headless mode for a specified number of runs with a given seed and will eventually output metrics about the simulation.

To run the simulation, use the following command:

```bash
npm run simulate -- [options] [runs]
```

-   `[runs]` (optional): The number of runs to simulate. Defaults to 10.
-   `--seed=<number>` (optional): A number to seed the random number generator for reproducible runs. If not provided, a random seed will be used.
-   `--verbose` (optional): By default, the simulation runs in silent mode. Use this flag to print detailed logs to the console.

Example:
```bash
npm run simulate -- --seed=123 100
```

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