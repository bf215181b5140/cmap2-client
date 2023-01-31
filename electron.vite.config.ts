import { resolve } from 'path'
import { defineConfig, externalizeDepsPlugin } from 'electron-vite';
import react from '@vitejs/plugin-react';
import * as path from 'path';

export default defineConfig({
    main: {
        build: {
            outDir: './build/electron',
            copyPublicDir: false,
            lib: {
                entry: 'src/electron/electron.ts',
                fileName: 'electron.js'
            }
        },
        plugins: [externalizeDepsPlugin()]
    },
    preload: {
        build: {
            outDir: './build/shared',
            copyPublicDir: false,
            lib: {
                entry: 'src/shared/preload.ts',
                fileName: 'preload.js'
            }
        },
        plugins: [externalizeDepsPlugin()]
    },
    renderer: {
        root: 'src/ui',
        build: {
            outDir: path.join(__dirname, '/build/ui'),
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
})
