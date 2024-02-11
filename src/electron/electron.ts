import { app, Tray, Menu } from 'electron';
import { OscService } from './osc/osc.service';
import { ClientSocketService } from './webSocket/clientSocket.service';
import { IpcMainService } from './ipc/ipcMain.service';
import { testing } from './testing/testing.service';
import { StoreService } from './store/store.service';
import LovenseController from './lovense/lovense.controller';
import VrcDetectorService from './vrcDetector/vrcDetector.service';
import mainWindow from './mainWindow/mainWindow';

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
    new IpcMainService();
    new OscService();
    new ClientSocketService(settings);
    new LovenseController();
    new VrcDetectorService();

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
