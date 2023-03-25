import Store from 'electron-store';
import { ApplicationSettings, ClientCredentials } from '../../shared/classes';

export class ClientStoreService {
    static clientStore = new Store({encryptionKey: "client-settings"});

    static getClientCredentials(): ClientCredentials | null {
        return this.clientStore.get('clientCredentials') as ClientCredentials;
    }

    static setClientCredentials(clientCredentials: ClientCredentials) {
        this.clientStore.set('clientCredentials', clientCredentials);
    }

    static getApplicationSettings(): ApplicationSettings | null {
        return this.clientStore.get('settings') as ApplicationSettings;
    }

    static setApplicationSettings(applicationSettings: ApplicationSettings) {
        this.clientStore.set('settings', applicationSettings);
    }
}
