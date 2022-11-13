import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('electronAPI', {
    onUpdateCounter: (callback: any) => ipcRenderer.on('update-counter', callback)
})