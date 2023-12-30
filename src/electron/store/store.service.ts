import Store from 'electron-store';
import { ApplicationSettings, ClientCredentials } from '../../shared/classes';
import { ToyCommandParameter } from '../../shared/lovense';

export class StoreService {
    private static clientStore = new Store({encryptionKey: "client-settings"});

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

    static getToyCommandParameters(): ToyCommandParameter[] {
        console.log('Store recieved request for toyCommandParameters');
        return this.clientStore.get('toyCommandParameters') as ToyCommandParameter[] ?? [];
    }

    static setToyCommandParameters(toyCommandParameters: ToyCommandParameter[]) {
        this.clientStore.set('toyCommandParameters', toyCommandParameters);
    }
}
