import {ipcMain, IpcMainEvent, IpcMainInvokeEvent} from "electron";
import {ClientSocketService} from "../electron/webSocket/clientSocket.service";
import {ClientStoreService} from "../electron/util/clientStore.service";
import {ClientCredentials} from "./global";
import {mainWindow} from "../electron/electron";
import {WindowState} from "./enums";

export class IpcRendererService {

    static init() {

        ipcMain.handle('getClientCredentials', async (event: IpcMainInvokeEvent, data: any[]) => {
            return ClientStoreService.getClientCredentials();
        });

        ipcMain.on('setClientCredentials', (event: IpcMainEvent, clientCredentials: ClientCredentials) => {
            ClientStoreService.setClientCredentials(clientCredentials);
            ClientSocketService.connect();
        });

        ipcMain.on('setWindowState', (event: IpcMainInvokeEvent, windowState: WindowState) => {
            switch(windowState) {
                case WindowState.HIDE:
                    if(mainWindow) mainWindow.hide();
                    break;
                case WindowState.MINIMIZE:
                    if(mainWindow) mainWindow.minimize();
                    break;
                case WindowState.CLOSE:
                    if(mainWindow) mainWindow.close();
                    break;
                default:
                    break;
            }
        });

        ipcMain.handle('getConnectionStatus', async (event: IpcMainInvokeEvent, data: any[]) => {
            return ClientSocketService.connectionStatus;
        });

    }
}
