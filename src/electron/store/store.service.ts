import Store from 'electron-store';
import { ApplicationSettings, ClientCredentials } from '../../shared/classes';
import { LovenseSettings, ToyCommandOscMessage, ToyCommandParameter } from '../../shared/lovense';

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
        return this.clientStore.get('toyCommandParameters') as ToyCommandParameter[] ?? [];
    }

    static setToyCommandParameters(toyCommandParameters: ToyCommandParameter[]) {
        this.clientStore.set('toyCommandParameters', toyCommandParameters);
    }

    static getToyCommandOscMessages(): ToyCommandOscMessage[] {
        return this.clientStore.get('toyCommandOscMessages') as ToyCommandOscMessage[] ?? [];
    }

    static setToyCommandOscMessages(toyCommandOscMessages: ToyCommandOscMessage[]) {
        this.clientStore.set('toyCommandOscMessages', toyCommandOscMessages);
    }

    static getLovenseSettings(): LovenseSettings {
        return this.clientStore.get('lovenseSettings') as LovenseSettings ?? new LovenseSettings();
    }

    static setLovenseSettings(lovenseSettings: LovenseSettings) {
        this.clientStore.set('lovenseSettings', lovenseSettings);
    }
}
