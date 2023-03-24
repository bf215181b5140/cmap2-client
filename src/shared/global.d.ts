import { WindowState } from './enums';
import { SocketConnection } from './SocketConnection';

export interface IElectronAPI {
    getClientCredentials: () => Promise<ClientCredentials>,
    setClientCredentials: (clientCredentials: ClientCredentials) => void,
    setWindowState: (windowState: WindowState) => void,
    updateConnectionStatus: (callback: (event: any, connectionStatus: SocketConnection) => void) => void
    getConnectionStatus: () => Promise<SocketConnection>,
    disconnectSocket: () => void,
}

declare global {
    interface Window {
        electronAPI: IElectronAPI;
    }
}

export interface ReactProps {
    children?: any;
}

export class ClientCredentials {
    serverUrl: string = '';
    username: string = '';
    password: string = '';
    apiToken: string | undefined | null;
    autoLogin: boolean = false;
}
