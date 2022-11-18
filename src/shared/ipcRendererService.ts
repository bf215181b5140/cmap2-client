import {ipcMain, IpcMainEvent, IpcMainInvokeEvent} from "electron";
import {clientStore} from "../electron";
import {ClientSocketService} from "../webSocket/clientSocketService";

export class IpcRendererService {

    static init() {

        ipcMain.handle('getApiKey', async (event: IpcMainInvokeEvent, data: any[]) => {
            return clientStore.get('apiKey');
        });

        ipcMain.on('setApiKey', (event: IpcMainEvent, data: string) => {
            clientStore.set('apiKey', data);
            ClientSocketService.init();
        });

    }
}