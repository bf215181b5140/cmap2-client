import { app } from 'electron';
import { ClientSocketService } from '../webSocket/clientSocket.service';
import { StoreService } from '../store/store.service';
import { mainWindow } from '../electron';
import { WindowState } from '../../shared/enums';
import { ClientCredentials } from '../../shared/classes';
import { OscController } from '../osc/osc.controller';
import { LovenseSettings, ToyCommandOscMessage, ToyCommandParameter } from '../../shared/lovense';
import { getFingerprint } from '../util/fingerprint';
import TypedIpcMain from './typedIpcMain';

export class IpcMainService {

    static init() {

        // Client credentials
        TypedIpcMain.handle('getClientCredentials', async () => StoreService.getClientCredentials());
        TypedIpcMain.on('setClientCredentials', (clientCredentials: ClientCredentials) => {
            StoreService.setClientCredentials(clientCredentials);
            ClientSocketService.connect();
        });

        // Settings
        TypedIpcMain.handle('getSettings', async () => StoreService.getSettings());
        TypedIpcMain.on('setSettings', (settings) => {
            const oldSettings = StoreService.getSettings();
            StoreService.setSettings(settings);
            if (oldSettings.oscIp !== settings.oscIp ||
                oldSettings.oscInPort !== settings.oscInPort ||
                oldSettings.oscOutPort !== settings.oscOutPort) {
                OscController.start();
            }
        });

        // Window state
        TypedIpcMain.on('setWindowState', (windowState: WindowState) => {
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

        // Client socket
        TypedIpcMain.handle('getConnectionStatus', async () => ClientSocketService.connectionStatus);
        TypedIpcMain.on('disconnectSocket', () => ClientSocketService.disconnect());

        // OSC
        TypedIpcMain.on('forwardOscToRenderer', (forward: boolean) => OscController.forwardOscToRenderer = forward);

        // Lovense
        TypedIpcMain.handle('getLovenseSettings', async () => StoreService.getLovenseSettings());
        TypedIpcMain.on('setLovenseSettings', (lovenseSettings: LovenseSettings) => StoreService.setLovenseSettings(lovenseSettings));
        TypedIpcMain.handle('getToyCommandParameters', async () => StoreService.getToyCommandParameters());
        TypedIpcMain.on('setToyCommandParameters', (toyCommandParameters: ToyCommandParameter[]) => StoreService.setToyCommandParameters(toyCommandParameters));
        TypedIpcMain.handle('getToyCommandOscMessages', async () => StoreService.getToyCommandOscMessages());
        TypedIpcMain.on('setToyCommandOscMessages', (toyCommandOscMessages: ToyCommandOscMessage[]) => StoreService.setToyCommandOscMessages(toyCommandOscMessages));

        // Util
        TypedIpcMain.handle('getFingerprint', async () => await getFingerprint());
    }
}
