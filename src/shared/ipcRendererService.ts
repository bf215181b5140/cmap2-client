import { app, ipcMain, IpcMainEvent, IpcMainInvokeEvent } from 'electron';
import { ClientSocketService } from '../electron/webSocket/clientSocket.service';
import { ClientStoreService } from '../electron/util/clientStore.service';
import { mainWindow } from '../electron/electron';
import { WindowState } from './enums';
import { ApplicationSettings, ClientCredentials } from './classes';
import { OscService } from '../electron/osc/osc.service';

export class IpcRendererService {

    static init() {

        ipcMain.handle('getClientCredentials', async () => {
            return ClientStoreService.getClientCredentials();
        });

        ipcMain.on('setClientCredentials', (event: IpcMainEvent, clientCredentials: ClientCredentials) => {
            ClientStoreService.setClientCredentials(clientCredentials);
            ClientSocketService.connect();
        });

        ipcMain.handle('getApplicationSettings', async () => {
            return ClientStoreService.getApplicationSettings();
        });

        ipcMain.on('setApplicationSettings', (event: IpcMainEvent, appSettings: ApplicationSettings) => {
            const oldSettings = ClientStoreService.getApplicationSettings();
            ClientStoreService.setApplicationSettings(appSettings);
            if (oldSettings) {
                if (oldSettings.oscIp !== appSettings.oscIp ||
                    oldSettings.oscInPort !== appSettings.oscInPort ||
                    oldSettings.oscOutPort !== appSettings.oscOutPort) {
                    OscService.start();
                }
            }
        });

        ipcMain.on('setWindowState', (event: IpcMainInvokeEvent, windowState: WindowState) => {
            switch (windowState) {
                case WindowState.MINIMIZE:
                    if (mainWindow && !mainWindow.isDestroyed()) mainWindow.minimize();
                    break;
                case WindowState.TRAY:
                    if (mainWindow && !mainWindow.isDestroyed()) mainWindow.close();
                    break;
                case WindowState.EXIT:
                    app.quit();
                    break;
                default:
                    break;
            }
        });

        ipcMain.handle('getConnectionStatus', async () => {
            return ClientSocketService.connectionStatus;
        });

        ipcMain.on('disconnectSocket', () => {
            ClientSocketService.disconnect();
        });

    }
}
