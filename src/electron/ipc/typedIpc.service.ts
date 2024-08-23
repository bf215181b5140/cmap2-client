import { ipcMain, IpcMainEvent } from 'electron';
import { IpcGetOptions, IpcReceiveOptions, IpcSendOptions } from './typedIpc.model';
import type { CmapWindow } from '../window/cmap.window';

class TypedIpcService {
    private _cmapWindow: CmapWindow | undefined;

    constructor() {
        // this.handle('getFingerprint', async () => await getFingerprint());
    }

    set cmapWindow(cmapWindow: CmapWindow) {
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
}

export const IPC = new TypedIpcService();
