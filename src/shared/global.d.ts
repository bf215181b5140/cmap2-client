import { WindowState } from './enums';
import { SocketConnection } from './SocketConnection';
import { ApplicationSettings, ClientCredentials } from './classes';
import { VrcParameter } from 'cmap2-shared';
import { ToyCommand } from 'lovense';
import { LovenseSettings, LovenseStatus, ToyCommandOscMessage, ToyCommandParameter } from './lovense';

type IpcGetOptions = {
    getClientCredentials: ClientCredentials;
    getConnectionStatus: SocketConnection;
    getApplicationSettings: ApplicationSettings | null;
    getLovenseSettings: LovenseSettings;
    getToyCommandParameters: ToyCommandParameter[];
    getToyCommandOscMessages: ToyCommandOscMessage[];
    getFingerprint: string;
};

type IpcSendOptions = {
    setClientCredentials: ClientCredentials;
    setWindowState: WindowState;
    disconnectSocket: undefined;
    setApplicationSettings: ApplicationSettings;
    forwardOscToRenderer: boolean;
    setLovenseSettings: LovenseSettings;
    getLovenseStatus: undefined;
    lovenseConnect: undefined;
    lovenseDisconnect: undefined;
    sendLovenseToyCommand: ToyCommand;
    setToyCommandParameters: ToyCommandParameter[];
    setToyCommandOscMessages: ToyCommandOscMessage[];
};

type IpcRecieveOptions = {
    updateConnectionStatus: SocketConnection;
    vrcParameter: VrcParameter;
    lovenseStatus: LovenseStatus;
};

export interface IElectronAPI {
    get: <K extends keyof IpcGetOptions>(channel: K) => Promise<IpcGetOptions[K]>,
    send: <K extends keyof IpcSendOptions>(channel: K, data?: IpcSendOptions[K]) => void,
    receive: <K extends keyof IpcRecieveOptions>(channel: K, func: (data: IpcRecieveOptions[K]) => void) => () => void,
    receiveOnce: <K extends keyof IpcRecieveOptions>(channel: K, func: (data: IpcRecieveOptions[K]) => void) => () => void,
    removeAllListeners: (channel: keyof IpcRecieveOptions) => void,
}

declare global {
    interface Window {
        electronAPI: IElectronAPI;
    }
}
