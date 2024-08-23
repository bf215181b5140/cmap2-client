import { WindowSize, WindowState } from '../../shared/enums';

export type IpcGetOptions = {
    getAppVersion: string;
    // getClientCredentials: ClientCredentials | null;
    // getConnectionStatus: WebsocketConnection;
    // getGeneralSettings: GeneralSettings;
    // getWebsocketSettings: WebsocketSettings;
    // getLovenseSettings: LovenseSettings;
    // getToyCommandParameters: ToyCommandParameter[];
    // getToyCommandOscMessages: ToyCommandOscMessage[];
    // getFingerprint: string;
    // getLastOscActivity: number;
    // // Osc status
    // getTrackedParameters: Map<string, boolean | number | string>;
    // // VrcOscData
    // getVrcOscAvatars: VrcOscAvatar[];
    // // Osc control
    // getOscClockSettings: OscClockSettings;
};

export type IpcSendOptions = {
    setWindowState: WindowState;
    setWindowSize: WindowSize;
    // setClientCredentials: ClientCredentials;
    // connectSocket: undefined;
    // disconnectSocket: undefined;
    // setGeneralSettings: GeneralSettings;
    // setWebsocketSettings: WebsocketSettings;
    // setLovenseSettings: LovenseSettings;
    // getLovenseStatus: undefined;
    // lovenseConnect: undefined;
    // lovenseDisconnect: undefined;
    // sendLovenseToyCommand: ToyCommand;
    // setToyCommandParameters: ToyCommandParameter[];
    // setToyCommandOscMessages: ToyCommandOscMessage[];
    // getIsVrchatRunning: undefined;
    // // Osc status
    // setTrackedParameters: Map<string, boolean | number | string>;
    // setTrackedParameter: ClientStateParamDTO;
    // deleteTrackedParameter: ClientStateParamDTO;
    // // VrcOscData
    // setVrcOscAvatars: VrcOscAvatar[];
    // // Osc control
    // setOscClockSettings: OscClockSettings;
    // // Updater
    // checkForUpdates: undefined;
    // startUpdate: string;
};

export type IpcReceiveOptions = {
    // updateConnectionStatus: WebsocketConnection;
    // vrcParameter: VrcParameter;
    // lovenseStatus: LovenseStatus;
    // isVrchatRunning: boolean | null;
    // updateData: UpdateData;
};
