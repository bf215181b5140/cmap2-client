import Store from 'electron-store';
import { ClientCredentials } from '../../shared/global';

export class ClientStoreService {
    static clientStore = new Store({encryptionKey: "client-settings"});

    static getClientCredentials(): ClientCredentials | null {
        return this.clientStore.get('clientCredentials') as ClientCredentials;
    }

    static setClientCredentials(clientCredentials: ClientCredentials) {
        this.clientStore.set('clientCredentials', clientCredentials);
    }
}
