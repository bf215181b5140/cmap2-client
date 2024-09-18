import { app } from 'electron';
import { WindowController } from './window/window.controller';
import { TrayController } from './tray/tray.controller';
import log from 'electron-log';
import contextMenu from 'electron-context-menu';
import VrcDetectorController from './vrcDetector/vrcDetector.controller';
import { SocketController } from './socket/socket.controller';
import { AVATARS } from './store/avatars/avatars.store';
import { OscController } from './osc/osc.controller';

if (!app.requestSingleInstanceLock()) {
    app.quit();
    process.exit(0);
}

app.whenReady().then(() => {

    // Start logging (electron events)
    log.info('Application started');
    log.eventLogger.startLogging();

    AVATARS;

    // start functions
    new VrcDetectorController();
    new SocketController();
    new OscController();

    // create window and tray
    new WindowController();
    new TrayController();

    // Context menu for development
    if (!app.isPackaged) contextMenu();

    // prevent terminating main process so program can run in background
    app.on('window-all-closed', (event: any) => event.preventDefault());

}).catch(e => log.error('Application failed to start', e));
