import {ipcMain, IpcMainEvent, IpcMainInvokeEvent} from "electron";
import {ClientSocketService} from "../webSocket/clientSocketService";
import {ClientStoreService} from "../util/clientStoreService";
import {ClientCredentials} from "../global";

export class IpcRendererService {

    static init() {

        ipcMain.handle('getClientCredentials', async (event: IpcMainInvokeEvent, data: any[]) => {
            return ClientStoreService.getClientCredentials();
        });

        ipcMain.on('setClientCredentials', (event: IpcMainEvent, clientCredentials: ClientCredentials) => {
            ClientStoreService.setClientCredentials(clientCredentials);
            ClientSocketService.connect();
        });

    }
}