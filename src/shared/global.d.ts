import { WindowState } from './enums';
import { SocketConnection } from './SocketConnection';
import { ApplicationSettings, ClientCredentials } from './classes';

export interface IElectronAPI {
    getClientCredentials: () => Promise<ClientCredentials>,
    setClientCredentials: (clientCredentials: ClientCredentials) => void,
    setWindowState: (windowState: WindowState) => void,
    updateConnectionStatus: (callback: (event: any, connectionStatus: SocketConnection) => void) => void
    getConnectionStatus: () => Promise<SocketConnection>,
    disconnectSocket: () => void,
    getApplicationSettings: () => Promise<ApplicationSettings | null>,
    setApplicationSettings: (applicationSettings: ApplicationSettings) => void,
}

declare global {
    interface Window {
        electronAPI: IElectronAPI;
    }
}

export interface ReactProps {
    children?: any;
}
