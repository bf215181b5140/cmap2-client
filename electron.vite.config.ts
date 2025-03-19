import { resolve } from 'path';
import { defineConfig, externalizeDepsPlugin } from 'electron-vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  main: {
    build: {
      outDir: './build/electron',
      lib: {
        entry: 'src/electron/main.ts',
      },
    },
    plugins: [externalizeDepsPlugin()]
  },
  preload: {
    build: {
      outDir: './build/shared',
      lib: {
        entry: 'src/shared/preload.ts',
      },
      rollupOptions: {
        output: {
          format: 'cjs'
        }
      }
    },
    plugins: [externalizeDepsPlugin()]
  },
  renderer: {
    root: 'src/ui',
    build: {
      outDir: './build/ui',
      rollupOptions: {
        input: 'src/ui/index.html'
      },
    },
    resolve: {
      alias: {
        '@renderer': resolve('src/ui')
      }
    },
    plugins: [react()]
  }
});
