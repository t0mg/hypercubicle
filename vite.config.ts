/// <reference types="vitest" />
import { defineConfig } from 'vite';
import fs from 'fs';

const pkg = JSON.parse(fs.readFileSync('package.json', 'utf-8'));

export default defineConfig(({ mode }) => {
  return {
    base: mode === 'production' ? '/rogue-steward/' : '/',
    define: {
      '__APP_VERSION__': JSON.stringify(pkg.version),
      '__BUILD_NUMBER__': JSON.stringify(process.env.BUILD_NUMBER || 'dev'),
    },
    test: {
      environment: 'jsdom',
      include: ['**/*.test.ts'],
    },
    server: {
      watch: {
        usePolling: true,
      },
    },
  };
});
