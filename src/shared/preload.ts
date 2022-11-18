import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('electronAPI', {
    getApiKey: () => ipcRenderer.invoke('getApiKey').then(result => result),
    setApiKey: (apiKey: string) => ipcRenderer.send('setApiKey', apiKey),
})