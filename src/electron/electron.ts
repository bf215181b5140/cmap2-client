import { app, BrowserWindow, Tray, nativeImage, Menu } from 'electron';
import * as path from 'path';
import { OscService } from './osc/osc.service';
import { ClientSocketService } from './webSocket/clientSocket.service';
import { IpcRendererService } from '../shared/ipcRendererService';
import { testing } from './testing/testing.service';

if (!app.requestSingleInstanceLock()) {
    app.quit();
    process.exit(0);
}

export const serverUrl: string = 'http://localhost:8080';
// export const serverUrl: string = app.isPackaged ? 'http://changemyavatarparams.win' : 'http://localhost:8080'; TODO

export let mainWindow: BrowserWindow;

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
    ClientSocketService.connect();
    OscService.init();

    // testing service
    // testing();

    mainWindow = createWindow();

    // create tray icon
    let tray = new Tray(nativeImage.createFromPath('public/logo192.png'));
    const contextMenu = Menu.buildFromTemplate([
        {
            label: 'Open', type: 'normal', click: () => {
                if (mainWindow) mainWindow.show();
            }
        },
        {
            label: 'Exit', type: 'normal', click: () => {
                app.quit();
            }
        }
    ]);
    tray.setContextMenu(contextMenu);
    tray.setToolTip('This is my application.');

    app.on('activate', function () {
        // On macOS it's common to re-create a window in the app when the
        // dock icon is clicked and there are no other windows open.
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});

// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.
