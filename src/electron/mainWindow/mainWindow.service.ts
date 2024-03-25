import { app, BrowserWindow } from 'electron';
import path from 'path';
import { WindowState } from '../../shared/enums';
import TypedIpcMain from '../ipc/typedIpcMain';
import { GeneralSettings } from '../../shared/types/settings';

export class MainWindowService {
    private initialized: boolean = false;
    private mainWindow: BrowserWindow | undefined;

    /**
     * Called on app.whenReady(), only initialize once.
     * @param settings
     */
    public init(settings: GeneralSettings) {
        if (this.initialized) return;

        if (!settings.startMinimized) this.mainWindow = this.createWindowInternal();

        TypedIpcMain.on('setWindowState', (windowState) => this.setWindowState(windowState));

        this.initialized = true;
    }

    /**
     * Sends data to electron renderer
     * @param channel
     * @param data
     */
    public send(channel: string, data: any) {
        if (this.mainWindow && !this.mainWindow.isDestroyed()) this.mainWindow.webContents.send(channel, data);
    }

    /**
     * Creates new window if one doesn't exist yet
     */
    public createWindow() {
        if (!this.mainWindow || this.mainWindow.isDestroyed()) this.mainWindow = this.createWindowInternal();
    }

    /**
     * Sets window state
     */
    private setWindowState(windowState: WindowState) {
        switch (windowState) {
            case WindowState.MINIMIZE:
                if (this.mainWindow && !this.mainWindow.isDestroyed()) this.mainWindow.minimize();
                break;
            case WindowState.TRAY:
                if (this.mainWindow && !this.mainWindow.isDestroyed()) this.mainWindow.close();
                break;
            case WindowState.EXIT:
                app.quit();
                break;
            default:
                break;
        }

    }

    /**
     * Creates the main window
     * @private
     */
    private createWindowInternal(): BrowserWindow {
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
            mainWindow.setBackgroundColor('#00000000');
        });
        mainWindow.on('focus', () => {
            mainWindow.setBackgroundColor('#00000000');
        });

        return mainWindow;
    }

}
