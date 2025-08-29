import path from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
      base: '/rogue-steward/',
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
});
