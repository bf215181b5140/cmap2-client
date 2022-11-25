import Store from "electron-store";
import {ClientCredentials} from "../global";

export class ClientStoreService {
    static clientStore = new Store();

    static getClientCredentials(): ClientCredentials | null {
        const username = this.clientStore.get('username');
        const apiKey = this.clientStore.get('apiKey');

        if(username == null || apiKey == null) return null;

        // @ts-ignore
        return { username: username, apiKey: apiKey } as ClientCredentials;
    }

    static setClientCredentials(clientCredentials: ClientCredentials) {
        this.clientStore.set('username', clientCredentials.username);
        this.clientStore.set('apiKey', clientCredentials.apiKey);
    }
}
