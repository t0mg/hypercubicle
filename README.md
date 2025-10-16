# Hypercubicle

[![Deploy to GitHub Pages](https://github.com/t0mg/hypercubicle/actions/workflows/deploy.yml/badge.svg)](https://github.com/t0mg/hypercubicle/actions/workflows/deploy.yml)

## [Play Hypercubicle](https://t0mg.github.io/hypercubicle)

## Harsh but unfair

Keep your Executive engaged by giving them challenges and rewards. If they give up, hire another and get better.

## I still don't get it 

(spoilers tho)

This is a meta rogue-lite experimental game set in the blissful Y2K corporate environment in which you play a dungeon master trying to nudge the "player" (the Executive) towards your meta goal of making them enjoy their experience. For this you can influence the loot they find and the encounters they make, by offering them choices (a deliberate one for loot a random one for encounters). The goal is therefore not to make the Executive's work days last longer, but rather to end them on a good note. As the game progresses and the executive returns for more, you'll be able to purchase additional loot and encounter options to choose from, but you'll lose them if the Executive gives up.

The meta element manifests when you are yourself rewarded with unlockable features (perks) if your Executive goes through a certain number of work days without retiring. When they do, you lose most of your stuff, but you keep the unlocked perks. Therefore the Executive has runs (work days) but so do you, with successive Executive hires to try to unlock all perks and beat their max number of work days.

## But why?

This project is an excuse to test [jules.google.com](https://jules.google.com) by prototyping a one-line idea (the difficulty of making a game about balancing game difficulty) that I had written down somewhere and zero time to build from scratch myself.

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

The "Bliss" inspired background image is custom made from these sources
- https://www.pexels.com/photo/grass-hill-under-a-clear-blue-sky-16452613/
- https://www.pexels.com/photo/blue-skies-53594/
