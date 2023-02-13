import Store from 'electron-store';
import { ClientCredentials } from 'cmap2-shared';

export class ClientStoreService {
    static clientStore = new Store({encryptionKey: "cmap2-client-settingsnp"});

    static getClientCredentials(): ClientCredentials | null {
        return this.clientStore.get('clientCredentials') as ClientCredentials;
    }

    static setClientCredentials(clientCredentials: ClientCredentials) {
        this.clientStore.set('clientCredentials', clientCredentials);
    }
}
