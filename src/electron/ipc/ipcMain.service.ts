import { getFingerprint } from '../util/fingerprint';
import TypedIpcMain from './typedIpcMain';

export class IpcMainService {

    constructor() {
        // Util
        TypedIpcMain.handle('getFingerprint', async () => await getFingerprint());
    }
}
