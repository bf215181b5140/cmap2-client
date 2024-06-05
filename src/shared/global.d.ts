import { WindowState } from './enums';
import { WebsocketConnection } from './webSocket';
import { ClientCredentials } from './classes';
import { VrcParameter } from 'cmap2-shared';
import { ToyCommand } from 'lovense';
import { LovenseSettings, LovenseStatus, ToyCommandOscMessage, ToyCommandParameter } from './lovense';
import { GeneralSettings, Settings, WebsocketSettings } from './types/settings';
import { VrcOscAvatar } from './types/osc';
import { OscClockSettings } from '../electron/osc/clock/types';
import { UpdateData } from '../electron/updater/updater.model';

type IpcGetOptions = {
    getAppVersion: string;
    getClientCredentials: ClientCredentials | null;
    getConnectionStatus: WebsocketConnection;
    getGeneralSettings: GeneralSettings;
    getWebsocketSettings: WebsocketSettings;
    getLovenseSettings: LovenseSettings;
    getToyCommandParameters: ToyCommandParameter[];
    getToyCommandOscMessages: ToyCommandOscMessage[];
    getFingerprint: string;
    getLastOscActivity: number;
    // Osc status
    getTrackedParameters: Map<string, boolean | number | string>;
    // VrcOscData
    getVrcOscAvatars: VrcOscAvatar[];
    // Osc control
    getOscClockSettings: OscClockSettings;
};

type IpcSendOptions = {
    setClientCredentials: ClientCredentials;
    setWindowState: WindowState;
    connectSocket: undefined;
    disconnectSocket: undefined;
    setGeneralSettings: GeneralSettings;
    setWebsocketSettings: WebsocketSettings;
    setLovenseSettings: LovenseSettings;
    getLovenseStatus: undefined;
    lovenseConnect: undefined;
    lovenseDisconnect: undefined;
    sendLovenseToyCommand: ToyCommand;
    setToyCommandParameters: ToyCommandParameter[];
    setToyCommandOscMessages: ToyCommandOscMessage[];
    getIsVrchatRunning: undefined;
    // Osc status
    setTrackedParameters: Map<string, boolean | number | string>;
    // VrcOscData
    setVrcOscAvatars: VrcOscAvatar[];
    // Osc control
    setOscClockSettings: OscClockSettings;
    // Updater
    checkForUpdates: undefined;
    startUpdate: string;
};

type IpcReceiveOptions = {
    updateConnectionStatus: WebsocketConnection;
    vrcParameter: VrcParameter;
    lovenseStatus: LovenseStatus;
    isVrchatRunning: boolean | null;
    updateData: UpdateData;
};

export interface IElectronAPI {
    get: <K extends keyof IpcGetOptions>(channel: K) => Promise<IpcGetOptions[K]>;
    send: <K extends keyof IpcSendOptions>(channel: K, data?: IpcSendOptions[K]) => void;
    receive: <K extends keyof IpcReceiveOptions>(channel: K, func: (data: IpcReceiveOptions[K]) => void) => () => void;
    receiveOnce: <K extends keyof IpcReceiveOptions>(channel: K, func: (data: IpcReceiveOptions[K]) => void) => () => void;
    removeAllListeners: (channel: keyof IpcReceiveOptions) => void;
}

declare global {
    interface Window {
        electronAPI: IElectronAPI;
    }
}
