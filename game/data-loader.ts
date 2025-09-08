import { DataLoader } from '../types';
import { promises as fs } from 'fs';
import path from 'path';

export class FetchDataLoader implements DataLoader {
  public async loadJson(filePath: string): Promise<any> {
    const response = await fetch(filePath);
    if (!response.ok) {
      throw new Error(`Could not load ${filePath}`);
    }
    return response.json();
  }
}

export class FileSystemDataLoader implements DataLoader {
  public async loadJson(filePath: string): Promise<any> {
    const absolutePath = path.join(process.cwd(), 'public', filePath);
    const fileContent = await fs.readFile(absolutePath, 'utf-8');
    return JSON.parse(fileContent);
  }
}
