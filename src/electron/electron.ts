import { app, BrowserWindow, Tray, nativeImage, Menu } from 'electron';
import * as path from 'path';
import { OscService } from './osc/osc.service';
import { ClientSocketService } from './webSocket/clientSocket.service';
import { IpcRendererService } from '../shared/ipcRendererService';
import { testing } from './testing/testing.service';
import { ClientStoreService } from './util/clientStore.service';

if (!app.requestSingleInstanceLock()) {
    app.quit();
    process.exit(0);
}

export const serverUrl: string = 'http://localhost:8080';
// export const serverUrl: string = app.isPackaged ? 'http://changemyavatarparams.win' : 'http://localhost:8080'; TODO

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
        webPreferences: {
            preload: path.join(__dirname, '../shared/preload.js')
        }
    });

    // and load the index.html of the app.
    if (!app.isPackaged) {
        mainWindow.loadURL('http://127.0.0.1:5173/');
        mainWindow.webContents.openDevTools();
    } else {
        mainWindow.loadFile(path.join(__dirname, '../ui/index.html'));
    }

    return mainWindow;
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {

    IpcRendererService.init();
    OscService.start();

    // testing service
    // testing();

    const applicationSettings = ClientStoreService.getApplicationSettings();
    if (applicationSettings && applicationSettings.autoLogin === true) ClientSocketService.connect();
    if (!applicationSettings || applicationSettings.startMinimized !== true) mainWindow = createWindow();

    // create tray icon
    let tray = new Tray(nativeImage.createFromPath('public/logo192.png'));
    const contextMenu = Menu.buildFromTemplate([
        {
            label: 'Open', type: 'normal', click: () => {
                if (!mainWindow || mainWindow.isDestroyed()) mainWindow = createWindow();
            }
        }, {
            label: 'Close', type: 'normal', click: () => {
                if (mainWindow && !mainWindow.isDestroyed()) {
                    mainWindow.close();
                }
            }
        }, {
            label: 'Exit', type: 'normal', click: () => {
                tray.destroy();
                app.quit();
            }
        }
    ]);
    tray.setContextMenu(contextMenu);
    tray.setToolTip('This is my application.');

    app.on('window-all-closed', (event: any) => {
        // prevent terminating main process
        event.preventDefault();
    });
});
