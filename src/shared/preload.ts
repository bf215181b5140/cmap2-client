import { contextBridge, ipcRenderer } from 'electron';
import { WindowState } from './enums';
import { ApplicationSettings, ClientCredentials } from './classes';
import { VrcParameter } from 'cmap2-shared';
import { ToyCommand } from 'lovense';
import { LovenseSettings, LovenseStatus, ToyCommandOscMessage, ToyCommandParameter } from './lovense';

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
    getLovenseSettings: () => ipcRenderer.invoke('getLovenseSettings').then((lovenseSettings: LovenseSettings) => lovenseSettings),
    setLovenseSettings: (lovenseSettings: LovenseSettings) => ipcRenderer.send('setLovenseSettings', lovenseSettings),
    getLovenseStatus: () => ipcRenderer.send('getLovenseStatus'),
    lovenseStatus: (callback: (event: Electron.IpcRendererEvent, lovenseStatus: LovenseStatus) => void) => ipcRenderer.on('lovenseStatus', callback),
    lovenseConnect: () => ipcRenderer.send('lovenseConnect'),
    lovenseDisconnect: () => ipcRenderer.send('lovenseDisconnect'),
    sendLovenseToyCommand: (toyCommand: ToyCommand) => ipcRenderer.send('sendLovenseToyCommand', toyCommand),
    setToyCommandParameters: (toyCommandParameters: ToyCommandParameter[]) => ipcRenderer.send('setToyCommandParameters', toyCommandParameters),
    getToyCommandParameters: () => ipcRenderer.invoke('getToyCommandParameters').then((toyCommandParameters: ToyCommandParameter[]) => toyCommandParameters),
    setToyCommandOscMessages: (toyCommandOscMessages: ToyCommandOscMessage[]) => ipcRenderer.send('setToyCommandOscMessages', toyCommandOscMessages),
    getToyCommandOscMessages: () => ipcRenderer.invoke('getToyCommandOscMessages').then((toyCommandOscMessages: ToyCommandOscMessage[]) => toyCommandOscMessages),
    // Util
    getFingerprint: () => ipcRenderer.invoke('getFingerprint').then((fingerprint: string) => fingerprint),
});
