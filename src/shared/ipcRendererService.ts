import { app, ipcMain, IpcMainEvent, IpcMainInvokeEvent } from 'electron';
import { ClientSocketService } from '../electron/webSocket/clientSocket.service';
import { ClientStoreService } from '../electron/util/clientStore.service';
import { mainWindow } from '../electron/electron';
import { WindowState } from './enums';
import { ApplicationSettings, ClientCredentials } from './classes';
import { OscController } from '../electron/osc/osc.controller';
import { getFingerprint } from '../electron/util/fingerprint';

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
                    OscController.start();
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

        ipcMain.on('forwardOscToRenderer', (event: IpcMainEvent, forward: boolean) => {
            OscController.forwardOscToRenderer = forward;
        });

        // Util
        ipcMain.handle('getFingerprint', async () => await getFingerprint());

    }
}
