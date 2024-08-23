import { ipcMain, IpcMainEvent } from 'electron';
import { IpcGetOptions, IpcReceiveOptions, IpcSendOptions } from '../../shared/global';
import { getFingerprint } from '../util/fingerprint';
import { MAIN_WINDOW } from '../mainWindow/mainWindow.service';

class TypedIpcService {

    constructor() {
        this.handle('getFingerprint', async () => await getFingerprint());
    }

    on<K extends keyof IpcSendOptions>(channel: K, func: (data: IpcSendOptions[K]) => void): void {
        ipcMain.on(channel, (event: IpcMainEvent, data) => func(data));
    }

    handle<K extends keyof IpcGetOptions>(channel: K, func: () => Promise<IpcGetOptions[K]>): void {
        ipcMain.handle(channel, () => func());
    }

    emit<K extends keyof IpcReceiveOptions>(channel: K, data: IpcReceiveOptions[K]): void {
        MAIN_WINDOW.send(channel, data);
    }
}

export const IPC = new TypedIpcService();
