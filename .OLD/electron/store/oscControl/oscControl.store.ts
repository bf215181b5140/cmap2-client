import Store from 'electron-store';
import oscControlDefaults from './defaults';
import TypedIpcMain from '../../ipc/typedIpc.service';

export default class OscControlStore {
    private static started: boolean = false;
    private static store = new Store({
        name: 'oscControl',
        defaults: oscControlDefaults
    });

    public static start() {
        if (this.started) return;

        // LocalTime
        TypedIpcMain.handle('getOscClockSettings', async () => this.store.get('clock'));
        TypedIpcMain.on('setOscClockSettings', (data) => this.store.set('clock', data));

        this.started = true;
    }

    public static getOscClockSettings() {
        return this.store.get('clock');
    }
}
