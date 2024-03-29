import { ipcMain, IpcMainEvent } from 'electron';
import { IpcGetOptions, IpcReceiveOptions, IpcSendOptions } from '../../shared/global';
import mainWindow from '../mainWindow/mainWindow';

export default class TypedIpcMain {
    static on<K extends keyof IpcSendOptions>(channel: K, func: (data: IpcSendOptions[K]) => void): void {
        ipcMain.on(channel, (event: IpcMainEvent, data) => func(data));
    }

    static handle<K extends keyof IpcGetOptions>(channel: K, func: () => Promise<IpcGetOptions[K]>): void {
        ipcMain.handle(channel, () => func());
    }

    static emit<K extends keyof IpcReceiveOptions>(channel: K, data: IpcReceiveOptions[K]): void {
        mainWindow.send(channel, data);
    }
}
