import { IpcGetOptions, IpcReceiveOptions, IpcSendOptions } from './electron/ipc/typedIpc.model';

export interface IElectronAPI {
    get: <K extends keyof IpcGetOptions>(channel: K) => Promise<IpcGetOptions[K]>;
    send: <K extends keyof IpcSendOptions>(channel: K, data?: IpcSendOptions[K]) => void;
    receive: <K extends keyof IpcReceiveOptions>(channel: K, func: (data: IpcReceiveOptions[K]) => void) => () => void;
    receiveOnce: <K extends keyof IpcReceiveOptions>(channel: K, func: (data: IpcReceiveOptions[K]) => void) => () => void;
    removeAllListeners: (channel: keyof IpcReceiveOptions) => void;
}

declare global {
    interface Window {
        electronAPI: IElectronAPI;
    }
}
