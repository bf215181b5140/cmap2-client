import { ClientCredentials } from '../../../shared/classes';
import { LovenseSettings, ToyCommandOscMessage, ToyCommandParameter } from '../../../shared/lovense';
import { GeneralSettings, Settings, WebsocketSettings } from '../../../shared/store/main';
import mainStoreDefaults from './defaults';
import TypedIpcMain from '../../ipc/typedIpcMain';
import CmapStore from '../cmapStore';
import { RendererSettings } from '../../../shared/store/main';

export class MainStore {
    private static started: boolean = false;
    private static store = new CmapStore<typeof mainStoreDefaults>({
        encryptionKey: 'client-settings',
        defaults: mainStoreDefaults
    });

    public static start() {
        if (this.started) return;

        // Client credentials
        TypedIpcMain.handle('getClientCredentials', async () => MainStore.getClientCredentials());
        TypedIpcMain.on('setClientCredentials', (data) => MainStore.setClientCredentials(data));

        // Settings
        TypedIpcMain.handle('getSettings', async () => MainStore.getSettings());
        TypedIpcMain.on('setSettings', (data) => MainStore.setSettings(data));

        // General settings
        TypedIpcMain.handle('getGeneralSettings', async () => MainStore.getGeneralSettings());
        TypedIpcMain.on('setGeneralSettings', (data) => MainStore.setGeneralSettings(data));

        // Websocket settings
        TypedIpcMain.handle('getWebsocketSettings', async () => this.getWebsocketSettings());
        TypedIpcMain.on('setWebsocketSettings', (data) => this.setWebsocketSettings(data));

        // Lovense
        TypedIpcMain.handle('getLovenseSettings', async () => MainStore.getLovenseSettings());
        TypedIpcMain.on('setLovenseSettings', (data) => MainStore.setLovenseSettings(data));
        TypedIpcMain.handle('getToyCommandParameters', async () => MainStore.getToyCommandParameters());
        TypedIpcMain.on('setToyCommandParameters', (data) => MainStore.setToyCommandParameters(data));
        TypedIpcMain.handle('getToyCommandOscMessages', async () => MainStore.getToyCommandOscMessages());
        TypedIpcMain.on('setToyCommandOscMessages', (data) => MainStore.setToyCommandOscMessages(data));

        // Renderer settings
        TypedIpcMain.handle('getRendererSettings', async () => MainStore.getRendererSettings());
        TypedIpcMain.on('setRendererSettings', (data) => MainStore.setRendererSettings(data));

        this.started = true;
    }

    public static getClientCredentials() {
        return this.store.get('clientCredentials');
    }

    public static setClientCredentials(clientCredentials: ClientCredentials) {
        this.store.set('clientCredentials', clientCredentials);
    }

    public static getSettings() {
        return this.store.get('settings');
    }

    public static setSettings(data: Settings) {
        this.store.set('settings', data);
    }

    public static getGeneralSettings() {
        return this.store.get('settings').general;
    }

    public static setGeneralSettings(data: GeneralSettings) {
        this.store.set('settings.websocket', data);
    }

    public static getWebsocketSettings() {
        return this.store.get('settings').websocket;
    }

    public static setWebsocketSettings(data: WebsocketSettings) {
        this.store.set('settings.websocket', data);
    }

    public static getToyCommandParameters() {
        return this.store.get('lovense').toyCommandParameter;
    }

    public static setToyCommandParameters(data: ToyCommandParameter[]) {
        this.store.set('lovense.toyCommandParameter', data);
    }

    public static getToyCommandOscMessages() {
        return this.store.get('lovense').toyCommandOscMessage;
    }

    public static setToyCommandOscMessages(data: ToyCommandOscMessage[]) {
        this.store.set('lovense.toyCommandOscMessage', data);
    }

    public static getLovenseSettings() {
        return this.store.get('lovense').settings;
    }

    public static setLovenseSettings(data: LovenseSettings) {
        this.store.set('lovense.settings', data);
    }

    public static getRendererSettings() {
        return this.store.get('renderer');
    }

    public static setRendererSettings(data: RendererSettings) {
        this.store.set('renderer', data);
    }
}
