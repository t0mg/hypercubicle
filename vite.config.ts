/// <reference types="vitest" />
import { defineConfig } from 'vite';

export default defineConfig(({ mode }) => {
  return {
    base: mode === 'production' ? '/rogue-steward/' : '/',
    test: {
      environment: 'jsdom',
    },
    server: {
      watch: {
        usePolling: true,
      },
    },
  };
});
