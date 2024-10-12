import { contextBridge, ipcRenderer } from 'electron';
import { IpcGetOptions, IpcReceiveOptions, IpcSendOptions } from '../electron/ipc/typedIpc.model';

const ipc = {
  get: <K extends keyof IpcGetOptions>(channel: K) => ipcRenderer.invoke(channel).then((result: IpcGetOptions[K]) => result),
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
};

export type IPC = typeof ipc;

contextBridge.exposeInMainWorld('IPC', ipc);
