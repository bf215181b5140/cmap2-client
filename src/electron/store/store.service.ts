import Store from 'electron-store';
import { ClientCredentials } from '../../shared/classes';
import { LovenseSettings, ToyCommandOscMessage, ToyCommandParameter } from '../../shared/lovense';
import { BridgeService } from '../bridge/bridge.service';
import { Settings } from '../../shared/types/settings';
import storeDefaults from './storeDefaults';
import TypedIpcMain from '../ipc/typedIpcMain';

export class StoreService {
    private static clientStore = new Store({
        encryptionKey: 'client-settings',
        defaults: storeDefaults
    });

    constructor() {
        // Client credentials
        TypedIpcMain.handle('getClientCredentials', async () => StoreService.getClientCredentials());
        TypedIpcMain.on('setClientCredentials', (clientCredentials: ClientCredentials) => StoreService.setClientCredentials(clientCredentials));

        // Settings
        TypedIpcMain.handle('getSettings', async () => StoreService.getSettings());
        TypedIpcMain.on('setSettings', (settings) => StoreService.setSettings(settings));

        // Lovense
        TypedIpcMain.handle('getLovenseSettings', async () => StoreService.getLovenseSettings());
        TypedIpcMain.on('setLovenseSettings', (lovenseSettings: LovenseSettings) => StoreService.setLovenseSettings(lovenseSettings));
        TypedIpcMain.handle('getToyCommandParameters', async () => StoreService.getToyCommandParameters());
        TypedIpcMain.on('setToyCommandParameters', (toyCommandParameters: ToyCommandParameter[]) => StoreService.setToyCommandParameters(toyCommandParameters));
        TypedIpcMain.handle('getToyCommandOscMessages', async () => StoreService.getToyCommandOscMessages());
        TypedIpcMain.on('setToyCommandOscMessages', (toyCommandOscMessages: ToyCommandOscMessage[]) => StoreService.setToyCommandOscMessages(toyCommandOscMessages));
    }

    static getClientCredentials(): ClientCredentials {
        return this.clientStore.get('clientCredentials');
    }

    static setClientCredentials(clientCredentials: ClientCredentials) {
        this.clientStore.set('clientCredentials', clientCredentials);
    }

    static getSettings(): Settings {
        return this.clientStore.get('settings');
    }

    static setSettings(settings: Settings) {
        this.clientStore.set('settings', settings);
        BridgeService.emit('settings', settings);
    }

    static getToyCommandParameters(): ToyCommandParameter[] {
        return this.clientStore.get('toyCommandParameters');
    }

    static setToyCommandParameters(toyCommandParameters: ToyCommandParameter[]) {
        this.clientStore.set('toyCommandParameters', toyCommandParameters);
    }

    static getToyCommandOscMessages(): ToyCommandOscMessage[] {
        return this.clientStore.get('toyCommandOscMessages');
    }

    static setToyCommandOscMessages(toyCommandOscMessages: ToyCommandOscMessage[]) {
        this.clientStore.set('toyCommandOscMessages', toyCommandOscMessages);
    }

    static getLovenseSettings(): LovenseSettings {
        return this.clientStore.get('lovenseSettings');
    }

    static setLovenseSettings(lovenseSettings: LovenseSettings) {
        this.clientStore.set('lovenseSettings', lovenseSettings);
    }
}
