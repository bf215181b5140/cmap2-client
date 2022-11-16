import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('electronAPI', {
    onUpdateCounter: (callback: any) => ipcRenderer.on('update-counter', callback),
    getApiKey: () => ipcRenderer.invoke('getApiKey').then(result => result),
    setApiKey: (apiKey: string) => ipcRenderer.send('setApiKey', apiKey),
})