import { ipcMain, IpcMainEvent } from 'electron';
import { IpcGetOptions, IpcReceiveOptions, IpcSendOptions, ParameterType } from '../../shared/global';
import mainWindow from '../mainWindow/mainWindow';

export default class TypedIpcMain {
    static on<K extends keyof IpcSendOptions>(channel: K, func: (data: IpcSendOptions[K]) => void): void {
        ipcMain.on(channel, (event: IpcMainEvent, data) => func(data));
    }

    static handle<K extends keyof IpcGetOptions>(channel: K, func: (data: ParameterType<IpcGetOptions[K]>) => Promise<ReturnType<IpcGetOptions[K]>>): void {
        ipcMain.handle(channel, (event, data) => func(data));
    }

    static emit<K extends keyof IpcReceiveOptions>(channel: K, data: IpcReceiveOptions[K]): void {
        mainWindow.send(channel, data);
    }
}
