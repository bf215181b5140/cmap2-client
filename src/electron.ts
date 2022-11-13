import { app, BrowserWindow, Menu } from "electron";
import * as path from "path";
import {OscService} from "./osc/oscService";
import {ClientSocketService} from "./webSocket/clientSocketService";
import {FileSystemService} from "./fileSystem/fileSystemService";

export const userDataPath: string = app.getPath('userData');
export const serverUrl: string = app.isPackaged ? 'http://changemyavatarparams.win' : 'http://localhost:8080';

function createWindow() {
    // Create the browser window.
    const mainWindow = new BrowserWindow({
        width: 1024,
        height: 720,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js')
        }
    });

    const menu = Menu.buildFromTemplate([
        {
            label: app.name,
            submenu: [
                {
                    click: () => mainWindow.webContents.send('update-counter', 1),
                    label: 'Increment',
                },
                {
                    click: () => mainWindow.webContents.send('update-counter', -1),
                    label: 'Decrement',
                }
            ]
        }

    ])

    Menu.setApplicationMenu(menu)

    // and load the index.html of the app.
    mainWindow.loadFile(path.join(__dirname, "index.html"));

    // Open the DevTools.
    if (!app.isPackaged) mainWindow.webContents.openDevTools();
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {

    FileSystemService.readApiKey()
    ClientSocketService.init();
    OscService.init();

    createWindow();

    app.on("activate", function () {
        // On macOS it's common to re-create a window in the app when the
        // dock icon is clicked and there are no other windows open.
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
        app.quit();
    }
});

// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.
