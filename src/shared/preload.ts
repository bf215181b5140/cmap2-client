import { contextBridge, ipcRenderer } from 'electron';
import { IpcGetOptions, IpcRecieveOptions, IpcSendOptions } from './global';

contextBridge.exposeInMainWorld('electronAPI', {
    get: <K extends keyof IpcGetOptions>(channel: K) => ipcRenderer.invoke(channel).then((result: IpcGetOptions[K]) => result),
    send: <K extends keyof IpcSendOptions>(channel: K, data?: IpcSendOptions[K]) => ipcRenderer.send(channel, data),
    receive: <K extends keyof IpcRecieveOptions>(channel: K, func: (data: IpcRecieveOptions[K]) => void) => {
        // strip event
        const funcInternal = (event: Electron.IpcRendererEvent, args: IpcRecieveOptions[K]) => func(args);
        ipcRenderer.on(channel, funcInternal);
        return () => ipcRenderer.removeListener(channel, funcInternal);
    },
    receiveOnce: <K extends keyof IpcRecieveOptions>(channel: K, func: (data: IpcRecieveOptions[K]) => void) => {
        // strip event
        ipcRenderer.once(channel, (event: Electron.IpcRendererEvent, args: IpcRecieveOptions[K]) => func(args));
    },
    removeAllListeners: (channel: keyof IpcRecieveOptions) => ipcRenderer.removeAllListeners(channel),
});
