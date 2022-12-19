import { resolve } from 'path'
import { defineConfig, externalizeDepsPlugin } from 'electron-vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
    main: {
        build: {
            outDir: './build/electron',
            lib: {
                entry: 'src/electron',
                fileName: 'electron.js'
            }
        },
        plugins: [externalizeDepsPlugin()]
    },
    preload: {
        build: {
            outDir: './build/shared',
            lib: {
                entry: 'src/shared',
                fileName: 'preload.js'
            }
        },
        plugins: [externalizeDepsPlugin()]
    },
    renderer: {
        build: {
            outDir: './build/ui',
            lib: {
                entry: 'src/ui',
            }
        },
        resolve: {
            alias: {
                '@renderer': resolve('src/ui')
            }
        },
        plugins: [react()]
    }
})
