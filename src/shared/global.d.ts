import { WindowState } from './enums';
import { SocketConnection } from './SocketConnection';
import { ApplicationSettings, ClientCredentials } from './classes';
import { VrcParameter } from 'cmap2-shared';
import { LovenseStatus, ToyCommand } from 'lovense';

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
    // Lovense
    getLovenseStatus: () => Promise<LovenseStatus>,
    lovenseStatus: (callback: (event: any, lovenseStatus: LovenseStatus) => void) => void,
    lovenseQRUrl: (callback: (event: any, message: string) => void) => void,
    lovenseConnect: () => void,
    lovenseDisconnect: () => void,
    sendLovenseToyCommand: (toyCommand: ToyCommand) => void,
}

declare global {
    interface Window {
        electronAPI: IElectronAPI;
    }
}
