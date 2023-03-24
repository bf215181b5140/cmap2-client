import { contextBridge, ipcRenderer } from 'electron';
import { WindowState } from './enums';
import { ClientCredentials } from './global';

contextBridge.exposeInMainWorld('electronAPI', {
    getClientCredentials: () => ipcRenderer.invoke('getClientCredentials').then(result => result),
    setClientCredentials: (clientCredentials: ClientCredentials) => ipcRenderer.send('setClientCredentials', clientCredentials),
    setWindowState: (windowState: WindowState) => ipcRenderer.send('setWindowState', windowState),
    updateConnectionStatus: (callback: any) => ipcRenderer.on('updateConnectionStatus', callback),
    getConnectionStatus: () => ipcRenderer.invoke('getConnectionStatus').then(result => result),
    disconnectSocket: () => ipcRenderer.send('disconnectSocket'),
});
