import { WindowState } from './enums';
import { SocketConnection } from './SocketConnection';
import { ClientCredentials } from './classes';
import { VrcParameter } from 'cmap2-shared';
import { ToyCommand } from 'lovense';
import { LovenseSettings, LovenseStatus, ToyCommandOscMessage, ToyCommandParameter } from './lovense';
import { Settings } from './types/settings';
import { VrcOscAvatar, VrcOscAvatarParameter } from './types/osc';

type IpcGetOptions = {
    getClientCredentials: ClientCredentials | null;
    getConnectionStatus: SocketConnection;
    getSettings: Settings;
    getLovenseSettings: LovenseSettings;
    getToyCommandParameters: ToyCommandParameter[];
    getToyCommandOscMessages: ToyCommandOscMessage[];
    getFingerprint: string;
    getLastOscActivity: number;
    // VrcOscData
    getVrcOscAvatars: VrcOscAvatar[];
};

type IpcSendOptions = {
    setClientCredentials: ClientCredentials;
    setWindowState: WindowState;
    disconnectSocket: undefined;
    setSettings: Settings;
    forwardOscToRenderer: boolean;
    setLovenseSettings: LovenseSettings;
    getLovenseStatus: undefined;
    lovenseConnect: undefined;
    lovenseDisconnect: undefined;
    sendLovenseToyCommand: ToyCommand;
    setToyCommandParameters: ToyCommandParameter[];
    setToyCommandOscMessages: ToyCommandOscMessage[];
    getIsVrchatRunning: undefined;
    // VrcOscData
    setVrcOscAvatars: VrcOscAvatar[];
};

type IpcReceiveOptions = {
    updateConnectionStatus: SocketConnection;
    vrcParameter: VrcParameter;
    lovenseStatus: LovenseStatus;
    isVrchatRunning: boolean | null;
};

export interface IElectronAPI {
    get: <K extends keyof IpcGetOptions>(channel: K) => Promise<IpcGetOptions[K]>,
    send: <K extends keyof IpcSendOptions>(channel: K, data?: IpcSendOptions[K]) => void,
    receive: <K extends keyof IpcReceiveOptions>(channel: K, func: (data: IpcReceiveOptions[K]) => void) => () => void,
    receiveOnce: <K extends keyof IpcReceiveOptions>(channel: K, func: (data: IpcReceiveOptions[K]) => void) => () => void,
    removeAllListeners: (channel: keyof IpcReceiveOptions) => void,
}

declare global {
    interface Window {
        electronAPI: IElectronAPI;
    }
}
