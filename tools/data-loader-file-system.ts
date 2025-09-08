import { DataLoader } from '../types';
import { promises as fs } from 'fs';
import path from 'path';

export class DataLoaderFileSystem implements DataLoader {
  public async loadJson(filePath: string): Promise<any> {
    const absolutePath = path.join(process.cwd(), 'public', filePath);
    const fileContent = await fs.readFile(absolutePath, 'utf-8');
    return JSON.parse(fileContent);
  }
}
