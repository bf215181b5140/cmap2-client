import Store from 'electron-store';
import oscControlDefaults from './defaults';
import TypedIpcMain from '../../ipc/typedIpcMain';

export default class OscControlStore {
    private static store = new Store({
        name: 'oscControl',
        defaults: oscControlDefaults
    });

    public static init() {
        // LocalTime
        TypedIpcMain.handle('getOscClockSettings', async () => this.store.get('clock'));
        TypedIpcMain.on('setOscClockSettings', (data) => this.store.set('clock', data));
    }

    public static getOscClockSettings() {
        return this.store.get('clock');
    }
}
