import { Storage } from '../types';

export class LocalStorage implements Storage {
  public getItem(key: string): string | null {
    return window.localStorage.getItem(key);
  }

  public setItem(key: string, value: string): void {
    window.localStorage.setItem(key, value);
  }
}

export class MemoryStorage implements Storage {
  private data: { [key: string]: string } = {};

  public getItem(key: string): string | null {
    return this.data[key] || null;
  }

  public setItem(key: string, value: string): void {
    this.data[key] = value;
  }
}
