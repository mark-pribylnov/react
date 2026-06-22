import { defineConfig, mergeConfig } from 'vitest/config';
import viteConfig from './vite.config';

export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      globals: false,
      environment: 'jsdom',
      setupFiles: ['./src/setupTests.tsx'],
      exclude: ['**/node_modules/**', '**/.next/**'],
      fileParallelism: false,
      maxConcurrency: 1,
      css: true,
      coverage: {
        provider: 'v8',
        reporter: ['json-summary', 'text-summary', 'text', 'html'],
        include: ['src/**/*.{js,jsx,ts,tsx}'],
        exclude: [
          'src/**/*.test.{js,jsx,ts,tsx}',
          'src/**/*.spec.{js,jsx,ts,tsx}',
          'src/index.{js,jsx,ts,tsx}',
          'src/main.{js,jsx,ts,tsx}',
          'src/setupTests.{js,ts}',
          'src/**/*.d.ts',
          'src/types/**',
          'src/test-utils/**',
        ],
        thresholds: {
          statements: 80,
          branches: 50,
          functions: 50,
          lines: 50,
        },
      },
    },
  })
);
