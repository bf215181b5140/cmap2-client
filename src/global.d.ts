import {SocketConnectionState, WindowState} from "./enums";

export interface IElectronAPI {
    getClientCredentials: () => Promise<ClientCredentials>,
    setClientCredentials: (clientCredentials: ClientCredentials) => void,
    setWindowState: (windowState: WindowState) => void;
}

declare global {
    interface Window {
        electronAPI: IElectronAPI
    }
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

export interface SocketConnectionStatus {
    state: SocketConnectionState;
    message: string;
    description: string | null;
}
