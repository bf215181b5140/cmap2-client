import { ClientCredentials } from '../../shared/classes';
import { LovenseSettings, ToyCommandOscMessage, ToyCommandParameter } from '../../shared/lovense';
import { GeneralSettings, Settings, WebsocketSettings } from '../../shared/types/settings';
import storeDefaults from './storeDefaults';
import CmapStore from './cmapStore';
import { IPC } from '../ipc/typedIpc.service';

export class StoreService {
    private static started: boolean = false;
    private static store = new CmapStore<typeof storeDefaults>({
        encryptionKey: 'client-settings',
        defaults: storeDefaults
    });

    public static start() {
        if (this.started) return;

        // Client credentials
        IPC.handle('getClientCredentials', async () => StoreService.getClientCredentials());
        IPC.on('setClientCredentials', (data) => StoreService.setClientCredentials(data));

        // General settings
        IPC.handle('getGeneralSettings', async () => StoreService.getGeneralSettings());
        IPC.on('setGeneralSettings', (data) => StoreService.setGeneralSettings(data));

        // Websocket settings
        IPC.handle('getWebsocketSettings', async () => this.getWebsocketSettings());
        IPC.on('setWebsocketSettings', (data) => this.setWebsocketSettings(data));

        // Lovense
        IPC.handle('getLovenseSettings', async () => StoreService.getLovenseSettings());
        IPC.on('setLovenseSettings', (data) => StoreService.setLovenseSettings(data));
        IPC.handle('getToyCommandParameters', async () => StoreService.getToyCommandParameters());
        IPC.on('setToyCommandParameters', (data) => StoreService.setToyCommandParameters(data));
        IPC.handle('getToyCommandOscMessages', async () => StoreService.getToyCommandOscMessages());
        IPC.on('setToyCommandOscMessages', (data) => StoreService.setToyCommandOscMessages(data));

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
        this.store.set('settings.general', data);
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
}