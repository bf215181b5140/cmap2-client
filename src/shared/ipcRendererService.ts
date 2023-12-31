import { app, ipcMain, IpcMainEvent, IpcMainInvokeEvent } from 'electron';
import { ClientSocketService } from '../electron/webSocket/clientSocket.service';
import { StoreService } from '../electron/store/store.service';
import { mainWindow } from '../electron/electron';
import { WindowState } from './enums';
import { ApplicationSettings, ClientCredentials } from './classes';
import { OscController } from '../electron/osc/osc.controller';
import { ToyCommandOscMessage, ToyCommandParameter } from './lovense';
import { getFingerprint } from '../electron/util/fingerprint';

export class IpcRendererService {

    static init() {

        ipcMain.handle('getClientCredentials', async () => {
            return StoreService.getClientCredentials();
        });

        ipcMain.on('setClientCredentials', (event: IpcMainEvent, clientCredentials: ClientCredentials) => {
            StoreService.setClientCredentials(clientCredentials);
            ClientSocketService.connect();
        });

        ipcMain.handle('getApplicationSettings', async () => {
            return StoreService.getApplicationSettings();
        });

        ipcMain.on('setApplicationSettings', (event: IpcMainEvent, appSettings: ApplicationSettings) => {
            const oldSettings = StoreService.getApplicationSettings();
            StoreService.setApplicationSettings(appSettings);
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

        ipcMain.handle('getToyCommandParameters', async () => {
            console.log('IpcRendererService recieved request for toyCommandParameters');
            return StoreService.getToyCommandParameters();
        });

        ipcMain.on('setToyCommandParameters', (_: IpcMainEvent, toyCommandParameters: ToyCommandParameter[]) => {
            console.log('IpcRendererService recieved toyCommandParameters');
            StoreService.setToyCommandParameters(toyCommandParameters);
        });

        ipcMain.handle('getToyCommandOscMessages', async () => {
            console.log('IpcRendererService recieved request for toyCommandOscMessages');
            return StoreService.getToyCommandOscMessages();
        });

        ipcMain.on('setToyCommandOscMessages', (_: IpcMainEvent, toyCommandOscMessages: ToyCommandOscMessage[]) => {
            console.log('IpcRendererService recieved toyCommandOscMessages');
            StoreService.setToyCommandOscMessages(toyCommandOscMessages);
        });

        // Util
        ipcMain.handle('getFingerprint', async () => await getFingerprint());

    }
}
