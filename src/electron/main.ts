import { app, Tray, Menu } from 'electron';
import { CmapWindow } from './window/cmap.window';
import { CmapTray } from './tray/cmap.tray';

if (!app.requestSingleInstanceLock()) {
    app.quit();
    process.exit(0);
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {

    // Start store

    // start services

    // create window
    new CmapWindow();

    // create tray
    new CmapTray();

    app.on('window-all-closed', (event: any) => {
        // prevent terminating main process
        event.preventDefault();
    });
});
