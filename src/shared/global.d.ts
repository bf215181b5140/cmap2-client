import { WindowState } from './enums';
import { ClientCredentials } from 'cmap2-shared';
import { SocketConnectionStatus } from './SocketConnectionStatus';

export interface IElectronAPI {
    getClientCredentials: () => Promise<ClientCredentials>,
    setClientCredentials: (clientCredentials: ClientCredentials) => void,
    setWindowState: (windowState: WindowState) => void,
    updateConnectionStatus: (callback: (event: any, connectionStatus: SocketConnectionStatus) => void) => void
    getConnectionStatus: () => Promise<SocketConnectionStatus>,
}

declare global {
    interface Window {
        electronAPI: IElectronAPI;
    }
}

export interface ReactProps {
    children?: any;
}
