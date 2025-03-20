import { contextBridge, ipcRenderer } from 'electron';
import { IpcGetOptions, IpcReceiveOptions, IpcSendOptions } from '../electron/ipc/typedIpc.model';
import { SettingsStoreData } from '../electron/store/settings/settings.model';

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
  store: {
    get: <K extends keyof SettingsStoreData>(key: K) => ipcRenderer.invoke('store-get', key).then((result: SettingsStoreData[K]) => result),
    getSync: <K extends keyof SettingsStoreData>(key: K) => ipcRenderer.sendSync('store-get-sync', key) as SettingsStoreData[K],
    set: <K extends keyof SettingsStoreData>(key: K, data: SettingsStoreData[K]) => ipcRenderer.send('store-set', key, data),
  }
};

export type IPC = typeof ipc;

contextBridge.exposeInMainWorld('IPC', ipc);
