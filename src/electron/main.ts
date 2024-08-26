import { app, session } from 'electron';
import { CmapWindow } from './window/cmap.window';
import { CmapTray } from './tray/cmap.tray';
import log from 'electron-log';
import contextMenu from 'electron-context-menu';
import VrcDetectorController from './vrcDetector/vrcDetector.controller';

if (!app.requestSingleInstanceLock()) {
    app.quit();
    process.exit(0);
}

app.whenReady().then(() => {

    // Start logging (electron events)
    log.info('Application started');
    log.eventLogger.startLogging();

    // start services
    new VrcDetectorController();

    // create window
    new CmapWindow();

    // create tray
    new CmapTray();

    // Context menu for development
    if (!app.isPackaged) contextMenu();

    app.on('window-all-closed', (event: any) => {
        // prevent terminating main process
        event.preventDefault();
    });

}).catch(e => log.error('Application failed to start', e));
