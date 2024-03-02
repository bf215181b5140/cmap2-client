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
        TypedIpcMain.handle('getLocalTimeSettings', async () => this.store.get('localTime'));
        TypedIpcMain.on('setLocalTimeSettings', (data) => this.store.set('localTime', data));
    }

    public static getLocalTimeSettings() {
        return this.store.get('localTime');
    }
}
