import { app } from 'electron';
import { mainWindow } from '../electron';
import { WindowState } from '../../shared/enums';
import { getFingerprint } from '../util/fingerprint';
import TypedIpcMain from './typedIpcMain';

export class IpcMainService {

    constructor() {
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

        // Util
        TypedIpcMain.handle('getFingerprint', async () => await getFingerprint());
    }
}
