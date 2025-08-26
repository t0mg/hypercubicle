import path from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
      base: '/rogulus/',
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
});
