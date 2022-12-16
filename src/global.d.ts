import {SocketConnectionState, WindowState} from "./enums";
import { IpcRendererEvent } from 'electron';

export interface IElectronAPI {
    getClientCredentials: () => Promise<ClientCredentials>,
    setClientCredentials: (clientCredentials: ClientCredentials) => void,
    setWindowState: (windowState: WindowState) => void,
    updateConnectionStatus: (callback: (event: any, connectionStatus: SocketConnectionStatus) => void) => void
    getConnectionStatus: () => Promise<SocketConnectionStatus>,
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

export interface ReactProps {
    children?: any;
}

export interface ClientData {
    username: string;
    displayName: string;
    url: string;
    profilePicture: any;
    description: string;
    hidden: boolean;

    avatars: Avatar[];
}

export interface Avatar {
    avatarId: number;
    avatar: string;
}
