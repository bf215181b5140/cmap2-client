import { contextBridge, ipcRenderer } from 'electron';
import {ClientCredentials} from "../global";
import {WindowState} from "../enums";

contextBridge.exposeInMainWorld('electronAPI', {
    getClientCredentials: () => ipcRenderer.invoke('getClientCredentials').then(result => result),
    setClientCredentials: (clientCredentials: ClientCredentials) => ipcRenderer.send('setClientCredentials', clientCredentials),
    setWindowState: (windowState: WindowState) => ipcRenderer.send('setWindowState', windowState),
})