# Rogue Steward

[![Deploy to GitHub Pages](https://github.com/t0mg/rogue-steward/actions/workflows/deploy.yml/badge.svg)](https://github.com/t0mg/rogue-steward/actions/workflows/deploy.yml)

## What the project is

Rogue Steward is a corporate strategy adventure in which your goal is to keep your executive motivated for as many days as possible (even if that means depleting their stamina early).

## What the project is under the hood

This is a meta rogue-lite experiment in which you play a dungeon master trying to nudge the "player" (the Executive) towards your meta goal of making them enjoy their experience. For this you can influence the loot they find and the encounters they make, by offering them choices (the former face up, the latter blind). As the game progresses you'll be able to purchase more loot and encounter options to choose from.

The meta element is because you are rewarded with unlockable features (perks) if your player goes through a certain number of days without retiring. When they do you lose most of your stuff but you keep your unlocked perks. Therefore the Executive has runs (work days) but the player also does with successive Executive hires to try to unlock all perks and beat their max number of work days.

## What the hood above the project is

This project is an attempt at using jules.google.com to prototype a one-line idea (a sort of pun on the recursive difficulty of balancing game difficulty) that I had written down somewhere and zero time to build from scratch myself.

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

## Credits

Styling curtesy of [XP.css ](https://botoxparty.github.io/XP.css)

"Bliss" inspired background image was is custom made from these sources
- https://www.pexels.com/photo/grass-hill-under-a-clear-blue-sky-16452613/
- https://www.pexels.com/photo/blue-skies-53594/