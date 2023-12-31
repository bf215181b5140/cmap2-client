import { WindowState } from './enums';
import { SocketConnection } from './SocketConnection';
import { ApplicationSettings, ClientCredentials } from './classes';
import { VrcParameter } from 'cmap2-shared';

export interface IElectronAPI {
    getClientCredentials: () => Promise<ClientCredentials>,
    setClientCredentials: (clientCredentials: ClientCredentials) => void,
    setWindowState: (windowState: WindowState) => void,
    updateConnectionStatus: (callback: (event: any, connectionStatus: SocketConnection) => void) => void
    getConnectionStatus: () => Promise<SocketConnection>,
    disconnectSocket: () => void,
    getApplicationSettings: () => Promise<ApplicationSettings | null>,
    setApplicationSettings: (applicationSettings: ApplicationSettings) => void,
    forwardOscToRenderer: (forward: boolean) => void,
    vrcParameter: (callback: (event: any, message: VrcParameter) => void) => void,
    // Util
    getFingerprint: () => Promise<string>,
}

declare global {
    interface Window {
        electronAPI: IElectronAPI;
    }
}
