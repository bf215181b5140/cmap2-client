import { app, BrowserWindow, Tray, nativeImage, Menu } from 'electron';
import * as path from 'path';
import { OscController } from './osc/osc.controller';
import { ClientSocketService } from './webSocket/clientSocket.service';
import { IpcMainService } from './ipc/ipcMain.service';
import { testing } from './testing/testing.service';
import { StoreService } from './store/store.service';
import LovenseController from './lovense/lovense.controller';
import VrcDetectorController from './vrcDetector/vrcDetector.controller';

if (!app.requestSingleInstanceLock()) {
    app.quit();
    process.exit(0);
}

// todo make a service for this
export let mainWindow: BrowserWindow | null;

function createWindow(): BrowserWindow {
    // Create the browser window.
    const mainWindow = new BrowserWindow({
        width: 1124,
        height: 768,
        frame: false,
        transparent: true,
        resizable: false,
        skipTaskbar: false,
        show: false,
        webPreferences: {
            preload: path.join(__dirname, '../shared/preload.js')
        }
    });

    mainWindow.on('ready-to-show', () => mainWindow.show());

    // and load the index.html of the app.
    if (!app.isPackaged) {
        mainWindow.loadURL('http://localhost:5173/');
        mainWindow.webContents.openDevTools();
    } else {
        mainWindow.loadFile(path.join(__dirname, '../ui/index.html'));
    }

    // bugfix: https://github.com/electron/electron/issues/39959#issuecomment-1758736966
    mainWindow.on('blur', () => {
        mainWindow.setBackgroundColor('#00000000')
    })
    mainWindow.on('focus', () => {
        mainWindow.setBackgroundColor('#00000000')
    })

    return mainWindow;
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {

    // grab settings
    const settings = StoreService.getSettings();

    // initiate services
    new StoreService();
    IpcMainService.init();
    OscController.start();
    new LovenseController();
    new VrcDetectorController();
    if (settings.autoLogin) ClientSocketService.connect();

    // testing service
    // testing();

    if (!settings.startMinimized) mainWindow = createWindow();

    // create tray icon
    let tray = new Tray('resources/icon.png');
    const contextMenu = Menu.buildFromTemplate([
        {
            label: 'Open', type: 'normal', click: () => {
                if (!mainWindow || mainWindow.isDestroyed()) mainWindow = createWindow();
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
