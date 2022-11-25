export interface IElectronAPI {
    getClientCredentials: () => Promise<ClientCredentials>,
    setClientCredentials: (clientCredentials: ClientCredentials) => void,
}

declare global {
    interface Window {
        electronAPI: IElectronAPI
    }
}

export enum ConnectionStatus {
    CONNECTED,
    RECONNECTING,
    OFFLINE
}

export interface ClientCredentials {
    username: string;
    apiKey: string;
}

export interface OscMessage {
    oscType: string;
    address: string;
    args: [boolean | number | string];
}