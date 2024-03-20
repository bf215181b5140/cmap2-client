import Store from 'electron-store';
import { ClientCredentials } from '../../shared/classes';
import { LovenseSettings, ToyCommandOscMessage, ToyCommandParameter } from '../../shared/lovense';
import { Settings, WebsocketSettings } from '../../shared/types/settings';
import storeDefaults from './storeDefaults';
import TypedIpcMain from '../ipc/typedIpcMain';

export class StoreService {
    private static started: boolean = false;
    private static clientStore = new Store({
        encryptionKey: 'client-settings',
        defaults: storeDefaults
    });

    public static start() {
        if (this.started) return;

        // Client credentials
        TypedIpcMain.handle('getClientCredentials', async () => StoreService.getClientCredentials());
        TypedIpcMain.on('setClientCredentials', (clientCredentials: ClientCredentials) => StoreService.setClientCredentials(clientCredentials));

        // Settings
        TypedIpcMain.handle('getSettings', async () => StoreService.getSettings());
        TypedIpcMain.on('setSettings', (settings) => StoreService.setSettings(settings));

        // Websocket settings
        TypedIpcMain.handle('getWebsocketSettings', async () => this.getWebsocketSettings());
        TypedIpcMain.on('setWebsocketSettings', (data) => this.setWebsocketSettings(data));

        // Lovense
        TypedIpcMain.handle('getLovenseSettings', async () => StoreService.getLovenseSettings());
        TypedIpcMain.on('setLovenseSettings', (lovenseSettings: LovenseSettings) => StoreService.setLovenseSettings(lovenseSettings));
        TypedIpcMain.handle('getToyCommandParameters', async () => StoreService.getToyCommandParameters());
        TypedIpcMain.on('setToyCommandParameters', (toyCommandParameters: ToyCommandParameter[]) => StoreService.setToyCommandParameters(toyCommandParameters));
        TypedIpcMain.handle('getToyCommandOscMessages', async () => StoreService.getToyCommandOscMessages());
        TypedIpcMain.on('setToyCommandOscMessages', (toyCommandOscMessages: ToyCommandOscMessage[]) => StoreService.setToyCommandOscMessages(toyCommandOscMessages));

        this.started = true;
    }

    public static getClientCredentials(): ClientCredentials {
        return this.clientStore.get('clientCredentials');
    }

    public static setClientCredentials(clientCredentials: ClientCredentials) {
        this.clientStore.set('clientCredentials', clientCredentials);
    }

    public static getSettings(): Settings {
        return this.clientStore.get('settings', storeDefaults.settings);
    }

    public static setSettings(settings: Settings) {
        this.clientStore.set('settings', settings);
    }

    public static getWebsocketSettings(): WebsocketSettings {
        return this.clientStore.get('settings.websocket', storeDefaults.settings.websocket);
    }

    public static setWebsocketSettings(settings: WebsocketSettings) {
        this.clientStore.set('settings.websocket', settings);
    }

    public static getToyCommandParameters(): ToyCommandParameter[] {
        return this.clientStore.get('toyCommandParameters');
    }

    public static setToyCommandParameters(toyCommandParameters: ToyCommandParameter[]) {
        this.clientStore.set('toyCommandParameters', toyCommandParameters);
    }

    public static getToyCommandOscMessages(): ToyCommandOscMessage[] {
        return this.clientStore.get('toyCommandOscMessages');
    }

    public static setToyCommandOscMessages(toyCommandOscMessages: ToyCommandOscMessage[]) {
        this.clientStore.set('toyCommandOscMessages', toyCommandOscMessages);
    }

    public static getLovenseSettings(): LovenseSettings {
        return this.clientStore.get('lovenseSettings');
    }

    public static setLovenseSettings(lovenseSettings: LovenseSettings) {
        this.clientStore.set('lovenseSettings', lovenseSettings);
    }
}
