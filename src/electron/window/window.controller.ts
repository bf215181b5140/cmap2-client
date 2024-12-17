import { app, BrowserWindow, shell } from 'electron';
import { WindowSize } from '../../shared/enums/windowSize';
import { IPC } from '../ipc/typedIpc.service';
import { BRIDGE } from '../bridge/bridge.service';
import { IpcReceiveOptions } from '../ipc/typedIpc.model';
import { fileURLToPath } from 'url';
import { SETTINGS } from '../store/settings/settings.store';
import { WindowState } from '../../shared/enums/windowState';
import { AppSettings } from '../../shared/objects/settings';

export class WindowController {
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
  private settings: AppSettings;

  constructor() {
    this.settings = SETTINGS.get('app');

    IPC.cmapWindow = this;

    IPC.on('window:state', windowState => this.setWindowState(windowState));
    IPC.on('window:size', windowSize => this.setSize(windowSize));

    BRIDGE.on('window:state', windowState => this.setWindowState(windowState));
    BRIDGE.on('window:size', windowSize => this.setSize(windowSize));

    if (!this.settings.startInBackground) {
      this.createWindow();
    }
  }

  /**
   * Sends data to electron renderer
   */
  public sendToRenderer<K extends keyof IpcReceiveOptions>(channel: K, data: IpcReceiveOptions[K]) {
    if (this.window && !this.window?.isDestroyed()) this.window.webContents.send(channel, data);
  }

  private getSizeProperties(windowSize: WindowSize) {
    switch (windowSize) {
      case 'Big':
        return { width: 1448, height: 936 };
      case 'Medium':
        return { width: 1124, height: 768 };
      case 'Small':
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
      case 'Open':
        if (this.window && !this.window?.isDestroyed()) {
          this.window?.show();
        } else {
          this.createWindow();
        }
        break;
      case 'Minimize':
        if (this.window && !this.window?.isDestroyed()) this.window?.minimize();
        break;
      case 'Tray':
        if (this.window && !this.window?.isDestroyed()) this.window?.close();
        break;
      case 'Exit':
        app.quit();
        break;
      default:
        break;
    }
  }

  private createWindow() {
    this.window = new BrowserWindow({
      ...this.defaultOptions,
      ...this.getSizeProperties(SETTINGS.get('app').windowSize)
    });

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

