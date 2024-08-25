import { IPC } from '../../ipc/typedIpc.service';
import CmapStore from '../cmapStore';
import { settingsDefaults, StoreSettings } from './settings.model';
import { AppSettings } from '../../../shared/schemas/settings.schema';
import { BRIDGE } from '../../bridge/bridge.service';
import { app } from 'electron';
import { Options } from 'electron-store';

class SettingsStore extends CmapStore<StoreSettings>{

    constructor(options: Options<StoreSettings>) {
        super(options);

        // Credentials
        IPC.handle('getCredentials', async () => this.get('credentials'));
        IPC.on('setAppSettings', (data) => this.set('credentials', data));

        // App settings
        IPC.handle('getAppSettings', async () => this.get('app'));
        IPC.on('setAppSettings', (data) => {
            this.set('app', data);
            app.setLoginItemSettings({ openAtLogin: data.startOnBoot })
        });

        // change window size
        BRIDGE.on('setWindowSize', (data) => this.set('app.windowSize', data));
    }

    public getAppSettings(): AppSettings {
        return this.get('app');
    }
}

export const SETTINGS = new SettingsStore({
    encryptionKey: 'client-settings',
    defaults: settingsDefaults
});
