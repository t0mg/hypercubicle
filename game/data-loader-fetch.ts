import { DataLoader } from '../types';

export class DataLoaderFetch implements DataLoader {
  public async loadJson(filePath: string): Promise<any> {
    const response = await fetch(filePath);
    if (!response.ok) {
      throw new Error(`Could not load ${filePath}`);
    }
    return response.json();
  }
}
