import { app, Tray, Menu } from 'electron';
import { ClientSocketService } from './webSocket/clientSocket.service';
import { IpcMainController } from './ipc/ipcMain.controller';
import { StoreService } from './store/store.service';
import LovenseController from './lovense/lovense.controller';
import VrcDetectorService from './vrcDetector/vrcDetector.service';
import mainWindow from './mainWindow/mainWindow';
import { OscController } from './osc/osc.controller';
import { OscDataStoreService } from './store/oscData/oscDataStore.service';
import LocalTimeController from './osc/localTime/localTime.controller';

if (!app.requestSingleInstanceLock()) {
    app.quit();
    process.exit(0);
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {

    // grab settings
    const settings = StoreService.getSettings();

    // initiate services
    new StoreService();
    new OscDataStoreService();
    new IpcMainController();
    new OscController(settings);
    new ClientSocketService(settings);
    new LovenseController();
    new VrcDetectorService();
    new LocalTimeController();

    // testing service
    // testing();

    mainWindow.init(settings);

    // create tray icon
    let tray = new Tray('resources/icon.png');
    const contextMenu = Menu.buildFromTemplate([
        {
            label: 'Open', type: 'normal', click: () => {
                mainWindow.createWindow();
            }
        }, {
            label: 'Exit', type: 'normal', click: () => {
                tray.destroy();
                app.quit();
            }
        }
    ]);
    tray.setContextMenu(contextMenu);
    tray.setToolTip('Cmap');

    app.on('window-all-closed', (event: any) => {
        // prevent terminating main process
        event.preventDefault();
    });
});
