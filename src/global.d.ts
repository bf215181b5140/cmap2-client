export interface IElectronAPI {
    getApiKey: () => Promise<string>,
    setApiKey: (apiKey: string) => void,
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