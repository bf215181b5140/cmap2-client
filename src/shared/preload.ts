import { contextBridge, ipcRenderer } from 'electron';
import {ClientCredentials} from "../global";

contextBridge.exposeInMainWorld('electronAPI', {
    getClientCredentials: () => ipcRenderer.invoke('getClientCredentials').then(result => result),
    setClientCredentials: (clientCredentials: ClientCredentials) => ipcRenderer.send('setClientCredentials', clientCredentials),
})