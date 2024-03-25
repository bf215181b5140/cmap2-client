import { app, Tray, Menu } from 'electron';
import { ClientSocketService } from './webSocket/clientSocket.service';
import { IpcMainController } from './ipc/ipcMain.controller';
import { MainStore } from './store/main/main.store';
import LovenseController from './lovense/lovense.controller';
import VrcDetectorService from './vrcDetector/vrcDetector.service';
import mainWindow from './mainWindow/mainWindow';
import { OscController } from './osc/osc.controller';
import { OscDataStore } from './store/oscData/oscData.store';
import OscClockController from './osc/clock/oscClock.controller';
import OscControlStore from './store/oscControl/oscControl.store';

if (!app.requestSingleInstanceLock()) {
    app.quit();
    process.exit(0);
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {

    // start store services
    MainStore.start();
    OscDataStore.start();
    OscControlStore.start();

    // grab settings
    const generalSettings = MainStore.getGeneralSettings();

    // initiate services
    new IpcMainController();
    new OscController(generalSettings);
    new ClientSocketService();
    new LovenseController();
    new VrcDetectorService();
    new OscClockController();

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
