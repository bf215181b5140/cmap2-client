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

        // Util
        TypedIpcMain.handle('getFingerprint', async () => await getFingerprint());
    }
}
