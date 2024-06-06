import { contextBridge, ipcRenderer } from 'electron';
import { ParameterType, IpcGetOptions, IpcReceiveOptions, IpcSendOptions } from './global';

contextBridge.exposeInMainWorld('electronAPI', {
    get: <K extends keyof IpcGetOptions>(channel: K, data?: ParameterType<IpcGetOptions[K]>) => ipcRenderer.invoke(channel, data).then((result: ReturnType<IpcGetOptions[K]>) => result),
    send: <K extends keyof IpcSendOptions>(channel: K, data?: IpcSendOptions[K]) => ipcRenderer.send(channel, data),
    receive: <K extends keyof IpcReceiveOptions>(channel: K, func: (data: IpcReceiveOptions[K]) => void) => {
        // strip event
        const funcInternal = (event: Electron.IpcRendererEvent, args: IpcReceiveOptions[K]) => func(args);
        ipcRenderer.on(channel, funcInternal);
        return () => ipcRenderer.removeListener(channel, funcInternal);
    },
    receiveOnce: <K extends keyof IpcReceiveOptions>(channel: K, func: (data: IpcReceiveOptions[K]) => void) => {
        // strip event
        ipcRenderer.once(channel, (event: Electron.IpcRendererEvent, args: IpcReceiveOptions[K]) => func(args));
    },
    removeAllListeners: (channel: keyof IpcReceiveOptions) => ipcRenderer.removeAllListeners(channel),
});
