import { contextBridge, ipcRenderer } from 'electron';
import { WindowState } from './enums';
import { ApplicationSettings, ClientCredentials } from './classes';
import { VrcParameter } from 'cmap2-shared';
import { LovenseStatus, ToyCommand } from 'lovense';

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
    // Lovense
    getLovenseStatus: () => ipcRenderer.invoke('getLovenseStatus').then((lovenseStatus: LovenseStatus) => lovenseStatus),
    lovenseStatus: (callback: (event: Electron.IpcRendererEvent, lovenseStatus: LovenseStatus) => void) => ipcRenderer.on('lovenseStatus', callback),
    lovenseQRUrl: (callback: (event: Electron.IpcRendererEvent, message: string) => void) => ipcRenderer.on('lovenseQRUrl', callback),
    lovenseConnect: () => ipcRenderer.send('lovenseConnect'),
    lovenseDisconnect: () => ipcRenderer.send('lovenseDisconnect'),
    sendLovenseToyCommand: (toyCommand: ToyCommand) => ipcRenderer.send('sendLovenseToyCommand', toyCommand),
});
