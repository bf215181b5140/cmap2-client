import { app, BrowserWindow, shell } from 'electron';
import { WindowSize, WindowState } from '../../shared/enums';
import { IPC } from '../ipc/typedIpc.service';
import { BRIDGE } from '../bridge/bridge.service';
import { IpcReceiveOptions } from '../ipc/typedIpc.model';
import { fileURLToPath } from 'url';
import { SETTINGS } from '../store/settings/settings.store';

export class CmapWindow {
    private window: BrowserWindow | undefined;
    private defaultOptions: Electron.BrowserWindowConstructorOptions = {
        frame: false,
        transparent: true,
        resizable: false,
        skipTaskbar: false,
        show: false,
        webPreferences: {
            preload: fileURLToPath(new URL('../shared/preload.cjs', import.meta.url))
        }
    };

    constructor() {
        if (!SETTINGS.getAppSettings().startInBackground) {// todo if settings store open on startup then create window and set size from settings
            this.createWindow();
        }

        IPC.cmapWindow = this;

        IPC.on('setWindowState', (windowState) => this.setWindowState(windowState));

        IPC.on('setAppSettings', (data) => this.setSize(data.windowSize));

        BRIDGE.on('setWindowState', (windowState) => this.setWindowState(windowState));
        BRIDGE.on('setWindowSize', (windowSize) => this.setSize(windowSize));

        IPC.handle('getAppVersion', async () => app.getVersion());
    }

    /**
     * Sends data to electron renderer
     */
    public sendToRenderer<K extends keyof IpcReceiveOptions>(channel: K, data: IpcReceiveOptions[K]) {
        if (this.window) this.window.webContents.send(channel, data);
    }

    private getSizeProperties(windowSize: WindowSize) {
        switch (windowSize) {
            case WindowSize.Big:
                return { width: 1448, height: 936 };
            case WindowSize.Medium:
                return { width: 1124, height: 768 };
            case WindowSize.Small:
                return { width: 800, height: 600 };
        }
    }

    private setSize(windowSize: WindowSize) {
        const { width, height } = this.getSizeProperties(windowSize);
        // workaround for a bug from 2018....
        // https://github.com/electron/electron/issues/15560
        this.window?.setResizable(true);
        this.window?.setSize(width, height);
        this.window?.setResizable(false);
        this.window?.center();
    }

    private setWindowState(windowState: WindowState) {
        switch (windowState) {
            case WindowState.Open:
                if (this.window && !this.window?.isDestroyed()) {
                    this.window?.show();
                } else {
                    this.createWindow();
                }
                break;
            case WindowState.Minimize:
                if (this.window && !this.window?.isDestroyed()) this.window?.minimize();
                break;
            case WindowState.Tray:
                if (this.window && !this.window?.isDestroyed()) this.window?.close();
                break;
            case WindowState.Exit:
                app.quit();
                break;
            default:
                break;
        }
    }

    private createWindow() {
        this.window = new BrowserWindow({ ...this.defaultOptions, ...this.getSizeProperties(SETTINGS.getAppSettings().windowSize) });

        this.window.on('ready-to-show', () => this.window?.show());

        if (!app.isPackaged) {
            this.window.loadURL('http://localhost:5173/');
            setTimeout(() => this.window?.webContents.openDevTools({ mode: 'detach' }), 1500);
        } else {
            this.window.loadFile(fileURLToPath(new URL('../ui/index.html', import.meta.url)));
        }

        // workaround for a bug
        // https://github.com/electron/electron/issues/39959#issuecomment-1758736966
        this.window.on('blur', () => {
            this.window?.setBackgroundColor('#00000000');
        });
        this.window.on('focus', () => {
            this.window?.setBackgroundColor('#00000000');
        });

        this.window.webContents.setWindowOpenHandler(({ url }) => {
            shell.openExternal(url);
            return { action: 'deny' };
        });
    }
}

