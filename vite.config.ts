import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import electron from 'vite-electron-plugin';
import { loadViteEnv } from 'vite-electron-plugin/plugin';
import renderer from 'vite-plugin-electron-renderer';

export default defineConfig({
    plugins: [react(),
        electron({
            include: [
                'electron',
                'preload',
            ],
            plugins: [
                // Allow use `import.meta.env.VITE_SOME_KEY` in Electron-Main
                loadViteEnv(),
            ],
        }),
        // Use Node.js API in the Renderer-process
        renderer({
            // nodeIntegration: true,
        }),
    ],
    build: {
        outDir: './build'
    }
});
