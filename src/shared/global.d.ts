import { WindowState } from './enums';
import { ClientCredentials } from 'cmap2-shared/clientCredentials';
import { ConnectionStatus } from '../shared/ConnectionStatus';

export interface IElectronAPI {
    getClientCredentials: () => Promise<ClientCredentials>,
    setClientCredentials: (clientCredentials: ClientCredentials) => void,
    setWindowState: (windowState: WindowState) => void,
    updateConnectionStatus: (callback: (event: any, connectionStatus: ConnectionStatus) => void) => void
    getConnectionStatus: () => Promise<ConnectionStatus>,
}

declare global {
    interface Window {
        electronAPI: IElectronAPI;
    }
}

export interface ReactProps {
    children?: any;
}
