import { ipcMain, IpcMainEvent } from 'electron';
import { IpcGetOptions, IpcReceiveOptions, IpcSendOptions } from './typedIpc.model';
import type { WindowController } from '../window/window.controller';
import IpcMainInvokeEvent = Electron.IpcMainInvokeEvent;
import { SettingsStoreData } from '../store/settings/settings.model';

class TypedIpcService {
  private _cmapWindow: WindowController | undefined;

  set cmapWindow(cmapWindow: WindowController) {
    this._cmapWindow = cmapWindow;
  }

  on<K extends keyof IpcSendOptions>(channel: K, func: (data: IpcSendOptions[K]) => void): void {
    ipcMain.on(channel, (event: IpcMainEvent, data) => func(data));
  }

  handle<K extends keyof IpcGetOptions>(channel: K, func: () => Promise<IpcGetOptions[K]>): void {
    ipcMain.handle(channel, () => func());
  }

  emit<K extends keyof IpcReceiveOptions>(channel: K, data: IpcReceiveOptions[K]): void {
    this._cmapWindow?.sendToRenderer(channel, data);
  }

  store = {
    get: <K extends keyof SettingsStoreData>(func: (key: K) => SettingsStoreData[K]) => {
      ipcMain.handle('store-get', (event: IpcMainInvokeEvent, key: K) => func(key));
    },
    getSync: <K extends keyof SettingsStoreData>(func: (key: K) => SettingsStoreData[K]) => {
      ipcMain.on('store-get-sync', (event: IpcMainEvent, key: K) => event.returnValue = func(key));
    },
    set: <K extends keyof SettingsStoreData>(func: (key: K, data: SettingsStoreData[K]) => void) => {
      ipcMain.on('store-set', (event: IpcMainEvent, key: K, data: SettingsStoreData[K]) => func(key, data));
    },
  }
}

export const IPC = new TypedIpcService();
