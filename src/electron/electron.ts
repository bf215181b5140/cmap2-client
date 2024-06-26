import { app, Tray, Menu } from 'electron';
import { ClientSocketService } from './webSocket/clientSocket.service';
import { IpcMainController } from './ipc/ipcMain.controller';
import { StoreService } from './store/store.service';
import LovenseController from './lovense/lovense.controller';
import VrcDetectorService from './vrcDetector/vrcDetector.service';
import mainWindow from './mainWindow/mainWindow';
import { OscController } from './osc/osc.controller';
import { OscDataStoreService } from './store/oscData/oscDataStore.service';
import OscClockController from './osc/clock/oscClock.controller';
import OscControlStore from './store/oscControl/oscControl.store';
import UpdaterService from './updater/updater.service';

if (!app.requestSingleInstanceLock()) {
    app.quit();
    process.exit(0);
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {

    // start store services
    StoreService.start();
    OscDataStoreService.start();
    OscControlStore.start();

    // grab settings
    const generalSettings = StoreService.getGeneralSettings();

    // initiate services
    new IpcMainController();
    new OscController(generalSettings);
    new ClientSocketService();
    new LovenseController();
    new VrcDetectorService();
    new OscClockController();
    new UpdaterService();

    // testing service
    // testing();

    mainWindow.init(generalSettings);

    // create tray icon
    let tray = new Tray('resources/icon.png');
    const contextMenu = Menu.buildFromTemplate([
        {
            label: 'Open', type: 'normal', click: () => {
                mainWindow.createWindow();
            }
        }, {
            type: 'separator',
        }, {
            label: 'Exit', type: 'normal', click: () => {
                tray.destroy();
                app.quit();
            }
        }
    ]);
    tray.setContextMenu(contextMenu);
    tray.setToolTip('Cmap');
    tray.on('double-click', () => {
        mainWindow.createWindow();
        mainWindow.focus();
    });

    app.on('window-all-closed', (event: any) => {
        // prevent terminating main process
        event.preventDefault();
    });
});
