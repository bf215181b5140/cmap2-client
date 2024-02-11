import { getFingerprint } from '../util/fingerprint';
import TypedIpcMain from './typedIpcMain';

export class IpcMainController {

    constructor() {
        // Util
        TypedIpcMain.handle('getFingerprint', async () => await getFingerprint());
    }
}
