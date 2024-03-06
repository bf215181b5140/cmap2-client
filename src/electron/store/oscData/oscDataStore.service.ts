import Store from 'electron-store';
import oscDataDefaults from './defaults';
import TypedIpcMain from '../../ipc/typedIpcMain';

export class OscDataStoreService {
    private static started: boolean = false;
    private static store = new Store({
        name: 'oscData',
        defaults: oscDataDefaults
    });

    public static start() {
        if (this.started) return;

        TypedIpcMain.handle('getVrcOscAvatars', async () => this.store.get('avatars'));
        TypedIpcMain.on('setVrcOscAvatars', (data) => this.store.set('avatars', data));

        this.started = true;
    }
}
