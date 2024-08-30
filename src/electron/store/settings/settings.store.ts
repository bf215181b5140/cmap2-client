import { IPC } from '../../ipc/typedIpc.service';
import CmapStore from '../cmapStore';
import { settingsStoreDefaults, SettingsStoreData } from './settings.model';
import { BRIDGE } from '../../bridge/bridge.service';
import { app } from 'electron';

class SettingsStore extends CmapStore<SettingsStoreData>{

    constructor() {
        super({
            name: 'settings',
            defaults: settingsStoreDefaults
        });

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
}

export const SETTINGS = new SettingsStore();
