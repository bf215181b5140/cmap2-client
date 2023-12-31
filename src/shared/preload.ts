import { contextBridge, ipcRenderer } from 'electron';
import { WindowState } from './enums';
import { ApplicationSettings, ClientCredentials } from './classes';
import { VrcParameter } from 'cmap2-shared';

contextBridge.exposeInMainWorld('electronAPI', {
    getClientCredentials: () => ipcRenderer.invoke('getClientCredentials').then(result => result),
    setClientCredentials: (clientCredentials: ClientCredentials) => ipcRenderer.send('setClientCredentials', clientCredentials),
    setWindowState: (windowState: WindowState) => ipcRenderer.send('setWindowState', windowState),
    updateConnectionStatus: (callback: any) => ipcRenderer.on('updateConnectionStatus', callback),
    getConnectionStatus: () => ipcRenderer.invoke('getConnectionStatus').then(result => result),
    disconnectSocket: () => ipcRenderer.send('disconnectSocket'),
    getApplicationSettings: () => ipcRenderer.invoke('getApplicationSettings').then(result => result),
    setApplicationSettings: (applicationSettings: ApplicationSettings) => ipcRenderer.send('setApplicationSettings', applicationSettings),
    forwardOscToRenderer: (forward: boolean) => ipcRenderer.send('forwardOscToRenderer', forward),
    vrcParameter: (callback: (event: Electron.IpcRendererEvent, message: VrcParameter) => void) => ipcRenderer.on('vrcParameter', callback),
    // Util
    getFingerprint: () => ipcRenderer.invoke('getFingerprint').then((fingerprint: string) => fingerprint),
});
