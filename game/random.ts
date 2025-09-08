// Mulberry32 is a simple pseudorandom number generator.
// It's fast and has a good distribution.
// See https://gist.github.com/tommyettinger/46a874533244883189143505d203312c

export class SeededRandom {
  private seed: number;

  constructor(seed: number) {
    this.seed = seed;
  }

  public setSeed(seed: number) {
    this.seed = seed;
  }

  public nextFloat(): number {
    let t = this.seed += 0x6D2B79F5;
    t = Math.imul(t ^ t >>> 15, t | 1);
    t ^= t + Math.imul(t ^ t >>> 7, t | 61);
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  }

  public nextInt(min: number, max: number): number {
    return Math.floor(this.nextFloat() * (max - min + 1)) + min;
  }
}

// Default seed can be changed.
export const rng = new SeededRandom(Date.now());
